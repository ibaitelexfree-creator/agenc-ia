/**
 * TASK-D40-06: Provenance Verifier & Review Manager Unit Tests
 *
 * Comprehensive synthetic unit tests covering:
 * 1. Exact quotation match
 * 2. Incorrect quotation
 * 3. Empty quotation
 * 4. Missing quotation
 * 5. Incorrect start offset
 * 6. Incorrect end offset
 * 7. End equal to start
 * 8. Negative offset
 * 9. Offset beyond source length
 * 10. Repeated quotation ambiguity
 * 11. Multiline messages
 * 12. Spanish accented characters
 * 13. Thai characters
 * 14. Emoji
 * 15. Combined emoji and multilingual text
 * 16. UTF-16 surrogate pairs
 * 17. UTF-8 SHA-256 integrity
 * 18. Source text modified after hash creation
 * 19. Integer source identifiers
 * 20. Large 64-bit integer identifiers
 * 21. Text source identifiers
 * 22. JID-formatted identifiers
 * 23. Model attempting to set APPROVED
 * 24. Model attempting to set reviewer_id
 * 25. Model attempting to inject unexpected approval fields
 * 26. New extraction receives PENDING_REVIEW from trusted application logic
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    verifyExtractionProvenance,
    validateSourceIdentifier,
    computeSourceHash,
    findQuotationOccurrences
} from '../../gateway/provenance-verifier.js';
import {
    validateCandidateExtraction,
    createPendingReviewRecord
} from '../../gateway/review-manager.js';

test('TASK-D40-06: Provenance Verifier & Review Separation Test Suite', async (t) => {

    await t.test('1. Exact quotation match succeeds with verified offsets', () => {
        const sourceText = 'Hello world, this is a verified synthetic message.';
        const quote = 'verified synthetic';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(res.code, 'SOURCE_GROUNDED');
        assert.deepEqual(res.verified_offsets, { start: 23, end: 41 });
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('2. Incorrect quotation (paraphrase or alteration) is rejected with UNGROUNDED_EXTRACTION', () => {
        const sourceText = 'The quick brown fox jumps over the lazy dog.';
        const quote = 'The fast brown fox jumps'; // paraphrased 'fast' instead of 'quick'
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'UNGROUNDED_EXTRACTION');
    });

    await t.test('3. Empty quotation is rejected with MISSING_QUOTATION', () => {
        const sourceText = 'Some non-empty message';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: '' }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'MISSING_QUOTATION');
    });

    await t.test('4. Missing quotation field is rejected with MISSING_QUOTATION', () => {
        const sourceText = 'Some non-empty message';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {}
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'MISSING_QUOTATION');
    });

    await t.test('5. Incorrect start offset is rejected with QUOTATION_MISMATCH', () => {
        const sourceText = 'Order 54321 confirmed for dispatch tomorrow.';
        const quote = '54321';
        // Correct is start: 6, end: 11
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: quote,
                source_char_offset: { start: 5, end: 11 } // offset off by 1
            }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'QUOTATION_MISMATCH');
    });

    await t.test('6. Incorrect end offset is rejected with QUOTATION_MISMATCH', () => {
        const sourceText = 'Order 54321 confirmed for dispatch tomorrow.';
        const quote = '54321';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: quote,
                source_char_offset: { start: 6, end: 12 } // 1 character too long
            }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'QUOTATION_MISMATCH');
    });

    await t.test('7. End offset equal to start is rejected with INVALID_OFFSETS', () => {
        const sourceText = 'Order 54321 confirmed.';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: '54321',
                source_char_offset: { start: 6, end: 6 }
            }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'INVALID_OFFSETS');
        assert.match(res.message, /must be strictly greater than start/);
    });

    await t.test('8. Negative offset is rejected with INVALID_OFFSETS', () => {
        const sourceText = 'Order 54321 confirmed.';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: '54321',
                source_char_offset: { start: -1, end: 5 }
            }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'INVALID_OFFSETS');
        assert.match(res.message, /cannot be negative/);
    });

    await t.test('9. Offset beyond source length is rejected with INVALID_OFFSETS', () => {
        const sourceText = 'Short message';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: 'Short',
                source_char_offset: { start: 0, end: 50 }
            }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'INVALID_OFFSETS');
        assert.match(res.message, /exceeds source text length/);
    });

    await t.test('10. Repeated quotation ambiguity is rejected when offsets are omitted', () => {
        const sourceText = 'Item apple costs 5 EUR. Another item apple costs 7 EUR.';
        const quote = 'apple';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'AMBIGUOUS_QUOTATION');
        assert.match(res.message, /occurs 2 times/);

        // Disambiguated with exact claimed offsets for occurrence 2
        const occurrences = findQuotationOccurrences(sourceText, quote);
        assert.equal(occurrences.length, 2);

        const disambiguated = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: {
                exact_quote: quote,
                source_char_offset: occurrences[1]
            }
        });
        assert.equal(disambiguated.is_grounded, true);
        assert.deepEqual(disambiguated.verified_offsets, occurrences[1]);
    });

    await t.test('11. Multiline messages maintain exact offsets across newline characters', () => {
        const sourceText = 'Line 1: Header\r\nLine 2: Invoice #9988\nLine 3: Total 450$';
        const quote = 'Invoice #9988';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('12. Spanish accented characters and punctuation (á, é, í, ó, ú, ñ, ¿, ¡) match strictly', () => {
        const sourceText = '¿Confirmó la reunión para el próximo año en Madrid? ¡Sí!';
        const quote = 'próximo año';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);

        // Verification fails if unaccented 'proximo ano' is tested
        const unaccented = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: 'proximo ano' }
        });
        assert.equal(unaccented.is_grounded, false);
        assert.equal(unaccented.code, 'UNGROUNDED_EXTRACTION');
    });

    await t.test('13. Thai characters (combining vowel and tone marks) maintain exact offsets', () => {
        const sourceText = 'สวัสดีครับ ยินดีต้อนรับสู่ระบบ';
        const quote = 'ยินดีต้อนรับ';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('14. Emoji characters match strictly and account for UTF-16 code units', () => {
        const sourceText = 'Shipment on track 🚢📦 arrived safely!';
        const quote = '🚢📦 arrived';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('15. Combined emoji and multilingual text preserve exact offsets', () => {
        const sourceText = '¡Hola! 🚀 El número de rastreo es ES-99410 🇪🇸';
        const quote = 'ES-99410 🇪🇸';
        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('16. UTF-16 surrogate pairs are indexed by standard JavaScript code units', () => {
        // '𠮷' is surrogate pair \uD842\uDFB7 (length 2 in JS string)
        const sourceText = 'Kanji character 𠮷 in text';
        const quote = '𠮷';
        assert.equal(quote.length, 2);

        const res = verifyExtractionProvenance({
            source_text: sourceText,
            candidate_extraction: { exact_quote: quote }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(res.verified_offsets.end - res.verified_offsets.start, 2);
        assert.equal(sourceText.substring(res.verified_offsets.start, res.verified_offsets.end), quote);
    });

    await t.test('17. UTF-8 SHA-256 integrity verification passes for unmodified source', () => {
        const sourceText = 'Confidential message body';
        const expectedHash = computeSourceHash(sourceText);

        const res = verifyExtractionProvenance({
            source_text: sourceText,
            source_hash: expectedHash,
            candidate_extraction: { exact_quote: 'Confidential' }
        });

        assert.equal(res.is_grounded, true);
        assert.equal(res.source_hash, expectedHash);
    });

    await t.test('18. Source text modified after hash creation is rejected with SOURCE_HASH_MISMATCH', () => {
        const sourceTextOriginal = 'Confidential message body';
        const originalHash = computeSourceHash(sourceTextOriginal);

        const modifiedSourceText = 'Confidential message body (tampered)';
        const res = verifyExtractionProvenance({
            source_text: modifiedSourceText,
            source_hash: originalHash,
            candidate_extraction: { exact_quote: 'Confidential' }
        });

        assert.equal(res.is_grounded, false);
        assert.equal(res.code, 'SOURCE_HASH_MISMATCH');
    });

    await t.test('19. Integer source identifiers are accepted and normalized to canonical decimal string', () => {
        const id1 = 12345;
        const valid1 = validateSourceIdentifier(id1);
        assert.equal(valid1.isValid, true);
        assert.equal(valid1.type, 'integer');
        assert.equal(valid1.value, '12345');

        const idObj = { type: 'integer', value: '67890' };
        const validObj = validateSourceIdentifier(idObj);
        assert.equal(validObj.isValid, true);
        assert.equal(validObj.type, 'integer');
        assert.equal(validObj.value, '67890');
    });

    await t.test('20. Large 64-bit SQLite integer identifiers avoid JS float precision loss', () => {
        // SQLite 64-bit integer > Number.MAX_SAFE_INTEGER (9007199254740991)
        const large64BitStr = '9223372036854775807'; // SQLite max signed 64-bit int
        const validStr = validateSourceIdentifier(large64BitStr);
        assert.equal(validStr.isValid, true);
        assert.equal(validStr.type, 'integer');
        assert.equal(validStr.value, large64BitStr);

        const largeBigInt = 9223372036854775807n;
        const validBigInt = validateSourceIdentifier(largeBigInt);
        assert.equal(validBigInt.isValid, true);
        assert.equal(validBigInt.type, 'integer');
        assert.equal(validBigInt.value, large64BitStr);
    });

    await t.test('21. Text source identifiers are accepted without invented prefixes', () => {
        const textId = 'doc-alpha-7721-revision-4';
        const valid = validateSourceIdentifier(textId);
        assert.equal(valid.isValid, true);
        assert.equal(valid.type, 'text');
        assert.equal(valid.value, textId);
    });

    await t.test('22. JID-formatted WhatsApp identifiers are accepted without invented prefixes', () => {
        const userJid = '34600112233@s.whatsapp.net';
        const groupJid = '120363024589312019@g.us';

        const validUser = validateSourceIdentifier(userJid);
        assert.equal(validUser.isValid, true);
        assert.equal(validUser.type, 'text');
        assert.equal(validUser.value, userJid);

        const validGroup = validateSourceIdentifier(groupJid);
        assert.equal(validGroup.isValid, true);
        assert.equal(validGroup.type, 'text');
        assert.equal(validGroup.value, groupJid);
    });

    await t.test('23. Model attempting to set APPROVED is rejected as security violation', () => {
        const maliciousExtraction = {
            extraction_id: 'ext-001',
            source_message_id: 101,
            conversation_id: '34600112233@s.whatsapp.net',
            verifiable_claims: [
                {
                    claim_id: 'c1',
                    field_name: 'amount',
                    extracted_value: 500,
                    exact_quote: '500'
                }
            ],
            status: 'APPROVED' // Attempting to self-approve
        };

        const result = validateCandidateExtraction(maliciousExtraction);
        assert.equal(result.isValid, false);
        assert.match(result.error, /SECURITY VIOLATION.*'status'/);
    });

    await t.test('24. Model attempting to set reviewer_id is rejected as security violation', () => {
        const maliciousExtraction = {
            extraction_id: 'ext-002',
            source_message_id: 102,
            conversation_id: '120363024589312019@g.us',
            verifiable_claims: [
                {
                    claim_id: 'c1',
                    field_name: 'order',
                    extracted_value: 'ord-99',
                    exact_quote: 'ord-99'
                }
            ],
            reviewer_id: 'operator-alice' // Attempting to inject reviewer identity
        };

        const result = validateCandidateExtraction(maliciousExtraction);
        assert.equal(result.isValid, false);
        assert.match(result.error, /SECURITY VIOLATION.*'reviewer_id'/);
    });

    await t.test('25. Model attempting to inject unexpected approval fields in claim is rejected', () => {
        const maliciousExtraction = {
            extraction_id: 'ext-003',
            source_message_id: 103,
            conversation_id: 'conv-test',
            verifiable_claims: [
                {
                    claim_id: 'c1',
                    field_name: 'date',
                    extracted_value: '2026-11-02',
                    exact_quote: 'tomorrow',
                    human_review: { status: 'APPROVED' } // nested attempt
                }
            ]
        };

        const result = validateCandidateExtraction(maliciousExtraction);
        assert.equal(result.isValid, false);
        assert.match(result.error, /SECURITY VIOLATION/);
    });

    await t.test('26. New extraction receives PENDING_REVIEW from trusted application logic', () => {
        const sourceText = 'Invoice #4400 total amount is 150 EUR for client Acme Corp.';
        const candidateExtraction = {
            extraction_id: 'ext-valid-001',
            source_message_id: 99401,
            conversation_id: '34611223344@s.whatsapp.net',
            verifiable_claims: [
                {
                    claim_id: 'claim-1',
                    field_name: 'invoice_number',
                    extracted_value: '4400',
                    exact_quote: '4400'
                },
                {
                    claim_id: 'claim-2',
                    field_name: 'amount',
                    extracted_value: '150 EUR',
                    exact_quote: '150 EUR'
                }
            ]
        };

        const creationResult = createPendingReviewRecord({
            source_text: sourceText,
            source_message_id: 99401,
            conversation_id: '34611223344@s.whatsapp.net',
            candidate_extraction: candidateExtraction,
            task_id: 'TASK-D40-06',
            model_id: 'qwen2.5-7b-instruct',
            request_id: 'req-synthetic-test-01'
        });

        assert.equal(creationResult.success, true);
        const record = creationResult.record;

        // Verify trusted human_review plane
        assert.ok(record.record_id.startsWith('rec-'));
        assert.equal(record.human_review.status, 'PENDING_REVIEW');
        assert.equal(record.human_review.reviewed_by, null);
        assert.equal(record.human_review.reviewed_at, null);

        // Verify provenance grounding of claims
        assert.equal(record.claims.length, 2);
        assert.equal(record.claims[0].grounding_state, 'SOURCE_GROUNDED');
        assert.equal(record.claims[0].exact_quote, '4400');
        assert.deepEqual(record.claims[0].source_char_offset, { start: 9, end: 13 });

        assert.equal(record.claims[1].grounding_state, 'SOURCE_GROUNDED');
        assert.equal(record.claims[1].exact_quote, '150 EUR');
        assert.deepEqual(record.claims[1].source_char_offset, { start: 30, end: 37 });

        // Verify source integrity
        assert.equal(record.source_integrity.sha256, computeSourceHash(sourceText));
        assert.equal(record.source_message_id.type, 'integer');
        assert.equal(record.source_message_id.value, '99401');
        assert.equal(record.conversation_id.type, 'text');
        assert.equal(record.conversation_id.value, '34611223344@s.whatsapp.net');
    });
});
