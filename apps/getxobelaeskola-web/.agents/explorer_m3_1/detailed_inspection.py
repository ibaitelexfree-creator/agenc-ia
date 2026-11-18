import sqlite3
import os
import sys
import json
from pathlib import Path
import fitz

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
URI_DB = f"file:{DB_PATH.replace(os.sep, '/')}?mode=ro"

conn = sqlite3.connect(URI_DB, uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print("="*80)
print("INSPECTING THE TWO EXTENSIONLESS PDF FILES")
print("="*80)

cur.execute("""
SELECT file_id, rel_path, abs_path, file_size
FROM file_inventory
WHERE rel_path LIKE '%DOC-20251120-WA0006%' OR rel_path LIKE '%DOC-20260116-WA0000%'
""")
ext_docs = cur.fetchall()

for r in ext_docs:
    f_id = r['file_id']
    rel_p = r['rel_path']
    abs_p = r['abs_path']
    size = r['file_size']
    
    print(f"\n--- File ID {f_id}: {Path(abs_p).name} ---")
    print(f"Absolute Path: {abs_p}")
    print(f"File Size: {size} bytes ({round(size/1024, 2)} KB)")
    
    with open(abs_p, "rb") as f:
        head = f.read(64)
        print(f"Leading 32 bytes (hex): {head[:32].hex()}")
        print(f"Magic bytes: {head[:10]}")
        print(f"Starts with %PDF-: {head.startswith(b'%PDF-')}")
        
    doc = fitz.open(abs_p)
    print(f"PyMuPDF open success: True")
    print(f"Page count: {doc.page_count}")
    print(f"Is encrypted: {doc.is_encrypted}")
    print(f"Metadata: {json.dumps(doc.metadata, indent=2)}")
    
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text = page.get_text()
        images = page.get_images()
        drawings = page.get_drawings()
        print(f"  Page {page_num + 1}:")
        print(f"    - Extracted text length: {len(text.strip())} chars")
        if text.strip():
            print(f"    - Text preview: {repr(text.strip()[:200])}")
        print(f"    - Images count: {len(images)}")
        for img_idx, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            print(f"      Img {img_idx+1}: xref={xref}, ext={base_image['ext']}, width={base_image['width']}, height={base_image['height']}, colorspace={base_image['colorspace']}, size={len(base_image['image'])} bytes")
        print(f"    - Vector drawings count: {len(drawings)}")
    doc.close()

print("\n" + "="*80)
print("CHECKING FOR LEGACY OFFICE BINARY FORMATS (.doc, .xls) ACROSS CORPUS")
print("="*80)

CORPUS_ROOT = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip")
legacy_files = []
for root, dirs, files in os.walk(CORPUS_ROOT):
    if "forensics_multiagent_run" in root:
        continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in ['.doc', '.xls', '.ppt']:
            legacy_files.append(os.path.join(root, f))

print(f"Total legacy Office files found by extension (.doc, .xls, .ppt): {len(legacy_files)}")
for lf in legacy_files:
    print(f"  Legacy: {lf}")

# Check for OLE CFBF magic bytes across all files without standard office extension
print("\nScanning for OLE CFBF compound binary files (magic: D0 CF 11 E0 A1 B1 1A E1)...")
ole_cfbf_magic = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"
ole_matches = []
cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality IN ('DOCUMENT', 'OTHER')")
for r in cur.fetchall():
    if os.path.exists(r['abs_path']) and r['file_size'] >= 8:
        try:
            with open(r['abs_path'], "rb") as f:
                if f.read(8) == ole_cfbf_magic:
                    ole_matches.append((r['file_id'], r['rel_path'], r['file_size']))
        except Exception:
            pass

print(f"Files with OLE CFBF magic bytes in DOCUMENT or OTHER: {len(ole_matches)}")
for m in ole_matches:
    print(f"  OLE Match: {m}")

print("\n" + "="*80)
print("INSPECTING CHAT_TXT MODALITY (356 FILES) FOR ENCODING AND HEALTH")
print("="*80)

cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'CHAT_TXT'")
chat_txts = cur.fetchall()
enc_counts = {}
zero_byte_txts = []
unreadable_txts = []

for r in chat_txts:
    abs_p = r['abs_path']
    size = r['file_size']
    if size == 0:
        zero_byte_txts.append(r['rel_path'])
        continue
    if not os.path.exists(abs_p):
        unreadable_txts.append((r['rel_path'], "FILE_NOT_FOUND"))
        continue
    try:
        with open(abs_p, "rb") as f:
            data = f.read()
        try:
            data.decode("utf-8")
            enc = "utf-8"
        except UnicodeDecodeError:
            try:
                data.decode("utf-8-sig")
                enc = "utf-8-sig"
            except UnicodeDecodeError:
                try:
                    data.decode("latin-1")
                    enc = "latin-1"
                except UnicodeDecodeError:
                    enc = "unreadable"
                    unreadable_txts.append((r['rel_path'], "UNICODE_DECODE_FAILED"))
        enc_counts[enc] = enc_counts.get(enc, 0) + 1
    except Exception as e:
        unreadable_txts.append((r['rel_path'], str(e)))

print(f"Total CHAT_TXT files checked: {len(chat_txts)}")
print(f"Encoding distribution: {enc_counts}")
print(f"0-byte CHAT_TXT files: {len(zero_byte_txts)}")
print(f"Unreadable CHAT_TXT files: {len(unreadable_txts)}")
for u in unreadable_txts:
    print(f"  Unreadable: {u}")

conn.close()
