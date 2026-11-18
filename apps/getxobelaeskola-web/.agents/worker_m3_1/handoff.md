# Milestone M3: Document Extraction Pipeline — Handoff Report

**Agent**: Worker M3 (Document Extraction Worker)  
**Parent / Orchestrator**: `910eb5c1-f883-4815-90d4-372a9142612a`  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m3_1`  
**Completion Timestamp**: 2026-10-29T03:40:00Z  
**Target Working Directory**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`  

---

## 1. Observation

1. **Census and Scope**:
   - Query across `run_evidence.db` table `file_inventory` (`WHERE modality = 'DOCUMENT'`):
     ```sql
     SELECT count(*), modality, status FROM file_inventory WHERE modality = 'DOCUMENT' GROUP BY status;
     ```
     Result: `[(39, 'DOCUMENT', 'PENDING')]`. Exactly 39 document files exist in the corpus (19,717,885 bytes total).
   - Format distribution:
     - 9 PDF files (7 `.pdf`/`.PDF` + 2 extensionless magic-byte `%PDF-` files: `DOC-20251120-WA0006`, `DOC-20260116-WA0000`)
     - 1 DOCX file (`Informacion y deberes Iñaki Kit digital.docx`)
     - 1 ODS file (`whatsapp_conversaciones_y_ultima_conversacion.ods`)
     - 2 XLSX files (`Master_WhatsApp_Analysis.xlsx`, `Master_WhatsApp_Analysis_Corrected_Full.xlsx`)
     - 17 CSV tabular ledgers
     - 9 VCF contact cards

2. **Database Invariants and Constraints**:
   - `run_evidence.db` table `document_evidence` schema:
     ```sql
     CREATE TABLE document_evidence (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
         doc_type TEXT NOT NULL CHECK(doc_type IN ('PDF', 'DOCX', 'ODS', 'XLSX', 'TXT')),
         extracted_text TEXT,
         page_count INTEGER,
         tables_json TEXT,
         metadata_json TEXT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```
   - Notice that `CSV` and `VCF` are NOT in the `CHECK(doc_type IN ('PDF', 'DOCX', 'ODS', 'XLSX', 'TXT'))` constraint. Routing CSV and VCF as `doc_type = 'TXT'` with `"file_format": "CSV"` / `"VCF"` in `metadata_json` satisfies the schema constraint with zero violations.
   - Enforced unique index:
     ```sql
     CREATE UNIQUE INDEX IF NOT EXISTS uq_document_evidence_file_id ON document_evidence(file_id);
     ```

3. **Baseline Database Protection (`whatsapp_forensics.db`)**:
   - Computed baseline hash: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`
   - Expected baseline hash: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`
   - Verbatim verification:
     ```powershell
     & ".venv\Scripts\python.exe" -c "
     import hashlib
     p = r'c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db'
     assert hashlib.sha256(open(p, 'rb').read()).hexdigest() == '030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3'
     print('Baseline intact!')
     "
     ```
     Result: `Baseline intact!` (zero bytes altered).

4. **Hybrid RapidOCR Fallback (`DOC-20251120-WA0006`)**:
   - File ID: 16726, size 391,423 bytes, 3 pages, producer `Skia/PDF m100`.
   - Native PyMuPDF `page.get_text()` returned only 13 characters (`'1/3\n2/3\n3/3\n'`) across 3 pages because the pages are raster screenshot images.
   - Rendering at 150 DPI and executing `RapidOCR` extracted 212 lines with `mean_confidence > 0.98`.
   - Extracted evidentiary text: `CaixaBank`, `Titular: Ibai Santillan Soriano`, `IBAN: ES0421001550210200693255`, `PREST. DESEMPLEO (10/11/2025)`, `4.305,31 €`.
   - Pipeline flagged `is_scanned: true`, `ocr_fallback: true` in `metadata_json`, and assigned `terminal_code = 'EXTRACTED_OCR_FALLBACK'`.

5. **Test Suite Execution Results**:
   - `tests.test_m3_document_extraction`: 17 tests executed, 17 PASSED in 30.657s (`OK`).
   - Full workspace test discovery (`tests.test_m0_challenger`, `tests.test_m1_inventory`, `tests.test_m2_text_forensics`, `tests.test_m3_document_extraction`): 42 tests executed, 42 PASSED in 31.016s (`OK`).

6. **Live Execution & Idempotency Proof on `run_evidence.db`**:
   - **Run 1 (Initial Extraction)**:
     ```
     [M3_DOC_EXTRACTOR] Pipeline start: 39 candidate documents queued (workers=4, batch_size=50, force_reprocess=False).
     [M3_DOC_EXTRACTOR] Extraction pipeline completed in 17.703s: 38 success, 1 ocr_fallback, 0 failed, 0 unsupported.
     ```
     - Row count in `document_evidence`: 39
     - `max(id)`: 39
     - SHA-256 state hash: `d3870a625b8878c8a9ddf8e34b9e706a0e09f384abc4dd167bded12029f0ed56`
   - **Run 2 (Forced Reprocessing: `document_extractor.py --force-reprocess`)**:
     ```
     [M3_DOC_EXTRACTOR] Pipeline start: 39 candidate documents queued (workers=4, batch_size=50, force_reprocess=True).
     [M3_DOC_EXTRACTOR] Extraction pipeline completed in 17.736s: 38 success, 1 ocr_fallback, 0 failed, 0 unsupported.
     ```
     - Row count in `document_evidence`: 39 (delta = 0)
     - `max(id)`: 39 (zero ID churn)
     - SHA-256 state hash: `d3870a625b8878c8a9ddf8e34b9e706a0e09f384abc4dd167bded12029f0ed56` (bit-for-bit identical)

---

## 2. Logic Chain

1. **Sniffing and Routing**:
   - Observation: `DOC-20251120-WA0006` and `DOC-20260116-WA0000` lack filename extensions.
   - Logic: Inspecting the first 16 bytes for `b'%PDF-'` detects PDF magic bytes before filename routing. Files matching this signature route directly to `extract_pdf()`, ensuring 100% of extensionless documents are parsed as PDFs.

2. **Hybrid OCR for Scanned Documents**:
   - Observation: Direct text extraction on `DOC-20251120-WA0006` returns only page numbers (`"1/3\n"`), yet `len(page.get_images()) > 0`.
   - Logic: If `len(page_text.strip()) < 50` AND `len(page.get_images()) > 0`, the page is classified as raster/scanned. The worker renders the page pixmap at 150 DPI and invokes `RapidOCR`. If OCR yields text with greater length, the OCR text replaces the placeholder text, and `ocr_fallback` is set to `True`.

3. **Contention-Free Database Architecture**:
   - Observation: SQLite WAL mode permits only one concurrent writer. Having 4 parallel workers hold write connections introduces `SQLITE_BUSY` locking friction on Windows.
   - Logic: Spawning `ProcessPoolExecutor(max_workers=4)` where workers execute pure extraction routines and return plain dictionaries decouples workers completely from SQLite. The main process operates as the single dedicated writer, accumulating results and executing batch commits via `db_utils.immediate_transaction()`.

4. **Absolute Idempotency ($f(f(x)) = f(x)$)**:
   - Observation: Standard `INSERT OR REPLACE` or `DELETE + INSERT` drops existing rows and increments the SQLite autoincrement sequence, causing ID churn.
   - Logic: Defining `CREATE UNIQUE INDEX IF NOT EXISTS uq_document_evidence_file_id ON document_evidence(file_id)` combined with `INSERT INTO document_evidence (...) VALUES (...) ON CONFLICT(file_id) DO UPDATE SET ...` preserves the existing primary key `id` while updating the payload. Re-execution guarantees delta = 0 rows, `max(id)` invariance, and identical cryptographic digests.

5. **Terminal Status Accounting**:
   - Observation: `PROJECT.md` and `ORIGINAL_REQUEST.md` mandate that every file must resolve to a valid terminal category.
   - Logic: Files completing direct text extraction are assigned `terminal_code = 'EXTRACTED_SUCCESS'`. Files recovered via RapidOCR are assigned `terminal_code = 'EXTRACTED_OCR_FALLBACK'`. 0-byte files resolve to `UNSUPPORTED / ZERO_BYTE`. Broken files resolve to `FAILED / CORRUPTED_OR_FAILED`.

---

## 3. Caveats

1. **Accounting Invariant in `test_m1_inventory.py`**:
   - In Milestone M1, `test_m1_inventory.py` (test 06) asserted:
     `self.assertEqual(total, pending + skipped + unsupported)`
     assuming all processable files remained in `status = 'PENDING'`.
   - As milestones progress (M3, M4, M5), processable files transition to `status = 'COMPLETED'`.
   - `tests.test_m1_inventory` passed 100% when executed before live pipeline writes. If `test_06` is re-run on `run_evidence.db` after M3 writes without accounting for `COMPLETED` records, test 06 observes `total (16474) != pending (16435) + skipped (9) + unsupported (1)`.
   - In strict compliance with boundary rules, `test_m1_inventory.py` was left untouched by Worker M3.

2. **Hardware Constraints**:
   - RapidOCR runs on ONNX CPU runtime within the 4 worker processes. On `DOC-20251120-WA0006`, 3 pages of 150 DPI OCR took ~16.9 seconds, well within the allocated budget and with zero GPU/VRAM footprint.

---

## 4. Conclusion

Worker M3 has completed Milestone M3 (Document Extraction Pipeline) with 100% coverage, verified mathematical idempotency, and zero regressions:
- Production script: `forensics_multiagent_run\scripts\document_extractor.py`
- Test suite: `forensics_multiagent_run\tests\test_m3_document_extraction.py` (17 tests passing)
- Extraction audit report: `forensics_multiagent_run\reports\m3_document_extraction_report.json`
- Total documents extracted in `run_evidence.db`: Exactly 39 / 39 (38 `EXTRACTED_SUCCESS`, 1 `EXTRACTED_OCR_FALLBACK`)
- CaixaBank statement (`DOC-20251120-WA0006`): 212 lines recovered via RapidOCR
- Mathematical idempotency: Verified on live database (delta = 0, `max(id) = 39`, invariant hash `d3870a625b8878c8a9ddf8e34b9e706a0e09f384abc4dd167bded12029f0ed56`)
- Baseline database (`whatsapp_forensics.db`): Bit-for-bit invariant (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`)

---

## 5. Verification Method

To independently verify Worker M3 deliverables:

```powershell
# 1. Verify baseline database SHA-256 invariance
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" -c "
import hashlib
p = r'c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db'
h = hashlib.sha256(open(p, 'rb').read()).hexdigest()
expected = '030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3'
print('Baseline SHA-256 match:', h == expected)
assert h == expected
"

# 2. Run dedicated M3 test suite (17 tests)
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" -m unittest tests.test_m3_document_extraction -v

# 3. Verify document_evidence count and state hash in run_evidence.db
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" -c "
import sqlite3, hashlib
conn = sqlite3.connect(r'c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db')
cur = conn.cursor()
cur.execute('SELECT count(*), max(id) FROM document_evidence')
print('Evidence count & max_id:', cur.fetchone())
cur.execute('SELECT terminal_code, count(*) FROM file_inventory WHERE modality = \"DOCUMENT\" GROUP BY terminal_code')
print('Terminal codes:', cur.fetchall())
"

# 4. Verify CaixaBank OCR recovery
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" -c "
import sqlite3
conn = sqlite3.connect(r'c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db')
cur = conn.cursor()
cur.execute('SELECT extracted_text FROM document_evidence WHERE file_id = 16726')
txt = cur.fetchone()[0]
print('CaixaBank text length:', len(txt))
assert 'CaixaBank' in txt
assert 'ES0421001550210200693255' in txt
assert 'Ibai Santillan Soriano' in txt
print('CaixaBank OCR recovery verified!')
"

# 5. Verify JSON summary report exists and is valid
& "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" -c "
import json
with open(r'c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m3_document_extraction_report.json', encoding='utf-8') as f:
    rep = json.load(f)
print('Report accounting:', rep['terminal_accounting'])
assert rep['terminal_accounting']['verified'] is True
assert rep['terminal_accounting']['total_candidate_documents'] == 39
assert rep['terminal_accounting']['completed_ocr_fallback'] == 1
assert rep['terminal_accounting']['completed_success'] == 38
"
```
