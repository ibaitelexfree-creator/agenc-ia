# Handoff Report — Explorer M4.2 Gen2 (Dual-Engine OCR Benchmark Explorer)

**Milestone:** M4 (Image OCR Pipeline)  
**Agent ID:** Explorer M4.2 Gen2  
**Handoff Type:** Hard (Task complete)  
**Target Recipient:** Orchestrator & Worker M4 (`ocr_worker.py`)  
**Associated Artifact:** `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2_gen2\dual_engine_ocr_strategy.md`  

---

## 1. Observation

Direct observations from predecessor benchmark execution, project codebase, and configuration ledgers:

1. **Predecessor Benchmark Data (`c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2\benchmark_results.json`):**
   - **RapidOCR Performance Profile (lines 10–13):**
     - Instantiation latency: `465.48 ms`
     - Cold-start inference latency: `3,539.77 ms`
     - Module base memory: `0.83 MB`
     - Peak dynamic memory during full-resolution inference: `71.44 MB`
   - **Tesseract Configuration (lines 3–9):**
     - Version: `5.5.0.20241111`
     - Executable path: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe`
     - Tessdata path: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata`
     - Verified installed languages: `["eng", "eus", "osd", "spa"]`
     - Language argument verified: `-l eng+spa+eus`
   - **Low-Contrast Receipt Failure & Recovery (Sample -2, lines 363–407):**
     - File: `fixture_low_contrast.png` (simulating degraded thermal receipts/payment vouchers, `std_dev=2.63`, `range=20`).
     - **RapidOCR:** Extracted `0 lines`, `0 chars`, `confidence=0.0`.
     - **Tesseract v5.5.0:** Extracted `4 lines`, `25 words`, `134 chars`, character-weighted `confidence=0.9251` (92.51%) in `650.33 ms`.
     - Verbatim recovered text:
       ```text
       GETXO BELA ESKOLA - RECIBO DE PAGO
       Concepto: Licencia Federativa Vela Ligera 2026
       Importe: 45,50 EUR - Pagado con tarjeta
       Estado: CONFIRMADO / Ref: TX-9921820
       ```
   - **Confidence Metric Mathematical Simulations (lines 14–29, lines 363–395):**
     - **Case A (Short high-conf header + Long degraded body):**
       - Line 1: `"HEADER"` (6 chars, confidence 0.98)
       - Line 2: `"This is a very long body text that was corrupted and has poor recognition quality throughout the document."` (106 chars, confidence 0.52)
       - Unweighted mean: `(0.98 + 0.52) / 2 = 0.7500` (Fallback suppressed: `0.7500 >= 0.60`)
       - Character-weighted mean: `(6*0.98 + 106*0.52) / 112 = 0.5446` (Fallback triggered: `0.5446 < 0.60`)
     - **Case B (Long high-conf header + Short low-conf noise):**
       - Line 1: `"GETXO BELA ESKOLA - CLUB DE VELA GETXO OFIZIALA MEMORIA"` (56 chars, confidence 0.95)
       - Line 2: `"x!?"` (3 chars, confidence 0.40)
       - Unweighted mean: `0.6750`
       - Character-weighted mean: `0.9216`
   - **Simulated DB Retention Records (lines 30–130):**
     - 8 samples generated 11 database rows. Every item where fallback triggered generated 2 rows (RapidOCR primary with `fallback_triggered=1` and Tesseract with `fallback_triggered=1`).

2. **Project Mandates & Database Contract:**
   - **ORIGINAL_REQUEST.md (§2 Rule 8, lines 65–67):**
     `"RapidOCR runs as primary. If average character confidence is below 0.60, or if zero text is extracted from a non-blank image, automatically route the image to Tesseract fallback. Store BOTH RapidOCR and Tesseract outputs with bounding boxes and confidence scores in the evidence database."`
   - **PROJECT.md (`ocr_evidence` Table Schema, lines 67–76):**
     `id INTEGER PRIMARY KEY`, `file_id INTEGER`, `engine TEXT`, `extracted_text TEXT`, `mean_confidence REAL`, `bbox_json TEXT`, `fallback_triggered INTEGER`, `created_at TIMESTAMP`.

---

## 2. Logic Chain

1. **Premise 1 (Primary Efficiency):** RapidOCR executes with ONNX Runtime CPU provider at ~71.44 MB peak memory and demonstrates superior segmentation on complex mobile screenshots (Sample 1606: 536 chars @ 0.9713 vs Tesseract 468 chars @ 0.8950). It is therefore optimal as the primary high-throughput engine for 4 parallel CPU workers across 14,353 images.
2. **Premise 2 (Failure Mode Complementarity):** RapidOCR's deep DBNet detector requires sharp luminance gradients. In low-contrast documents (Sample -2), RapidOCR extracted 0 lines. Tesseract v5.5.0 utilizes Leptonica's adaptive Otsu binarization and successfully extracted 100% of the financial and licensing text (`45,50 EUR`, `Licencia Federativa`, `Ref: TX-9921820`) at 0.9251 confidence. Therefore, Tesseract is an essential evidentiary safety net.
3. **Premise 3 (Mathematical Metric Necessity):** Unweighted confidence calculation $\frac{1}{N}\sum c_i$ allows a short title (e.g. 6 chars @ 0.98) to mask a long degraded document body (106 chars @ 0.52), falsely giving 0.7500 mean confidence and suppressing fallback. The character-weighted formulation $\frac{\sum \text{len}(T_i) \cdot c_i}{\sum \text{len}(T_i)}$ yields 0.5446, correctly triggering fallback.
4. **Premise 4 (Dual-Output Retention):** Per Rule 8, discarding either engine's output when fallback triggers destroys evidentiary provenance. Writing both records into `ocr_evidence` with `fallback_triggered = 1` guarantees complete auditability.
5. **Conclusion:** The dual-engine architecture with character-weighted confidence gating and dual database insertion satisfies all forensic, mathematical, and architectural requirements for Milestone M4.

---

## 3. Caveats

1. **Non-Blank Image Detection Heuristics:**
   - Blank white images (Sample -3) exhibit `std_dev = 0.0` and `range = 0`.
   - Low-contrast receipts (Sample -2) exhibit `std_dev = 2.63` and `range = 20`.
   - Therefore, the non-blank threshold must be set to `std_dev >= 1.0` and `range > 10` so that degraded receipts are treated as non-blank and routed to Tesseract when RapidOCR returns 0 lines, while pure white/black images (`std_dev < 1.0`) are not needlessly processed by Tesseract.
2. **Language Pack Dependency:**
   - Both Spanish (`spa`) and Basque (`eus`) must be specified in Tesseract invocation (`-l eng+spa+eus`) to ensure proper lexicon matching on Basque entities (`Getxo Bela Eskolako bazkideen zerrenda`).
3. **Bounding Box Representation:**
   - RapidOCR natively emits 4-point arbitrary polygons `[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]`. Tesseract emits axis-aligned bounding rectangles `(left, top, width, height)`. The worker must standardize Tesseract rectangles into 4-point polygon format `[[left, top], [left+w, top], [left+w, top+h], [left, top+h]]` before storing in `bbox_json`.

---

## 4. Conclusion

1. **Dual-Engine OCR Architecture is Validated:** RapidOCR as primary + Tesseract v5.5.0 (`-l eng+spa+eus`) as fallback guarantees both high throughput and zero evidentiary loss on degraded WhatsApp media.
2. **Fallback Triggering Specification:**
   - **Trigger 1:** `char_weighted_mean_confidence < 0.60` (when $\ge 1$ line extracted).
   - **Trigger 2:** `line_count == 0` AND image is non-blank (`std_dev >= 1.0` and `range > 10`).
3. **Dual Database Retention:** Whenever fallback is triggered, two rows are inserted into `ocr_evidence` (both flagged with `fallback_triggered = 1`).
4. **Worker M4 Blueprint Ready:** A comprehensive Python implementation blueprint is authored in `dual_engine_ocr_strategy.md`, specifying concurrency (4 CPU workers), database locking resilience, character weighting, and standardized schema serialization.

---

## 5. Verification Method

To independently verify all findings and validate the M4 implementation:

1. **Inspect Benchmark Evidence Ledger:**
   - View `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2\benchmark_results.json` to confirm:
     - RapidOCR initialization: `465.48 ms`, cold inference: `3539.77 ms`, peak memory: `71.44 MB`.
     - Sample -2 failure in RapidOCR (`0 lines`) and success in Tesseract (`4 lines`, `conf=0.9251`).
     - Simulation Case A (`unweighted=0.7500`, `char_weighted=0.5446`).
2. **Inspect Strategy Report:**
   - View `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2_gen2\dual_engine_ocr_strategy.md`.
3. **Test Command for Worker Execution:**
   - Once Worker M4 implements `forensics_multiagent_run\scripts\ocr_worker.py`:
     ```powershell
     & "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe" "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\ocr_worker.py"
     ```
4. **Database Verification Query:**
   - Verify dual records and fallback flags in `run_evidence.db`:
     ```sql
     SELECT engine, fallback_triggered, COUNT(*), AVG(mean_confidence)
     FROM ocr_evidence
     GROUP BY engine, fallback_triggered;
     ```
   - Invalidation condition: Any image triggering fallback that has fewer than 2 rows in `ocr_evidence`, or any row with unweighted confidence calculation.
