## 2026-10-28T20:56:05Z

```
You are Explorer M4.3 (High-Throughput Concurrency & Pipeline Design Explorer) for Milestone M4 (Image OCR Pipeline).

### 1. Mandatory Context
Read the following authoritative files:
- ORIGINAL REQUEST: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md
- PROJECT PLAN & CONTRACTS: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md
- EVIDENCE DATABASE: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db
- DB UTILITIES: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py
- PYTHON VENV: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe

### 2. Working Directory & Identity
- Working directory: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_3
- Maintain BRIEFING.md, progress.md, and DISPATCH.md.

### 3. Your Specific Mission
Design the production OCR pipeline script and verification test suite for Milestone M4:
1. Design forensics_multiagent_run\scripts\image_ocr_pipeline.py:
   - High-throughput concurrency: Given 14,353 images, design a 4-process CPU worker pool (ProcessPoolExecutor(max_workers=4)) ensuring zero ONNX runtime contention or memory leaks.
   - Contention-free database ingestion: Workers must hold zero SQLite handles and return lightweight result dicts. A dedicated writer loop in the main process writes batches of 100-200 images using db_utils.immediate_transaction().
   - Dual output schema & absolute idempotency (f(f(x)) = f(x)):
     * Table ocr_evidence: Create composite unique constraint or index:
       CREATE UNIQUE INDEX IF NOT EXISTS uq_ocr_evidence_file_engine ON ocr_evidence(file_id, engine);
     * Upsert: INSERT INTO ocr_evidence (file_id, engine, extracted_text, mean_confidence, bbox_json, fallback_triggered) VALUES (...) ON CONFLICT(file_id, engine) DO UPDATE SET ...
     * Status updates: Update file_inventory.status = 'COMPLETED' and terminal code (OCR_SUCCESS, OCR_FALLBACK_TRIGGERED, OCR_NO_TEXT).
     * Re-running with --force-reprocess must produce delta = 0 rows, 0 duplicate keys, and identical cryptographic table state hash.
   - Resumability & chunking: Process in batches with progress checkpoints, supporting --batch-size, --limit, --force-reprocess, and --workers 4.
   - Real-time telemetry: Print throughput (images/sec), elapsed time, and ETA every 100 images.
2. Design the unit and integration test suite forensics_multiagent_run\tests\test_m4_image_ocr.py:
   - Synthetic image test fixtures (clear text, low contrast triggering fallback, blank image, corrupt image).
   - Dual-row insertion test on fallback.
   - Subprocess idempotency test (double-run delta = 0).
   - Baseline database invariance check (SHA-256 untouched).
3. Specify exact CLI parameters, logging format, progress reporting, and output summary JSON (forensics_multiagent_run\reports\m4_image_ocr_report.json).

### 4. Constraints & Rules
- READ-ONLY. Do NOT modify any database, do NOT modify production code.
- Baseline whatsapp_forensics.db is strictly read-only.
- Put your comprehensive report in c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_3\ocr_concurrency_and_pipeline_design.md and deliver handoff.md. Notify orchestrator via send_message.
```
