/**
 * PILOT-001 Supervised Runner (V8.32.80 Hardened)
 *
 * Requirements:
 * - One execution per invocation.
 * - Explicit operator-controlled execution flag: --execute.
 * - Refuse execution without the required flag.
 * - Strictly allowlisted synthetic fixture ID (--fixture-id SYNTHETIC_001).
 * - Zero arbitrary filesystem paths allowed.
 * - No automatic scanning of folders or databases.
 * - No access to WhatsApp archives or whatsapp_forensics.db.
 * - No attachment extraction, OCR, or Whisper.
 * - No automatic retries.
 * - Display request before dispatch.
 * - Display complete response after execution.
 * - Validate response against pilot-response-schema.json.
 * - Return non-zero process exit code on failure.
 */

import { validatePilotResponse } from './orchestration/gateway/pilot-validator.js';
import { getSyntheticFixture, SYNTHETIC_FIXTURES } from './orchestration/gateway/synthetic-fixtures.js';

// 1. Strict operator gate
const args = process.argv.slice(2);
const hasExecuteFlag = args.includes('--execute');

if (!hasExecuteFlag) {
    console.error('========================================================================');
    console.error('PILOT-001 RUNNER BLOCKED: OPERATOR CONFIRMATION REQUIRED');
    console.error('Execution requires explicit operator control flag: --execute');
    console.error(`Usage: node pilot-001-runner.js --execute [--fixture-id <ID>]`);
    console.error(`Approved Fixture IDs: [${Object.keys(SYNTHETIC_FIXTURES).join(', ')}]`);
    console.error('========================================================================');
    process.exit(1);
}

// 2. Prevent arbitrary file path input (SEC-03)
if (args.includes('--fixture')) {
    console.error('========================================================================');
    console.error('FATAL SECURITY VIOLATION: --fixture <path> has been permanently deprecated.');
    console.error('Arbitrary filesystem paths are prohibited to eliminate traversal and hardlink risks.');
    console.error(`Use allowlisted synthetic fixture IDs via --fixture-id <ID>`);
    console.error(`Approved IDs: [${Object.keys(SYNTHETIC_FIXTURES).join(', ')}]`);
    console.error('========================================================================');
    process.exit(2);
}

// 3. Resolve synthetic fixture from controlled in-memory registry
let selectedFixtureId = 'SYNTHETIC_001';
const fixtureIdIndex = args.indexOf('--fixture-id');
if (fixtureIdIndex !== -1 && args[fixtureIdIndex + 1]) {
    selectedFixtureId = args[fixtureIdIndex + 1];
}

const fixtureResult = getSyntheticFixture(selectedFixtureId);
if (!fixtureResult.isValid) {
    console.error(`FATAL: ${fixtureResult.error}`);
    process.exit(2);
}

console.log(`[Runner] Loaded controlled synthetic fixture: ${fixtureResult.id} (hash: ${fixtureResult.hash.slice(0, 16)}...)`);
let syntheticPayload = fixtureResult.payload;

// 4. Gateway configuration & PSK
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://127.0.0.1:4000';
const PSK = process.env.INTERNAL_SERVICE_PSK || '0123456789abcdef0123456789abcdef0123456789abcdef';

async function runSupervisedPilot() {
    console.log('========================================================================');
    console.log('PILOT-001 SUPERVISED SYNTHETIC RUNNER (SINGLE-SHOT)');
    console.log('Execution Mode: ONE-SHOT SYNTHETIC');
    console.log(`Target Gateway: ${GATEWAY_URL}/v1/pilot/inference`);
    console.log(`Fixture ID: ${fixtureResult.id}`);
    console.log('========================================================================');

    console.log('\n[PILOT-001] Pre-Dispatch Request Envelope:');
    console.log(JSON.stringify(syntheticPayload, null, 2));

    const startTime = Date.now();
    let response;
    let responseBody;
    try {
        const res = await fetch(`${GATEWAY_URL}/v1/pilot/inference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-service-token': PSK,
                'x-request-id': syntheticPayload.request_id
            },
            body: JSON.stringify(syntheticPayload),
            signal: AbortSignal.timeout(syntheticPayload.timeout_ms || 35000)
        });
        responseBody = await res.json();
        response = {
            status: res.status,
            ok: res.ok,
            data: responseBody
        };
    } catch (err) {
        const duration = Date.now() - startTime;
        console.error(`\n[PILOT-001] Gateway Request FAILED after ${duration}ms:`, err.message);
        process.exit(3);
    }

    const totalClientMs = Date.now() - startTime;
    console.log('\n========================================================================');
    console.log(`[PILOT-001] Execution Response Received (HTTP ${response.status}) in ${totalClientMs}ms:`);
    console.log(JSON.stringify(response.data, null, 2));
    console.log('========================================================================');

    // Validate Response against Schema
    const validation = validatePilotResponse(response.data);
    if (!validation.isValid) {
        console.error('\n[PILOT-001] SCHEMA VALIDATION FAILED:');
        console.error(validation.message);
        process.exit(4);
    }
    console.log('\n[PILOT-001] Response Schema Validation: PASSED (Ajv 2020-12 strict)');

    // Verify Correlation Identifiers
    if (response.data.request_id !== syntheticPayload.request_id) {
        console.error(`\n[PILOT-001] CORRELATION MISMATCH: request_id sent '${syntheticPayload.request_id}' vs received '${response.data.request_id}'`);
        process.exit(5);
    }
    if (response.data.task_id !== syntheticPayload.task_id) {
        console.error(`\n[PILOT-001] CORRELATION MISMATCH: task_id sent '${syntheticPayload.task_id}' vs received '${response.data.task_id}'`);
        process.exit(6);
    }
    if (response.data.agent_id !== syntheticPayload.agent_id) {
        console.error(`\n[PILOT-001] CORRELATION MISMATCH: agent_id sent '${syntheticPayload.agent_id}' vs received '${response.data.agent_id}'`);
        process.exit(7);
    }

    // Check structured JSON output
    if (response.data.status !== 'SUCCESS' || !response.data.result) {
        console.error('\n[PILOT-001] Execution Status is not SUCCESS:', response.data.status);
        process.exit(8);
    }

    console.log('[PILOT-001] Correlation IDs: VERIFIED');
    console.log(`[PILOT-001] Inference Latency: ${response.data.result.timing?.inference_ms}ms`);
    console.log(`[PILOT-001] Gateway Total Latency: ${response.data.result.timing?.total_ms}ms`);
    console.log('[PILOT-001] Structured Output Parsed JSON:', JSON.stringify(response.data.result.parsed_json));
    console.log('\n>>> PILOT-001 SUPERVISED RUN COMPLETED SUCCESSFULLY <<<');
}

runSupervisedPilot().catch((err) => {
    console.error('Fatal Runner Error:', err);
    process.exit(9);
});
