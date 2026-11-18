import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Check all messages where content has .pdf, .docx, .xlsx, .ods, .csv, .txt without <documento omitido>
cursor.execute("""
SELECT msg_id, is_attachment, sender, content 
FROM messages 
WHERE (content LIKE '%.pdf%' OR content LIKE '%.docx%' OR content LIKE '%.xlsx%' OR content LIKE '%.ods%')
  AND content NOT LIKE '%<documento omitido>%'
""")
other_doc_refs = [dict(r) for r in cursor.fetchall()]
print(f"Messages mentioning doc extensions without '<documento omitido>': {len(other_doc_refs)}")
for r in other_doc_refs[:15]:
    print(f"[{r['msg_id']}] is_att={r['is_attachment']} | {r['sender']}: {r['content'][:150]}")

conn.close()
