# Comprehensive Image Corpus Profile & Format Distribution Report

**Milestone**: M4 — Image OCR Pipeline  
**Investigator**: Explorer M4.1 Gen2 (Image Corpus Profiler & Format Distribution Explorer)  
**Database**: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`  
**Corpus Root**: `c:\Users\User\Desktop\whatsapp_chats_zip`  
**Execution Date**: 2026-10-28 / 2026-10-29  

---

## Executive Summary

A comprehensive, deterministic forensic profiling of all image files registered in the evidence ledger (`run_evidence.db`, table `file_inventory` with `modality = 'IMAGE'`) has been conducted. 

### Key Findings
1. **Total Census**: Exactly **14,561 image files** are inventoried, representing **4,010.88 MB (~3.92 GB)** of physical storage.
   - **14,559 images** are in status `PENDING` and fully eligible for OCR processing in Milestone M4.
   - **2 images** are in status `SKIPPED` (Foreign Wireframe Skull 3D render images outside WhatsApp chat provenance).
   - **0 files** are 0-byte or corrupted.
2. **Format Uniformity**: **99.67% (14,513 files)** are standard baseline JPEG/JFIF. The remainder consists of 26 WEBP (0.18%), 12 PNG (0.08%), and 10 MPO (0.07%, Multi-Picture camera bursts).
3. **100% Structural Integrity**: 
   - All 14,561 files passed structural verification (`Image.open()` + `img.verify()`) with **0 errors**.
   - A deep pixel-decode stress test (`img.load()`) across 1,826 targeted files (all non-JPGs, smallest 100, largest 100, and 1,000 stratified random JPGs) completed with **0 decode errors**.
4. **Resolution Profile**: Median dimensions are **1200x1600 pixels (~1.89 MP)**, corresponding to standard downscaled WhatsApp mobile transmission format. Resolutions range from 202x103 up to 5120x5120 (19.66 MP).
5. **Text Presence & Pipeline Sizing**: Stratified sample analysis indicates **~38.7% of images contain textual content** (receipts, official club notices, bank transfers, chat screenshots, certificates, posters), while **~61.3% are purely photographic / non-textual** (sailing boats, portraits, social snapshots).
6. **Throughput & Wall-Clock Budget**: Using RapidOCR ONNX across 4 parallel CPU worker threads (~14 images/sec aggregate), the complete batch of 14,559 pending images will finish in **approximately 17 to 20 minutes**, requiring minimal Tesseract fallback (~3-5% of text-bearing images).

---

## 1. Inventory Census & Storage Breakdown

All physical images across the WhatsApp directory tree were enumerated, verified against disk stat, and cataloged in `file_inventory`.

| Metric | Exact Count / Measurement | Percentage |
| :--- | :--- | :--- |
| **Total Images in Inventory** | **14,561** | **100.00%** |
| `status = 'PENDING'` (M4 Queue) | 14,559 | 99.986% |
| `status = 'SKIPPED'` (Foreign assets) | 2 | 0.014% |
| `status = 'COMPLETED'` | 0 | 0.00% |
| `status = 'FAILED'` | 0 | 0.00% |
| **Total Data Volume** | **4,010.88 MB (4,205,715,622 bytes)** | — |
| Minimum File Size | 2,858 bytes (~2.79 KB) | — |
| Maximum File Size | 6,332,469 bytes (~6.04 MB) | — |
| Mean File Size | 288,834.3 bytes (~282.06 KB) | — |
| Median File Size | 184,026.0 bytes (~179.71 KB) | — |
| 0-byte Files | **0** | **0.00%** |
| Missing on Disk | **0** | **0.00%** |
| Size Mismatches (DB vs Disk) | **0** | **0.00%** |

### File Size Distribution Brackets

| Size Bracket | Count | Percentage | Cumulative % | Forensic Significance |
| :--- | :--- | :--- | :--- | :--- |
| 0 bytes (empty) | 0 | 0.00% | 0.00% | No truncated or 0-byte corruptions |
| 1 KB - 10 KB | 28 | 0.19% | 0.19% | Small icons, preview stickers |
| 10 KB - 50 KB | 439 | 3.01% | 3.20% | Compressed stickers & low-res thumbnails |
| 50 KB - 100 KB | 2,429 | 16.68% | 19.88% | Mobile compressed screen captures & memes |
| 100 KB - 250 KB | 7,126 | 48.94% | 68.82% | **Primary bulk**: Standard WhatsApp received images |
| 250 KB - 500 KB | 3,114 | 21.39% | 90.21% | High-detail text documents & crisp photos |
| 500 KB - 1 MB | 705 | 4.84% | 95.05% | Large photographic captures |
| 1 MB - 5 MB | 711 | 4.88% | 99.93% | Uncompressed direct camera uploads / HD documents |
| 5 MB - 10 MB | 9 | 0.06% | 100.00% | Multi-megapixel panoramas and raw camera outputs |

---

## 2. Format, Color Space & Container Analysis

The physical container formats and color modes were detected via Pillow header inspections:

```
+-------------------------------------------------------------------------+
|                  FORMAT DISTRIBUTION (14,561 TOTAL)                     |
|                                                                         |
|  JPEG [14,513] (99.67%) ############################################## |
|  WEBP [26]     (0.18%)  |                                               |
|  PNG  [12]     (0.08%)  |                                               |
|  MPO  [10]     (0.07%)  |                                               |
+-------------------------------------------------------------------------+
```

### Format Table

| Format Detected | File Count | Percentage | Color Modes Detected | Notes / Engine Handling |
| :--- | :--- | :--- | :--- | :--- |
| **JPEG** | 14,513 | 99.67% | RGB (14,513) | Standard JFIF/EXIF JPEG. Native support in OpenCV & Pillow. |
| **WEBP** | 26 | 0.18% | RGBA (26) | Animated/static stickers with alpha transparency channel. |
| **PNG** | 12 | 0.08% | RGB (1), RGBA (11) | High-definition document screenshots and logos. |
| **MPO** | 10 | 0.07% | RGB (10) | Multi-Picture Format (burst / dual-camera photos). Pillow transparently decodes primary frame. |

### Color Mode Summary
- **RGB**: 14,524 images (99.75%)
- **RGBA**: 37 images (0.25%) — Requires alpha channel stripping/flattening to RGB before passing to RapidOCR/Tesseract to prevent channel shape mismatch errors.

---

## 3. Directory Taxonomy & Provenance

The 14,561 images originate from five distinct forensic directories:

| Directory Category | Physical Path Snippet | Count | Percentage | Provenance & Evidentiary Role |
| :--- | :--- | :--- | :--- | :--- |
| **WhatsApp Images / Received** | `com.whatsapp/.../WhatsApp Images/` | 9,776 | 67.14% | Inbound media received from all WhatsApp chat contacts and group dialogues. Contains highest concentration of notices, receipts, and club announcements. |
| **WhatsApp Images / Sent** | `com.whatsapp/.../WhatsApp Images/Sent/` | 2,534 | 17.40% | Outbound media uploaded by the device owner (e.g. proof of payment, shared sailing race documents, personal photos). |
| **WhatsApp Images / Private** | `com.whatsapp/.../WhatsApp Images/Private/` | 1,811 | 12.44% | Media marked private or downloaded without adding to public device gallery. Contains sensitive communications and personal documents. |
| **Manual Extraction / Chat Attachments** | `Whatsapp web Extraccion manual.../Descomprimidos` | 438 | 3.01% | Media attachments unpacked directly from WhatsApp Web HTML/zip chat exports. |
| **Manual Extraction / Foreign** | `.../Wireframe Skull/` | 2 | 0.01% | Foreign 3D skull graphic assets unrelated to WhatsApp communication. Already flagged `status = 'SKIPPED'`. |

---

## 4. Dimensionality, Orientation & Resolution Profile

### Aspect Ratio & Orientations

```
Portrait (h > w)  :  8,810 (60.50%)  [Mobile screenshots, upright documents, vertical photos]
Landscape (w > h) :  5,554 (38.14%)  [Desktop screenshots, horizontal document scans, photos]
Square (w == h)   :    197 ( 1.35%)  [Profile photos, square crop icons, logos]
```

### Statistical Summary of Dimensions

| Dimension Attribute | Minimum | 25th Percentile | Median | Mean | 75th Percentile | Maximum |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Width (pixels)** | 202 | 900 | **1,200** | 1,328 | 1,600 | 5,120 |
| **Height (pixels)** | 103 | 1,200 | **1,600** | 1,652 | 1,600 | 5,120 |
| **Megapixels (MP)** | 0.031 MP | 1.44 MP | **1.89 MP** | 2.30 MP | 2.07 MP | 19.66 MP |

### Resolution Brackets

| Megapixel Range | Classification | Count | Percentage | OCR Performance Impact |
| :--- | :--- | :--- | :--- | :--- |
| < 0.1 MP | Thumbnail / Icon | 70 | 0.48% | Ultra-fast (<15ms); text often unreadable if downscaled |
| 0.1 - 0.5 MP | Low Resolution | 390 | 2.68% | Fast (<30ms); legible if large print |
| 0.5 - 1.0 MP | Medium Resolution | 1,126 | 7.73% | Fast (~50ms); standard legible screenshots |
| **1.0 - 2.5 MP** | **Standard WhatsApp Res** | **9,824** | **67.47%** | **Optimal OCR sweet spot (~70ms)**; crisp text & low memory |
| 2.5 - 5.0 MP | High Resolution | 2,217 | 15.23% | High fidelity (~110ms); excellent character definition |
| 5.0 - 12.0 MP | Full Camera Resolution | 720 | 4.94% | Detailed scans (~200ms); high precision |
| > 12.0 MP | Very High Resolution | 214 | 1.47% | Large memory buffers (~350ms); full 4K/panorama images |

### Top 15 Exact Resolutions

| Rank | Exact Dimensions (WxH) | Orientation | Count | Percentage | Typical Origin |
| :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | **1200 x 1600** | Portrait | 1,131 | 7.77% | WhatsApp standard portrait recompression |
| 2 | **1600 x 1200** | Landscape | 823 | 5.65% | WhatsApp standard landscape recompression |
| 3 | **1600 x 1066** | Landscape | 738 | 5.07% | 3:2 camera landscape recompression |
| 4 | **899 x 1599** | Portrait | 642 | 4.41% | Android 16:9 screen capture recompression |
| 5 | **3840 x 2160** | Landscape | 597 | 4.10% | 4K UHD video capture / desktop monitor screenshot |
| 6 | **720 x 1600** | Portrait | 595 | 4.09% | 20:9 mobile device screenshot |
| 7 | **1536 x 2048** | Portrait | 520 | 3.57% | Tablet / 4:3 camera portrait capture |
| 8 | **1080 x 1920** | Portrait | 438 | 3.01% | 1080p Full HD mobile portrait screenshot |
| 9 | **1152 x 2048** | Portrait | 315 | 2.16% | High-res mobile screenshot |
| 10 | **900 x 1600** | Portrait | 300 | 2.06% | 16:9 mobile capture |
| 11 | **2048 x 1536** | Landscape | 296 | 2.03% | Tablet / 4:3 landscape capture |
| 12 | **1500 x 2000** | Portrait | 262 | 1.80% | 4:3 portrait capture |
| 13 | **920 x 2048** | Portrait | 255 | 1.75% | Tall mobile screenshot |
| 14 | **945 x 2048** | Portrait | 250 | 1.72% | Tall mobile screenshot |
| 15 | **1530 x 2040** | Portrait | 249 | 1.71% | High-res document capture |

---

## 5. Text Presence Estimation & Sampling Insights

Based on empirical stratified sampling (150 images across all categories):
- **Images with Detected Text**: **~38.7%** (estimated ~5,630 files out of 14,559).
  - High textual yield categories:
    * *Manual Extraction Chats*: ~68.0% text presence (direct attachments, invoices, bank receipts, official documents).
    * *WhatsApp Images / Received*: ~42.5% text presence (circulars, race schedules, payment notices, screenshots).
    * *WhatsApp Images / Sent*: ~36.7% text presence (outbound proof of payment, shared forms).
- **Images without Detected Text**: **~61.3%** (estimated ~8,929 files out of 14,559).
  - Composed of sailing regatta action shots, nature/scenery photos, family gatherings, personal portraits, and decorative graphics.
- **Estimated Fallback Candidates** (`mean_confidence < 0.60`): **~3.3% of text-bearing images** (~185 - 280 files).
  - Typically caused by motion blur, cursive handwriting on paper slips, extreme angles, or heavy background noise.

---

## 6. Worker M4 Execution Guidelines & Terminal Status Taxonomy

To satisfy **Original Request Rule 4 (Total File Reconciler & Terminal Accounting)** and **Rule 8 (Objective OCR Fallback & Multi-Engine Output Retention)**, Worker M4 must enforce the following unambiguous classification rules.

### Terminal Status Classification Rules

Every one of the 14,559 pending images in `file_inventory` must transition from `status = 'PENDING'` to an exact terminal state:

```
                                  [ Image File ]
                                        |
                         +--------------+--------------+
                         |                             |
                  [ Decode Success ]            [ Decode Fails ]
                         |                             |
               Run RapidOCR (Primary)          status = 'FAILED'
                         |                 terminal_code = 'CORRUPTED_IMAGE'
            +------------+------------+
            |                         |
     [ Text Detected ]          [ No Text ]
            |                         |
     Mean Conf >= 0.60?         status = 'COMPLETED'
       /          \         terminal_code = 'OCR_NO_TEXT'
     YES           NO
     /              \
status = 'COMPLETED'  status = 'COMPLETED'
terminal_code =       terminal_code = 'OCR_FALLBACK_TRIGGERED'
'OCR_SUCCESS'         -> Run Tesseract Fallback
                      -> Retain BOTH outputs in ocr_evidence
```

### Detailed Classification Specification

| Terminal Status Code | Conditions for Transition | `file_inventory` Status | `ocr_evidence` Records Stored |
| :--- | :--- | :--- | :--- |
| **`OCR_SUCCESS`** | RapidOCR detected one or more text lines AND mean character confidence is **>= 0.60**. | `COMPLETED` | 1 record: `engine = 'RAPIDOCR'`, full text, bounding boxes, mean confidence, `fallback_triggered = 0`. |
| **`OCR_FALLBACK_TRIGGERED`** | **Case A**: RapidOCR detected text but mean character confidence is **< 0.60**.<br>**Case B**: RapidOCR returned zero lines, but image has visual text characteristics. | `COMPLETED` | **2 records (Dual-Output Retention)**:<br>1. RapidOCR extract with `fallback_triggered = 1`.<br>2. Tesseract extract (`engine = 'TESSERACT'`) with full text, bounding boxes, and confidence. |
| **`OCR_NO_TEXT`** | RapidOCR detected no text lines AND image is confirmed non-textual (scenic photo, landscape, portrait, icon). | `COMPLETED` | 1 record: `engine = 'RAPIDOCR'`, `extracted_text = ''`, `mean_confidence = 0.0`, `bbox_json = '[]'`, `fallback_triggered = 0`. |
| **`CORRUPTED_IMAGE`** | File cannot be decoded by image parser (`UnidentifiedImageError`, truncated stream, decompression bomb error). | `FAILED` | 0 records in `ocr_evidence`. Error details recorded in `file_inventory.error_message`. *(0 expected)* |
| **`FOREIGN_ASSET_SKIPPED`**| Foreign assets identified in M1 guardrail (Wireframe Skull). | `SKIPPED` | Already set in database. Skipped by OCR worker. |

### Technical Worker Safeguards
1. **Pillow RGBA Flattening**:
   ```python
   if img.mode in ('RGBA', 'LA', 'P'):
       # Create white background and paste RGBA image to prevent ONNX channel dimension error
       bg = Image.new('RGB', img.size, (255, 255, 255))
       bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
       img = bg
   ```
2. **Safe Image Memory Limit**: Set `Image.MAX_IMAGE_PIXELS = None` (or `100_000_000`) to safely handle large 5120x5120 captures without triggering Pillow decompression warnings.
3. **Dual-Output Database Insert**:
   When fallback is triggered, insert both records within a single transaction using parameter bindings to ensure atomic durability.

---

## 7. Performance & Concurrency Sizing

- **Hardware Profile**: ASUS ROG Strix SCAR 16 (Intel Core i9-14900HX, 24C/32T, 32 GB RAM, RTX 4080 Laptop GPU).
- **Worker Allocation**: 4 CPU RapidOCR worker processes + opportunistic Tesseract fallback.
- **Estimated Throughput**: ~14.0 images/sec total (~3.5 images/sec/worker).
- **Total Duration Projection**:
  $$\text{Duration} = \frac{14,559 \text{ images}}{14.0 \text{ img/sec}} \approx 1,040 \text{ seconds} \approx \mathbf{17.3 \text{ minutes}}$$
  With fallback processing on ~200 images, total wall-clock runtime is **bounded within 18 to 22 minutes**.

---

## 8. Conclusion

The image corpus is exceptionally clean, 100% structurally verified, free from zero-byte corruptions, and dominated by standard JPEG WhatsApp transmissions. Worker M4 can execute immediately and safely with 4 parallel CPU processes using the recommended terminal status taxonomy.
