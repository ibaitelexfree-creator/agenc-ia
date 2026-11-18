import sqlite3
import time
from PIL import Image

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'IMAGE' LIMIT 500")
sample = cursor.fetchall()
conn.close()

t0 = time.time()
errors = []
formats = {}
modes = {}

for r in sample:
    p = r['abs_path']
    try:
        with Image.open(p) as img:
            fmt = img.format
            mode = img.mode
            formats[fmt] = formats.get(fmt, 0) + 1
            modes[mode] = modes.get(mode, 0) + 1
            img.verify()
    except Exception as e:
        errors.append((r['file_id'], r['rel_path'], str(e)))

t1 = time.time()
elapsed = t1 - t0
rate = len(sample) / elapsed if elapsed > 0 else 0
print(f"Verified {len(sample)} images in {elapsed:.2f} seconds ({rate:.1f} images/sec).")
print(f"Errors found in sample: {len(errors)}")
print(f"Formats detected: {formats}")
print(f"Modes detected: {modes}")
if errors:
    print("Sample errors:", errors[:5])
