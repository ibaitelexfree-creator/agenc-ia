# Concurrency Architecture & Worker Pipeline Design (Milestone M3)
**Explorer M3.3 — Concurrency Architecture & Worker Design Report**
**Target System:** WhatsApp Digital Forensic Multi-Agent Operation
**Target Scripts:**
- `forensics_multiagent_run\scripts\document_extractor.py`
- `forensics_multiagent_run\tests\test_m3_document_extraction.py`
- `forensics_multiagent_run\reports\m3_document_extraction_report.json`

---

## 1. Executive Summary

Milestone M3 extracts text, tabular structures, and forensic metadata from document files cataloged during Milestone M1 in `run_evidence.db` table `file_inventory`. 

This report provides the complete architecture and production-ready design for `document_extractor.py` and its verification suite `test_m3_document_extraction.py`. The design solves three fundamental concurrency and forensic challenges:
1. **CPU Parallelism vs. SQLite WAL Write Contention**: Reconciles the high CPU demands of parsing complex document formats (PDF, DOCX, ODS, XLSX) with SQLite's single-writer architecture by decoupling workers from the database. A pool of 4 worker processes (`ProcessPoolExecutor`) executes pure file extractions, feeding results back to a dedicated single-writer transaction loop in the main process.
2. **Absolute Idempotency & Zero ID Churn ($f(f(x)) = f(x)$)**: Enforces an explicit unique constraint `uq_document_evidence_file_id` on `document_evidence(file_id)` combined with an atomic `ON CONFLICT(file_id) DO UPDATE SET ...` pattern. This guarantees zero duplicate rows, zero primary key auto-increment churn, and exact cryptographic state hash invariance across repeated runs.
3. **Resumability & Batch Transaction Discipline**: Integrates directly with `db_utils.immediate_transaction()` using a configurable batch size (default 50), processing only unhandled files (`status = 'PENDING'`) by default, while supporting `--force-reprocess` and selective debugging flags.

---

## 2. Concurrency Model: ProcessPoolExecutor vs. ThreadPoolExecutor

### 2.1 Workload Profile & GIL Constraints
Document extraction spans five file formats with distinct execution characteristics:
- **PDF (PyMuPDF / `fitz`)**: MuPDF core is implemented in C. While page rendering can release the GIL, page text extraction (`page.get_text()`) and table bounding box analysis (`page.find_tables()`) create thousands of Python string and dictionary objects in memory, spending significant time inside Python bytecode.
- **DOCX (`python-docx`)**: Pure Python XML parsing and DOM tree navigation (`lxml` under the hood). Heavily bounded by Python's Global Interpreter Lock (GIL).
- **ODS (`odfpy` / `pandas`)**: Pure Python XML parsing of zipped ODF packages, heavily CPU- and GIL-bound.
- **XLSX (`openpyxl` / `pandas`)**: XML DOM tree traversal of shared strings and worksheet cells in pure Python. Highly CPU- and GIL-bound.
- **TXT**: Plain text decoding across multi-encoding attempts (`utf-8`, `utf-8-sig`, `cp1252`, `latin-1`). Fast I/O, minimal CPU.

If a `ThreadPoolExecutor` were used, Python's GIL would serialize the execution of DOCX, ODS, and XLSX parsing across threads. On the target workstation (Intel Core i9-14900HX, 24 cores / 32 threads), thread-based concurrency would fail to saturate the 4 CPU worker budget, degrading multi-core throughput.

In contrast, **`ProcessPoolExecutor(max_workers=4)`** spawns 4 independent OS processes. Each process has its own Python interpreter and GIL, providing genuine 4-way CPU parallelism.

### 2.2 SQLite WAL Locking & Write Contention
SQLite WAL (`Write-Ahead Logging`) mode allows multiple concurrent readers, but **strictly ONE active writer at any time**.

If 4 worker processes each maintain their own SQLite connection and attempt to write records directly to `run_evidence.db`:
1. On Windows, concurrent processes contending for the SQLite write lock frequently encounter file-locking latency, WAL index (`.db-shm`) mutex contention, or `sqlite3.OperationalError: database is locked`, even when `busy_timeout` is set to 30,000ms.
2. Distributed transactions across multiple processes prevent efficient batching, causing excessive disk fsyncs and WAL checkpoint delays.
3. Error recovery becomes complex if a worker process crashes mid-transaction.

### 2.3 Selected Architectural Pattern: Pure Extractors + Dedicated Main-Process Writer
To resolve this trade-off, we adopt a **Producer-Consumer / Dedicated Writer Architecture**:

```
 ┌───────────────────────────────────────────────────────────────┐
 │                   MAIN ORCHESTRATION PROCESS                  │
 │                                                               │
 │  1. Query file_inventory: modality='DOCUMENT', status='PENDING'│
 │  2. Submit file jobs to ProcessPoolExecutor                   │
 └──────────────┬───────────────────────────────▲────────────────┘
                │ Submit Task                   │ Return Result
                ▼                               │
 ┌──────────────────────────────────────────────┴────────────────┐
 │           WORKER POOL (ProcessPoolExecutor, 4 Workers)        │
 │                                                               │
 │  Worker 1 (PID A): Extract PDF (fitz) -> result dict          │
 │  Worker 2 (PID B): Extract DOCX (docx) -> result dict         │
 │  Worker 3 (PID C): Extract XLSX (openpyxl) -> result dict     │
 │  Worker 4 (PID D): Extract ODS (odfpy) -> result dict         │
 │                                                               │
 │  * Workers NEVER touch SQLite, hold zero DB connections!      │
 └──────────────────────────────────────────────┬────────────────┘
                                                │
                                                ▼
 ┌───────────────────────────────────────────────────────────────┐
 │                  DEDICATED DB WRITER (Main)                   │
 │                                                               │
 │  - Collects result dicts via as_completed() iterator          │
 │  - Accumulates batches (default: 50 results)                  │
 │  - Executes atomic commit via db_utils.immediate_transaction: │
 │      1. INSERT ... ON CONFLICT(file_id) DO UPDATE document_ev │
 │      2. UPDATE file_inventory SET status, terminal_code       │
 │  - Emits real-time progress, throughput, and ETA              │
 └───────────────────────────────────────────────────────────────┘
```

#### Key Architectural Guarantees:
1. **Zero DB Contention**: There is exactly **one** write connection to `run_evidence.db`, owned exclusively by the main process. Multi-process database lock deadlocks are mathematically impossible.
2. **True CPU Scalability**: Document parsing runs in 4 separate OS processes without GIL serialization.
3. **Crash Resilience**: If a document causes an unhandled memory fault or process termination, the main process catches the `ProcessExecutionError`, logs the file ID as `FAILED`, and continues without corrupting SQLite or stalling the remaining workers.
4. **Lightweight IPC**: The worker processes return plain Python dictionaries containing text, JSON strings, and metadata. No complex objects or database handles cross process boundaries.

---

## 3. Batch Database Write Discipline & Transaction Management

### 3.1 Connection Hardening via `db_utils`
The database writer connects exclusively using `db_utils.get_evidence_conn()`:
- `PRAGMA busy_timeout = 30000;` (30-second resilience against external readers/monitors).
- `PRAGMA foreign_keys = ON;` (Strict referential integrity between `document_evidence.file_id` and `file_inventory.file_id`).
- `PRAGMA synchronous = NORMAL;` (Optimal WAL write performance without disk corruption risk).
- `PRAGMA journal_mode = WAL;` (Concurrent read/write capability).
- `PRAGMA cache_size = -64000;` (64 MB in-memory page cache).
- `PRAGMA temp_store = MEMORY;` (Fast temporary index operations).

### 3.2 Transaction Batching via `db_utils.immediate_transaction()`
Writing each document extraction result individually would require 763 separate transactions, incurring substantial WAL sync overhead. 

The pipeline batches writes:
- **Batch Size ($B$)**: Default 50 items (configurable via `--batch-size`).
- **Batch Flush Trigger**: A batch is committed whenever the buffer reaches $B$ items or when all submitted jobs have completed (final drain).
- **Atomic Transaction Scope**:
  Within a single `with db_utils.immediate_transaction(conn) as cur:` context:
  1. `cur.executemany(SQL_UPSERT_DOCUMENT_EVIDENCE, doc_records)`
  2. `cur.executemany(SQL_UPDATE_FILE_INVENTORY, inv_records)`
- **`BEGIN IMMEDIATE` Protection**:
  Calling `immediate_transaction()` acquires SQLite's `RESERVED` lock immediately at transaction entry. This prevents lock escalation deadlocks (`SQLITE_BUSY: database is locked`) when external read-only monitoring processes (such as `monitor_telemetry.py`) are concurrently inspecting `run_evidence.db`.

---

## 4. Schema Enforcement & Absolute Idempotency ($f(f(x)) = f(x)$)

### 4.1 Schema DDL & Required Index
In the baseline `init_evidence_db.py`, `document_evidence` was created with a foreign key referencing `file_inventory(file_id)`, but without a unique constraint on `file_id`. 

To prevent duplicate rows and ID churn, `document_extractor.py` must ensure the following unique index exists prior to pipeline execution:

```sql
-- Ensure unique index for 1:1 relationship between file_inventory and document_evidence
CREATE UNIQUE INDEX IF NOT EXISTS uq_document_evidence_file_id 
ON document_evidence(file_id);

-- Ensure auxiliary indices for query performance
CREATE INDEX IF NOT EXISTS idx_document_evidence_doc_type 
ON document_evidence(doc_type);
```

### 4.2 Eliminating ID Churn via `ON CONFLICT DO UPDATE`
In SQLite, using `INSERT OR REPLACE` or `DELETE + INSERT` drops the existing row and allocates a new `id` from the `AUTOINCREMENT` sequence. This causes **ID churn**, invalidates existing foreign keys, and violates forensic bit-level invariance.

To achieve exact invariance, the pipeline uses `INSERT ... ON CONFLICT(file_id) DO UPDATE SET`:

```sql
INSERT INTO document_evidence (
    file_id,
    doc_type,
    extracted_text,
    page_count,
    tables_json,
    metadata_json
) VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(file_id) DO UPDATE SET
    doc_type = excluded.doc_type,
    extracted_text = excluded.extracted_text,
    page_count = excluded.page_count,
    tables_json = excluded.tables_json,
    metadata_json = excluded.metadata_json;
```

#### Properties of this SQL Statement:
1. **Preserves Primary Key (`id`)**: The existing primary key `id` and `created_at` timestamp are never mutated.
2. **Zero Duplicate Rows**: Exactly one row exists per `file_id`.
3. **Bit-for-Bit Idempotency**: Re-executing extraction against identical source files yields zero new rows, zero deleted rows, zero modified IDs, and an identical SHA-256 state hash across the table.

### 4.3 Updating `file_inventory` Terminal Status
Simultaneously, `file_inventory` is updated in the same transaction:

```sql
UPDATE file_inventory SET
    status = ?,
    terminal_code = ?,
    error_message = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE file_id = ?;
```

#### Terminal Code Taxonomy:
| Status | Terminal Code | Description |
|---|---|---|
| `COMPLETED` | `EXTRACTED_SUCCESS` | Document parsed cleanly; text, tables, and metadata populated. |
| `COMPLETED` | `EMPTY_TEXT_EXTRACTED` | Document structure parsed cleanly, but text is blank (e.g. scanned image-only PDF; flagged for OCR in M4). |
| `FAILED` | `PASSWORD_PROTECTED` | Document is encrypted and requires a password to open. |
| `FAILED` | `CORRUPTED_OR_FAILED` | File structure is corrupt, invalid zip header, or parsing library raised an unhandled exception. |
| `UNSUPPORTED` | `ZERO_BYTE` | File size is 0 bytes; skipped without opening. |
| `UNSUPPORTED` | `UNSUPPORTED_FORMAT` | Format cannot be parsed by available engines (e.g., legacy binary `.doc` / `.xls` without specialized converter). |

---

## 5. Resumability & Selective Execution Design

### 5.1 Query Filters
1. **Standard Resumable Execution (Default)**:
   ```sql
   SELECT file_id, rel_path, abs_path, file_size, sha256
   FROM file_inventory
   WHERE modality = 'DOCUMENT'
     AND status = 'PENDING'
   ORDER BY file_size ASC, file_id ASC;
   ```
   - Only processes documents that have not yet reached a terminal state.
   - If an interrupted execution processed 20 documents, restarting the command immediately resumes at document 21.

2. **Force Reprocessing (`--force-reprocess`)**:
   ```sql
   SELECT file_id, rel_path, abs_path, file_size, sha256
   FROM file_inventory
   WHERE modality = 'DOCUMENT'
   ORDER BY file_size ASC, file_id ASC;
   ```
   - Overrides prior `COMPLETED` or `FAILED` statuses and re-extracts every document.
   - Thanks to `ON CONFLICT(file_id) DO UPDATE`, existing `id` values remain unchanged.

3. **Size-Ascending Order Scheduling (`ORDER BY file_size ASC`)**:
   - Small documents (0 KB - 50 KB) parse in milliseconds.
   - Processing smaller files first establishes rapid progress feedback and prevents worker starvation behind large multi-megabyte PDFs during initial startup.

---

## 6. Detailed Format Extraction Strategy

Each worker process executes `extract_document(job_dict)`, which routes to format-specific extractors:

### 6.1 PDF Extraction (PyMuPDF / `fitz`)
- **Magic Byte Sniffing**: Inspects extensionless files (e.g. `DOC-20251120-WA0006`, `DOC-20260116-WA0000`). If leading bytes match `%PDF-`, routes to PDF parser regardless of extension.
- **Encryption Check**: Checks `doc.is_encrypted`. Attempts `doc.authenticate("")`. If failed, returns `FAILED / PASSWORD_PROTECTED`.
- **Text Extraction**: Iterates `page.get_text("text")` across all pages.
- **Table Extraction**: Calls `page.find_tables()`. Iterates extracted tables, extracting headers (`table.header.names`) and row content (`table.extract()`).
- **Scanned PDF Heuristic**: If `page_count > 0` and total extracted text is empty or whitespace-only, flags `is_scanned: true` in `metadata_json`. Assigns `terminal_code = 'EMPTY_TEXT_EXTRACTED'` to indicate readiness for M4 OCR fallback.

### 6.2 DOCX Extraction (`python-docx`)
- **Paragraphs**: Reads all non-empty paragraph text: `[p.text for p in doc.paragraphs if p.text.strip()]`.
- **Tables**: Iterates `doc.tables`. Extracts headers from row 0 and cell values from subsequent rows.
- **Core Properties**: Extracts `author`, `title`, `created`, `modified` from `doc.core_properties`.

### 6.3 ODS Extraction (`odfpy` / `pandas`)
- **Sheets**: Reads sheets via `pandas.ExcelFile(abs_path, engine='odf')`.
- **Tabular Data**: For each sheet, converts rows to a list of dicts or records.
- **Text Representation**: Emits structured sheet previews for cross-modal indexing.

### 6.4 XLSX Extraction (`openpyxl` / `pandas`)
- **Worksheets**: Loads workbook with `data_only=True` (reads evaluated formula values rather than raw formula strings).
- **Tabular Data**: Extracts sheet names, dimensions, column headers, and data rows.

### 6.5 Plain Text (`.txt`)
- **Encoding Cascade**: Tries encodings in strict order:
  1. `utf-8`
  2. `utf-8-sig`
  3. `cp1252` (Windows Western European - vital for Spanish accented characters in Windows WhatsApp exports)
  4. `latin-1` (ISO-8859-1 fallback)
- **Metadata**: Records detected encoding, line count, and character count.

---

## 7. Complete Production Code Blueprint: `document_extractor.py`

Below is the complete, production-ready implementation blueprint for `forensics_multiagent_run\scripts\document_extractor.py`:

```python
"""
document_extractor.py - Production Multi-Process Document Extraction Pipeline
WhatsApp Digital Forensic Multi-Agent Operation — Milestone M3

Features:
1. Concurrency: 4-worker ProcessPoolExecutor for pure CPU extraction.
2. Contention-Free Writing: Dedicated main-process DB writer using db_utils.immediate_transaction().
3. Absolute Idempotency: uq_document_evidence_file_id + ON CONFLICT(file_id) DO UPDATE SET.
4. Zero ID Churn: Existing primary keys and autoincrement sequence remain invariant.
5. Resumability: Processes status = 'PENDING' by default; supports --force-reprocess.
6. Comprehensive Formats: PDF (PyMuPDF), DOCX, ODS, XLSX, TXT, and extensionless %PDF- files.
7. Objective Telemetry: Dynamic progress %, docs/sec throughput, and ETA.
8. Output Reporting: forensics_multiagent_run/reports/m3_document_extraction_report.json.
"""

import argparse
import concurrent.futures
import datetime
import hashlib
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Path Resolution
SCRIPT_DIR = Path(__file__).parent.resolve()
ROOT_DIR = SCRIPT_DIR.parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import db_utils

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [M3_DOC_EXTRACTOR] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("document_extractor")

# Constants & Defaults
DEFAULT_EVIDENCE_DB = ROOT_DIR / "run_evidence.db"
DEFAULT_REPORT_PATH = ROOT_DIR / "reports" / "m3_document_extraction_report.json"
DEFAULT_WORKERS = 4
DEFAULT_BATCH_SIZE = 50

# SQL Statements
SQL_ENSURE_SCHEMA = """
CREATE UNIQUE INDEX IF NOT EXISTS uq_document_evidence_file_id 
ON document_evidence(file_id);
CREATE INDEX IF NOT EXISTS idx_document_evidence_doc_type 
ON document_evidence(doc_type);
"""

SQL_SELECT_PENDING_DOCS = """
SELECT file_id, rel_path, abs_path, file_size, sha256
FROM file_inventory
WHERE modality = 'DOCUMENT'
  AND status = 'PENDING'
ORDER BY file_size ASC, file_id ASC;
"""

SQL_SELECT_ALL_DOCS = """
SELECT file_id, rel_path, abs_path, file_size, sha256
FROM file_inventory
WHERE modality = 'DOCUMENT'
ORDER BY file_size ASC, file_id ASC;
"""

SQL_UPSERT_DOCUMENT_EVIDENCE = """
INSERT INTO document_evidence (
    file_id, doc_type, extracted_text, page_count, tables_json, metadata_json
) VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(file_id) DO UPDATE SET
    doc_type = excluded.doc_type,
    extracted_text = excluded.extracted_text,
    page_count = excluded.page_count,
    tables_json = excluded.tables_json,
    metadata_json = excluded.metadata_json;
"""

SQL_UPDATE_FILE_INVENTORY = """
UPDATE file_inventory SET
    status = ?,
    terminal_code = ?,
    error_message = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE file_id = ?;
"""


# ---------------------------------------------------------------------------
# Worker Extraction Routines (Top-level, picklable functions)
# ---------------------------------------------------------------------------

def is_magic_pdf(abs_path: Path) -> bool:
    """Sniffs leading bytes for %PDF- header."""
    try:
        with open(abs_path, "rb") as f:
            header = f.read(1024)
            return header.startswith(b"%PDF-")
    except Exception:
        return False


def extract_pdf(abs_path: Path) -> Tuple[str, int, List[Dict[str, Any]], Dict[str, Any], Optional[str]]:
    """Extracts text, tables, and metadata from a PDF file using PyMuPDF (fitz)."""
    import fitz  # PyMuPDF

    doc = fitz.open(str(abs_path))
    if doc.is_encrypted:
        if not doc.authenticate(""):
            doc.close()
            return "", 0, [], {}, "PASSWORD_PROTECTED"

    page_count = len(doc)
    text_parts = []
    tables = []

    for page_idx, page in enumerate(doc):
        # Extract plain text
        ptxt = page.get_text("text")
        if ptxt:
            text_parts.append(ptxt.strip())

        # Extract structured tables
        try:
            tabs = page.find_tables()
            for t_idx, tab in enumerate(tabs):
                headers = tab.header.names if tab.header else []
                rows = tab.extract()
                tables.append({
                    "sheet_or_page": page_idx + 1,
                    "table_index": t_idx + 1,
                    "headers": headers,
                    "rows": rows,
                    "row_count": len(rows),
                    "col_count": len(headers) if headers else (len(rows[0]) if rows else 0)
                })
        except Exception as te:
            logger.debug(f"Table extraction error on page {page_idx + 1} of {abs_path.name}: {te}")

    meta = {
        "title": doc.metadata.get("title"),
        "author": doc.metadata.get("author"),
        "subject": doc.metadata.get("subject"),
        "creator": doc.metadata.get("creator"),
        "producer": doc.metadata.get("producer"),
        "creationDate": doc.metadata.get("creationDate"),
        "modDate": doc.metadata.get("modDate"),
        "page_count": page_count,
        "is_scanned": (page_count > 0 and len("".join(text_parts).strip()) == 0)
    }
    doc.close()

    full_text = "\n\n".join(text_parts)
    return full_text, page_count, tables, meta, None


def extract_docx(abs_path: Path) -> Tuple[str, int, List[Dict[str, Any]], Dict[str, Any], Optional[str]]:
    """Extracts text and tables from a DOCX file using python-docx."""
    from docx import Document

    doc = Document(str(abs_path))
    text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
    tables = []

    for t_idx, table in enumerate(doc.tables):
        rows_data = []
        for row in table.rows:
            rows_data.append([cell.text.strip() for cell in row.cells])
        if rows_data:
            headers = rows_data[0]
            data_rows = rows_data[1:] if len(rows_data) > 1 else []
            tables.append({
                "sheet_or_page": 1,
                "table_index": t_idx + 1,
                "headers": headers,
                "rows": data_rows,
                "row_count": len(data_rows),
                "col_count": len(headers)
            })

    props = doc.core_properties
    meta = {
        "title": props.title,
        "author": props.author,
        "created": props.created.isoformat() if props.created else None,
        "modified": props.modified.isoformat() if props.modified else None,
        "revision": props.revision,
        "paragraphs_count": len(doc.paragraphs),
        "tables_count": len(doc.tables)
    }

    full_text = "\n\n".join(text_parts)
    return full_text, 1, tables, meta, None


def extract_ods(abs_path: Path) -> Tuple[str, int, List[Dict[str, Any]], Dict[str, Any], Optional[str]]:
    """Extracts tabular data and text from an ODS spreadsheet."""
    import pandas as pd

    xl = pd.ExcelFile(str(abs_path), engine="odf")
    tables = []
    text_parts = []

    for sheet_idx, sheet_name in enumerate(xl.sheet_names):
        df = xl.parse(sheet_name)
        headers = [str(c) for c in df.columns]
        rows = df.astype(str).values.tolist()
        tables.append({
            "sheet_or_page": sheet_name,
            "table_index": sheet_idx + 1,
            "headers": headers,
            "rows": rows,
            "row_count": len(rows),
            "col_count": len(headers)
        })
        text_parts.append(f"Sheet: {sheet_name}\n" + df.to_string(index=False))

    meta = {
        "sheet_names": xl.sheet_names,
        "sheet_count": len(xl.sheet_names)
    }
    return "\n\n".join(text_parts), len(xl.sheet_names), tables, meta, None


def extract_xlsx(abs_path: Path) -> Tuple[str, int, List[Dict[str, Any]], Dict[str, Any], Optional[str]]:
    """Extracts tabular data and text from an XLSX spreadsheet."""
    import openpyxl

    wb = openpyxl.load_workbook(str(abs_path), data_only=True, read_only=True)
    tables = []
    text_parts = []

    for sheet_idx, sheet_name in enumerate(wb.sheetnames):
        ws = wb[sheet_name]
        sheet_rows = []
        for row in ws.iter_rows(values_only=True):
            if any(cell is not None for cell in row):
                sheet_rows.append([str(c) if c is not None else "" for c in row])

        if sheet_rows:
            headers = sheet_rows[0]
            data_rows = sheet_rows[1:] if len(sheet_rows) > 1 else []
            tables.append({
                "sheet_or_page": sheet_name,
                "table_index": sheet_idx + 1,
                "headers": headers,
                "rows": data_rows,
                "row_count": len(data_rows),
                "col_count": len(headers)
            })
            text_parts.append(f"Sheet: {sheet_name}\n" + "\n".join(["\t".join(r) for r in sheet_rows[:100]]))

    meta = {
        "sheet_names": wb.sheetnames,
        "sheet_count": len(wb.sheetnames)
    }
    wb.close()
    return "\n\n".join(text_parts), len(wb.sheetnames), tables, meta, None


def extract_txt(abs_path: Path) -> Tuple[str, int, List[Dict[str, Any]], Dict[str, Any], Optional[str]]:
    """Extracts plain text with multi-encoding fallback."""
    encodings = ["utf-8", "utf-8-sig", "cp1252", "latin-1"]
    raw = abs_path.read_bytes()

    for enc in encodings:
        try:
            text = raw.decode(enc)
            meta = {"encoding": enc, "byte_size": len(raw), "line_count": len(text.splitlines())}
            return text, 1, [], meta, None
        except UnicodeDecodeError:
            continue

    return "", 0, [], {}, "CORRUPTED_OR_FAILED"


def worker_extract_document(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Entry point for worker process. Pure function: takes job dict, returns result dict.
    Does NOT connect to SQLite.
    """
    file_id = job["file_id"]
    abs_path = Path(job["abs_path"])
    rel_path = job["rel_path"]
    file_size = job["file_size"]
    ext = abs_path.suffix.lower()

    # 1. Check for 0-byte file
    if file_size == 0 or (abs_path.exists() and abs_path.stat().st_size == 0):
        return {
            "file_id": file_id,
            "rel_path": rel_path,
            "doc_type": "PDF" if "pdf" in ext else "TXT",
            "extracted_text": "",
            "page_count": 0,
            "tables_json": "[]",
            "metadata_json": json.dumps({"error": "0-byte file"}),
            "status": "UNSUPPORTED",
            "terminal_code": "ZERO_BYTE",
            "error_message": "0-byte document file",
            "duration_sec": 0.0
        }

    # 2. Check for missing file
    if not abs_path.exists():
        return {
            "file_id": file_id,
            "rel_path": rel_path,
            "doc_type": "PDF",
            "extracted_text": "",
            "page_count": 0,
            "tables_json": "[]",
            "metadata_json": json.dumps({"error": "File not found"}),
            "status": "FAILED",
            "terminal_code": "CORRUPTED_OR_FAILED",
            "error_message": f"Physical file not found: {abs_path}",
            "duration_sec": 0.0
        }

    t0 = time.time()
    doc_type = "PDF"
    extracted_text = ""
    page_count = 0
    tables = []
    metadata = {}
    err_code = None
    err_msg = None

    try:
        # Determine format (handling extensionless %PDF-)
        if not ext or abs_path.name.startswith("DOC-") or ext == ".pdf":
            if is_magic_pdf(abs_path) or ext == ".pdf":
                doc_type = "PDF"
                extracted_text, page_count, tables, metadata, err_code = extract_pdf(abs_path)
            else:
                doc_type = "TXT"
                extracted_text, page_count, tables, metadata, err_code = extract_txt(abs_path)
        elif ext == ".docx":
            doc_type = "DOCX"
            extracted_text, page_count, tables, metadata, err_code = extract_docx(abs_path)
        elif ext == ".ods":
            doc_type = "ODS"
            extracted_text, page_count, tables, metadata, err_code = extract_ods(abs_path)
        elif ext in (".xlsx", ".xls"):
            doc_type = "XLSX"
            extracted_text, page_count, tables, metadata, err_code = extract_xlsx(abs_path)
        elif ext in (".txt", ".csv", ".vcf"):
            doc_type = "TXT"
            extracted_text, page_count, tables, metadata, err_code = extract_txt(abs_path)
        else:
            return {
                "file_id": file_id,
                "rel_path": rel_path,
                "doc_type": "PDF",
                "extracted_text": "",
                "page_count": 0,
                "tables_json": "[]",
                "metadata_json": json.dumps({"unsupported_extension": ext}),
                "status": "UNSUPPORTED",
                "terminal_code": "UNSUPPORTED_FORMAT",
                "error_message": f"Unsupported document extension: {ext}",
                "duration_sec": round(time.time() - t0, 4)
            }

        # Terminal status determination
        if err_code == "PASSWORD_PROTECTED":
            status = "FAILED"
            term_code = "PASSWORD_PROTECTED"
            err_msg = "Document is password encrypted"
        elif err_code:
            status = "FAILED"
            term_code = err_code
            err_msg = f"Extraction failed with code: {err_code}"
        else:
            status = "COMPLETED"
            if len(extracted_text.strip()) == 0 and page_count > 0:
                term_code = "EMPTY_TEXT_EXTRACTED"
            else:
                term_code = "EXTRACTED_SUCCESS"

    except Exception as exc:
        status = "FAILED"
        term_code = "CORRUPTED_OR_FAILED"
        err_msg = f"{type(exc).__name__}: {str(exc)}"
        metadata = {"exception_type": type(exc).__name__, "exception_str": str(exc)}

    duration = round(time.time() - t0, 4)

    return {
        "file_id": file_id,
        "rel_path": rel_path,
        "doc_type": doc_type,
        "extracted_text": extracted_text,
        "page_count": page_count,
        "tables_json": json.dumps(tables, ensure_ascii=False),
        "metadata_json": json.dumps(metadata, ensure_ascii=False),
        "status": status,
        "terminal_code": term_code,
        "error_message": err_msg,
        "duration_sec": duration
    }


# ---------------------------------------------------------------------------
# Main Orchestration & Dedicated Database Writer Loop
# ---------------------------------------------------------------------------

def run_document_extraction_pipeline(
    db_path: Path = DEFAULT_EVIDENCE_DB,
    report_path: Path = DEFAULT_REPORT_PATH,
    workers: int = DEFAULT_WORKERS,
    batch_size: int = DEFAULT_BATCH_SIZE,
    limit: Optional[int] = None,
    file_id: Optional[int] = None,
    force_reprocess: bool = False,
    dry_run: bool = False
) -> Dict[str, Any]:
    """
    Executes the multi-process document extraction pipeline.
    """
    t_start = time.time()
    conn = db_utils.get_evidence_conn(db_path)

    # 1. Enforce unique index schema
    if not dry_run:
        with db_utils.immediate_transaction(conn) as cur:
            cur.executescript(SQL_ENSURE_SCHEMA)
        logger.info("Enforced unique index uq_document_evidence_file_id.")

    # 2. Select Candidate Files
    cur = conn.cursor()
    if file_id is not None:
        cur.execute(
            "SELECT file_id, rel_path, abs_path, file_size, sha256 FROM file_inventory WHERE file_id = ?;",
            (file_id,)
        )
    elif force_reprocess:
        query = SQL_SELECT_ALL_DOCS
        if limit and limit > 0:
            query = f"{query.rstrip(';')} LIMIT {int(limit)};"
        cur.execute(query)
    else:
        query = SQL_SELECT_PENDING_DOCS
        if limit and limit > 0:
            query = f"{query.rstrip(';')} LIMIT {int(limit)};"
        cur.execute(query)

    rows = cur.fetchall()
    jobs = [dict(r) for r in rows]
    total_jobs = len(jobs)

    logger.info(
        f"Pipeline start: {total_jobs} candidate documents queued "
        f"(workers={workers}, batch_size={batch_size}, force_reprocess={force_reprocess})."
    )

    if total_jobs == 0:
        logger.info("Zero documents pending extraction. Workstream is already fully resolved!")
        conn.close()
        return {
            "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "milestone": "M3",
            "total_candidate_documents": 0,
            "duration_seconds": round(time.time() - t_start, 3),
            "status": "ALL_ALREADY_COMPLETED"
        }

    # Tracking metrics
    completed_count = 0
    failed_count = 0
    unsupported_count = 0
    format_stats = {"PDF": 0, "DOCX": 0, "ODS": 0, "XLSX": 0, "TXT": 0}
    total_pages_extracted = 0
    anomalies = []

    pending_doc_evidence: List[Tuple[int, str, str, int, str, str]] = []
    pending_inventory_updates: List[Tuple[str, str, Optional[str], int]] = []

    def flush_batch():
        nonlocal pending_doc_evidence, pending_inventory_updates
        if dry_run or not pending_doc_evidence:
            pending_doc_evidence.clear()
            pending_inventory_updates.clear()
            return

        with db_utils.immediate_transaction(conn) as write_cur:
            write_cur.executemany(SQL_UPSERT_DOCUMENT_EVIDENCE, pending_doc_evidence)
            write_cur.executemany(SQL_UPDATE_FILE_INVENTORY, pending_inventory_updates)

        pending_doc_evidence.clear()
        pending_inventory_updates.clear()

    # 3. Multi-Process Execution Pool
    processed_count = 0
    with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(worker_extract_document, job): job for job in jobs}

        for future in concurrent.futures.as_completed(future_map):
            job = future_map[future]
            try:
                res = future.result()
            except Exception as proc_exc:
                logger.error(f"Process crashed on file_id {job['file_id']}: {proc_exc}")
                res = {
                    "file_id": job["file_id"],
                    "rel_path": job["rel_path"],
                    "doc_type": "PDF",
                    "extracted_text": "",
                    "page_count": 0,
                    "tables_json": "[]",
                    "metadata_json": json.dumps({"worker_crash": str(proc_exc)}),
                    "status": "FAILED",
                    "terminal_code": "CORRUPTED_OR_FAILED",
                    "error_message": f"Worker process crashed: {proc_exc}",
                    "duration_sec": 0.0
                }

            processed_count += 1
            f_id = res["file_id"]
            d_type = res["doc_type"]
            status = res["status"]
            term_code = res["terminal_code"]
            err_msg = res["error_message"]

            if status == "COMPLETED":
                completed_count += 1
                format_stats[d_type] = format_stats.get(d_type, 0) + 1
                total_pages_extracted += res["page_count"]
            elif status == "FAILED":
                failed_count += 1
                anomalies.append({
                    "file_id": f_id,
                    "rel_path": res["rel_path"],
                    "terminal_code": term_code,
                    "error": err_msg
                })
            elif status == "UNSUPPORTED":
                unsupported_count += 1
                anomalies.append({
                    "file_id": f_id,
                    "rel_path": res["rel_path"],
                    "terminal_code": term_code,
                    "error": err_msg
                })

            # Queue for batch commit
            # doc_evidence: (file_id, doc_type, extracted_text, page_count, tables_json, metadata_json)
            pending_doc_evidence.append((
                f_id, d_type, res["extracted_text"], res["page_count"],
                res["tables_json"], res["metadata_json"]
            ))
            # file_inventory: (status, terminal_code, error_message, file_id)
            pending_inventory_updates.append((
                status, term_code, err_msg, f_id
            ))

            # Flush batch
            if len(pending_doc_evidence) >= batch_size:
                flush_batch()

            # Telemetry logging every 10 files or upon completion
            if processed_count % 10 == 0 or processed_count == total_jobs:
                elapsed = max(time.time() - t_start, 0.001)
                pct = (processed_count / total_jobs) * 100.0
                rate = processed_count / elapsed
                remaining = max(total_jobs - processed_count, 0)
                eta = remaining / rate if rate > 0 else 0.0
                logger.info(
                    f"Progress: {processed_count}/{total_jobs} ({pct:.1f}%) | "
                    f"OK: {completed_count}, FAIL: {failed_count}, UNSUPP: {unsupported_count} | "
                    f"Speed: {rate:.1f} docs/sec | ETA: {eta:.1f}s"
                )

    # Final batch flush
    flush_batch()
    conn.close()

    total_duration = round(time.time() - t_start, 3)
    logger.info(
        f"Extraction pipeline completed in {total_duration}s: "
        f"{completed_count} success, {failed_count} failed, {unsupported_count} unsupported."
    )

    # 4. Generate JSON Report
    report_data = {
        "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "milestone": "M3",
        "operation": "WhatsApp Digital Forensic Operation — Milestone M3 Document Extraction",
        "duration_seconds": total_duration,
        "concurrency": {
            "worker_model": "ProcessPoolExecutor",
            "worker_count": workers,
            "db_write_discipline": "Single-writer batch immediate_transaction",
            "batch_size": batch_size
        },
        "terminal_accounting": {
            "total_candidate_documents": total_jobs,
            "completed_success": completed_count,
            "failed_corrupted": failed_count,
            "unsupported_zero_byte": unsupported_count,
            "formula": "[Total Candidate] = [Completed] + [Failed] + [Unsupported]",
            "verified": (total_jobs == completed_count + failed_count + unsupported_count)
        },
        "format_breakdown": format_stats,
        "total_pages_or_sheets_extracted": total_pages_extracted,
        "anomalies_detected": anomalies
    }

    report_path.parent.mkdir(parents=True, exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    logger.info(f"Summary report written to: {report_path}")

    return report_data


# ---------------------------------------------------------------------------
# CLI Argument Parser
# ---------------------------------------------------------------------------

def parse_args():
    parser = argparse.ArgumentParser(
        description="Milestone M3 Document Extractor Pipeline (4 CPU Workers, Contention-Free WAL Writing)"
    )
    parser.add_argument(
        "--db-path",
        type=Path,
        default=DEFAULT_EVIDENCE_DB,
        help="Path to run_evidence.db SQLite database"
    )
    parser.add_argument(
        "--report-path",
        type=Path,
        default=DEFAULT_REPORT_PATH,
        help="Path to write m3_document_extraction_report.json"
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help="Number of worker processes (default: 4)"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help="Number of document records per atomic DB write transaction (default: 50)"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Maximum number of documents to process (for testing/dry-runs)"
    )
    parser.add_argument(
        "--file-id",
        type=int,
        default=None,
        help="Process a single specific file_id for targeted debugging"
    )
    parser.add_argument(
        "--force-reprocess",
        action="store_true",
        help="Force extraction on all documents even if already COMPLETED"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run document extraction without committing changes to run_evidence.db"
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging level"
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    run_document_extraction_pipeline(
        db_path=args.db_path,
        report_path=args.report_path,
        workers=args.workers,
        batch_size=args.batch_size,
        limit=args.limit,
        file_id=args.file_id,
        force_reprocess=args.force_reprocess,
        dry_run=args.dry_run
    )
```

---

## 8. Verification & Test Suite Design: `test_m3_document_extraction.py`

The test suite must verify the extraction pipeline across four strict dimensions:
1. **Mock / Fixture Unit Testing**: Tests parsing of synthetic PDF, DOCX, ODS, XLSX, TXT, corrupted files, and 0-byte files without requiring live data.
2. **Idempotency & State Invariance ($f(f(x)) = f(x)$)**: Asserts that double-running the pipeline on a test database causes `delta == 0`, preserves `max(id)` without ID churn, and produces identical cryptographic state digests.
3. **Live Database Integration**: Verifies extraction on a sample of real documents from `run_evidence.db` (including extensionless PDFs).
4. **Baseline Database Invariance**: Asserts that `whatsapp_forensics.db` remains 100% untouched bit-for-bit (SHA-256: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`).

### 8.1 Complete Test Suite Implementation Blueprint

```python
"""
test_m3_document_extraction.py - Comprehensive Verification Test Suite for Milestone M3
WhatsApp Digital Forensic Multi-Agent Operation — Milestone M3

Covers:
1. Mock Fixture Tests: PDF, DOCX, ODS, XLSX, TXT, extensionless %PDF-, 0-byte, and corrupted files.
2. Idempotency & Zero ID Churn: Double execution yields delta == 0 and identical SHA-256 state hash.
3. Live Database Subset Integration: Validates extraction against live run_evidence.db.
4. Baseline Database Invariance: Confirms whatsapp_forensics.db SHA-256 remains untouched.
"""

import hashlib
import json
import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Tuple

# Path Resolution
TEST_DIR = Path(__file__).parent.resolve()
TARGET_DIR = TEST_DIR.parent
SCRIPTS_DIR = TARGET_DIR / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import db_utils
from document_extractor import (
    worker_extract_document,
    run_document_extraction_pipeline,
    SQL_ENSURE_SCHEMA,
    is_magic_pdf
)

BASELINE_DB = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db")
EXPECTED_BASELINE_SHA256 = "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3"
RUN_EVIDENCE_DB = TARGET_DIR / "run_evidence.db"


def compute_file_sha256(path: Path) -> str:
    """Computes streaming SHA-256 hash in 64KB chunks."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def compute_document_evidence_state_hash(conn: sqlite3.Connection) -> Tuple[int, int, str]:
    """
    Computes a cryptographic digest across all rows in document_evidence
    to detect any row churn, ID renumbering, or value mutation.
    Returns: (total_rows, max_id, sha256_hexdigest)
    """
    cur = conn.cursor()
    cur.execute("""
        SELECT id, file_id, doc_type, extracted_text, page_count, tables_json, metadata_json
        FROM document_evidence
        ORDER BY id ASC;
    """)
    rows = cur.fetchall()
    total_rows = len(rows)
    max_id = max((r[0] for r in rows), default=0)

    hasher = hashlib.sha256()
    for row in rows:
        row_str = "|".join(str(val) if val is not None else "<NULL>" for val in row)
        hasher.update(row_str.encode("utf-8"))
        hasher.update(b"\n")

    return total_rows, max_id, hasher.hexdigest()


class TestM3DocumentExtractionFixtures(unittest.TestCase):
    """Unit tests for individual document extractors using synthetic fixtures."""

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.work_dir = Path(self.tmp_dir.name)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_01_synthetic_pdf_extraction(self):
        """Generates a synthetic PDF with text and table, verifying PyMuPDF extraction."""
        import fitz
        pdf_path = self.work_dir / "test_doc.pdf"
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 50), "Getxo Bela Eskola Forensic Report - Cuota 100 EUR")
        # Insert simple table-like lines
        page.insert_text((50, 80), "Header1\tHeader2")
        page.insert_text((50, 100), "Value1\tValue2")
        doc.save(str(pdf_path))
        doc.close()

        job = {
            "file_id": 101,
            "abs_path": str(pdf_path),
            "rel_path": "test_doc.pdf",
            "file_size": pdf_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["terminal_code"], "EXTRACTED_SUCCESS")
        self.assertEqual(res["doc_type"], "PDF")
        self.assertEqual(res["page_count"], 1)
        self.assertIn("Getxo Bela Eskola", res["extracted_text"])

    def test_02_extensionless_magic_pdf(self):
        """Tests that extensionless file with %PDF- header is identified and parsed."""
        import fitz
        raw_pdf_path = self.work_dir / "DOC-20251120-WA0006"
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 50), "CaixaBank Extracto de Cuenta")
        doc.save(str(raw_pdf_path))
        doc.close()

        self.assertTrue(is_magic_pdf(raw_pdf_path))

        job = {
            "file_id": 102,
            "abs_path": str(raw_pdf_path),
            "rel_path": "DOC-20251120-WA0006",
            "file_size": raw_pdf_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["doc_type"], "PDF")
        self.assertIn("CaixaBank", res["extracted_text"])

    def test_03_synthetic_docx_extraction(self):
        """Generates a synthetic DOCX with paragraphs and tables, verifying extraction."""
        from docx import Document
        docx_path = self.work_dir / "contract.docx"
        doc = Document()
        doc.add_paragraph("Asociacion Club Deportivo Vela Pakea")
        table = doc.add_table(rows=2, cols=2)
        table.cell(0, 0).text = "Concept"
        table.cell(0, 1).text = "Fee"
        table.cell(1, 0).text = "J80 Initiation"
        table.cell(1, 1).text = "180"
        doc.save(str(docx_path))

        job = {
            "file_id": 103,
            "abs_path": str(docx_path),
            "rel_path": "contract.docx",
            "file_size": docx_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["doc_type"], "DOCX")
        self.assertIn("Vela Pakea", res["extracted_text"])
        tables_json = json.loads(res["tables_json"])
        self.assertEqual(len(tables_json), 1)
        self.assertEqual(tables_json[0]["headers"], ["Concept", "Fee"])

    def test_04_synthetic_xlsx_extraction(self):
        """Generates a synthetic XLSX sheet, verifying tabular structure extraction."""
        import openpyxl
        xlsx_path = self.work_dir / "balances.xlsx"
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Cuotas2026"
        ws.append(["Name", "DNI", "Amount"])
        ws.append(["Urko Santillan", "16089994E", "100"])
        wb.save(str(xlsx_path))

        job = {
            "file_id": 104,
            "abs_path": str(xlsx_path),
            "rel_path": "balances.xlsx",
            "file_size": xlsx_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["doc_type"], "XLSX")
        tables_json = json.loads(res["tables_json"])
        self.assertEqual(len(tables_json), 1)
        self.assertEqual(tables_json[0]["headers"], ["Name", "DNI", "Amount"])

    def test_05_txt_multi_encoding_fallback(self):
        """Tests reading plain text files encoded in CP1252 with Spanish accents."""
        txt_path = self.work_dir / "spanish_cp1252.txt"
        spanish_text = "Asociación deportiva, cuotas pagadas en Getxo, año 2026."
        txt_path.write_bytes(spanish_text.encode("cp1252"))

        job = {
            "file_id": 105,
            "abs_path": str(txt_path),
            "rel_path": "spanish_cp1252.txt",
            "file_size": txt_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertEqual(res["doc_type"], "TXT")
        self.assertIn("Asociación", res["extracted_text"])
        meta = json.loads(res["metadata_json"])
        self.assertEqual(meta["encoding"], "cp1252")

    def test_06_zero_byte_file_terminal_resolution(self):
        """Verifies that 0-byte document is resolved to UNSUPPORTED / ZERO_BYTE."""
        zero_path = self.work_dir / "empty.pdf"
        zero_path.write_bytes(b"")

        job = {
            "file_id": 106,
            "abs_path": str(zero_path),
            "rel_path": "empty.pdf",
            "file_size": 0
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "UNSUPPORTED")
        self.assertEqual(res["terminal_code"], "ZERO_BYTE")

    def test_07_corrupted_file_handling(self):
        """Verifies that corrupt binary file named .pdf is caught cleanly as FAILED."""
        corrupt_path = self.work_dir / "corrupted.pdf"
        corrupt_path.write_bytes(b"\x00\xFF\xAA\x55GARBAGE_BYTES_NOT_A_PDF")

        job = {
            "file_id": 107,
            "abs_path": str(corrupt_path),
            "rel_path": "corrupted.pdf",
            "file_size": corrupt_path.stat().st_size
        }
        res = worker_extract_document(job)
        self.assertEqual(res["status"], "FAILED")
        self.assertEqual(res["terminal_code"], "CORRUPTED_OR_FAILED")
        self.assertIsNotNone(res["error_message"])


class TestM3PipelineIdempotencyAndInvariance(unittest.TestCase):
    """Verifies pipeline transaction batching, resumability, and strict mathematical idempotency."""

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.work_dir = Path(self.tmp_dir.name)
        self.test_db_path = self.work_dir / "test_run_evidence.db"
        self.report_path = self.work_dir / "report.json"

        # Initialize mock run_evidence.db
        conn = sqlite3.connect(str(self.test_db_path))
        cur = conn.cursor()
        cur.executescript("""
            CREATE TABLE file_inventory (
                file_id INTEGER PRIMARY KEY AUTOINCREMENT,
                rel_path TEXT UNIQUE NOT NULL,
                abs_path TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                sha256 TEXT,
                modality TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'PENDING',
                terminal_code TEXT,
                error_message TEXT,
                mtime TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE document_evidence (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
                doc_type TEXT NOT NULL,
                extracted_text TEXT,
                page_count INTEGER,
                tables_json TEXT,
                metadata_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Generate sample fixture files
        self.fixture_files = []
        for i in range(1, 6):
            p = self.work_dir / f"doc_{i}.txt"
            p.write_text(f"Document content for index {i} - Club Pakea", encoding="utf-8")
            h = hashlib.sha256(p.read_bytes()).hexdigest()
            cur.execute("""
                INSERT INTO file_inventory (rel_path, abs_path, file_size, sha256, modality, status)
                VALUES (?, ?, ?, ?, 'DOCUMENT', 'PENDING');
            """, (f"rel/doc_{i}.txt", str(p), p.stat().st_size, h))
            self.fixture_files.append(p)

        conn.commit()
        conn.close()

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_double_execution_zero_churn(self):
        """
        Executes pipeline twice on identical data. Asserts:
        1. Delta in rows == 0.
        2. max(id) remains strictly unchanged.
        3. Table cryptographic state hash is bit-for-bit identical.
        """
        # Run 1
        rep1 = run_document_extraction_pipeline(
            db_path=self.test_db_path,
            report_path=self.report_path,
            workers=2,
            batch_size=2
        )
        self.assertEqual(rep1["terminal_accounting"]["completed_success"], 5)

        conn = sqlite3.connect(str(self.test_db_path))
        rows_1, max_id_1, hash_1 = compute_document_evidence_state_hash(conn)
        self.assertEqual(rows_1, 5)
        self.assertEqual(max_id_1, 5)

        # Run 2 with --force-reprocess
        rep2 = run_document_extraction_pipeline(
            db_path=self.test_db_path,
            report_path=self.report_path,
            workers=2,
            batch_size=2,
            force_reprocess=True
        )
        self.assertEqual(rep2["terminal_accounting"]["completed_success"], 5)

        rows_2, max_id_2, hash_2 = compute_document_evidence_state_hash(conn)
        conn.close()

        # Invariance assertions: f(f(x)) == f(x)
        self.assertEqual(rows_2, rows_1, f"Row count changed: {rows_1} -> {rows_2}")
        self.assertEqual(max_id_2, max_id_1, f"ID churn occurred: max(id) changed from {max_id_1} to {max_id_2}")
        self.assertEqual(hash_2, hash_1, "Cryptographic state hash mismatch after re-execution!")


class TestM3LiveDatabaseAndBaselineIntegrity(unittest.TestCase):
    """Integration checks on real production paths and read-only baseline defense."""

    def test_baseline_cryptographic_invariance(self):
        """Verifies whatsapp_forensics.db exists, matches SHA-256 baseline, and rejects writes."""
        self.assertTrue(BASELINE_DB.exists(), f"Baseline DB not found at: {BASELINE_DB}")
        current_hash = compute_file_sha256(BASELINE_DB)
        self.assertEqual(
            current_hash, EXPECTED_BASELINE_SHA256,
            "CRITICAL: Baseline database SHA-256 hash was modified!"
        )

        base_conn = db_utils.get_baseline_conn(BASELINE_DB, immutable=True)
        cur = base_conn.cursor()
        with self.assertRaises(sqlite3.OperationalError):
            cur.execute("CREATE TABLE _probe_write_fail (id INT);")
        base_conn.close()


if __name__ == "__main__":
    unittest.main()
```

---

## 9. CLI Specification, Logging Format & Output Schema

### 9.1 CLI Parameter Table
| Option | Type | Default | Description |
|---|---|---|---|
| `--db-path` | `Path` | `forensics_multiagent_run\run_evidence.db` | Target SQLite evidence ledger. |
| `--report-path` | `Path` | `forensics_multiagent_run\reports\m3_document_extraction_report.json` | Path for summary audit JSON. |
| `--workers` | `int` | `4` | Worker process pool size (concurrency limit). |
| `--batch-size` | `int` | `50` | Number of document results per atomic DB write transaction. |
| `--limit` | `int` | `None` (all) | Maximum number of candidate documents to process. |
| `--file-id` | `int` | `None` | Target a single specific file for isolated debugging. |
| `--force-reprocess` | `flag` | `False` | Reprocess all documents, overriding prior `COMPLETED` status. |
| `--dry-run` | `flag` | `False` | Parse documents without writing changes to the database. |
| `--log-level` | `str` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |

### 9.2 Real-time Progress Logging Format
```
[2026-10-29 01:25:01] [INFO] [M3_DOC_EXTRACTOR] Enforced unique index uq_document_evidence_file_id.
[2026-10-29 01:25:01] [INFO] [M3_DOC_EXTRACTOR] Pipeline start: 39 candidate documents queued (workers=4, batch_size=50, force_reprocess=False).
[2026-10-29 01:25:02] [INFO] [M3_DOC_EXTRACTOR] Progress: 10/39 (25.6%) | OK: 10, FAIL: 0, UNSUPP: 0 | Speed: 12.8 docs/sec | ETA: 2.3s
[2026-10-29 01:25:03] [INFO] [M3_DOC_EXTRACTOR] Progress: 20/39 (51.3%) | OK: 20, FAIL: 0, UNSUPP: 0 | Speed: 14.1 docs/sec | ETA: 1.3s
[2026-10-29 01:25:04] [INFO] [M3_DOC_EXTRACTOR] Progress: 39/39 (100.0%) | OK: 38, FAIL: 1, UNSUPP: 0 | Speed: 15.2 docs/sec | ETA: 0.0s
[2026-10-29 01:25:04] [INFO] [M3_DOC_EXTRACTOR] Extraction pipeline completed in 2.566s: 38 success, 1 failed, 0 unsupported.
[2026-10-29 01:25:04] [INFO] [M3_DOC_EXTRACTOR] Summary report written to: C:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m3_document_extraction_report.json
```

### 9.3 Output Report Schema (`m3_document_extraction_report.json`)
```json
{
  "timestamp_utc": "2026-10-29T01:25:04.120340+00:00",
  "milestone": "M3",
  "operation": "WhatsApp Digital Forensic Operation — Milestone M3 Document Extraction",
  "duration_seconds": 2.566,
  "concurrency": {
    "worker_model": "ProcessPoolExecutor",
    "worker_count": 4,
    "db_write_discipline": "Single-writer batch immediate_transaction",
    "batch_size": 50
  },
  "terminal_accounting": {
    "total_candidate_documents": 39,
    "completed_success": 38,
    "failed_corrupted": 1,
    "unsupported_zero_byte": 0,
    "formula": "[Total Candidate] = [Completed] + [Failed] + [Unsupported]",
    "verified": true
  },
  "format_breakdown": {
    "PDF": 28,
    "DOCX": 5,
    "ODS": 2,
    "XLSX": 3,
    "TXT": 1
  },
  "total_pages_or_sheets_extracted": 112,
  "anomalies_detected": [
    {
      "file_id": 402,
      "rel_path": "Whatsapp web Extraccion manual.../corrupted_contract.pdf",
      "terminal_code": "CORRUPTED_OR_FAILED",
      "error": "FileDataError: cannot open broken document"
    }
  ]
}
```

---

## 10. Conclusion & Handoff Readiness

The concurrency architecture, batching discipline, idempotency enforcement, and verification suite specified above provide an airtight implementation blueprint for Milestone M3. 

The implementation team (Developer Agent M3) can directly synthesize `document_extractor.py` and `test_m3_document_extraction.py` without ambiguity, ensuring high multi-core performance, zero SQLite WAL lock contention, and absolute forensic reproducibility.
