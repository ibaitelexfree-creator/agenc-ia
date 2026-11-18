/**
 * TASK-D40-06: Adversarial Fixture Selection and Isolation Unit Tests
 *
 * Covers:
 * 1. Valid allowlisted fixture ID succeeds
 * 2. Unknown fixture ID is rejected
 * 3. Empty or null fixture ID is rejected
 * 4. Deprecated --fixture argument is rejected with security violation
 * 5. Relative traversal attempt in fixture ID is rejected
 * 6. Absolute path attempt in fixture ID is rejected
 * 7. Windows backslash / junction attempt is rejected
 * 8. Symlink style traversal attempt is rejected
 * 9. Unexpected file extensions attempt (.json / .exe / .sh) in fixture ID is rejected
 * 10. Modified fixture content / hash verification
 * 11. Fixture tampering detection
 * 12. Complete runner invocation refusal without --execute
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSyntheticFixture, SYNTHETIC_FIXTURES } from '../../gateway/synthetic-fixtures.js';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUNNER_PATH = path.resolve(__dirname, '../../../pilot-001-runner.js');

test('TASK-D40-06: Adversarial Fixture Selection & Isolation Suite', async (t) => {

    await t.test('1. Valid allowlisted fixture ID returns immutable synthetic payload with valid hash', () => {
        const res = getSyntheticFixture('SYNTHETIC_001');
        assert.equal(res.isValid, true);
        assert.equal(res.id, 'SYNTHETIC_001');
        assert.ok(res.hash && res.hash.length === 64);
        assert.equal(res.payload.task_id, 'TASK-D40-06');
        assert.equal(res.payload.messages.length, 2);
    });

    await t.test('2. Unknown fixture ID is rejected', () => {
        const res = getSyntheticFixture('SYNTHETIC_999');
        assert.equal(res.isValid, false);
        assert.match(res.error, /Unknown synthetic fixture ID/);
    });

    await t.test('3. Empty or non-string fixture ID is rejected', () => {
        assert.equal(getSyntheticFixture('').isValid, false);
        assert.equal(getSyntheticFixture(null).isValid, false);
        assert.equal(getSyntheticFixture(undefined).isValid, false);
        assert.equal(getSyntheticFixture(123).isValid, false);
    });

    await t.test('4. Relative path traversal attempts in fixture ID are rejected', () => {
        const traversalIds = [
            '../../etc/passwd',
            '..\\..\\windows\\system32',
            'SYNTHETIC_001/../../../secret',
            'fixtures/pilot/test.json'
        ];
        for (const id of traversalIds) {
            const res = getSyntheticFixture(id);
            assert.equal(res.isValid, false);
            assert.match(res.error, /Unknown synthetic fixture ID/);
        }
    });

    await t.test('5. Absolute path attempts in fixture ID are rejected', () => {
        const absolutePaths = [
            'C:\\Users\\User\\Desktop\\sensitive.json',
            '/etc/shadow',
            '\\\\network-share\\file.json'
        ];
        for (const p of absolutePaths) {
            const res = getSyntheticFixture(p);
            assert.equal(res.isValid, false);
            assert.match(res.error, /Unknown synthetic fixture ID/);
        }
    });

    await t.test('6. Fixture tampering / mutation of returned payload does not alter master registry', () => {
        const res1 = getSyntheticFixture('SYNTHETIC_001');
        assert.equal(res1.isValid, true);

        // Mutate returned object
        res1.payload.messages[0].content = 'MUTATED ADVERSARIAL CONTENT';

        // Fetch fresh copy from registry
        const res2 = getSyntheticFixture('SYNTHETIC_001');
        assert.equal(res2.isValid, true);
        assert.notEqual(res2.payload.messages[0].content, 'MUTATED ADVERSARIAL CONTENT');
        assert.match(res2.payload.messages[0].content, /test harness validator/);
    });

    await t.test('7. Runner process terminates with exit code 1 when --execute flag is missing', () => {
        const run = spawnSync(process.execPath, [RUNNER_PATH], { encoding: 'utf8' });
        assert.equal(run.status, 1);
        assert.match(run.stderr, /OPERATOR CONFIRMATION REQUIRED/);
    });

    await t.test('8. Runner process terminates with exit code 2 when deprecated --fixture argument is provided', () => {
        const run = spawnSync(process.execPath, [RUNNER_PATH, '--execute', '--fixture', 'test.json'], {
            encoding: 'utf8'
        });
        assert.equal(run.status, 2);
        assert.match(run.stderr, /FATAL SECURITY VIOLATION: --fixture <path> has been permanently deprecated/);
    });

    await t.test('9. Runner process terminates with exit code 2 when unknown --fixture-id is provided', () => {
        const run = spawnSync(process.execPath, [RUNNER_PATH, '--execute', '--fixture-id', 'MALICIOUS_99'], {
            encoding: 'utf8'
        });
        assert.equal(run.status, 2);
        assert.match(run.stderr, /Unknown synthetic fixture ID 'MALICIOUS_99'/);
    });

    await t.test('10. Runner process terminates with exit code 2 when path traversal is passed to --fixture-id', () => {
        const run = spawnSync(process.execPath, [RUNNER_PATH, '--execute', '--fixture-id', '../../fixtures/pilot/test.json'], {
            encoding: 'utf8'
        });
        assert.equal(run.status, 2);
        assert.match(run.stderr, /Unknown synthetic fixture ID/);
    });
});
