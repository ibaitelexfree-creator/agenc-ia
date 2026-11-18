"""
verify_m0.py - Milestone M0 Comprehensive Acceptance Criteria Verification
Milestone M0: WhatsApp Digital Forensic Multi-Agent Operation
Verifies all 8 acceptance criteria across infrastructure, CTranslate2 CUDA,
Tesseract-OCR, baseline SQLite snapshot, and run_evidence.db schema contracts.
"""

import hashlib
import json
import os
import shutil
import sqlite3
import sys
import time
from pathlib import Path
from typing import Dict, Any, List

def compute_sha256(path: Path) -> str:
    if not path.exists():
        return ""
    hasher = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def verify_all(target_dir_str: str = None) -> Dict[str, Any]:
    if not target_dir_str:
        target_dir = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run")
    else:
        target_dir = Path(target_dir_str)

    baseline_dir = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results")
    baseline_db = baseline_dir / "whatsapp_forensics.db"
    baseline_wal = baseline_dir / "whatsapp_forensics.db-wal"
    baseline_shm = baseline_dir / "whatsapp_forensics.db-shm"
    run_evidence_db = target_dir / "run_evidence.db"

    expected_sha256 = "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3"

    results = {
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "milestone": "M0",
        "verdict": "FAIL",
        "criteria": {}
    }

    print("=================================================================")
    print(" MILESTONE M0 COMPREHENSIVE ACCEPTANCE CRITERIA VERIFICATION")
    print("=================================================================")

    # CRITERION 1: Directory Topology
    print("[1/8] Verifying Directory Hierarchy...")
    subdirs = ["scripts", "tests", "reports", "logs", "checkpoints"]
    missing_subdirs = [s for s in subdirs if not (target_dir / s).is_dir()]
    c1_passed = len(missing_subdirs) == 0
    results["criteria"]["c1_directory_topology"] = {
        "passed": c1_passed,
        "target_dir": str(target_dir),
        "missing_subdirs": missing_subdirs
    }
    print(f"      Result: {'PASS' if c1_passed else 'FAIL'}")

    # CRITERION 2: Isolated .venv Python 3.12
    print("[2/8] Verifying Isolated .venv...")
    venv_py = target_dir / ".venv" / "Scripts" / "python.exe"
    c2_passed = venv_py.exists()
    results["criteria"]["c2_isolated_venv"] = {
        "passed": c2_passed,
        "venv_python": str(venv_py)
    }
    print(f"      Result: {'PASS' if c2_passed else 'FAIL'}")

    # CRITERION 3: Zero-PyTorch Guarantee & Lean Dependencies
    print("[3/8] Verifying Zero-PyTorch & Lean Dependencies...")
    torch_absent = False
    try:
        import torch
        torch_absent = False
    except ModuleNotFoundError:
        torch_absent = True

    required_pkgs = [
        "ctranslate2", "faster_whisper", "rapidocr_onnxruntime",
        "onnxruntime", "pytesseract", "fitz", "docx", "odf", "openpyxl", "pandas", "PIL"
    ]
    pkg_status = {}
    for p in required_pkgs:
        try:
            __import__(p)
            pkg_status[p] = True
        except ImportError:
            pkg_status[p] = False

    c3_passed = torch_absent and all(pkg_status.values())
    results["criteria"]["c3_lean_dependencies"] = {
        "passed": c3_passed,
        "torch_absent": torch_absent,
        "packages": pkg_status
    }
    print(f"      Zero PyTorch: {torch_absent} | Packages: {all(pkg_status.values())}")
    print(f"      Result: {'PASS' if c3_passed else 'FAIL'}")

    # CRITERION 4: CTranslate2 CUDA Device Detection
    print("[4/8] Verifying CTranslate2 CUDA compute support...")
    c4_passed = False
    try:
        # Load CUDA DLLs if needed
        try:
            from cuda_init import init_cuda_dlls
            init_cuda_dlls()
        except Exception:
            pass

        import ctranslate2
        cuda_count = ctranslate2.get_cuda_device_count()
        supported_types = list(ctranslate2.get_supported_compute_types("cuda", device_index=0)) if cuda_count > 0 else []
        c4_passed = (cuda_count >= 1) and ("float16" in supported_types)
        results["criteria"]["c4_ctranslate2_cuda"] = {
            "passed": c4_passed,
            "cuda_count": cuda_count,
            "supported_types": supported_types
        }
    except Exception as e:
        results["criteria"]["c4_ctranslate2_cuda"] = {
            "passed": False,
            "error": str(e)
        }
    print(f"      Result: {'PASS' if c4_passed else 'FAIL'}")

    # CRITERION 5: Tesseract-OCR Provisioning & Synthetic Test
    print("[5/8] Verifying Tesseract-OCR Provisioning & Binding...")
    c5_passed = False
    try:
        import pytesseract
        from PIL import Image, ImageDraw, ImageFont

        # Set TESSDATA_PREFIX if present in target_dir
        local_tessdata = target_dir / "tessdata"
        if local_tessdata.is_dir() and "TESSDATA_PREFIX" not in os.environ:
            os.environ["TESSDATA_PREFIX"] = str(local_tessdata)

        # Candidate paths
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
            str(target_dir / "tools" / "tesseract" / "tesseract.exe"),
            shutil.which("tesseract")
        ]
        tess_bin = None
        for c in candidates:
            if c and os.path.isfile(c):
                tess_bin = c
                break

        if tess_bin:
            pytesseract.pytesseract.tesseract_cmd = tess_bin
            langs = pytesseract.get_languages()
            has_spa = "spa" in langs
            has_eus = "eus" in langs

            # Synthetic image test with crisp font
            test_img = Image.new("RGB", (480, 120), color=(255, 255, 255))
            draw = ImageDraw.Draw(test_img)
            try:
                font = ImageFont.load_default(size=32)
            except Exception:
                font = ImageFont.load_default()
            draw.text((20, 40), "GETXO FORENSIC 2026", fill=(0, 0, 0), font=font)
            ocr_text = pytesseract.image_to_string(test_img, lang="eng").strip()
            ocr_ok = "GETXO" in ocr_text.upper() and ("2026" in ocr_text or "FORENSIC" in ocr_text.upper())

            c5_passed = ocr_ok and has_spa and has_eus
            results["criteria"]["c5_tesseract_ocr"] = {
                "passed": c5_passed,
                "tesseract_cmd": tess_bin,
                "languages": langs,
                "has_spanish": has_spa,
                "has_basque": has_eus,
                "ocr_synthetic_passed": ocr_ok
            }
        else:
            results["criteria"]["c5_tesseract_ocr"] = {"passed": False, "error": "tesseract.exe not found"}
    except Exception as e:
        results["criteria"]["c5_tesseract_ocr"] = {"passed": False, "error": str(e)}
    print(f"      Result: {'PASS' if c5_passed else 'FAIL'}")

    # CRITERION 6: SQLite Baseline Snapshot & Read-Only Safeguard
    print("[6/8] Verifying SQLite Baseline Snapshot & Cryptographic Hashes...")
    c6_passed = False
    try:
        db_hash = compute_sha256(baseline_db)
        wal_size = baseline_wal.stat().st_size if baseline_wal.exists() else 0
        
        # Verify read-only query
        ro_uri = f"file:///{str(baseline_db).replace('\\', '/')}?mode=ro"
        conn_ro = sqlite3.connect(ro_uri, uri=True, timeout=30.0)
        cur_ro = conn_ro.cursor()
        cur_ro.execute("PRAGMA integrity_check;")
        int_check = cur_ro.fetchall()
        cur_ro.execute("SELECT count(*) FROM messages;")
        msg_count = cur_ro.fetchone()[0]
        cur_ro.execute("SELECT count(*) FROM contacts;")
        cnt_count = cur_ro.fetchone()[0]
        
        # Assert read-only write protection
        write_blocked = False
        try:
            cur_ro.execute("CREATE TABLE _test_ro_block (id INT);")
            conn_ro.commit()
        except sqlite3.OperationalError:
            write_blocked = True
        conn_ro.close()

        hash_matches = (db_hash.lower() == expected_sha256.lower())
        integrity_ok = (int_check == [("ok",)])

        c6_passed = hash_matches and integrity_ok and write_blocked and (msg_count == 10055) and (cnt_count == 392)
        results["criteria"]["c6_sqlite_baseline"] = {
            "passed": c6_passed,
            "db_hash": db_hash,
            "expected_hash": expected_sha256,
            "wal_size_bytes": wal_size,
            "integrity_check": int_check,
            "messages_count": msg_count,
            "contacts_count": cnt_count,
            "read_only_enforced": write_blocked
        }
    except Exception as e:
        results["criteria"]["c6_sqlite_baseline"] = {"passed": False, "error": str(e)}
    print(f"      Result: {'PASS' if c6_passed else 'FAIL'}")

    # CRITERION 7: Evidence Ledger (run_evidence.db) Schema Contracts
    print("[7/8] Verifying run_evidence.db Schema Contracts...")
    c7_passed = False
    try:
        if run_evidence_db.exists():
            conn_run = sqlite3.connect(str(run_evidence_db), timeout=30.0)
            cur_run = conn_run.cursor()
            cur_run.execute("SELECT name FROM sqlite_master WHERE type IN ('table', 'virtual') ORDER BY name;")
            existing_tables = [r[0] for r in cur_run.fetchall()]

            required_tables = [
                "file_inventory", "ocr_evidence", "audio_evidence",
                "document_evidence", "text_forensic_entities", "attachment_links",
                "cross_modal_index", "baseline_manifest"
            ]
            missing_tables = [t for t in required_tables if t not in existing_tables]

            # Test FTS5 search query
            cur_run.execute("SELECT count(*) FROM cross_modal_index WHERE cross_modal_index MATCH 'Getxo';")
            fts_count = cur_run.fetchone()[0]

            # Test journal mode
            cur_run.execute("PRAGMA journal_mode;")
            j_mode = cur_run.fetchone()[0].upper()

            # Test baseline manifest records
            cur_run.execute("SELECT item_name, sha256_hash, verification_status FROM baseline_manifest;")
            manifest_rows = cur_run.fetchall()
            conn_run.close()

            c7_passed = (len(missing_tables) == 0) and (j_mode == "WAL") and (len(manifest_rows) >= 3)
            results["criteria"]["c7_run_evidence_db"] = {
                "passed": c7_passed,
                "journal_mode": j_mode,
                "tables_present": existing_tables,
                "missing_tables": missing_tables,
                "fts5_functional": True,
                "manifest_entries": len(manifest_rows)
            }
        else:
            results["criteria"]["c7_run_evidence_db"] = {"passed": False, "error": "run_evidence.db not found"}
    except Exception as e:
        results["criteria"]["c7_run_evidence_db"] = {"passed": False, "error": str(e)}
    print(f"      Result: {'PASS' if c7_passed else 'FAIL'}")

    # CRITERION 8: Final Gate Verdict
    all_passed = all(crit.get("passed", False) for crit in results["criteria"].values())
    results["verdict"] = "PASS" if all_passed else "FAIL"
    print("=================================================================")
    print(f" OVERALL MILESTONE M0 VERDICT: {results['verdict']}")
    print("=================================================================")

    # Save verification report
    report_file = target_dir / "reports" / "m0_verification_report.json"
    report_file.parent.mkdir(parents=True, exist_ok=True)
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"[+] Verification report saved to: {report_file}")

    return results

if __name__ == "__main__":
    t_dir = sys.argv[1] if len(sys.argv) > 1 else None
    res = verify_all(t_dir)
    sys.exit(0 if res["verdict"] == "PASS" else 1)
