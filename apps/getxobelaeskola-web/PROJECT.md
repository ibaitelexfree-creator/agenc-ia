# Project: WhatsApp Digital Forensic Multi-Agent Operation

## Architecture
- **Root Corpus**: `c:\Users\User\Desktop\whatsapp_chats_zip` (16,217 files, ~11.83 GB across archives and uncompressed media).
- **Production Baseline DB (Read-Only)**: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` (SHA-256: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`, 10,055 messages, 392 contacts). Mount exclusively with `?mode=ro`.
- **Target Working Directory**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`.
- **Isolated Evidence Ledger**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db` (holds inventory, job queues, extraction outputs, OCR texts, transcripts, cross-modal index, provenance reconciliations, and audit log).
- **Virtual Environment**: Isolated `.venv` managed by `uv` containing `ctranslate2`, `faster-whisper`, `rapidocr-onnxruntime`, `onnxruntime`, `pytesseract`, `pymupdf`, `python-docx`, `odfpy`, `openpyxl`, `pandas`. Zero PyTorch.
- **Hardware Profile & Allocation**:
  - GPU: NVIDIA GeForce RTX 4080 Laptop GPU (12GB VRAM, ~8.0 GB free, CUDA 13.2). 1 GPU worker for faster-whisper.
  - CPU: Intel Core i9-14900HX (24C/32T, ~39 GB RAM free). 4 CPU RapidOCR workers, 4 CPU Document workers, 2 SQLite text workers, 1 SHA-256 streaming worker, 1 Verification monitor.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Isolated uv venv & CTranslate2 CUDA | Setup `.venv`, install lean dependencies, verify CUDA 12 support without PyTorch | M0 | ORIGINAL_REQUEST §2 R1 |
| 2 | Tesseract Installation & Binding | Install Tesseract-OCR via winget, verify path and bind to pytesseract | M0 | ORIGINAL_REQUEST §2 R2 |
| 3 | SQLite Baseline Snapshot | Checkpoint WAL, run integrity check, record SHA-256 hashes, set production DB read-only | M0 | ORIGINAL_REQUEST §2 R3 |
| 4 | Evidence Ledger Initialization | Create `run_evidence.db` schema (inventory, extractions, ocr, audio, provenance, search) | M0 | ORIGINAL_REQUEST §2 R3 |
| 5 | Total File Inventory & Reconciler | Enumerate all 16,217 files, classify modality, populate durable accounting registry | M1 | ORIGINAL_REQUEST §2 R4 |
| 6 | Archive & Foreign Directory Isolation | Handle `Wasap.zip`, 357 zip files, foreign folders, flag zero-byte and extensionless files | M1 | Survey Explorer 1 |
| 7 | Text Forensics & Lexical Indexing | Read-only scan of 10,055 messages, extract entities, dues, licensing, roles, clubs | M2 | ORIGINAL_REQUEST §3 WS1 |
| 8 | Timestamp & Document Placeholder Repair | Synthesize ISO timestamps and parse `<documento omitido>` references from message content | M2 | Survey Explorer 2 |
| 9 | Document Extraction Pipeline | Extract 763 docs (PDF, docx, ods, xlsx, txt) including extensionless PDFs | M3 | ORIGINAL_REQUEST §3 WS5 |
| 10 | Primary RapidOCR Image Pipeline | 4 CPU workers processing 14,353 images with bounding boxes & character confidence | M4 | ORIGINAL_REQUEST §3 WS2 |
| 11 | Objective Tesseract OCR Fallback | Route low-confidence (<0.60) or blank non-empty images to Tesseract; retain dual outputs | M4 | ORIGINAL_REQUEST §2 R8 |
| 12 | GPU-Accelerated Audio Pipeline | 1 GPU worker running faster-whisper (cuda:0) with FFmpeg across all 397 .opus files | M5 | ORIGINAL_REQUEST §3 WS4 |
| 13 | Strict Terminal Audio Resolution | Resolve every audio file to TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, or UNSUPPORTED | M5 | ORIGINAL_REQUEST §2 R7 |
| 14 | Streaming SHA-256 Provenance Hashing | Compute chunked SHA-256 hashes for all physical files without loading into memory | M6 | ORIGINAL_REQUEST §3 WS6 |
| 15 | Attachment Provenance Reconciliation | Reconcile physical media against placeholders without Cartesian att_linker.py flaw | M6 | ORIGINAL_REQUEST §3 WS6 |
| 16 | Cross-Modal Evidence Indexing | Unified search index combining chat text, OCR extracts, audio transcripts, document text | M7 | ORIGINAL_REQUEST §3 WS7 |
| 17 | Terminal Accounting & Audit Ledger | Verify [Discovered] = [Completed] + [Failed] + [Unsupported] + [Duplicate] + [Skipped] | M7 | ORIGINAL_REQUEST §2 R4 |
| 18 | Consolidated Forensic Audit Report | Generate final forensic report with timeline, entity dossier, financial ledger, provenance | M7 | ORIGINAL_REQUEST §3 WS8 |
| 19 | E2E Test Suite Verification | Verify all 10 acceptance criteria across Tiers 1-4 with 100% pass rate | Final (P1) | ORIGINAL_REQUEST §4 |
| 20 | Adversarial Coverage Hardening | White-box stress testing, edge-case validation, forensic challenge verification (Tier 5) | Final (P2) | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Infrastructure & Baseline Snapshot | Isolated uv venv, CTranslate2 CUDA check, Tesseract winget, SQLite WAL truncate, SHA-256 baseline, run_evidence.db init | none | DONE |
| M1 | Inventory Discovery & Reconciler | Scan all files, register in run_evidence.db, classify modality, handle special files | M0 | DONE |
| M2 | Text Forensics & Lexical Indexer | Query 10,055 messages in whatsapp_forensics.db, extract entities, dues, roles, synthesize ISO timestamps | M0, M1 | DONE |
| M3 | Document Extraction Pipeline | 4 workers extracting text & tables from PDFs, DOCX, ODS, XLSX, TXT into run_evidence.db | M0, M1 | DONE |
| M4 | Image OCR Pipeline | 4 RapidOCR workers + Tesseract fallback with dual-output retention for 14,353 images | M0, M1 | IN_PROGRESS |
| M5 | GPU Audio Transcription Pipeline | 1 GPU faster-whisper worker (cuda:0) transcribing 397 .opus files with terminal status codes | M0, M1 | DONE |
| M6 | Attachment Provenance Reconciliation | Streaming SHA-256 hashing, link physical files to message placeholders (CONFIRMED, PROBABLE, UNRESOLVED) | M0, M1, M2 | DONE |
| M7 | Cross-Modal Index & Forensic Report | Unified search index, total file terminal reconciliation, final forensic audit report | M2, M3, M4, M5, M6 | IN_PROGRESS |
| Final | E2E Test Suite & Coverage Hardening | Phase 1: 100% pass on Tiers 1-4 test suite; Phase 2: Tier 5 adversarial hardening | M7 | PLANNED |

## Interface Contracts

### 1. `run_evidence.db` Schema Contract
- `file_inventory` table:
  - `file_id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `rel_path TEXT UNIQUE NOT NULL`
  - `abs_path TEXT NOT NULL`
  - `file_size INTEGER NOT NULL`
  - `sha256 TEXT`
  - `modality TEXT NOT NULL` -- AUDIO, IMAGE, VIDEO, DOCUMENT, CHAT_TXT, DATABASE, ARCHIVE, OTHER
  - `status TEXT NOT NULL DEFAULT 'PENDING'` -- PENDING, PROCESSING, COMPLETED, FAILED, UNSUPPORTED, DUPLICATE, SKIPPED
  - `terminal_code TEXT`
  - `error_message TEXT`
  - `mtime TEXT`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `ocr_evidence` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `file_id INTEGER REFERENCES file_inventory(file_id)`
  - `engine TEXT NOT NULL` -- RAPIDOCR, TESSERACT
  - `extracted_text TEXT`
  - `mean_confidence REAL`
  - `bbox_json TEXT`
  - `fallback_triggered INTEGER DEFAULT 0`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `audio_evidence` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `file_id INTEGER REFERENCES file_inventory(file_id)`
  - `duration_sec REAL`
  - `language TEXT`
  - `language_probability REAL`
  - `transcript_text TEXT`
  - `segments_json TEXT`
  - `terminal_code TEXT NOT NULL` -- TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, UNSUPPORTED_CODEC
  - `error_code TEXT`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `document_evidence` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `file_id INTEGER REFERENCES file_inventory(file_id)`
  - `doc_type TEXT NOT NULL` -- PDF, DOCX, ODS, XLSX, TXT
  - `extracted_text TEXT`
  - `page_count INTEGER`
  - `tables_json TEXT`
  - `metadata_json TEXT`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `text_forensic_entities` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `message_id TEXT NOT NULL`
  - `sender TEXT`
  - `timestamp_iso TEXT`
  - `entity_type TEXT NOT NULL` -- CLUB, PERSON, CIF, IBAN, CUOTA, TARIFF, ROLE, LICENSE
  - `entity_value TEXT NOT NULL`
  - `context_snippet TEXT`
  - `confidence REAL`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `attachment_links` table:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `message_id TEXT NOT NULL`
  - `file_id INTEGER REFERENCES file_inventory(file_id)`
  - `match_classification TEXT NOT NULL` -- CONFIRMED, PROBABLE, UNRESOLVED, CONTRADICTED
  - `match_method TEXT NOT NULL` -- EXACT_FILENAME, TIMESTAMP_PROXIMITY, HASH_MATCH, HEURISTIC
  - `confidence_score REAL`
  - `evidence_notes TEXT`
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- `cross_modal_index` (SQLite FTS5 virtual table):
  - `content_id TEXT` -- e.g. MSG_0001208, OCR_1402, AUDIO_392, DOC_045
  - `modality TEXT`
  - `source_ref TEXT`
  - `sender_or_creator TEXT`
  - `timestamp_iso TEXT`
  - `indexed_text TEXT`

## Code Layout
All production code, scripts, runners, and evidence databases live strictly under:
`c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\`
- `forensics_multiagent_run\`
  - `.venv\` (isolated uv environment)
  - `run_evidence.db` (isolated execution SQLite database)
  - `scripts\`
    - `env_setup.py` (M0: environment verification, Tesseract check, baseline snapshot)
    - `inventory_scanner.py` (M1: inventory discovery, terminal accounting initialization)
    - `text_forensics.py` (M2: read-only text analysis, entity extraction, timestamp repair)
    - `document_extractor.py` (M3: document parsing for PDF, DOCX, ODS, XLSX, TXT)
    - `ocr_worker.py` (M4: RapidOCR + Tesseract fallback dual-engine worker)
    - `audio_worker.py` (M5: GPU faster-whisper CTranslate2 worker)
    - `provenance_reconciler.py` (M6: SHA-256 chunked hashing & attachment link reconciliation)
    - `cross_modal_indexer.py` (M7: FTS5 unified search indexing)
    - `audit_report_generator.py` (M7: forensic report and reconciliation audit output)
    - `monitor_telemetry.py` (continuous telemetry and queue metrics)
  - `tests\`
    - `test_runner.py` (E2E test suite runner across Tiers 1-4)
    - `test_tier1_features.py`
    - `test_tier2_boundaries.py`
    - `test_tier3_pairwise.py`
    - `test_tier4_scenarios.py`
    - `test_tier5_adversarial.py`
  - `reports\`
    - `FINAL_FORENSIC_AUDIT_REPORT.md`
    - `RECONCILIATION_ACCOUNTING_LEDGER.csv`
    - `CROSS_MODAL_INDEX_SUMMARY.md`
