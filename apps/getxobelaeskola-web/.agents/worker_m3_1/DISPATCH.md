## 2026-10-29T03:22:07Z

You are Worker M3 (Document Extraction Worker) for Milestone M3 (Document Extraction Pipeline).

### 1. Mandatory Context & Inputs
You MUST read the following authoritative files before starting any implementation:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- EXPLORER M3.1 PROFILE: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\document_inventory_profile.md`
- EXPLORER M3.2 PARSING STRATEGY: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_2\parsing_and_table_strategy.md`
- EXPLORER M3.3 CONCURRENCY & ARCHITECTURE: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_3\concurrency_and_pipeline_design.md`
- DB UTILITIES: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`

### 2. Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### 3. File Ownership & Boundaries
You exclusively own and may create/modify:
- `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\document_extractor.py`
- `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m3_document_extraction.py`
- `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m3_document_extraction_report.json`
- State files in your working directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m3_1\`
Do NOT modify `whatsapp_forensics.db` under ANY circumstances (read-only invariant: SHA-256 `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`).

### 4. Implementation Requirements
Build `document_extractor.py` adhering to the unified synthesis of Explorers M3.1, M3.2, and M3.3:
1. **Magic Byte Sniffing for Extensionless Documents**:
   - Check first 16 bytes for `b'%PDF-'` to automatically route extensionless files like `DOC-20251120-WA0006` and `DOC-20260116-WA0000` to the PDF handler.
2. **Hybrid OCR for Scanned / Raster PDFs**:
   - For PDF documents, if `len(page_text.strip()) < 50` AND the page contains embedded images (`len(page.get_images()) > 0`), render the page pixmap (150 DPI) and run `RapidOCR` to extract text from the raster image (critical for `DOC-20251120-WA0006` CaixaBank statement to recover all 212 lines of financial data). Record `is_scanned: true` and `ocr_fallback: true` in `metadata_json`.
3. **Format Extraction Handlers**:
   - **PDF**: PyMuPDF (`fitz`). Extract `page.get_text("text")` + `page.find_tables(strategy="lines")`. Skip `find_tables` if `len(page.get_drawings()) == 0` for performance optimization.
   - **DOCX**: `python-docx` for paragraphs, tables, and Dublin Core metadata.
   - **ODS**: `pd.read_excel(engine='odf')` / `odfpy` for sheets, tabular rows, and generator metadata.
   - **XLSX**: `openpyxl.load_workbook(data_only=True, read_only=True)` for multi-sheet tables and cell values.
   - **CSV**: `csv.reader(..., encoding='utf-8-sig')` with fallback to `cp1252`/`latin-1` for tabular capture.
   - **VCF**: Regex extraction of vCard contacts (`FN`, `TEL`, `EMAIL`, `ORG`).
4. **Dedicated Single-Writer Concurrency Architecture**:
   - Use `ProcessPoolExecutor(max_workers=4)` for pure CPU file parsing. Workers hold zero DB connections and return dictionary results.
   - Main process uses a single dedicated DB connection with `db_utils.get_evidence_conn()` and `db_utils.immediate_transaction()`, committing writes in batches of 50.
5. **Absolute Idempotency ($f(f(x)) = f(x)$)**:
   - Ensure `CREATE UNIQUE INDEX IF NOT EXISTS uq_document_evidence_file_id ON document_evidence(file_id);`
   - Use `INSERT INTO document_evidence (file_id, doc_type, extracted_text, page_count, tables_json, metadata_json) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(file_id) DO UPDATE SET ...`
   - Update `file_inventory` status to `COMPLETED` and `terminal_code` to `EXTRACTED_SUCCESS` or `EXTRACTED_OCR_FALLBACK`.
   - Re-running with `--force-reprocess` must produce delta = 0 rows, zero duplicate keys, and zero ID churn.
6. **Summary Reporting**:
   - Produce `forensics_multiagent_run\reports\m3_document_extraction_report.json` with processed counts, modality breakdown, OCR fallback counts, table counts, and duration.

### 5. Verification Requirements
Build `forensics_multiagent_run\tests\test_m3_document_extraction.py` and run:
1. Unit tests with synthetic/fixture files for PDF, DOCX, ODS, XLSX, CSV, VCF, 0-byte, corrupt files.
2. Double-execution idempotency test verifying `count(*)` and `max(id)` are invariant.
3. Integration test against real evidence subset.
4. Cryptographic baseline check verifying `whatsapp_forensics.db` SHA-256 hash is invariant.
5. Execute full workspace test discovery (`tests.test_m0_challenger`, `tests.test_m1_inventory`, `tests.test_m2_text_forensics`, `tests.test_m3_document_extraction`) to verify zero regressions.
6. Execute `document_extractor.py` to extract all 39 documents in `run_evidence.db`.
7. Execute `document_extractor.py --force-reprocess` to verify true idempotency.

### 6. Deliverable
Deliver your comprehensive handoff report at:
`c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m3_1\handoff.md`
and notify orchestrator via `send_message`.
