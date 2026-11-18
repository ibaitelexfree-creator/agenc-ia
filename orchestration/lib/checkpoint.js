import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { canonicalizeJson, computePayloadHash } from './canonical.js';
import * as migration001 from './migrations/001_v3_execution_outbox.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'v3_orchestration.sqlite');
const db = new Database(dbPath);

// Enforce WAL, Synchronous, and Foreign Keys on every connection
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Initialize base schema if not present
db.exec(`
  CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    plan_json TEXT,
    architect_response_raw TEXT,
    status TEXT NOT NULL,
    error_message TEXT,
    execution_time_ms INTEGER,
    
    -- Campos Fase 3: BUILDER
    build_artifacts_path TEXT,
    build_execution_time_ms INTEGER,
    build_error_message TEXT,
    plan_hash TEXT,
    
    -- Campos Fase 4: AUDITOR
    audit_score INTEGER,
    audit_feedback TEXT,
    audit_execution_time_ms INTEGER,
    tamper_detected BOOLEAN DEFAULT 0,
    
    -- Campos Fase 5: POLICY Y EJECUCIÓN
    execution_authorized_at DATETIME,
    execution_policy_version TEXT,
    execution_signature_hash TEXT,
    
    created_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')),
    updated_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')),
    
    -- Replay tracking
    replay_count INTEGER DEFAULT 0,
    last_replay_at DATETIME
  );
  
  CREATE INDEX IF NOT EXISTS idx_missions_status ON missions (status);
  CREATE INDEX IF NOT EXISTS idx_missions_plan_hash ON missions (plan_hash);

  CREATE TABLE IF NOT EXISTS semantic_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT,
    event_type TEXT,
    details TEXT,
    created_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
  );
  CREATE INDEX IF NOT EXISTS idx_semantic_type ON semantic_logs (event_type);
`);

// Run versioned migrations safely
export function runMigrations(dbInstance = db) {
  dbInstance.pragma('foreign_keys = ON');
  migration001.up(dbInstance);
}

runMigrations(db);

export const missions = {
  create: db.transaction((id, prompt) => {
    const stmt = db.prepare('INSERT INTO missions (id, prompt, status) VALUES (?, ?, ?)');
    return stmt.run(id, prompt, 'INIT');
  }),

  updateArchitectResult: db.transaction((id, status, data = {}) => {
    const { planJson = null, rawResponse = null, errorMessage = null, executionTime = null, planHash = null } = data;
    const stmt = db.prepare(`
      UPDATE missions 
      SET status = ?, plan_json = ?, architect_response_raw = ?, error_message = ?, execution_time_ms = ?, plan_hash = ?, updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
      WHERE id = ?
    `);
    return stmt.run(status, planJson ? JSON.stringify(planJson) : null, rawResponse ? JSON.stringify(rawResponse) : null, errorMessage, executionTime, planHash, id);
  }),

  updateBuilderResult: db.transaction((id, status, data = {}) => {
    const { artifactsPath = null, executionTime = null, errorMessage = null } = data;
    const stmt = db.prepare(`
      UPDATE missions 
      SET status = ?, build_artifacts_path = ?, build_execution_time_ms = ?, build_error_message = ?, updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
      WHERE id = ?
    `);
    return stmt.run(status, artifactsPath, executionTime, errorMessage, id);
  }),

  updateAuditResult: db.transaction((id, status, data = {}) => {
    const { score = null, feedback = null, executionTime = null, tamperDetected = false } = data;
    const stmt = db.prepare(`
      UPDATE missions 
      SET status = ?, audit_score = ?, audit_feedback = ?, audit_execution_time_ms = ?, tamper_detected = ?, updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
      WHERE id = ?
    `);
    return stmt.run(status, score, feedback ? JSON.stringify(feedback) : null, executionTime, tamperDetected ? 1 : 0, id);
  }),

  /**
   * Authorize mission execution atomically.
   * Immediate transaction performs:
   * 1. Read authoritative mission state.
   * 2. Assert existence and READY_FOR_EXECUTION status.
   * 3. Authoritative policy check (audit_score >= 90, tamper_detected == 0).
   * 4. Build canonical JSON payload and compute payload_hash.
   * 5. Conditional SQL update to DISPATCH_PENDING (assert changes === 1).
   * 6. Insert into execution_outbox (status PENDING).
   * 
   * If any step fails, the entire transaction rolls back.
   */
  authorizeMissionExecution: db.transaction((id, options = {}) => {
    const { policyVersion = 'v3.0.0', requestedAttemptId = null } = options;
    const mission = db.prepare('SELECT * FROM missions WHERE id = ?').get(id);

    if (!mission) {
      const err = new Error(`Mission ${id} not found`);
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (mission.status !== 'READY_FOR_EXECUTION') {
      const err = new Error(`Cannot authorize mission in status ${mission.status}. Must be READY_FOR_EXECUTION.`);
      err.code = 'CONFLICT';
      err.currentStatus = mission.status;
      throw err;
    }

    // Authoritative policy verification
    if (mission.audit_score === null || mission.audit_score === undefined || mission.audit_score < 90) {
      const err = new Error(`Policy Rejection: audit_score must be >= 90 (current: ${mission.audit_score})`);
      err.code = 'POLICY_REJECTED';
      err.audit_score = mission.audit_score;
      throw err;
    }

    if (mission.tamper_detected) {
      const err = new Error('Policy Rejection: tamper_detected flag is true');
      err.code = 'POLICY_REJECTED';
      throw err;
    }

    // Build immutable canonical execution payload
    const executionAttemptId = requestedAttemptId || crypto.randomUUID();
    const authorizedAt = new Date().toISOString();

    let manifestData = {};
    if (mission.build_artifacts_path) {
      try {
        const manifestPath = path.join(mission.build_artifacts_path, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        }
      } catch (e) {
        // Fallback manifest if unreadable
        manifestData = { error: 'Manifest unreadable', path: mission.build_artifacts_path };
      }
    }

    const payloadObj = {
      audit_score: mission.audit_score,
      authorized_at: authorizedAt,
      correlation_id: mission.id,
      execution_attempt_id: executionAttemptId,
      manifest: manifestData,
      plan_hash: mission.plan_hash || null,
      plan_json: mission.plan_json ? JSON.parse(mission.plan_json) : null,
      policy_version: policyVersion
    };

    const payloadJson = canonicalizeJson(payloadObj);
    const payloadHash = computePayloadHash(payloadJson);

    // Conditional atomic update
    const updateStmt = db.prepare(`
      UPDATE missions 
      SET status = 'DISPATCH_PENDING',
          execution_authorized_at = ?,
          execution_policy_version = ?,
          execution_signature_hash = ?,
          updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
      WHERE id = ? AND status = 'READY_FOR_EXECUTION'
    `);

    const updateInfo = updateStmt.run(authorizedAt, policyVersion, payloadHash, id);

    if (updateInfo.changes !== 1) {
      const err = new Error(`Concurrent modification conflict for mission ${id}`);
      err.code = 'CONFLICT';
      throw err;
    }

    // Insert outbox record in same transaction
    const outboxStmt = db.prepare(`
      INSERT INTO execution_outbox (
        execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version, attempt_number
      ) VALUES (?, ?, 'PENDING', ?, ?, ?, 1)
    `);

    outboxStmt.run(executionAttemptId, id, payloadJson, payloadHash, policyVersion);

    return {
      mission_id: id,
      status: 'DISPATCH_PENDING',
      execution_attempt_id: executionAttemptId,
      payload_hash: payloadHash,
      authorized_at: authorizedAt,
      policy_version: policyVersion
    };
  }),

  /**
   * Phase 2 of policy rejection: record rejection conditionally outside authorization transaction.
   * Only mutates status if mission is currently in READY_FOR_EXECUTION.
   */
  recordPolicyRejection: db.transaction((id, reason = 'Policy rejected') => {
    const stmt = db.prepare(`
      UPDATE missions 
      SET status = 'POLICY_REJECTED',
          error_message = ?,
          updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
      WHERE id = ? AND status = 'READY_FOR_EXECUTION'
    `);
    const info = stmt.run(reason, id);
    return { recorded: info.changes === 1 };
  }),

  updateStatus: db.transaction((id, status) => {
    const stmt = db.prepare(`UPDATE missions SET status = ?, updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')) WHERE id = ?`);
    return stmt.run(status, id);
  }),

  recordReplay: db.transaction((id) => {
    const stmt = db.prepare(`
      UPDATE missions 
      SET replay_count = replay_count + 1, 
          last_replay_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')),
          updated_at = (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')) 
      WHERE id = ?
    `);
    return stmt.run(id);
  }),

  get: (id) => db.prepare('SELECT * FROM missions WHERE id = ?').get(id),

  getByHash: (hash) => db.prepare("SELECT * FROM missions WHERE plan_hash = ? AND status = 'READY_FOR_EXECUTION'").get(hash),

  listByStatus: (status) => db.prepare('SELECT * FROM missions WHERE status = ? ORDER BY created_at DESC').all(status),

  logSemantic: db.transaction((jobId, eventType, details = null) => {
    const stmt = db.prepare('INSERT INTO semantic_logs (job_id, event_type, details) VALUES (?, ?, ?)');
    return stmt.run(jobId, eventType, details ? JSON.stringify(details) : null);
  }),

  getTelemetryMetrics: () => {
    const scoreStats = db.prepare(`
        SELECT 
            AVG(audit_score) as avg24h,
            COUNT(*) as total_scored
        FROM missions 
        WHERE audit_score IS NOT NULL 
        AND created_at >= datetime('now', '-24 hours')
    `).get();

    const ma20Rows = db.prepare(`
        SELECT audit_score 
        FROM missions 
        WHERE audit_score IS NOT NULL 
        ORDER BY created_at DESC 
        LIMIT 20
    `).all();
    const ma20 = ma20Rows.length ? ma20Rows.reduce((acc, row) => acc + row.audit_score, 0) / ma20Rows.length : 0;

    const tamperStats = db.prepare(`
        SELECT COUNT(*) as tamper_count
        FROM missions
        WHERE tamper_detected = 1
        AND created_at >= datetime('now', '-24 hours')
    `).get();

    const jobStatsRows = db.prepare(`
        SELECT status, COUNT(*) as count
        FROM missions
        WHERE created_at >= datetime('now', '-24 hours')
        GROUP BY status
    `).all();

    const jobCounts = {
      total_24h: 0,
      audit_failed: 0,
      gateway_degraded: 0,
      execution_triggered: 0,
      ready_for_execution: 0,
      dispatch_pending: 0
    };

    jobStatsRows.forEach(row => {
      jobCounts.total_24h += row.count;
      if (row.status === 'AUDIT_FAILED') jobCounts.audit_failed = row.count;
      if (row.status === 'GATEWAY_DEGRADED') jobCounts.gateway_degraded = row.count;
      if (row.status === 'EXECUTION_TRIGGERED') jobCounts.execution_triggered = row.count;
      if (row.status === 'READY_FOR_EXECUTION') jobCounts.ready_for_execution = row.count;
      if (row.status === 'DISPATCH_PENDING') jobCounts.dispatch_pending = row.count;
    });

    return {
      avg24h: scoreStats.avg24h || 0,
      ma20,
      ma20Scores: ma20Rows.map(r => r.audit_score),
      tamper24h: tamperStats.tamper_count || 0,
      jobCounts,
      replays24h: db.prepare("SELECT SUM(replay_count) as total FROM missions WHERE created_at >= datetime('now', '-24 hours')").get().total || 0,
      semanticStats: db.prepare(`
          SELECT event_type, COUNT(*) as count 
          FROM semantic_logs 
          WHERE created_at >= datetime('now', '-24 hours') 
          GROUP BY event_type
      `).all()
    };
  }
};

export const outbox = {
  get: (executionAttemptId) => db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(executionAttemptId),
  getByMission: (missionId) => db.prepare('SELECT * FROM execution_outbox WHERE mission_id = ? ORDER BY created_at DESC').all(missionId),
  list: (status = null) => {
    if (status) {
      return db.prepare('SELECT * FROM execution_outbox WHERE status = ? ORDER BY created_at ASC').all(status);
    }
    return db.prepare('SELECT * FROM execution_outbox ORDER BY created_at DESC').all();
  }
};

export default db;
