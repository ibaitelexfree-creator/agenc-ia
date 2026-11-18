## 2026-10-28T18:20:18Z

You are Explorer M3.3 (Concurrency Architecture & Worker Design Explorer) for Milestone M3 (Document Extraction Pipeline).

### 1. Mandatory Context
Read the following authoritative files:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`
- DB UTILITIES: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py`

### 2. Working Directory & Identity
- Your working directory is: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_3`
- Maintain `BRIEFING.md`, `progress.md`, and `DISPATCH.md` in your directory.

### 3. Your Specific Mission
Design the production extractor script and verification suite for Milestone M3:
1. Design `forensics_multiagent_run\scripts\document_extractor.py`:
   - Concurrency model: 4 worker processes/threads (ProcessPoolExecutor vs ThreadPoolExecutor) given SQLite WAL write contention and CPU/IO characteristics.
   - Batch database write discipline: How to extract documents in parallel while batching writes or using worker queues to prevent SQLite `busy` timeouts. Enforce `db_utils.immediate_transaction()`.
   - Schema enforcement: Table `document_evidence` in `run_evidence.db` and updating `file_inventory` status (`PENDING` -> `COMPLETED` / `FAILED`, `terminal_code`).
   - Absolute idempotency: Composite unique constraint or `ON CONFLICT` clause so re-running `document_extractor.py` yields zero duplicate rows, zero ID churn, and exact invariance ($f(f(x)) = f(x)$).
   - Resumability: Process only `modality = 'DOCUMENT'` where `status = 'PENDING'` or allow `--force-reprocess`.
2. Design the unit and integration test suite `forensics_multiagent_run\tests\test_m3_document_extraction.py`:
   - Mock/fixture test cases for PDF, DOCX, ODS, XLSX, TXT.
   - Idempotency test (double-run delta = 0).
   - Real database integration test on a sample subset.
   - Baseline database invariance check (SHA-256 untouched).
3. Specify exact CLI parameters, logging format, progress reporting, and output summary JSON (`forensics_multiagent_run\reports\m3_document_extraction_report.json`).

### 4. Constraints & Rules
- READ-ONLY. Do NOT modify any database, do NOT modify production code.
- Baseline `whatsapp_forensics.db` is strictly read-only.
- Put your comprehensive report in `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_3\concurrency_and_pipeline_design.md` and deliver `handoff.md`.
- When complete, notify orchestrator via `send_message`.
