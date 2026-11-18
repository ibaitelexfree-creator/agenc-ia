import sqlite3
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("==================================================")
print("1. DEEP DIVE: BIZUM & PAYMENT RECEIPTS")
print("==================================================")
cursor.execute("SELECT msg_id, conv_id, date, time, sender, content FROM messages WHERE content LIKE '%bizum%' OR content LIKE '%Bizum%'")
bizum_rows = [dict(r) for r in cursor.fetchall()]
print(f"Total Bizum messages: {len(bizum_rows)}")
for r in bizum_rows:
    print(f"[{r['msg_id']}] {r['date']} {r['time']} | {r['sender']}: {r['content']}")

# Transfer receipts pattern
print("\n--- TRANSFER RECEIPT NOTIFICATIONS (Bank automatic SMS / messages) ---")
cursor.execute("""
SELECT msg_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%Se ha ordenado una transferencia%' 
   OR content LIKE '%transferencia con los siguientes datos%'
   OR content LIKE '%Justificante_transferencia%'
ORDER BY msg_id ASC
""")
transfer_rows = [dict(r) for r in cursor.fetchall()]
print(f"Total transfer receipt messages: {len(transfer_rows)}")
for tr in transfer_rows:
    print(f"[{tr['msg_id']}] {tr['sender']}: {tr['content'][:200]}...")

print("\n==================================================")
print("2. DEEP DIVE: TARIFFS & COURSE PRICING STRUCTURE")
print("==================================================")
# Let's search all messages that mention prices / euros / fees
cursor.execute("""
SELECT msg_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%cuota%' OR content LIKE '%tarifa%'
ORDER BY msg_id ASC
""")
money_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Total messages mentioning money/fees: {len(money_msgs)}")

# Let's extract key pricing announcements and promotions
pricing_regex = re.compile(r'(\d+(?:[\.,]\d+)?)\s*(?:€|euros?)\b', re.IGNORECASE)
found_prices = {}
for m in money_msgs:
    amounts = pricing_regex.findall(m['content'])
    for a in amounts:
        val = float(a.replace(',', '.'))
        found_prices[val] = found_prices.get(val, 0) + 1

print("\nTop price amounts mentioned in chat corpus:")
for price, count in sorted(found_prices.items(), key=lambda x: x[1], reverse=True)[:30]:
    print(f"  {price} €: {count} occurrences")

# Find specific messages for 100€, 180€, 120€, 25€, 150€, 60€, etc.
key_targets = [100.0, 180.0, 120.0, 25.0, 150.0, 50.0, 60.0, 200.0, 300.0]
key_price_msgs = {}
for kt in key_targets:
    key_price_msgs[kt] = []
    for m in money_msgs:
        if re.search(rf'\b{int(kt)}(?:[\.,]00)?\s*(?:€|euros?)\b', m['content'], re.IGNORECASE):
            key_price_msgs[kt].append({'msg_id': m['msg_id'], 'sender': m['sender'], 'content': m['content']})

print("\nSample messages for KEY TARGET PRICES:")
for kt in key_targets:
    print(f"\n--- Price {kt} € ({len(key_price_msgs[kt])} messages) ---")
    for sample in key_price_msgs[kt][:5]:
        print(f"  [{sample['msg_id']}] {sample['sender']}: {sample['content'][:150]}...")

print("\n==================================================")
print("3. DEEP DIVE: ACTORS & PERSONNEL ROLES")
print("==================================================")
# Urko Santillan Soriano
cursor.execute("SELECT msg_id, date, sender, content FROM messages WHERE content LIKE '%Urko%' OR content LIKE '%Santillan%'")
urko_mentions = [dict(r) for r in cursor.fetchall()]
print(f"Messages mentioning 'Urko' or 'Santillan': {len(urko_mentions)}")
for um in urko_mentions[:10]:
    print(f"  [{um['msg_id']}] {um['sender']}: {um['content'][:140]}")

# Angharad Arambalza Bernaola
cursor.execute("SELECT msg_id, date, sender, content FROM messages WHERE content LIKE '%Angharad%' OR content LIKE '%Arambalza%'")
angharad_mentions = [dict(r) for r in cursor.fetchall()]
print(f"Messages mentioning 'Angharad' or 'Arambalza': {len(angharad_mentions)}")
for am in angharad_mentions[:10]:
    print(f"  [{am['msg_id']}] {am['sender']}: {am['content'][:140]}")

# Ibai Santillan vs Ibai
cursor.execute("SELECT msg_id, conv_id, date, sender, content FROM messages WHERE content LIKE '%Ibai Santillan%' OR content LIKE '%Santillan%'")
santillan_mentions = [dict(r) for r in cursor.fetchall()]
print(f"Mentions of 'Santillan': {len(santillan_mentions)}")
for sm in santillan_mentions:
    print(f"  [{sm['msg_id']}] {sm['sender']}: {sm['content']}")

# Let's inspect conversations with 'Ama'
cursor.execute("SELECT conv_id, display_name FROM conversations WHERE display_name LIKE '%Ama%' OR display_name LIKE '%Ibai%'")
for c in cursor.fetchall():
    print(f"Conversation: [{c['conv_id']}] {c['display_name']}")

# Check all contacts with roles or notes
cursor.execute("""
SELECT contact_id, display_name, contact_name, membership_status, membership_category 
FROM contacts 
WHERE display_name LIKE '%Monitor%' 
   OR display_name LIKE '%Socio%' 
   OR display_name LIKE '%Socia%' 
   OR display_name LIKE '%Pakea%' 
   OR display_name LIKE '%GBE%'
   OR display_name LIKE '%420%'
   OR display_name LIKE '%Laser%'
""")
role_contacts = [dict(r) for r in cursor.fetchall()]
print(f"\nContacts with role titles: {len(role_contacts)}")
for rc in role_contacts:
    print(f"  [{rc['contact_id']}] {rc['display_name']} (Cat: {rc['membership_category']}, Status: {rc['membership_status']})")

print("\n==================================================")
print("4. DEEP DIVE: OMITTED DOCUMENTS (All 161 messages)")
print("==================================================")
cursor.execute("""
SELECT msg_id, conv_id, date, time, sender, content, is_attachment, attachment_type 
FROM messages 
WHERE content LIKE '%<documento omitido>%'
ORDER BY msg_id ASC
""")
doc_omit_rows = [dict(r) for r in cursor.fetchall()]
print(f"Total <documento omitido> messages: {len(doc_omit_rows)}")

# Analyze extracted document filenames
doc_filenames = []
doc_exts = {}
doc_prefixes = {}
for r in doc_omit_rows:
    raw = r['content']
    # Check if prefixed with [Reenviado]
    is_forwarded = '[Reenviado]' in raw
    # Clean text to extract filename
    clean = raw.replace('[Reenviado]', '').strip()
    match = re.search(r'<documento omitido>\s*(.*)', clean)
    fn = match.group(1).strip() if match else clean
    doc_filenames.append({
        'msg_id': r['msg_id'],
        'date': r['date'],
        'sender': r['sender'],
        'raw_content': raw,
        'filename': fn,
        'is_forwarded': is_forwarded
    })
    # Extension
    ext_match = re.search(r'\.([a-zA-Z0-9]+)$', fn)
    ext = ext_match.group(1).lower() if ext_match else 'NO_EXT'
    doc_exts[ext] = doc_exts.get(ext, 0) + 1

print("\nFile extension distribution in <documento omitido>:")
for ext, cnt in sorted(doc_exts.items(), key=lambda x: x[1], reverse=True):
    print(f"  .{ext}: {cnt}")

print("\nSample of extracted filenames (first 30):")
for df in doc_filenames[:30]:
    fwd = "[FWD] " if df['is_forwarded'] else ""
    print(f"  [{df['msg_id']}] {fwd}'{df['filename']}' ({df['sender']})")

# Save all doc filenames to a json file
with open("c:/Users/User/Desktop/agenc-ia/apps/getxobelaeskola-web/.agents/explorer_m2_2/omitted_docs.json", "w", encoding="utf-8") as f:
    json.dump(doc_filenames, f, ensure_ascii=False, indent=2)

print("\nWrote omitted_docs.json successfully!")
conn.close()
