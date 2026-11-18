# Comprehensive Forensic Survey Report: Baseline Database & Schema Architecture
**WhatsApp Digital Forensic Operation — Explorer 2 Report**  
*Date of Audit*: 2026-10-28  
*Target Database*: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`  
*Operating Mode*: STRICTLY READ-ONLY  
*Specialist*: Explorer 2 (Baseline Database & Schema Specialist)

---

## 1. Executive Summary & Baseline State

A rigorous, non-destructive, bit-level forensic survey was executed against the production baseline database `whatsapp_forensics.db` and its associated journal files. The database holds the consolidated forensic ingest of WhatsApp communications spanning the **Getxo Bela Eskola** sailing school and its associated club entity **Asociación Club Deportivo Vela Pakea Munduari Itzulia**.

### 1.1 Physical File Baseline & Cryptographic Integrity

| File Name | Absolute Path | Size (Bytes) | Size (Human) | Modification Timestamp | Cryptographic Checksum (SHA-256) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`whatsapp_forensics.db`** | `C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` | 11,886,592 | 11.33 MiB | 2026-10-28T20:39:42 | `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` |
| **`whatsapp_forensics.db-wal`** | `C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db-wal` | 0 | 0 bytes | 2026-10-28T21:08:10 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| **`whatsapp_forensics.db-shm`** | `C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db-shm` | 32,768 | 32.00 KiB | 2026-10-28T21:48:06 | `fd4c9fda9cd3f9ae7c962b0ddf37232294d55580e1aa165aa06129b8549389eb` |

### 1.2 SQLite Engine Pragma Verification (Read-Only Mode)

Verification was conducted via SQLite URI connection string `file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro`.

```sql
PRAGMA integrity_check;  --> [('ok',)]
PRAGMA journal_mode;     --> [('wal',)]
PRAGMA page_size;        --> [(4096,)]
PRAGMA page_count;       --> [(2902,)]   (2902 * 4096 = 11,886,592 bytes exact)
PRAGMA encoding;         --> [('UTF-8',)]
PRAGMA user_version;     --> [(0,)]
PRAGMA foreign_keys;     --> [(0,)]
PRAGMA auto_vacuum;      --> [(0,)]      (NONE)
```

**Forensic Finding on Journal State**:  
The WAL file is currently 0 bytes in size. In SQLite Write-Ahead Logging mode, a 0-byte WAL file confirms that all previous write transactions were fully committed and checkpointed (`TRUNCATE` checkpoint state) back into the primary B-Tree pages of the main database. No uncommitted journal transactions remain in memory or in WAL buffers. The main database is 100% self-consistent and can be read safely by parallel read-only worker processes with zero locking contention.

---

## 2. Database Schema Architecture

The database contains **9 tables**, **10 user-defined indexes**, **6 autoindexes** (primary key / unique constraints), **0 triggers**, and **0 views**.

```
                           ┌───────────────────┐
                           │   source_files    │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │   conversations   │◄──────────────┐
                           └─────────┬─────────┘               │
                                     │                         │
                 ┌───────────────────┼───────────────────┐     │
                 │ 1:N               │ 1:N               │ 1:1 │
                 ▼                   ▼                   ▼     │
          ┌─────────────┐     ┌─────────────┐     ┌────────────┴┐
          │  messages   │     │ attachments │     │  contacts   │
          └──────┬──────┘     └──────┬──────┘     └─────────────┘
                 │                   │
                 │     ┌───────┐     │
                 └───► │ M : N │ ◄───┘
                       │message│
                       │_attach│
                       │ ments │
                       └───────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌──────────────┐                       ┌───────────────┐
│extraction_job│                       │extraction_res │
└──────┬───────┘                       └───────────────┘
       │
       ▼
┌──────────────┐
│processing_err│
└──────────────┘
```

### 2.1 Table Census & Summary Statistics

| Table Name | Row Count | Primary Key | Foreign Keys | Purpose & Forensic Role |
| :--- | :--- | :--- | :--- | :--- |
| **`source_files`** | 3 | `source_id` | None | Provenance registry of root input directories and master ODS spreadsheet. |
| **`contacts`** | 392 | `contact_id` | `conv_id` -> `conversations` | Individual contacts and groups evaluated for membership status and category. |
| **`conversations`** | 392 | `conv_id` | None | Chat threads with message counts, date bounds, and keyword occurrence sums. |
| **`messages`** | **10,055** | `msg_id` | `conv_id` -> `conversations` | Individual verbatim WhatsApp messages with timestamps, sender, and content. |
| **`attachments`** | 15,068 | `attachment_id` | `source_conv_id`, `source_msg_id` | Physical media registry (images, voice notes, video, documents) keyed by SHA-256. |
| **`message_attachments`**| **0** | `id` (AUTO) | `msg_id`, `attachment_id`, `conv_id` | **Empty junction table**. Physical media have not yet been linked to message placeholders. |
| **`extraction_jobs`** | 15,067 | `job_id` (AUTO) | `attachment_id` -> `attachments` | Processing queue for OCR, audio transcription, document parsing. |
| **`extraction_results`**| 9 | `result_id` (AUTO)| `attachment_id` -> `attachments` | Cached extraction texts (test suite baseline entries). |
| **`processing_errors`** | 3 | `error_id` (AUTO) | `attachment_id`, `job_id` | Test error logs from synthetic corruption validation. |
| **`sqlite_sequence`** | 3 | None | None | SQLite internal sequence tracking (`extraction_jobs`: 15331, `extraction_results`: 11, `processing_errors`: 3). |

### 2.2 Complete DDL Specifications

#### 1. `source_files`
```sql
CREATE TABLE source_files (
    source_id TEXT PRIMARY KEY,
    source_category TEXT NOT NULL,
    file_name TEXT NOT NULL,
    relative_path TEXT NOT NULL,
    absolute_path TEXT,
    size_bytes INTEGER,
    format TEXT,
    sha256 TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `contacts`
```sql
CREATE TABLE contacts (
    contact_id TEXT PRIMARY KEY,
    conv_id TEXT,
    display_name TEXT NOT NULL,
    contact_name TEXT,
    phone_number TEXT,
    source TEXT,
    total_messages INTEGER DEFAULT 0,
    first_seen TEXT,
    last_seen TEXT,
    membership_status TEXT,
    membership_category TEXT,
    confidence_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conv_id) REFERENCES conversations(conv_id) ON DELETE SET NULL
);
```

#### 3. `conversations`
```sql
CREATE TABLE conversations (
    conv_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    source TEXT,
    chat_file TEXT,
    total_messages INTEGER DEFAULT 0,
    first_message TEXT,
    last_message TEXT,
    evidence_messages_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. `messages`
```sql
CREATE TABLE messages (
    msg_id TEXT PRIMARY KEY,
    conv_id TEXT NOT NULL,
    date TEXT,
    time TEXT,
    timestamp_iso TEXT,
    sender TEXT,
    content TEXT,
    line_num INTEGER,
    is_attachment INTEGER DEFAULT 0,
    attachment_type TEXT,
    evidence_score INTEGER DEFAULT 0,
    matched_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conv_id) REFERENCES conversations(conv_id) ON DELETE CASCADE
);
```

#### 5. `attachments`
```sql
CREATE TABLE attachments (
    attachment_id TEXT PRIMARY KEY,
    source_file TEXT,
    original_file_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    file_extension TEXT,
    detected_mime_type TEXT,
    attachment_type TEXT,
    duration REAL,
    width INTEGER,
    height INTEGER,
    extraction_status TEXT DEFAULT 'PENDING',
    ocr_text TEXT,
    audio_transcript TEXT,
    extracted_document_text TEXT,
    metadata_json TEXT,
    error_message TEXT,
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_processed_at TIMESTAMP,
    tool_versions TEXT,
    source_conversation_id TEXT,
    source_message_id TEXT,
    FOREIGN KEY (source_conversation_id) REFERENCES conversations(conv_id) ON DELETE SET NULL,
    FOREIGN KEY (source_message_id) REFERENCES messages(msg_id) ON DELETE SET NULL
);
```

#### 6. `message_attachments`
```sql
CREATE TABLE message_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    msg_id TEXT NOT NULL,
    attachment_id TEXT NOT NULL,
    conv_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (msg_id, attachment_id),
    FOREIGN KEY (msg_id) REFERENCES messages(msg_id) ON DELETE CASCADE,
    FOREIGN KEY (attachment_id) REFERENCES attachments(attachment_id) ON DELETE CASCADE,
    FOREIGN KEY (conv_id) REFERENCES conversations(conv_id) ON DELETE SET NULL
);
```

#### 7. `extraction_jobs`
```sql
CREATE TABLE extraction_jobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    attachment_id TEXT NOT NULL,
    task_type TEXT NOT NULL, -- 'ocr', 'transcription', 'document', 'video_metadata'
    status TEXT NOT NULL DEFAULT 'QUEUED', -- 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'
    worker_id TEXT,
    locked_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attachment_id) REFERENCES attachments(attachment_id) ON DELETE CASCADE
);
```

#### 8. `extraction_results`
```sql
CREATE TABLE extraction_results (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sha256 TEXT NOT NULL,
    attachment_id TEXT NOT NULL,
    result_type TEXT NOT NULL, -- 'ocr', 'transcription', 'document_text', 'video_frames'
    content TEXT,
    confidence REAL,
    language TEXT,
    metadata_json TEXT,
    tool_version TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attachment_id) REFERENCES attachments(attachment_id) ON DELETE CASCADE
);
```

#### 9. `processing_errors`
```sql
CREATE TABLE processing_errors (
    error_id INTEGER PRIMARY KEY AUTOINCREMENT,
    attachment_id TEXT,
    job_id INTEGER,
    worker_id TEXT,
    error_type TEXT,
    error_details TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attachment_id) REFERENCES attachments(attachment_id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES extraction_jobs(job_id) ON DELETE SET NULL
);
```

### 2.3 Index Inventory

| Index Name | Target Table | Indexed Columns | Type | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `idx_attachments_sha256` | `attachments` | `sha256` | Secondary B-Tree | Exact cryptographic deduplication lookups. |
| `idx_attachments_status` | `attachments` | `extraction_status` | Secondary B-Tree | Fast filtering by `PENDING`, `PROCESSING`, `COMPLETED`. |
| `idx_attachments_type` | `attachments` | `attachment_type` | Secondary B-Tree | Modality routing (image vs audio vs document vs video). |
| `idx_jobs_attachment` | `extraction_jobs` | `attachment_id` | Secondary B-Tree | Fast lookup of job by attachment ID. |
| `idx_jobs_status` | `extraction_jobs` | `status` | Secondary B-Tree | Worker job claiming queue scanning. |
| `idx_messages_conv` | `messages` | `conv_id` | Secondary B-Tree | Message retrieval per conversation. |
| `idx_messages_sender` | `messages` | `sender` | Secondary B-Tree | Aggregation and attribution by sender. |
| `idx_msg_att_att` | `message_attachments` | `attachment_id` | Secondary B-Tree | Many-to-many lookups from attachment to messages. |
| `idx_msg_att_msg` | `message_attachments` | `msg_id` | Secondary B-Tree | Many-to-many lookups from message to attachments. |
| `idx_results_sha256` | `extraction_results`| `sha256` | Secondary B-Tree | Deduplicated content extract cache lookup. |

---

## 3. Detailed Message Corpus & Forensic Text Analysis

### 3.1 Verification of Message Counts & Data Completeness

- **Exact Message Count**: **10,055 messages** (100% verified matching prompt target).
- **Sum of `conversations.total_messages`**: 10,055 messages (perfect reconciliation).
- **Sum of `conversations.evidence_messages_count`**: 698 messages.
- **Messages with `evidence_score > 0`**: 606 messages.

#### Column Nullability Audit across 10,055 Messages

| Column Name | Populated Rows | Null Rows | Percentage Complete | Format / Observations |
| :--- | :--- | :--- | :--- | :--- |
| `msg_id` | 10,055 | 0 | 100.0% | Formatted as `MSG_0000001` to `MSG_0010055`. |
| `conv_id` | 10,055 | 0 | 100.0% | Foreign key referencing `conversations.conv_id`. |
| `date` | 10,055 | 0 | 100.0% | Formatted as `M/D/YY` (e.g., `6/12/26`, `10/2/25`). |
| `time` | 10,055 | 0 | 100.0% | Formatted as `H:MM:SS AM/PM` (e.g., `3:23:21 PM`). |
| `timestamp_iso`| **0** | **10,055** | **0.0%** | **CRITICAL DEFECT**: Fully NULL in baseline database. Must be computed on-the-fly for Workstream 1. |
| `sender` | 10,055 | 0 | 100.0% | UTF-8 sender identity (`Tú`, contact name, or phone number). |
| `content` | 10,055 | 0 | 100.0% | Raw text content, message text, or placeholder tag. |
| `line_num` | 10,055 | 0 | 100.0% | Physical source line number in export text file. |
| `is_attachment` | 10,055 | 0 | 100.0% | Integer flag (`1` for 2,276 rows; `0` for 7,779 rows). |
| `attachment_type` | 10,055 | 0 | 100.0% | `'image'`, `'voice'`, `'video'`, or `''`. |
| `evidence_score` | 10,055 | 0 | 100.0% | Integer score (ranges from 0 to 80+). |
| `matched_keywords`| 10,055 | 0 | 100.0% | Semicolon-delimited keyword tags (e.g., `bela eskola; curso`). |

### 3.2 Sender Demographics & Core Participants

Classification of senders reveals the primary account custodian and communication patterns:

```
Sender Categories:
- "Tú" (Custodian: Urko Santillan): 2,469 messages (24.55%)
- Named Contacts (Identified individuals): 6,788 messages (67.51%)
- Raw Phone Numbers (+34 ... / international): 798 messages (7.94%)
Total: 10,055 messages
```

#### Top 20 Most Active Message Authors

| Rank | Sender Identity | Total Messages | Attachments Sent | Evidence Messages | Functional Forensic Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **`Tú`** (Urko Santillan) | 2,469 | 789 | 240 | School Director / Head Coach / Account Custodian |
| 2 | **`Alex Txiruka`** | 663 | 116 | 38 | Senior Sailor / Boat Equipment & 420 Maintenance |
| 3 | **`Angharad`** (Angharad Arambalza) | 475 | 173 | 33 | School Administrator / Booking & Financial Operations |
| 4 | **`Ana Belén Sorkari`** | 456 | 148 | 12 | Socio / Community Project Participant (*El aMAR nos cuida*) |
| 5 | **`Eneko Equipo 420`** | 308 | 24 | 19 | Sailing Coach / 420 Regatta Team Instructor |
| 6 | **`Rafa Argentino Pakea`** | 295 | 16 | 12 | Pakea Sailing Coach / Instructor |
| 7 | `+34 685 35 34 62` | 274 | 233 | 3 | High-volume media sender / Spoofer group contact |
| 8 | **`Ander Alumno Vela Moto Agua`** | 215 | 16 | 4 | Student / Course Participant |
| 9 | `Bego el Viaje De Pío Sorkari` | 213 | 95 | 1 | Community project participant |
| 10 | `Paco Spoofer` | 175 | 6 | 23 | Active sailing contact |
| 11 | **`Ljubisa (Lluvisa)... Nuevo Socio Gbe`**| 172 | 44 | 1 | Confirmed New Member (*Nuevo Socio GBE*) |
| 12 | `Lucia Viaje Spoofer` | 167 | 39 | 6 | Active participant |
| 13 | **`Gonzalo Aragón Equipo 420 Monitor`** | 148 | 3 | 2 | Official 420 Team Monitor |
| 14 | **`Carlos Pro Del Láser Azul Majo Info`**| 143 | 27 | 6 | Laser ILCA sailor / Sailing federation liaison |
| 15 | **`Asier Monitor 420`** | 141 | 31 | 6 | Official 420 Monitor & Summer Camp (*Uretan Blai*) Coordinator |
| 16 | `Imiau Escocia` | 140 | 54 | 6 | Forensic Audit Advisor (author of audit spec MSG_0004508) |
| 17 | **`Xabi Equipo Pakea`** | 131 | 5 | 1 | Pakea Regatta Team Member |
| 18 | `Ignacio Spoofer` | 129 | 27 | 19 | Active sailor |
| 19 | `Ana Paralle Rastas Spoofer` | 127 | 20 | 10 | Active sailor |
| 20 | `+34 680 32 80 83` | 120 | 38 | 0 | External contact |

---

## 4. Attachment Infrastructure & The Reconciliation Gap

### 4.1 Physical Media Inventory (`attachments` Table)

The `attachments` table indexes **15,068 physical files** discovered across source directories:
- **14,378 files** from `com.whatsapp` (Mobile backup media repository, January 2023 – October 2026).
- **690 files** from WhatsApp Web export directories (`Descomprimidos`).

#### Modality Breakdown in `attachments`
- **Images**: 14,327 items (JPEG, JPG, PNG).
- **Voice / Audio Notes**: 397 items (OPUS format).
- **Video Recordings**: 291 items (MP4 format).
- **Documents**: 14 items (PDF, DOCX, ODS, Kicad).
- **Binary / Other**: 39 items.

### 4.2 Chat Message Attachment Indicators

Within the `messages` table, exactly **2,276 messages** have `is_attachment = 1`:
- `image`: 1,201 messages
- `voice`: 882 messages
- `video`: 193 messages

#### Textual Placeholder Patterns in Messages
1. `<mensaje de voz omitido>` (875 instances)
2. `<imagen omitida>` (858 instances)
3. `<video omitido>` (143 instances)
4. `[Reenviado] <imagen omitida>` (89 instances)
5. `[Reenviado] <video omitido>` (21 instances)
6. Captioned images (e.g. `<imagen omitida> 🛠️⛵ ¡KONPONDU en Getxo Bela Eskola! ...`)

### 4.3 The Critical Reconciliation Discovery (Workstream 6 Focus)

1. **Junction Table Emptiness**: `message_attachments` currently contains **0 rows**.
2. **Foreign Key Nullability**: In `attachments`, both `source_conversation_id` and `source_message_id` are **NULL for all 15,068 rows**.
3. **The Document Anomaly**:  
   WhatsApp Web exports represent sent/received documents as:
   `MSG_0001546`: `<documento omitido> Opciones de navegación Getxo Bela Eskola.pdf`  
   `MSG_0001547`: `<documento omitido> Lo que ofrece Getxo Bela Eskola.pdf`  
   `MSG_0000244`: `<documento omitido> recibo Alberto Valin j80 iniciación.pdf`  
   `MSG_0000245`: `[Reenviado] <documento omitido> Justificante_transferencia_2026-10-26-20.07.06.174000.pdf`  
   **Anomaly**: The baseline parser assigned `is_attachment = 0` to these document messages! They must be extracted via regex pattern matching (`<documento omitido> (.*)`) in Workstream 1 and matched to physical PDF/DOCX files in Workstream 6.

---

## 5. Substantive Forensic Findings: Entities, Roles, Dues, and Club Structure

Linguistic and semantic analysis across all 10,055 messages and 392 contacts uncovered foundational evidentiary facts establishing the identity, legal structure, financial flows, and membership hierarchy of the organization.

### 5.1 Corporate & Legal Club Entity Profile

From verbatim message text (notably `MSG_0001208`, `MSG_0000202`, and `MSG_0000301`):

- **Operating Commercial Identity**: **Getxo Bela Eskola** (GBE)
- **Official Registered Corporate Name**: **Asociación Club Deportivo Vela Pakea Munduari Itzulia** (also referenced in banking headers as `ASOC. CLUB DEPORTIVO VELA PAKEA MUNDUARI ITZULIA GETXO`)
- **Fiscal Identification Number (CIF)**: **`G95526299`**
- **Headquarters Address**: Puerto Deportivo de Getxo, Pabellón Vela, S/N, C.P. 48992 Getxo, Vizcaya
- **Landline Telephone**: 94 491 66 32
- **Mobile & WhatsApp Line**: 634 405 624 (634 40 56 24)
- **Primary Operational Email**: `info@getxobelaeskola.com`
- **Official Club Bank Account (IBAN)**:  
  **`ES43 2095 0000 7091 0910 0619`**  
  *Bank*: Kutxabank / BBK (Entity Code 2095, Office 0000)

### 5.2 Forensic Personnel & Role Identification

1. **Executive Leadership & Operations**:
   - **Urko Santillan Soriano** (`Tú` / `urkosantillan@hotmail.es`): School Director and Head of Sailing Operations. Verbatim statement in `MSG_0002112`: *"Yo soy Urko, llevo la escuela de vela Getxo Bela Eskola, situada en Getxo, junto a Bilbao (Bizkaia)"*.
   - **Angharad Arambalza Bernaola** (`Angharad`): Managing Director / Financial Administrator. Manages client enrollment forms, payment verification, invoicing, and purchase contracts (`MSG_0001322`, `MSG_0000247`).

2. **Instructional Staff & Coaches (Monitores / Begiraleak)**:
   - **Asier** (`Asier Monitor 420`): 420 Class Monitor and coordinator for the *Uretan Blai* summer camp (`CONV_WEB_0085`, `CONV_WEB_0331`).
   - **Gonzalo Aragón** (`Gonzalo Aragón Equipo 420 Monitor`): Competitive 420 regatta coach (`CONV_WEB_0337`).
   - **Eneko** (`Eneko Equipo 420`): Head Coach for 420 competition fleet (`CONV_WEB_0337`, `MSG_0000242`).
   - **Ibon Basañez** (`Ibon Basañez GBE`): J80 Skipper and adult cruiser coach (`CONV_WEB_0175`, `MSG_0001287`).
   - **Rafa** (`Rafa Argentino Pakea`): Pakea Regatta Team coach (`CONV_WEB_0337`).
   - **Gorka** (`Gorka Meteorólogo Navegante Madrid`): Specialized marine meteorology instructor (`CONV_WEB_0159`).

3. **External Strategic Advisor**:
   - **`Imiau Escocia`** (`CONV_WEB_0181`): Originator of this digital forensic audit. Message `MSG_0004508` (2026-10-27 22:58:37) instructs Urko to assemble all WhatsApp chats, audio notes, images, and documents into a structured database with probability scores and justifications determining member vs. non-member status.

### 5.3 Financial Structure: Dues (Cuotas), Fees & Bonos

Verbatim payment records identify the fee schedule:

1. **Monthly Membership Dues (*Cuotas de Socio*)**:
   - Standard monthly membership fee: **100,00 €**.
   - Verified in `MSG_0005521` & `MSG_0005522` by Luciano Jose Natali (`Lutxo Socio GBE`):
     - Transfer of 100,00 € to `*0619` on 07/08/2026: *"LUCIANO NATALI (CUOTA 5 EN 2026)"*
     - Transfer of 100,00 € to `*0619` on 08/09/2026: *"LUCIANO NATALI (CUOTA 6 EN 2026)"*
2. **J80 Initiation Course**:
   - **180,00 €** per person for 12 hours (3 sessions of 4 hours).
   - Confirmed in course promo message `MSG_0002107` and receipts in `CONV_WEB_0052`.
3. **Láser ILCA Initiation Course**:
   - **120,00 €** per person for 8 hours (2 sessions of 4 hours).
   - Confirmed in `MSG_0002106` and `MSG_0004553`.
4. **Meteorology for Sailors Course**:
   - **25,00 €** per day. Confirmed in `MSG_0000211` and `MSG_0001951`.
5. **Boat Maintenance & Repair Course (*KONPONDU*)**:
   - Practical training on fiber, gelcoat, and epoxy repair (`MSG_0002108`).
6. **Laser Outing Vouchers (*Bonos de Navegación*)**:
   - **150,00 €** transfer confirmed by Pablo (`Pablo Bono Laser Gbe`, `MSG_0005698`) for 4 navigation sessions.

### 5.4 Licensing & Federative Alignments

- Sailing licenses are issued through the Basque Sailing Federation (*Federación Vasca de Vela / Euskal Bela Federazioa*) and the Spanish Sailing Federation (*RFEV*).
- In `MSG_0007077`, Teresa (`Teresa Pareja Que Trae 470 Gbe`) asserts: *"No quiero agobiarle, pero es por hacer la licencia de la federación cuanto antes, no sea q la liemos jaja"*.
- In `MSG_0001737`, official training ties are referenced with INEMAR (Federació de Vela de la Comunitat Valenciana).

### 5.5 Member Classifications in Baseline Corpus

In `contacts`:
- **Member / Socio / Directiva / Fleet Owner**: **26 contacts** (Highest probability stakeholders).
- **Course Participant / Regatta Sailor / Volunteer**: **64 contacts**.
- **Occasional Client / Sailing Inquirer / Parent**: **77 contacts**.
- **General Contact / Unknown Relationship**: **225 contacts**.
- Total: **392 contacts** (all currently flagged as `NEEDS_REVIEW` pending this multi-agent audit).

---

## 6. Query Blueprints for Downstream Workstreams

To guarantee zero modifications to `whatsapp_forensics.db` while enabling high-throughput analysis, the following query blueprints are provided for **Workstream 1 (Text Forensics)** and **Workstream 6 (Attachment Provenance Reconciliation)**.

### 6.1 Workstream 1: Text Forensics & Lexical Indexing Blueprints

#### Blueprint 1.1: ISO 8601 Timestamp Reconstructor (Read-Only)
Because `timestamp_iso` is NULL across all 10,055 records, downstream indexers must synthesize the ISO timestamp using the existing `date` (`M/D/YY`) and `time` (`H:MM:SS AM/PM`) columns.

```sql
-- Read-Only SQLite Expression for Synthesizing Standard ISO Timestamps
SELECT 
    msg_id,
    conv_id,
    sender,
    date,
    time,
    -- Construct YYYY-MM-DDTHH:MM:SS
    printf('20%02d-%02d-%02dT%02d:%02d:%02d',
        CAST(substr(date, instr(substr(date, instr(date, '/') + 1), '/') + instr(date, '/') + 1) AS INTEGER),
        CAST(substr(date, 1, instr(date, '/') - 1) AS INTEGER),
        CAST(substr(substr(date, instr(date, '/') + 1), 1, instr(substr(date, instr(date, '/') + 1), '/') - 1) AS INTEGER),
        CASE 
            WHEN time LIKE '%PM' AND CAST(substr(time, 1, instr(time, ':') - 1) AS INTEGER) < 12 
                THEN CAST(substr(time, 1, instr(time, ':') - 1) AS INTEGER) + 12
            WHEN time LIKE '%AM' AND CAST(substr(time, 1, instr(time, ':') - 1) AS INTEGER) = 12 
                THEN 0
            ELSE CAST(substr(time, 1, instr(time, ':') - 1) AS INTEGER)
        END,
        CAST(substr(time, instr(time, ':') + 1, 2) AS INTEGER),
        CAST(substr(time, instr(time, ':') + 4, 2) AS INTEGER)
    ) AS synthesized_iso_timestamp,
    content,
    is_attachment,
    attachment_type
FROM messages;
```

#### Blueprint 1.2: High-Precision Domain Keyword Scanner
Extracts messages with high evidential weight for club dues, licensing, and membership assertions.

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    c.display_name AS conversation_title,
    m.date,
    m.time,
    m.sender,
    m.content,
    m.evidence_score,
    m.matched_keywords
FROM messages m
JOIN conversations c ON m.conv_id = c.conv_id
WHERE 
    m.content LIKE '%socio%' 
    OR m.content LIKE '%socia%' 
    OR m.content LIKE '%cuota%' 
    OR m.content LIKE '%abono%' 
    OR m.content LIKE '%pakea%' 
    OR m.content LIKE '%bela eskola%' 
    OR m.content LIKE '%licencia%' 
    OR m.content LIKE '%federac%' 
    OR m.content LIKE '%transferencia%' 
    OR m.content LIKE '%j80%' 
    OR m.content LIKE '%laser%' 
    OR m.content LIKE '%ilca%' 
    OR m.content LIKE '%420%'
ORDER BY m.msg_id ASC;
```

#### Blueprint 1.3: Document Placeholder Extractor
Identifies document references that were stored with `is_attachment = 0`.

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    c.display_name,
    m.date,
    m.time,
    m.sender,
    m.content,
    -- Extract document filename following the placeholder tag
    TRIM(REPLACE(REPLACE(m.content, '[Reenviado]', ''), '<documento omitido>', '')) AS target_filename
FROM messages m
JOIN conversations c ON m.conv_id = c.conv_id
WHERE m.content LIKE '%<documento omitido>%'
ORDER BY m.msg_id ASC;
```

---

### 6.2 Workstream 6: Attachment Provenance Reconciliation Blueprints

Workstream 6 reconciles the **2,276 message placeholders** against the **15,068 physical media files** in `attachments` without writing to `whatsapp_forensics.db`. All candidate linkages will be stored in the isolated run ledger (`run_evidence.db`).

#### Blueprint 6.1: Message Placeholder Manifest Query
Extracts all placeholder anchor points from the baseline database.

```sql
SELECT 
    m.msg_id,
    m.conv_id,
    c.display_name AS conversation_name,
    c.source AS conversation_source,
    m.date AS msg_date,
    m.time AS msg_time,
    m.sender,
    m.attachment_type,
    m.content AS raw_placeholder,
    CASE 
        WHEN m.content LIKE '%<documento omitido>%' THEN 'document'
        WHEN m.attachment_type != '' THEN m.attachment_type
        ELSE 'unknown'
    END AS normalized_media_category
FROM messages m
JOIN conversations c ON m.conv_id = c.conv_id
WHERE m.is_attachment = 1 OR m.content LIKE '%<documento omitido>%'
ORDER BY m.msg_id ASC;
```

#### Blueprint 6.2: Physical Media Candidate Search Query
Matches candidate physical attachments based on conversation directory names, media categories, and timestamps.

```sql
SELECT 
    a.attachment_id,
    a.sha256,
    a.original_filename,
    a.original_file_path,
    a.file_size_bytes,
    a.file_extension,
    a.detected_mime_type,
    a.attachment_type,
    a.source_file
FROM attachments a
WHERE 
    -- Match by filename substring or directory path
    a.original_file_path LIKE '%' || :search_pattern || '%'
    OR a.original_filename LIKE '%' || :search_pattern || '%'
ORDER BY a.file_size_bytes DESC;
```

#### Blueprint 6.3: Proposed Reconciliation Classification Schema for `run_evidence.db`

The candidate linkage ledger in `run_evidence.db` must follow this schema:

```sql
CREATE TABLE IF NOT EXISTS run_evidence.reconciliation_links (
    link_id INTEGER PRIMARY KEY AUTOINCREMENT,
    msg_id TEXT NOT NULL,
    conv_id TEXT NOT NULL,
    attachment_id TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    match_category TEXT NOT NULL CHECK (match_category IN ('CONFIRMED', 'PROBABLE', 'UNRESOLVED', 'CONTRADICTED')),
    confidence_score REAL NOT NULL,
    reconciliation_rationale TEXT NOT NULL,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluator_worker TEXT NOT NULL,
    UNIQUE (msg_id, attachment_id)
);

CREATE INDEX IF NOT EXISTS run_evidence.idx_recon_msg ON reconciliation_links(msg_id);
CREATE INDEX IF NOT EXISTS run_evidence.idx_recon_att ON reconciliation_links(attachment_id);
CREATE INDEX IF NOT EXISTS run_evidence.idx_recon_cat ON reconciliation_links(match_category);
```

**Reconciliation Classification Criteria**:
1. **`CONFIRMED`** (Confidence >= 0.95):
   - The physical file was found inside the exact decompressed folder corresponding to `conv_id` AND the media type and file timestamp match the message timestamp within +/- 120 seconds.
   - Or an exact filename match for documents (e.g. `Opciones de navegación Getxo Bela Eskola.pdf`).
2. **`PROBABLE`** (Confidence 0.70 – 0.94):
   - Physical file found in `com.whatsapp` with a timestamp date matching `messages.date` AND sender is `Tú` (outgoing mobile media).
3. **`UNRESOLVED`** (Confidence < 0.70):
   - Multiple candidate files share identical timestamps or dimensions, or no matching file exists in local storage.
4. **`CONTRADICTED`**:
   - Media type in chat (`voice`) contradicts physical file format (e.g., `video/mp4`), or message date precedes physical file creation by months.

---

## 7. Baseline Synthesis & Downstream Directives

1. **Production Immutability**: `whatsapp_forensics.db` must remain strictly mounted with SQLite URI parameter `?mode=ro`. No write PRAGMAs, no checkpoint alterations, and no DML operations should ever be targeted at this database.
2. **Timestamp Handling**: Downstream extractors must not rely on `messages.timestamp_iso` (which is NULL). They must use the synthesized ISO timestamp formula defined in Blueprint 1.1.
3. **Dual Document Processing**: Workstream 1 and Workstream 6 must account for the fact that documents were flagged with `is_attachment = 0` in `messages`.
4. **Isolated Output Store**: All forensic ledger outputs, candidate links, transcripts, and OCR results will be written to `forensics_multiagent_run\run_evidence.db`.
