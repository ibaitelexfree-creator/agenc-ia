import sqlite3
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
SELECT msg_id, conv_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%<documento omitido>%'
ORDER BY msg_id ASC
""")
rows = cursor.fetchall()
print(f"Total <documento omitido> rows: {len(rows)}")

# Regex candidate 1:
# Match optional prefix like [Reenviado], then <documento omitido>, then capture the filename
pattern = re.compile(r'^(?:\[Reenviado\]\s*)?<documento omitido>\s*(?P<filename>.+?)(?:\s+•\s+(?P<meta>.*))?$', re.DOTALL | re.IGNORECASE)

# Let's test this and other variations
unmatched = []
matched_docs = []

for r in rows:
    content = r['content'].strip()
    m = pattern.match(content)
    if m:
        fn = m.group('filename').strip()
        meta = m.group('meta')
        matched_docs.append({
            'msg_id': r['msg_id'],
            'sender': r['sender'],
            'raw': content,
            'filename': fn,
            'meta': meta
        })
    else:
        unmatched.append({
            'msg_id': r['msg_id'],
            'sender': r['sender'],
            'content': content
        })

print(f"Matched: {len(matched_docs)} / {len(rows)}")
print(f"Unmatched: {len(unmatched)}")
if unmatched:
    print("\n--- UNMATCHED MESSAGES ---")
    for u in unmatched:
        print(f"[{u['msg_id']}] {u['sender']}:\n{repr(u['content'])}\n")

# Let's inspect unique filenames and categories
filename_list = [d['filename'] for d in matched_docs]
print(f"\nUnique filenames count: {len(set(filename_list))}")

# Distribution of file extensions
ext_count = {}
for fn in filename_list:
    ext_m = re.search(r'\.([a-zA-Z0-9]+)$', fn)
    ext = ext_m.group(1).lower() if ext_m else 'NO_EXTENSION'
    ext_count[ext] = ext_count.get(ext, 0) + 1

print("\nExtension distribution:")
for ext, cnt in sorted(ext_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  .{ext}: {cnt}")

# Check NO_EXTENSION items
no_ext_items = [d for d in matched_docs if not re.search(r'\.[a-zA-Z0-9]+$', d['filename'])]
print(f"\nItems without file extension ({len(no_ext_items)}):")
for item in no_ext_items:
    print(f"  [{item['msg_id']}] '{item['filename']}' ({item['sender']})")

conn.close()
