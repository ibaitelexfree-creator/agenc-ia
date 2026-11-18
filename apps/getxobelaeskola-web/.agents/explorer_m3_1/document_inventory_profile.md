# Milestone M3: Document Inventory & Format Profiling Report

**Document Explorer**: Explorer M3.1 (Document Inventory & Format Profiler)  
**Destination**: Orchestrator (Conversation ID: `910eb5c1-f883-4815-90d4-372a9142612a`) & Worker M3  
**Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1`  
**Execution Timestamp**: 2026-10-28T20:20:00Z  
**Database Audited**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`  

---

## Executive Summary

An exhaustive, non-destructive investigation was conducted across the digital forensic evidence ledger `run_evidence.db` (table `file_inventory`) and the physical storage corpus at `c:\Users\User\Desktop\whatsapp_chats_zip`. 

Key findings include:
1. **Document Census & Scope Reconciliation**:
   - `file_inventory` registers exactly **39 rows** where `modality = 'DOCUMENT'`, totaling **19,717,885 bytes** (~18.80 MB). 100% of these files physically exist on disk.
   - The figure of "~763 document files" cited in `PROJECT.md` stems from the initial survey (`explorer_survey_1`), which aggregated all text-bearing media across the corpus: 359 `.txt` chat files + 362 `.md` reports + 39 formal documents + 3 other items = 763 files. In Milestone M1, `inventory_scanner.py` formally partitioned chat logs into `modality = 'CHAT_TXT'` (356 WhatsApp chats + 2 foreign skipped) and markdown into `modality = 'OTHER'` (362 files). The active document pipeline scope in `file_inventory` consists of the **39 primary documents** (or 395 files if `CHAT_TXT` is included).
2. **Two Extensionless PDFs Solved**:
   - `DOC-20251120-WA0006` (file_id 16726, 391,423 bytes): Magic bytes `%PDF-1.4`. Produced by `Skia/PDF m100`. Contains **3 pages**. PyMuPDF direct text extraction returns only 13 characters (`'1/3\n2/3\n3/3\n'`) because each page is a rasterized image screenshot. Running `RapidOCR` over rendered 150-DPI page pixmaps successfully recovered **212 lines of financial data**, uncovering a critical **CaixaBank bank statement** of Ibai Santillan Soriano (IBAN `ES0421001550210200693255`, unemployment benefit deposits of 844.02€, and debit transactions).
   - `DOC-20260116-WA0000` (file_id 16727, 59,221 bytes): Magic bytes `%PDF-1.4`. Contains **3 pages** and **3,638 characters** of 100% native, searchable text. It is a **Trip.com Flight Itinerary** for Ibai Santillan (Booking No. 1658109188198756, IndiGo flight 6E1051, Porto -> Mumbai -> Bangkok).
3. **Abnormal & Legacy Formats Audit**:
   - **0-byte documents**: Exactly **0** files in `modality = 'DOCUMENT'` (and 0 in `CHAT_TXT`).
   - **Password-protected PDFs**: Exactly **0** files. Five PDFs contain standard RC4 encryption metadata dictionaries, but none require an open password (`doc.needs_pass == False`).
   - **Legacy Office binary formats (`.doc`, `.xls`, `.ppt`)**: Exactly **0** files across the entire corpus. Zero OLE CFBF binary headers found.
   - **Corrupted Zip Archives**: Exactly **0** corrupted archives among `.docx`, `.xlsx`, or `.ods`. All OpenXML and OpenDocument archives possess valid `PK\x03\x04` headers and parse cleanly with `python-docx`, `openpyxl`, and `odfpy`.
   - **Plain Text Encoding**: Exactly 356 of 356 `CHAT_TXT` files are valid UTF-8. 1 CSV has UTF-8 BOM (`\xef\xbb\xbf`), and all 17 CSVs decode cleanly under `utf-8-sig`.

---

## 1. Document Inventory Census & Distribution

### 1.1 Census Breakdown by Extension (Modality = 'DOCUMENT')

| Extension | Detected Type | Count | Total Size (Bytes) | Min Size | Max Size | Median Size | 0-Byte | Status in DB |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `.csv` | Tabular CSV | **17** | 15,681,048 | 672 B | 4,619,645 B | 83,443 B | 0 | 17 PENDING |
| `.vcf` | Contact Card | **9** | 1,586 | 104 B | 438 B | 129 B | 0 | 9 PENDING |
| `.pdf` | Portable Doc | **7** | 1,517,749 | 12,679 B | 855,378 B | 15,822 B | 0 | 7 PENDING |
| `[no_ext]` | Extensionless PDF | **2** | 450,644 | 59,221 B | 391,423 B | 225,322 B | 0 | 2 PENDING |
| `.xlsx` | Excel Spreadsheet | **2** | 2,008,214 | 945,991 B | 1,062,223 B | 1,004,107 B | 0 | 2 PENDING |
| `.ods` | OpenDoc Spreadsheet | **1** | 48,082 | 48,082 B | 48,082 B | 48,082 B | 0 | 1 PENDING |
| `.docx` | Word Document | **1** | 17,833 | 17,833 B | 17,833 B | 17,833 B | 0 | 1 PENDING |
| **Total** | — | **39** | **19,717,885** | **104 B** | **4,619,645 B** | — | **0** | **39 PENDING** |

### 1.2 Corpus Context: `CHAT_TXT` and `OTHER` Modalities

In addition to the 39 formal documents, the corpus contains:
- `modality = 'CHAT_TXT'`: **356 files** (1,777,680 bytes total; min 1 B, max 533,225 B, median 267 B). These represent WhatsApp Web chat export text logs (`chat.txt` in 355 folders + `WhatsApp Chat with Urko Banc. org.txt`). 100% are UTF-8 encoded. (Two foreign text files `LICENSE.txt` and `README.txt` were skipped in M1).
- `modality = 'OTHER'`: Contains 362 `.md` documentation/report files, 1 `.bak` file (`whatsapp_conversaciones_y_ultima_conversacion.ods.bak`, 48,082 bytes), 1 temporary lock file (`.ods#`, 107 bytes), KiCad CAD files, JSONs, Python scripts, and 4 `.nomedia` 0-byte markers.

---

## 2. In-Depth Profile of All 39 Document Files

### 2.1 PDF Documents (9 Files Total)

| File ID | Filename / Identifier | Size | Pages | Magic Bytes | Extracted Chars | Tables | OCR Needed? | Description / Forensic Content |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **16726** | `DOC-20251120-WA0006` | 391,423 B | 3 | `%PDF-1.4` | 13 | 0 | **YES (Mandatory)** | **CaixaBank Bank Statement**. Mobile raster screenshot embedded as PNGs. Titular: Ibai Santillan Soriano; IBAN: `ES0421001550210200693255`. 212 transaction lines recovered via OCR. |
| **16727** | `DOC-20260116-WA0000` | 59,221 B | 3 | `%PDF-1.4` | 3,638 | 0 | NO | **Trip.com Flight Itinerary**. Passenger: Ibai Santillan; IndiGo 6E1051 flight Porto -> Mumbai -> Bangkok. Fully searchable native text. |
| **16723** | `Análisis sangre 14.2.2024.pdf` | 186,473 B | 2 | `%PDF-1.7` | 4,368 | 2 | NO | **Osakidetza Blood Test**. Patient: Urko Santillan (03/10/1989, DNI `16089994E`). Laboratory hematology & biochemistry panel. |
| **17151** | `Poliza Urko.PDF` | 418,897 B | 30 | `%PDF-1.4` | 132,652 | 1 | NO | **Mutua Madrileña Auto Policy**. Tomador: Urko Santillan Soriano, Getxo (Bizkaia), NIF `16089994E`. Comprehensive terms & conditions. |
| **17152** | `presupuesto-70879.pdf` | 855,378 B | 3 | `%PDF-1.4` | 8,621 | 1 | NO | **Equipment Commercial Quote**. Martin Chacon (17.02.2022). Caravanning solar kit, deep blue solar panels, batteries. |
| **17550** | `Resource (1).pdf` | 15,822 B | 1 | `%PDF-1.4` | 650 | 0 | NO | **Banco Mediolanum Transfer Receipt**. Titular: Urko Santillán Soriano (30/12/21). Factura 000002 from Ingurumena Advanced Tec. |
| **17551** | `Resource (2).pdf` | 12,686 B | 1 | `%PDF-1.4` | 739 | 0 | NO | **Banco Mediolanum SEPA Direct Debit**. Titular: Urko Santillan Soriano (31/01/22). TGSS Autonomos quota payment. |
| **17552** | `Resource (3).pdf` | 12,679 B | 1 | `%PDF-1.4` | 739 | 0 | NO | **Banco Mediolanum SEPA Direct Debit**. Duplicate version of Resource (2).pdf. |
| **17553** | `Resource.pdf` | 15,814 B | 1 | `%PDF-1.4` | 650 | 0 | NO | **Banco Mediolanum Transfer Receipt**. Factura 000001 from Ingurumena Advanced Tec. |

### 2.2 Word Document (.docx - 1 File)

| File ID | Filename | Size | Paragraphs | Tables | Chars | Author / Metadata | Content Summary |
|:---|:---|:---:|:---:|:---:|:---:|:---|:---|
| **17141** | `Informacion y deberes Iñaki Kit digital.docx` | 17,833 B | 69 | 0 | 1,873 | Author: `URKO santillan soriano` (Modified: 2026-03-11) | Government subsidy (Kit Digital) justification requirements: domain certificate, server invoices, branding logos, web verification tasks. |

### 2.3 Spreadsheet Documents (.ods & .xlsx - 3 Files)

| File ID | Filename | Format | Size | Sheets Count | Sheet Names | Chars / Cells | Content Summary |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| **15985** | `whatsapp_conversaciones_y_ultima_conversacion.ods` | ODS | 48,082 B | 1 | `whatsapp_conversaciones (3)` | 64,588 chars (380 rows) | Pre-exported WhatsApp conversation index with last message snippets and contact numbers. |
| **18008** | `Master_WhatsApp_Analysis.xlsx` | XLSX | 945,991 B | 9 | Executive_Dashboard, Contacts_Overview, Membership_Evidence, Top_3_Evidence, Messages_Database, Conversation_Summary, Attachments_Database, Source_Coverage, Processing_Tracker | 3,433 cells | Master forensic workbook (original pre-run analysis truncated at 8,000 messages). |
| **18009** | `Master_WhatsApp_Analysis_Corrected_Full.xlsx` | XLSX | 1,062,223 B | 9 | Same 9 sheets as 18008 | 3,388 cells | Complete master workbook covering all 10,055 messages and 392 contacts without truncation. |

### 2.4 Tabular Ledgers (.csv - 17 Files)

All 17 CSV files reside in `WhatsApp_Analysis_Results\` (with one in `Whatsapp web Extraccion manual...`):
1. `attachments.csv` (ID 17997): 4,619,645 bytes, 15,417 lines.
2. `Attachment_Registry.csv` (ID 17999): 4,619,645 bytes, 15,417 lines (identical duplicate schema).
3. `messages.csv` (ID 18010): 1,732,707 bytes, 10,056 lines.
4. `Message_Master.csv` (ID 18011): 1,559,471 bytes, 10,056 lines.
5. `extraction_jobs.csv` (ID 18006): 1,232,477 bytes, 15,068 lines.
6. `Extraction_Status.csv` (ID 18007): 1,232,477 bytes, 15,068 lines.
7. `contacts.csv` (ID 18000): 83,443 bytes, 393 lines.
8. `Contact_Master.csv` (ID 18001): 75,592 bytes, 393 lines.
9. `whatsapp_conversaciones_datos_primarios_chrome_snippet.csv` (ID 15984): 68,039 bytes, 382 lines (UTF-8 with BOM).
10. `Agent_Assignments.csv` (ID 17995): 55,686 bytes, 393 lines.
11. `conversations.csv` (ID 18002): 50,863 bytes, 393 lines.
12. `Conversation_Master.csv` (ID 18003): 43,012 bytes, 393 lines.
13. `Attachment_Master.csv` (ID 17998): 291,687 bytes, 2,277 lines.
14. `CLAIM_VERIFICATION_MATRIX.csv` (ID 18033): 6,976 bytes, 13 lines.
15. `Source_Manifest.csv` (ID 18018): 700 bytes, 4 lines.
16. `Processing_Log.csv` (ID 18014): 685 bytes, 6 lines.
17. `processing_errors.csv` (ID 18013): 672 bytes, 4 lines.

### 2.5 Contact Cards (.vcf - 9 Files)

All 9 VCF files reside in `WhatsApp Chat with Urko Banc. org\`:
1. `3 contacts.vcf` (ID 16720): 438 bytes, vCard 3.0 (contains 3 cards: Jesus Natxo, Natxo Oca, etc.).
2. `Aaaa A Aurorik.vcf` (ID 16721): 120 bytes, vCard 3.0 (Tel: `+34 944 44 09 11`).
3. `Alvarito Txoko Alango Ganja.vcf` (ID 16722): 163 bytes, vCard 3.0 (Tel: `+34 688 68 15 77`).
4. `Charlie Valencia Dromedario Alejandro.vcf` (ID 16725): 183 bytes, vCard 3.0 (Tel: `+34 643 10 54 64`).
5. `Dunga.vcf` (ID 16728): 124 bytes, vCard 3.0 (Tel: `+34 629 03 18 55`).
6. `Iñaki Digital.Eus Kit Digital Marketing Digital.vcf` (ID 17142): 206 bytes, vCard 3.0 (Tel: `+34 679 60 67 88`).
7. `Janam.vcf` (ID 17143): 104 bytes, vCard 3.0 (Tel: `+34 616 42 34 21`).
8. `Phil.vcf` (ID 17150): 119 bytes, vCard 3.0 (Tel: `+34 609 54 49 15`).
9. `Unai Mec.vcf` (ID 17580): 129 bytes, vCard 3.0 (Tel: `+34 688 64 89 62`).

---

## 3. Deep-Dive: The Two Extensionless PDF Files

### 3.1 `DOC-20251120-WA0006` (CaixaBank Statement)
- **Path**: `Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\DOC-20251120-WA0006`
- **File ID**: 16726 | **Size**: 391,423 bytes (382.25 KB) | **Format**: PDF 1.4
- **Magic Bytes**: `25 50 44 46 2d 31 2e 34 0a 25 d3 eb e9 e1` (`%PDF-1.4\n%...`)
- **Producer**: `Skia/PDF m100` (Google Skia mobile renderer)
- **Page Count**: 3 pages
- **The Forensic Problem**: Direct text extraction (`page.get_text()`) yields only 13 characters:
  - Page 1: `'1/3\n'` (3 chars)
  - Page 2: `'2/3\n'` (3 chars)
  - Page 3: `'3/3\n'` (3 chars)
- **Image Analysis**: Each page consists of a large, high-resolution embedded PNG image:
  - Page 1: Image xref 4 (505 x 825 pixels, 55,040 bytes)
  - Page 2: Image xref 9 (505 x 700 pixels, 52,307 bytes)
  - Page 3: Image xref 13 (505 x 665 pixels, 34,526 bytes)
- **OCR Recovery Verification**:
  Using `RapidOCR` at 150 DPI pixmap rendering, 212 text lines were extracted with mean confidence > 0.98:
  - Header: `CaixaBank`, `Titular: Ibai Santillan Soriano`, `IBAN: ES0421001550210200693255`
  - Period: `11/10/2024 - 20/11/2025`
  - Transactions:
    - `10/11/2025`: PREST. DESEMPLEO (+844.02 €, Balance: 4.305,31 €)
    - `09/07/2025`: MERCADONA (-23.80 €)
    - `08/07/2025`: ANICURA URIBE CL (-89.50 €)
    - `08/07/2025`: EROSKI CITY URDUL (-14.78 €)
    - `10/04/2025`: PREST. DESEMPLEO (+844.02 €, Balance: 1.271,85 €)
    - `09/04/2025`: PRIMARK BILBAO (-80.12 €)
- **Pipeline Directive**: The document worker MUST execute a hybrid fallback: whenever a PDF page yields `< 50` characters of text and has `>= 1` embedded image, it must rasterize the page and invoke RapidOCR.

### 3.2 `DOC-20260116-WA0000` (Trip.com Flight Itinerary)
- **Path**: `Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\DOC-20260116-WA0000`
- **File ID**: 16727 | **Size**: 59,221 bytes (57.83 KB) | **Format**: PDF 1.4
- **Magic Bytes**: `25 50 44 46 2d 31 2e 34 0a 25 f6 e4 fc df` (`%PDF-1.4\n%...`)
- **Producer**: Generic / Blank
- **Page Count**: 3 pages
- **Text Analysis**: Direct PyMuPDF text extraction yielded **3,638 characters** of perfectly structured, readable text:
  - Page 1 (1,024 chars): Booking No. `1658109188198756`, Route: Porto to Bangkok, Passenger: `IBAI SANTILLAN`, Airline Booking Ref: `RJZPQX`.
  - Page 2 (986 chars): Flight `IndiGo 6E1051`, Departure: 03:55 Jan 17, 2026 Mumbai (BOM) T2, Arrival: 09:50 Jan 17, 2026 Bangkok Suvarnabhumi (BKK).
  - Page 3 (1,624 chars): Check-in guidelines, passport and visa instructions, baggage allowances.
- **Pipeline Directive**: Extracted directly using standard `page.get_text()` without requiring OCR.

---

## 4. Anomaly & Vulnerability Analysis

1. **Zero-Byte Files**:
   - Total in `file_inventory` WHERE `modality = 'DOCUMENT'`: **0** files.
   - Guardrail recommendation: If any future document has `file_size == 0`, assign terminal status `UNSUPPORTED` with terminal code `ZERO_BYTE`.
2. **Encrypted / Password-Protected Files**:
   - Total true password-locked documents: **0** files.
   - Observation: 5 PDFs (`Poliza Urko.PDF`, `Resource (1).pdf`, `Resource (2).pdf`, `Resource (3).pdf`, `Resource.pdf`) contain metadata `"encryption": "Standard V2 R3 128-bit RC4"`. However, PyMuPDF opens them cleanly with an empty password (`doc.needs_pass == False`).
   - Guardrail recommendation: Workers must test `doc.needs_pass`. If `doc.needs_pass is True` and `doc.authenticate("") == 0`, mark `status = 'FAILED'`, `terminal_code = 'PASSWORD_PROTECTED'`.
3. **Legacy Office Binary Formats (`.doc`, `.xls`)**:
   - Total files with `.doc` or `.xls` extension: **0**.
   - Total files with OLE Compound File Binary Format magic bytes (`\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1`): **0**.
   - Guardrail recommendation: If a legacy `.doc` or `.xls` is encountered, attempt extraction via fallback (or assign `UNSUPPORTED / LEGACY_BINARY_FORMAT`).
4. **Corrupt Zip Disguises (`.docx`, `.xlsx`, `.ods`)**:
   - All 4 zip-based office documents (`1 .docx`, `1 .ods`, `2 .xlsx`) were verified via magic bytes `50 4b 03 04` and successfully uncompressed by their respective libraries. Zero corrupted zip files exist.
5. **Character Encoding (BOM & CP1252 Pitfalls)**:
   - All 356 `CHAT_TXT` files are strictly UTF-8 compliant.
   - `whatsapp_conversaciones_datos_primarios_chrome_snippet.csv` begins with UTF-8 BOM (`\xef\xbb\xbf`). Workers must use `utf-8-sig` when parsing CSVs.
   - `Poliza Urko.PDF` contains unicode box-drawing characters (`\u2551`). On Windows host environments, workers must reconfigure stdout or serialize directly to UTF-8 SQLite columns to prevent `UnicodeEncodeError: 'charmap'`.

---

## 5. Precise Worker M3 Implementation Architecture & Recommendations

### 5.1 Target Database Contract (`document_evidence`)

As specified in `PROJECT.md`, the extraction results must be committed to table `document_evidence`:
```sql
CREATE TABLE IF NOT EXISTS document_evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER REFERENCES file_inventory(file_id),
    doc_type TEXT NOT NULL,       -- PDF, DOCX, ODS, XLSX, CSV, VCF, TXT
    extracted_text TEXT,
    page_count INTEGER,
    tables_json TEXT,             -- JSON array of structured 2D tables
    metadata_json TEXT,           -- JSON dictionary of document properties
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_doc_evidence_file_id ON document_evidence(file_id);
```

### 5.2 Worker Handler Taxonomy

| Category | Input Scope | Extraction Engine | Text Extraction Protocol | Tabular Extraction Protocol | Metadata Capture |
|:---|:---|:---|:---|:---|:---|
| **PDF** | `.pdf`, `.PDF`, extensionless `DOC-*` | PyMuPDF (`fitz`) + RapidOCR fallback | `page.get_text()`. If page text `< 50` chars and `len(page.get_images()) > 0`, render page at 150 DPI and run RapidOCR. | `page.find_tables()` exported as JSON lists of lists. | Format, title, author, producer, creator, encryption info. |
| **DOCX** | `.docx` | `python-docx` | Concatenate paragraph text with `\n`. | Extract all `doc.tables` as 2D string matrices. | Core properties (author, created, modified). |
| **ODS** | `.ods` | `odfpy` (`opendocument.load`) | Extract all cell and paragraph strings across sheets. | Extract table rows as JSON tabular records per sheet. | Sheet names, table count. |
| **XLSX** | `.xlsx` | `openpyxl` (`read_only=True`) | Extract text representation of cells across sheets. | Extract 2D row/column grid into JSON per worksheet. | Sheet names, row/column counts. |
| **CSV** | `.csv` | Python `csv.reader` (`utf-8-sig`) | Full text content. | Structured array of records / column headers. | Row count, column headers, delimiter. |
| **VCF** | `.vcf` | Built-in regex vCard parser | Formatted string of vCards (`FN`, `TEL`, `EMAIL`). | Array of contact objects `{name, phone, org}`. | Card count, vCard version. |
| **TXT** | `.txt` (if processed in M3) | Built-in Python `open(..., encoding='utf-8')` | Full text content. | None (`[]`). | Line count, character count. |

### 5.3 Terminal Status Lifecycle & Error Resolution

Every processed file must atomically update `file_inventory`:
```sql
UPDATE file_inventory 
SET status = :status, 
    terminal_code = :terminal_code, 
    error_message = :error_message, 
    updated_at = CURRENT_TIMESTAMP 
WHERE file_id = :file_id;
```

**State Matrix**:
1. **Successful Extraction**:
   - `status = 'COMPLETED'`
   - `terminal_code = 'EXTRACTED_SUCCESS'`
   - `error_message = NULL`
2. **Scanned PDF Processed with OCR**:
   - `status = 'COMPLETED'`
   - `terminal_code = 'EXTRACTED_OCR_FALLBACK'`
   - `error_message = NULL`
3. **Password-Protected / Encrypted**:
   - `status = 'FAILED'`
   - `terminal_code = 'PASSWORD_PROTECTED'`
   - `error_message = 'Document requires unprovided password'`
4. **Corrupted File / Malformed Archive**:
   - `status = 'FAILED'`
   - `terminal_code = 'CORRUPTED_OR_FAILED'`
   - `error_message = '<traceback error string>'`
5. **Zero-Byte File**:
   - `status = 'UNSUPPORTED'`
   - `terminal_code = 'ZERO_BYTE'`
   - `error_message = '0-byte file'`
6. **Unsupported Extension**:
   - `status = 'UNSUPPORTED'`
   - `terminal_code = 'UNSUPPORTED_FORMAT'`
   - `error_message = 'Extension not supported for document extraction'`

---

## 6. Concurrency & Performance Recommendations

1. **Worker Pool Sizing**:
   - With 39 primary document files (total 19.7 MB), single-threaded processing completes in ~4 seconds. 
   - A pool of **4 CPU worker processes** (as budgeted in `ORIGINAL_REQUEST §1`) processes the entire batch in `< 1.5 seconds`.
2. **Database Concurrency & WAL Discipline**:
   - Use `immediate_transaction()` context manager from `db_utils.py` to prevent `SQLITE_BUSY` contention.
   - Batch SQLite inserts into `document_evidence` and batch updates to `file_inventory` using `INSERT OR REPLACE` or `INSERT OR IGNORE`.
3. **Memory Safety**:
   - Avoid reading whole `.xlsx` files into memory; use `openpyxl.load_workbook(..., read_only=True)`.
   - Free PyMuPDF document handles explicitly via `doc.close()`.

---

## Verification & Artifact References
- Complete dataset: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\document_profile_data.json`
- Initial census script: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\census_analysis.py`
- Deep profiling script: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\deep_profile_documents.py`
- Extensionless OCR verification script: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\test_ocr_extensionless_pdf.py`
