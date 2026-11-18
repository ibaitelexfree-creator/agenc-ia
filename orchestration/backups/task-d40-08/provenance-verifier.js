/**
 * TASK-D40-06: Provenance Verification Engine
 * 
 * Verifies that candidate extractions have exact, unnormalized, verifiable quotations
 * from their declared source text, calculates and validates UTF-16 code unit offsets,
 * checks SHA-256 source integrity, and rejects ambiguous quotations or ungrounded claims.
 *
 * Concepts enforced:
 * - SCHEMA_VALID: JSON schema structure is correct.
 * - SOURCE_GROUNDED: Verbatim quotation exists in source message at verified offsets.
 * - HUMAN_APPROVED: Can NEVER be assigned by LLM or this verifier.
 */

import crypto from 'crypto';

/**
 * Validates and normalizes source identifier into an opaque, typed representation.
 * Supports SQLite integer identifiers (via string/BigInt to avoid precision loss),
 * text identifiers, and WhatsApp JIDs.
 * Rejects invented prefixes (no mandatory 'msg-' or 'conv-').
 *
 * @param {any} rawId - The raw identifier input
 * @returns {{ type: 'integer'|'text', value: string, isValid: boolean, error?: string }}
 */
export function validateSourceIdentifier(rawId) {
    if (rawId === null || rawId === undefined) {
        return { isValid: false, error: 'Identifier cannot be null or undefined' };
    }

    // Typed object input: { type: 'integer'|'text', value: string|number }
    if (typeof rawId === 'object' && !Array.isArray(rawId)) {
        const { type, value } = rawId;
        if (type === 'integer') {
            const strVal = String(value);
            if (!/^-?\d+$/.test(strVal)) {
                return { isValid: false, error: `Invalid integer format for source identifier: '${strVal}'` };
            }
            return { type: 'integer', value: strVal, isValid: true };
        } else if (type === 'text') {
            if (typeof value !== 'string' || value.length === 0) {
                return { isValid: false, error: 'Text source identifier must be a non-empty string' };
            }
            return { type: 'text', value, isValid: true };
        } else {
            return { isValid: false, error: `Unsupported identifier type '${type}'. Must be 'integer' or 'text'` };
        }
    }

    // Primitive number input (check safe integer bounds)
    if (typeof rawId === 'number') {
        if (!Number.isInteger(rawId)) {
            return { isValid: false, error: `Float numbers not supported for source identifier: ${rawId}` };
        }
        return { type: 'integer', value: rawId.toString(), isValid: true };
    }

    // Primitive bigint input (safe for 64-bit SQLite integer rowids)
    if (typeof rawId === 'bigint') {
        return { type: 'integer', value: rawId.toString(), isValid: true };
    }

    // Primitive string input
    if (typeof rawId === 'string') {
        if (rawId.length === 0) {
            return { isValid: false, error: 'Source identifier string cannot be empty' };
        }
        // If string consists purely of digits (potential 64-bit SQLite rowid)
        if (/^\d+$/.test(rawId)) {
            return { type: 'integer', value: rawId, isValid: true };
        }
        // JID or general text string
        return { type: 'text', value: rawId, isValid: true };
    }

    return { isValid: false, error: `Unsupported source identifier format of type '${typeof rawId}'` };
}

/**
 * Computes SHA-256 over source text encoded as UTF-8.
 *
 * @param {string} sourceText - Original raw source text
 * @returns {string} Lowercase hex SHA-256 digest
 */
export function computeSourceHash(sourceText) {
    if (typeof sourceText !== 'string') {
        throw new TypeError('sourceText must be a string');
    }
    return crypto.createHash('sha256').update(sourceText, 'utf8').digest('hex');
}

/**
 * Locates all exact occurrences of a quotation within source text using UTF-16 code units.
 * Matching is strictly exact: zero trimming, zero normalization, zero case-folding.
 *
 * @param {string} sourceText
 * @param {string} quote
 * @returns {Array<{ start: number, end: number }>}
 */
export function findQuotationOccurrences(sourceText, quote) {
    if (typeof sourceText !== 'string' || typeof quote !== 'string' || quote.length === 0) {
        return [];
    }

    const occurrences = [];
    let pos = sourceText.indexOf(quote);
    while (pos !== -1) {
        occurrences.push({
            start: pos,
            end: pos + quote.length
        });
        pos = sourceText.indexOf(quote, pos + 1);
    }
    return occurrences;
}

/**
 * Verifies the provenance and grounding of a candidate extraction.
 *
 * @param {object} params
 * @param {string} params.source_text - Original raw source text
 * @param {string} [params.source_hash] - Expected SHA-256 of source text (optional, but checked if provided)
 * @param {object} params.candidate_extraction - Candidate extraction object
 * @param {string} params.candidate_extraction.exact_quote - Verbatim quotation from source
 * @param {object} [params.candidate_extraction.source_char_offset] - Optional claimed offsets { start, end }
 * @param {any} [params.source_id] - Optional source identifier to validate
 *
 * @returns {{
 *   is_grounded: boolean,
 *   code: string,
 *   message: string,
 *   verified_offsets?: { start: number, end: number },
 *   source_hash?: string,
 *   source_id?: { type: string, value: string }
 * }}
 */
export function verifyExtractionProvenance(params) {
    if (!params || typeof params !== 'object') {
        return {
            is_grounded: false,
            code: 'INVALID_INPUT',
            message: 'Verification parameters must be a non-null object'
        };
    }

    const { source_text, source_hash, candidate_extraction, source_id } = params;

    // 1. source_text must be a string
    if (typeof source_text !== 'string') {
        return {
            is_grounded: false,
            code: 'INVALID_SOURCE_TEXT',
            message: 'source_text must be a string'
        };
    }

    // 2. Candidate extraction structure check
    if (!candidate_extraction || typeof candidate_extraction !== 'object' || Array.isArray(candidate_extraction)) {
        return {
            is_grounded: false,
            code: 'INVALID_EXTRACTION_STRUCTURE',
            message: 'candidate_extraction must be a non-null object'
        };
    }

    // 3. exact_quote must be a non-empty string
    const quote = candidate_extraction.exact_quote;
    if (typeof quote !== 'string' || quote.length === 0) {
        return {
            is_grounded: false,
            code: 'MISSING_QUOTATION',
            message: 'candidate_extraction.exact_quote must be a non-empty string'
        };
    }

    // 4. Source hash integrity verification
    const actualHash = computeSourceHash(source_text);
    if (source_hash) {
        if (typeof source_hash !== 'string' || source_hash.toLowerCase() !== actualHash) {
            return {
                is_grounded: false,
                code: 'SOURCE_HASH_MISMATCH',
                message: `Source integrity check failed: expected hash '${source_hash}', computed '${actualHash}'`
            };
        }
    }

    // 5. Source identifier verification (if provided)
    let validatedSourceId;
    if (source_id !== undefined) {
        const idResult = validateSourceIdentifier(source_id);
        if (!idResult.isValid) {
            return {
                is_grounded: false,
                code: 'INVALID_SOURCE_ID',
                message: idResult.error
            };
        }
        validatedSourceId = { type: idResult.type, value: idResult.value };
    }

    // 6. Find exact quotation occurrences in source text (UTF-16 code units)
    const occurrences = findQuotationOccurrences(source_text, quote);

    if (occurrences.length === 0) {
        return {
            is_grounded: false,
            code: 'UNGROUNDED_EXTRACTION',
            message: 'Quotation does not exist literally in source text. No normalization or paraphrasing is allowed.'
        };
    }

    // 7. Handle claimed offsets if provided
    const claimedOffsets = candidate_extraction.source_char_offset;
    if (claimedOffsets !== undefined && claimedOffsets !== null) {
        if (typeof claimedOffsets !== 'object' || Array.isArray(claimedOffsets)) {
            return {
                is_grounded: false,
                code: 'INVALID_OFFSETS',
                message: 'source_char_offset must be an object with start and end integer fields'
            };
        }

        const { start, end } = claimedOffsets;

        if (typeof start !== 'number' || !Number.isInteger(start) ||
            typeof end !== 'number' || !Number.isInteger(end)) {
            return {
                is_grounded: false,
                code: 'INVALID_OFFSETS',
                message: 'Offset start and end must be integers'
            };
        }

        if (start < 0) {
            return {
                is_grounded: false,
                code: 'INVALID_OFFSETS',
                message: `Offset start (${start}) cannot be negative`
            };
        }

        if (end <= start) {
            return {
                is_grounded: false,
                code: 'INVALID_OFFSETS',
                message: `Offset end (${end}) must be strictly greater than start (${start})`
            };
        }

        if (end > source_text.length) {
            return {
                is_grounded: false,
                code: 'INVALID_OFFSETS',
                message: `Offset end (${end}) exceeds source text length (${source_text.length})`
            };
        }

        // Invariant check: source_text.substring(start, end) === exact_quote
        const substring = source_text.substring(start, end);
        if (substring !== quote) {
            return {
                is_grounded: false,
                code: 'QUOTATION_MISMATCH',
                message: `Quotation at claimed offsets [${start}, ${end}] does not match exact_quote. Found '${substring}'`
            };
        }

        // Successfully verified at claimed offsets
        return {
            is_grounded: true,
            code: 'SOURCE_GROUNDED',
            message: 'Quotation verified verbatim against source text at claimed offsets',
            verified_offsets: { start, end },
            source_hash: actualHash,
            source_id: validatedSourceId
        };
    }

    // 8. If no claimed offsets were provided, calculate internal offsets
    // If the quotation occurs more than once and no disambiguating offsets were supplied, reject as ambiguous
    if (occurrences.length > 1) {
        return {
            is_grounded: false,
            code: 'AMBIGUOUS_QUOTATION',
            message: `Quotation occurs ${occurrences.length} times in source text. Disambiguating offsets are required.`
        };
    }

    // Exactly one occurrence found
    const verified = occurrences[0];
    return {
        is_grounded: true,
        code: 'SOURCE_GROUNDED',
        message: 'Quotation verified verbatim against source text (single occurrence resolved)',
        verified_offsets: verified,
        source_hash: actualHash,
        source_id: validatedSourceId
    };
}
