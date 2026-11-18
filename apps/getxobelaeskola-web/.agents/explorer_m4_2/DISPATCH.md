## 2026-10-28T20:56:05Z
You are Explorer M4.2 (RapidOCR & Tesseract Dual-Engine Benchmark Explorer) for Milestone M4 (Image OCR Pipeline).

### 1. Mandatory Context
Read the following authoritative files:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`

### 2. Working Directory & Identity
- Working directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2`
- Maintain `BRIEFING.md`, `progress.md`, and `DISPATCH.md`.

### 3. Your Specific Mission
Benchmark and evaluate the two OCR engines installed in the environment:
1. Benchmark `rapidocr_onnxruntime` (`RapidOCR`):
   - Measure throughput (ms/image), memory consumption, and verify output format (boxes, text, confidence scores).
   - Test character confidence calculation across multi-line text blocks.
2. Benchmark `pytesseract` (Tesseract v5.5.0 at `tools\tesseract\tesseract.exe`):
   - Verify configuration: `pytesseract.pytesseract.tesseract_cmd = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe"`.
   - Verify language pack availability: `eng`, `spa`, `eus` (`-l eng+spa+eus`).
   - Measure throughput and confidence output (`image_to_data`).
3. Formulate the exact triggering rule for Tesseract Fallback:
   - Mandatory rule from ORIGINAL_REQUEST: Triggered when RapidOCR output fails confidence (< 0.60) or completeness checks (blank non-empty images where text is suspected).
   - Mandatory rule 8: Dual-output retention! If fallback is triggered, BOTH engine outputs must be inserted into `ocr_evidence` (Row 1 for RapidOCR with `fallback_triggered = 1`, Row 2 for Tesseract with `fallback_triggered = 0` or `1`).
4. Define standard schema representation for:
   - `extracted_text`: Normalized UTF-8 string with preserved line breaks.
   - `mean_confidence`: Normalized float [0.0, 1.0].
   - `bbox_json`: Compact JSON array of `[box_coordinates, text, confidence]`.
5. Test sample images from the corpus (high-quality screenshot, low-contrast receipt, camera photo, non-text photo) and record comparison metrics.

### 4. Constraints & Rules
- READ-ONLY. Do NOT modify any database, do NOT modify production code.
- Baseline `whatsapp_forensics.db` is strictly read-only.
- Put your comprehensive report in `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2\dual_engine_ocr_strategy.md` and deliver `handoff.md`. Notify orchestrator via `send_message`.
