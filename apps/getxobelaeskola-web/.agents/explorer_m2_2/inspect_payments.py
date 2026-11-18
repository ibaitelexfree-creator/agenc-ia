import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=== BIZUM MESSAGES ===")
cursor.execute("SELECT msg_id, conv_id, date, time, sender, content FROM messages WHERE content LIKE '%bizum%' OR content LIKE '%Bizum%'")
for r in cursor.fetchall():
    print(f"[{r['msg_id']}] {r['date']} {r['time']} | {r['sender']}:\n  {r['content']}\n")

print("\n=== TRANSFER RECEIPT MESSAGES (Top 25) ===")
cursor.execute("""
SELECT msg_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%Se ha ordenado una transferencia%' 
   OR content LIKE '%transferencia con los siguientes datos%'
   OR content LIKE '%Justificante_transferencia%'
ORDER BY msg_id ASC
""")
for r in cursor.fetchall()[:25]:
    print(f"[{r['msg_id']}] {r['date']} | {r['sender']}:\n  {r['content']}\n")

print("\n=== PHONE NUMBERS ASSOCIATED WITH ESKOLA OR BIZUM ===")
cursor.execute("""
SELECT msg_id, sender, content 
FROM messages 
WHERE content LIKE '%634%405%624%' 
   OR content LIKE '%634405624%'
   OR content LIKE '%634 40 56 24%'
   OR content LIKE '%634 405 624%'
   OR content LIKE '%94 491 66 32%'
   OR content LIKE '%944916632%'
""")
for r in cursor.fetchall():
    print(f"[{r['msg_id']}] {r['sender']}: {r['content'][:150]}")

conn.close()
