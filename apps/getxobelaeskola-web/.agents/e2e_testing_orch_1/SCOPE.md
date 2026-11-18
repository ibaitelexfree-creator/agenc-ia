# Scope: E2E Testing Track

## Mission
Design and implement the comprehensive, opaque-box E2E test suite in `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\` derived directly from user requirements in `ORIGINAL_REQUEST.md` and `TEST_INFRA.md`. Validate all 10 acceptance criteria across Tiers 1 to 4 and publish `TEST_READY.md`.

## Source of Truth & Rules
- `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\TEST_INFRA.md`
- Working Directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\e2e_testing_orch_1`
- Test Output Directory: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests`

## Acceptance Criteria for E2E Testing Track
1. Test infrastructure and runner established (`test_runner.py`).
2. Tier 1: Feature coverage tests (≥5 tests per feature across all 11 features, total ≥55 tests).
3. Tier 2: Boundary and corner cases (empty files, 0-byte video, extensionless PDFs, corrupted audio, etc. ≥55 tests).
4. Tier 3: Cross-feature pairwise interactions (≥15 tests).
5. Tier 4: Real-world forensic scenario tests (≥5 scenarios).
6. Progressive testability: tests test interfaces and database states without assuming implementation internals.
7. Total tests count ≥130 tests.
8. When complete, publish `TEST_READY.md` at project root with full coverage checklist.
