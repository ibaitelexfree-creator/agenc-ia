import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT msg_id, conv_id, date, time, sender, content FROM messages WHERE content LIKE '%bizum%' OR content LIKE '%Bizum%'")
rows = cursor.fetchall()
print(f"Total Bizum messages: {len(rows)}")
for r in rows:
    print(f"[{r['msg_id']}] {r['date']} {r['time']} | {r['sender']}: {r['content']}")

conn.close()
