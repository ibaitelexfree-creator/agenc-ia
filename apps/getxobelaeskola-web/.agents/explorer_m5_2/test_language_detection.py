import os
import sys
import json
import sqlite3

sys.path.append(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts")
try:
    import cuda_init
except ImportError:
    pass

from faster_whisper import WhisperModel

db_path = r"file:c:/Users/User/Desktop/whatsapp_chats_zip/forensics_multiagent_run/run_evidence.db?mode=ro"
conn = sqlite3.connect(db_path, uri=True)
cur = conn.cursor()
cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'AUDIO' LIMIT 40")
rows = cur.fetchall()
conn.close()

print(f"Loading WhisperModel('small', device='cuda', compute_type='float16')...")
model = WhisperModel("small", device="cuda", device_index=0, compute_type="float16")

results = []
for fid, rel, absp, size in rows:
    # Run language detection without full transcribe first (or transcribe first segment)
    # faster-whisper model.transcribe detects language using first 30 seconds
    try:
        segments, info = model.transcribe(absp, beam_size=1, vad_filter=True)
        # Take up to 2 segments
        preview_text = []
        for i, s in enumerate(segments):
            preview_text.append(s.text.strip())
            if i >= 1:
                break
        sample_text = " ".join(preview_text)
        print(f"File {fid} | {os.path.basename(rel):25s} | Lang: {info.language:3s} ({info.language_probability:.3f}) | {sample_text[:70]}")
        results.append({
            "file_id": fid,
            "filename": os.path.basename(rel),
            "language": info.language,
            "language_prob": info.language_probability,
            "preview": sample_text
        })
    except Exception as e:
        print(f"File {fid} ERROR: {e}")

# Save
with open(r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m5_2\language_detection_sample.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\nLanguage distribution in 40-file sample:")
lang_counts = {}
for r in results:
    l = r["language"]
    lang_counts[l] = lang_counts.get(l, 0) + 1
for l, c in lang_counts.items():
    print(f"  {l}: {c}")
