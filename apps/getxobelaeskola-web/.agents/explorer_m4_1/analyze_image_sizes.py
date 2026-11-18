import sqlite3
import os
import sys
import time
from pathlib import Path
from collections import Counter, defaultdict
import statistics

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
    SELECT file_id, rel_path, abs_path, file_size, sha256, modality, status, terminal_code, error_message, mtime
    FROM file_inventory
    WHERE modality = 'IMAGE'
""")
rows = cursor.fetchall()
conn.close()

print(f"Total rows retrieved: {len(rows):,}")

# Check file existence and compare DB file_size vs os.path.getsize
missing_files = []
size_mismatches = []
sizes = []
extensions = Counter()
dir_categories = Counter()
detailed_paths = Counter()

t0 = time.time()
for r in rows:
    p = r['abs_path']
    rel = r['rel_path']
    db_size = r['file_size']
    
    # Extension
    _, ext = os.path.splitext(rel)
    ext_lower = ext.lower() if ext else '(no_ext)'
    extensions[ext_lower] += 1
    
    # Path categorization
    rel_norm = rel.replace('\\', '/')
    parts = rel_norm.split('/')
    
    if 'com.whatsapp' in rel_norm:
        if 'WhatsApp Images' in rel_norm:
            if '/Sent/' in rel_norm or rel_norm.endswith('/Sent'):
                cat = 'WhatsApp Images/Sent'
            elif '/Private/' in rel_norm:
                cat = 'WhatsApp Images/Private'
            else:
                cat = 'WhatsApp Images/Received'
        elif 'WhatsApp Stickers' in rel_norm:
            if '/Sent/' in rel_norm:
                cat = 'WhatsApp Stickers/Sent'
            else:
                cat = 'WhatsApp Stickers/Received'
        elif 'WhatsApp Profile Photos' in rel_norm:
            cat = 'WhatsApp Profile Photos'
        elif 'WhatsApp Animated Gifs' in rel_norm:
            cat = 'WhatsApp Animated Gifs'
        else:
            cat = 'com.whatsapp/Other'
    elif 'Whatsapp web Extraccion manual' in rel_norm:
        if 'Descomprimidos' in rel_norm:
            if 'Wireframe Skull' in rel_norm:
                cat = 'Manual Extraction/Foreign (Wireframe Skull)'
            else:
                cat = 'Manual Extraction/Descomprimidos Chats'
        else:
            cat = 'Manual Extraction/Root'
    else:
        cat = 'Other'
        
    dir_categories[cat] += 1
    
    # Existence & size check
    if not os.path.exists(p):
        missing_files.append((r['file_id'], rel))
    else:
        actual_size = os.path.getsize(p)
        sizes.append(actual_size)
        if actual_size != db_size:
            size_mismatches.append((r['file_id'], rel, db_size, actual_size))

t1 = time.time()
print(f"File existence and stat check completed in {t1 - t0:.2f} seconds.")
print(f"Missing files on disk: {len(missing_files)}")
print(f"Size mismatches (DB vs disk): {len(size_mismatches)}")

print("\n--- Directory / Media Categorization ---")
for cat, count in dir_categories.most_common():
    print(f"  {cat:45}: {count:6,} ({count/len(rows)*100:5.2f}%)")

print("\n--- Extension Distribution ---")
for ext, count in extensions.most_common():
    print(f"  {ext:15}: {count:6,} ({count/len(rows)*100:5.2f}%)")

# Size statistics
sizes.sort()
zero_byte_count = sum(1 for s in sizes if s == 0)
total_bytes = sum(sizes)
print("\n--- File Size Statistics (bytes) ---")
print(f"  Total Image Files checked : {len(sizes):,}")
print(f"  Total Data Volume         : {total_bytes:,} bytes ({total_bytes / (1024**3):.2f} GB / {total_bytes / (1024**2):.1f} MB)")
print(f"  0-byte Files              : {zero_byte_count}")
print(f"  Min Size                  : {sizes[0]:,} bytes")
print(f"  Max Size                  : {sizes[-1]:,} bytes ({sizes[-1]/(1024*1024):.2f} MB)")
print(f"  Mean Size                 : {statistics.mean(sizes):,.1f} bytes ({statistics.mean(sizes)/1024:.1f} KB)")
print(f"  Median Size               : {statistics.median(sizes):,.1f} bytes ({statistics.median(sizes)/1024:.1f} KB)")
print(f"  25th Percentile (Q1)      : {sizes[len(sizes)//4]:,} bytes ({sizes[len(sizes)//4]/1024:.1f} KB)")
print(f"  75th Percentile (Q3)      : {sizes[3*len(sizes)//4]:,} bytes ({sizes[3*len(sizes)//4]/1024:.1f} KB)")
print(f"  90th Percentile           : {sizes[int(len(sizes)*0.90)]:,} bytes ({sizes[int(len(sizes)*0.90)]/1024:.1f} KB)")
print(f"  95th Percentile           : {sizes[int(len(sizes)*0.95)]:,} bytes ({sizes[int(len(sizes)*0.95)]/1024:.1f} KB)")
print(f"  99th Percentile           : {sizes[int(len(sizes)*0.99)]:,} bytes ({sizes[int(len(sizes)*0.99)]/1024:.1f} KB)")

# Size brackets
brackets = [
    ("0 bytes (empty)", lambda s: s == 0),
    ("1 - 1,024 bytes (<1 KB)", lambda s: 0 < s <= 1024),
    ("1 KB - 10 KB", lambda s: 1024 < s <= 10*1024),
    ("10 KB - 50 KB", lambda s: 10*1024 < s <= 50*1024),
    ("50 KB - 100 KB", lambda s: 50*1024 < s <= 100*1024),
    ("100 KB - 250 KB", lambda s: 100*1024 < s <= 250*1024),
    ("250 KB - 500 KB", lambda s: 250*1024 < s <= 500*1024),
    ("500 KB - 1 MB", lambda s: 500*1024 < s <= 1024*1024),
    ("1 MB - 5 MB", lambda s: 1024*1024 < s <= 5*1024*1024),
    ("5 MB - 10 MB", lambda s: 5*1024*1024 < s <= 10*1024*1024),
    ("> 10 MB", lambda s: s > 10*1024*1024),
]

print("\n--- File Size Distribution Brackets ---")
for label, pred in brackets:
    cnt = sum(1 for s in sizes if pred(s))
    print(f"  {label:30}: {cnt:6,} ({cnt/len(sizes)*100:5.2f}%)")
