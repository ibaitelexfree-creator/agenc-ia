# Original User Request

## Initial Request — 2026-10-28T15:12:35Z

Use a very large team of agents.

# Teamwork Project Prompt — Final Execution Blueprint

> Status: Launched
> Goal: Multi-agent parallel WhatsApp forensic processing operation
> Requested team: Large, genuinely parallel team of specialized agents coordinated by a central orchestrator

Execute a complete, bounded, highly-parallel multi-agent WhatsApp digital forensic operation across the existing project corpus and source archives (c:\Users\User\Desktop\whatsapp_chats_zip).

Working directory: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run
Integrity mode: development

---

## 1. Workstation Hardware Profile & Measured Capacity

- Hardware Platform: ASUS ROG Strix SCAR 16
- GPU: NVIDIA GeForce RTX 4080 Laptop GPU (12,282 MiB VRAM total, ~8.4 GB free VRAM, CUDA 13.2 driver 595.79)
- RAM: 31.8 GB physical RAM (~18 GB free)
- Disk: C:\ drive with ~110.3 GB free disk space
- FFmpeg Toolpath: C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe (validated functional)
- Worker Allocation Budget & Initial Concurrency Limits:
  - Audio Transcription Worker: 1 GPU worker (faster-whisper via CTranslate2 cuda:0, float16/int8_float16). Do NOT install PyTorch solely for faster-whisper. Verify CTranslate2 CUDA support independently. Dynamic concurrency scale-up is strictly locked behind VRAM/thermal monitoring (< 75°C, < 8.0 GB VRAM).
  - RapidOCR Image Workers: 4 parallel CPU/ONNX workers.
  - Document Extraction Workers: 4 parallel CPU workers (PyMuPDF, python-docx, odfpy, pandas/openpyxl).
  - Text Forensics & Lexical Indexers: 2 parallel read-only SQLite workers.
  - Integrity, Provenance & Reconciliation Worker: 1 dedicated I/O worker (streaming SHA-256 chunked hashing).
  - Verification, Metrics & Error Monitor: 1 autonomous monitor reading progress logs, queue states, and thermal/VRAM telemetry.

---

## 2. Mandatory Forensic Execution Rules & Safeguards

### Rule 1: Lean Dependencies & CTranslate2 Verification
Do not install heavy PyTorch wheels solely for faster-whisper. Provision an isolated virtual environment (.venv) managed by uv containing only ctranslate2, faster-whisper, rapidocr-onnxruntime, onnxruntime, pytesseract, pymupdf, python-docx, odfpy, openpyxl, pandas. Verify CTranslate2 CUDA compute support independently before queuing GPU audio tasks.

### Rule 2: Tesseract Verification & Permission Protocol
The user has explicitly authorized Tesseract installation. Proceed to install Tesseract-OCR via winget (winget install UB-Mannheim.TesseractOCR --accept-source-agreements --accept-package-agreements). After installation, verify the executable path and bind it directly to pytesseract.pytesseract.tesseract_cmd.

### Rule 3: SQLite Baseline & WAL/SHM Discipline
Before any worker starts, establish an immutable SQLite baseline snapshot:
- Execute PRAGMA wal_checkpoint(TRUNCATE); and PRAGMA integrity_check; on whatsapp_forensics.db under a safe read-only lock.
- Capture SHA-256 baseline hashes of whatsapp_forensics.db, whatsapp_forensics.db-wal, and whatsapp_forensics.db-shm.
- Treat the production database as strictly read-only.
- All worker write operations, interim task checkpoints, extraction outputs, and candidate linkages must write exclusively to an isolated SQLite ledger (forensics_multiagent_run\run_evidence.db).

### Rule 4: Total File Reconciler & Terminal Accounting
Do not assume every discovered file is valid or processable. Every discovered file in the inventory must resolve to an explicit terminal category:
[Discovered] = [Supported & Completed] + [Supported & Failed] + [Unsupported Format / 0-byte] + [Exact SHA-256 Duplicate] + [Skipped via Guardrail].

### Rule 5: Hardware-Gated Dynamic Concurrency
Launch independent CPU pipelines (Text, Documents, Images) and 1 GPU Audio worker concurrently once inventory discovery completes. Measure GPU VRAM, RAM utilization, temperature, and throughput continuously before considering adding any secondary worker.

### Rule 6: Durable Resumability & Idempotent Checkpoints
Each worker must consult run_evidence.db / durable task registry before processing any file. If a file's SHA-256 hash has a COMPLETED terminal status with valid output, it must be skipped immediately without repeating execution or overwriting data.

### Rule 7: Strict Terminal Audio Status
Do not claim 100% audio transcription coverage until every discovered audio file has a verified terminal status (TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, UNSUPPORTED_CODEC). Failed audio clips must retain explicit error codes.

### Rule 8: Objective OCR Fallback & Multi-Engine Output Retention
RapidOCR runs as primary. If average character confidence is below 0.60, or if zero text is extracted from a non-blank image, automatically route the image to Tesseract fallback. Store BOTH RapidOCR and Tesseract outputs with bounding boxes and confidence scores in the evidence database.

### Rule 9: Objective Progress Reporting
Calculate progress percentages exclusively against [Completed / Total]. Display active file names, modality throughput (files/sec), active retries, failed items, and dynamic time-to-completion (ETA) in real-time.

### Rule 10: Autonomous Milestone Progression
Proceed continuously from inventory through extraction, cross-modal indexing, reconciliation, and audit verification. Do not halt after planning.

---

## 3. Workstreams & Scope of Work

### Workstream 1: Text Forensics & Lexical Indexing
- Read-only queries across all 10,055 messages in whatsapp_forensics.db.
- Targeted lexical and semantic analysis for entities, club names (Getxo Bela Eskola, Pakea), licensing, roles, dues, and membership assertions.

### Workstream 2: RapidOCR Image Pipeline
- Batch OCR processing across all discovered images.
- Extraction of text blocks, bounding boxes, and mean confidence scores.

### Workstream 3: Tesseract Fallback Pipeline
- Triggered dynamically when RapidOCR output fails confidence or completeness checks.
- Dual-output logging for evidentiary auditability.

### Workstream 4: GPU-Accelerated Audio Pipeline
- GPU-accelerated transcription using faster-whisper (CTranslate2 cuda:0).
- Timestamped segments, language detection, and audio duration metrics.

### Workstream 5: Document Extraction Pipeline
- Extraction of PDFs (PyMuPDF), Word documents (python-docx), spreadsheets (pandas/openpyxl/odfpy), and plain text.
- Tabular data retention and metadata capture.

### Workstream 6: Source Integrity & Attachment Provenance
- Streaming SHA-256 hashing across all physical media in com.whatsapp and Whatsapp web Extraccion manual....
- Reconcile physical files against message placeholders without running att_linker.py.
- Classify candidate links into CONFIRMED, PROBABLE, UNRESOLVED, and CONTRADICTED.

### Workstream 7: Cross-Modal Evidence Indexing
- Unified search index combining chat text, OCR extracts, audio transcripts, and document contents.

### Workstream 8: Autonomous Verification & Audit Reporting
- Continuous status monitoring and final consolidated forensic audit report.

---

## 4. Acceptance Criteria

- [ ] Baseline SQLite checkpoint executed cleanly; production database remains bit-level read-only throughout.
- [ ] Isolated run database (run_evidence.db) created in forensics_multiagent_run.
- [ ] No installation of redundant PyTorch; CTranslate2 GPU execution verified independently.
- [ ] Tesseract verified and configured before fallback processing begins.
- [ ] All discovered files categorized into mutually exclusive terminal states with zero uncounted files.
- [ ] Concurrent safe execution of Text, Document, Image, and Audio pipelines without VRAM or memory exhaustion.
- [ ] 100% of discovered audio files cataloged with verified terminal transcription status.
- [ ] Both OCR engine outputs preserved when fallback occurs.
- [ ] Real-time progress reporting reflects true completion percentages, throughput, and ETA.
- [ ] Final consolidated evidence ledger and forensic audit report generated upon completion.
