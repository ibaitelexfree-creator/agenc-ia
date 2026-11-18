# Forensic Entity Taxonomy & Extraction Blueprint
**Milestone M2: Text Forensics & Lexical Indexer**  
*Agent*: Explorer M2-2 (Entity Taxonomy & Regex Pattern Specialist)  
*Date of Audit*: 2026-10-28  
*Target Database*: `whatsapp_forensics.db` (STRICTLY READ-ONLY via `?mode=ro`, 10,055 messages, 392 conversations)  
*Destination Ledger*: `run_evidence.db` (`text_forensic_entities` table)

---

## 1. Executive Summary & Methodology

A comprehensive, non-destructive, read-only forensic investigation was conducted across the 10,055 messages and 392 contacts in `whatsapp_forensics.db`. The objective was to catalog all institutional, legal, financial, personnel, and artifact mentions, formulating high-precision regular expressions and extraction recipes for Milestone M2.

### 1.1 Key Extraction Metrics
- **Club Mentions**: 114 messages containing 183 distinct occurrences of club entity names and aliases.
- **Fiscal Identifiers**: 3 messages with the club's registered CIF (`G95526299` / `g95526299`), plus external personal NIFs (e.g. `16089994E`, `14605051M`, `72733031q`).
- **Banking Infrastructure**:
  - Primary Club Account: `ES43 2095 0000 7091 0910 0619` (Kutxabank / BBK) sent unspaced (`ES4320950000709109100619`) in 8 formal messages.
  - Masked Account: `*0619` identified in 6 automated transfer receipt notifications.
  - Personal / Auxiliary Accounts: 3 other distinct IBANs mapped to specific actors (Angharad, Gorka Pérez Landa, La Forja Berria).
  - Bizum: 23 messages detailing payment practices, internal transfers, and club cash/transfer reconciliation.
- **Financial Tariffs & Dues**: Complete fee schedules confirmed for Member Dues (100 € monthly), J80 Initiation (180 €), Laser ILCA Initiation (120 €), Marine Meteorology (25 €/day), and Navigation Vouchers (150 €).
- **Omitted Documents**: Exactly 161 messages with `is_attachment = 0` containing `<documento omitido>` were cataloged (118 `.pdf`, 16 `.docx`, 9 `.apk`, 1 `.txt`, 17 extensionless captions). Our formulated regex achieved **161 / 161 (100.0%) precision**.

---

## 2. Club Entity Taxonomy (`CLUB`)

### 2.1 Entity Profile & Legal Structure
The sailing operation consists of a commercial identity operating under a legally registered non-profit sports association:
- **Commercial Identity**: **Getxo Bela Eskola** (abbreviated as **GBE** or **Bela Eskola**).
- **Official Registered Corporate Entity**: **Asociación Club Deportivo Vela Pakea Munduari Itzulia** (registered in Basque Sports Registry; also referenced as *Asociación Club Deportivo Pakea Munduari Itzulia* or *ASOC. CLUB DEPORTIVO VELA PAKEA MUNDUARI ITZULIA GETXO*).
- **Physical Headquarters**:
  - `Pabellón Vela, S/N, Puerto Deportivo de Getxo, 48992 Getxo, Vizcaya` (`MSG_0001208`).
  - `Marqués de Arriluce e Ibarra Kalea, 3D, 48992 Getxo, Bizkaia` (`MSG_0004398`).
- **Official Contact Lines**:
  - Landline: `94 491 66 32` (`944916632`)
  - WhatsApp Line: `+34 634 40 56 24` (`634405624` / `634 405 624`)
  - Official Email: `info@getxobelaeskola.com`

### 2.2 Occurrence Breakdown in Messages
| Entity Alias | Message Matches | Representative Message IDs | Primary Context |
| :--- | :--- | :--- | :--- |
| **Getxo Bela Eskola** | 93 | `MSG_0000202`, `MSG_0001208`, `MSG_0002106`, `MSG_0002107`, `MSG_0002112`, `MSG_0004398` | Course announcements, official headers, client welcome messages |
| **Bela Eskola** | 102 | `MSG_0000202`, `MSG_0003793`, `MSG_0005612` | Informal references by coaches and members |
| **GBE** | 7 | `MSG_0000244`, `MSG_0001271`, `MSG_0001274`, `MSG_0005521` | Acronym used in file guides, contact notes, and transfer memos |
| **Pakea** | 23 | `MSG_0000202`, `MSG_0000301`, `MSG_0001208`, `MSG_0003793`, `MSG_0004398` | Bank beneficiary name, club regatta team |
| **Munduari Itzulia** | 12 | `MSG_0000202`, `MSG_0001208`, `MSG_0001948`, `MSG_0003793`, `MSG_0004398`, `MSG_0004911` | Official corporate entity suffix |
| **Asociación Club Deportivo...** | 11 | `MSG_0000202`, `MSG_0001208`, `MSG_0003793`, `MSG_0004398` | Formal bank headers, invoices, legal statements |

### 2.3 Regex Specification: `CLUB`
```python
REGEX_CLUB = re.compile(
    r'\b(?P<club_entity>'
    r'Getxo\s+Bela\s+Eskola'
    r'|Asociaci[oó]n\s+Club\s+Deportivo\s+(?:Vela\s+)?Pakea\s+Munduari\s+Itzulia(?:\s+Getxo)?'
    r'|Club\s+Deportivo\s+(?:Vela\s+)?Pakea(?:\s+Munduari\s+Itzulia)?'
    r'|Vela\s+Pakea(?:\s+Munduari\s+Itzulia)?'
    r'|Pakea\s+Munduari\s+Itzulia'
    r'|Pakea'
    r'|Bela\s+Eskola'
    r'|GBE'
    r')\b',
    re.IGNORECASE
)
```

**Normalization Rule**:
- Any match equal to or containing `Pakea` and `Munduari` -> Canonical Value: `Asociación Club Deportivo Vela Pakea Munduari Itzulia`.
- Any match of `Getxo Bela Eskola`, `Bela Eskola`, or `GBE` -> Canonical Value: `Getxo Bela Eskola`.

---

## 3. Financial & Legal Identifiers (`CIF`, `IBAN`)

### 3.1 Fiscal Identifiers (CIF / NIF / DNI)
The club's fiscal code appears in 3 formal messages:
- `MSG_0001208`: `Razón social: Asociación club deportivo vela Pakea munduari itzulia ... CIF: G95526299`
- `MSG_0003793`: `Para la factura de la fotocopisteria necesito NIF g95526299 aSOCIACIÓN CLUB DEPORTIVO PAKEA MUNDUARI ITZULIA de la Bela Eskola` (Note lowercase `g95526299` and `NIF` prefix!)
- `MSG_0004398`: `Nombre comercial: Getxo Bela Eskola Razón social: Asociación club deportivo vela Pakea munduari itzulia ... CIF: G95526299`

#### Regex Specification: `CIF`
```python
REGEX_CIF_CLUB = re.compile(
    r'\b(?:CIF|NIF)?[\s:]*(?P<cif_val>G[- ]?95526299)\b',
    re.IGNORECASE
)

# General Spanish CIF / NIF / DNI extractor
REGEX_ID_DOCUMENT = re.compile(
    r'\b(?P<id_type>CIF|NIF|DNI)?[\s:]*(?P<id_val>[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]|[0-9]{8}[A-Z])\b',
    re.IGNORECASE
)
```

### 3.2 Banking Accounts & IBANs (`IBAN`)
The corpus contains 4 distinct IBANs, each fulfilling a distinct forensic role:

| Account IBAN | Bank / Entity | Associated Entity / Person | Mentions | Evidentiary Role |
| :--- | :--- | :--- | :--- | :--- |
| **`ES43 2095 0000 7091 0910 0619`** | Kutxabank / BBK (2095-0000) | **Asociación Club Deportivo Vela Pakea Munduari Itzulia** | 8 direct messages + 6 receipts (`*0619`) | **Primary Operating Club Account**. Sent to clients for course fees, member dues, and vouchers. |
| **`ES09 2095 0114 6191 2333 6251`** | Kutxabank (2095-0114) | **Angharad Arambalza Bernaola** | `MSG_0007864` | Personal account used by Angharad for trip/logistics reimbursement. |
| **`ES85 2100 2692 6913 0062 0978`** | CaixaBank (2100-2692) | **Gorka Pérez Landa** (NIF `14605051M`) | `MSG_0003760`, `MSG_0003821` | External instructor account for Marine Meteorology course payment (500 €). |
| **`ES03 3008 0238 2957 1484 0427`** | Caja Rural de Navarra (3008-0238) | **La Forja Berria** | 10 messages (`MSG_0005089` to `MSG_0005118`) | Commercial supplier for iron/metal fittings. |

#### Standard Club Banking Broadcast Template
In messages `MSG_0000202`, `MSG_0000301`, `MSG_0001948`, `MSG_0002400`, `MSG_0004911`, `MSG_0005548`, `MSG_0005696`, `MSG_0005857`, Urko issues this exact message:
> *"Cuenta del banco: ASOC. CLUB DEPORTIVO VELA PAKEA MUNDUARI ITZULIA GETXO ES4320950000709109100619 Poned en concepto nombre (y si entra apellidos) y que se paga (ejemplo: J80 tecni mier, udaleku, equipo entren opt...) Ejemplo completo: Jon Saitua Salida J80 Y cuando nos hayáis hecho la transferencia pasadnos captura de justificante al wasap o mail. Un saludo"*

#### Regex Specification: `IBAN`
```python
# Primary Club IBAN (handles spaced, unspaced, and hyphenated)
REGEX_IBAN_CLUB = re.compile(
    r'\b(?P<iban>ES43[\s\-]*(?:2095)[\s\-]*(?:0000)[\s\-]*(?:7091)[\s\-]*(?:0910)[\s\-]*(?:0619))\b',
    re.IGNORECASE
)

# Masked account *0619 in transfer notifications
REGEX_MASKED_ACCOUNT = re.compile(
    r'(?:Cuenta|Cta\.?|cuenta)[\s:]*\*(?P<last4>0619)\b',
    re.IGNORECASE
)

# Generic SEPA IBAN (All 24 alphanumeric chars)
REGEX_IBAN_GENERIC = re.compile(
    r'\b(?P<iban>[A-Z]{2}[0-9]{2}(?:[\s\-]?[0-9]{4}){5})\b',
    re.IGNORECASE
)
```

### 3.3 Transfer Receipt Extraction Recipe
The bank auto-notification template observed in `MSG_0005521`, `MSG_0005522`, `MSG_0005626`, `MSG_0005630`, `MSG_0005631`, `MSG_0005704`:
```python
REGEX_TRANSFER_NOTIFICATION = re.compile(
    r'Se ha ordenado una transferencia con los siguientes datos:\s*'
    r'Ordenante:\s*(?P<ordenante>[^\n\r]+?)\s*'
    r'Importe:\s*(?P<importe>[\d\.,]+)\s*€\s*'
    r'Cuenta:\s*(?P<cuenta>[^\n\r]+?)\s*'
    r'Beneficiario:\s*(?P<beneficiario>[^\n\r]+?)\s*'
    r'Concepto:\s*(?P<concepto>[^\n\r]+?)\s*'
    r'Llegada:\s*(?P<llegada>[^\n\r]+)',
    re.IGNORECASE | re.DOTALL
)
```

### 3.4 Bizum Forensic Context
23 messages reference Bizum. Critical evidentiary observations:
1. **Club Policy**: Urko explicitly states in `MSG_0005484`: *"Normalmente lo hace Angharad en excepciones raras. Yo ni acepto bizum... Al haber hecho bizum le perdí el rastro a éste ingreso."*
2. **Operational Exceptions**:
   - Angharad accepted Bizum directly for casual boat rentals (e.g. Lucía in `MSG_0005481`).
   - Shared boat expenses / marina haul-out: Ignacio paid 300 € and 404 € via Bizum to Angharad for antifouling and travel lift (`MSG_0006406`, `MSG_0006408`).
   - Instructor cash-out / private hours: Urko instructed Mikel in `MSG_0005612`: *"35€/h. 52,5€ 😉 Eskuz hemendik pasatzen zareb egunen batean edo egidazu bizuma niri, eta gero nik moldatzen naiz eskolarekin"*.

---

## 4. Financial Tariffs & Membership Dues (`CUOTA`, `TARIFF`)

### 4.1 Fee Schedule Catalog
| Category | Official Tariff | Duration / Details | Verbatim Text Sample | Evidentiary Message IDs |
| :--- | :--- | :--- | :--- | :--- |
| **Cuota de Socio** | **100,00 € / mes** | Standard monthly club membership | *"Importe: 100,00 € Cuenta: \*0619 Concepto: LUCIANO NATALI ( CUOTA 5 EN 2026)"* | `MSG_0005521`, `MSG_0005522` |
| **Curso J80 Iniciación** | **180,00 €** | 12 hours (3 days x 4h: 10:00–14:00) | *"180 € por persona, curso completo. 12 horas de curso repartidas en 3 días."* | `MSG_0002107`, `MSG_0001990`, `MSG_0004818` |
| **Curso Láser ILCA** | **120,00 €** | 8 hours (2 days x 4h: 10:00–14:00) | *"120 € el curso completo —8 horas— Puerto Deportivo de Getxo"* | `MSG_0002106`, `MSG_0001996`, `MSG_0004553` |
| **Curso Meteorología** | **25,00 € / día** | 4 hours/day (9:30–13:30, 26-27 Sept) | *"25 €/día Aforo limitado: 25 personas... curso de Meteorología para navegar"* | `MSG_0000211`, `MSG_0001951`, `MSG_0001978` |
| **Curso KONPONDU** | Workshop | Fiber, gelcoat & epoxy boat maintenance | *"¡KONPONDU en Getxo Bela Eskola! ... trabajaremos con fibra, gelcoat y epoxy"* | `MSG_0002108`, `MSG_0003656`, `MSG_0004756` |
| **Bono de Navegación** | **150,00 €** | 4 sailing outings (salidas) | *"He hecho 3 salidas y el lunes o el martes haré la cuarta. Acabo de hacer la transferencia de 150."* | `MSG_0005698`, `MSG_0005630`, `MSG_0005631` |
| **Salida Suelta / Hora** | **35,00 € / h** | Private instruction / individual outing | *"17:10 tik 18:40 arte 1h 30min. 35€/h. 52,5€"* | `MSG_0005612`, `MSG_0005704` (45 €) |

### 4.2 Regex Extraction Blueprints: `CUOTA` and `TARIFF`

```python
# General Currency Amount Extractor
REGEX_PRICE = re.compile(
    r'(?P<amount>\d+(?:[\.,]\d{1,2})?)\s*(?P<currency>€|euros?)\b',
    re.IGNORECASE
)

def classify_financial_mention(amount_float, context_text):
    """
    Context-aware classifier mapping amount + local window to CUOTA or TARIFF.
    """
    ctx = context_text.lower()
    
    # 1. Membership Dues (100 €)
    if abs(amount_float - 100.0) < 0.01:
        if any(w in ctx for w in ['cuota', 'socio', 'socia', 'mensual', 'abono']):
            return 'CUOTA', '100.00 EUR (Monthly Membership Due)', 0.95
        return 'CUOTA', '100.00 EUR', 0.80

    # 2. J80 Initiation Course (180 €)
    if abs(amount_float - 180.0) < 0.01:
        if any(w in ctx for w in ['j80', 'j-80', 'iniciaci', 'curso']):
            return 'TARIFF', 'J80 Initiation Course (180.00 EUR)', 0.95
        return 'TARIFF', '180.00 EUR', 0.80

    # 3. Laser ILCA Course (120 €)
    if abs(amount_float - 120.0) < 0.01:
        if any(w in ctx for w in ['laser', 'láser', 'ilca', 'ligera']):
            return 'TARIFF', 'Laser ILCA Initiation Course (120.00 EUR)', 0.95
        return 'TARIFF', '120.00 EUR', 0.80

    # 4. Meteorology Course (25 €)
    if abs(amount_float - 25.0) < 0.01:
        if any(w in ctx for w in ['meteo', 'meteorolog', 'día', 'dia']):
            return 'TARIFF', 'Meteorology Course (25.00 EUR/day)', 0.95
        return 'TARIFF', '25.00 EUR', 0.80

    # 5. Laser Outing Voucher (150 €)
    if abs(amount_float - 150.0) < 0.01:
        if any(w in ctx for w in ['bono', 'salida', 'abono', 'transferencia']):
            return 'TARIFF', 'Laser Outing Voucher (150.00 EUR / 4 sessions)', 0.95
        return 'TARIFF', '150.00 EUR', 0.80

    return 'TARIFF', f'{amount_float:.2f} EUR', 0.60
```

---

## 5. Key Actors & Personnel Roles (`PERSON`, `ROLE`)

### 5.1 Comprehensive Person Directory
```
+--------------------------------------------------------------------------------------------------+
| Person Name              | Forensic Identifiers & Contact Details      | Official Forensic Role  |
+--------------------------+---------------------------------------------+-------------------------+
| Urko Santillan Soriano   | DNI: 16089994E (DOB 03-10-1989)             | School Director, Head   |
|                          | Email: urkosantillan@hotmail.es             | Coach, Custodian ("Tú") |
|                          | Phone: 94 491 66 32                         |                         |
+--------------------------+---------------------------------------------+-------------------------+
| Angharad Arambalza       | Mobile: +34 634 40 56 24                    | President, Managing     |
| Bernaola                 | Email: anghaaram@gmail.com                  | Director, Finance/Admin |
|                          | Kutxabank: ES09 2095 0114 6191 2333 6251    |                         |
+--------------------------+---------------------------------------------+-------------------------+
| Ibai Santillan Soriano   | Mentioned by Ama (CONV_WEB_0063, MSG_000998)| Urko's brother, resident|
|                          | Resides in Bangkok, Thailand                | in Bangkok (Family)     |
+--------------------------+---------------------------------------------+-------------------------+
| Ibai Encina Iñiguez      | DNI: 72733031q (MSG_0007893)                | Crew Member / Sailor    |
| de Ciriano               | Contact: "Ibai Colega De Paco Spoofer"      | (Spoofer Regatta Trip)  |
+--------------------------+---------------------------------------------+-------------------------+
| Asier                    | Contact: "Asier Monitor 420"                | 420 Class Monitor,      |
|                          |                                             | Uretan Blai Coordinator |
+--------------------------+---------------------------------------------+-------------------------+
| Gonzalo Aragón           | Contact: "Gonzalo Aragón Equipo 420 Monitor"| Competitive 420 Coach   |
+--------------------------+---------------------------------------------+-------------------------+
| Eneko                    | Contact: "Eneko Equipo 420"                 | Head Coach 420 Fleet    |
+--------------------------+---------------------------------------------+-------------------------+
| Ibon Basañez             | Contact: "Ibon Basañez GBE"                 | J80 Skipper, Cruiser    |
|                          |                                             | Coach                   |
+--------------------------+---------------------------------------------+-------------------------+
| Rafa                     | Contact: "Rafa Argentino Pakea"             | Pakea Regatta Coach     |
+--------------------------+---------------------------------------------+-------------------------+
| Gorka Pérez Landa        | NIF: 14605051M, gorka.perez@protonmail.com  | External Meteorology    |
|                          | CaixaBank: ES85 2100 2692 6913 0062 0978    | Instructor              |
+--------------------------+---------------------------------------------+-------------------------+
| Luciano José Natali      | Contact: "Lutxo Socio GBE"                  | Confirmed Member        |
|                          | Concept: "LUCIANO NATALI (CUOTA 5/6 EN 2026)"| (Dues payer)            |
+--------------------------+---------------------------------------------+-------------------------+
| Antonio Vallejo          | Contact: "Antonio Vallejo Curso J80 Aita..."| Technical Guide Author  |
|                          | Author: Laser & 420 Rigging Manuals         | (Laser & 420 Guides)    |
+--------------------------+---------------------------------------------+-------------------------+
| Alex Txiruka             | Contact: "Alex Txiruka" (663 messages)      | Senior Member, Fleet    |
|                          |                                             | Maintenance             |
+--------------------------+---------------------------------------------+-------------------------+
| Imiau Escocia            | Author of MSG_0004508 forensic directive    | External Forensic       |
|                          |                                             | Audit Advisor           |
+--------------------------+---------------------------------------------+-------------------------+
```

### 5.2 Critical Forensic Disambiguation: Ibai Santillan vs Ibai Encina
An essential forensic clarification for the audit:
1. **Ibai Santillan Soriano**: Brother of director Urko Santillan Soriano. Mentioned exclusively in conversation `CONV_WEB_0063 - Ama` (`MSG_0000998` and `MSG_0001031`). His mother notes: *"Tu hermano vive al Sureste [en Bangkok]... os lo he mandado a ti y a Ibai"*.
2. **Ibai Encina Iñiguez de Ciriano**: Contact `Ibai Colega De Paco Spoofer` in `CONV_WEB_0333` and `CONV_WEB_0344`. In `MSG_0007893`, he provides his DNI: `Ibai Encina Iñiguez de Ciriano 72733031q` for passenger manifesto on the Spoofer cruise.
The M2 extraction pipeline must distinguish these two individuals during entity resolution.

### 5.3 Regex Blueprint: `PERSON` & `ROLE`
```python
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
    r'|Eneko'
    r'|Imiau\s+Escocia'
    r')\b',
    re.IGNORECASE
)

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
```

---

## 6. Omitted Document Attachments & Placeholder Regex

### 6.1 The Document Extraction Anomaly
In `whatsapp_forensics.db`, 161 messages represent shared files that were exported by WhatsApp Web with the string `<documento omitido>`. The baseline database ingest assigned `is_attachment = 0` to all 161 rows!
These 161 records represent the primary institutional documents, course guides, invoices, and bank transfer PDFs exchanged between the club and its members.

### 6.2 Format Breakdown
- **Total `<documento omitido>` Messages**: **161**
- **Extension Breakdown**:
  - `.pdf`: **118** files (Course forms, enrollment sheets, bank transfer receipts)
  - `.docx`: **16** files (Curricula, meeting minutes, presentation drafts)
  - `.apk`: **9** files (Mobile app packages: `base.apk`, etc.)
  - `.txt`: **1** file (`Registro horas txiruka julio.txt`)
  - Extensionless / Descriptive Titles: **17** items (e.g., `Tabla de precios actualizada`, `DOC-20260801-WA0000.`)

### 6.3 Validated Regex Specification
Tested against all 10,055 messages with **100.0% match rate (161/161)** and zero false positives:

```python
REGEX_DOC_PLACEHOLDER = re.compile(
    r'^(?P<prefix>\[Reenviado\]\s*)?<documento omitido>\s*(?P<filename>.+?)(?:\s+•\s+(?P<meta>.*))?$',
    re.DOTALL | re.IGNORECASE
)
```

#### Extraction & Normalization Recipe:
```python
def extract_document_placeholder(content):
    m = REGEX_DOC_PLACEHOLDER.match(content.strip())
    if not m:
        return None
    raw_fn = m.group('filename').strip()
    is_fwd = bool(m.group('prefix'))
    meta = m.group('meta')
    
    # Check extension
    ext_match = re.search(r'\.([a-zA-Z0-9]+)$', raw_fn)
    if ext_match:
        extension = ext_match.group(1).lower()
        clean_name = raw_fn
    else:
        extension = 'NONE'
        clean_name = raw_fn
        
    return {
        'clean_filename': clean_name,
        'extension': extension,
        'is_forwarded': is_fwd,
        'trailing_metadata': meta
    }
```

---

## 7. Complete Entity Dictionary & M2 Worker Blueprint

### 7.1 Unified M2 Python Module: `text_forensics.py` Architecture
The M2 Worker (`text_forensics.py`) will execute in read-only mode against `whatsapp_forensics.db` and write extracted entities directly into `run_evidence.db`.

```python
"""
M2 Worker Implementation Blueprint: text_forensics.py
Extracts entities and repairs timestamps into run_evidence.db
"""
import sqlite3
import re
from datetime import datetime

# Compile all regex patterns once
RE_CLUB = re.compile(r'\b(Getxo\s+Bela\s+Eskola|Asociaci[oó]n\s+Club\s+Deportivo\s+(?:Vela\s+)?Pakea\s+Munduari\s+Itzulia|Club\s+Deportivo\s+(?:Vela\s+)?Pakea|Vela\s+Pakea|Pakea|Bela\s+Eskola|GBE)\b', re.I)
RE_CIF_CLUB = re.compile(r'\b(?:CIF|NIF)?[\s:]*(G[- ]?95526299)\b', re.I)
RE_IBAN_CLUB = re.compile(r'\b(ES43[\s\-]*(?:2095)[\s\-]*(?:0000)[\s\-]*(?:7091)[\s\-]*(?:0910)[\s\-]*(?:0619))\b', re.I)
RE_MASKED_ACCOUNT = re.compile(r'(?:Cuenta|Cta\.?|cuenta)[\s:]*\*(0619)\b', re.I)
RE_IBAN_ANY = re.compile(r'\b([A-Z]{2}[0-9]{2}(?:[\s\-]?[0-9]{4}){5})\b', re.I)
RE_PRICE = re.compile(r'(\d+(?:[\.,]\d{1,2})?)\s*(€|euros?)\b', re.I)
RE_PERSON = re.compile(r'\b(Urko\s+Santillan(?:\s+Soriano)?|Urko|Angharad\s+Arambalza(?:\s+Bernaola)?|Angharad|Ibai\s+Santillan(?:\s+Soriano)?|Ibai\s+Encina(?:\s+I[ñn]iguez(?:\s+de\s+Ciriano)?)?|Gorka\s+P[eé]rez(?:\s+Landa)?|Luciano\s+Jos[eé](?:\s+Natali)?|Antonio\s+Vallejo|Alberto\s+Valin|Alex\s+Txiruka|Ibon\s+Basa[ñn]ez|Gonzalo\s+Arag[oó]n|Eneko|Imiau\s+Escocia)\b', re.I)
RE_ROLE = re.compile(r'\b(Director(?:a)?|Presidente|Presidenta|Entrenador(?:a)?|Monitor(?:a)?|Begirale(?:a)?|Comodoro|Tesorero|Tesorera|Secretario|Secretaria|Capit[aá]n|Patr[oó]n(?:a)?|Skipper|Socio|Socia)\b', re.I)
RE_LICENSE = re.compile(r'\b(licencia(?:\s+federativa|\s+de\s+la\s+federaci[oó]n)?|Federaci[oó]n\s+Vasca\s+de\s+Vela|Euskal\s+Bela\s+Federazioa|Real\s+Federaci[oó]n\s+Espa[ñn]ola\s+de\s+Vela|RFEV|FVV|EBF)\b', re.I)
RE_DOC_PLACEHOLDER = re.compile(r'^(?:\[Reenviado\]\s*)?<documento omitido>\s*(?P<filename>.+?)(?:\s+•\s+(?P<meta>.*))?$', re.I | re.DOTALL)

def synthesize_iso_timestamp(date_str, time_str):
    """Parses 'M/D/YY' and 'H:MM:SS AM/PM' into 'YYYY-MM-DDTHH:MM:SS'"""
    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%m/%d/%y %I:%M:%S %p")
        return dt.isoformat()
    except Exception:
        return None

def extract_message_entities(msg_id, sender, timestamp_iso, content):
    entities = []
    if not content:
        return entities
        
    # Helper to append
    def add(ent_type, val, conf=0.90):
        # Extract snippet around match
        entities.append((msg_id, sender, timestamp_iso, ent_type, val, content[:150], conf))

    # 1. CLUB
    for m in RE_CLUB.finditer(content):
        add('CLUB', m.group(1), 0.95)
        
    # 2. CIF
    for m in RE_CIF_CLUB.finditer(content):
        add('CIF', m.group(1).replace('-', '').replace(' ', '').upper(), 0.99)
        
    # 3. IBAN
    for m in RE_IBAN_CLUB.finditer(content):
        clean_iban = re.sub(r'[\s\-]', '', m.group(1)).upper()
        add('IBAN', clean_iban, 0.99)
    for m in RE_MASKED_ACCOUNT.finditer(content):
        add('IBAN', f"*{m.group(1)}", 0.95)
    for m in RE_IBAN_ANY.finditer(content):
        clean_iban = re.sub(r'[\s\-]', '', m.group(1)).upper()
        if clean_iban != 'ES4320950000709109100619':
            add('IBAN', clean_iban, 0.90)

    # 4. CUOTA & TARIFF
    for m in RE_PRICE.finditer(content):
        val = float(m.group(1).replace(',', '.'))
        ctx = content[max(0, m.start() - 100): min(len(content), m.end() + 100)].lower()
        if abs(val - 100.0) < 0.01 and any(w in ctx for w in ['cuota', 'socio', 'socia', 'abono']):
            add('CUOTA', '100.00 EUR (Monthly Due)', 0.95)
        elif abs(val - 180.0) < 0.01:
            add('TARIFF', 'J80 Initiation (180.00 EUR)', 0.95)
        elif abs(val - 120.0) < 0.01:
            add('TARIFF', 'Laser ILCA Initiation (120.00 EUR)', 0.95)
        elif abs(val - 25.0) < 0.01:
            add('TARIFF', 'Meteorology Course (25.00 EUR/day)', 0.95)
        elif abs(val - 150.0) < 0.01:
            add('TARIFF', 'Navigation Voucher (150.00 EUR)', 0.95)
        else:
            add('TARIFF', f"{val:.2f} EUR", 0.70)

    # 5. PERSON
    for m in RE_PERSON.finditer(content):
        add('PERSON', m.group(1), 0.90)

    # 6. ROLE
    for m in RE_ROLE.finditer(content):
        add('ROLE', m.group(1).capitalize(), 0.85)

    # 7. LICENSE
    for m in RE_LICENSE.finditer(content):
        add('LICENSE', m.group(1), 0.90)

    return entities
```

### 7.2 Interface Mapping to `run_evidence.db`
All extracted entities will be persisted into `text_forensic_entities` in `run_evidence.db`:
```sql
INSERT INTO text_forensic_entities (
    message_id, 
    sender, 
    timestamp_iso, 
    entity_type, 
    entity_value, 
    context_snippet, 
    confidence
) VALUES (?, ?, ?, ?, ?, ?, ?);
```

---

## 8. Summary of Findings

1. **Club Entities**: Getxo Bela Eskola operates as the public-facing brand of *Asociación Club Deportivo Vela Pakea Munduari Itzulia*, headquartered at Puerto Deportivo de Getxo.
2. **Fiscal Identification**: The club's CIF is verified as **`G95526299`** (registered under sports association classification).
3. **Banking Infrastructure**: The club's central account is **`ES43 2095 0000 7091 0910 0619`** (Kutxabank / BBK), referenced as `*0619` on member transfer slips.
4. **Member Tariffs**: Standard monthly dues are **100,00 €**; course rates are **180,00 €** (J80), **120,00 €** (Laser ILCA), and **25,00 €/day** (Meteorology).
5. **Key Actors**: Directed by Urko Santillan Soriano (DNI `16089994E`), managed and administered by Angharad Arambalza Bernaola (President/Treasurer). Ibai Santillan is Urko's brother in Bangkok, distinct from Ibai Encina (sailor).
6. **Attachment Placeholders**: 161 document placeholders were discovered with `is_attachment = 0`, 100% matched by our formulated regex recipe.
