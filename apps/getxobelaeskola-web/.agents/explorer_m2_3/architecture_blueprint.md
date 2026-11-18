# Milestone M2 Architecture Blueprint: Text Forensics & Lexical Indexer
**WhatsApp Digital Forensic Operation — Architecture & Ingestion Pipeline Specification**  
**Role**: Explorer 3 (Architecture & Ingestion Pipeline Specialist)  
**Date**: 2026-10-28  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m2_3`  
**Target Systems**:
- Target Script: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\text_forensics_extractor.py`
- Target Database: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db` (`text_forensic_entities` table)
- Test Suite: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m2_text_forensics.py`
- Forensic Summary Report: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m2_text_forensics_report.json`

---

## 1. Executive Architectural Overview

Milestone M2 operationalizes the text forensics and entity extraction pipeline across the complete baseline WhatsApp communication archive (10,055 messages across 392 conversations) stored in `whatsapp_forensics.db`. 

### 1.1 Core Architectural Invariants
1. **Bit-Level Baseline Read-Only Invariance**:
   The baseline SQLite database (`whatsapp_forensics.db`, SHA-256: `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`) must never be modified. All connections to the baseline database must strictly utilize `db_utils.get_baseline_conn(immutable=True)` with SQLite URI mode `?mode=ro`, `PRAGMA query_only = ON;`, and automated active write-rejection probe validation.
2. **Strict Ledger Isolation**:
   All extracted entities, forensic metadata, repair artifacts, and execution metrics must be persisted exclusively to `run_evidence.db` via `db_utils.get_evidence_conn()`.
3. **Deadlock-Free Concurrent Transactions**:
   Write operations to `run_evidence.db` must be executed strictly within `db_utils.immediate_transaction()` blocks (`BEGIN IMMEDIATE;`), acquiring write locks upfront to eliminate lock escalation deadlocks (`sqlite3.OperationalError: database is locked`) under SQLite WAL mode.
4. **Streaming Batch Ingestion**:
   Messages must be consumed lazily in bounded streaming batches (default: 500 rows/batch) rather than loaded entirely into memory, ensuring constant $O(1)$ memory consumption and brief write lock durations.
5. **Absolute Idempotency ($f(f(x)) = f(x)$)**:
   Re-running the extraction script across the corpus must produce identical entity counts, 0 duplicates, and zero errors, enforced at the database level by unique composite constraints and `ON CONFLICT` clauses.
6. **Defect Remediation (Timestamp Repair & Omitted Document Capture)**:
   All 10,055 baseline messages currently have `timestamp_iso = NULL`. The pipeline must synthesize RFC-3339 / ISO-8601 timestamps on-the-fly. Furthermore, 161 messages containing `<documento omitido> <filename>` with `is_attachment = 0` must be parsed as `OMITTED_DOC` entities to feed Milestone M6 attachment provenance.

---

## 2. Ingestion Pipeline Architecture (`text_forensics_extractor.py`)

### 2.1 Component Interaction Flow

```
┌────────────────────────────────────────────────────────┐
│ whatsapp_forensics.db (Read-Only Baseline)             │
│ SHA-256: 030bc23bf4e96994ea7f24adb92ff0e26d03a7ede...   │
└──────────────────────────┬─────────────────────────────┘
                           │ db_utils.get_baseline_conn(immutable=True)
                           │ PRAGMA query_only=ON (?mode=ro)
                           ▼
┌────────────────────────────────────────────────────────┐
│ Streaming Query Cursor (fetchmany(batch_size=500))     │
│ 10,055 Messages LEFT JOIN conversations & contacts     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Batch Transformation Engine                            │
│  ├── ISO-8601 Timestamp Synthesizer (date + time)      │
│  ├── Multi-Category Regex Extractor                    │
│  │    ├── CLUB (Getxo Bela Eskola, Pakea, etc.)       │
│  │    ├── CIF (G95526299 checksum validator)           │
│  │    ├── IBAN (ES43 Kutxabank/BBK mod-97 validator)   │
│  │    ├── TARIFF / CUOTA (100€, 180€, 120€, 25€, etc.) │
│  │    ├── ACTOR / PERSON (Urko, Angharad, Ibai, etc.)  │
│  │    ├── ROLE (Director, Monitor, Entrenador, etc.)   │
│  │    ├── LICENSE (Federativa, seguro, escolar)        │
│  │    └── OMITTED_DOC (<documento omitido> filename)   │
│  └── Metadata Enrichment (JSON payload per entity)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Write Transaction (db_utils.immediate_transaction)     │
│  BEGIN IMMEDIATE;                                      │
│  INSERT INTO text_forensic_entities (...)              │
│  ON CONFLICT(message_id, entity_type, entity_value)    │
│  DO UPDATE SET ...;                                    │
│  COMMIT;                                               │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ run_evidence.db (Isolated Ledger)                      │
│ Table: text_forensic_entities                          │
│ Indexes: (entity_type, entity_value), (message_id)     │
└────────────────────────────────────────────────────────┘
```

### 2.2 Baseline Database Query Design

The baseline extraction query extracts complete textual and conversational context while preserving deterministic row ordering:

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    m.date,
    m.time,
    m.sender,
    m.content,
    m.line_num,
    m.is_attachment,
    m.attachment_type,
    c.display_name AS conv_name,
    k.contact_name,
    k.phone_number
FROM messages m
LEFT JOIN conversations c ON m.conv_id = c.conv_id
LEFT JOIN contacts k ON m.conv_id = k.conv_id
ORDER BY m.rowid ASC;
```

**Architectural Rationale**:
- `LEFT JOIN` on `conversations` and `contacts` prevents row dropping in case of orphaned references, ensuring all 10,055 messages are processed.
- `ORDER BY m.rowid ASC` guarantees consistent sequential iteration.
- Enriched columns (`conv_name`, `contact_name`, `phone_number`) are routed into `metadata_json` to enrich entity provenance.

### 2.3 Streaming Batch Architecture

```python
def stream_messages(base_conn: sqlite3.Connection, batch_size: int = 500):
    """Yields chunks of raw message dictionaries using SQLite cursor fetchmany."""
    cur = base_conn.cursor()
    cur.execute(SQL_BASELINE_MESSAGES)
    while True:
        rows = cur.fetchmany(batch_size)
        if not rows:
            break
        yield [dict(r) for r in rows]
```

**Concurrency & Memory Guarantees**:
- Memory profile remains flat (< 50 MB RAM) across arbitrary dataset sizes.
- Each write batch occupies an exclusive SQLite write lock for < 25 ms, preventing starvation of other concurrent readers/writers.

### 2.4 ISO-8601 Timestamp Synthesis Engine

Our empirical audit revealed:
- **10,013 messages** format `date` as `M/D/YY` or `MM/DD/YYYY` and `time` as `H:MM:SS AM/PM`.
- **42 messages** (prefixed `MSG_ODS_`) represent spreadsheet imports with `date = 'ODS_Preview'` and `time = ''`.

#### Specification for `synthesize_iso_timestamp(date_str, time_str, content=None)`:
```python
import re
from typing import Optional

DATE_RE = re.compile(r"^(\d{1,2})/(\d{1,2})/(\d{2,4})$")
TIME_RE = re.compile(r"^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$", re.IGNORECASE)
ODS_DATE_SNIPPET_RE = re.compile(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b")

def synthesize_iso_timestamp(
    date_str: Optional[str], 
    time_str: Optional[str], 
    content: Optional[str] = None
) -> Optional[str]:
    """
    Synthesizes standard ISO-8601 timestamps (YYYY-MM-DDTHH:MM:SS) from WhatsApp date/time strings.
    Handles 12-hour AM/PM shifts, 2-digit years (2020-2029), leap years, and ODS anomalies.
    """
    if not date_str:
        return None

    date_str = date_str.strip()
    time_str = (time_str or "").strip()

    # 1. Handle standard WhatsApp format: M/D/YY or M/D/YYYY
    d_match = DATE_RE.match(date_str)
    if d_match:
        m_val, d_val, y_val = map(int, d_match.groups())
        # Expand 2-digit year (WhatsApp export spans 2023-2026)
        if y_val < 100:
            year = 2000 + y_val
        else:
            year = y_val

        month = m_val
        day = d_val

        # Parse Time
        hour, minute, second = 0, 0, 0
        if time_str:
            t_match = TIME_RE.match(time_str)
            if t_match:
                h_val, min_val, sec_val, am_pm = t_match.groups()
                h = int(h_val)
                minute = int(min_val)
                second = int(sec_val)
                am_pm = am_pm.upper()

                if am_pm == "AM":
                    hour = 0 if h == 12 else h
                elif am_pm == "PM":
                    hour = 12 if h == 12 else h + 12

        try:
            return f"{year:04d}-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}:{second:02d}"
        except Exception:
            return None

    # 2. Handle ODS_Preview / anomalous rows by checking content for date snippets
    if date_str == "ODS_Preview" and content:
        ods_match = ODS_DATE_SNIPPET_RE.search(content)
        if ods_match:
            d_val, m_val, y_val = map(int, ods_match.groups())
            return f"{y_val:04d}-{m_val:02d}-{d_val:02d}T00:00:00"

    return None
```

### 2.5 Entity Extraction Taxonomy & Validation Rules

Each entity extractor yields a structured dictionary:
`{'entity_type': str, 'entity_value': str, 'context_text': str, 'confidence': float, 'metadata': dict}`

| Entity Type | Regex Pattern / Logic | Canonical Normalization | Validation / Checksum |
| :--- | :--- | :--- | :--- |
| **`CIF`** | `\b([ABCDEFGHJKLMNPQRSUVW])\s*[-]?\s*(\d{7})\s*[-]?\s*([0-9A-J])\b` | `G95526299` | Spanish Tax ID check (Pakea CIF: `G95526299`) |
| **`IBAN`** | `\b(ES\d{2})\s*(\d{4})\s*(\d{4})\s*(\d{2})\s*(\d{10})\b` or unspaced `\b(ES\d{22})\b` | `ES4320950000709109100619` | ISO 13616 Mod-97 checksum validation; Bank code 2095 = Kutxabank / BBK |
| **`CLUB`** | `(?i)\b(Getxo\s+Bela\s+Eskola\|GBE\|Pakea\|Asociaci[oó]n\s+Club\s+Deportivo\s+Vela\s+Pakea\s+Munduari\s+Itzulia)\b` | Canonical name (`Getxo Bela Eskola`, `Pakea`) | Contextual keyword match |
| **`TARIFF`** | `(?i)\b(\d+(?:[\.,]\d+)?)\s*(?:€\|euros?)\b` combined with `(cuota\|mensual\|j80\|laser\|bono\|tarifa\|curso)` | Normalized amount + currency (`100.00 EUR`, `180.00 EUR`) | Value range check; categorization into CUOTA, CURSO, BONO, METEO |
| **`ACTOR`** | `(?i)\b(Urko\s+Santillan(?:\s+Soriano)?\|Angharad(?:\s+Arambalza)?\|Ibai\s+Santillan)\b` | Canonical full name (`Urko Santillan`, `Angharad Arambalza`, `Ibai Santillan`) | Role attribution linked to sender and text |
| **`ROLE`** | `(?i)\b(Director\|Directora\|Presidenta?\|Monitor(?:a)?\|Entrenador(?:a)?\|Socio(?:a)?)\b` | Uppercase role (`DIRECTOR`, `MONITOR`, etc.) | Contextual filtering |
| **`LICENSE`** | `(?i)\b(licencia\s+federativa\|vela\s+escolar\|seguro\s+de\s+accidentes)\b` | `LICENCIA_FEDERATIVA` | Forensic compliance |
| **`OMITTED_DOC`** | `(?i)<documento\s+omitido>\s*([^\r\n<>]+\.(?:pdf\|docx\|xlsx\|ods\|txt\|jpg\|png))\b` | Filename (`recibo Alberto Valin j80 iniciación.pdf`) | Feeds Workstream 6 provenance reconciler |

### 2.6 Database Transaction & Idempotency Design

#### Schema-Level Idempotency Constraint
In `run_evidence.db`, table `text_forensic_entities` must enforce a unique composite constraint across `(message_id, entity_type, entity_value)`.

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_text_forensic_entities_unique 
ON text_forensic_entities(message_id, entity_type, entity_value);
```

#### Insertion Query
```sql
INSERT INTO text_forensic_entities (
    message_id,
    sender,
    timestamp_iso,
    entity_type,
    entity_value,
    context_text,
    context_snippet,
    confidence,
    metadata_json
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(message_id, entity_type, entity_value) DO UPDATE SET
    sender = excluded.sender,
    timestamp_iso = excluded.timestamp_iso,
    context_text = excluded.context_text,
    context_snippet = excluded.context_snippet,
    confidence = excluded.confidence,
    metadata_json = excluded.metadata_json;
```

#### Transactional Execution Block
```python
def write_entity_batch(evidence_conn: sqlite3.Connection, entity_records: list) -> int:
    """Inserts a batch of extracted entities under an immediate transaction."""
    if not entity_records:
        return 0
    with immediate_transaction(evidence_conn) as cur:
        cur.executemany(SQL_UPSERT_ENTITY, entity_records)
    return len(entity_records)
```

**Guarantees**:
- **Atomic Batches**: If a batch fails, the transaction is rolled back completely.
- **Zero Duplication**: Running the extractor twice results in zero net row additions.
- **Resumability**: If interrupted, the extractor resumes at any point without producing duplicates or leaving corrupt states.

---

## 3. Target Database Schema Specification (`text_forensic_entities`)

### 3.1 DDL Specification

```sql
CREATE TABLE IF NOT EXISTS text_forensic_entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    sender TEXT,
    timestamp_iso TEXT,
    entity_type TEXT NOT NULL CHECK(entity_type IN (
        'CLUB', 'CIF', 'IBAN', 'TARIFF', 'CUOTA', 
        'ACTOR', 'PERSON', 'ROLE', 'LICENSE', 
        'OMITTED_DOC', 'DOCUMENT'
    )),
    entity_value TEXT NOT NULL,
    context_text TEXT,
    context_snippet TEXT,
    confidence REAL DEFAULT 1.0,
    metadata_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Primary Unique Idempotency Index
CREATE UNIQUE INDEX IF NOT EXISTS idx_text_forensic_entities_unique 
ON text_forensic_entities(message_id, entity_type, entity_value);

-- Query Performance Composite Index
CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_type_val 
ON text_forensic_entities(entity_type, entity_value);

-- Foreign Key / Join Index on Message ID
CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_msg_id 
ON text_forensic_entities(message_id);

-- Temporal Analysis Index
CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_ts 
ON text_forensic_entities(timestamp_iso);
```

### 3.2 Schema Migration & Upgrade Protocol

Our audit confirmed that `text_forensic_entities` created during M0 is currently **empty (0 rows)**. However, the original M0 definition lacked `metadata_json` and `context_text`, and had a more restricted `CHECK` constraint.

The extractor must execute an automatic schema reconciliation routine at startup:
```python
def ensure_text_forensic_entities_schema(evidence_conn: sqlite3.Connection) -> None:
    """
    Ensures text_forensic_entities table matches the M2 specification.
    If table exists and is empty, recreates it with full constraints.
    If table contains data, applies non-destructive ALTER TABLE additions.
    """
    with immediate_transaction(evidence_conn) as cur:
        cur.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='text_forensic_entities';")
        table_exists = cur.fetchone()[0] > 0

        if table_exists:
            cur.execute("SELECT count(*) FROM text_forensic_entities;")
            row_count = cur.fetchone()[0]
            if row_count == 0:
                cur.execute("DROP TABLE text_forensic_entities;")
                table_exists = False

        if not table_exists:
            cur.execute(DDL_CREATE_TEXT_FORENSIC_ENTITIES)
        else:
            # Table has rows: inspect columns and apply ALTER TABLE
            cur.execute("PRAGMA table_info(text_forensic_entities);")
            cols = {r[1] for r in cur.fetchall()}
            if "context_text" not in cols:
                cur.execute("ALTER TABLE text_forensic_entities ADD COLUMN context_text TEXT;")
            if "metadata_json" not in cols:
                cur.execute("ALTER TABLE text_forensic_entities ADD COLUMN metadata_json TEXT;")

        # Ensure all indexes exist
        cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_text_forensic_entities_unique ON text_forensic_entities(message_id, entity_type, entity_value);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_type_val ON text_forensic_entities(entity_type, entity_value);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_msg_id ON text_forensic_entities(message_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_ts ON text_forensic_entities(timestamp_iso);")
```

---

## 4. Test Suite Specification (`test_m2_text_forensics.py`)

The test suite must be co-located under `forensics_multiagent_run\tests\` and follow standard `unittest` architecture.

### 4.1 Test Hierarchy

```
test_m2_text_forensics.py
├── TestTimestampSynthesis (Unit)
│   ├── test_standard_iso_synthesis()
│   ├── test_midnight_and_noon_transitions()
│   ├── test_two_digit_year_expansion()
│   ├── test_leap_year_handling()
│   └── test_anomalous_and_missing_inputs()
├── TestEntityRegexExtraction (Unit)
│   ├── test_cif_extraction_and_checksum()
│   ├── test_iban_extraction_and_mod97()
│   ├── test_club_entity_patterns()
│   ├── test_tariff_and_cuota_extraction()
│   ├── test_actor_and_role_patterns()
│   └── test_omitted_document_placeholder_extraction()
├── TestDatabaseIntegration (Integration)
│   ├── test_baseline_read_only_invariance()
│   ├── test_streaming_ingestion_population()
│   └── test_entity_distribution_and_confidence()
└── TestPipelineIdempotency (Integrity)
    ├── test_double_execution_zero_duplicates()
    └── test_concurrent_write_lock_resilience()
```

### 4.2 Concrete Test Suite Blueprint

```python
"""
test_m2_text_forensics.py - Test Suite for Milestone M2 Text Forensics
WhatsApp Digital Forensic Multi-Agent Operation
"""

import json
import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

TESTS_DIR = Path(__file__).parent.resolve()
TARGET_DIR = TESTS_DIR.parent
SCRIPTS_DIR = TARGET_DIR / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import db_utils
from text_forensics_extractor import (
    synthesize_iso_timestamp,
    extract_entities_from_text,
    validate_iban,
    validate_spanish_cif,
    run_text_forensics_pipeline,
    ensure_text_forensic_entities_schema
)


class TestTimestampSynthesis(unittest.TestCase):
    def test_standard_iso_synthesis(self):
        cases = [
            ("6/12/26", "3:23:21 PM", "2026-06-12T15:23:21"),
            ("7/2/26", "7:47:42 AM", "2026-07-02T07:47:42"),
            ("10/25/25", "11:59:59 PM", "2025-10-25T23:59:59"),
            ("1/1/24", "1:05:00 AM", "2024-01-01T01:05:00"),
        ]
        for d, t, expected in cases:
            res = synthesize_iso_timestamp(d, t)
            self.assertEqual(res, expected, f"Failed on {d} {t}")

    def test_midnight_and_noon_transitions(self):
        self.assertEqual(synthesize_iso_timestamp("6/12/26", "12:00:00 AM"), "2026-06-12T00:00:00")
        self.assertEqual(synthesize_iso_timestamp("6/12/26", "12:30:15 AM"), "2026-06-12T00:30:15")
        self.assertEqual(synthesize_iso_timestamp("6/12/26", "12:00:00 PM"), "2026-06-12T12:00:00")
        self.assertEqual(synthesize_iso_timestamp("6/12/26", "12:45:00 PM"), "2026-06-12T12:45:00")

    def test_leap_year_handling(self):
        self.assertEqual(synthesize_iso_timestamp("2/29/24", "10:00:00 AM"), "2024-02-29T10:00:00")

    def test_anomalous_and_missing_inputs(self):
        self.assertIsNone(synthesize_iso_timestamp(None, None))
        self.assertIsNone(synthesize_iso_timestamp("", ""))
        self.assertIsNone(synthesize_iso_timestamp("ODS_Preview", ""))
        # With content fallback
        self.assertEqual(
            synthesize_iso_timestamp("ODS_Preview", "", "Eskola | 24/5/2026 | Veleros"),
            "2026-05-24T00:00:00"
        )


class TestEntityRegexExtraction(unittest.TestCase):
    def test_cif_extraction(self):
        text = "Razón social: Asociación club deportivo vela Pakea munduari itzulia CIF: G95526299"
        entities = extract_entities_from_text(text, msg_id="MSG_01")
        cif_ents = [e for e in entities if e["entity_type"] == "CIF"]
        self.assertEqual(len(cif_ents), 1)
        self.assertEqual(cif_ents[0]["entity_value"], "G95526299")
        self.assertTrue(validate_spanish_cif("G95526299"))

    def test_iban_extraction(self):
        text_spaced = "Cuenta: ES43 2095 0000 7091 0910 0619 Kutxabank"
        text_unspaced = "ES4320950000709109100619"
        for t in [text_spaced, text_unspaced]:
            entities = extract_entities_from_text(t, msg_id="MSG_02")
            iban_ents = [e for e in entities if e["entity_type"] == "IBAN"]
            self.assertEqual(len(iban_ents), 1)
            self.assertEqual(iban_ents[0]["entity_value"], "ES4320950000709109100619")
            self.assertTrue(validate_iban(iban_ents[0]["entity_value"]))

    def test_club_patterns(self):
        text = "Bienvenidos a Getxo Bela Eskola y al Club Deportivo Vela Pakea"
        entities = extract_entities_from_text(text, msg_id="MSG_03")
        clubs = {e["entity_value"] for e in entities if e["entity_type"] == "CLUB"}
        self.assertIn("Getxo Bela Eskola", clubs)
        self.assertIn("Pakea", clubs)

    def test_tariff_extraction(self):
        text = "La cuota mensual de socio son 100€ al mes. Curso J80 por 180€ y bonos de 150 euros."
        entities = extract_entities_from_text(text, msg_id="MSG_04")
        tariffs = [e for e in entities if e["entity_type"] in ("TARIFF", "CUOTA")]
        self.assertTrue(len(tariffs) >= 3)
        vals = {t["entity_value"] for t in tariffs}
        self.assertTrue(any("100" in v for v in vals))
        self.assertTrue(any("180" in v for v in vals))
        self.assertTrue(any("150" in v for v in vals))

    def test_actors_and_roles(self):
        text = "Urko Santillan como Director y Angharad de Presidenta organizan el campamento."
        entities = extract_entities_from_text(text, msg_id="MSG_05")
        actors = {e["entity_value"] for e in entities if e["entity_type"] in ("ACTOR", "PERSON")}
        roles = {e["entity_value"] for e in entities if e["entity_type"] == "ROLE"}
        self.assertIn("Urko Santillan", actors)
        self.assertIn("Angharad", actors)
        self.assertIn("DIRECTOR", roles)
        self.assertIn("PRESIDENTA", roles)

    def test_omitted_document_placeholder(self):
        text = "<documento omitido> recibo Alberto Valin j80 iniciación.pdf"
        entities = extract_entities_from_text(text, msg_id="MSG_06")
        docs = [e for e in entities if e["entity_type"] in ("OMITTED_DOC", "DOCUMENT")]
        self.assertEqual(len(docs), 1)
        self.assertEqual(docs[0]["entity_value"], "recibo Alberto Valin j80 iniciación.pdf")


class TestPipelineIntegrationAndIdempotency(unittest.TestCase):
    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.test_ev_db = Path(self.tmp_dir.name) / "test_evidence.db"
        # Initialize schema in test db
        conn = sqlite3.connect(str(self.test_ev_db))
        ensure_text_forensic_entities_schema(conn)
        conn.close()

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_idempotency_zero_duplicates(self):
        """Assert that running extraction twice produces exactly identical row counts."""
        test_messages = [
            {"msg_id": "MSG_001", "sender": "Tú", "date": "6/12/26", "time": "3:23:21 PM", 
             "content": "Pakea CIF G95526299 cuenta ES4320950000709109100619 cuota 100€"},
            {"msg_id": "MSG_002", "sender": "Angharad", "date": "7/2/26", "time": "7:47:42 AM", 
             "content": "Getxo Bela Eskola director Urko Santillan <documento omitido> Estatutos.pdf"}
        ]

        conn = sqlite3.connect(str(self.test_ev_db))
        # First execution
        run_text_forensics_pipeline(conn, message_source=test_messages, batch_size=50)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM text_forensic_entities;")
        count_1 = cur.fetchone()[0]
        self.assertGreater(count_1, 0, "No entities were extracted on first run")

        # Second execution (exact duplicate data)
        run_text_forensics_pipeline(conn, message_source=test_messages, batch_size=50)
        cur.execute("SELECT count(*) FROM text_forensic_entities;")
        count_2 = cur.fetchone()[0]

        self.assertEqual(count_1, count_2, f"Idempotency violated! Initial: {count_1}, After re-run: {count_2}")
        conn.close()


if __name__ == "__main__":
    unittest.main()
```

---

## 5. Summary Report Design (`m2_text_forensics_report.json`)

The final summary report must be written to `forensics_multiagent_run\reports\m2_text_forensics_report.json`.

### 5.1 JSON Schema Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "M2TextForensicsReport",
  "type": "object",
  "required": [
    "milestone",
    "generated_at",
    "execution_duration_sec",
    "baseline_db",
    "evidence_db",
    "entity_summary",
    "timestamp_synthesis_metrics",
    "idempotency_verification"
  ],
  "properties": {
    "milestone": { "type": "string", "enum": ["M2"] },
    "generated_at": { "type": "string", "format": "date-time" },
    "execution_duration_sec": { "type": "number" },
    "baseline_db": {
      "type": "object",
      "required": ["path", "sha256", "total_messages_scanned", "bit_level_invariance"],
      "properties": {
        "path": { "type": "string" },
        "sha256": { "type": "string" },
        "total_messages_scanned": { "type": "integer" },
        "bit_level_invariance": { "type": "boolean" }
      }
    },
    "evidence_db": {
      "type": "object",
      "required": ["path", "total_entities_extracted", "unique_messages_with_entities"],
      "properties": {
        "path": { "type": "string" },
        "total_entities_extracted": { "type": "integer" },
        "unique_messages_with_entities": { "type": "integer" }
      }
    },
    "entity_summary": {
      "type": "object",
      "properties": {
        "CLUB": { "type": "object" },
        "CIF": { "type": "object" },
        "IBAN": { "type": "object" },
        "TARIFF": { "type": "object" },
        "ACTOR": { "type": "object" },
        "ROLE": { "type": "object" },
        "LICENSE": { "type": "object" },
        "OMITTED_DOC": { "type": "object" }
      }
    },
    "timestamp_synthesis_metrics": {
      "type": "object",
      "required": ["total_synthesized", "null_or_unparseable", "success_rate"],
      "properties": {
        "total_synthesized": { "type": "integer" },
        "null_or_unparseable": { "type": "integer" },
        "success_rate": { "type": "number" }
      }
    },
    "idempotency_verification": {
      "type": "object",
      "required": ["status", "initial_count", "re_run_count", "duplicate_delta"],
      "properties": {
        "status": { "type": "string" },
        "initial_count": { "type": "integer" },
        "re_run_count": { "type": "integer" },
        "duplicate_delta": { "type": "integer", "enum": [0] }
      }
    }
  }
}
```

### 5.2 Concrete Report Payload Example

```json
{
  "milestone": "M2",
  "generated_at": "2026-10-28T18:15:00Z",
  "execution_duration_sec": 3.84,
  "extractor_version": "1.0.0",
  "baseline_db": {
    "path": "c:\\Users\\User\\Desktop\\whatsapp_chats_zip\\WhatsApp_Analysis_Results\\whatsapp_forensics.db",
    "sha256": "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3",
    "total_messages_scanned": 10055,
    "standard_messages": 10013,
    "preview_ods_messages": 42,
    "bit_level_invariance": true
  },
  "evidence_db": {
    "path": "c:\\Users\\User\\Desktop\\whatsapp_chats_zip\\forensics_multiagent_run\\run_evidence.db",
    "table": "text_forensic_entities",
    "total_entities_extracted": 1420,
    "unique_messages_with_entities": 980
  },
  "entity_summary": {
    "CLUB": {
      "total_occurrences": 125,
      "unique_values": 4,
      "top_values": {
        "Getxo Bela Eskola": 102,
        "Pakea": 23
      }
    },
    "CIF": {
      "total_occurrences": 3,
      "unique_values": 1,
      "top_values": {
        "G95526299": 3
      }
    },
    "IBAN": {
      "total_occurrences": 8,
      "unique_values": 1,
      "top_values": {
        "ES4320950000709109100619": 8
      }
    },
    "TARIFF": {
      "total_occurrences": 210,
      "unique_values": 9,
      "breakdown": {
        "100.00 EUR (cuota)": 19,
        "180.00 EUR (j80)": 14,
        "120.00 EUR (laser)": 8,
        "150.00 EUR (bono)": 12,
        "25.00 EUR (meteo)": 5
      }
    },
    "ACTOR": {
      "total_occurrences": 380,
      "unique_values": 3,
      "top_values": {
        "Urko Santillan": 256,
        "Angharad Arambalza": 94,
        "Ibai Santillan": 12
      }
    },
    "ROLE": {
      "total_occurrences": 150,
      "unique_values": 5,
      "top_values": {
        "DIRECTOR": 45,
        "MONITOR": 52,
        "ENTRENADOR": 28,
        "PRESIDENTA": 15
      }
    },
    "OMITTED_DOC": {
      "total_occurrences": 161,
      "unique_values": 85,
      "top_extensions": {
        ".pdf": 140,
        ".docx": 12,
        ".xlsx": 9
      }
    }
  },
  "timestamp_synthesis_metrics": {
    "total_synthesized": 10013,
    "null_or_unparseable": 42,
    "success_rate": 0.9958,
    "date_bounds": {
      "earliest": "2023-01-15T09:12:00",
      "latest": "2026-10-27T18:45:12"
    }
  },
  "idempotency_verification": {
    "status": "VERIFIED_ZERO_DUPLICATES",
    "initial_count": 1420,
    "re_run_count": 1420,
    "duplicate_delta": 0
  }
}
```

---

## 6. Worker & Challenger Execution Directives

### For M2 Worker:
1. Implement `text_forensics_extractor.py` under `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\`.
2. Strictly consume connections via `db_utils.get_baseline_conn()` and `db_utils.get_evidence_conn()`.
3. Invoke `ensure_text_forensic_entities_schema(evidence_conn)` before reading any messages to guarantee required columns (`context_text`, `metadata_json`) and composite unique indexes exist.
4. Stream processing in batches of 500 messages, wrapping insertion in `immediate_transaction()`.
5. Execute pipeline and output report to `reports\m2_text_forensics_report.json`.

### For M2 Challenger:
1. Implement and run `test_m2_text_forensics.py` under `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\`.
2. Challenge baseline SHA-256 before and after the run to verify 0 bytes written to `whatsapp_forensics.db`.
3. Challenge idempotency: run `text_forensics_extractor.py` twice consecutively and assert `SELECT count(*) FROM text_forensic_entities` exhibits zero change.
4. Verify all 161 `<documento omitido>` placeholders are indexed as `OMITTED_DOC`.
5. Confirm CIF `G95526299` and IBAN `ES4320950000709109100619` are accurately extracted with 100% precision.
