import sqlite3
import os
import sys
import json
import statistics
import traceback
from pathlib import Path

# Ensure dependencies from the venv are available
import fitz  # PyMuPDF
import docx  # python-docx
import openpyxl
from odf import opendocument, text as odf_text, table as odf_table

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
URI_DB = f"file:{DB_PATH.replace(os.sep, '/')}?mode=ro"

conn = sqlite3.connect(URI_DB, uri=True)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
SELECT file_id, rel_path, abs_path, file_size, sha256, modality, status, terminal_code, error_message
FROM file_inventory
WHERE modality = 'DOCUMENT'
ORDER BY file_id
""")
doc_rows = cur.fetchall()

print(f"Loaded {len(doc_rows)} rows from file_inventory WHERE modality='DOCUMENT'.")

profile_results = []

for r in doc_rows:
    f_id = r['file_id']
    rel_p = r['rel_path']
    abs_p = r['abs_path']
    db_size = r['file_size']
    p = Path(abs_p)
    ext = p.suffix.lower() if p.suffix else "[no_ext]"
    
    file_info = {
        "file_id": f_id,
        "rel_path": rel_p,
        "abs_path": abs_p,
        "filename": p.name,
        "extension": ext,
        "db_size": db_size,
        "exists": os.path.exists(abs_p),
        "actual_size": os.path.getsize(abs_p) if os.path.exists(abs_p) else -1,
        "magic_bytes_hex": None,
        "magic_bytes_ascii": None,
        "doc_type_detected": None,
        "is_encrypted": False,
        "page_or_sheet_count": None,
        "char_count": 0,
        "text_sample": None,
        "metadata": {},
        "tables_detected": 0,
        "anomalies": [],
        "read_error": None
    }
    
    if not file_info["exists"]:
        file_info["anomalies"].append("FILE_NOT_FOUND_ON_DISK")
        profile_results.append(file_info)
        continue
        
    if file_info["actual_size"] == 0:
        file_info["anomalies"].append("ZERO_BYTE_FILE")
        profile_results.append(file_info)
        continue
        
    # Read first 16 bytes for magic check
    try:
        with open(abs_p, "rb") as f:
            header = f.read(32)
            file_info["magic_bytes_hex"] = header[:8].hex()
            file_info["magic_bytes_ascii"] = repr(header[:16])
    except Exception as e:
        file_info["anomalies"].append(f"HEADER_READ_ERROR: {e}")
        profile_results.append(file_info)
        continue

    # 1. PDF analysis (fitz)
    if ext == ".pdf" or ext == "[no_ext]":
        is_pdf_magic = header.startswith(b"%PDF-")
        if not is_pdf_magic:
            file_info["anomalies"].append("NO_PDF_MAGIC_BYTES")
        else:
            file_info["doc_type_detected"] = "PDF"
            try:
                doc = fitz.open(abs_p)
                file_info["is_encrypted"] = bool(doc.is_encrypted)
                file_info["page_or_sheet_count"] = doc.page_count
                file_info["metadata"] = {k: v for k, v in doc.metadata.items() if v} if doc.metadata else {}
                
                # Extract text across pages
                full_text = []
                total_tables = 0
                has_images = 0
                for page_idx in range(doc.page_count):
                    page = doc[page_idx]
                    t = page.get_text()
                    full_text.append(t)
                    imgs = page.get_images()
                    has_images += len(imgs)
                    # Check table extraction
                    try:
                        tabs = page.find_tables()
                        total_tables += len(tabs.tables)
                    except Exception:
                        pass
                
                extracted_str = "\n".join(full_text)
                file_info["char_count"] = len(extracted_str.strip())
                file_info["tables_detected"] = total_tables
                file_info["image_count"] = has_images
                file_info["text_sample"] = extracted_str.strip()[:300].replace("\n", " ")
                
                if file_info["char_count"] == 0:
                    if has_images > 0:
                        file_info["anomalies"].append("SCANNED_PDF_NO_TEXT_NEEDS_OCR")
                    else:
                        file_info["anomalies"].append("BLANK_PDF")
                doc.close()
            except Exception as e:
                file_info["read_error"] = f"PyMuPDF error: {e}"
                file_info["anomalies"].append(f"PDF_PARSE_FAILED: {e}")

    # 2. DOCX analysis (python-docx)
    elif ext == ".docx":
        is_zip_magic = header.startswith(b"PK\x03\x04")
        if not is_zip_magic:
            file_info["anomalies"].append("NO_ZIP_MAGIC_FOR_DOCX")
        else:
            file_info["doc_type_detected"] = "DOCX"
            try:
                doc = docx.Document(abs_p)
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                full_text = "\n".join(paragraphs)
                file_info["char_count"] = len(full_text)
                file_info["page_or_sheet_count"] = len(doc.paragraphs)
                file_info["tables_detected"] = len(doc.tables)
                file_info["text_sample"] = full_text[:300].replace("\n", " ")
                # Read core properties
                props = doc.core_properties
                file_info["metadata"] = {
                    "author": props.author,
                    "title": props.title,
                    "created": str(props.created) if props.created else None,
                    "modified": str(props.modified) if props.modified else None
                }
            except Exception as e:
                file_info["read_error"] = f"python-docx error: {e}"
                file_info["anomalies"].append(f"DOCX_PARSE_FAILED: {e}")

    # 3. ODS analysis (odfpy)
    elif ext == ".ods":
        is_zip_magic = header.startswith(b"PK\x03\x04")
        if not is_zip_magic:
            file_info["anomalies"].append("NO_ZIP_MAGIC_FOR_ODS")
        else:
            file_info["doc_type_detected"] = "ODS"
            try:
                doc = opendocument.load(abs_p)
                tables = doc.getElementsByType(odf_table.Table)
                file_info["tables_detected"] = len(tables)
                file_info["page_or_sheet_count"] = len(tables)
                sheet_names = [t.getAttribute("name") for t in tables]
                file_info["metadata"] = {"sheet_names": sheet_names}
                
                # Extract text
                all_text = []
                for p_elem in doc.getElementsByType(odf_text.P):
                    txt = str(p_elem)
                    all_text.append(txt)
                combined = " ".join(all_text)
                file_info["char_count"] = len(combined)
                file_info["text_sample"] = combined[:300].replace("\n", " ")
            except Exception as e:
                file_info["read_error"] = f"odfpy error: {e}"
                file_info["anomalies"].append(f"ODS_PARSE_FAILED: {e}")

    # 4. XLSX analysis (openpyxl)
    elif ext == ".xlsx":
        is_zip_magic = header.startswith(b"PK\x03\x04")
        if not is_zip_magic:
            file_info["anomalies"].append("NO_ZIP_MAGIC_FOR_XLSX")
        else:
            file_info["doc_type_detected"] = "XLSX"
            try:
                wb = openpyxl.load_workbook(abs_p, read_only=True, data_only=True)
                file_info["page_or_sheet_count"] = len(wb.sheetnames)
                file_info["metadata"] = {"sheet_names": wb.sheetnames}
                total_cells = 0
                sample_lines = []
                for sname in wb.sheetnames:
                    sheet = wb[sname]
                    row_idx = 0
                    for row in sheet.iter_rows(values_only=True):
                        row_idx += 1
                        vals = [str(c) for c in row if c is not None]
                        if vals and len(sample_lines) < 5:
                            sample_lines.append(" | ".join(vals[:6]))
                        total_cells += len(vals)
                        if row_idx > 50:
                            break
                file_info["tables_detected"] = len(wb.sheetnames)
                file_info["text_sample"] = " // ".join(sample_lines)[:300]
                file_info["char_count"] = total_cells
                wb.close()
            except Exception as e:
                file_info["read_error"] = f"openpyxl error: {e}"
                file_info["anomalies"].append(f"XLSX_PARSE_FAILED: {e}")

    # 5. CSV analysis
    elif ext == ".csv":
        file_info["doc_type_detected"] = "CSV"
        try:
            # Detect encoding
            raw_bytes = open(abs_p, "rb").read(8192)
            enc = "utf-8"
            try:
                raw_bytes.decode("utf-8")
            except UnicodeDecodeError:
                enc = "latin-1"
            
            with open(abs_p, "r", encoding=enc, errors="replace") as f:
                lines = [f.readline() for _ in range(5)]
            file_info["metadata"] = {"encoding": enc, "header": lines[0].strip() if lines else ""}
            file_info["text_sample"] = "".join(lines)[:300].replace("\n", " // ")
            # count total lines
            with open(abs_p, "r", encoding=enc, errors="replace") as f:
                total_lines = sum(1 for _ in f)
            file_info["page_or_sheet_count"] = total_lines
            file_info["char_count"] = file_info["actual_size"]
        except Exception as e:
            file_info["read_error"] = f"CSV error: {e}"
            file_info["anomalies"].append(f"CSV_PARSE_FAILED: {e}")

    # 6. VCF analysis
    elif ext == ".vcf":
        file_info["doc_type_detected"] = "VCF"
        try:
            with open(abs_p, "r", encoding="utf-8", errors="replace") as f:
                vcf_text = f.read()
            cards = vcf_text.count("BEGIN:VCARD")
            file_info["page_or_sheet_count"] = cards
            file_info["char_count"] = len(vcf_text)
            file_info["text_sample"] = vcf_text[:300].replace("\n", " // ")
        except Exception as e:
            file_info["read_error"] = f"VCF error: {e}"
            file_info["anomalies"].append(f"VCF_PARSE_FAILED: {e}")

    else:
        file_info["anomalies"].append(f"UNRECOGNIZED_DOCUMENT_EXTENSION: {ext}")

    profile_results.append(file_info)

conn.close()

# Save detailed JSON report
out_json_path = r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m3_1\document_profile_data.json"
with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump(profile_results, f, indent=2, ensure_ascii=False)

print(f"\nDetailed profile written to {out_json_path}")

# Print summary
print("\n" + "="*80)
print("DOCUMENT PROFILING SUMMARY")
print("="*80)
for res in profile_results:
    print(f"[{res['file_id']:5}] {res['filename']:40} | Type: {str(res['doc_type_detected']):5} | Ext: {res['extension']:8} | Size: {res['actual_size']:8} B | Chars: {res['char_count']:6} | Pages/Sheets: {str(res['page_or_sheet_count']):4} | Encrypted: {res['is_encrypted']} | Anomalies: {res['anomalies']}")

