# Comprehensive Exploration Report: Schema & Query Architecture for Milestone M2
**WhatsApp Digital Forensic Operation — Milestone M2: Text Forensics & Lexical Indexer**  
*Auditor*: Explorer 1 (Schema & Query Specialist)  
*Target Database*: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`  
*Operating Mode*: STRICTLY READ-ONLY (`?mode=ro`, `PRAGMA query_only = ON`)  
*Execution Date*: 2026-10-28  

---

## 1. Executive Summary & Core Forensic Insights

Milestone M2 demands high-throughput, bit-level read-only extraction and forensic lexical indexing of all 10,055 messages stored in `whatsapp_forensics.db`. This investigation audited the schema architecture, timestamp variations, contact linkages, and entity footprints to deliver production-ready extraction queries and Python normalization modules for the downstream M2 Worker.

### Key Discoveries
1. **Timestamp Structural Split**: The `messages` table contains **10,013 standard WhatsApp messages** (`MSG_0000001` through `MSG_0010013`) and **42 non-standard ODS preview records** (`MSG_ODS_0001` through `MSG_ODS_0042`).
   - Standard rows strictly follow US date order `M/D/YY` (Month/Day/Year) and 12-hour time format `H:MM:SS AM/PM`.
   - The 42 ODS preview rows contain `date = 'ODS_Preview'` and `time = ''`.
2. **Critical Flaw in Survey Explorer 2 Blueprint**: Survey Explorer 2 proposed an unguarded SQLite `printf` formula that converts `date = 'ODS_Preview'` into the invalid timestamp `'2000-00-00T00:00:00'`. This report provides both a hardened pure-SQL formula with `CASE` guards (returning `NULL` for non-standard rows) and a Python parser validated across all 10,055 rows with 0 errors.
3. **Month vs. Day Proof**: Across all 10,013 standard records, Part 1 of `date` is strictly bounded `1 <= Month <= 12` (0 records exceed 12), while Part 2 exceeds 12 in **7,261 records** (up to 31). This conclusively proves US `M/D/YY` ordering across the entire corpus.
4. **Schema Nomenclature Clarification**:
   - The "chats" table is formally named **`conversations`** (PK `conv_id`).
   - The `messages` table links to chats via **`messages.conv_id`** (there is no `chat_id` or `sender_id` column; sender identity is stored in `messages.sender`).
   - The `contacts` table (392 rows) exists in an exact 1:1 relationship with `conversations` via `contacts.conv_id`.
5. **Sender Demographics (307 Senders)**:
   - **Custodian (`Tú`)**: 2,469 messages (24.55%) sent by Urko Santillan Soriano.
   - **Matched Contacts**: 6,287 messages (62.53%) matching `contacts.display_name` in direct 1-on-1 chats.
   - **Unlinked Group Members**: 674 messages (6.70%) from named participants in 31 group chats.
   - **Raw International Phone Numbers**: 583 messages (5.80%) from unsaved group participants.
   - **ODS Previews**: 42 messages (0.42%) from spreadsheet previews.
6. **Document Placeholder Anomaly**: Exactly **161 messages** contain `<documento omitido>`, representing PDFs, receipts, and spreadsheets where `is_attachment = 0`. These must be regex-parsed in M2 to feed the M6 Attachment Provenance Reconciler.

---

## 2. Investigation Task 1: Message Date & Time Audit (10,055 Rows)

A comprehensive census was executed on `whatsapp_forensics.db.messages` under strict read-only lock (`file:...whatsapp_forensics.db?mode=ro`, `PRAGMA query_only = ON`).

### 2.1 Census & Column Integrity

| Metric | Measured Value | Forensic Assessment |
| :--- | :--- | :--- |
| **Total Rows in `messages`** | 10,055 | 100% census match |
| **Populated `date` values** | 10,055 | 0 NULLs (10,013 valid dates + 42 `'ODS_Preview'`) |
| **Populated `time` values** | 10,055 | 0 NULLs (10,013 valid times + 42 `''` empty strings) |
| **Populated `timestamp_iso`** | **0** | **100% NULL in baseline DB**; must be synthesized |
| **Standard WhatsApp Messages** | 10,013 | `MSG_0000001` to `MSG_0010013` |
| **Non-Standard ODS Messages** | 42 | `MSG_ODS_0001` to `MSG_ODS_0042` |

### 2.2 Date Pattern Analysis & Component Bounds

For all 10,013 standard records:

```
Date Patterns Distribution:
- M/DD/YY  : 5,763 rows (57.31%)  e.g., 6/12/26, 7/15/26
- MM/DD/YY : 2,246 rows (22.34%)  e.g., 10/14/26, 12/25/25
- M/D/YY   : 1,047 rows (10.41%)  e.g., 5/9/26, 7/2/26
- MM/D/YY  :   957 rows  (9.52%)  e.g., 10/2/25, 11/5/26
- Non-Match:    42 rows  (0.42%)  'ODS_Preview'
```

#### The Month vs. Day Empirical Proof:
- **Part 1 Range**: Minimum = `1`, Maximum = `12`. Rows with `Part 1 > 12`: **0 rows**.
- **Part 2 Range**: Minimum = `1`, Maximum = `31`. Rows with `Part 2 > 12`: **7,261 rows**.
- **Conclusion**: Part 1 is conclusively the **Month**, Part 2 is the **Day**, and Part 3 is the 2-digit **Year**.

#### Year Component Distribution:
All standard dates contain 2-digit years mapping to the 2020s:
- `'23'` (2023): 28 messages
- `'24'` (2024): 27 messages
- `'25'` (2025): 21 messages
- `'26'` (2026): 9,937 messages
- Total: 10,013 messages

### 2.3 Time Pattern Analysis & 12-Hour Mechanics

```
Time Patterns Distribution:
- H:MM:SS PM  : 4,889 rows (48.62%)  e.g., 3:23:21 PM
- H:MM:SS AM  : 2,747 rows (27.32%)  e.g., 7:47:42 AM
- HH:MM:SS PM : 1,594 rows (15.85%)  e.g., 10:56:05 PM
- HH:MM:SS AM :   783 rows  (7.79%)  e.g., 11:45:00 AM
- Non-Match   :    42 rows  (0.42%)  '' (empty string)
```

- **AM/PM Total**: `PM` = 6,483 rows; `AM` = 3,530 rows.
- **Hour Range**: Strictly 1 to 12. No 24-hour hour values (>12) exist in the standard corpus.
- **Minute & Second Range**: 0 to 59.
- **Midnight & Noon Handling**:
  - `12:... AM` (Midnight hour, converts to `00:...`): **683 messages**.
  - `12:... PM` (Noon hour, converts to `12:...`): **55 messages**.
- **Encoding of Separator Space**: Hex verification confirms ASCII `0x20` space between seconds and AM/PM.

### 2.4 The 42 ODS Preview Records & Blueprint Flaw

Rows `MSG_ODS_0001` through `MSG_ODS_0042` were imported from the summary sheets of the WhatsApp Web exports:
- `date`: literal `'ODS_Preview'`
- `time`: literal `''`
- `sender`: `'Preview'`
- `content`: Pipe-delimited preview lines (e.g. `Eskola | 24/5/2026 | Veleros de radiocontrol ...`)

**Flaw in Survey Explorer 2 Blueprint**:
Survey Explorer 2 Blueprint 1.1 provided:
```sql
printf('20%02d-%02d-%02dT%02d:%02d:%02d',
    CAST(substr(date, instr(substr(date, instr(date, '/') + 1), '/') + instr(date, '/') + 1) AS INTEGER),
    CAST(substr(date, 1, instr(date, '/') - 1) AS INTEGER),
    ...
```
When executed against `date = 'ODS_Preview'` and `time = ''`, `instr()` returns 0 and SQLite evaluates `CAST(substr(...) AS INTEGER)` to 0, producing `'2000-00-00T00:00:00'`. This corrupts temporal ordering and FTS indexing. The revised SQL and Python solutions documented below eliminate this defect.

---

## 3. Investigation Task 2: Python ISO-8601 Parser & Unit Test Suite

### 3.1 Production Implementation

The following function is optimized for zero external dependencies, robust edge-case tolerance, unicode normalization (`\u202f` narrow non-breaking space and `\xa0` non-breaking space), calendar validation (including leap years), and graceful `None` rejection:

```python
"""
whatsapp_timestamp_parser.py
Forensic ISO-8601 Timestamp Normalization Module
"""
import re
from datetime import datetime, date, time

DATE_REGEX = re.compile(r"^\s*(\d{1,2})/(\d{1,2})/(\d{2,4})\s*$")
TIME_REGEX = re.compile(r"^\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM|am|pm)?\s*$")

def parse_whatsapp_datetime(date_str: str | None, time_str: str | None) -> str | None:
    """
    Forensically parses WhatsApp date and time strings into standardized ISO-8601 strings (YYYY-MM-DDTHH:MM:SS).
    
    Handles:
    - US date format: M/D/YY, MM/DD/YY, M/D/YYYY, MM/DD/YYYY
    - 12-hour AM/PM: H:MM:SS AM/PM, HH:MM:SS AM/PM, with optional seconds
    - 24-hour fallback: HH:MM:SS, H:MM
    - Calendar validation: rejects invalid days per month (e.g. 4/31/26) and non-leap years (2/29/23)
    - Midnight (12 AM -> 00) and Noon (12 PM -> 12)
    - Unicode whitespace: \u202f (narrow no-break space), \xa0 (no-break space)
    - Edge cases: 'ODS_Preview', empty strings, nulls -> returns None
    """
    if not date_str or not time_str:
        return None
    
    # Normalize unicode whitespace
    d_clean = date_str.replace('\u202f', ' ').replace('\xa0', ' ').strip()
    t_clean = time_str.replace('\u202f', ' ').replace('\xa0', ' ').strip()
    
    m_date = DATE_REGEX.match(d_clean)
    if not m_date:
        return None
    m_time = TIME_REGEX.match(t_clean)
    if not m_time:
        return None
        
    p_month, p_day, p_year = m_date.groups()
    month, day, year = int(p_month), int(p_day), int(p_year)
    if year < 100:
        year += 2000
        
    # Validates calendar bounds and leap years automatically
    try:
        d_obj = date(year, month, day)
    except ValueError:
        return None
        
    p_hour, p_min, p_sec, p_ampm = m_time.groups()
    hour = int(p_hour)
    minute = int(p_min)
    second = int(p_sec) if p_sec is not None else 0
    
    if p_ampm:
        ampm = p_ampm.upper()
        if ampm == 'AM':
            if hour == 12:
                hour = 0
            elif hour > 12 or hour < 1:
                return None
        elif ampm == 'PM':
            if hour < 12 and hour >= 1:
                hour += 12
            elif hour != 12:
                return None
    else:
        if hour < 0 or hour > 23:
            return None
            
    try:
        t_obj = time(hour, minute, second)
    except ValueError:
        return None
        
    return datetime.combine(d_obj, t_obj).isoformat()
```

### 3.2 Unit Test Suite & Edge-Case Coverage

The test suite executed with a **100% pass rate (9/9 suites, 0 failures, 0.001s)**:

```python
import unittest

class TestWhatsAppTimestampParser(unittest.TestCase):
    def test_standard_formats(self):
        self.assertEqual(parse_whatsapp_datetime("6/12/26", "3:23:21 PM"), "2026-06-12T15:23:21")
        self.assertEqual(parse_whatsapp_datetime("10/2/25", "11:45:00 AM"), "2025-10-02T11:45:00")
        self.assertEqual(parse_whatsapp_datetime("01/05/2026", "08:00:00 AM"), "2026-01-05T08:00:00")

    def test_single_digits(self):
        self.assertEqual(parse_whatsapp_datetime("1/2/26", "3:4:5 PM"), "2026-01-02T15:04:05")
        self.assertEqual(parse_whatsapp_datetime("9/9/24", "1:2:3 AM"), "2024-09-09T01:02:03")

    def test_midnight_and_noon(self):
        self.assertEqual(parse_whatsapp_datetime("7/4/26", "12:00:00 AM"), "2026-07-04T00:00:00")
        self.assertEqual(parse_whatsapp_datetime("7/4/26", "12:30:15 AM"), "2026-07-04T00:30:15")
        self.assertEqual(parse_whatsapp_datetime("7/4/26", "12:00:00 PM"), "2026-07-04T12:00:00")
        self.assertEqual(parse_whatsapp_datetime("7/4/26", "12:45:50 PM"), "2026-07-04T12:45:50")
        self.assertEqual(parse_whatsapp_datetime("7/4/26", "11:59:59 PM"), "2026-07-04T23:59:59")

    def test_leap_years(self):
        self.assertEqual(parse_whatsapp_datetime("2/29/24", "10:00:00 AM"), "2024-02-29T10:00:00")
        self.assertIsNone(parse_whatsapp_datetime("2/29/23", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("2/29/26", "10:00:00 AM"))
        self.assertEqual(parse_whatsapp_datetime("2/29/00", "12:00:00 PM"), "2000-02-29T12:00:00")

    def test_calendar_boundaries(self):
        self.assertIsNone(parse_whatsapp_datetime("13/10/26", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("0/10/26", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("5/0/26", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("1/32/26", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("4/31/26", "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("6/31/26", "10:00:00 AM"))

    def test_time_boundaries(self):
        self.assertIsNone(parse_whatsapp_datetime("5/10/26", "13:00:00 PM"))
        self.assertIsNone(parse_whatsapp_datetime("5/10/26", "0:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("5/10/26", "10:60:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("5/10/26", "10:00:60 AM"))

    def test_24h_and_optional_seconds(self):
        self.assertEqual(parse_whatsapp_datetime("5/10/26", "15:30:45"), "2026-05-10T15:30:45")
        self.assertEqual(parse_whatsapp_datetime("5/10/26", "00:15:00"), "2026-05-10T00:15:00")
        self.assertEqual(parse_whatsapp_datetime("5/10/26", "3:30 PM"), "2026-05-10T15:30:00")
        self.assertEqual(parse_whatsapp_datetime("5/10/26", "9:45 AM"), "2026-05-10T09:45:00")

    def test_unicode_and_whitespace(self):
        self.assertEqual(parse_whatsapp_datetime("6/12/26", "3:23:21\u202fPM"), "2026-06-12T15:23:21")
        self.assertEqual(parse_whatsapp_datetime("6/12/26", "3:23:21\xa0AM"), "2026-06-12T03:23:21")
        self.assertEqual(parse_whatsapp_datetime("  6/12/26  ", "  3:23:21 PM  "), "2026-06-12T15:23:21")

    def test_nulls_and_special_markers(self):
        self.assertIsNone(parse_whatsapp_datetime("ODS_Preview", ""))
        self.assertIsNone(parse_whatsapp_datetime(None, None))
        self.assertIsNone(parse_whatsapp_datetime("6/12/26", None))
        self.assertIsNone(parse_whatsapp_datetime(None, "10:00:00 AM"))
        self.assertIsNone(parse_whatsapp_datetime("", ""))
```

### 3.3 Full Database Benchmark Results

When evaluated across all **10,055 rows** of the production database:
- **Successfully parsed**: **10,013 messages** (100.00% of standard messages).
- **Gracefully skipped**: **42 messages** (`date = 'ODS_Preview'`).
- **Unexpected errors / unhandled cases**: **0**.
- **Elapsed time**: < 0.05 seconds.

---

## 4. Investigation Task 3: Schema Linkages & Sender Demographics

### 4.1 Schema Relationship Topology

The production database implements a normalized structure with specific naming conventions:

```
┌─────────────────────────────────┐
│          conversations          │  (Chats Table)
│  conv_id (PK: CONV_WEB_0001...) │
│  display_name                   │
│  source                         │
│  total_messages                 │
└────────────────┬────────────────┘
                 │
       ┌─────────┴─────────┐
       │ 1:1               │ 1:N
       ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│     contacts     │  │     messages     │
│  contact_id (PK) │  │  msg_id (PK)     │
│  conv_id (FK)    │  │  conv_id (FK)    │
│  display_name    │  │  sender (TEXT)   │
│  contact_name    │  │  content (TEXT)  │
│  phone_number    │  │  date / time     │
└──────────────────┘  └──────────────────┘
```

1. **Messages to Conversations (`messages.conv_id` -> `conversations.conv_id`)**:
   - Cardinality: **1 : N**
   - Integrity: 10,055 out of 10,055 messages have an exact matching `conversations.conv_id` (0 orphans).
2. **Contacts to Conversations (`contacts.conv_id` -> `conversations.conv_id`)**:
   - Cardinality: **1 : 1**
   - Integrity: All 392 contacts map to exactly one unique `conversations.conv_id` (392 distinct `conv_id` values).
   - `conversations` has 350 `CONV_WEB_` and 42 `CONV_ODS_` rows. All 392 have an associated contact entry.

### 4.2 Contact Table Demographic Census (392 Contacts)

- **`display_name`**: Populated in **392 / 392 (100.0%)** rows.
- **`contact_name`**: Populated in **353 / 392 (90.05%)** rows. In all 353 rows, `contact_name == display_name`.
- **`phone_number`**: Populated in **39 / 392 (9.95%)** rows. In all 39 rows, `phone_number == display_name` (e.g. `+34 602 25 99 76`, `+1 (805) 296-1004`), representing unsaved individual contacts where the phone number is the chat title.

### 4.3 Classification of Senders (307 Distinct Entities)

An empirical classification of all 10,055 message authors reveals 5 operational categories:

| Category | Sender Count | Message Count | Percentage | Description & Linkage Method |
| :--- | :--- | :--- | :--- | :--- |
| **`CUSTODIAN_TU`** | 1 | 2,469 | 24.55% | Account owner **Urko Santillan Soriano** (`Tú`). |
| **`MATCHED_CONTACT`** | 212 | 6,287 | 62.53% | Direct 1-on-1 contact where `m.sender = c.display_name`. |
| **`UNLINKED_GROUP_MEMBER`**| 40 | 674 | 6.70% | Saved contact names appearing in group chats (e.g., `'Alain Equpo Pakea'`). |
| **`RAW_PHONE_NUMBER`** | 53 | 583 | 5.80% | Unsaved group participants with international phone numbers (`+34...`). |
| **`PREVIEW_ODS`** | 1 | 42 | 0.42% | Summary rows from ODS spreadsheet imports (`Preview`). |
| **Total** | **307** | **10,055** | **100.00%** | Perfect reconciliation across entire corpus |

### 4.4 Group Chats vs. Direct Chats

An analysis of distinct senders per conversation identified:
- **184 conversations**: 1 sender (either incoming-only or outgoing-only, or ODS previews).
- **158 conversations**: 2 senders (`Tú` + single contact: standard 1-on-1 dialogue).
- **50 conversations**: >= 3 senders (multi-party group chats).
- **Top 5 High-Activity Groups**:
  1. `CONV_WEB_0324` (*TDK norte d*): 251 msgs, 20 distinct senders
  2. `CONV_WEB_0318` (*Slackline Uribe Kosta*): 312 msgs, 17 distinct senders
  3. `CONV_WEB_0161` (*Getxo bela eskola meteorología*): 53 msgs, 16 distinct senders
  4. `CONV_WEB_0337` (*Vela con Angharad*): 1,290 msgs, 15 distinct senders
  5. `CONV_WEB_0143` (*EL Amar nos cuida*): 1,012 msgs, 12 distinct senders

---

## 5. Investigation Task 4: Validated SQL Extraction Queries

The following queries have been executed and verified directly against `whatsapp_forensics.db` under `?mode=ro`.

### 5.1 Query 1: Hardened Pure-SQLite ISO Timestamp Synthesis

This query synthesizes ISO-8601 timestamps directly within SQLite in 0.03s across all 10,055 rows while safely returning `NULL` for `ODS_Preview` rows:

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    conv.display_name AS chat_name,
    m.sender,
    m.content,
    m.date,
    m.time,
    CASE 
        WHEN m.date IS NULL OR m.time IS NULL OR m.date NOT LIKE '%/%/%' OR (m.time NOT LIKE '%AM' AND m.time NOT LIKE '%PM')
        THEN NULL
        ELSE printf('20%02d-%02d-%02dT%02d:%02d:%02d',
            -- Year: substring after 2nd slash
            CAST(substr(m.date, instr(substr(m.date, instr(m.date, '/') + 1), '/') + instr(m.date, '/') + 1) AS INTEGER),
            -- Month: substring before 1st slash
            CAST(substr(m.date, 1, instr(m.date, '/') - 1) AS INTEGER),
            -- Day: substring between 1st and 2nd slash
            CAST(substr(substr(m.date, instr(m.date, '/') + 1), 1, instr(substr(m.date, instr(m.date, '/') + 1), '/') - 1) AS INTEGER),
            -- Hour: 12h AM/PM conversion
            CASE 
                WHEN m.time LIKE '%PM' AND CAST(substr(m.time, 1, instr(m.time, ':') - 1) AS INTEGER) < 12 
                    THEN CAST(substr(m.time, 1, instr(m.time, ':') - 1) AS INTEGER) + 12
                WHEN m.time LIKE '%AM' AND CAST(substr(m.time, 1, instr(m.time, ':') - 1) AS INTEGER) = 12 
                    THEN 0
                ELSE CAST(substr(m.time, 1, instr(m.time, ':') - 1) AS INTEGER)
            END,
            -- Minute: substring between 1st colon and 2nd colon
            CAST(substr(m.time, instr(m.time, ':') + 1, instr(substr(m.time, instr(m.time, ':') + 1), ':') - 1) AS INTEGER),
            -- Second: substring after 2nd colon up to space before AM/PM
            CAST(substr(m.time, instr(m.time, ':') + instr(substr(m.time, instr(m.time, ':') + 1), ':') + 1, 2) AS INTEGER)
        )
    END AS synthesized_iso_timestamp,
    m.is_attachment,
    m.attachment_type,
    m.evidence_score
FROM messages m
JOIN conversations conv ON m.conv_id = conv.conv_id
ORDER BY m.msg_id ASC;
```

### 5.2 Query 2: Multi-Tier Sender Contact Identity Resolution

This query links sender identity across custodian, direct conversation contacts, and group participant lookups:

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    conv.display_name AS chat_name,
    m.sender AS raw_sender,
    CASE 
        WHEN m.sender = 'Tú' THEN 'Urko Santillan Soriano (Custodian)'
        WHEN c_sender.display_name IS NOT NULL THEN c_sender.display_name
        WHEN c_conv.display_name = m.sender THEN c_conv.display_name
        ELSE m.sender
    END AS resolved_sender_name,
    CASE
        WHEN m.sender = 'Tú' THEN '634405624'
        WHEN c_sender.phone_number != '' THEN c_sender.phone_number
        WHEN m.sender LIKE '+%' THEN m.sender
        ELSE NULL
    END AS resolved_phone_number,
    c_sender.contact_id AS resolved_contact_id,
    m.content,
    m.evidence_score
FROM messages m
JOIN conversations conv ON m.conv_id = conv.conv_id
LEFT JOIN contacts c_conv ON conv.conv_id = c_conv.conv_id
LEFT JOIN contacts c_sender ON (
    m.sender = c_sender.display_name 
    OR m.sender = c_sender.phone_number 
    OR m.sender = c_sender.contact_name
)
ORDER BY m.msg_id ASC;
```

### 5.3 Query 3: High-Yield Forensic Entity Scanner

Filters messages matching legal identifiers, financial records, club assertions, dues, and licenses:

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    conv.display_name AS chat_name,
    m.date,
    m.time,
    m.sender,
    m.content,
    m.evidence_score,
    m.matched_keywords
FROM messages m
JOIN conversations conv ON m.conv_id = conv.conv_id
WHERE 
    m.content LIKE '%G95526299%'
    OR m.content LIKE '%ES43%'
    OR m.content LIKE '%2095%0619%'
    OR m.content LIKE '%cuota%'
    OR m.content LIKE '%socio%'
    OR m.content LIKE '%socia%'
    OR m.content LIKE '%pakea%'
    OR m.content LIKE '%getxo bela eskola%'
    OR m.content LIKE '%licencia%'
    OR m.content LIKE '%federac%'
    OR m.content LIKE '%j80%'
    OR m.content LIKE '%ilca%'
    OR m.content LIKE '%420%'
ORDER BY m.msg_id ASC;
```

### 5.4 Query 4: Document Placeholder Extraction Query

Isolates all 161 document attachment references stored with `is_attachment = 0`:

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    conv.display_name AS chat_name,
    m.date,
    m.time,
    m.sender,
    m.content,
    TRIM(REPLACE(REPLACE(m.content, '[Reenviado]', ''), '<documento omitido>', '')) AS target_document_name
FROM messages m
JOIN conversations conv ON m.conv_id = conv.conv_id
WHERE m.content LIKE '%<documento omitido>%'
ORDER BY m.msg_id ASC;
```

---

## 6. Investigation Task 5: Recommendations & M2 Worker Blueprints

### 6.1 Database Target Mapping

The M2 Worker must write exclusively to `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`.

#### Target 1: `text_forensic_entities`
```sql
INSERT INTO text_forensic_entities (
    message_id,
    sender,
    timestamp_iso,
    entity_type,
    entity_value,
    context_snippet,
    confidence
) VALUES (?, ?, ?, ?, ?, ?, ?);
```
Allowed `entity_type` values (enforced by `CHECK` constraint):
`'CLUB'`, `'PERSON'`, `'CIF'`, `'IBAN'`, `'CUOTA'`, `'TARIFF'`, `'ROLE'`, `'LICENSE'`.

#### Target 2: `cross_modal_index` (FTS5)
```sql
INSERT INTO cross_modal_index (
    content_id,
    modality,
    source_ref,
    sender_or_creator,
    timestamp_iso,
    indexed_text
) VALUES (?, 'CHAT_TXT', ?, ?, ?, ?);
```

### 6.2 Forensic Regex Pattern Library for Entity Extraction

```python
ENTITY_PATTERNS = {
    "CIF": [
        (re.compile(r"\b(G95526299)\b", re.IGNORECASE), "CIF", 1.0, "Corporate CIF: Asociación Club Deportivo Vela Pakea"),
        (re.compile(r"\b([A-HJ-NP-SUVW]\d{7}[0-9A-J])\b"), "CIF", 0.90, "General CIF"),
    ],
    "IBAN": [
        (re.compile(r"\b(ES43\s*2095\s*0000\s*7091\s*0910\s*0619)\b", re.IGNORECASE), "IBAN", 1.0, "Official Club Kutxabank Account"),
        (re.compile(r"\b(ES\d{2}\s*(?:\d{4}\s*){4}\d{4})\b", re.IGNORECASE), "IBAN", 0.95, "Spanish IBAN"),
        (re.compile(r"\b(\*0619)\b"), "IBAN", 0.85, "Truncated Club Account Reference"),
    ],
    "CLUB": [
        (re.compile(r"\b(Asociaci[oó]n\s+Club\s+Deportivo\s+Vela\s+Pakea(?:\s+Munduari\s+Itzulia)?)\b", re.IGNORECASE), "CLUB", 1.0, "Legal Entity Name"),
        (re.compile(r"\b(Getxo\s+Bela\s+Eskola)\b", re.IGNORECASE), "CLUB", 1.0, "Operating Sailing School Identity"),
        (re.compile(r"\b(GBE)\b"), "CLUB", 0.90, "Acronym Getxo Bela Eskola"),
        (re.compile(r"\b(Pakea)\b", re.IGNORECASE), "CLUB", 0.85, "Club Brand Pakea"),
    ],
    "CUOTA": [
        (re.compile(r"(?i)\b(?:cuota(?:\s+de)?\s+socio|cuota\s+\d+)\b[^\.\n]*?(\d+[\.,]\d{2}\s*€|\d+\s*€)"), "CUOTA", 0.95, "Monthly Membership Fee"),
        (re.compile(r"(?i)\b(cuota\s+\d+\s+en\s+202[3-6])\b"), "CUOTA", 0.95, "Annual Installment Reference"),
        (re.compile(r"(?i)\b(100\s*€|100,00\s*€)\b"), "CUOTA", 0.80, "Standard 100€ Club Fee Match"),
    ],
    "TARIFF": [
        (re.compile(r"(?i)\b(180\s*€|180,00\s*€)\b"), "TARIFF", 0.90, "J80 Initiation Course Fee (12h)"),
        (re.compile(r"(?i)\b(120\s*€|120,00\s*€)\b"), "TARIFF", 0.90, "Láser ILCA Initiation Course Fee (8h)"),
        (re.compile(r"(?i)\b(150\s*€|150,00\s*€)\b"), "TARIFF", 0.85, "Bono Láser (4 sessions)"),
        (re.compile(r"(?i)\b(25\s*€|25,00\s*€)\b"), "TARIFF", 0.80, "Meteorology Course Single Session"),
    ],
    "ROLE": [
        (re.compile(r"(?i)\b(director(?:a)?|responsable\s+de\s+escuela)\b"), "ROLE", 0.90, "Director Role"),
        (re.compile(r"(?i)\b(begirale(?:a)?|monitor(?:a)?|entrenador(?:a)?)\b"), "ROLE", 0.90, "Instructor / Coach Role"),
        (re.compile(r"(?i)\b(socio(?:\s+nuevo|\s+antiguo|\s+fundador)?|socia)\b"), "ROLE", 0.85, "Club Member Assertion"),
        (re.compile(r"(?i)\b(patr[oó]n|armador|proel)\b"), "ROLE", 0.80, "Sailing Crew Position"),
    ],
    "LICENSE": [
        (re.compile(r"(?i)\b(licencia\s+federativa|federaci[oó]n\s+vasca\s+de\s+vela|euskal\s+bela\s+federazioa|rfev)\b"), "LICENSE", 0.95, "Official Sailing License"),
    ]
}
```

### 6.3 Complete M2 Worker Script Blueprint (`text_forensics.py`)

The M2 Worker script should be deployed to `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\text_forensics.py`. A structured execution flow is provided below:

```python
"""
M2 Production Script Blueprint: text_forensics.py
"""
import sqlite3
import re
import sys
from datetime import datetime, date, time

PROD_DB = r"file:C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db?mode=ro"
RUN_DB = r"C:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

DATE_REGEX = re.compile(r"^\s*(\d{1,2})/(\d{1,2})/(\d{2,4})\s*$")
TIME_REGEX = re.compile(r"^\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM|am|pm)?\s*$")

def parse_whatsapp_datetime(date_str, time_str):
    if not date_str or not time_str:
        return None
    d_clean = date_str.replace('\u202f', ' ').replace('\xa0', ' ').strip()
    t_clean = time_str.replace('\u202f', ' ').replace('\xa0', ' ').strip()
    m_date = DATE_REGEX.match(d_clean)
    m_time = TIME_REGEX.match(t_clean)
    if not m_date or not m_time:
        return None
    p_month, p_day, p_year = m_date.groups()
    month, day, year = int(p_month), int(p_day), int(p_year)
    if year < 100:
        year += 2000
    try:
        d_obj = date(year, month, day)
    except ValueError:
        return None
    p_hour, p_min, p_sec, p_ampm = m_time.groups()
    hour = int(p_hour)
    minute = int(p_min)
    second = int(p_sec) if p_sec is not None else 0
    if p_ampm:
        ampm = p_ampm.upper()
        if ampm == 'AM':
            hour = 0 if hour == 12 else hour
        elif ampm == 'PM':
            hour = hour if hour == 12 else hour + 12
    try:
        t_obj = time(hour, minute, second)
    except ValueError:
        return None
    return datetime.combine(d_obj, t_obj).isoformat()

def run_m2_text_forensics():
    # 1. Connect to production read-only DB
    conn_ro = sqlite3.connect(PROD_DB, uri=True)
    conn_ro.execute("PRAGMA query_only = ON;")
    
    # 2. Connect to execution ledger
    conn_rw = sqlite3.connect(RUN_DB)
    conn_rw.execute("PRAGMA journal_mode = WAL;")
    conn_rw.execute("PRAGMA synchronous = NORMAL;")
    
    cur_ro = conn_ro.cursor()
    cur_rw = conn_rw.cursor()
    
    # 3. Read messages with conversation metadata
    query = """
    SELECT 
        m.msg_id,
        m.conv_id,
        c.display_name AS chat_name,
        m.sender,
        m.date,
        m.time,
        m.content
    FROM messages m
    JOIN conversations c ON m.conv_id = c.conv_id
    ORDER BY m.msg_id ASC;
    """
    cur_ro.execute(query)
    messages = cur_ro.fetchall()
    
    entities_batch = []
    fts_batch = []
    
    for msg_id, conv_id, chat_name, sender, d_str, t_str, content in messages:
        if not content:
            content = ""
            
        iso_ts = parse_whatsapp_datetime(d_str, t_str)
        
        # Cross-Modal FTS index entry
        fts_batch.append((msg_id, conv_id, sender, iso_ts, content))
        
        # Entity extraction scanning...
        # (Apply regex library and append to entities_batch)
        
    # 4. Batch insert into run_evidence.db
    cur_rw.executemany("""
    INSERT INTO cross_modal_index (
        content_id, modality, source_ref, sender_or_creator, timestamp_iso, indexed_text
    ) VALUES (?, 'CHAT_TXT', ?, ?, ?, ?);
    """, fts_batch)
    
    conn_rw.commit()
    conn_rw.close()
    conn_ro.close()
    print("M2 Text Forensics complete.")

if __name__ == '__main__':
    run_m2_text_forensics()
```

---

## 7. Downstream Directives for Milestone M2 Workers

1. **Strict Production Read-Only Lock**: Ensure `?mode=ro` and `PRAGMA query_only = ON;` are active on every database handle connected to `whatsapp_forensics.db`.
2. **Handling the 42 ODS Rows**: The 42 ODS rows (`MSG_ODS_0001` to `MSG_ODS_0042`) must be indexed into `cross_modal_index` with `timestamp_iso = NULL`. Do not allow unguarded string splitting to generate corrupt timestamps like `'2000-00-00T00:00:00'`.
3. **Capture Document Placeholders**: The 161 messages matching `<documento omitido>` must have their filenames isolated. These filename tokens are essential cross-modal anchors for Milestone M6 (Attachment Provenance Reconciliation).
4. **Target Table Integrity**: Check constraints on `text_forensic_entities.entity_type` reject any value other than `'CLUB'`, `'PERSON'`, `'CIF'`, `'IBAN'`, `'CUOTA'`, `'TARIFF'`, `'ROLE'`, `'LICENSE'`. Ensure every extracted entity maps strictly to these 8 enumerated types.
5. **High Throughput Batching**: Execute inserts into `run_evidence.db` in transactions (`conn.commit()`) in batches of 1,000 rows to ensure sub-minute pipeline execution.
