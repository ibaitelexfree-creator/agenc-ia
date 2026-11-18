import os
import sqlite3
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Get 50 images from file_inventory to find diverse samples
cur.execute("""
    SELECT file_id, rel_path, abs_path, file_size
    FROM file_inventory
    WHERE modality = 'IMAGE'
    ORDER BY file_id ASC
    LIMIT 60
""")
sample_images = cur.fetchall()

ocr = RapidOCR()

results = []
for row in sample_images:
    p = row['abs_path']
    if not os.path.exists(p) or row['file_size'] < 1000:
        continue
    try:
        res, elapse = ocr(p)
        txt_count = len(res) if res else 0
        preview = ""
        mean_conf = 0.0
        if res:
            preview = " | ".join([line[1] for line in res[:3]])
            scores = [float(line[2]) for line in res]
            mean_conf = sum(scores) / len(scores)
        results.append({
            "file_id": row['file_id'],
            "rel_path": row['rel_path'],
            "lines": txt_count,
            "mean_conf": round(mean_conf, 3),
            "preview": preview[:80],
            "abs_path": p
        })
    except Exception as e:
        results.append({
            "file_id": row['file_id'],
            "rel_path": row['rel_path'],
            "error": str(e)
        })

print(f"Scanned {len(results)} images:")
for r in results[:25]:
    if "error" in r:
        print(f"[{r['file_id']}] ERROR: {r['error']}")
    else:
        print(f"[{r['file_id']}] lines={r['lines']:3d}, conf={r['mean_conf']:.2f} | {r['preview']}")

conn.close()
