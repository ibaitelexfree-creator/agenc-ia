import sqlite3
import re
import sys
import json
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# 1. Fetch all messages
cursor.execute("SELECT msg_id, conv_id, date, time, sender, content, is_attachment FROM messages")
messages = cursor.fetchall()
print(f"Loaded {len(messages)} messages for regex benchmark.")

# -------------------------------------------------------------
# REGEX DEFINITIONS & BLUEPRINTS
# -------------------------------------------------------------

# 1. CLUB ENTITIES
REGEX_CLUB = re.compile(
    r'\b(?P<club_entity>'
    r'Getxo\s+Bela\s+Eskola'
    r'|Asociaci[oó]n\s+Club\s+Deportivo\s+(?:Vela\s+)?Pakea\s+Munduari\s+Itzulia(?:\s+Getxo)?'
    r'|Club\s+Deportivo\s+Vela\s+Pakea(?:\s+Munduari\s+Itzulia)?'
    r'|Vela\s+Pakea\s+Munduari\s+Itzulia'
    r'|Pakea\s+Munduari\s+Itzulia'
    r'|Pakea'
    r'|Bela\s+Eskola'
    r'|GBE'
    r')\b',
    re.IGNORECASE
)

# 2. CIF / NIF / DNI IDENTIFIERS
REGEX_CIF_CLUB = re.compile(
    r'\b(?P<cif_prefix>CIF|NIF)?[\s:]*(?P<cif_val>G[- ]?95526299)\b',
    re.IGNORECASE
)

REGEX_ALL_CIF_NIF = re.compile(
    r'\b(?P<id_type>CIF|NIF|DNI)?[\s:]*(?P<id_val>[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]|[0-9]{8}[A-Z])\b',
    re.IGNORECASE
)

# 3. BANK ACCOUNTS & IBAN
# ES43 2095 0000 7091 0910 0619 (spaced or unspaced)
REGEX_IBAN_CLUB = re.compile(
    r'\b(?P<iban>ES43[\s\-]*(?:2095)[\s\-]*(?:0000)[\s\-]*(?:7091)[\s\-]*(?:0910)[\s\-]*(?:0619))\b',
    re.IGNORECASE
)

# Any Spanish/SEPA IBAN
REGEX_IBAN_ANY = re.compile(
    r'\b(?P<iban>[A-Z]{2}[0-9]{2}(?:[\s\-]?[0-9]{4}){5})\b',
    re.IGNORECASE
)

# Masked account *0619 in transfer notifications
REGEX_MASKED_ACCOUNT = re.compile(
    r'(?:Cuenta|Cta\.?|cuenta)[\s:]*\*(?P<last4>0619)\b',
    re.IGNORECASE
)

# 4. TARIFFS, DUES & FEES
# Cuotas de socio (100€ monthly)
REGEX_CUOTA = re.compile(
    r'(?:'
    r'CUOTA\s*(?P<cuota_num>\d+)?(?:\s*EN\s*(?P<cuota_year>\d{4}))?'
    r'|cuota(?:s)?(?:\s+de)?(?:\s+socio|\s+mensual)?'
    r')'
    r'[\s\S]{0,40}?'
    r'(?P<amount>100(?:[\.,]00)?)\s*(?P<currency>€|euros?)\b'
    r'|'
    r'(?P<amount_alt>100(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)\b'
    r'[\s\S]{0,40}?'
    r'(?:CUOTA|cuota|mensualidad|abono|socio)',
    re.IGNORECASE
)

# Specific Tariffs: J80 (180€), Laser (120€), Meteo (25€), Bono (150€)
REGEX_TARIFF_J80 = re.compile(
    r'(?:J80|J-80|j\s*80)[\s\S]{0,60}?(?P<amount>180(?:[\.,]00)?)\s*(?P<currency>€|euros?)'
    r'|'
    r'(?P<amount_alt>180(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)[\s\S]{0,60}?(?:J80|J-80|j\s*80)',
    re.IGNORECASE
)

REGEX_TARIFF_LASER = re.compile(
    r'(?:L[aá]ser|ILCA|laser)[\s\S]{0,60}?(?P<amount>120(?:[\.,]00)?)\s*(?P<currency>€|euros?)'
    r'|'
    r'(?P<amount_alt>120(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)[\s\S]{0,60}?(?:L[aá]ser|ILCA|laser)',
    re.IGNORECASE
)

REGEX_TARIFF_METEO = re.compile(
    r'(?:Meteorolog[ií]a|meteo)[\s\S]{0,60}?(?P<amount>25(?:[\.,]00)?)\s*(?P<currency>€|euros?)(?:\s*/\s*d[ií]a)?'
    r'|'
    r'(?P<amount_alt>25(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)(?:\s*/\s*d[ií]a)?[\s\S]{0,60}?(?:Meteorolog[ií]a|meteo)',
    re.IGNORECASE
)

REGEX_TARIFF_BONO = re.compile(
    r'(?:bono|abono)[\s\S]{0,60}?(?P<amount>150(?:[\.,]00)?)\s*(?P<currency>€|euros?)'
    r'|'
    r'(?P<amount_alt>150(?:[\.,]00)?)\s*(?P<currency_alt>€|euros?)[\s\S]{0,60}?(?:bono|abono)',
    re.IGNORECASE
)

# General Money / Amount pattern
REGEX_GENERAL_PRICE = re.compile(
    r'(?P<amount>\d+(?:[\.,]\d{1,2})?)\s*(?P<currency>€|euros?)\b',
    re.IGNORECASE
)

# 5. KEY ACTORS & PERSONNEL
REGEX_PERSON = re.compile(
    r'\b(?P<person_name>'
    r'Urko\s+Santillan(?:\s+Soriano)?'
    r'|Urko'
    r'|Angharad\s+Arambalza(?:\s+Bernaola)?'
    r'|Angharad'
    r'|Ibai\s+Santillan(?:\s+Soriano)?'
    r'|Ibai\s+Encina(?:\s+I[ñn]iguez(?:\s+de\s+Ciriano)?)?'
    r'|Gorka\s+P[eé]rez(?:\s+Landa)?'
    r'|Luciano\s+Jos[eé](?:\s+Natali)?'
    r'|Antonio\s+Vallejo'
    r'|Alberto\s+Valin'
    r'|Alex\s+Txiruka'
    r'|Ibon\s+Basa[ñn]ez'
    r'|Gonzalo\s+Arag[oó]n'
    r'|Imiau\s+Escocia'
    r')\b',
    re.IGNORECASE
)

# 6. ROLES
REGEX_ROLE = re.compile(
    r'\b(?P<role_title>'
    r'Director(?:a)?'
    r'|Presidente|Presidenta'
    r'|Entrenador(?:a)?'
    r'|Monitor(?:a)?'
    r'|Begirale(?:a)?'
    r'|Comodoro'
    r'|Tesorero|Tesorera'
    r'|Secretario|Secretaria'
    r'|Capit[aá]n'
    r'|Patr[oó]n(?:a)?'
    r'|Skipper'
    r'|Socio|Socia'
    r')\b',
    re.IGNORECASE
)

# 7. LICENSES & FEDERATIONS
REGEX_LICENSE = re.compile(
    r'\b(?P<license_entity>'
    r'licencia(?:\s+federativa|\s+de\s+la\s+federaci[oó]n)?'
    r'|Federaci[oó]n\s+Vasca\s+de\s+Vela'
    r'|Euskal\s+Bela\s+Federazioa'
    r'|Real\s+Federaci[oó]n\s+Espa[ñn]ola\s+de\s+Vela'
    r'|RFEV'
    r'|FVV'
    r'|EBF'
    r'|licencia'
    r')\b',
    re.IGNORECASE
)

# 8. OMITTED DOCUMENT ATTACHMENTS
REGEX_DOC_PLACEHOLDER = re.compile(
    r'^(?P<prefix>\[Reenviado\]\s*)?<documento omitido>\s*(?P<filename>.+?)(?:\s+•\s+(?P<meta>.*))?$',
    re.DOTALL | re.IGNORECASE
)

# -------------------------------------------------------------
# BENCHMARK & EXTRACTION SIMULATION
# -------------------------------------------------------------

stats = defaultdict(int)
extracted_entities = []
extracted_docs = []

for m in messages:
    mid = m['msg_id']
    sender = m['sender']
    content = m['content'] or ""
    
    # Check Club
    for match in REGEX_CLUB.finditer(content):
        val = match.group('club_entity')
        stats['CLUB'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'CLUB', 'value': val, 'start': match.start()})
        
    # Check CIF Club
    for match in REGEX_CIF_CLUB.finditer(content):
        val = match.group('cif_val').replace('-', '').replace(' ', '').upper()
        stats['CIF_CLUB'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'CIF', 'value': val, 'start': match.start()})
        
    # Check IBAN Club
    for match in REGEX_IBAN_CLUB.finditer(content):
        val = re.sub(r'[\s\-]', '', match.group('iban')).upper()
        stats['IBAN_CLUB'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'IBAN', 'value': val, 'start': match.start()})

    # Check Masked Bank
    for match in REGEX_MASKED_ACCOUNT.finditer(content):
        val = f"*{match.group('last4')}"
        stats['MASKED_BANK'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'IBAN', 'value': val, 'start': match.start()})

    # Check Any IBAN
    for match in REGEX_IBAN_ANY.finditer(content):
        val = re.sub(r'[\s\-]', '', match.group('iban')).upper()
        stats['IBAN_ANY'] += 1
        
    # Check Cuotas
    for match in REGEX_CUOTA.finditer(content):
        amt = match.group('amount') or match.group('amount_alt')
        stats['CUOTA_100'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'CUOTA', 'value': f"{amt} EUR", 'start': match.start()})

    # Check Tariffs
    for match in REGEX_TARIFF_J80.finditer(content):
        stats['TARIFF_J80'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'TARIFF', 'value': 'J80 180 EUR', 'start': match.start()})
    for match in REGEX_TARIFF_LASER.finditer(content):
        stats['TARIFF_LASER'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'TARIFF', 'value': 'LASER 120 EUR', 'start': match.start()})
    for match in REGEX_TARIFF_METEO.finditer(content):
        stats['TARIFF_METEO'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'TARIFF', 'value': 'METEO 25 EUR/day', 'start': match.start()})
    for match in REGEX_TARIFF_BONO.finditer(content):
        stats['TARIFF_BONO'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'TARIFF', 'value': 'BONO 150 EUR', 'start': match.start()})

    # Check Actors
    for match in REGEX_PERSON.finditer(content):
        val = match.group('person_name')
        stats['PERSON'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'PERSON', 'value': val, 'start': match.start()})

    # Check Roles
    for match in REGEX_ROLE.finditer(content):
        val = match.group('role_title')
        stats['ROLE'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'ROLE', 'value': val, 'start': match.start()})

    # Check Licenses
    for match in REGEX_LICENSE.finditer(content):
        val = match.group('license_entity')
        stats['LICENSE'] += 1
        extracted_entities.append({'msg_id': mid, 'type': 'LICENSE', 'value': val, 'start': match.start()})

    # Check Doc Placeholders
    m_doc = REGEX_DOC_PLACEHOLDER.match(content.strip())
    if m_doc:
        stats['DOC_PLACEHOLDER'] += 1
        fn = m_doc.group('filename').strip()
        ext_m = re.search(r'\.([a-zA-Z0-9]+)$', fn)
        ext = ext_m.group(1).lower() if ext_m else 'NONE'
        extracted_docs.append({
            'msg_id': mid,
            'filename': fn,
            'extension': ext,
            'is_forwarded': bool(m_doc.group('prefix')),
            'metadata': m_doc.group('meta')
        })

print("\n--- REGEX BENCHMARK EXTRACTION COUNTS ---")
for cat, cnt in sorted(stats.items()):
    print(f"  {cat}: {cnt}")

print(f"\nTotal extracted entities: {len(extracted_entities)}")
print(f"Total extracted documents: {len(extracted_docs)}")

conn.close()
