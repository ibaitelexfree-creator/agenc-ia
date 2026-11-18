# Master Execution Plan: WhatsApp Digital Forensic Operation

## Architecture & Topology
Following the Project Pattern with Dual Track (Implementation & E2E Testing).

### Track 1: Implementation Track
- **M0: Infrastructure, Environment & Baseline Snapshot**
  - Provision isolated uv venv at `forensics_multiagent_run\.venv`.
  - Install dependencies: ctranslate2, faster-whisper, rapidocr-onnxruntime, onnxruntime, pytesseract, pymupdf, python-docx, odfpy, openpyxl, pandas.
  - Verify CTranslate2 CUDA support independently.
  - Install Tesseract-OCR via winget, verify path and bind to pytesseract.
  - Execute PRAGMA wal_checkpoint(TRUNCATE) and integrity check on `whatsapp_forensics.db`. Compute baseline SHA-256 hashes. Set production DB read-only.
  - Initialize `run_evidence.db` schema in `forensics_multiagent_run`.
- **M1: Inventory Discovery & Total File Reconciler Registry**
  - Enumerate all physical files across `com.whatsapp`, `Whatsapp web Extraccion manual...`, and all archives in `c:\Users\User\Desktop\whatsapp_chats_zip`.
  - Register all items into `run_evidence.db` inventory table with path, extension, file size, modality classification, and initial status PENDING.
- **M2: Text Forensics & Lexical Indexer**
  - 2 read-only workers querying 10,055 messages in `whatsapp_forensics.db`.
  - Extract entities, club names, roles, dues, membership assertions, timeline analysis into `run_evidence.db`.
- **M3: Document Extraction Pipeline**
  - 4 parallel CPU workers extracting PDFs, Word documents, spreadsheets, text files into structured tables and text chunks in `run_evidence.db`.
- **M4: Image OCR Pipeline**
  - 4 parallel RapidOCR workers processing images with character confidence scoring.
  - Fallback to Tesseract if confidence < 0.60 or zero text on non-blank images.
  - Retain dual-engine outputs in `run_evidence.db`.
- **M5: GPU-Accelerated Audio Pipeline**
  - 1 GPU worker running faster-whisper (CTranslate2 cuda:0, float16/int8_float16).
  - FFmpeg at `C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe`.
  - Strict terminal audio status for every audio file (TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, UNSUPPORTED_CODEC).
- **M6: Source Integrity & Attachment Provenance**
  - 1 dedicated I/O worker streaming SHA-256 chunked hashing.
  - Reconcile physical files against message placeholders without att_linker.py.
  - Classify candidate links into CONFIRMED, PROBABLE, UNRESOLVED, CONTRADICTED.
- **M7: Cross-Modal Evidence Indexing & Audit Reporting**
  - Unified search index combining chat text, OCR extracts, audio transcripts, and document contents.
  - Total file terminal reconciler validation.
  - Forensic audit report generation.

### Track 2: E2E Testing Track
- Test harness exercising `run_evidence.db` queries, CLI interfaces, and verify all 10 acceptance criteria across Tiers 1 to 4.
- Phase 2: Adversarial coverage hardening (Tier 5).
