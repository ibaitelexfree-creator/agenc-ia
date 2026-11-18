import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

prefixes = ['IMG-', 'VID-', 'AUD-', 'PTT-', 'DOC-', 'STK-']
for pref in prefixes:
    cursor.execute("SELECT msg_id, sender, content FROM messages WHERE content LIKE ?", (f"%{pref}%",))
    rows = cursor.fetchall()
    print(f"Prefix '{pref}': {len(rows)} messages in content")
    for r in rows:
        print(f"  [{r['msg_id']}] {r['sender']}: {r['content']}")

conn.close()
