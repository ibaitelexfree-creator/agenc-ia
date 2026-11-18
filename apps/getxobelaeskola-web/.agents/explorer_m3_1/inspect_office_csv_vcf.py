import docx
import openpyxl
from odf import opendocument, text as odf_text, table as odf_table
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# 1. DOCX
docx_path = r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Informacion y deberes Iñaki Kit digital.docx"
print("=== DOCX Inspection ===")
doc = docx.Document(docx_path)
print(f"File: {Path(docx_path).name}")
print(f"Paragraphs count: {len(doc.paragraphs)}")
print(f"Tables count: {len(doc.tables)}")
paragraphs_text = [p.text for p in doc.paragraphs if p.text.strip()]
print(f"Non-empty paragraphs: {len(paragraphs_text)}")
print(f"First 3 paragraphs: {paragraphs_text[:3]}")
print(f"Total chars: {sum(len(t) for t in paragraphs_text)}")

# 2. ODS
ods_path = r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\whatsapp_conversaciones_y_ultima_conversacion.ods"
print("\n=== ODS Inspection ===")
ods = opendocument.load(ods_path)
tables = ods.getElementsByType(odf_table.Table)
print(f"File: {Path(ods_path).name}")
print(f"Sheet/Table count: {len(tables)}")
for t in tables:
    rows = t.getElementsByType(odf_table.TableRow)
    print(f"  Table name: {t.getAttribute('name')}, Row count: {len(rows)}")

# 3. XLSX
xlsx_paths = [
    r"C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\Master_WhatsApp_Analysis.xlsx",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\Master_WhatsApp_Analysis_Corrected_Full.xlsx"
]
print("\n=== XLSX Inspection ===")
for xp in xlsx_paths:
    wb = openpyxl.load_workbook(xp, read_only=True)
    print(f"File: {Path(xp).name}")
    print(f"  Sheets: {wb.sheetnames}")
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"    - Sheet '{sname}': max_row={sheet.max_row}, max_column={sheet.max_column}")
    wb.close()

# 4. CSV files summary
csv_dir = Path(r"C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results")
print("\n=== CSV Files in WhatsApp_Analysis_Results ===")
for cp in sorted(csv_dir.glob("*.csv")):
    line_count = sum(1 for _ in open(cp, "r", encoding="utf-8", errors="replace"))
    header = open(cp, "r", encoding="utf-8", errors="replace").readline().strip()
    print(f"  {cp.name:35} | {line_count:6} lines | Header: {header[:60]}...")

# 5. VCF files summary
vcf_dir = Path(r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org")
print("\n=== VCF Files in Urko Chat ===")
for vp in sorted(vcf_dir.glob("*.vcf")):
    content = open(vp, "r", encoding="utf-8", errors="replace").read()
    names = [line for line in content.splitlines() if line.startswith("FN:") or line.startswith("N:")]
    tels = [line for line in content.splitlines() if line.startswith("TEL")]
    print(f"  {vp.name:45} | Size: {vp.stat().st_size:4} B | Contact: {names[:2]} | Tel: {tels[:1]}")

