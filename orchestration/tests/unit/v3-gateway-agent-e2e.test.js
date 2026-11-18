import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

import { createGatewayApp } from '../../gateway/gateway-server.js';
import { canonicalizeJson, computePayloadHash } from '../../lib/canonical.js';
import * as migration001 from '../../lib/migrations/001_v3_execution_outbox.js';
import { OutboxDispatcher } from '../../lib/outbox-dispatcher.js';

const TEST_PSK = '0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.INTERNAL_SERVICE_PSK = TEST_PSK;

function createTestDatabase() {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-e2e-test-'));
    const dbPath = path.join(tmpDir, 'test_orchestration.sqlite');
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    db.exec("CREATE TABLE missions (id TEXT PRIMARY KEY, prompt TEXT NOT NULL, plan_json TEXT, architect_response_raw TEXT, status TEXT NOT NULL, error_message TEXT, execution_time_ms INTEGER, build_artifacts_path TEXT, build_execution_time_ms INTEGER, build_error_message TEXT, plan_hash TEXT, audit_score INTEGER, audit_feedback TEXT, audit_execution_time_ms INTEGER, tamper_detected BOOLEAN DEFAULT 0, execution_authorized_at DATETIME, execution_policy_version TEXT, execution_signature_hash TEXT, created_at DATETIME, updated_at DATETIME, replay_count INTEGER DEFAULT 0, last_replay_at DATETIME); CREATE TABLE semantic_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, job_id TEXT, event_type TEXT, details TEXT, created_at DATETIME);");

    migration001.up(db);
    return { db, tmpDir };
}

function startGateway(options = {}) {
    return new Promise((resolve) => {
        const app = createGatewayApp({
            lmStudioUrl: 'http://127.0.0.1:1234',
            defaultTimeoutMs: 60000,
            maxConcurrency: 2,
            requireAuth: true,
            ...options
        });
        const server = http.createServer(app);
        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            resolve({ server, port, url: 'http://127.0.0.1:' + port });
        });
    });
}

function stopServer(server) {
    return new Promise((resolve) => server.close(resolve));
}

test('V8.32.47 Full Cycle: V3 Authorization -> Outbox -> Dispatcher -> Gateway -> LM Studio -> V3 Result', async (t) => {
    const { db, tmpDir } = createTestDatabase();
    const gateway = await startGateway();

    t.after(async () => {
        await stopServer(gateway.server);
        db.close();
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    const dispatcher = new OutboxDispatcher(db, {
        gatewayUrl: gateway.url,
        internalPsk: TEST_PSK,
        model: 'local-model'
    });

    let missionId = 'mission-v3-e2e-001';
    let executionAttemptId = 'attempt-v3-e2e-001';

    await t.test('1. Authorize task in V3 and verify execution_outbox staging', () => {
        db.prepare("INSERT INTO missions (id, prompt, status, audit_score, tamper_detected) VALUES (?, ?, 'READY_FOR_EXECUTION', 98, 0)").run(missionId, 'Responde exactamente: V3_AGENT_EXECUTION_OK_2026');

        const payloadObj = {
            audit_score: 98,
            authorized_at: new Date().toISOString(),
            correlation_id: missionId,
            execution_attempt_id: executionAttemptId,
            manifest: {},
            plan_hash: null,
            plan_json: null,
            policy_version: 'v3.0.0'
        };
        const payloadJson = canonicalizeJson(payloadObj);
        const payloadHash = computePayloadHash(payloadJson);

        const authTx = db.transaction(() => {
            db.prepare("UPDATE missions SET status = 'DISPATCH_PENDING', execution_authorized_at = ?, execution_policy_version = 'v3.0.0', execution_signature_hash = ? WHERE id = ? AND status = 'READY_FOR_EXECUTION'").run(payloadObj.authorized_at, payloadHash, missionId);
            db.prepare("INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version, attempt_number) VALUES (?, ?, 'PENDING', ?, ?, 'v3.0.0', 1)").run(executionAttemptId, missionId, payloadJson, payloadHash);
        });

        authTx();

        const missionRow = db.prepare('SELECT * FROM missions WHERE id = ?').get(missionId);
        const outboxRow = db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(executionAttemptId);

        assert.equal(missionRow.status, 'DISPATCH_PENDING');
        assert.equal(outboxRow.status, 'PENDING');
        assert.equal(outboxRow.payload_hash, payloadHash);
    });

    await t.test('2. Dispatcher runs LocalResearchAgent -> Gateway -> LM Studio -> commits COMPLETED', async () => {
        const dispatchResult = await dispatcher.dispatchAttempt(executionAttemptId);

        assert.equal(dispatchResult.status, 'COMPLETED');
        assert.equal(dispatchResult.mission_id, missionId);

        const outboxFinal = db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(executionAttemptId);
        assert.equal(outboxFinal.status, 'ACKNOWLEDGED');

        const missionFinal = db.prepare('SELECT * FROM missions WHERE id = ?').get(missionId);
        assert.equal(missionFinal.status, 'COMPLETED');
        assert.ok(dispatchResult.result.result_text.includes('V3_AGENT_EXECUTION_OK_2026'));
    });

    await t.test('3. Idempotency: Dispatching already ACKNOWLEDGED attempt throws INVALID_STATE', async () => {
        try {
            await dispatcher.dispatchAttempt(executionAttemptId);
            assert.fail('Should fail');
        } catch (err) {
            assert.equal(err.code, 'INVALID_STATE');
            assert.equal(err.currentStatus, 'ACKNOWLEDGED');
        }
    });


    // 4. Cryptographic Tamper Protection
    await t.test('4. Security: Payload hash tampering triggers TERMINAL and TAMPER_DETECTED', async () => {
        const tamperMissionId = 'mission-tamper-002';
        const tamperAttemptId = 'attempt-tamper-002';

        db.prepare('INSERT INTO missions (id, prompt, status, audit_score, tamper_detected) VALUES (?, ?, ?, ?, ?)').run(tamperMissionId, 'Test tamper', 'DISPATCH_PENDING', 95, 0);
        db.prepare('INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version, attempt_number) VALUES (?, ?, ?, ?, ?, ?, ?)').run(tamperAttemptId, tamperMissionId, 'PENDING', JSON.stringify({ prompt: 'malicious' }), 'invalid-hash-here', 'v3.0.0', 1);

        try {
            await dispatcher.dispatchAttempt(tamperAttemptId);
            assert.fail('Should abort on hash mismatch');
        } catch (err) {
            assert.equal(err.code, 'HASH_MISMATCH');
        }

        const tamperedOutbox = db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(tamperAttemptId);
        assert.equal(tamperedOutbox.status, 'TERMINAL');

        const tamperedMission = db.prepare('SELECT * FROM missions WHERE id = ?').get(tamperMissionId);
        assert.equal(tamperedMission.status, 'TAMPER_DETECTED');
    });

    // 5. Failure Mode: Unreachable Gateway increments attempt_number and keeps PENDING
    await t.test('5. Failure Mode: Unreachable Gateway increments attempt_number and keeps PENDING', async () => {
        const unreachableDispatcher = new OutboxDispatcher(db, {
            gatewayUrl: 'http://127.0.0.1:19998',
            internalPsk: TEST_PSK,
            maxRetries: 3
        });

        const retryMissionId = 'mission-retry-003';
        const retryAttemptId = 'attempt-retry-003';

        const payloadObj = { prompt: 'retry-test' };
        const payloadJson = canonicalizeJson(payloadObj);
        const payloadHash = computePayloadHash(payloadJson);

        db.prepare('INSERT INTO missions (id, prompt, status, audit_score, tamper_detected) VALUES (?, ?, ?, ?, ?)').run(retryMissionId, 'retry-test', 'DISPATCH_PENDING', 92, 0);
        db.prepare('INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version, attempt_number) VALUES (?, ?, ?, ?, ?, ?, ?)').run(retryAttemptId, retryMissionId, 'PENDING', payloadJson, payloadHash, 'v3.0.0', 1);

        const res = await unreachableDispatcher.dispatchAttempt(retryAttemptId);
        assert.equal(res.status, 'RETRY_SCHEDULED');
        assert.equal(res.attempt_number, 2);

        const outboxRow = db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(retryAttemptId);
        assert.equal(outboxRow.status, 'PENDING');
        assert.equal(outboxRow.attempt_number, 2);
    });

    // 6. Failure Mode: Max retries exhausted transitions to TERMINAL and FAILED_DISPATCH
    await t.test('6. Failure Mode: Max retries exhausted transitions to TERMINAL and FAILED_DISPATCH', async () => {
        const strictDispatcher = new OutboxDispatcher(db, {
            gatewayUrl: 'http://127.0.0.1:19998',
            internalPsk: TEST_PSK,
            maxRetries: 2
        });

        const termMissionId = 'mission-term-004';
        const termAttemptId = 'attempt-term-004';

        const payloadObj = { prompt: 'terminal-test' };
        const payloadJson = canonicalizeJson(payloadObj);
        const payloadHash = computePayloadHash(payloadJson);

        db.prepare('INSERT INTO missions (id, prompt, status, audit_score, tamper_detected) VALUES (?, ?, ?, ?, ?)').run(termMissionId, 'terminal-test', 'DISPATCH_PENDING', 92, 0);
        db.prepare('INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version, attempt_number) VALUES (?, ?, ?, ?, ?, ?, ?)').run(termAttemptId, termMissionId, 'PENDING', payloadJson, payloadHash, 'v3.0.0', 2);

        const res = await strictDispatcher.dispatchAttempt(termAttemptId);
        assert.equal(res.status, 'TERMINAL');

        const outboxRow = db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(termAttemptId);
        assert.equal(outboxRow.status, 'TERMINAL');
        assert.ok(outboxRow.terminal_at);

        const missionRow = db.prepare('SELECT * FROM missions WHERE id = ?').get(termMissionId);
        assert.equal(missionRow.status, 'FAILED_DISPATCH');
    });
});
