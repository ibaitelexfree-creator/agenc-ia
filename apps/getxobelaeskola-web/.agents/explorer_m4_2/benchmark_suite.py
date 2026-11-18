import sys
import os
import time
import json
import sqlite3
import tracemalloc
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageStat

# Ensure UTF-8 output encoding on Windows console
sys.stdout.reconfigure(encoding='utf-8')

# Paths
VENV_PYTHON = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe"
TESSERACT_EXE = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe"
TESSDATA_DIR = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata"
DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

# Configure Tesseract
import pytesseract
pytesseract.pytesseract.tesseract_cmd = TESSERACT_EXE
os.environ["TESSDATA_PREFIX"] = TESSDATA_DIR

# Import RapidOCR
from rapidocr_onnxruntime import RapidOCR

print("=" * 80)
print("EXPLORER M4.2 - DUAL-ENGINE OCR BENCHMARK & EVALUATION SUITE")
print("=" * 80)

# 1. Environment & Engine Verification
tess_ver = pytesseract.get_tesseract_version()
tess_langs = pytesseract.get_languages()
print(f"[*] Tesseract version: {tess_ver}")
print(f"[*] Tesseract available languages: {tess_langs}")
assert "eng" in tess_langs, "Missing eng"
assert "spa" in tess_langs, "Missing spa"
assert "eus" in tess_langs, "Missing eus"
print("[+] Tesseract configuration and language pack verification: PASS (eng, spa, eus all present)")

# 2. Synthetic Test Images Generation
os.makedirs("test_fixtures", exist_ok=True)

# Fixture A: Clear High-Contrast Multi-line Text
img_clear = Image.new("RGB", (800, 300), color=(255, 255, 255))
d = ImageDraw.Draw(img_clear)
try:
    font = ImageFont.load_default(size=24)
except Exception:
    font = ImageFont.load_default()
d.text((30, 30), "GETXO BELA ESKOLA - CLUB DE VELA", fill=(0, 0, 0), font=font)
d.text((30, 80), "Acta de Junta Directiva - 28 de Octubre 2026", fill=(0, 0, 0), font=font)
d.text((30, 130), "Cuota anual socios: 150.00 EUR / IBAN: ES04 2100 1550 2102", fill=(0, 0, 0), font=font)
d.text((30, 180), "Euskara: Bela Eskolako bazkideen zerrenda ofiziala", fill=(0, 0, 0), font=font)
d.text((30, 230), "CIF: G48923412 - Registro de Entidades Deportivas", fill=(0, 0, 0), font=font)
fixture_clear_path = os.path.abspath("test_fixtures/fixture_clear.png")
img_clear.save(fixture_clear_path)

# Fixture B: Low-contrast, noisy, blurred text (designed to stress confidence)
img_low_contrast = Image.new("RGB", (800, 300), color=(180, 180, 175))
d = ImageDraw.Draw(img_low_contrast)
d.text((30, 30), "GETXO BELA ESKOLA - RECIBO DE PAGO", fill=(160, 160, 155), font=font)
d.text((30, 80), "Concepto: Licencia Federativa Vela Ligera 2026", fill=(155, 155, 150), font=font)
d.text((30, 130), "Importe: 45,50 EUR - Pagado con tarjeta", fill=(160, 160, 155), font=font)
d.text((30, 180), "Estado: CONFIRMADO / Ref: TX-9921820", fill=(158, 158, 152), font=font)
img_low_contrast = img_low_contrast.filter(ImageFilter.GaussianBlur(radius=1.2))
fixture_low_path = os.path.abspath("test_fixtures/fixture_low_contrast.png")
img_low_contrast.save(fixture_low_path)

# Fixture C: Completely Blank White Image
img_blank = Image.new("RGB", (600, 400), color=(255, 255, 255))
fixture_blank_path = os.path.abspath("test_fixtures/fixture_blank.png")
img_blank.save(fixture_blank_path)

# Fixture D: Random Noise (Non-blank image with NO text)
np.random.seed(42)
noise_arr = np.random.randint(50, 200, (400, 600, 3), dtype=np.uint8)
img_noise = Image.fromarray(noise_arr)
fixture_noise_path = os.path.abspath("test_fixtures/fixture_noise.png")
img_noise.save(fixture_noise_path)

print("[+] Synthetic test fixtures generated successfully in test_fixtures/")

# 3. Fetch exact paths from database for corpus candidates
conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

def get_path_for_id(fid):
    cur.execute("SELECT abs_path FROM file_inventory WHERE file_id = ?", (fid,))
    r = cur.fetchone()
    return r['abs_path'] if r else None

corpus_samples = [
    {
        "type": "high_quality_screenshot",
        "file_id": 1606,
        "path": get_path_for_id(1606),
        "description": "Mobile screen capture with dense UI and code/URL text (StackExchange)"
    },
    {
        "type": "schedule_document_photo",
        "file_id": 1607,
        "path": get_path_for_id(1607),
        "description": "Document/calendar schedule photo with tabular layout"
    },
    {
        "type": "camera_photo_non_text",
        "file_id": 1610,
        "path": get_path_for_id(1610),
        "description": "Personal/scenic WhatsApp photograph without structured text"
    },
    {
        "type": "webp_sticker",
        "file_id": 17554,
        "path": get_path_for_id(17554),
        "description": "WhatsApp WebP sticker asset"
    },
    {
        "type": "synthetic_clear",
        "file_id": -1,
        "path": fixture_clear_path,
        "description": "Synthetic multi-line forensic club text (Spanish/Basque)"
    },
    {
        "type": "synthetic_low_contrast",
        "file_id": -2,
        "path": fixture_low_path,
        "description": "Synthetic degraded low-contrast text for fallback triggering"
    },
    {
        "type": "synthetic_blank",
        "file_id": -3,
        "path": fixture_blank_path,
        "description": "Synthetic pure white 0-variance image"
    },
    {
        "type": "synthetic_noise",
        "file_id": -4,
        "path": fixture_noise_path,
        "description": "Synthetic high-entropy noise with 0 text"
    }
]
conn.close()

# Verify all paths exist
for s in corpus_samples:
    assert s["path"] and os.path.exists(s["path"]), f"Path does not exist: {s['path']}"
print("[+] All 8 candidate samples verified existing on disk.")

# Helper function for Image Non-Blank Completeness Heuristic
def is_image_non_blank(img_path: str) -> dict:
    """
    Forensic image completeness check:
    Determines if an image contains visual content (non-blank) or is pure white/black/uniform.
    Uses standard deviation of grayscale luminance and min/max range.
    """
    with Image.open(img_path) as img:
        img_gray = img.convert("L")
        stat = ImageStat.Stat(img_gray)
        std_dev = stat.stddev[0]
        extrema = img_gray.getextrema()
        range_val = extrema[1] - extrema[0]
        w, h = img.size
        # Non-blank criterion: standard deviation > 3.0 and range > 15
        is_non_blank = bool((std_dev > 3.0) and (range_val > 15))
        return {
            "width": w,
            "height": h,
            "std_dev": round(float(std_dev), 2),
            "range": int(range_val),
            "is_non_blank": is_non_blank
        }

# Helper function for RapidOCR Execution
def run_rapidocr(ocr_instance: RapidOCR, img_path: str) -> dict:
    t0 = time.perf_counter()
    res, elapse = ocr_instance(img_path)
    total_ms = (time.perf_counter() - t0) * 1000.0

    lines = []
    char_weighted_sum = 0.0
    total_chars = 0
    scores = []
    bboxes = []

    if res:
        for item in res:
            box = item[0]  # [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
            txt = str(item[1]).strip()
            score = float(item[2])
            lines.append(txt)
            scores.append(score)
            n_chars = len(txt)
            total_chars += n_chars
            char_weighted_sum += (score * n_chars)
            bboxes.append([box, txt, round(score, 4)])

    extracted_text = "\n".join(lines)
    unweighted_mean = float(np.mean(scores)) if scores else 0.0
    char_weighted_mean = (char_weighted_sum / total_chars) if total_chars > 0 else 0.0

    return {
        "engine": "RAPIDOCR",
        "total_ms": round(total_ms, 2),
        "det_ms": round(elapse[0] * 1000.0, 2) if elapse else 0.0,
        "cls_ms": round(elapse[1] * 1000.0, 2) if elapse else 0.0,
        "rec_ms": round(elapse[2] * 1000.0, 2) if elapse else 0.0,
        "line_count": len(lines),
        "total_chars": total_chars,
        "unweighted_mean_confidence": round(unweighted_mean, 4),
        "char_weighted_mean_confidence": round(char_weighted_mean, 4),
        "extracted_text": extracted_text,
        "bbox_count": len(bboxes),
        "bbox_json": json.dumps(bboxes, ensure_ascii=False)
    }

# Helper function for Tesseract Execution
def run_tesseract(img_path: str, lang: str = "eng+spa+eus") -> dict:
    t0 = time.perf_counter()
    with Image.open(img_path) as pil_img:
        if pil_img.mode not in ("RGB", "L"):
            pil_img = pil_img.convert("RGB")
        data = pytesseract.image_to_data(pil_img, lang=lang, output_type=pytesseract.Output.DICT)
    total_ms = (time.perf_counter() - t0) * 1000.0

    words = []
    char_weighted_sum = 0.0
    total_chars = 0
    scores = []
    bboxes = []

    lines_dict = {}
    n_items = len(data["text"])
    for i in range(n_items):
        txt = str(data["text"][i]).strip()
        conf = float(data["conf"][i])
        if conf >= 0 and txt:
            norm_conf = conf / 100.0
            words.append(txt)
            scores.append(norm_conf)
            n_c = len(txt)
            total_chars += n_c
            char_weighted_sum += (norm_conf * n_c)

            # Standardized 4-point polygon bbox: [[x, y], [x+w, y], [x+w, y+h], [x, y+h]]
            x = data["left"][i]
            y = data["top"][i]
            w = data["width"][i]
            h = data["height"][i]
            poly_box = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
            bboxes.append([poly_box, txt, round(norm_conf, 4)])

            line_key = (data["block_num"][i], data["par_num"][i], data["line_num"][i])
            if line_key not in lines_dict:
                lines_dict[line_key] = []
            lines_dict[line_key].append(txt)

    extracted_lines = [" ".join(line_words) for line_words in lines_dict.values()]
    extracted_text = "\n".join(extracted_lines)
    unweighted_mean = float(np.mean(scores)) if scores else 0.0
    char_weighted_mean = (char_weighted_sum / total_chars) if total_chars > 0 else 0.0

    return {
        "engine": "TESSERACT",
        "lang": lang,
        "total_ms": round(total_ms, 2),
        "word_count": len(words),
        "line_count": len(extracted_lines),
        "total_chars": total_chars,
        "unweighted_mean_confidence": round(unweighted_mean, 4),
        "char_weighted_mean_confidence": round(char_weighted_mean, 4),
        "extracted_text": extracted_text,
        "bbox_count": len(bboxes),
        "bbox_json": json.dumps(bboxes, ensure_ascii=False)
    }

# 4. Benchmark Memory & Initialization
print("\n[*] Benchmarking Memory and Initialization...")
tracemalloc.start()
mem_before = tracemalloc.get_traced_memory()[0] / (1024 * 1024)

t_init0 = time.perf_counter()
ocr = RapidOCR()
t_init = (time.perf_counter() - t_init0) * 1000.0

# Cold-start warmup run on fixture
t_cold0 = time.perf_counter()
_res, _ = ocr(fixture_clear_path)
t_cold = (time.perf_counter() - t_cold0) * 1000.0

mem_after = tracemalloc.get_traced_memory()[0] / (1024 * 1024)
peak_mem = tracemalloc.get_traced_memory()[1] / (1024 * 1024)
tracemalloc.stop()

print(f"  RapidOCR class instantiation time: {t_init:.2f} ms")
print(f"  RapidOCR cold inference time: {t_cold:.2f} ms")
print(f"  RapidOCR base memory footprint: {mem_after - mem_before:.2f} MB (Peak during inference: {peak_mem:.2f} MB)")

# 5. Multi-run Throughput Benchmark across Samples
results = []
print("\n[*] Executing Multi-Sample Comparative OCR Benchmarks...")

for sample in corpus_samples:
    path = sample["path"]
    sample_type = sample["type"]
    desc = sample["description"]
    print(f"\n---> Testing Sample: {sample_type} ({desc})")
    print(f"     Path: {path}")

    # Blank check
    blank_meta = is_image_non_blank(path)
    print(f"     Visual Check: {blank_meta['width']}x{blank_meta['height']}, std_dev={blank_meta['std_dev']}, non_blank={blank_meta['is_non_blank']}")

    # Measure RapidOCR throughput (3 iterations)
    rapid_runs = []
    for _ in range(3):
        rapid_runs.append(run_rapidocr(ocr, path))
    rapid_res = rapid_runs[0]
    rapid_avg_ms = float(np.mean([r["total_ms"] for r in rapid_runs]))
    rapid_res["avg_ms"] = round(rapid_avg_ms, 2)

    print(f"     [RapidOCR]  AvgTime: {rapid_avg_ms:6.1f} ms | Lines: {rapid_res['line_count']:3d} | Chars: {rapid_res['total_chars']:4d} | CharConf: {rapid_res['char_weighted_mean_confidence']:.4f}")

    # Fallback Trigger Evaluation
    # Rule: Triggered when RapidOCR output fails confidence (< 0.60) OR completeness checks (blank non-empty images where text is suspected)
    is_conf_failure = (rapid_res["line_count"] > 0 and rapid_res["char_weighted_mean_confidence"] < 0.60)
    is_completeness_failure = (rapid_res["line_count"] == 0 and blank_meta["is_non_blank"])
    fallback_triggered = 1 if (is_conf_failure or is_completeness_failure) else 0

    trigger_reason = "NONE"
    if is_conf_failure:
        trigger_reason = "CONFIDENCE_BELOW_0.60"
    elif is_completeness_failure:
        trigger_reason = "ZERO_TEXT_ON_NON_BLANK"

    print(f"     [Decision]  ConfFail={is_conf_failure}, CompletenessFail={is_completeness_failure} => FallbackTriggered={fallback_triggered} (Reason: {trigger_reason})")

    # Measure Tesseract throughput (3 iterations)
    tess_runs = []
    for _ in range(3):
        tess_runs.append(run_tesseract(path, lang="eng+spa+eus"))
    tess_res = tess_runs[0]
    tess_avg_ms = float(np.mean([r["total_ms"] for r in tess_runs]))
    tess_res["avg_ms"] = round(tess_avg_ms, 2)

    print(f"     [Tesseract] AvgTime: {tess_avg_ms:6.1f} ms | Lines: {tess_res['line_count']:3d} | Chars: {tess_res['total_chars']:4d} | CharConf: {tess_res['char_weighted_mean_confidence']:.4f}")

    sample_summary = {
        "sample": sample,
        "visual_metrics": blank_meta,
        "fallback_triggered": fallback_triggered,
        "trigger_reason": trigger_reason,
        "rapidocr": rapid_res,
        "tesseract": tess_res
    }
    results.append(sample_summary)

# 6. Character Confidence Multi-line Calculation Test
print("\n" + "=" * 80)
print("CHARACTER CONFIDENCE MULTI-LINE ANALYSIS & SIMULATION")
print("=" * 80)
sim_cases = [
    {
        "name": "Case A: Short high-conf header + Long low-conf body",
        "lines": [
            ("HEADER", 0.98), # 6 chars
            ("This is a very long body text that was corrupted and has poor recognition quality throughout the document.", 0.52) # 106 chars
        ]
    },
    {
        "name": "Case B: Long high-conf header + Short low-conf noise",
        "lines": [
            ("GETXO BELA ESKOLA - CLUB DE VELA GETXO OFIZIALA MEMORIA", 0.95), # 56 chars
            ("x!?", 0.40) # 3 chars
        ]
    }
]

sim_results = []
for c in sim_cases:
    unweighted = float(np.mean([score for _, score in c["lines"]]))
    tot_chars = sum([len(t) for t, _ in c["lines"]])
    weighted = sum([len(t) * score for t, score in c["lines"]]) / tot_chars
    sim_results.append({
        "case": c["name"],
        "unweighted_mean": round(unweighted, 4),
        "char_weighted_mean": round(weighted, 4),
        "unweighted_triggers_fallback": bool(unweighted < 0.60),
        "char_weighted_triggers_fallback": bool(weighted < 0.60)
    })
    print(f"[*] {c['name']}")
    print(f"    Unweighted Mean: {unweighted:.4f} -> Triggers Fallback: {unweighted < 0.60}")
    print(f"    Char-Weighted:   {weighted:.4f} -> Triggers Fallback: {weighted < 0.60}")

# 7. Dual-Output Retention Simulation (Mandatory Rule 8)
print("\n" + "=" * 80)
print("DUAL-OUTPUT RETENTION SIMULATION (Rule 8)")
print("=" * 80)

sample_db_sim = []
for item in results:
    f_id = item["sample"]["file_id"]
    fb = item["fallback_triggered"]
    rapid = item["rapidocr"]
    tess = item["tesseract"]

    # Row 1: Primary RapidOCR
    row1 = {
        "file_id": f_id,
        "engine": "RAPIDOCR",
        "extracted_text": rapid["extracted_text"][:100] + "..." if len(rapid["extracted_text"]) > 100 else rapid["extracted_text"],
        "mean_confidence": rapid["char_weighted_mean_confidence"],
        "bbox_count": rapid["bbox_count"],
        "fallback_triggered": fb,
        "description": "Primary engine output"
    }
    sample_db_sim.append(row1)

    # Row 2: Tesseract (Only if fallback was triggered)
    if fb == 1:
        row2 = {
            "file_id": f_id,
            "engine": "TESSERACT",
            "extracted_text": tess["extracted_text"][:100] + "..." if len(tess["extracted_text"]) > 100 else tess["extracted_text"],
            "mean_confidence": tess["char_weighted_mean_confidence"],
            "bbox_count": tess["bbox_count"],
            "fallback_triggered": 1,
            "description": "Fallback engine dual output"
        }
        sample_db_sim.append(row2)

print(f"[+] Total simulated DB rows generated across 8 test items: {len(sample_db_sim)}")
for r in sample_db_sim:
    print(f"    [Row] file_id={r['file_id']:5d} | {r['engine']:9s} | conf={r['mean_confidence']:.4f} | boxes={r['bbox_count']:2d} | fb_trig={r['fallback_triggered']}")

# 8. Save structured benchmark data
output_json_path = "benchmark_results.json"
with open(output_json_path, "w", encoding="utf-8") as f:
    json.dump({
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "tesseract_version": str(tess_ver),
        "tesseract_languages": tess_langs,
        "rapidocr_init_ms": round(t_init, 2),
        "rapidocr_cold_ms": round(t_cold, 2),
        "rapidocr_mem_mb": round(mem_after - mem_before, 2),
        "peak_mem_mb": round(peak_mem, 2),
        "sim_confidence_cases": sim_results,
        "sim_db_retention_rows": sample_db_sim,
        "benchmarks": results
    }, f, indent=2, ensure_ascii=False)

print(f"\n[+] Full benchmark suite successfully finished! Output written to {output_json_path}")
