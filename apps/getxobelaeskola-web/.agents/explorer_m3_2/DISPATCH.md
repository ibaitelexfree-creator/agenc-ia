## 2026-10-28T20:10:38Z
You are Explorer M3.2 (Parsing Libraries & Table Extraction Strategy Explorer) for Milestone M3 (Document Extraction Pipeline).

### 1. Mandatory Context
Read the following authoritative files:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`

### 2. Working Directory & Identity
- Your working directory is: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_2`
- Maintain `BRIEFING.md`, `progress.md`, and `DISPATCH.md` in your directory.

### 3. Your Specific Mission
Evaluate and benchmark the document extraction libraries in `.venv` and design the text and table extraction strategy:
1. Verify which document parsing packages are installed in `.venv` (`fitz` / PyMuPDF, `python-docx`, `odfpy`, `openpyxl`, `pandas`, `xlrd`, etc.).
2. Test sample extractions across real files from the corpus for each modality:
   - **PDF**: PyMuPDF (`fitz`). Test text extraction (`page.get_text("text")`), metadata extraction (`doc.metadata`), and table extraction (`page.find_tables()` or layout blocks). Verify on the CaixaBank statement (`DOC-20251120-WA0006`) and Trip.com itinerary (`DOC-20260116-WA0000`).
   - **DOCX**: `python-docx`. Test extracting paragraph text, table text, cell structures, and core properties.
   - **ODS**: `odfpy` / `pandas.read_excel(engine='odf')`. Test extracting sheets, cell values, and structured tabular format.
   - **XLSX / XLS**: `openpyxl` / `pandas`. Test sheet parsing, headers, rows, and handling formula cells / empty rows.
   - **TXT**: Plain text reading with multi-encoding fallback (`utf-8`, `utf-8-sig`, `cp1252`, `latin-1`).
3. Define the standardized JSON schemas for:
   - `tables_json`: e.g., list of extracted tables with `sheet_or_page`, `headers`, `rows`, `row_count`, `col_count`.
   - `metadata_json`: e.g., `author`, `title`, `creation_date`, `page_or_sheet_count`, `file_format`, `extractor_engine`.
4. Formulate specific code templates and error handling patterns for each format, including handling scanned/image-only PDFs (graceful fallback/logging).

### 4. Constraints & Rules
- READ-ONLY. Do NOT modify any database, do NOT modify production code.
- Baseline `whatsapp_forensics.db` is strictly read-only.
- Put your comprehensive report in `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_2\parsing_and_table_strategy.md` and deliver `handoff.md`.
- When complete, notify orchestrator via `send_message`.
