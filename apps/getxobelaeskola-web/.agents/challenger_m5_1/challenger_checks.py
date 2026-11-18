import sqlite3
import hashlib
import json
import random
import sys
import pytest
from pathlib import Path

RUN_DIR = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run")
EVIDENCE_DB = RUN_DIR / "run_evidence.db"
BASELINE_DB = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db")
EXPECTED_BASELINE_SHA256 = "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3"

report = {
    "baseline_hash_check": {},
    "db_counts": {},
    "terminal_accounting": {},
    "spot_checks": [],
    "test_suite_m5": {},
    "test_suite_all": {}
}

# 1. Baseline Cryptographic Hash
print("=== 1. Cryptographic Baseline Verification ===")
assert BASELINE_DB.exists(), f"Baseline DB missing: {BASELINE_DB}"
h = hashlib.sha256()
with open(BASELINE_DB, "rb") as f:
    while chunk := f.read(65536):
        h.update(chunk)
actual_hash = h.hexdigest().lower()
match = (actual_hash == EXPECTED_BASELINE_SHA256.lower())
print(f"Expected: {EXPECTED_BASELINE_SHA256}")
print(f"Actual:   {actual_hash}")
print(f"Match:    {match}")
assert match, f"Hash mismatch: {actual_hash} != {EXPECTED_BASELINE_SHA256}"
report["baseline_hash_check"] = {
    "expected": EXPECTED_BASELINE_SHA256,
    "actual": actual_hash,
    "match": match
}

# 2. Query run_evidence.db
print("\n=== 2. run_evidence.db Counts and Accounting ===")
conn = sqlite3.connect(str(EVIDENCE_DB))
cur = conn.cursor()

# audio_evidence count
cur.execute("SELECT count(*) FROM audio_evidence")
audio_ev_count = cur.fetchone()[0]
print(f"audio_evidence rows: {audio_ev_count}")
assert audio_ev_count == 397, f"audio_evidence count is {audio_ev_count}, expected 397"
report["db_counts"]["audio_evidence_count"] = audio_ev_count

# file_inventory completed audio count
cur.execute("SELECT count(*) FROM file_inventory WHERE modality = 'AUDIO' AND status = 'COMPLETED'")
completed_count = cur.fetchone()[0]
print(f"file_inventory COMPLETED audio rows: {completed_count}")
assert completed_count == 397, f"completed audio count is {completed_count}, expected 397"
report["db_counts"]["file_inventory_completed_audio"] = completed_count

# terminal accounting: completed + failed + pending
cur.execute("SELECT count(*) FROM file_inventory WHERE modality = 'AUDIO' AND status = 'FAILED'")
failed_count = cur.fetchone()[0]
cur.execute("SELECT count(*) FROM file_inventory WHERE modality = 'AUDIO' AND status = 'PENDING'")
pending_count = cur.fetchone()[0]
total_audio = completed_count + failed_count + pending_count
print(f"Terminal Accounting: Total={total_audio}, Completed={completed_count}, Failed={failed_count}, Pending={pending_count}")
assert total_audio == 397, f"Total audio {total_audio} != 397"
assert completed_count == 397, f"Completed {completed_count} != 397"
assert failed_count == 0, f"Failed {failed_count} != 0"
assert pending_count == 0, f"Pending {pending_count} != 0"

report["terminal_accounting"] = {
    "total": total_audio,
    "completed": completed_count,
    "failed": failed_count,
    "pending": pending_count,
    "equation": f"{total_audio} = {completed_count} + {failed_count} + {pending_count}",
    "verified": True
}

# 3. Spot-check 5 random audio records
print("\n=== 3. Spot-check 5 Random Audio Records ===")
cur.execute("""
    SELECT ae.id, ae.file_id, fi.rel_path, ae.duration_sec, ae.language, ae.language_probability,
           ae.transcript_text, ae.segments_json, ae.terminal_code
    FROM audio_evidence ae
    JOIN file_inventory fi ON ae.file_id = fi.file_id
    WHERE ae.transcript_text IS NOT NULL AND length(trim(ae.transcript_text)) > 0
    ORDER BY ae.id ASC
""")
rows = cur.fetchall()
print(f"Total non-empty transcript records available: {len(rows)}")

random.seed(12345)
sample_rows = random.sample(rows, 5)

for idx, r in enumerate(sample_rows, 1):
    ae_id, file_id, rel_path, duration_sec, lang, lang_prob, text, seg_json, term_code = r
    assert duration_sec > 0, f"duration <= 0 on file {file_id}: {duration_sec}"
    assert lang in ("es", "eu"), f"language '{lang}' not in ('es', 'eu') on file {file_id}"
    assert text and len(text.strip()) > 0, f"empty transcript on file {file_id}"
    
    segs = json.loads(seg_json)
    assert isinstance(segs, list), f"segments_json not a list on file {file_id}"
    assert len(segs) > 0, f"segments list empty on file {file_id}"
    
    first_seg = segs[0]
    assert "start" in first_seg and "end" in first_seg and "text" in first_seg
    
    spot_data = {
        "sample_index": idx,
        "ae_id": ae_id,
        "file_id": file_id,
        "rel_path": rel_path,
        "duration_sec": duration_sec,
        "language": lang,
        "language_probability": lang_prob,
        "transcript_preview": text[:90] + ("..." if len(text) > 90 else ""),
        "segment_count": len(segs),
        "terminal_code": term_code
    }
    report["spot_checks"].append(spot_data)
    print(f"Spot Check #{idx}: file_id={file_id}, path={rel_path}, dur={duration_sec:.2f}s, lang={lang} (p={lang_prob:.4f}), segs={len(segs)}")
    print(f"   Excerpt: {spot_data['transcript_preview']}")

conn.close()

# Save JSON output
out_file = Path(r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\challenger_m5_1\challenger_evidence.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)

print(f"\nReport written to {out_file}")
print("ALL DATABASE AND BASELINE INTEGRITY CHECKS EMPIRICALLY CONFIRMED!")
