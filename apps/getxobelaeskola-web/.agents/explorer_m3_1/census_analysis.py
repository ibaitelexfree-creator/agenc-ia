import sqlite3
import os
import sys
import json
import statistics
from pathlib import Path

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
URI_DB = f"file:{DB_PATH.replace(os.sep, '/')}?mode=ro"

conn = sqlite3.connect(URI_DB, uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print("="*80)
print("SECTION 1: MODALITY = 'DOCUMENT' INVENTORY CENSUS")
print("="*80)

cur.execute("""
SELECT file_id, rel_path, abs_path, file_size, sha256, modality, status, terminal_code, error_message
FROM file_inventory
WHERE modality = 'DOCUMENT'
ORDER BY file_id
""")
doc_rows = cur.fetchall()
print(f"Total rows with modality='DOCUMENT': {len(doc_rows)}")

docs_data = []
for r in doc_rows:
    p = Path(r['rel_path'])
    suffix = p.suffix.lower() if p.suffix else "[no_ext]"
    exists = os.path.exists(r['abs_path'])
    actual_size = os.path.getsize(r['abs_path']) if exists else -1
    docs_data.append({
        "file_id": r['file_id'],
        "rel_path": r['rel_path'],
        "abs_path": r['abs_path'],
        "db_size": r['file_size'],
        "disk_size": actual_size,
        "exists": exists,
        "suffix": suffix,
        "status": r['status'],
        "terminal_code": r['terminal_code'],
        "error_message": r['error_message']
    })

# Group by suffix
by_suffix = {}
for d in docs_data:
    s = d['suffix']
    by_suffix.setdefault(s, []).append(d)

print(f"\nBreakdown by Extension ({len(docs_data)} files):")
for s, items in sorted(by_suffix.items()):
    sizes = [x['db_size'] for x in items]
    print(f"  Extension: {s:12} Count: {len(items):3} | Min: {min(sizes):7} B | Max: {max(sizes):10} B | Median: {statistics.median(sizes):8.1f} B | Sum: {sum(sizes):10} B")
    for it in items:
        name = Path(it['rel_path']).name
        print(f"    - ID {it['file_id']:5}: {name} ({it['db_size']} bytes) [exists={it['exists']}, status={it['status']}]")

print("\n" + "="*80)
print("SECTION 2: ALL EXTENSIONS IN FILE_INVENTORY ACROSS ALL MODALITIES")
print("="*80)

cur.execute("SELECT rel_path, modality, status, file_size FROM file_inventory")
all_files = cur.fetchall()

mod_ext_counts = {}
for r in all_files:
    mod = r['modality']
    p = Path(r['rel_path'])
    ext = p.suffix.lower() if p.suffix else "[no_ext]"
    key = (mod, ext)
    mod_ext_counts[key] = mod_ext_counts.get(key, 0) + 1

for (mod, ext), cnt in sorted(mod_ext_counts.items(), key=lambda x: (x[0][0], -x[1])):
    print(f"Modality: {mod:12} Ext: {ext:15} Count: {cnt:5}")

print("\n" + "="*80)
print("SECTION 3: INVESTIGATE 'OTHER' MODALITY FOR DOCUMENT-LIKE ARTIFACTS")
print("="*80)
cur.execute("""
SELECT file_id, rel_path, file_size, status, terminal_code
FROM file_inventory
WHERE modality = 'OTHER'
ORDER BY file_size DESC
""")
other_rows = cur.fetchall()
other_exts = {}
for r in other_rows:
    p = Path(r['rel_path'])
    ext = p.suffix.lower() if p.suffix else "[no_ext]"
    other_exts.setdefault(ext, []).append(r)

print(f"Total 'OTHER' rows: {len(other_rows)}")
for ext, items in sorted(other_exts.items(), key=lambda x: -len(x[1])):
    print(f"  Ext {ext:15}: {len(items):4} files (sizes min={min(x['file_size'] for x in items)}, max={max(x['file_size'] for x in items)})")
    if ext in ['.csv', '.tsv', '.doc', '.xls', '.ppt', '.pptx', '.odt', '.rtf', '.xml', '.html', '.htm', '[no_ext]']:
        for it in items[:10]:
            print(f"      sample: {it['rel_path']} ({it['file_size']} B)")

print("\n" + "="*80)
print("SECTION 4: INVESTIGATE 'CHAT_TXT' MODALITY")
print("="*80)
cur.execute("SELECT count(*), min(file_size), max(file_size), sum(file_size) FROM file_inventory WHERE modality = 'CHAT_TXT'")
txt_stats = cur.fetchone()
print(f"CHAT_TXT: count={txt_stats[0]}, min_size={txt_stats[1]}, max_size={txt_stats[2]}, total_size={txt_stats[3]}")
cur.execute("SELECT file_id, rel_path, file_size, status FROM file_inventory WHERE modality = 'CHAT_TXT' LIMIT 10")
for r in cur.fetchall():
    print(f"  Sample: {r['rel_path']} ({r['file_size']} B)")

conn.close()
