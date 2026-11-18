## 2026-10-28T15:51:12Z

You are Worker M0_1 (Infrastructure, Environment & Baseline Implementation Worker) for Milestone M0 in the WhatsApp Digital Forensic Operation.
Your Working Directory is: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m0_1

Read the following documents before beginning:
- c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md
- c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md
- c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_1\strategy_report.md
- c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_2\strategy_report.md
- c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m0_3\strategy_report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Exclusive Write Ownership:
- Target workspace: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run
  - .venv\
  - scripts\ (cuda_init.py, tesseract_provisioner.py, init_evidence_db.py, verify_m0.py)
  - run_evidence.db
  - reports\ (m0_baseline_manifest.json)
NOTE: The production database at c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db is STRICTLY READ-ONLY! Never write to it.

Your Implementation Tasks for Milestone M0:
1. Target Directory & uv Virtual Environment:
   - Create `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run` and its subdirectories (`scripts`, `tests`, `reports`, `logs`, `checkpoints`).
   - Run `uv venv --python 3.12 c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv`.
   - Install the lean dependencies using uv: `ctranslate2==4.8.4`, `faster-whisper==1.2.1`, `rapidocr-onnxruntime==1.4.4`, `onnxruntime`, `pytesseract==0.3.13`, `pymupdf`, `python-docx`, `odfpy`, `openpyxl`, `pandas`, `pillow`, plus standalone CUDA 12 wheels (`nvidia-cublas-cu12`, `nvidia-cudnn-cu12`, `nvidia-cuda-nvrtc-cu12`).
   - Implement the DLL resolution mechanism (add `.venv\Lib\site-packages\nvidia_cuda_paths.pth` and `scripts\cuda_init.py` with `os.add_dll_directory()`).
   - VERIFY that `torch` is NOT installed (assert `import torch` fails with ModuleNotFoundError).
   - Verify CTranslate2 CUDA compute support independently on `cuda:0` (RTX 4080 Laptop GPU).

2. Tesseract-OCR Provisioning & Verification:
   - Install Tesseract via `winget install --id UB-Mannheim.TesseractOCR -e --silent --scope machine --accept-source-agreements --accept-package-agreements` (or user scope fallback).
   - Verify executable at `C:\Program Files\Tesseract-OCR\tesseract.exe`.
   - Ensure `spa.traineddata` and `eus.traineddata` are present in `tessdata` (download if missing).
   - Configure pytesseract binding (`pytesseract.pytesseract.tesseract_cmd`).
   - Run synthetic OCR test on in-memory image to verify text, bounding boxes, and confidence.

3. SQLite Baseline Snapshot & Evidence Ledger:
   - Under read-only URI (`?mode=ro`), verify `PRAGMA integrity_check;` and `PRAGMA wal_checkpoint(TRUNCATE);` on `whatsapp_forensics.db`.
   - Compute and record SHA-256 hashes of `whatsapp_forensics.db`, `-wal`, and `-shm`. Confirm `whatsapp_forensics.db` hash is `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`.
   - Save baseline manifest to `reports\m0_baseline_manifest.json`.
   - Initialize `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db` implementing all schema contracts from PROJECT.md:
     `file_inventory`, `ocr_evidence`, `audio_evidence`, `document_evidence`, `text_forensic_entities`, `attachment_links`, and `cross_modal_index` (FTS5). Set WAL mode and busy timeout.

4. Comprehensive M0 Verification:
   - Run verification script `verify_m0.py` that checks all acceptance criteria.
   - Document commands, outputs, and metrics in your handoff report.
   - Produce `handoff.md` in `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m0_1\handoff.md`.
Update `progress.md` continuously. When done, notify the orchestrator via send_message.
