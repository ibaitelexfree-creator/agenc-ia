# E2E Test Infra: WhatsApp Digital Forensic Multi-Agent Operation

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and user-facing requirements.
- Validates the complete pipeline against all 10 acceptance criteria and safeguards.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Baseline SQLite Snapshot & Read-Only Invariant | ORIGINAL_REQUEST §2 R3 | 5 | 5 | ✓ |
| 2 | Isolated uv venv & CTranslate2 CUDA | ORIGINAL_REQUEST §2 R1 | 5 | 5 | ✓ |
| 3 | Tesseract OCR Availability & Fallback | ORIGINAL_REQUEST §2 R2, R8 | 5 | 5 | ✓ |
| 4 | Total File Reconciler & Terminal Accounting | ORIGINAL_REQUEST §2 R4 | 5 | 5 | ✓ |
| 5 | Text Forensics & Entity Extraction | ORIGINAL_REQUEST §3 WS1 | 5 | 5 | ✓ |
| 6 | Document Extraction Pipeline | ORIGINAL_REQUEST §3 WS5 | 5 | 5 | ✓ |
| 7 | RapidOCR + Dual OCR Output Retention | ORIGINAL_REQUEST §3 WS2, R8 | 5 | 5 | ✓ |
| 8 | GPU Audio Pipeline & Strict Terminal Codes | ORIGINAL_REQUEST §3 WS4, R7 | 5 | 5 | ✓ |
| 9 | Streaming SHA-256 & Provenance Links | ORIGINAL_REQUEST §3 WS6 | 5 | 5 | ✓ |
| 10 | Cross-Modal FTS5 Search & Unified Queries | ORIGINAL_REQUEST §3 WS7 | 5 | 5 | ✓ |
| 11 | Consolidated Forensic Audit Report & Ledger | ORIGINAL_REQUEST §3 WS8 | 5 | 5 | ✓ |

## Test Architecture
- **Location**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\`
- **Runner**: `python -m unittest discover -s tests -p "test_*.py"` using `.venv` Python
- **Pass/Fail Semantics**: All test suites must exit with code 0; zero failed assertions; zero unhandled exceptions.
- **Test File Layout**:
  - `test_runner.py`: Master test orchestrator
  - `test_tier1_features.py`: Happy path coverage for each of the 11 forensic features (55+ tests)
  - `test_tier2_boundaries.py`: Boundary and corner cases (empty files, 0-byte video, extensionless PDFs, max length messages, corrupted audio) (55+ tests)
  - `test_tier3_pairwise.py`: Cross-feature combinations (e.g. document text + FTS search, audio transcript + entity extraction, OCR fallback + bounding box retention) (15+ tests)
  - `test_tier4_scenarios.py`: End-to-end forensic investigator workflow scenarios (e.g. query all Pakea dues payments, audit all audio voice notes from Urko, verify total file ledger sums) (10+ tests)
  - `test_tier5_adversarial.py`: Adversarial stress tests (concurrency races, corrupt SQLite WAL locks, VRAM overflow guardrails)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Pakea & Getxo Bela Eskola Entity & Dues Audit | Text Forensics, FTS5 Search, Document Extraction | High |
| 2 | Urko Audio Voice Note Transcription & Keyword Audit | GPU Audio Pipeline, FFmpeg, Strict Terminal Codes, FTS5 | High |
| 3 | Bank Statement & Receipt Reconciliation (OCR + Docs) | Document Extraction (Extensionless PDFs), RapidOCR, Tesseract Fallback | High |
| 4 | Media Provenance & Attachment Link Audit | SHA-256 Hashing, Provenance Links, Message Placeholders | High |
| 5 | Total Forensic Reconciler Terminal Balance Verification | Terminal Accounting Ledger, Zero Leftovers | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (≥55 tests)
- Tier 2: ≥5 per feature (≥55 tests)
- Tier 3: ≥15 pairwise interaction tests
- Tier 4: ≥5 real-world forensic scenario tests
- **Total Minimum Target: ≥130 E2E tests**
