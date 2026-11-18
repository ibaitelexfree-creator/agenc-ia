import sqlite3
import os

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

for fid in [1605, 1606, 1607, 1608, 1609, 1610, 1611, 1623, 17554]:
    cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE file_id = ?", (fid,))
    row = cur.fetchone()
    if row:
        exists = os.path.exists(row['abs_path'])
        print(f"[{row['file_id']}] exists={exists} | size={row['file_size']} | {row['rel_path']}")
    else:
        print(f"[{fid}] NOT FOUND IN DB")

conn.close()
