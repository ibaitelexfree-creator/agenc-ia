# Dual-Engine Image OCR Architecture & Forensic Strategy Report
**Milestone M4: Image OCR Pipeline (Feature 10 & Feature 11)**  
**Author:** Explorer M4.2 Gen2 (RapidOCR & Tesseract Dual-Engine Benchmark Explorer)  
**Date:** 2026-10-28 / 2026-10-29  
**Target Ledger:** `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`  
**Reference Benchmark:** `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_2\benchmark_results.json`

---

## 1. Executive Summary & Forensic Context

In forensic digital examinations of mobile communication extractions (specifically WhatsApp media repositories spanning 14,353 images), text extraction cannot rely on an unverified single-engine architecture. WhatsApp images exhibit extreme diversity in degradation, compression artifacts, lighting, typography, and contrast:
- Digital mobile screenshots with dense system fonts, code, URLs, and UI components.
- Photographic captures of physical documents, notices, meeting minutes, and regatta calendars.
- Mobile receipts, invoices, bank transfers, and payment confirmations with low contrast or thermal paper fading.
- Scenic personal photographs and high-entropy background imagery containing no textual data.
- Compressed WebP stickers and graphic memes.

Per **ORIGINAL REQUEST §2 Rule 8** and **PROJECT.md Milestone M4 (Features 10 & 11)**:
> *"RapidOCR runs as primary. If average character confidence is below 0.60, or if zero text is extracted from a non-blank image, automatically route the image to Tesseract fallback. Store BOTH RapidOCR and Tesseract outputs with bounding boxes and confidence scores in the evidence database."*

This report establishes the verified empirical benchmarks, mathematical justification for character-weighted confidence metrics, empirical proof of Tesseract's critical evidentiary necessity on low-contrast documents, and the formal schema specification for **Worker M4** (`ocr_worker.py`).

---

## 2. Comparative Benchmark Results & Performance Profile

The predecessor benchmark evaluation executed identical 3-pass test runs across 8 forensic sample categories using the dedicated project virtual environment (`forensics_multiagent_run\.venv\Scripts\python.exe`).

### 2.1 RapidOCR Profile (Primary Engine)
- **Engine Version & Backend:** `rapidocr-onnxruntime` utilizing ONNX Runtime CPU execution provider (DBNet text detection + SVTR/CRNN text direction classification & recognition models).
- **Initialization Latency:** **465.48 ms** (model graph parsing, ONNX session initialization).
- **Cold-Start First Inference:** **3,539.77 ms** (initial memory buffer allocation and tensor warmup).
- **Base Memory Footprint:** **0.83 MB** (idle module memory).
- **Peak Dynamic Memory Footprint:** **71.44 MB** (during full-resolution multi-line inference).
- **Concurrency Scalability:** At ~71.44 MB peak memory per worker, four parallel CPU workers will consume **< 290 MB RAM**, which is negligible (< 1.6%) on the SCAR 16 workstation profile (31.8 GB physical RAM, ~18–39 GB free).
- **Output Geometry:** 4-point floating-point polygons representing arbitrary rotated text bounding boxes:
  `[[[x1, y1], [x2, y2], [x3, y3], [x4, y4]], "extracted_text", confidence_float]`

### 2.2 Tesseract Profile (Fallback Engine)
- **Binary Executable:** `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe`
- **Tesseract Version:** **5.5.0.20241111** (UB-Mannheim release).
- **Tessdata Directory:** `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata` (configured via `TESSDATA_PREFIX`).
- **Validated Language Packs:**
  - `eng` (English)
  - `spa` (Spanish / Castellano)
  - `eus` (Basque / Euskara)
  - `osd` (Orientation & Script Detection)
- **Invocation Command:** Executed via `pytesseract.image_to_data` with `-l eng+spa+eus` to capture both official languages of the Basque Country (relevant to Getxo Bela Eskola).
- **Confidence Normalization:** Tesseract reports integer confidence scores in the range `[0, 100]`. These are strictly normalized to floating-point `[0.0, 1.0]` by dividing by `100.0`.
- **Bounding Box Standardization:** Tesseract `image_to_data` outputs axis-aligned rectangles (`left`, `top`, `width`, `height`). These are transformed into the identical 4-point polygon format utilized by RapidOCR:
  `[[left, top], [left + width, top], [left + width, top + height], [left, top + height]]`

---

## 3. Head-to-Head Comparative Benchmark Matrix

| Sample ID / File Type | Description | Visual Metrics (StdDev / Range) | RapidOCR Avg Latency | RapidOCR Chars (Conf) | Tesseract Avg Latency | Tesseract Chars (Conf) | Fallback Triggered | Evidentiary Outcome |
|---|---|---|---|---|---|---|---|---|
| **1606** (Screenshot) | Mobile StackExchange UI / technical text | `std_dev=95.71`<br>`range=255` (Non-blank) | 2,699.38 ms | 536 chars<br>(**0.9713**) | 1,926.00 ms | 468 chars<br>(0.8950) | **0 (No)** | RapidOCR accurately segmented all 31 dense UI text lines including URLs and units (`3.3V`, `6Kohm`). |
| **1607** (Schedule Photo) | Club regatta calendar / tabular document | `std_dev=68.26`<br>`range=255` (Non-blank) | 2,391.23 ms | 282 chars<br>(**0.9777**) | 1,215.71 ms | 249 chars<br>(0.9160) | **0 (No)** | RapidOCR preserved dates (`8`, `15`, `22`) and club names (`Trofeo Erecacho RCMA RSC`, `LIGA AMISTOSA GETXO BELA ESK`). |
| **1610** (Scenic Photo) | WhatsApp scenic/nature photograph | `std_dev=69.90`<br>`range=255` (Non-blank) | 1,586.62 ms | 0 chars<br>(0.0000) | 753.36 ms | 0 chars<br>(0.0000) | **1 (Yes)**<br>*(ZERO_TEXT_ON_NON_BLANK)* | Both engines returned 0 lines. Dual rows preserved to forensically prove no hidden text was missed. |
| **17554** (WebP Sticker) | Graphic WhatsApp chat sticker | `std_dev=64.26`<br>`range=252` (Non-blank) | 284.37 ms | 0 chars<br>(0.0000) | 529.41 ms | 0 chars<br>(0.0000) | **1 (Yes)**<br>*(ZERO_TEXT_ON_NON_BLANK)* | Both engines verified 0 text. Validated WebP format compatibility in both engines. |
| **-1** (Clear Synthetic) | Spanish & Basque forensic club document | `std_dev=52.75`<br>`range=255` (Non-blank) | 785.67 ms | 198 chars<br>(**0.9798**) | 847.69 ms | 198 chars<br>(0.9265) | **0 (No)** | Both engines achieved 100% character recovery for CIF `G48923412`, IBAN `ES04...`, and Basque text. |
| **-2** (Low-Contrast Receipt) | Degraded receipt/invoice payment confirmation | `std_dev=2.63`<br>`range=20` (Low contrast) | 382.56 ms | **0 chars**<br>(**0.0000** - FAILED) | 650.33 ms | **134 chars**<br>(**0.9251** - SUCCESS) | **1 (Yes)**<br>*(ZERO_TEXT_ON_NON_BLANK / LOW_CONF)* | **CRITICAL DISCOVERY:** RapidOCR failed completely (0 lines). Tesseract recovered 4 full lines of financial evidence! |
| **-3** (Blank White) | Uniform 0-variance white image | `std_dev=0.00`<br>`range=0` (Blank) | 410.48 ms | 0 chars<br>(0.0000) | 485.10 ms | 0 chars<br>(0.0000) | **0 (No)** | Pre-check correctly classified image as blank (`std_dev < 1.0`). No spurious fallback triggered. |
| **-4** (Synthetic Noise) | High-entropy random pixel distribution | `std_dev=28.96`<br>`range=146` (Non-blank) | 212.63 ms | 0 chars<br>(0.0000) | 663.66 ms | 0 chars<br>(0.0000) | **1 (Yes)**<br>*(ZERO_TEXT_ON_NON_BLANK)* | Visual metrics flagged non-blank content; dual verification confirmed 0 text artifacts. |

---

## 4. Mathematical Rigor: Character-Weighted Mean Confidence

### 4.1 The Forensic Vulnerability of Unweighted Mean Confidence
A conventional unweighted arithmetic mean computes:
$$\mu_{\text{unweighted}} = \frac{1}{N} \sum_{i=1}^{N} c_i$$
where $N$ is the number of detected bounding boxes/lines and $c_i$ is the confidence of line $i$.

In digital forensics, this unweighted metric creates a catastrophic vulnerability: **a short, highly legible text element (such as a large title or header) will mask a heavily degraded, low-confidence body.**

### 4.2 Mathematical Formulation of Character-Weighted Mean
The objective character-weighted confidence is formulated as:
$$\mu_{\text{char\_weighted}} = \frac{\sum_{i=1}^{N} \left( \text{length}(T_i) \times c_i \right)}{\sum_{i=1}^{N} \text{length}(T_i)}$$
where $T_i$ is the text string extracted for line $i$, $\text{length}(T_i)$ is the character count (excluding trailing whitespace), and $c_i \in [0.0, 1.0]$.

### 4.3 Simulation Proofs (Empirically Validated)

#### Case A: Short High-Confidence Header + Long Degraded Body
- **Line 1 (Header):** `"HEADER"` (6 characters), confidence $c_1 = 0.98$
- **Line 2 (Body):** `"This is a very long body text that was corrupted and has poor recognition quality throughout the document."` (106 characters), confidence $c_2 = 0.52$

$$\mu_{\text{unweighted}} = \frac{0.98 + 0.52}{2} = 0.7500 \quad (> 0.60 \implies \mathbf{FALLBACK\ SUPPRESSED!})$$
$$\mu_{\text{char\_weighted}} = \frac{(6 \times 0.98) + (106 \times 0.52)}{6 + 106} = \frac{5.88 + 55.12}{112} = \frac{61.00}{112} \approx \mathbf{0.5446} \quad (< 0.60 \implies \mathbf{FALLBACK\ TRIGGERED!})$$

- **Forensic Impact:** The unweighted metric allows a 6-character header to disguise 106 corrupted characters, falsely rating the document as 75% confident and abandoning fallback. The character-weighted metric correctly identifies that 94.6% of the document content is substandard ($0.5446 < 0.60$), triggering Tesseract fallback.

#### Case B: Long High-Confidence Document + Short Low-Confidence Noise
- **Line 1 (Body):** `"GETXO BELA ESKOLA - CLUB DE VELA GETXO OFIZIALA MEMORIA"` (56 characters), confidence $c_1 = 0.95$
- **Line 2 (Artifact):** `"x!?"` (3 characters), confidence $c_2 = 0.40$

$$\mu_{\text{unweighted}} = \frac{0.95 + 0.40}{2} = 0.6750$$
$$\mu_{\text{char\_weighted}} = \frac{(56 \times 0.95) + (3 \times 0.40)}{56 + 3} = \frac{53.20 + 1.20}{59} = \frac{54.40}{59} \approx \mathbf{0.9220}$$

- **Forensic Impact:** The character-weighted metric prevents a tiny 3-character noise glitch at the margin from distorting an otherwise pristine 56-character official record.

---

## 5. Critical Evidentiary Discovery: Low-Contrast Receipt Breakdown

### 5.1 The Empirical Finding
During the benchmark of sample `fixture_low_contrast.png` (simulating low-contrast thermal receipts, faded invoices, and poor-lighting document photographs common in WhatsApp attachments):
- **RapidOCR Performance:**
  - Detection lines found: **0**
  - Text extracted: `""`
  - Confidence: `0.0000`
  - **Result: Complete failure.** RapidOCR's DBNet segmentation threshold did not detect any text polygons against the low luminance contrast ($\text{std\_dev} = 2.63$).
- **Tesseract v5.5.0 Performance:**
  - Detected words: **25 words across 4 lines**
  - Character count: **134 characters**
  - Character-weighted confidence: **0.9251** (92.51%)
  - Execution time: **650.33 ms**
  - **Extracted Text:**
    ```text
    GETXO BELA ESKOLA - RECIBO DE PAGO
    Concepto: Licencia Federativa Vela Ligera 2026
    Importe: 45,50 EUR - Pagado con tarjeta
    Estado: CONFIRMADO / Ref: TX-9921820
    ```

### 5.2 Algorithmic Cause
- **RapidOCR:** Relies on deep convolutional neural networks (DBNet) trained predominantly on standard scene text and document benchmarks with distinct edge gradients. When contrast falls below the feature activation threshold, the binarized probability map yields zero polygon contours.
- **Tesseract 5.5.0:** Combines Leptonica's classical adaptive Otsu thresholding and morphological filters with LSTM line recognition. Even with minimal grayscale variance, Otsu local thresholding successfully isolates character glyphs, allowing the LSTM neural net to decode the text with >92% confidence.

### 5.3 Forensic Significance
In an investigation examining financial contributions, federation licenses, and membership dues for *Getxo Bela Eskola*, dropping this receipt would mean losing direct proof of payment (`Importe: 45,50 EUR`, `Ref: TX-9921820`). **This finding empirically validates Rule 8: a single-engine OCR pipeline would have caused permanent evidentiary loss.**

---

## 6. Fallback Triggering Rules & Dual-Output Retention Protocol

### 6.1 Objective Trigger Conditions (Rule 8)
A given image file must trigger Tesseract fallback processing if and only if:
1. **Low Confidence:** RapidOCR extracts at least one line ($N \ge 1$), but the character-weighted mean confidence is below threshold:
   $$\mu_{\text{char\_weighted}} < 0.60$$
2. **Completeness Failure (Zero Text on Non-Blank Image):** RapidOCR extracts zero lines ($N = 0$), but image visual analysis confirms the image is non-blank:
   $$\text{std\_dev} \ge 1.0 \quad \text{and} \quad \text{range} > 10$$
   *(Images with $\text{std\_dev} < 1.0$ or $\text{range} \le 10$ are verified pure white, black, or uniform backgrounds and do not trigger fallback).*

### 6.2 Dual-Output Retention Specification
Whenever fallback is triggered, the system must retain **both** interpretations in `ocr_evidence`:
- **Row 1 (Primary - RapidOCR):**
  - `file_id`: Target image ID
  - `engine`: `'RAPIDOCR'`
  - `extracted_text`: RapidOCR result string (or `""` if zero lines)
  - `mean_confidence`: Calculated character-weighted confidence (or `0.0`)
  - `bbox_json`: JSON string of RapidOCR bounding boxes
  - `fallback_triggered`: `1`
- **Row 2 (Fallback - Tesseract):**
  - `file_id`: Target image ID
  - `engine`: `'TESSERACT'`
  - `extracted_text`: Tesseract result string
  - `mean_confidence`: Calculated character-weighted confidence normalized to `[0.0, 1.0]`
  - `bbox_json`: JSON string of standardized 4-point bounding polygons
  - `fallback_triggered`: `1`

*Note: If fallback is NOT triggered, only Row 1 is inserted with `fallback_triggered = 0`.*

---

## 7. Standard Schema Representation for Worker M4

The schema contract defined in `PROJECT.md` for `ocr_evidence` is strictly adhered to:

```sql
CREATE TABLE IF NOT EXISTS ocr_evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER REFERENCES file_inventory(file_id),
    engine TEXT NOT NULL,                -- 'RAPIDOCR' or 'TESSERACT'
    extracted_text TEXT,                 -- Normalized UTF-8 string with '\n' per line
    mean_confidence REAL,                -- Normalized float [0.0, 1.0] (character-weighted)
    bbox_json TEXT,                      -- JSON list of [[[x1,y1],[x2,y2],[x3,y3],[x4,y4]], text, confidence]
    fallback_triggered INTEGER DEFAULT 0,-- 0 = primary accepted, 1 = fallback triggered (dual entry)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ocr_evidence_file_id ON ocr_evidence(file_id);
CREATE INDEX IF NOT EXISTS idx_ocr_evidence_engine ON ocr_evidence(engine);
CREATE INDEX IF NOT EXISTS idx_ocr_evidence_fallback ON ocr_evidence(fallback_triggered);
```

### 7.1 Field Definitions & Normalization Rules
1. **`extracted_text`**:
   - Stripped of leading/trailing document whitespace.
   - Text lines joined with single newline `\n`.
   - UTF-8 clean encoding with preserved accents (e.g., `ñ`, `á`, `é`, Basque characters).
2. **`mean_confidence`**:
   - Floating point strictly bounded in $[0.0, 1.0]$, rounded to 4 decimal places.
   - If no text extracted, exactly `0.0`.
   - Always character-weighted.
3. **`bbox_json`**:
   - Valid JSON array string representing lines/words.
   - Standard 4-point polygon format:
     ```json
     [
       [
         [[left, top], [right, top], [right, bottom], [left, bottom]],
         "text content",
         0.9653
       ]
     ]
     ```

---

## 8. Worker M4 Architecture & Implementation Blueprint

Worker M4 (`ocr_worker.py`) should be implemented following the robust reference architecture below.

### 8.1 Concurrency & Execution Model
- **Worker Concurrency:** 4 CPU workers using `multiprocessing` or `concurrent.futures.ProcessPoolExecutor`.
- **Database Safety:** Each worker creates its own SQLite connection to `run_evidence.db` with `timeout=60.0` and `PRAGMA busy_timeout=60000;`. WAL mode ensures concurrent readers and serialized atomic writes.
- **Batch Processing:** Images retrieved from `file_inventory WHERE modality = 'IMAGE' AND status = 'PENDING'` in chunks of 100 with atomic status claiming (`status = 'PROCESSING'`).

### 8.2 Production Python Blueprint for `ocr_worker.py`

```python
"""
OCR Worker Pipeline (Milestone M4)
Dual-Engine RapidOCR primary with Tesseract fallback and dual-output retention.
"""
import os
import sys
import time
import json
import sqlite3
import numpy as np
from PIL import Image, ImageStat
import pytesseract
from rapidocr_onnxruntime import RapidOCR

# Environment configuration
DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
TESSERACT_EXE = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe"
TESSDATA_DIR = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_EXE
os.environ["TESSDATA_PREFIX"] = TESSDATA_DIR

def is_image_non_blank(img_path: str) -> bool:
    """Fast luminance variance check to detect blank images."""
    try:
        with Image.open(img_path) as img:
            img_gray = img.convert("L")
            stat = ImageStat.Stat(img_gray)
            std_dev = stat.stddev[0]
            extrema = img_gray.getextrema()
            range_val = extrema[1] - extrema[0]
            return bool((std_dev >= 1.0) and (range_val > 10))
    except Exception:
        return True

def run_rapidocr(ocr_instance: RapidOCR, img_path: str):
    """Executes RapidOCR and computes character-weighted confidence."""
    lines, scores, bboxes = [], [], []
    char_weighted_sum, total_chars = 0.0, 0
    
    try:
        res, _ = ocr_instance(img_path)
    except Exception:
        res = None

    if res:
        for item in res:
            box = item[0]  # [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
            txt = str(item[1]).strip()
            score = float(item[2])
            if txt:
                lines.append(txt)
                scores.append(score)
                n = len(txt)
                total_chars += n
                char_weighted_sum += (score * n)
                bboxes.append([box, txt, round(score, 4)])

    extracted_text = "\n".join(lines)
    char_weighted_conf = (char_weighted_sum / total_chars) if total_chars > 0 else 0.0

    return {
        "engine": "RAPIDOCR",
        "extracted_text": extracted_text,
        "line_count": len(lines),
        "mean_confidence": round(char_weighted_conf, 4),
        "bbox_json": json.dumps(bboxes, ensure_ascii=False)
    }

def run_tesseract(img_path: str, lang: str = "eng+spa+eus"):
    """Executes Tesseract fallback with standardized polygon boxes."""
    lines_dict = {}
    char_weighted_sum, total_chars = 0.0, 0
    bboxes = []

    try:
        with Image.open(img_path) as pil_img:
            if pil_img.mode not in ("RGB", "L"):
                pil_img = pil_img.convert("RGB")
            data = pytesseract.image_to_data(pil_img, lang=lang, output_type=pytesseract.Output.DICT)
    except Exception:
        return {
            "engine": "TESSERACT",
            "extracted_text": "",
            "mean_confidence": 0.0,
            "bbox_json": "[]"
        }

    n_items = len(data["text"])
    for i in range(n_items):
        txt = str(data["text"][i]).strip()
        conf = float(data["conf"][i])
        if conf >= 0 and txt:
            norm_conf = conf / 100.0
            n = len(txt)
            total_chars += n
            char_weighted_sum += (norm_conf * n)

            x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
            poly_box = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
            bboxes.append([poly_box, txt, round(norm_conf, 4)])

            line_key = (data["block_num"][i], data["par_num"][i], data["line_num"][i])
            if line_key not in lines_dict:
                lines_dict[line_key] = []
            lines_dict[line_key].append(txt)

    extracted_lines = [" ".join(words) for words in lines_dict.values()]
    extracted_text = "\n".join(extracted_lines)
    char_weighted_conf = (char_weighted_sum / total_chars) if total_chars > 0 else 0.0

    return {
        "engine": "TESSERACT",
        "extracted_text": extracted_text,
        "mean_confidence": round(char_weighted_conf, 4),
        "bbox_json": json.dumps(bboxes, ensure_ascii=False)
    }

def process_single_image(file_id: int, abs_path: str, ocr_instance: RapidOCR, conn: sqlite3.Connection):
    """Processes image per Rule 8 logic and executes atomic dual-retention writes."""
    rapid_res = run_rapidocr(ocr_instance, abs_path)
    non_blank = is_image_non_blank(abs_path)

    # Rule 8 Fallback Condition:
    is_conf_fail = (rapid_res["line_count"] > 0 and rapid_res["mean_confidence"] < 0.60)
    is_zero_fail = (rapid_res["line_count"] == 0 and non_blank)
    fallback_triggered = 1 if (is_conf_fail or is_zero_fail) else 0

    cur = conn.cursor()
    # Insert Primary RapidOCR record
    cur.execute("""
        INSERT INTO ocr_evidence (file_id, engine, extracted_text, mean_confidence, bbox_json, fallback_triggered)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (file_id, "RAPIDOCR", rapid_res["extracted_text"], rapid_res["mean_confidence"], rapid_res["bbox_json"], fallback_triggered))

    # If fallback triggered, execute Tesseract and insert dual record
    if fallback_triggered:
        tess_res = run_tesseract(abs_path, lang="eng+spa+eus")
        cur.execute("""
            INSERT INTO ocr_evidence (file_id, engine, extracted_text, mean_confidence, bbox_json, fallback_triggered)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (file_id, "TESSERACT", tess_res["extracted_text"], tess_res["mean_confidence"], tess_res["bbox_json"], 1))

    # Mark file terminal status
    cur.execute("UPDATE file_inventory SET status = 'COMPLETED', terminal_code = 'OCR_COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE file_id = ?", (file_id,))
    conn.commit()
```

---

## 9. Conclusion & Actionable Next Steps

1. **Rule 8 Dual-Engine Mandate is Fully Validated:** Both benchmark data and theoretical proofs demonstrate that RapidOCR and Tesseract complement each other's failure modes.
2. **Empirical Receipt Recovery Confirmed:** Tesseract fallback saved 100% of the financial and licensing text on low-contrast documents where RapidOCR returned 0 characters.
3. **Character-Weighted Confidence is Mathematically Necessary:** Unweighted means falsely suppress fallback on degraded bodies preceded by high-confidence headers.
4. **Handoff to Worker M4:** The pipeline architecture, geometry standardization, and database contracts are complete and ready for execution.
