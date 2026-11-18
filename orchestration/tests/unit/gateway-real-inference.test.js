import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import axios from 'axios';
import { createGatewayApp } from '../../gateway/gateway-server.js';

const TEST_PSK = '0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.INTERNAL_SERVICE_PSK = TEST_PSK;

function startServer(app) {
    return new Promise((resolve) => {
        const server = http.createServer(app);
        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            resolve({ server, port, baseUrl: 'http://127.0.0.1:' + port });
        });
    });
}

function stopServer(server) {
    return new Promise((resolve) => {
        server.close(resolve);
    });
}

test('V8.32.46 Gateway Suite: Real LM Studio & Failure Modes', async (t) => {
    const app = createGatewayApp({
        lmStudioUrl: 'http://127.0.0.1:1234',
        defaultTimeoutMs: 60000,
        maxConcurrency: 2,
        requireAuth: true
    });

    const { server, baseUrl } = await startServer(app);

    t.after(async () => {
        await stopServer(server);
    });

    // 1. Health check with real LM Studio running
    await t.test('1. Health check reports HEALTHY when LM Studio is reachable', async () => {
        const res = await axios.get(baseUrl + '/health');
        assert.equal(res.status, 200);
        assert.equal(res.data.status, 'HEALTHY');
        assert.equal(res.data.service, 'local-inference-gateway');
        assert.equal(res.data.lm_studio.reachable, true);
        assert.ok(Array.isArray(res.data.lm_studio.models));
        assert.ok(res.data.lm_studio.models.includes('local-model'));
    });

    // 2. Authentication enforcement
    await t.test('2. Inference endpoint rejects requests missing internal auth header (401)', async () => {
        try {
            await axios.post(baseUrl + '/v1/inference', { prompt: 'ping' });
            assert.fail('Should have failed with 401');
        } catch (err) {
            assert.equal(err.response?.status, 401);
            assert.equal(err.response?.data?.error, 'Unauthorized: Missing internal service token');
        }
    });

    await t.test('3. Inference endpoint rejects requests with invalid PSK (401)', async () => {
        try {
            await axios.post(
                baseUrl + '/v1/inference',
                { prompt: 'ping' },
                { headers: { 'x-internal-service-token': 'wrong-psk-wrong-psk-wrong-psk-wrong-psk' } }
            );
            assert.fail('Should have failed with 401');
        } catch (err) {
            assert.equal(err.response?.status, 401);
            assert.equal(err.response?.data?.error, 'Unauthorized: Invalid internal service token');
        }
    });

    // 3. Real E2E Inference through Gateway to LM Studio
    await t.test('4. Real E2E Inference: Gateway -> LM Studio -> local-model -> Response', async () => {
        const reqId = 'req-gw-e2e-ok-001';
        const res = await axios.post(
            baseUrl + '/v1/inference',
            {
                request_id: reqId,
                model: 'local-model',
                prompt: 'Responde exactamente: LOCAL_INFERENCE_OK_2026',
                temperature: 0,
                max_tokens: 50
            },
            {
                headers: { 'x-internal-service-token': TEST_PSK }
            }
        );

        assert.equal(res.status, 200);
        assert.equal(res.data.status, 'SUCCESS');
        assert.equal(res.data.requestId, reqId);
        assert.equal(res.data.model, 'local-model');
        assert.ok(res.data.text.includes('LOCAL_INFERENCE_OK_2026'), 'Response must contain target token string: ' + res.data.text);
        assert.ok(res.data.timing.inference_ms > 0, 'Inference timing recorded');
        assert.ok(res.data.timing.total_ms >= res.data.timing.inference_ms, 'Total duration recorded');

        // Check Phase Audit Log
        const logRes = await axios.get(baseUrl + '/v1/audit/logs?requestId=' + reqId, {
            headers: { 'x-internal-service-token': TEST_PSK }
        });
        const phases = logRes.data.logs.map(l => l.phase);
        assert.ok(phases.includes('PHASE_1_RECEIVED'));
        assert.ok(phases.includes('PHASE_2_ADMITTED'));
        assert.ok(phases.includes('PHASE_3_DISPATCHED_TO_LM_STUDIO'));
        assert.ok(phases.includes('PHASE_4_RESPONSE_RECEIVED'));
        assert.ok(phases.includes('PHASE_5_COMPLETED'));
    });

    // 4. Resilience: Invalid payload format (empty prompt)
    await t.test('5. Failure Mode: Rejects empty prompt with 400 ValidationError', async () => {
        try {
            await axios.post(
                baseUrl + '/v1/inference',
                { prompt: '   ' },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );
            assert.fail('Should fail with 400');
        } catch (err) {
            assert.equal(err.response?.status, 400);
            assert.ok(err.response?.data?.error.includes('ValidationError'));
        }
    });

    // 5. Resilience: Invalid max_tokens
    await t.test('6. Failure Mode: Rejects negative max_tokens with 400 ValidationError', async () => {
        try {
            await axios.post(
                baseUrl + '/v1/inference',
                { prompt: 'ping', max_tokens: -10 },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );
            assert.fail('Should fail with 400');
        } catch (err) {
            assert.equal(err.response?.status, 400);
            assert.ok(err.response?.data?.error.includes('max_tokens'));
        }
    });

    // 6. Resilience: Incorrect / unavailable port (LM Studio down)
    await t.test('7. Failure Mode: LM Studio unreachable returns 503 Service Unavailable', async () => {
        const brokenApp = createGatewayApp({
            lmStudioUrl: 'http://127.0.0.1:19999', // unused port
            requireAuth: true
        });
        const brokenServerInstance = await startServer(brokenApp);

        try {
            await axios.post(
                brokenServerInstance.baseUrl + '/v1/inference',
                { prompt: 'ping' },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );
            assert.fail('Should fail with 503');
        } catch (err) {
            assert.equal(err.response?.status, 503);
            assert.equal(err.response?.data?.error_type, 'LM_STUDIO_UNREACHABLE');
        } finally {
            await stopServer(brokenServerInstance.server);
        }
    });

    // 7. Resilience: Model not loaded / invalid model identifier
    await t.test('8. Failure Mode: Requesting non-existent model returns 400 or 502 with error details', async () => {
        try {
            await axios.post(
                baseUrl + '/v1/inference',
                { prompt: 'ping', model: 'non-existent-model-xyz' },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );
            assert.fail('Should fail when requesting invalid model');
        } catch (err) {
            assert.ok(err.response?.status >= 400);
            assert.ok(err.response?.data?.error);
        }
    });

    // 8. Resilience: Timeout handling
    await t.test('9. Failure Mode: Timeout triggered returns 504 GATEWAY_TIMEOUT', async () => {
        try {
            await axios.post(
                baseUrl + '/v1/inference',
                {
                    prompt: 'Explain the theory of general relativity in 300 words with details.',
                    timeout_ms: 1, // 1ms forces immediate client abort timeout
                    max_tokens: 300
                },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );
            assert.fail('Should timeout');
        } catch (err) {
            assert.equal(err.response?.status, 504);
            assert.equal(err.response?.data?.error_type, 'GATEWAY_TIMEOUT');
        }
    });

    // 9. Concurrency test: Simultaneous requests
    await t.test('10. Concurrency Mode: Multiple requests handled cleanly within semaphore limit', async () => {
        const reqs = [1, 2].map((i) =>
            axios.post(
                baseUrl + '/v1/inference',
                {
                    request_id: 'req-concurrent-' + i,
                    prompt: 'Responde solo el número ' + i,
                    max_tokens: 10,
                    temperature: 0
                },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            )
        );

        const results = await Promise.all(reqs);
        assert.equal(results.length, 2);
        assert.equal(results[0].status, 200);
        assert.equal(results[1].status, 200);
        assert.equal(results[0].data.status, 'SUCCESS');
        assert.equal(results[1].data.status, 'SUCCESS');
    });

    // 10. Concurrency test: Exceeding max concurrency returns 429
    await t.test('11. Concurrency Mode: Exceeding capacity returns 429 ConcurrencyLimitExceeded', async () => {
        const singleSlotApp = createGatewayApp({
            lmStudioUrl: 'http://127.0.0.1:1234',
            maxConcurrency: 1,
            requireAuth: true
        });
        const singleSlotServer = await startServer(singleSlotApp);

        try {
            // Send first request with slight delay
            const p1 = axios.post(
                singleSlotServer.baseUrl + '/v1/inference',
                { prompt: 'Cuenta de 1 a 20 con calma.', max_tokens: 40 },
                { headers: { 'x-internal-service-token': TEST_PSK } }
            );

            // Immediately send second request to collide while p1 occupies the single slot
            let secondFailed429 = false;
            try {
                await axios.post(
                    singleSlotServer.baseUrl + '/v1/inference',
                    { prompt: 'segundo intento' },
                    { headers: { 'x-internal-service-token': TEST_PSK } }
                );
            } catch (err) {
                if (err.response?.status === 429) {
                    secondFailed429 = true;
                    assert.equal(err.response?.data?.error_type || 'ConcurrencyLimitExceeded', 'ConcurrencyLimitExceeded');
                }
            }

            await p1; // wait for first
            assert.ok(secondFailed429, 'Second concurrent request on 1-slot gateway must receive 429');
        } finally {
            await stopServer(singleSlotServer.server);
        }
    });
});
