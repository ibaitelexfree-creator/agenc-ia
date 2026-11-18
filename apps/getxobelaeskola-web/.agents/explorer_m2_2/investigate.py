import sqlite3
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row

# Register REGEXP function for sqlite
def regexp(expr, item):
    if item is None:
        return False
    return bool(re.search(expr, item, re.IGNORECASE))

conn.create_function("REGEXP", 2, regexp)
cursor = conn.cursor()

results = {}

print("=== TASK 1: CLUB ENTITIES ===")
club_patterns = [
    "Getxo Bela Eskola", "Bela Eskola", "GBE", "Pakea", 
    "Munduari Itzulia", "Club Deportivo Vela", "Vela Pakea",
    "Pakea Munduari", "Asociación Club Deportivo Vela Pakea Munduari Itzulia",
    "Escuela de Vela", "Getxo Vela"
]
club_counts = {}
for p in club_patterns:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{p}%",))
    club_counts[p] = cursor.fetchone()[0]
    print(f"Pattern '{p}': {club_counts[p]} messages")

results['club_counts'] = club_counts

# Detailed fetch of club mentions
cursor.execute("""
SELECT msg_id, conv_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%Getxo Bela Eskola%' 
   OR content LIKE '%Pakea%' 
   OR content LIKE '%Munduari%'
   OR content LIKE '%Club Deportivo Vela%'
ORDER BY msg_id ASC
""")
club_messages = [dict(r) for r in cursor.fetchall()]
results['club_messages_count'] = len(club_messages)
results['club_sample_messages'] = club_messages[:25]
print(f"Total matching club messages: {len(club_messages)}")

print("\n=== TASK 2: FINANCIAL & LEGAL IDENTIFIERS ===")
# Search CIF
cif_patterns = ["G95526299", "G-95526299", "G 95526299", "95526299"]
cif_matches = []
for cp in cif_patterns:
    cursor.execute("SELECT msg_id, conv_id, date, time, sender, content FROM messages WHERE content LIKE ?", (f"%{cp}%",))
    for r in cursor.fetchall():
        d = dict(r)
        if d not in cif_matches:
            cif_matches.append(d)
print(f"CIF matches found: {len(cif_matches)}")
for cm in cif_matches:
    print(f"  [{cm['msg_id']}] {cm['sender']}: {cm['content']}")

results['cif_matches'] = cif_matches

# Search for any CIF/NIF/DNI
cursor.execute("SELECT msg_id, date, sender, content FROM messages WHERE content LIKE '%CIF%' OR content LIKE '%NIF%' OR content LIKE '%DNI%'")
id_keyword_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Mentions of CIF/NIF/DNI: {len(id_keyword_msgs)}")
for r in id_keyword_msgs[:10]:
    print(f"  [{r['msg_id']}] {r['sender']}: {r['content'][:150]}")
results['id_keyword_msgs'] = id_keyword_msgs

# Search Bank Accounts: ES43 2095 0000 7091 0910 0619 and permutations
bank_snippets = ["ES43", "2095", "0619", "0910", "7091", "Kutxabank", "BBK", "Bizum", "IBAN", "cuenta"]
bank_counts = {}
for bs in bank_snippets:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{bs}%",))
    bank_counts[bs] = cursor.fetchone()[0]
    print(f"Bank snippet '{bs}': {bank_counts[bs]}")
results['bank_counts'] = bank_counts

cursor.execute("""
SELECT msg_id, conv_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%ES43%' 
   OR content LIKE '%2095%' 
   OR content LIKE '%0619%'
   OR content LIKE '%Kutxabank%'
   OR content LIKE '%BBK%'
   OR content LIKE '%IBAN%'
ORDER BY msg_id ASC
""")
bank_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Total bank account related messages: {len(bank_msgs)}")
for bm in bank_msgs[:20]:
    print(f"  [{bm['msg_id']}] {bm['sender']}: {bm['content'][:150]}")
results['bank_sample_messages'] = bank_msgs

# Scan all 10,055 messages with python regex for IBANs
cursor.execute("SELECT msg_id, sender, content FROM messages")
all_msgs = cursor.fetchall()
iban_regex = re.compile(r'\b[A-Z]{2}[0-9]{2}[ -]?[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}\b', re.IGNORECASE)
found_ibans = []
for m in all_msgs:
    match = iban_regex.findall(m['content'])
    if match:
        found_ibans.append({'msg_id': m['msg_id'], 'sender': m['sender'], 'ibans': match, 'content': m['content']})

print(f"Total messages containing full IBAN format: {len(found_ibans)}")
for fi in found_ibans:
    print(f"  [{fi['msg_id']}] IBAN: {fi['ibans']} | Sender: {fi['sender']}")
results['found_ibans'] = found_ibans

# Also search for partial 20-digit accounts
account_20_regex = re.compile(r'\b[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{2}[ -]?[0-9]{10}\b')
found_20digits = []
for m in all_msgs:
    match = account_20_regex.findall(m['content'])
    if match:
        found_20digits.append({'msg_id': m['msg_id'], 'sender': m['sender'], 'account': match, 'content': m['content']})
print(f"Total messages containing 20-digit bank account: {len(found_20digits)}")
for fa in found_20digits:
    print(f"  [{fa['msg_id']}] Account: {fa['account']} | Sender: {fa['sender']}")
results['found_20digits'] = found_20digits

# Bizum search
cursor.execute("SELECT msg_id, sender, content FROM messages WHERE content LIKE '%bizum%' OR content LIKE '%Bizum%'")
bizum_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Bizum mentions: {len(bizum_msgs)}")
for bm in bizum_msgs:
    print(f"  [{bm['msg_id']}] {bm['sender']}: {bm['content'][:140]}")
results['bizum_msgs'] = bizum_msgs

print("\n=== TASK 3: FINANCIAL TARIFFS & FEES ===")
tariff_keywords = [
    "100€", "100 €", "100 euros", "180€", "180 €", "180 euros",
    "120€", "120 €", "120 euros", "25€", "25 €", "25 euros",
    "150€", "150 €", "150 euros", "cuota", "cuotas", "tarifa", "tarifas",
    "bono", "bonos", "precio", "precios", "pago", "pagar", "transferencia"
]
tariff_counts = {}
for tk in tariff_keywords:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{tk}%",))
    tariff_counts[tk] = cursor.fetchone()[0]
    print(f"Tariff keyword '{tk}': {tariff_counts[tk]}")
results['tariff_counts'] = tariff_counts

# Query specific tariff contexts
cursor.execute("""
SELECT msg_id, date, time, sender, content 
FROM messages 
WHERE content LIKE '%100%' AND (content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%cuota%')
   OR content LIKE '%180%' AND (content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%j80%' OR content LIKE '%curso%')
   OR content LIKE '%120%' AND (content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%laser%' OR content LIKE '%ilca%')
   OR content LIKE '%25%' AND (content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%meteoro%')
   OR content LIKE '%150%' AND (content LIKE '%€%' OR content LIKE '%euro%' OR content LIKE '%bono%')
ORDER BY msg_id ASC
""")
tariff_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Targeted tariff messages: {len(tariff_msgs)}")
for tm in tariff_msgs[:25]:
    print(f"  [{tm['msg_id']}] {tm['sender']}: {tm['content'][:140]}")
results['tariff_msgs_count'] = len(tariff_msgs)
results['sample_tariff_msgs'] = tariff_msgs

print("\n=== TASK 4: KEY ACTORS & ROLES ===")
actors = [
    ("Urko", "Urko Santillan"),
    ("Santillan", "Santillan Family"),
    ("Angharad", "Angharad Arambalza"),
    ("Ibai", "Ibai Santillan"),
    ("Asier", "Asier (Monitor 420)"),
    ("Gonzalo", "Gonzalo Aragón"),
    ("Eneko", "Eneko (Equipo 420)"),
    ("Basañez", "Ibon Basañez"),
    ("Rafa", "Rafa (Pakea)"),
    ("Gorka", "Gorka (Meteorólogo)"),
    ("Luciano", "Luciano Natali (Lutxo)"),
    ("Lutxo", "Lutxo"),
    ("Imiau", "Imiau Escocia"),
    ("Alex", "Alex Txiruka"),
    ("Teresa", "Teresa (470)")
]
actor_stats = {}
for name, desc in actors:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{name}%",))
    c_msg = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM messages WHERE sender LIKE ?", (f"%{name}%",))
    c_sender = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM contacts WHERE display_name LIKE ? OR contact_name LIKE ?", (f"%{name}%", f"%{name}%"))
    c_contact = cursor.fetchone()[0]
    actor_stats[name] = {"desc": desc, "content_matches": c_msg, "sender_matches": c_sender, "contact_matches": c_contact}
    print(f"Actor '{name}' ({desc}): {c_msg} msg content, {c_sender} sender, {c_contact} in contacts")
results['actor_stats'] = actor_stats

# Specifically investigate "Ibai"
cursor.execute("SELECT msg_id, conv_id, date, sender, content FROM messages WHERE content LIKE '%Ibai%' OR sender LIKE '%Ibai%'")
ibai_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Messages mentioning or sent by 'Ibai': {len(ibai_msgs)}")
for im in ibai_msgs:
    print(f"  [{im['msg_id']}] {im['sender']}: {im['content'][:140]}")
results['ibai_msgs'] = ibai_msgs

# Roles in content
roles = ["director", "directora", "presidente", "presidenta", "entrenador", "entrenadora", "monitor", "monitora", "begirale", "comodoro", "tesorero", "tesorera", "secretario", "secretaria", "capitán", "patrón", "socio", "socia"]
role_counts = {}
for role in roles:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{role}%",))
    role_counts[role] = cursor.fetchone()[0]
    print(f"Role '{role}': {role_counts[role]}")
results['role_counts'] = role_counts

print("\n=== TASK 5: OMITTED ATTACHMENTS & PLACEHOLDERS ===")
cursor.execute("SELECT count(*) FROM messages WHERE is_attachment = 0 AND content LIKE '%<%' AND content LIKE '%>%'")
print(f"Messages with is_attachment=0 and '<...>': {cursor.fetchone()[0]}")

# All types of angle brackets
cursor.execute("SELECT msg_id, is_attachment, attachment_type, content FROM messages WHERE content LIKE '%<%' AND content LIKE '%>%'")
angle_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Total messages with '<...>': {len(angle_msgs)}")

placeholder_types = {}
for am in angle_msgs:
    matches = re.findall(r'<([^>]+)>', am['content'])
    for m in matches:
        placeholder_types[m] = placeholder_types.get(m, 0) + 1

print("Distinct <...> tags found:")
for tag, cnt in sorted(placeholder_types.items(), key=lambda x: x[1], reverse=True):
    print(f"  <{tag}>: {cnt}")
results['placeholder_types'] = placeholder_types

# Document omitted messages
cursor.execute("SELECT msg_id, is_attachment, content FROM messages WHERE content LIKE '%<documento omitido>%'")
doc_omit_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Total <documento omitido> messages: {len(doc_omit_msgs)}")
results['doc_omit_count'] = len(doc_omit_msgs)
results['doc_omit_messages'] = doc_omit_msgs

# File codes DOC-, VID-, IMG-, AUD-, PTT-
file_code_patterns = ["DOC-", "VID-", "IMG-", "AUD-", "PTT-"]
code_counts = {}
for code in file_code_patterns:
    cursor.execute("SELECT count(*) FROM messages WHERE content LIKE ?", (f"%{code}%",))
    code_counts[code] = cursor.fetchone()[0]
    print(f"File code pattern '{code}': {code_counts[code]}")
results['file_code_counts'] = code_counts

# Messages with file codes
cursor.execute("SELECT msg_id, is_attachment, content FROM messages WHERE content LIKE '%DOC-%' OR content LIKE '%VID-%' OR content LIKE '%IMG-%' OR content LIKE '%AUD-%' OR content LIKE '%PTT-%'")
code_msgs = [dict(r) for r in cursor.fetchall()]
print(f"Messages with file code prefixes: {len(code_msgs)}")
for cm in code_msgs[:15]:
    print(f"  [{cm['msg_id']}] is_att={cm['is_attachment']}: {cm['content'][:140]}")
results['code_msgs'] = code_msgs

# Write entire results to json
with open("c:/Users/User/Desktop/agenc-ia/apps/getxobelaeskola-web/.agents/explorer_m2_2/investigation_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nWrote results to investigation_results.json successfully!")
conn.close()
