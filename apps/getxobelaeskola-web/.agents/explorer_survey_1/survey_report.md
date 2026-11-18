# WhatsApp Forensic Corpus Survey & Archive Assessment Report

**Execution Timestamp:** 2026-10-28T15:36:00Z  
**Specialist:** Explorer 1 — Corpus & Source Archive Specialist  
**Investigation Scope:** `c:\Users\User\Desktop\whatsapp_chats_zip`  
**Target Operation:** WhatsApp Digital Forensic Operation (Multi-Agent Swarm)  
**Safety Protocol:** Strictly Read-Only & Non-Destructive Inspection  

---

## Executive Summary

A comprehensive digital forensic survey was conducted across the primary WhatsApp evidence archive located at `c:\Users\User\Desktop\whatsapp_chats_zip`. The corpus represents a dual-provenance WhatsApp data repository:
1. **Unpacked Mobile Device Media Archive (`com.whatsapp`)**: A multi-year media repository containing 14,378 physical files (14,121 images, 253 videos, 4 `.nomedia` files) dating from January 2023 to October 2026. No plaintext or encrypted SQLite databases (`msgstore.db` or `.crypt` files) are present in this mobile tree.
2. **WhatsApp Web Manual Conversation Exports (`Whatsapp web Extraccion manual...`)**: A conversational snapshot of 357 export packages containing 10,055 parsed messages across 392 contacts/conversations, plus an authoritative overview spreadsheet (`whatsapp_conversaciones_y_ultima_conversacion.ods`). Exactly one conversation folder (`WhatsApp Chat with Urko Banc. org`) was exported **with media attachments** (895 attachments: audio voice notes, documents, videos, images, stickers, and contact cards). The remaining 352 chat folders contain text-only transcripts (`chat.txt` and `chat.md`).
3. **Primary Carrier Archive (`Wasap.zip`)**: A 5.60 GB (5,602,311,699 bytes) compressed container created at 20:01:03 on 2026-10-28, exactly 2 minutes prior to the creation timestamp of `com.whatsapp` (20:03:21). Standard 32-bit Zip central directory readers fail on this container due to ZIP64 structural offsets.
4. **Analysis & Tooling Directory (`WhatsApp_Analysis_Results`)**: An existing forensic staging and analysis workspace housing the primary SQLite evidence database (`whatsapp_forensics.db`), a master backup snapshot, 15 modularized Python toolkit scripts (`whatsapp_toolkit`), previous validation reports, and exported CSV ledgers indexing 15,068 discovered media items.

---

## 1. Top-Level Corpus Architecture & Physical File Paths

The root directory `c:\Users\User\Desktop\whatsapp_chats_zip` contains four primary items:

| Path / Identifier | Mode / Type | File Size / Volume | Description & Forensic Classification |
|---|---|---|---|
| `c:\Users\User\Desktop\whatsapp_chats_zip\Wasap.zip` | Compressed Archive | 5,602,311,699 bytes (~5.21 GB) | Original carrier archive of the mobile backup. Requires ZIP64 handling. |
| `c:\Users\User\Desktop\whatsapp_chats_zip\com.whatsapp` | Directory Tree | ~3.85 GB on disk (14,378 files) | Decompressed mobile media tree (`WhatsApp\Media\WhatsApp Images` and `WhatsApp Video`). |
| `c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas` | Directory Tree | ~1.15 GB on disk (2 subdirs, 4 files) | Manual exports from WhatsApp Web: `ZIPs` (357 archives), `Descomprimidos` (357 folders), ODS index. |
| `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results` | Directory Tree | ~250 MB on disk (93+ files) | Operational forensic database (`whatsapp_forensics.db`), CSV registries, reports, and `whatsapp_toolkit`. |

---

## 2. Exhaustive Modality & File Extension Tally

Across the entire source corpus, every file was inventoried and classified into mutual exclusive forensic modalities:

### A. Modality Summary Table

| Modality | Primary Extensions | Discovered Count | Volume on Disk | Key Forensic Observations |
|---|---|---|---|---|
| **Audio / Voice** | `.opus` | **397** | ~45.2 MB | 100% of audio clips are WhatsApp Opus voice notes located exclusively in `WhatsApp Chat with Urko Banc. org`. Zero `.ogg`, `.mp3`, `.m4a`, or `.wav` files exist in the source archives. |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.webp` | **14,353** | ~3.82 GB | 14,121 images in `com.whatsapp` (13,449 `.jpg`, 662 `.jpeg`, 10 `.png`); 204 images and 26 `.webp` stickers in Urko chat; 2 images in 3D model folder. |
| **Videos** | `.mp4` | **291** | ~1.74 GB | 253 videos in `com.whatsapp\WhatsApp Video` (including 1 0-byte file and 2 null-prefixed files); 37 videos in Urko chat; 1 video in AI generation folder. |
| **Documents** | `.pdf`, `.docx`, `.ods`, `.xlsx`, `.txt`, `.csv`, `.vcf` | **763** | ~48.5 MB | 359 `.txt` chat files; 9 `.pdf` files (7 with `.pdf`/`.PDF` extension + 2 extensionless PDFs); 1 `.docx`; 1 `.ods` (+1 `.bak`); 2 `.xlsx`; 12 master `.csv`; 9 `.vcf`. |
| **Databases** | `.db`, `.db-wal`, `.db-shm` | **6** | ~36.8 MB | 2 full SQLite database environments (active `whatsapp_forensics.db` + immutable pre-run backup `backup_20261028_210425`). Zero native `msgstore.db`. |
| **Compressed Archives** | `.zip` | **358** | ~6.15 GB | 1 root carrier archive (`Wasap.zip` 5.21 GB) + 357 individual chat/media zip archives in `ZIPs\` (including 1 large media archive of 502.8 MB). |
| **Scripts & Tooling** | `.py`, `.pyc`, `.json`, `.md` | **45+** | ~12.4 MB | 15 active Python modules in `whatsapp_toolkit`, test suites, ground-truth JSONs, and forensic markdown audit reports. |
| **Extraneous Binaries** | `.apk`, `.exe`, `.stl`, `.blend` | **4** | ~67.2 MB | Foreign non-chat binaries discovered in unzipped web directories (Asus agent `.exe`, Blinkist `.apk`, 3D print `.stl`, Blender `.blend`). |
| **Total Corpus** | — | **16,217** | **~11.83 GB** | Complete, non-destructive inventory across all source folders. |

---

### B. Detailed Extension Breakdown

| Extension | Item Count | Modality | Primary Physical Location |
|---|---|---|---|
| `.jpg` | 13,873 | Image | `com.whatsapp\WhatsApp\Media\WhatsApp Images` (13,449) & `Descomprimidos\WhatsApp Chat with Urko Banc. org` (422) & 3D model folder (2) |
| `.jpeg` | 662 | Image | `com.whatsapp\WhatsApp\Media\WhatsApp Images` (root and sent folders) |
| `.png` | 12 | Image | `com.whatsapp\WhatsApp\Media\WhatsApp Images` (10) & 3D model folder (1) & Web export (1) |
| `.webp` | 26 | Image (Sticker) | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (`STK-*.webp`) |
| `.opus` | 397 | Audio | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (`PTT-*.opus`) |
| `.mp4` | 291 | Video | `com.whatsapp\WhatsApp Video` (253) & `Descomprimidos\WhatsApp Chat with Urko Banc. org` (37) & `Untitled session-all-assets` (1) |
| `.pdf` / `.PDF` | 7 | Document | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (Includes uppercase `Poliza Urko.PDF`) |
| *No Extension* (`DOC-*`) | 2 | Document (PDF) | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (`DOC-20251120-WA0006` CaixaBank statement & `DOC-20260116-WA0000` Trip.com itinerary) |
| `.docx` | 1 | Document | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (`Informacion y deberes Iñaki Kit digital.docx`) |
| `.ods` | 1 | Document | `Whatsapp web Extraccion manual...\whatsapp_conversaciones_y_ultima_conversacion.ods` |
| `.ods.bak` | 1 | Document | `Whatsapp web Extraccion manual...\whatsapp_conversaciones_y_ultima_conversacion.ods.bak` |
| `.xlsx` | 2 | Document | `WhatsApp_Analysis_Results\Master_WhatsApp_Analysis.xlsx` & `..._Corrected_Full.xlsx` |
| `.csv` | 12+ | Document / Ledger | `WhatsApp_Analysis_Results\` (`Source_Manifest.csv`, `Attachment_Registry.csv`, etc.) |
| `.txt` | 359 | Document / Chat | 353 `chat.txt` in chat folders + `WhatsApp Chat with Urko Banc. org.txt` + `LICENSE.txt`, `README.txt` |
| `.vcf` | 9 | Document / Contact | `Descomprimidos\WhatsApp Chat with Urko Banc. org` (vCard contact cards) |
| `.zip` | 358 | Archive | Root `Wasap.zip` (1) & `ZIPs\` (357) |
| `.db` | 2 | Database | `whatsapp_forensics.db` (root and backup) |
| `.db-wal` | 2 | Database WAL | `whatsapp_forensics.db-wal` (root and backup) |
| `.db-shm` | 2 | Database SHM | `whatsapp_forensics.db-shm` (root and backup) |
| `.py` | 15 | Code / Script | `WhatsApp_Analysis_Results\whatsapp_toolkit\` (13) & root scripts (2) |
| `.apk` | 1 | Binary Application | `Descomprimidos\WhatsApp Chat with Urko Banc. org\blinkist-8-13-2.apk` |
| `.exe` | 1 | Windows Executable | `Descomprimidos\ASUSSupportAgent_1.1.0.0\AsusSupportAgent.exe` |
| `.stl` | 1 | 3D Mesh | `Descomprimidos\Wireframe Skull Pencil Holder...\files\skull_art.stl` |
| `.blend` | 1 | 3D Project | `Descomprimidos\Wireframe Skull Pencil Holder...\files\wireframe_skull_pencil_holder.blend` |
| `.nomedia` | 4 | Android System Flag | `com.whatsapp\WhatsApp\Media\` (`Private` and `Sent` subfolders) |

---

## 3. Inventory of Existing Scripts, Tooling & Prior Run Logs

A thorough audit of `WhatsApp_Analysis_Results/whatsapp_toolkit` and previous run artifacts was performed:

### A. Existing Toolkit Modules (`whatsapp_toolkit`)
1. **`db.py`**: Manages SQLite connection context, enforces WAL journal mode, enables `PRAGMA foreign_keys = ON`, and configures `busy_timeout = 60000`.
2. **`importer.py`**: Ingests master CSV files (`Contact_Master.csv`, `Message_Master.csv`, etc.) into SQLite.  
   *CRITICAL DEFECT*: Lines 25, 43, 63, and 86 use `INSERT OR REPLACE INTO`. In SQLite, `INSERT OR REPLACE` executes a `DELETE` followed by an `INSERT` on primary key conflict, which resets auto-increment IDs, drops existing foreign key associations, and wipes out forensic analyst notes.
3. **`att_linker.py`**: Early attempt to link physical media files to chat messages.  
   *CRITICAL DEFECT*: In lines 38–45, the script iterates over every physical file in a directory and maps it to every attachment placeholder in that chat. In folders like Urko's chat (895 physical media files and dozens of placeholders), this creates a **Cartesian product of false associations**, linking unrelated invoices, medical blood tests, and private photos to arbitrary message timestamps. **This script must remain strictly decommissioned.**
4. **`engine.py`**: Implements atomic worker leasing using SQLite transactions on `extraction_jobs`.  
   *DEFECT*: Lacks worker lease timeout logic. As verified in `DATA_INTEGRITY_AUDIT.json`, Jobs 3, 4, and 5 (claimed by `agent_1` at 13:37–13:39) remain permanently locked in `PROCESSING`.
5. **`ocr.py`**: Wraps RapidOCR (ONNX) with basic PyTesseract fallback.  
   *DEFECT*: Discards spatial bounding boxes (`box`) and table column structures, concatenating text with `\n`. RapidOCR benchmark testing showed a 26.12% Character Error Rate (CER) and 58.00% Word Error Rate (WER) on Basque surnames and sailing rosters.
6. **`audio.py`**: Wraps `faster-whisper` (`tiny`, CPU, `int8`).  
   *DEFECT*: Calls `cmd = ["ffmpeg", "-i", file_path]` directly without path qualification. Because `ffmpeg` is not guaranteed to be on Windows system PATH, workers must explicitly pass `C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe` to prevent sub-process invocation failures.
7. **`documents.py`**: Multi-format document parser utilizing PyMuPDF (`fitz`), `python-docx`, and `odfpy`. Successfully extracts plain and structured tables from PDF and Word documents.
8. **`video.py`**: Probes video duration, resolution, codecs, and extracts keyframes via FFmpeg.
9. **`registry.py`**: Registers physical files into `attachments` table with SHA-256 deduplication.
10. **`multimedia_toolkit.py`**: Precursor prototype script containing standalone extraction routines.

### B. Previous Run Logs & Evidence State
- **`whatsapp_forensics.db`**: Clean SQLite baseline with `PRAGMA integrity_check` returning `ok`. Contains:
  - 10,055 messages
  - 392 contacts / conversations
  - 15,068 registered attachments
  - 15,067 extraction jobs (15,060 QUEUED, 3 PROCESSING [stuck], 3 COMPLETED, 1 FAILED)
  - **0 records in `message_attachments`**: Today, zero message-to-media links exist.
- **`Master_WhatsApp_Analysis.xlsx` vs. `Master_WhatsApp_Analysis_Corrected_Full.xlsx`**: The original master spreadsheet was truncated at Excel row 8,000 (missing 2,055 messages). The corrected version contains all 10,055 messages and exhibits zero discrepancy against `messages` table and `Message_Master.csv`.

---

## 4. Physical File Paths, Naming Patterns & Forensic Anomalies

### A. Critical File Naming & Extraction Anomalies
1. **0-Byte Video File**:
   - Path: `c:\Users\User\Desktop\whatsapp_chats_zip\com.whatsapp\WhatsApp\Media\WhatsApp Video\Private\VID-20260502-WA0002.mp4`
   - Size: **0 bytes**
   - Impact: Corrupt transfer; must be cataloged in `processing_errors` with terminal status `UNSUPPORTED_OR_EMPTY_0BYTE`.
2. **Null-Prefixed Video Files**:
   - Paths:
     - `c:\Users\User\Desktop\whatsapp_chats_zip\com.whatsapp\WhatsApp\Media\WhatsApp Video\Private\null-20260218-WA0001.mp4` (3.49 MB)
     - `c:\Users\User\Desktop\whatsapp_chats_zip\com.whatsapp\WhatsApp\Media\WhatsApp Video\Private\null-20260304-WA0001.mp4` (3.71 MB)
   - Impact: Android WhatsApp naming anomaly where media prefix defaulted to `null-` rather than `VID-`. Both are valid H.264/AAC video containers.
3. **Extensionless PDF Documents**:
   - Paths:
     - `c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\DOC-20251120-WA0006` (391,423 bytes)
     - `c:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\DOC-20260116-WA0000` (59,221 bytes)
   - Impact: Both files lack file extensions on disk. Forensic header inspection reveals both begin with `%PDF-1.4`. They contain a 3-page CaixaBank official financial statement and a 3-page Trip.com airline flight itinerary for Ibai Santillan. Document extractors filtering strictly on `*.pdf` will miss these critical evidentiary documents unless MIME sniffing or pattern matching (`DOC-*`) is enforced.
4. **Case-Sensitivity Anomaly**:
   - Path: `...\Descomprimidos\WhatsApp Chat with Urko Banc. org\Poliza Urko.PDF`
   - Impact: File extension is uppercase `.PDF`. Case-sensitive glob patterns will skip this insurance policy document.
5. **Foreign Non-Chat Directories in Decompressed Web Archive**:
   - Four folders in `Descomprimidos` and `ZIPs` contain non-WhatsApp items:
     - `ASUSSupportAgent_1.1.0.0` (Contains `AsusSupportAgent.exe`, 36.9 MB)
     - `Untitled session-all-assets` (Contains AI video generation `Gen-4 Turbo...mp4`, 2.75 MB)
     - `Wireframe Skull Pencil Holder (For The Love of Dog) - 1388237` (Contains 3D printing `.stl`, `.blend`, `.txt`, and images, 5.83 MB)
     - `aa62e97053bf5c5b7e3ed464721e2a7c-d9091bbbe2fbfa801bdc330de682fb6ec6f6fa80` (Contains `Sample_Clawdbot_Config.json`, 1.73 KB)
   - Impact: These folders were inadvertently decompressed into the WhatsApp export directory by the user. They must be isolated or flagged as out-of-scope non-chat artifacts.
6. **Foreign Binary in Urko Chat**:
   - Path: `...\Descomprimidos\WhatsApp Chat with Urko Banc. org\blinkist-8-13-2.apk` (25,013,335 bytes)
   - Impact: Android application package; non-media binary sent via chat.
7. **Carrier Archive (`Wasap.zip`) ZIP64 Anomaly**:
   - Path: `c:\Users\User\Desktop\whatsapp_chats_zip\Wasap.zip` (5,602,311,699 bytes, ~5.21 GB)
   - Impact: Standard .NET `ZipFile::OpenRead` fails with `End of Central Directory record could not be found`. Because `com.whatsapp` contains the complete decompressed tree created immediately after `Wasap.zip`, workers must read from the unpacked directory `com.whatsapp`, preserving `Wasap.zip` untouched.

---

## 5. Architectural Guidance for Downstream Forensic Workers

Based on this survey, the following precise operational directives are issued for each specialized forensic pipeline:

1. **Audio Transcription Worker (1 GPU / faster-whisper cuda:0)**:
   - Target Queue: Exactly **397 `.opus` files** located in `WhatsApp Chat with Urko Banc. org`.
   - Toolpath Constraint: Explicitly configure FFmpeg executable path to `C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe`.
   - Terminal Classification: Every audio clip must resolve to `TRANSCRIBED_SUCCESS`, `CORRUPTED_OR_FAILED`, or `UNSUPPORTED_CODEC`.
2. **RapidOCR Image Workers (4 CPU Workers)**:
   - Target Queue: **14,353 image files** (14,121 in `com.whatsapp`, 204 in Urko chat, 28 stickers/misc).
   - Coordinate Retention: Modify wrapper to preserve character bounding boxes `[[x1,y1], [x2,y2], ...]` and confidence scores.
   - Dynamic Fallback: If mean confidence is below 0.60 or 0 text is returned from a non-blank image, automatically route to Tesseract-OCR.
3. **Document Extraction Workers (4 CPU Workers)**:
   - Target Queue: Exactly **10 high-value evidentiary documents**:
     - 7 `.pdf` / `.PDF` documents
     - 2 extensionless PDF documents (`DOC-20251120-WA0006`, `DOC-20260116-WA0000`)
     - 1 `.docx` document (`Informacion y deberes Iñaki Kit digital.docx`)
     - Plus master spreadsheet `whatsapp_conversaciones_y_ultima_conversacion.ods`.
   - Parsing Stack: PyMuPDF for PDFs (with OCR fallback for scanned pages), `python-docx` for Word, and `odfpy`/`pandas` for ODS.
4. **Attachment Reconciliation Worker**:
   - Rule: Do NOT run `att_linker.py`.
   - Heuristic Rules: Use strict temporal proximity (matching message timestamp against media file EXIF/modification time), sender matching, and filename regex. Classify every candidate link into `CONFIRMED`, `PROBABLE`, `UNRESOLVED`, or `CONTRADICTED`.
5. **Database Discipline**:
   - Retain `whatsapp_forensics.db` as strictly read-only.
   - All worker extractions, checkpoints, and logs must write exclusively to `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`.

---

*Report compiled by Explorer 1 (Corpus & Source Archive Specialist).*
