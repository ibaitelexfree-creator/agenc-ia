/**
 * TASK-D40-06: Trusted Human Review & Grounding State Manager
 *
 * Implements strict plane separation between:
 * 1. Model candidate extraction (untrusted output)
 * 2. Algorithmic provenance verification (SOURCE_GROUNDED check)
 * 3. Human review state management (trusted application plane)
 *
 * The LLM is strictly prohibited from mutating or producing review states.
 * All candidate extractions are initialized to 'PENDING_REVIEW' strictly by application code.
 */

import crypto from 'crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyExtractionProvenance, validateSourceIdentifier, computeSourceHash } from './provenance-verifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const candidateSchema = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../pilot-candidate-extraction-schema.json'), 'utf8')
);
const validateCandidateExtractionSchema = ajv.compile(candidateSchema);

/**
 * List of forbidden fields that the model must NEVER be allowed to output.
 */
const FORBIDDEN_MODEL_FIELDS = [
    'human_review',
    'review_status',
    'approval_status',
    'approved',
    'reviewer_id',
    'reviewed_by',
    'reviewed_at',
    'is_approved',
    'status' // model should not output status inside extraction
];

/**
 * Validates untrusted candidate extraction emitted by model against strict schema
 * and verifies absence of forbidden approval/review injection attempts.
 *
 * @param {any} rawCandidate
 * @returns {{ isValid: boolean, error?: string, details?: any }}
 */
export function validateCandidateExtraction(rawCandidate) {
    if (!rawCandidate || typeof rawCandidate !== 'object' || Array.isArray(rawCandidate)) {
        return { isValid: false, error: 'Candidate extraction must be an object' };
    }

    // Check for forbidden approval fields injection
    for (const forbidden of FORBIDDEN_MODEL_FIELDS) {
        if (forbidden in rawCandidate) {
            return {
                isValid: false,
                error: `SECURITY VIOLATION: Model attempted to inject review/approval field '${forbidden}'`
            };
        }
    }

    // Check verifiable claims for nested approval injection
    if (Array.isArray(rawCandidate.verifiable_claims)) {
        for (const claim of rawCandidate.verifiable_claims) {
            if (claim && typeof claim === 'object') {
                for (const forbidden of FORBIDDEN_MODEL_FIELDS) {
                    if (forbidden in claim) {
                        return {
                            isValid: false,
                            error: `SECURITY VIOLATION: Model attempted to inject review/approval field '${forbidden}' into claim`
                        };
                    }
                }
            }
        }
    }

    const valid = validateCandidateExtractionSchema(rawCandidate);
    if (!valid) {
        const errorDetails = validateCandidateExtractionSchema.errors
            .map(e => `${e.instancePath || 'root'}: ${e.message}`)
            .join(', ');
        return {
            isValid: false,
            error: `Candidate extraction schema validation failed: ${errorDetails}`,
            details: validateCandidateExtractionSchema.errors
        };
    }

    return { isValid: true };
}

/**
 * Wraps candidate extraction into a trusted reviewed record initialized strictly to PENDING_REVIEW.
 * Performs algorithmic provenance verification.
 *
 * @param {object} params
 * @param {string} params.source_text - Original raw message text
 * @param {any} params.source_message_id - Source message identifier
 * @param {any} params.conversation_id - Conversation identifier
 * @param {object} params.candidate_extraction - Validated candidate extraction from model
 * @param {string} [params.task_id]
 * @param {string} [params.model_id]
 * @param {string} [params.request_id]
 *
 * @returns {{
 *   success: boolean,
 *   record?: object,
 *   error?: string
 * }}
 */
export function createPendingReviewRecord(params) {
    if (!params || typeof params !== 'object') {
        return { success: false, error: 'Parameters must be a non-null object' };
    }

    const {
        source_text,
        source_message_id,
        conversation_id,
        candidate_extraction,
        task_id,
        model_id,
        request_id
    } = params;

    if (typeof source_text !== 'string') {
        return { success: false, error: 'source_text must be a string' };
    }

    // 1. Validate candidate extraction schema and ensure zero model approval fields
    const schemaValidation = validateCandidateExtraction(candidate_extraction);
    if (!schemaValidation.isValid) {
        return { success: false, error: schemaValidation.error };
    }

    // 2. Validate source identifiers
    const validSourceId = validateSourceIdentifier(source_message_id);
    if (!validSourceId.isValid) {
        return { success: false, error: `Invalid source_message_id: ${validSourceId.error}` };
    }

    const validConvId = validateSourceIdentifier(conversation_id);
    if (!validConvId.isValid) {
        return { success: false, error: `Invalid conversation_id: ${validConvId.error}` };
    }

    // 3. Compute immutable source hash
    const sourceHash = computeSourceHash(source_text);

    // 4. Verify provenance for each claim
    const verifiedClaims = [];
    for (const claim of candidate_extraction.verifiable_claims) {
        const provResult = verifyExtractionProvenance({
            source_text,
            source_hash: sourceHash,
            candidate_extraction: claim,
            source_id: validSourceId
        });

        if (!provResult.is_grounded) {
            return {
                success: false,
                error: `Claim '${claim.claim_id}' failed provenance verification: [${provResult.code}] ${provResult.message}`
            };
        }

        verifiedClaims.push({
            claim_id: claim.claim_id,
            field_name: claim.field_name,
            extracted_value: claim.extracted_value,
            exact_quote: claim.exact_quote,
            source_char_offset: provResult.verified_offsets,
            grounding_state: 'SOURCE_GROUNDED'
        });
    }

    // 5. Build trusted review record initialized to PENDING_REVIEW
    // Notice: human_review is created ONLY by this trusted function, never accepted from LLM!
    const reviewRecord = {
        record_id: 'rec-' + crypto.randomUUID(),
        extraction_id: candidate_extraction.extraction_id,
        source_message_id: { type: validSourceId.type, value: validSourceId.value },
        conversation_id: { type: validConvId.type, value: validConvId.value },
        source_integrity: {
            sha256: sourceHash,
            byte_length: Buffer.byteLength(source_text, 'utf8'),
            utf16_length: source_text.length
        },
        metadata: {
            task_id: task_id || 'UNKNOWN_TASK',
            model_id: model_id || 'UNKNOWN_MODEL',
            request_id: request_id || 'UNKNOWN_REQUEST',
            created_at: new Date().toISOString()
        },
        claims: verifiedClaims,
        human_review: {
            status: 'PENDING_REVIEW', // STRICTLY ENFORCED DEFAULT
            reviewed_by: null,
            reviewed_at: null,
            reviewer_signature: null,
            notes: null
        }
    };

    return {
        success: true,
        record: reviewRecord
    };
}
