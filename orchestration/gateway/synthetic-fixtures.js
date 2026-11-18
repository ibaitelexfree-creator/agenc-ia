/**
 * In-Memory Registry of Approved Synthetic Fixtures
 * 
 * Provides hardcoded, immutable synthetic payloads with expected SHA-256 hashes.
 * Ensures zero filesystem traversal, zero arbitrary file reads, and zero hardlink exposure.
 */

import crypto from 'crypto';

export const SYNTHETIC_FIXTURES = {
    SYNTHETIC_001: {
        id: 'SYNTHETIC_001',
        description: 'Standard single-turn JSON extraction test with synthetic contract response',
        payload: {
            task_id: 'TASK-D40-06',
            agent_id: 'supervised-runner-pilot',
            request_id: 'req-pilot-001-synthetic-default',
            model: 'qwen2.5-7b-instruct',
            temperature: 0.0,
            output_schema_version: '1.0.0',
            messages: [
                {
                    role: 'system',
                    content: 'You are a test harness validator. You must respond with valid JSON only, without markdown fences or additional commentary.'
                },
                {
                    role: 'user',
                    content: 'Return exactly: {"status":"ok","source":"pilot_001_synthetic_integration"}'
                }
            ],
            max_tokens: 60,
            timeout_ms: 30000
        }
    },
    SYNTHETIC_002: {
        id: 'SYNTHETIC_002',
        description: 'Synthetic candidate entity extraction test with verbatim quotation',
        payload: {
            task_id: 'TASK-D40-06',
            agent_id: 'supervised-runner-pilot',
            request_id: 'req-pilot-002-synthetic-entity',
            model: 'qwen2.5-7b-instruct',
            temperature: 0.0,
            output_schema_version: '1.0.0',
            messages: [
                {
                    role: 'system',
                    content: 'You are an extraction assistant. Return JSON conforming to candidate extraction schema.'
                },
                {
                    role: 'user',
                    content: 'Synthetic message: "Confirming order 98765 for Maria Gomez scheduled tomorrow."'
                }
            ],
            max_tokens: 150,
            timeout_ms: 30000
        }
    }
};

/**
 * Validates a fixture payload and computes its deterministic SHA-256 hash.
 */
export function getSyntheticFixture(fixtureId) {
    if (!fixtureId || typeof fixtureId !== 'string') {
        return {
            isValid: false,
            error: `Fixture ID must be a non-empty string. Approved IDs: [${Object.keys(SYNTHETIC_FIXTURES).join(', ')}]`
        };
    }

    const normalizedId = fixtureId.trim().toUpperCase();
    const entry = SYNTHETIC_FIXTURES[normalizedId];

    if (!entry) {
        return {
            isValid: false,
            error: `Unknown synthetic fixture ID '${fixtureId}'. Permitted IDs: [${Object.keys(SYNTHETIC_FIXTURES).join(', ')}]`
        };
    }

    // Deep clone to prevent accidental mutations
    const payload = JSON.parse(JSON.stringify(entry.payload));

    // Dynamic request_id timestamp if default placeholder is present
    if (payload.request_id.includes('default')) {
        payload.request_id = `req-pilot-${normalizedId.toLowerCase()}-${Date.now()}`;
    }

    const payloadJson = JSON.stringify(entry.payload);
    const hash = crypto.createHash('sha256').update(payloadJson, 'utf8').digest('hex');

    return {
        isValid: true,
        id: entry.id,
        description: entry.description,
        hash,
        payload
    };
}
