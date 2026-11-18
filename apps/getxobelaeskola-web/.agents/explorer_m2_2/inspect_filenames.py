import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("--- FILE NAMING IN ATTACHMENTS TABLE ---")
cursor.execute("SELECT original_filename FROM attachments LIMIT 30")
for r in cursor.fetchall():
    print(" ", r['original_filename'])

print("\n--- DISTINCT FILENAME PREFIXES IN ATTACHMENTS ---")
cursor.execute("""
SELECT 
    CASE 
        WHEN original_filename LIKE 'IMG-%' THEN 'IMG-YYYYMMDD-WA'
        WHEN original_filename LIKE 'VID-%' THEN 'VID-YYYYMMDD-WA'
        WHEN original_filename LIKE 'AUD-%' THEN 'AUD-YYYYMMDD-WA'
        WHEN original_filename LIKE 'PTT-%' THEN 'PTT-YYYYMMDD-WA'
        WHEN original_filename LIKE 'DOC-%' THEN 'DOC-YYYYMMDD-WA'
        WHEN original_filename LIKE 'STK-%' THEN 'STK-YYYYMMDD-WA'
        WHEN original_filename LIKE '%-%-%-%-%' THEN 'UUID'
        ELSE 'OTHER_NAMED'
    END AS prefix_type,
    count(*) as count
FROM attachments
GROUP BY prefix_type
ORDER BY count DESC
""")
for r in cursor.fetchall():
    print(f"  {r['prefix_type']}: {r['count']}")

print("\n--- SAMPLE OF OTHER_NAMED FILES IN ATTACHMENTS ---")
cursor.execute("""
SELECT original_filename, file_extension, attachment_type 
FROM attachments 
WHERE original_filename NOT LIKE 'IMG-%' 
  AND original_filename NOT LIKE 'VID-%' 
  AND original_filename NOT LIKE 'AUD-%' 
  AND original_filename NOT LIKE 'PTT-%' 
  AND original_filename NOT LIKE 'STK-%'
LIMIT 25
""")
for r in cursor.fetchall():
    print(f"  {r['original_filename']} ({r['file_extension']}, {r['attachment_type']})")

print("\n--- FILE CODES IN MESSAGES CONTENT ---")
cursor.execute("SELECT msg_id, sender, content FROM messages WHERE content LIKE '%WA%' AND (content LIKE '%202%' OR content LIKE '%201%')")
wa_msgs = cursor.fetchall()
print(f"Messages with WA timestamp code: {len(wa_msgs)}")
for m in wa_msgs:
    print(f"  [{m['msg_id']}] {m['sender']}: {m['content']}")

conn.close()
