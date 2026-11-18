# Handoff Report: SQLite Baseline Snapshot & Evidence Ledger Schema
**Milestone**: M0 (Infrastructure, Isolated Environment & Baseline Snapshot)  
**Agent**: Explorer M0_3 (SQLite Baseline & Evidence Ledger Schema Specialist)  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_3`  
**Target Ledger**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`  
**Production Baseline**: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`  
**Date**: 2026-10-28  

---

## 1. Observation

1. **Production Database Physical State & File Metrics**:
   Command:
   ```powershell
   Get-ChildItem -Path "c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results" -Filter "whatsapp_forensics.db*" | Select-Object Name, Length, LastWriteTime
   ```
   Verbatim output:
   ```
   Name                        Length LastWriteTime
   ----                        ------ -------------
   whatsapp_forensics.db     11886592 28/10/2026 20:39:42
   whatsapp_forensics.db-shm    32768 28/10/2026 22:22:54
   whatsapp_forensics.db-wal        0 28/10/2026 21:08:10
   ```
   File sizes:
   - `whatsapp_forensics.db`: 11,886,592 bytes (exactly 2,902 pages at 4,096 bytes/page).
   - `whatsapp_forensics.db-wal`: 0 bytes (fully truncated).
   - `whatsapp_forensics.db-shm`: 32,768 bytes (standard SQLite WAL shared-memory index).

2. **Cryptographic Checksums (SHA-256)**:
   Command:
   ```powershell
   Get-FileHash -Path "c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db*" -Algorithm SHA256
   ```
   Verbatim output:
   - `whatsapp_forensics.db`: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` (exact match with `PROJECT.md` line 5).
   - `whatsapp_forensics.db-wal`: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (empty file SHA-256 hash).
   - `whatsapp_forensics.db-shm`: `fd4c9fda9cd3f9ae7c962b0ddf37232294d55580e1aa165aa06129b8549389eb`.

3. **PRAGMA Integrity Check and WAL Checkpoint**:
   Command:
   ```python
   uri_ro = 'file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro'
   conn = sqlite3.connect(uri_ro, uri=True)
   cur = conn.cursor()
   cur.execute('PRAGMA integrity_check;')
   print(cur.fetchall())
   cur.execute('PRAGMA wal_checkpoint(TRUNCATE);')
   print(cur.fetchall())
   ```
   Verbatim output:
   - `PRAGMA integrity_check`: `[('ok',)]` (zero structural or B-tree corruptions).
   - `PRAGMA wal_checkpoint(TRUNCATE)`: `[(0, 0, 0)]` (`busy=0, log=0, checkpointed=0`, confirming zero outstanding uncommitted or uncheckpointed pages).

4. **Interface Contract Specifications in `PROJECT.md § Interface Contracts` (lines 50-127)**:
   - `file_inventory` table: `file_id` (PK AUTO), `rel_path` (TEXT UNIQUE NOT NULL), `abs_path` (TEXT NOT NULL), `file_size` (INTEGER NOT NULL), `sha256` (TEXT), `modality` (TEXT NOT NULL), `status` (TEXT NOT NULL DEFAULT 'PENDING'), `terminal_code` (TEXT), `error_message` (TEXT), `mtime` (TEXT), timestamps.
   - `ocr_evidence` table: `id` (PK AUTO), `file_id` (FK REFERENCES file_inventory), `engine` (TEXT NOT NULL: RAPIDOCR, TESSERACT), `extracted_text` (TEXT), `mean_confidence` (REAL), `bbox_json` (TEXT), `fallback_triggered` (INTEGER DEFAULT 0), timestamp.
   - `audio_evidence` table: `id` (PK AUTO), `file_id` (FK REFERENCES file_inventory), `duration_sec` (REAL), `language` (TEXT), `language_probability` (REAL), `transcript_text` (TEXT), `segments_json` (TEXT), `terminal_code` (TEXT NOT NULL: TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, UNSUPPORTED_CODEC), `error_code` (TEXT), timestamp.
   - `document_evidence` table: `id` (PK AUTO), `file_id` (FK REFERENCES file_inventory), `doc_type` (TEXT NOT NULL: PDF, DOCX, ODS, XLSX, TXT), `extracted_text` (TEXT), `page_count` (INTEGER), `tables_json` (TEXT), `metadata_json` (TEXT), timestamp.
   - `text_forensic_entities` table: `id` (PK AUTO), `message_id` (TEXT NOT NULL), `sender` (TEXT), `timestamp_iso` (TEXT), `entity_type` (TEXT NOT NULL: CLUB, PERSON, CIF, IBAN, CUOTA, TARIFF, ROLE, LICENSE), `entity_value` (TEXT NOT NULL), `context_snippet` (TEXT), `confidence` (REAL), timestamp.
   - `attachment_links` table: `id` (PK AUTO), `message_id` (TEXT NOT NULL), `file_id` (FK REFERENCES file_inventory), `match_classification` (TEXT NOT NULL: CONFIRMED, PROBABLE, UNRESOLVED, CONTRADICTED), `match_method` (TEXT NOT NULL: EXACT_FILENAME, TIMESTAMP_PROXIMITY, HASH_MATCH, HEURISTIC), `confidence_score` (REAL), `evidence_notes` (TEXT), timestamp.
   - `cross_modal_index` (SQLite FTS5 virtual table): `content_id`, `modality`, `source_ref`, `sender_or_creator`, `timestamp_iso`, `indexed_text`.

---

## 2. Logic Chain

1. **Baseline Invariance & Chain of Custody**:
   - Observation 1 & 2 establish that the physical file `whatsapp_forensics.db` is 11,886,592 bytes with SHA-256 `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`.
   - Observation 3 confirms that `wal_checkpoint(TRUNCATE)` returned `(0, 0, 0)` and `integrity_check` returned `ok`.
   - In SQLite WAL mode, a 0-byte WAL file guarantees that no uncommitted or uncheckpointed transactions exist outside the primary database file.
   - Because downstream workers must query `whatsapp_forensics.db` across thousands of operations without risking bit-level alteration, establishing this cryptographic baseline hash before worker launch and mandating the `?mode=ro` URI parameter guarantees judicial defensibility and zero forensic contamination.

2. **Isolated Execution Ledger (`run_evidence.db`)**:
   - `ORIGINAL_REQUEST.md §2 Rule 3` forbids any worker writes to `whatsapp_forensics.db`.
   - All worker discoveries, extractions, links, transcripts, and OCR outputs must be persisted in an isolated SQLite database at `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`.
   - High-concurrency operations across 4 RapidOCR workers, 4 Document workers, 1 GPU Audio worker, and 2 Text workers require SQLite WAL mode (`PRAGMA journal_mode = WAL;`) and a generous busy timeout (`PRAGMA busy_timeout = 30000;`) to avoid lock contention.

3. **Strict Schema Contract Compliance**:
   - Observation 4 defines the exact field names, types, and constraints required by `PROJECT.md § Interface Contracts`.
   - The DDL designed in Section 4 of `strategy_report.md` maps every contract table 1:1, adding check constraints (`CHECK(modality IN (...))`, `CHECK(engine IN (...))`, etc.) to enforce terminal state validity at the database engine level.
   - An auxiliary table `baseline_manifest` is incorporated to store the cryptographic baseline hashes directly inside `run_evidence.db`.
   - The FTS5 virtual table `cross_modal_index` is configured with `tokenize='unicode61 remove_diacritics 2'` to handle Spanish and Basque diacritics.

4. **Idempotent Python Blueprint**:
   - Worker M0 requires a turnkey script that can be executed independently or imported into `env_setup.py`.
   - The script `init_evidence_db.py` (provided in Section 5 of `strategy_report.md`) validates baseline integrity, hashes files, initializes tables with `IF NOT EXISTS`, verifies table creation, and populates the manifest, exiting with code 0 on complete success.

---

## 3. Caveats

1. **Read-Only Mounting Pragma Limitation**:
   - While `PRAGMA integrity_check` works seamlessly on connections opened with `mode=ro`, any active checkpoint that requires page modification cannot run under `mode=ro`. Because the WAL file is currently 0 bytes, running `PRAGMA wal_checkpoint(TRUNCATE)` under `mode=ro` succeeds safely without error (`[(0, 0, 0)]`). However, the initialization script opens a temporary read-write connection to confirm checkpointing before enforcing read-only constraints.
2. **SQLite FTS5 Unicode Tokenizer Availability**:
   - The FTS5 extension with `unicode61` is compiled into Python's official Windows distribution. Should an alternative Python runtime lack FTS5, SQLite will throw an operational error on `CREATE VIRTUAL TABLE`. This is validated in the execution script during table census inspection.
3. **Multi-Process Concurrency Best Practice**:
   - Although SQLite WAL mode supports multiple readers and one writer, parallel worker processes must keep transactions brief (`BEGIN IMMEDIATE ... COMMIT`) and avoid holding locks across slow model inferences (e.g. while Whisper or OCR runs).

---

## 4. Conclusion

- **Baseline Status**: Verified healthy, clean, fully truncated, and bit-identical to reference SHA-256 (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`).
- **Ledger Schema**: The complete DDL schema script for `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db` is finalized and strictly conforms to `PROJECT.md § Interface Contracts` for all 7 required tables plus FTS5.
- **Worker M0 Readiness**: The Python initialization script `init_evidence_db.py` is fully authored and documented in `strategy_report.md`. Worker M0 has an exact, robust blueprint ready for execution.

---

## 5. Verification Method

To independently verify the findings and schema initialization:

1. **Verify Baseline Hashes & Pragmas**:
   ```powershell
   python -c "
   import sqlite3, hashlib
   path = r'c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db'
   h = hashlib.sha256(open(path, 'rb').read()).hexdigest()
   print('SHA256:', h)
   assert h == '030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3'
   conn = sqlite3.connect('file:///' + path.replace('\\', '/') + '?mode=ro', uri=True)
   cur = conn.cursor()
   cur.execute('PRAGMA integrity_check;')
   assert cur.fetchone() == ('ok',)
   print('Baseline verification PASSED!')
   "
   ```

2. **Execute Schema Initialization Blueprint**:
   Run the blueprint script provided in `strategy_report.md` via python.
   Expected output:
   - Checkpoint: `(0, 0, 0)`
   - Integrity: `[('ok',)]`
   - Created tables: `['attachment_links', 'audio_evidence', 'baseline_manifest', 'cross_modal_index', 'document_evidence', 'file_inventory', 'ocr_evidence', 'text_forensic_entities']`
   - Return exit code: 0

3. **Verify Read-Only Lock Rejection**:
   ```powershell
   python -c "
   import sqlite3
   uri = 'file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro'
   conn = sqlite3.connect(uri, uri=True)
   try:
       conn.cursor().execute('CREATE TABLE fail (x INT);')
   except sqlite3.OperationalError as e:
       print('Read-only enforcement verified:', e)
   "
   ```
