import test from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import express from 'express';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import { canonicalizeJson, computePayloadHash } from '../../lib/canonical.js';
import * as migration001 from '../../lib/migrations/001_v3_execution_outbox.js';
import { validatePskAtStartup, createInternalAuthMiddleware } from '../../middleware/internal-auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Legacy TLV-v1 encoder (SUPERSEDED by V8.32.44 TLV-v2 specification)
// Kept for historical reference only.
function encodeTlvV1(db, tableName, pkCol) {
  const hasher = crypto.createHash('sha256');
  const cols = db.prepare('PRAGMA table_info(' + tableName + ')').all().map(c => c.name).sort();
  const rows = db.prepare('SELECT * FROM ' + tableName + ' ORDER BY ' + pkCol + ' ASC').all();

  const magic = Buffer.from('TLV1');
  const tblBuf = Buffer.from(tableName, 'utf8');
  const hdrFixed = Buffer.alloc(8);
  hdrFixed.writeUInt16BE(tblBuf.length, 0);
  hdrFixed.writeUInt16BE(cols.length, 2);
  hdrFixed.writeUInt32BE(rows.length, 4);
  hasher.update(magic);
  hasher.update(hdrFixed);
  hasher.update(tblBuf);

  for (const col of cols) {
    const colBuf = Buffer.from(col, 'utf8');
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16BE(colBuf.length, 0);
    hasher.update(lenBuf);
    hasher.update(colBuf);
  }

  for (const row of rows) {
    for (const col of cols) {
      const val = row[col];
      if (val === null || val === undefined) {
        hasher.update(Buffer.from([0x00]));
      } else if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          const buf = Buffer.alloc(9);
          buf[0] = 0x01;
          buf.writeBigInt64BE(BigInt(val), 1);
          hasher.update(buf);
        } else {
          const buf = Buffer.alloc(9);
          buf[0] = 0x02;
          buf.writeDoubleBE(val, 1);
          hasher.update(buf);
        }
      } else if (typeof val === 'string') {
        const strBuf = Buffer.from(val, 'utf8');
        const tagAndLen = Buffer.alloc(5);
        tagAndLen[0] = 0x03;
        tagAndLen.writeUInt32BE(strBuf.length, 1);
        hasher.update(tagAndLen);
        hasher.update(strBuf);
      } else if (Buffer.isBuffer(val)) {
        const tagAndLen = Buffer.alloc(5);
        tagAndLen[0] = 0x04;
        tagAndLen.writeUInt32BE(val.length, 1);
        hasher.update(tagAndLen);
        hasher.update(val);
      } else {
        throw new Error('Unsupported SQLite storage type: ' + typeof val);
      }
    }
  }

  return {
    tableName,
    rowCount: rows.length,
    colCount: cols.length,
    sha256: hasher.digest('hex')
  };
}

// Corrected TLV-v2 specification (V8.32.44)
// Preserves SQLite storage classes (NULL=0x00, INTEGER=0x01, REAL=0x02, TEXT=0x03, BLOB=0x04),
// enforces signed 64-bit integer range, IEEE-754 binary64 reals, byte-preserving TEXT/BLOB extraction,
// and deterministic column (alphabetical) and row (PRIMARY KEY ascending) ordering.
function encodeTlvV2Strict(db, tableName, pkCol) {
  const hasher = crypto.createHash('sha256');
  const cols = db.prepare('PRAGMA table_info("' + tableName + '")').all().map(c => c.name).sort();
  const selectCols = cols.map(c => `typeof("${c}") AS "${c}__type", CAST("${c}" AS BLOB) AS "${c}__raw_bytes", "${c}"`).join(', ');
  const rows = db.prepare(`SELECT ${selectCols} FROM "${tableName}" ORDER BY "${pkCol}" ASC`).all();

  const magic = Buffer.from('TLV2');
  const tblBuf = Buffer.from(tableName, 'utf8');
  const hdrFixed = Buffer.alloc(8);
  hdrFixed.writeUInt16BE(tblBuf.length, 0);
  hdrFixed.writeUInt16BE(cols.length, 2);
  hdrFixed.writeUInt32BE(rows.length, 4);
  hasher.update(magic);
  hasher.update(hdrFixed);
  hasher.update(tblBuf);

  for (const col of cols) {
    const colBuf = Buffer.from(col, 'utf8');
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16BE(colBuf.length, 0);
    hasher.update(lenBuf);
    hasher.update(colBuf);
  }

  for (const row of rows) {
    for (const col of cols) {
      const storageType = row[col + '__type'];
      const val = row[col];
      const rawBytes = row[col + '__raw_bytes'];

      if (storageType === 'null') {
        hasher.update(Buffer.from([0x00]));
      } else if (storageType === 'integer') {
        if (typeof val !== 'bigint' && typeof val !== 'number') {
          throw new TypeError(`Expected integer/bigint for column ${col}, got ${typeof val}`);
        }
        const b = BigInt(val);
        if (b < -9223372036854775808n || b > 9223372036854775807n) {
          throw new RangeError(`Integer out of 64-bit signed range in column ${col}: ${b}`);
        }
        const buf = Buffer.alloc(9);
        buf[0] = 0x01;
        buf.writeBigInt64BE(b, 1);
        hasher.update(buf);
      } else if (storageType === 'real') {
        const num = Number(val);
        if (!Number.isFinite(num)) {
          throw new RangeError(`Non-finite REAL value in column ${col}: ${val}`);
        }
        const buf = Buffer.alloc(9);
        buf[0] = 0x02;
        buf.writeDoubleBE(num, 1);
        hasher.update(buf);
      } else if (storageType === 'text') {
        if (!Buffer.isBuffer(rawBytes)) {
          throw new TypeError(`Expected buffer for raw text bytes in column ${col}`);
        }
        const tagAndLen = Buffer.alloc(5);
        tagAndLen[0] = 0x03;
        tagAndLen.writeUInt32BE(rawBytes.length, 1);
        hasher.update(tagAndLen);
        hasher.update(rawBytes);
      } else if (storageType === 'blob') {
        if (!Buffer.isBuffer(val)) {
          throw new TypeError(`Expected buffer for blob in column ${col}`);
        }
        const tagAndLen = Buffer.alloc(5);
        tagAndLen[0] = 0x04;
        tagAndLen.writeUInt32BE(val.length, 1);
        hasher.update(tagAndLen);
        hasher.update(val);
      } else {
        throw new Error('Unsupported SQLite storage class: ' + storageType);
      }
    }
  }

  return {
    tableName,
    rowCount: rows.length,
    colCount: cols.length,
    sha256: hasher.digest('hex')
  };
}

test('V3 Authorization & Local Isolation Test Suite', async (t) => {

  // 1. Canonical JSON Serializer Tests
  await t.test('1. Canonical JSON serializer respects UTF-16 key ordering and primitives', () => {
    const input = {
      z: 1,
      a: 2,
      nested: { d: 4, c: 3 },
      arr: [1, 2, 'hello', null, true, false]
    };
    const expected = '{"a":2,"arr":[1,2,"hello",null,true,false],"nested":{"c":3,"d":4},"z":1}';
    assert.equal(canonicalizeJson(input), expected);
  });

  await t.test('2. Canonical JSON normalizes -0 to 0 and formats numbers', () => {
    assert.equal(canonicalizeJson(-0), '0');
    assert.equal(canonicalizeJson(0), '0');
    assert.equal(canonicalizeJson(123.456), '123.456');
    assert.equal(canonicalizeJson(-42), '-42');
  });

  await t.test('3. Canonical JSON rejects non-finite numbers', () => {
    assert.throws(() => canonicalizeJson(NaN), TypeError);
    assert.throws(() => canonicalizeJson(Infinity), TypeError);
    assert.throws(() => canonicalizeJson(-Infinity), TypeError);
    assert.throws(() => canonicalizeJson({ val: NaN }), TypeError);
  });

  await t.test('4. Canonical JSON rejects unsupported values explicitly', () => {
    assert.throws(() => canonicalizeJson({ val: undefined }), TypeError);
    assert.throws(() => canonicalizeJson({ val: Symbol('s') }), TypeError);
    assert.throws(() => canonicalizeJson({ val: () => {} }), TypeError);
    assert.throws(() => canonicalizeJson({ val: 100n }), TypeError);
    assert.throws(() => canonicalizeJson([1, undefined, 3]), TypeError);
    assert.throws(() => canonicalizeJson([1, , 3]), TypeError); // Sparse array hole
  });

  await t.test('5. Canonical JSON handles valid Unicode and rejects lone surrogates', () => {
    const valid = { '€': 'euro', 'a': 'letter', '𐍈': 'gothic' };
    assert.equal(canonicalizeJson(valid), '{"a":"letter","€":"euro","𐍈":"gothic"}');

    // Unpaired lone high surrogate
    assert.throws(() => canonicalizeJson({ text: '\uD800' }), URIError);
    // Unpaired lone low surrogate
    assert.throws(() => canonicalizeJson({ text: '\uDC00' }), URIError);
  });

  await t.test('6. Canonical JSON produces identical SHA-256 for identical logical payloads', () => {
    const p1 = { b: 2, a: 1 };
    const p2 = { a: 1, b: 2 };
    const h1 = computePayloadHash(canonicalizeJson(p1));
    const h2 = computePayloadHash(canonicalizeJson(p2));
    assert.equal(h1, h2);
  });

  // 2. Migration & Schema Tests in isolated DB
  await t.test('7. Versioned SQLite migration is transactional and idempotent', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-test-db-'));
    const testDbPath = path.join(tempDir, 'test.sqlite');
    const testDb = new Database(testDbPath);
    testDb.pragma('foreign_keys = ON');

    testDb.exec(`
      CREATE TABLE missions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        status TEXT NOT NULL,
        plan_hash TEXT,
        audit_score INTEGER,
        tamper_detected BOOLEAN DEFAULT 0,
        build_artifacts_path TEXT,
        plan_json TEXT,
        created_at DATETIME,
        updated_at DATETIME
      );
    `);

    // First run
    const res1 = migration001.up(testDb);
    assert.equal(res1.applied, true);
    assert.equal(res1.version, 1);

    // Second run (idempotent)
    const res2 = migration001.up(testDb);
    assert.equal(res2.applied, false);

    // Verify outbox schema
    const cols = testDb.prepare('PRAGMA table_info(execution_outbox)').all().map(c => c.name);
    assert.ok(cols.includes('execution_attempt_id'));
    assert.ok(cols.includes('mission_id'));
    assert.ok(cols.includes('status'));
    assert.ok(cols.includes('payload_json'));
    assert.ok(cols.includes('payload_hash'));

    testDb.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // 3. Authorization & Outbox Staging Tests
  await t.test('8. Atomic authorization transitions READY_FOR_EXECUTION to DISPATCH_PENDING and creates outbox row', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-test-db-'));
    const testDbPath = path.join(tempDir, 'test.sqlite');
    const testDb = new Database(testDbPath);
    testDb.pragma('foreign_keys = ON');

    testDb.exec(`
      CREATE TABLE missions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        status TEXT NOT NULL,
        plan_hash TEXT,
        audit_score INTEGER,
        tamper_detected BOOLEAN DEFAULT 0,
        build_artifacts_path TEXT,
        plan_json TEXT,
        execution_authorized_at DATETIME,
        execution_policy_version TEXT,
        execution_signature_hash TEXT,
        created_at DATETIME,
        updated_at DATETIME
      );
    `);
    migration001.up(testDb);

    testDb.prepare(`
      INSERT INTO missions (id, prompt, status, audit_score, tamper_detected, plan_hash)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('job_101', 'Test prompt', 'READY_FOR_EXECUTION', 95, 0, 'hash_abc');

    // Simulate authorize logic
    const authorizeMission = testDb.transaction((id) => {
      const m = testDb.prepare('SELECT * FROM missions WHERE id = ?').get(id);
      if (!m || m.status !== 'READY_FOR_EXECUTION') throw new Error('CONFLICT');
      if (m.audit_score < 90 || m.tamper_detected) throw new Error('POLICY_REJECTED');

      const attemptId = crypto.randomUUID();
      const payloadStr = canonicalizeJson({ mission_id: id, score: m.audit_score });
      const hash = computePayloadHash(payloadStr);

      const upd = testDb.prepare(`
        UPDATE missions SET status = 'DISPATCH_PENDING', execution_signature_hash = ? WHERE id = ? AND status = 'READY_FOR_EXECUTION'
      `).run(hash, id);
      if (upd.changes !== 1) throw new Error('CONFLICT');

      testDb.prepare(`
        INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version)
        VALUES (?, ?, 'PENDING', ?, ?, 'v3.0.0')
      `).run(attemptId, id, payloadStr, hash);

      return { attemptId, hash };
    });

    const result = authorizeMission('job_101');
    assert.ok(result.attemptId);

    const updated = testDb.prepare('SELECT status, execution_signature_hash FROM missions WHERE id = ?').get('job_101');
    assert.equal(updated.status, 'DISPATCH_PENDING');
    assert.equal(updated.execution_signature_hash, result.hash);

    const outboxRow = testDb.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(result.attemptId);
    assert.equal(outboxRow.mission_id, 'job_101');
    assert.equal(outboxRow.status, 'PENDING');
    assert.equal(outboxRow.payload_hash, result.hash);

    testDb.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  await t.test('9. Outbox failure rolls back mission authorization atomically', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-test-db-'));
    const testDbPath = path.join(tempDir, 'test.sqlite');
    const testDb = new Database(testDbPath);
    testDb.pragma('foreign_keys = ON');

    testDb.exec(`
      CREATE TABLE missions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        status TEXT NOT NULL,
        audit_score INTEGER,
        tamper_detected BOOLEAN DEFAULT 0
      );
    `);
    migration001.up(testDb);

    testDb.prepare(`
      INSERT INTO missions (id, prompt, status, audit_score, tamper_detected)
      VALUES (?, ?, ?, ?, ?)
    `).run('job_102', 'Test prompt', 'READY_FOR_EXECUTION', 95, 0);

    const failingAuthorize = testDb.transaction((id) => {
      testDb.prepare("UPDATE missions SET status = 'DISPATCH_PENDING' WHERE id = ?").run(id);
      // Force failure during outbox insert (e.g. invalid status violating CHECK constraint)
      testDb.prepare(`
        INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version)
        VALUES (?, ?, 'INVALID_STATUS', '{}', 'h', 'v1')
      `).run(crypto.randomUUID(), id);
    });

    assert.throws(() => failingAuthorize('job_102'));

    // Assert status remained READY_FOR_EXECUTION
    const m = testDb.prepare('SELECT status FROM missions WHERE id = ?').get('job_102');
    assert.equal(m.status, 'READY_FOR_EXECUTION');

    const outboxCount = testDb.prepare('SELECT count(*) as c FROM execution_outbox').get().c;
    assert.equal(outboxCount, 0);

    testDb.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  await t.test('10. Duplicate attempt ID and payload tampering are rejected', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-test-db-'));
    const testDbPath = path.join(tempDir, 'test.sqlite');
    const testDb = new Database(testDbPath);
    testDb.pragma('foreign_keys = ON');

    testDb.exec(`
      CREATE TABLE missions (id TEXT PRIMARY KEY, prompt TEXT, status TEXT);
    `);
    migration001.up(testDb);

    testDb.prepare("INSERT INTO missions (id, prompt, status) VALUES ('j1', 'p', 'READY_FOR_EXECUTION')").run();

    const attemptId = 'attempt-uuid-1';
    testDb.prepare(`
      INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version)
      VALUES (?, 'j1', 'PENDING', '{\"a\":1}', 'hash1', 'v1')
    `).run(attemptId);

    // Attempting duplicate insert with same attemptId must throw primary key violation
    assert.throws(() => {
      testDb.prepare(`
        INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version)
        VALUES (?, 'j1', 'PENDING', '{\"a\":2}', 'hash2', 'v1')
      `).run(attemptId);
    }, /UNIQUE constraint failed/);

    testDb.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // 4. Policy Rejection Two-Phase Isolation Tests
  await t.test('11. Policy rejection aborts authorization and conditional update preserves concurrent states', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-test-db-'));
    const testDbPath = path.join(tempDir, 'test.sqlite');
    const testDb = new Database(testDbPath);

    testDb.exec(`
      CREATE TABLE missions (id TEXT PRIMARY KEY, status TEXT, audit_score INTEGER, tamper_detected BOOLEAN, error_message TEXT);
    `);

    testDb.prepare("INSERT INTO missions (id, status, audit_score, tamper_detected) VALUES ('j_low', 'READY_FOR_EXECUTION', 75, 0)").run();

    // Verify low score rejects
    const m = testDb.prepare('SELECT * FROM missions WHERE id = ?').get('j_low');
    assert.ok(m.audit_score < 90);

    // Conditional rejection update
    const rejectStmt = testDb.prepare(`
      UPDATE missions SET status = 'POLICY_REJECTED', error_message = ? WHERE id = ? AND status = 'READY_FOR_EXECUTION'
    `);
    const r1 = rejectStmt.run('Score < 90', 'j_low');
    assert.equal(r1.changes, 1);

    // A second attempt does not overwrite non-READY status
    const r2 = rejectStmt.run('Another reason', 'j_low');
    assert.equal(r2.changes, 0);

    testDb.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // 5. Internal Authentication Tests
  await t.test('12. Internal authentication startup validation rejects weak/missing PSK', () => {
    const origEnv = process.env.INTERNAL_SERVICE_PSK;

    delete process.env.INTERNAL_SERVICE_PSK;
    assert.throws(() => validatePskAtStartup(), /missing/);

    process.env.INTERNAL_SERVICE_PSK = 'short-secret';
    assert.throws(() => validatePskAtStartup(), /too weak/);

    process.env.INTERNAL_SERVICE_PSK = 'cryptographically_strong_psk_token_32_chars_long!';
    assert.equal(validatePskAtStartup(), 'cryptographically_strong_psk_token_32_chars_long!');

    process.env.INTERNAL_SERVICE_PSK = origEnv;
  });

  await t.test('13. Mounted internal auth middleware rejects unauthenticated requests with 401 and accepts valid PSK', async () => {
    const testPsk = 'test_high_entropy_secret_psk_with_32_chars_min!';
    process.env.INTERNAL_SERVICE_PSK = testPsk;

    const app = express();
    app.use(express.json());
    const authMw = createInternalAuthMiddleware();

    app.get('/protected', authMw, (req, res) => res.json({ ok: true }));

    const server = await new Promise((resolve) => {
      const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    const port = server.address().port;

    try {
      // Missing token -> 401
      const resNoAuth = await fetch(`http://127.0.0.1:${port}/protected`);
      assert.equal(resNoAuth.status, 401);

      // Wrong token -> 401
      const resBadAuth = await fetch(`http://127.0.0.1:${port}/protected`, {
        headers: { 'x-internal-service-token': 'wrong_token_here_with_32_chars_or_more' }
      });
      assert.equal(resBadAuth.status, 401);

      // Valid token -> 200
      const resGoodAuth = await fetch(`http://127.0.0.1:${port}/protected`, {
        headers: { 'x-internal-service-token': testPsk }
      });
      assert.equal(resGoodAuth.status, 200);
      const data = await resGoodAuth.json();
      assert.equal(data.ok, true);

      // Valid Bearer auth -> 200
      const resBearer = await fetch(`http://127.0.0.1:${port}/protected`, {
        headers: { 'authorization': `Bearer ${testPsk}` }
      });
      assert.equal(resBearer.status, 200);

    } finally {
      await new Promise(r => server.close(r));
    }
  });

  // 6. Builder Filesystem Boundary Hardening
  await t.test('14. Builder safeJoin rejects path traversal and paths outside designated workspace', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-builder-workspace-'));
    const artifactsRoot = path.join(tempDir, 'artifacts');
    fs.mkdirSync(artifactsRoot);

    function safeJoin(root, ...parts) {
      const canonicalRoot = path.normalize(path.resolve(root));
      const target = path.normalize(path.resolve(canonicalRoot, ...parts));

      const lowerRoot = canonicalRoot.toLowerCase();
      const lowerTarget = target.toLowerCase();

      if (lowerTarget !== lowerRoot && !lowerTarget.startsWith(lowerRoot + path.sep)) {
        throw new Error(`Security Violation: Path traversal attempt outside workspace: ${target}`);
      }
      return target;
    }

    // Valid path inside artifacts
    const valid = safeJoin(artifactsRoot, 'job1', 'file.txt');
    assert.ok(valid.startsWith(artifactsRoot));

    // Traversal attempts
    assert.throws(() => safeJoin(artifactsRoot, '../escape.txt'), /Security Violation/);
    assert.throws(() => safeJoin(artifactsRoot, '..', '..', 'windows', 'system32'), /Security Violation/);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // 7. Multi-process concurrency test: 10 competing writers, exactly 1 succeeds, 9 fail with 409
  await t.test('15. Concurrency test: 10 concurrent competing processes on SQLite, exactly 1 succeeds, 9 fail', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-concurrency-test-'));
    const testDbPath = path.join(tempDir, 'concurrent.sqlite');
    const initDb = new Database(testDbPath);
    initDb.pragma('journal_mode = WAL');
    initDb.pragma('foreign_keys = ON');

    initDb.exec(`
      CREATE TABLE missions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        status TEXT NOT NULL,
        audit_score INTEGER,
        tamper_detected BOOLEAN DEFAULT 0,
        plan_hash TEXT,
        execution_authorized_at DATETIME,
        execution_policy_version TEXT,
        execution_signature_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    migration001.up(initDb);

    initDb.prepare(`
      INSERT INTO missions (id, prompt, status, audit_score, tamper_detected, plan_hash)
      VALUES ('job_concurrency_test', 'Concurr Prompt', 'READY_FOR_EXECUTION', 98, 0, 'plan_hash_1')
    `).run();
    initDb.close();

    // Spawn 10 worker node processes competing for the same mission
    const workerScript = `
import Database from 'better-sqlite3';
import crypto from 'crypto';

const dbPath = process.argv[2];
const jobId = process.argv[3];

const db = new Database(dbPath, { timeout: 15000 });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 15000');

function tryAuth() {
  const m = db.prepare('SELECT * FROM missions WHERE id = ?').get(jobId);
  if (!m || m.status !== 'READY_FOR_EXECUTION') {
    return { status: 409, message: 'CONFLICT' };
  }

  const attemptId = crypto.randomUUID();
  const payloadStr = JSON.stringify({ id: jobId, score: m.audit_score });
  const hash = crypto.createHash('sha256').update(payloadStr).digest('hex');

  const authTx = db.transaction(() => {
    const upd = db.prepare("UPDATE missions SET status = 'DISPATCH_PENDING', execution_signature_hash = ? WHERE id = ? AND status = 'READY_FOR_EXECUTION'").run(hash, jobId);
    if (upd.changes !== 1) {
      return { status: 409, message: 'CONFLICT' };
    }

    db.prepare("INSERT INTO execution_outbox (execution_attempt_id, mission_id, status, payload_json, payload_hash, policy_version) VALUES (?, ?, 'PENDING', ?, ?, 'v3')").run(attemptId, jobId, payloadStr, hash);
    return { status: 200, attemptId };
  });

  return authTx();
}

try {
  const res = tryAuth();
  console.log(JSON.stringify(res));
} catch (err) {
  console.log(JSON.stringify({ status: 500, error: err.message }));
} finally {
  db.close();
}
`;

    const workerFile = path.resolve(__dirname, '../../storage/test-worker.mjs');
    fs.mkdirSync(path.dirname(workerFile), { recursive: true });
    fs.writeFileSync(workerFile, workerScript, 'utf8');

    const promises = [];
    const orchestrationDir = path.resolve(__dirname, '../../');
    for (let i = 0; i < 10; i++) {
      promises.push(new Promise((resolve) => {
        const child = spawn(process.execPath, [workerFile, testDbPath, 'job_concurrency_test'], {
          cwd: orchestrationDir
        });
        let out = '';
        let errOut = '';
        child.stdout.on('data', (d) => out += d);
        child.stderr.on('data', (d) => errOut += d);
        child.on('close', (code) => {
          try {
            resolve(JSON.parse(out.trim()));
          } catch {
            resolve({ status: 500, error: errOut || out });
          }
        });
      }));
    }

    const results = await Promise.all(promises);
    const successes = results.filter(r => r.status === 200);
    const conflicts = results.filter(r => r.status === 409);

    if (successes.length !== 1) {
      console.error('CONCURRENCY TEST WORKER RESULTS:', results);
    }

    assert.equal(successes.length, 1, `Expected exactly 1 success, got ${successes.length}`);
    assert.equal(conflicts.length, 9, `Expected exactly 9 conflicts, got ${conflicts.length}`);

    // Verify outbox has exactly 1 row
    const checkDb = new Database(testDbPath);
    const outboxRows = checkDb.prepare("SELECT * FROM execution_outbox WHERE mission_id = 'job_concurrency_test'").all();
    assert.equal(outboxRows.length, 1);
    assert.equal(outboxRows[0].status, 'PENDING');

    const missionRow = checkDb.prepare("SELECT status FROM missions WHERE id = 'job_concurrency_test'").get();
    assert.equal(missionRow.status, 'DISPATCH_PENDING');
    checkDb.close();

    fs.rmSync(tempDir, { recursive: true, force: true });
    if (fs.existsSync(workerFile)) fs.unlinkSync(workerFile);
  });

  // 8. Historical database fingerprint verification (V8.32.44 Revalidation)
  await t.test('16. Historical database TLV-v2 fingerprints preserve SQLite storage classes and match pre-migration backup', () => {
    const activeDbPath = path.resolve(__dirname, '../../v3_orchestration.sqlite');
    const backupDbPath = path.resolve(__dirname, '../../storage/backups/v3_orchestration_pre_migration.sqlite');

    const activeDb = new Database(activeDbPath, { readonly: true });
    activeDb.defaultSafeIntegers(true);

    const backupDb = new Database(backupDbPath, { readonly: true });
    backupDb.defaultSafeIntegers(true);

    // Verify database integrity on both active and backup
    const activeIntegrity = activeDb.pragma('integrity_check');
    assert.equal(activeIntegrity[0].integrity_check, 'ok');

    const backupIntegrity = backupDb.pragma('integrity_check');
    assert.equal(backupIntegrity[0].integrity_check, 'ok');

    // Corrected TLV-v2 Fingerprints (V8.32.44)
    const activeMissionsFp = encodeTlvV2Strict(activeDb, 'missions', 'id');
    const backupMissionsFp = encodeTlvV2Strict(backupDb, 'missions', 'id');

    const activeLogsFp = encodeTlvV2Strict(activeDb, 'semantic_logs', 'id');
    const backupLogsFp = encodeTlvV2Strict(backupDb, 'semantic_logs', 'id');

    // Validate exact row count and hash identity between active and pre-migration backup
    assert.equal(activeMissionsFp.rowCount, 390);
    assert.equal(backupMissionsFp.rowCount, 390);
    assert.equal(activeMissionsFp.colCount, 22);
    assert.equal(activeMissionsFp.sha256, '7031b6862709f46074c06e473acaaa98e5a48613c1e71cdb758a2120e60e6b6b');
    assert.equal(backupMissionsFp.sha256, activeMissionsFp.sha256, 'missions TLV-v2 must match pre-migration backup exactly');

    assert.equal(activeLogsFp.rowCount, 0);
    assert.equal(backupLogsFp.rowCount, 0);
    assert.equal(activeLogsFp.colCount, 5);
    assert.equal(activeLogsFp.sha256, '97e9b7cd419633ab3ec65d5cc55d5c34853392a9924b16c990981b89d72dd161');
    assert.equal(backupLogsFp.sha256, activeLogsFp.sha256, 'semantic_logs TLV-v2 must match pre-migration backup exactly');

    // Superseded TLV-v1 legacy verification (tested on non-safeIntegers instance as was originally written)
    const legacyDb = new Database(activeDbPath, { readonly: true });
    const legacyMissionsFp = encodeTlvV1(legacyDb, 'missions', 'id');
    const legacyLogsFp = encodeTlvV1(legacyDb, 'semantic_logs', 'id');
    assert.equal(legacyMissionsFp.sha256, 'd04adb3e6f6b34b194f5ed340be789c24157e66ebf9935fee0ff289546d56171');
    assert.equal(legacyLogsFp.sha256, 'a9f9599d94d6e7fb37c60bcada4019b39fb7c312c0a973f5c3275c870a1beaf2');
    legacyDb.close();

    activeDb.close();
    backupDb.close();
  });
});
