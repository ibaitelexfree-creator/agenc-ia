import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

for mid in ['MSG_0002106', 'MSG_0002107', 'MSG_0002108']:
    cursor.execute("SELECT msg_id, date, time, sender, content FROM messages WHERE msg_id = ?", (mid,))
    r = cursor.fetchone()
    print(f"[{r['msg_id']}] {r['sender']}:\n{r['content']}\n")

conn.close()
