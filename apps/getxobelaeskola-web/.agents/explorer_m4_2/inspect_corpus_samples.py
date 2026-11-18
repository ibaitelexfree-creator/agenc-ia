import sqlite3
import os
import json
from pathlib import Path
from PIL import Image

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Count total images
cur.execute("SELECT count(*) FROM file_inventory WHERE modality = 'IMAGE'")
total_images = cur.fetchone()[0]
print(f"Total images in file_inventory: {total_images}")

# Sample paths across subdirectories
cur.execute("""
    SELECT file_id, rel_path, abs_path, file_size
    FROM file_inventory
    WHERE modality = 'IMAGE'
    ORDER BY file_id ASC
""")
rows = cur.fetchall()

categories = {
    "screenshots": [],
    "camera_photos": [],
    "receipts_or_docs": [],
    "stickers_or_profile": [],
    "sent": [],
    "others": []
}

for r in rows:
    rel = r['rel_path'].lower()
    abs_p = r['abs_path']
    fsize = r['file_size']
    fid = r['file_id']
    
    entry = {"file_id": fid, "rel_path": r['rel_path'], "abs_path": abs_p, "file_size": fsize}
    
    if "screenshot" in rel or "captura" in rel:
        categories["screenshots"].append(entry)
    elif "sticker" in rel or "profile" in rel or "avatar" in rel:
        categories["stickers_or_profile"].append(entry)
    elif "sent" in rel:
        categories["sent"].append(entry)
    elif "doc" in rel or "recibo" in rel or "factura" in rel or "justificante" in rel:
        categories["receipts_or_docs"].append(entry)
    elif "img-" in rel or "whatsapp image" in rel:
        categories["camera_photos"].append(entry)
    else:
        categories["others"].append(entry)

print("\n--- Image Categorization by Path Heuristics ---")
for cat, items in categories.items():
    print(f"  {cat:20}: {len(items):6,}")

# Let's inspect some candidates from each category that exist on disk
sample_candidates = {}

def find_first_existing(item_list, count=3):
    found = []
    for it in item_list:
        if os.path.exists(it['abs_path']) and it['file_size'] > 1000:
            try:
                with Image.open(it['abs_path']) as im:
                    w, h = im.size
                    format_ = im.format
                it_copy = dict(it)
                it_copy['width'] = w
                it_copy['height'] = h
                it_copy['format'] = format_
                found.append(it_copy)
                if len(found) >= count:
                    break
            except Exception as e:
                pass
    return found

sample_candidates["screenshot"] = find_first_existing(categories["screenshots"], 3)
sample_candidates["camera_photo"] = find_first_existing(categories["camera_photos"], 3)
sample_candidates["sent"] = find_first_existing(categories["sent"], 3)
sample_candidates["stickers"] = find_first_existing(categories["stickers_or_profile"], 3)
sample_candidates["others"] = find_first_existing(categories["others"], 5)

print("\n--- Sample Candidates Discovered ---")
print(json.dumps(sample_candidates, indent=2))

conn.close()
