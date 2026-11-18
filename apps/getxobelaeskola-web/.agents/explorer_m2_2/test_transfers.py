import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Transfer notification regex
TRANSFER_REGEX = re.compile(
    r'Se ha ordenado una transferencia con los siguientes datos:\s*'
    r'Ordenante:\s*(?P<ordenante>[^\n\r]+?)\s*'
    r'Importe:\s*(?P<importe>[\d\.,]+)\s*€\s*'
    r'Cuenta:\s*(?P<cuenta>[^\n\r]+?)\s*'
    r'Beneficiario:\s*(?P<beneficiario>[^\n\r]+?)\s*'
    r'Concepto:\s*(?P<concepto>[^\n\r]+?)\s*'
    r'Llegada:\s*(?P<llegada>[^\n\r]+)',
    re.IGNORECASE | re.DOTALL
)

cursor.execute("""
SELECT msg_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%Se ha ordenado una transferencia%'
ORDER BY msg_id ASC
""")
rows = cursor.fetchall()
print(f"Total transfer notification messages: {len(rows)}")

matched = 0
for r in rows:
    m = TRANSFER_REGEX.search(r['content'])
    if m:
        matched += 1
        d = m.groupdict()
        print(f"[{r['msg_id']}] Ordenante: '{d['ordenante'].strip()}' | Importe: {d['importe']} € | Cuenta: '{d['cuenta'].strip()}' | Concepto: '{d['concepto'].strip()}' | Llegada: '{d['llegada'].strip()}'")
    else:
        print(f"FAILED TO MATCH: [{r['msg_id']}]:\n{repr(r['content'])}")

print(f"\nMatched {matched} / {len(rows)} transfer notifications.")
conn.close()
