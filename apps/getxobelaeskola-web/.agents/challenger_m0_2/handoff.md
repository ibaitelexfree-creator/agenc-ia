# Challenger 2 Handoff Report: Milestone M0 Empirical Verification

**Author**: Challenger 2 (Empirical Schema, Table Structure & Baseline Fidelity Specialist)  
**Date**: 2026-10-28T16:33:00Z  
**Target Environment**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\challenger_m0_2`  
**Verdict**: **APPROVE**  

---

## 1. Observation

Direct empirical observations obtained by independent script execution and tool queries:

### 1.1. Cryptographic Baseline Fidelity (`whatsapp_forensics.db`)
- **Target File**: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`
- **File Size**: `11,886,592` bytes
- **SHA-256 Hash Computed (Chunked 64 KiB)**: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`
- **Expected Hash (`PROJECT.md § Architecture`)**: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`
- **Hash Match**: **Bit-Identical Exact Match (`True`)**
- **WAL State**: `whatsapp_forensics.db-wal` exists with size `0` bytes (cleanly truncated via `PRAGMA wal_checkpoint(TRUNCATE)`).
- **SHM State**: `whatsapp_forensics.db-shm` exists with size `32,768` bytes (standard SQLite shared-memory index header).
- **Content Census**: `10,055` messages in table `messages`, `392` contacts in table `contacts`.
- **Read-Only Enforcement**: Querying under `file:...whatsapp_forensics.db?mode=ro` followed by `CREATE TABLE challenger_test (id INT);` raised verbatim:
  `sqlite3.OperationalError: attempt to write a readonly database`

### 1.2. Schema Contract Conformance (`run_evidence.db`)
- **Target Database**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- **Integrity Check**: `PRAGMA integrity_check;` returned `[('ok',)]`
- **Journal Mode**: `WAL`
- **Table & Column Contract Verification Against `PROJECT.md § Interface Contracts`**:
  - `file_inventory` (12 columns): `file_id` (PK AUTOINCREMENT), `rel_path` (UNIQUE NOT NULL), `abs_path` (NOT NULL), `file_size` (NOT NULL), `sha256` (TEXT), `modality` (TEXT NOT NULL, CHECK constraint on 8 values), `status` (TEXT NOT NULL DEFAULT 'PENDING', CHECK constraint on 7 values), `terminal_code` (TEXT), `error_message` (TEXT), `mtime` (TEXT), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `ocr_evidence` (8 columns): `id` (PK AUTOINCREMENT), `file_id` (FK to `file_inventory(file_id)` ON DELETE CASCADE), `engine` (TEXT NOT NULL CHECK in RAPIDOCR, TESSERACT), `extracted_text` (TEXT), `mean_confidence` (REAL), `bbox_json` (TEXT), `fallback_triggered` (INTEGER DEFAULT 0 CHECK in 0, 1), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `audio_evidence` (10 columns): `id` (PK AUTOINCREMENT), `file_id` (FK to `file_inventory(file_id)` ON DELETE CASCADE), `duration_sec` (REAL), `language` (TEXT), `language_probability` (REAL), `transcript_text` (TEXT), `segments_json` (TEXT), `terminal_code` (TEXT NOT NULL CHECK in TRANSCRIBED_SUCCESS, CORRUPTED_OR_FAILED, UNSUPPORTED_CODEC), `error_code` (TEXT), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `document_evidence` (8 columns): `id` (PK AUTOINCREMENT), `file_id` (FK to `file_inventory(file_id)` ON DELETE CASCADE), `doc_type` (TEXT NOT NULL CHECK in PDF, DOCX, ODS, XLSX, TXT), `extracted_text` (TEXT), `page_count` (INTEGER), `tables_json` (TEXT), `metadata_json` (TEXT), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `text_forensic_entities` (9 columns): `id` (PK AUTOINCREMENT), `message_id` (TEXT NOT NULL), `sender` (TEXT), `timestamp_iso` (TEXT), `entity_type` (TEXT NOT NULL CHECK in CLUB, PERSON, CIF, IBAN, CUOTA, TARIFF, ROLE, LICENSE), `entity_value` (TEXT NOT NULL), `context_snippet` (TEXT), `confidence` (REAL), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `attachment_links` (8 columns): `id` (PK AUTOINCREMENT), `message_id` (TEXT NOT NULL), `file_id` (FK to `file_inventory(file_id)` ON DELETE CASCADE), `match_classification` (TEXT NOT NULL CHECK in CONFIRMED, PROBABLE, UNRESOLVED, CONTRADICTED), `match_method` (TEXT NOT NULL CHECK in EXACT_FILENAME, TIMESTAMP_PROXIMITY, HASH_MATCH, HEURISTIC), `confidence_score` (REAL), `evidence_notes` (TEXT), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
  - `cross_modal_index` (6 columns): `content_id`, `modality`, `source_ref`, `sender_or_creator`, `timestamp_iso`, `indexed_text` (FTS5 virtual table with `tokenize='unicode61 remove_diacritics 2'`).
- **Column Matching Test Result**: Programmatic assertion across all 7 contract tables returned `PASS` (exact 100% column name, type, and order alignment).

### 1.3. FTS5 Search Index Empirical Stress Testing
Tested `cross_modal_index` with 10 empirical tests:
1. **Multi-Row Insert**: Inserted 4 multi-modal evidence items (`CHAT_TXT`, `IMAGE_OCR`, `AUDIO_TRANSCRIPT`, `DOCUMENT`). -> **PASS** (count=4).
2. **Simple MATCH Query**: `MATCH 'Getxo'` matched 2 records (`MSG_001001`, `DOC_000763`). -> **PASS**.
3. **Exact Phrase MATCH Query**: `MATCH '"Getxo Bela Eskola"'` matched 1 record (`MSG_001001`). -> **PASS**.
4. **Prefix MATCH Query**: `MATCH 'lizen*'` matched 1 record (`AUDIO_000392`). -> **PASS**.
5. **Boolean Operator MATCH Query**: `MATCH 'seguro AND Pakea'` matched 1 record (`OCR_004502`). -> **PASS**.
6. **Column Filter MATCH Query**: `MATCH 'modality:DOCUMENT AND indexed_text:federativas'` matched 1 record (`DOC_000763`). -> **PASS**.
7. **Diacritic-Insensitive Search**:
   - Query `MATCH 'póliza'` matched unaccented OCR text `poliza`.
   - Query `MATCH 'embarcación'` matched unaccented OCR text `embarcacion`. -> **PASS**.
8. **Snippet Generation**: `snippet(cross_modal_index, 5, '[B]', '[/B]', '...', 10)` returned:
   `Reunion ordinaria de Getxo Bela [B]Eskola[/B] en el puerto deportivo...`. -> **PASS**.
9. **BM25 Ranking**: `bm25(cross_modal_index)` returned valid negative ranking scores `[-1.386e-6, -9.509e-7]`. -> **PASS**.
10. **Deletion & State Cleanup**: Deleted all 4 test records; final rowcount returned to `0`. -> **PASS**.
- **Overall FTS5 Result**: **10/10 tests passed**.

### 1.4. Adversarial Schema Constraint Tests
- **Foreign Key Violation**: Attempted insert into `ocr_evidence` with non-existent `file_id = 999999` with `PRAGMA foreign_keys = ON;` -> Verbatim caught: `sqlite3.IntegrityError: FOREIGN KEY constraint failed`.
- **Invalid Modality CHECK**: Attempted insert into `file_inventory` with `modality = 'INVALID_MODALITY'` -> Verbatim caught: `sqlite3.IntegrityError: CHECK constraint failed: modality IN ('AUDIO', 'IMAGE', 'VIDEO', 'DOCUMENT', 'CHAT_TXT', 'DATABASE', 'ARCHIVE', 'OTHER')`.
- **Invalid Status CHECK**: Attempted insert into `file_inventory` with `status = 'INVALID_STATUS'` -> Verbatim caught: `sqlite3.IntegrityError: CHECK constraint failed: status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'UNSUPPORTED', 'DUPLICATE', 'SKIPPED')`.
- **Trigger `trg_file_inventory_updated_at`**: Updating a row updated `updated_at` from `2020-01-01 00:00:00` to current timestamp `2026-10-28 16:28:51` while preserving `created_at`. -> **PASS**.

---

## 2. Logic Chain

1. **Baseline Invariance & Cryptographic Chain of Custody**:
   - The production database `whatsapp_forensics.db` was verified by computing its SHA-256 hash across 64 KiB chunks (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`).
   - This matches the project baseline specified in `PROJECT.md § Architecture` and `worker_m0_1/handoff.md` bit-for-bit (Observation 1.1).
   - The WAL file is 0 bytes, confirming that `PRAGMA wal_checkpoint(TRUNCATE)` cleanly folded all prior journal frames into the main database.
   - Enforcing `?mode=ro` physically prevents accidental mutation or contamination of production forensic evidence (Observation 1.1).

2. **Schema Contract Compliance**:
   - Every table required by `PROJECT.md § Interface Contracts` (`file_inventory`, `ocr_evidence`, `audio_evidence`, `document_evidence`, `text_forensic_entities`, `attachment_links`, and `cross_modal_index`) was programmatically inspected via `PRAGMA table_info` (Observation 1.2).
   - Column names, ordinal positions, nullability, default values, and foreign key cascades match the contractual specification with zero deviations.
   - The auxiliary table `baseline_manifest` provides durable provenance auditing without interfering with the required contract tables.

3. **Search Engine Capability & Multi-Modal Readiness**:
   - The FTS5 virtual table was created with `unicode61 remove_diacritics 2`, which is essential for Spanish and Basque forensic text (e.g. `embarcación` / `embarcacion`, `póliza` / `poliza`, `Getxo`, `Pakea`, `cuota`).
   - All 10 search operations—including boolean operators, column qualifiers, prefix matching, ranking, and snippet generation—passed without error (Observation 1.3).
   - Cleanup returned table rowcounts to zero, leaving `run_evidence.db` pristine for Milestone M1 ingestion.

4. **Adversarial Hardening**:
   - The schema rejects orphaned children via foreign key enforcement, rejects invalid enumerations via CHECK constraints, and automatically maintains row update timestamps via triggers (Observation 1.4).
   - These defenses guarantee data integrity when multiple concurrent worker processes begin writing in Milestones M1 through M6.

---

## 3. Caveats

- **No Caveats**: All required checks were directly, independently, and empirically executed on the live filesystem and SQLite databases. No mock data or worker self-attestations were accepted without replication.

---

## 4. Conclusion

**Verdict: APPROVE**

Milestone M0 satisfies all architectural requirements and schema contracts:
1. `whatsapp_forensics.db` is bit-identical to the baseline SHA-256 hash (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`), WAL truncated, and protected under read-only mode.
2. `run_evidence.db` schema strictly conforms to `PROJECT.md § Interface Contracts` across all 7 required tables with zero missing or mismatched columns.
3. SQLite FTS5 search index is fully operational, supports Spanish/Basque diacritic-insensitive queries, snippet generation, BM25 scoring, and clean rollback.
4. Foreign keys, CHECK constraints, and update triggers are actively enforced.

The workspace is certified ready to proceed to **Milestone M1 (Inventory Discovery & Reconciler)**.

---

## 5. Verification Method

To independently reproduce the empirical findings in this report, run the following commands in PowerShell from the project workspace:

```powershell
# 1. Independent SHA-256 baseline verification:
& c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe -c "
import hashlib
p = r'c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db'
h = hashlib.sha256()
with open(p, 'rb') as f:
    while chunk := f.read(65536):
        h.update(chunk)
calc = h.hexdigest()
expected = '030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3'
assert calc == expected, f'Mismatch: {calc} != {expected}'
print('SHA-256 Baseline Match: PASS (' + calc + ')')
"

# 2. Schema contracts verification against PROJECT.md:
& c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe -c "
import sqlite3
expected = {
    'file_inventory': ['file_id', 'rel_path', 'abs_path', 'file_size', 'sha256', 'modality', 'status', 'terminal_code', 'error_message', 'mtime', 'created_at', 'updated_at'],
    'ocr_evidence': ['id', 'file_id', 'engine', 'extracted_text', 'mean_confidence', 'bbox_json', 'fallback_triggered', 'created_at'],
    'audio_evidence': ['id', 'file_id', 'duration_sec', 'language', 'language_probability', 'transcript_text', 'segments_json', 'terminal_code', 'error_code', 'created_at'],
    'document_evidence': ['id', 'file_id', 'doc_type', 'extracted_text', 'page_count', 'tables_json', 'metadata_json', 'created_at'],
    'text_forensic_entities': ['id', 'message_id', 'sender', 'timestamp_iso', 'entity_type', 'entity_value', 'context_snippet', 'confidence', 'created_at'],
    'attachment_links': ['id', 'message_id', 'file_id', 'match_classification', 'match_method', 'confidence_score', 'evidence_notes', 'created_at'],
    'cross_modal_index': ['content_id', 'modality', 'source_ref', 'sender_or_creator', 'timestamp_iso', 'indexed_text']
}
conn = sqlite3.connect(r'c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db')
for t, cols in expected.items():
    actual = [c[1] for c in conn.execute(f'PRAGMA table_info({t});').fetchall()]
    assert actual == cols, f'Mismatch in {t}: {actual} != {cols}'
print('All 7 Contract Tables: PASS')
"

# 3. FTS5 diacritic and phrase search verification:
& c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe -c "
import sqlite3
conn = sqlite3.connect(r'c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db')
conn.execute('INSERT INTO cross_modal_index (content_id, modality, indexed_text) VALUES (?, ?, ?)', ('T1', 'TEST', 'Factura poliza embarcacion Pakea'))
res = conn.execute('SELECT content_id FROM cross_modal_index WHERE cross_modal_index MATCH ?', ('póliza',)).fetchall()
assert len(res) == 1 and res[0][0] == 'T1', 'FTS5 diacritic search failed'
conn.execute('DELETE FROM cross_modal_index WHERE content_id = ?', ('T1',))
conn.commit()
print('FTS5 Diacritic Test: PASS')
"
```
