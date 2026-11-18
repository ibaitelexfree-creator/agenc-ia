import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("--- CONTACTS SEARCH FOR IBAI / SANTILLAN ---")
cursor.execute("SELECT * FROM contacts WHERE display_name LIKE '%Ibai%' OR contact_name LIKE '%Ibai%' OR display_name LIKE '%Santillan%' OR contact_name LIKE '%Santillan%'")
for r in cursor.fetchall():
    print(dict(r))

print("\n--- CONVERSATIONS SEARCH FOR IBAI / SANTILLAN ---")
cursor.execute("SELECT * FROM conversations WHERE display_name LIKE '%Ibai%' OR display_name LIKE '%Santillan%'")
for r in cursor.fetchall():
    print(dict(r))

print("\n--- ALL MESSAGES WITH 'SANTILLAN' ---")
cursor.execute("SELECT msg_id, conv_id, sender, content FROM messages WHERE content LIKE '%Santillan%'")
for r in cursor.fetchall():
    print(f"[{r['msg_id']}] {r['sender']}: {r['content']}")

print("\n--- MESSAGES IN CONV WITH 'Ama' ---")
cursor.execute("SELECT c.conv_id, c.display_name FROM conversations c WHERE c.display_name LIKE '%Ama%'")
ama_convs = cursor.fetchall()
for ac in ama_convs:
    print(f"Ama Conv: {ac['conv_id']} - {ac['display_name']}")
    cursor.execute("SELECT msg_id, sender, content FROM messages WHERE conv_id = ? AND content LIKE '%Ibai%'", (ac['conv_id'],))
    for m in cursor.fetchall():
        print(f"  [{m['msg_id']}] {m['sender']}: {m['content']}")

conn.close()
