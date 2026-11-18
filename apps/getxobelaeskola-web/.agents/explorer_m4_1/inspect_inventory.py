import sqlite3
import os
import json
from pathlib import Path
from collections import Counter

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# 1. Total counts by modality
cursor.execute("SELECT modality, count(*) as count FROM file_inventory GROUP BY modality ORDER BY count DESC")
modality_counts = {r['modality']: r['count'] for r in cursor.fetchall()}
print("--- Modality Counts in file_inventory ---")
for m, c in modality_counts.items():
    print(f"  {m:15}: {c:,}")

# Total files in file_inventory
cursor.execute("SELECT count(*) FROM file_inventory")
total_files = cursor.fetchone()[0]
print(f"Total files in file_inventory: {total_files:,}")

# 2. Details of modality = 'IMAGE'
cursor.execute("SELECT count(*) FROM file_inventory WHERE modality = 'IMAGE'")
image_count = cursor.fetchone()[0]
print(f"\nExact census of modality = 'IMAGE': {image_count:,}")

# 3. Status distribution of modality = 'IMAGE'
cursor.execute("SELECT status, count(*) FROM file_inventory WHERE modality = 'IMAGE' GROUP BY status")
status_counts = cursor.fetchall()
print("\n--- Status distribution for modality = 'IMAGE' ---")
for r in status_counts:
    print(f"  {r[0]}: {r[1]:,}")

# 4. Check ocr_evidence table
cursor.execute("SELECT count(*) FROM ocr_evidence")
ocr_count = cursor.fetchone()[0]
print(f"\nTotal rows in ocr_evidence: {ocr_count:,}")

# 5. Extension analysis for modality = 'IMAGE'
cursor.execute("SELECT file_id, rel_path, abs_path, file_size, status FROM file_inventory WHERE modality = 'IMAGE'")
images = cursor.fetchall()

ext_counter = Counter()
no_ext_count = 0
for r in images:
    p = r['rel_path']
    _, ext = os.path.splitext(p)
    ext_lower = ext.lower()
    if ext_lower == '':
        no_ext_count += 1
        ext_counter['(no extension)'] += 1
    else:
        ext_counter[ext_lower] += 1

print("\n--- Extension breakdown for modality = 'IMAGE' ---")
for ext, count in ext_counter.most_common():
    print(f"  {ext:16}: {count:6,} ({count/image_count*100:5.2f}%)")

# 6. Check if there are other modalities with image-like extensions (.jpg, .png, etc.)
cursor.execute("SELECT modality, count(*) FROM file_inventory WHERE modality != 'IMAGE' AND (rel_path LIKE '%.jpg' OR rel_path LIKE '%.jpeg' OR rel_path LIKE '%.png' OR rel_path LIKE '%.webp' OR rel_path LIKE '%.gif') GROUP BY modality")
misclassified = cursor.fetchall()
print("\n--- Other modalities with image extensions ---")
for r in misclassified:
    print(f"  {r[0]}: {r[1]}")

conn.close()
