import sqlite3
import os
import sys
import json
import statistics
from pathlib import Path

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
URI_DB = f"file:{DB_PATH.replace(os.sep, '/')}?mode=ro"

print(f"Connecting to: {URI_DB}")
conn = sqlite3.connect(URI_DB, uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# 1. Inspect tables in run_evidence.db
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()
print("=== Tables in run_evidence.db ===")
for t in tables:
    print(f"- {t['name']}")

# Check file_inventory schema
cur.execute("PRAGMA table_info(file_inventory)")
cols = [r['name'] for r in cur.fetchall()]
print(f"file_inventory columns: {cols}")

# Check modalities summary
cur.execute("SELECT modality, count(*), sum(file_size) FROM file_inventory GROUP BY modality")
mod_summary = cur.fetchall()
print("\n=== Modality Summary ===")
for r in mod_summary:
    print(f"{r['modality']}: count={r[1]}, total_bytes={r[2]}")

# 2. Query modality = 'DOCUMENT'
cur.execute("SELECT file_id, rel_path, abs_path, file_size, sha256, modality, status, terminal_code, error_message FROM file_inventory WHERE modality = 'DOCUMENT'")
doc_rows = cur.fetchall()
total_docs = len(doc_rows)
print(f"\nTotal modality='DOCUMENT' rows: {total_docs}")

# Check if there are documents in other modalities or if any files with doc extensions are classified differently
cur.execute("""
SELECT modality, count(*) 
FROM file_inventory 
WHERE lower(rel_path) LIKE '%.pdf' 
   OR lower(rel_path) LIKE '%.docx' 
   OR lower(rel_path) LIKE '%.doc' 
   OR lower(rel_path) LIKE '%.xlsx' 
   OR lower(rel_path) LIKE '%.xls' 
   OR lower(rel_path) LIKE '%.ods' 
   OR lower(rel_path) LIKE '%.txt'
GROUP BY modality
""")
ext_mod_cross = cur.fetchall()
print("\n=== Extension cross-check with modality ===")
for r in ext_mod_cross:
    print(f"{r['modality']}: {r[1]}")

conn.close()
