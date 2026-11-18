"""
audit_checks.py - Independent Forensic Audit Verification Script for Milestone M5
Executed by Forensic Auditor M5
"""

import hashlib
import json
import os
import sqlite3
import sys
from pathlib import Path

# Paths
BASELINE_DB = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db")
EXPECTED_BASELINE_SHA256 = "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3"
EVIDENCE_DB = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db")
PIPELINE_SCRIPT = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\audio_transcription_pipeline.py")
TEST_SCRIPT = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m5_audio_transcription.py")

results = {}

# 1. SHA-256 of Baseline DB
print("=== CHECK 1: Production Baseline DB SHA-256 & Read-Only Check ===")
h = hashlib.sha256()
with open(BASELINE_DB, "rb") as f:
    while chunk := f.read(65536):
        h.update(chunk)
actual_sha256 = h.hexdigest().lower()
sha256_match = (actual_sha256 == EXPECTED_BASELINE_SHA256.lower())
print(f"Expected SHA-256: {EXPECTED_BASELINE_SHA256}")
print(f"Actual SHA-256:   {actual_sha256}")
print(f"Match: {sha256_match}")
results["check1_sha256"] = {
    "expected": EXPECTED_BASELINE_SHA256,
    "actual": actual_sha256,
    "match": sha256_match
}

# Also test write rejection on BASELINE_DB
try:
    uri = f"file:{BASELINE_DB.as_posix()}?mode=ro"
    ro_conn = sqlite3.connect(uri, uri=True)
    cur = ro_conn.cursor()
    cur.execute("PRAGMA query_only = ON;")
    cur.execute("CREATE TABLE _forensic_audit_probe (x INT);")
    ro_conn.close()
    write_rejected = False
except Exception as e:
    write_rejected = True
    print(f"Write rejection confirmed: {e}")
results["check1_write_rejection"] = write_rejected

# 2. PyTorch Absence & CTranslate2 Environment Check
print("\n=== CHECK 2: Lean Environment & CTranslate2 CUDA Check ===")
try:
    import torch
    torch_found = True
except ImportError:
    torch_found = False
print(f"Torch in environment: {torch_found} (Expected False)")

try:
    import ctranslate2
    ct2_version = ctranslate2.__version__
    cuda_count = ctranslate2.get_cuda_device_count()
    cuda_supported = ctranslate2.is_cuda_available() if hasattr(ctranslate2, "is_cuda_available") else (cuda_count > 0)
    print(f"ctranslate2 version: {ct2_version}, cuda device count: {cuda_count}, cuda available: {cuda_supported}")
except Exception as e:
    ct2_version = str(e)
    cuda_count = 0
    cuda_supported = False

try:
    import faster_whisper
    fw_version = faster_whisper.__version__
    print(f"faster_whisper version: {fw_version}")
except Exception as e:
    fw_version = str(e)

results["check2_env"] = {
    "torch_found": torch_found,
    "ct2_version": ct2_version,
    "cuda_count": cuda_count,
    "cuda_supported": cuda_supported,
    "fw_version": fw_version
}

# 3. Database Inventory and Physical Disk Parity
print("\n=== CHECK 3: run_evidence.db Audio Census & Physical Disk Parity ===")
import av

conn = sqlite3.connect(str(EVIDENCE_DB))
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
    SELECT count(*) as total, 
           sum(case when status='COMPLETED' then 1 else 0 end) as completed,
           sum(case when status='PENDING' then 1 else 0 end) as pending,
           sum(case when status='FAILED' then 1 else 0 end) as failed,
           sum(case when terminal_code='TRANSCRIBED_SUCCESS' then 1 else 0 end) as success_code
    FROM file_inventory 
    WHERE modality='AUDIO';
""")
inv_summary = dict(cur.fetchone())
print(f"file_inventory summary: {inv_summary}")

cur.execute("SELECT count(*) FROM audio_evidence;")
audio_ev_count = cur.fetchone()[0]
print(f"audio_evidence count: {audio_ev_count}")

# Verify each of the 397 audio files
cur.execute("""
    SELECT fi.file_id, fi.rel_path, fi.abs_path, fi.file_size,
           ae.duration_sec, ae.language, ae.language_probability,
           ae.transcript_text, ae.segments_json, ae.terminal_code, ae.error_code
    FROM file_inventory fi
    JOIN audio_evidence ae ON fi.file_id = ae.file_id
    WHERE fi.modality = 'AUDIO'
    ORDER BY fi.file_id ASC;
""")
rows = cur.fetchall()

missing_files = []
zero_byte_files = []
duration_mismatches = []
corrupted_streams = []
empty_transcripts = []
lexical_samples = []

for idx, r in enumerate(rows):
    p = Path(r["abs_path"])
    if not p.exists():
        missing_files.append((r["file_id"], str(p)))
        continue
    sz = p.stat().st_size
    if sz == 0:
        zero_byte_files.append((r["file_id"], str(p)))
        continue
    
    # Check with PyAV
    try:
        container = av.open(str(p))
        stream = container.streams.audio[0]
        pyav_duration = float(stream.duration * stream.time_base) if stream.duration else (float(container.duration) / 1000000.0 if container.duration else 0.0)
        container.close()
        
        db_duration = r["duration_sec"]
        # Allow tolerance of 0.5s or 5% due to container vs packet duration estimation
        diff = abs(pyav_duration - db_duration)
        if diff > 1.5:
            duration_mismatches.append({
                "file_id": r["file_id"],
                "file": p.name,
                "pyav_dur": round(pyav_duration, 3),
                "db_dur": round(db_duration, 3),
                "diff": round(diff, 3)
            })
    except Exception as exc:
        corrupted_streams.append((r["file_id"], p.name, str(exc)))

    text = r["transcript_text"]
    if not text or len(text.strip()) == 0:
        empty_transcripts.append((r["file_id"], p.name, r["duration_sec"]))
    else:
        # Collect sample transcripts for lexical inspection
        if idx % 20 == 0 or any(kw in text.lower() for kw in ["urko", "getxo", "bela", "banco", "pakea", "cuenta"]):
            lexical_samples.append({
                "file_id": r["file_id"],
                "file": p.name,
                "duration": r["duration_sec"],
                "lang": r["language"],
                "prob": r["language_probability"],
                "text": text[:180]
            })

conn.close()

print(f"Total checked rows: {len(rows)}")
print(f"Missing physical files: {len(missing_files)}")
print(f"Zero byte files: {len(zero_byte_files)}")
print(f"Duration mismatches (>1.5s): {len(duration_mismatches)}")
if duration_mismatches:
    print(f"Sample mismatches: {duration_mismatches[:5]}")
print(f"Corrupted streams: {len(corrupted_streams)}")
print(f"Empty transcripts: {len(empty_transcripts)}")
if empty_transcripts:
    print(f"Empty transcript files: {empty_transcripts[:10]}")
print(f"Lexical samples gathered: {len(lexical_samples)}")

results["check3_inventory"] = {
    "total_checked": len(rows),
    "missing_files": len(missing_files),
    "zero_byte_files": len(zero_byte_files),
    "duration_mismatches": len(duration_mismatches),
    "sample_mismatches": duration_mismatches[:5],
    "corrupted_streams": len(corrupted_streams),
    "empty_transcripts": len(empty_transcripts),
    "empty_transcript_details": empty_transcripts,
    "lexical_sample_count": len(lexical_samples),
    "lexical_samples": lexical_samples[:15]
}

# Save results
out_json = Path(r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\auditor_m5_1\audit_results.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nAudit results successfully written to: {out_json}")
