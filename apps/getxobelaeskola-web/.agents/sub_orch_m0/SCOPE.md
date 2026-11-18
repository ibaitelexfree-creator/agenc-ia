# Scope: Milestone M0 - Infrastructure, Isolated Environment & Baseline Snapshot

## Mission
Establish the isolated execution environment at `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`, provision the uv `.venv`, verify CTranslate2 CUDA support without PyTorch, install and configure Tesseract-OCR, execute SQLite WAL checkpoint and SHA-256 baseline hashing on `whatsapp_forensics.db`, and initialize `run_evidence.db` with the schema contracts specified in `PROJECT.md`.

## Source of Truth & Rules
- `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- Working Directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\sub_orch_m0`
- Target Environment: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`
- Production DB: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` (STRICTLY READ-ONLY).

## Acceptance Criteria for M0
1. Target directory `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run` created.
2. Isolated `.venv` created via `uv` in `forensics_multiagent_run\.venv`.
3. Lean dependencies installed: `ctranslate2`, `faster-whisper`, `rapidocr-onnxruntime`, `onnxruntime`, `pytesseract`, `pymupdf`, `python-docx`, `odfpy`, `openpyxl`, `pandas`. ZERO PyTorch installed.
4. CTranslate2 CUDA compute support independently verified on RTX 4080 (`cuda:0`).
5. Tesseract-OCR installed via `winget install UB-Mannheim.TesseractOCR --accept-source-agreements --accept-package-agreements`, verified at `C:\Program Files\Tesseract-OCR\tesseract.exe`, and bound to `pytesseract`.
6. SQLite baseline established:
   - PRAGMA wal_checkpoint(TRUNCATE) and PRAGMA integrity_check verified.
   - SHA-256 hashes recorded for `whatsapp_forensics.db`, `-wal`, `-shm`.
   - Production database confirmed read-only.
7. `run_evidence.db` initialized with tables: `file_inventory`, `ocr_evidence`, `audio_evidence`, `document_evidence`, `text_forensic_entities`, `attachment_links`, and `cross_modal_index` (FTS5).
8. Full verification report and clean gate verdict achieved before reporting completion.
