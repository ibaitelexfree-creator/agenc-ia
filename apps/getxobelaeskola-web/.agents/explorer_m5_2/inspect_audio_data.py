import sqlite3
import os

db_path = r"file:c:/Users/User/Desktop/whatsapp_chats_zip/forensics_multiagent_run/run_evidence.db?mode=ro"
conn = sqlite3.connect(db_path, uri=True)
cur = conn.cursor()

print("=== TABLE SCHEMAS ===")
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table' AND name IN ('file_inventory', 'audio_evidence')")
for name, sql in cur.fetchall():
    print(f"Table: {name}\n{sql}\n")

print("=== MODALITY COUNTS ===")
cur.execute("SELECT modality, count(*) FROM file_inventory GROUP BY modality ORDER BY count(*) DESC")
for m, c in cur.fetchall():
    print(f"  {m:15s}: {c}")

print("\n=== AUDIO STATUS COUNTS ===")
cur.execute("SELECT status, count(*) FROM file_inventory WHERE modality = 'AUDIO' GROUP BY status")
for s, c in cur.fetchall():
    print(f"  {s:15s}: {c}")

print("\n=== AUDIO EXTENSIONS ===")
cur.execute("""
    SELECT 
        lower(substr(rel_path, instr(rel_path, '.'))) as ext,
        count(*),
        min(file_size),
        avg(file_size),
        max(file_size),
        sum(file_size)
    FROM file_inventory 
    WHERE modality = 'AUDIO'
    GROUP BY ext
""")
# Actually instr(rel_path, '.') finds the FIRST dot in the path (e.g. '. org\...').
# Let's do python-side extension parsing:
cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'AUDIO'")
rows = cur.fetchall()
exts = {}
total_bytes = 0
sizes = []
for fid, rel, absp, size in rows:
    ext = os.path.splitext(rel)[1].lower()
    exts[ext] = exts.get(ext, 0) + 1
    total_bytes += size
    sizes.append(size)

print("Parsed Extensions:")
for ext, count in exts.items():
    print(f"  {ext}: {count}")
print(f"Total Audio Files: {len(rows)}")
print(f"Total Bytes: {total_bytes / (1024*1024):.2f} MB")
print(f"Min Size: {min(sizes)} B, Median Size: {sorted(sizes)[len(sizes)//2]} B, Max Size: {max(sizes)} B")

# Check if audio_evidence table has any records already
cur.execute("SELECT count(*) FROM audio_evidence")
print(f"\nExisting audio_evidence records: {cur.fetchone()[0]}")

conn.close()
