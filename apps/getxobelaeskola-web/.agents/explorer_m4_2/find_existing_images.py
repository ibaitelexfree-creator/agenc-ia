import sqlite3
import os

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
    SELECT file_id, rel_path, abs_path, file_size
    FROM file_inventory
    WHERE modality = 'IMAGE'
    ORDER BY file_id ASC
    LIMIT 200
""")
rows = cur.fetchall()

found = []
for r in rows:
    p = r['abs_path']
    if os.path.isfile(p):
        found.append((r['file_id'], r['rel_path'], p, r['file_size']))

print(f"Found {len(found)} existing images in first 200 rows:")
for fid, rel, p, sz in found[:20]:
    print(f"  [{fid}] {sz} B: {rel}")

conn.close()
