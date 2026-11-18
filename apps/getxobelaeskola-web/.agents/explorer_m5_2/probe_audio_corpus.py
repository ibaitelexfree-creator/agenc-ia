import sqlite3
import os
import av
import time

db_path = r"file:c:/Users/User/Desktop/whatsapp_chats_zip/forensics_multiagent_run/run_evidence.db?mode=ro"
conn = sqlite3.connect(db_path, uri=True)
cur = conn.cursor()

cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'AUDIO'")
rows = cur.fetchall()
conn.close()

durations = []
sample_rates = set()
channels_set = set()
codecs = set()
errors = []

t0 = time.time()
for fid, rel, absp, size in rows:
    try:
        container = av.open(absp)
        audio_stream = next((s for s in container.streams if s.type == 'audio'), None)
        if audio_stream is None:
            errors.append((fid, rel, "NO_AUDIO_STREAM"))
            continue
        codecs.add(audio_stream.codec_context.name)
        sample_rates.add(audio_stream.codec_context.sample_rate)
        channels_set.add(audio_stream.codec_context.channels)
        
        # Calculate duration
        dur = float(container.duration) / 1000000.0 if container.duration is not None else None
        if dur is None and audio_stream.duration and audio_stream.time_base:
            dur = float(audio_stream.duration * audio_stream.time_base)
        if dur is not None:
            durations.append(dur)
        else:
            # Need to decode frames to determine duration
            durations.append(-1.0)
        container.close()
    except Exception as e:
        errors.append((fid, rel, str(e)))

probe_time = time.time() - t0
print(f"Probed {len(rows)} audio files in {probe_time:.2f} seconds.")
print(f"Codecs found: {codecs}")
print(f"Sample rates: {sample_rates}")
print(f"Channel counts: {channels_set}")
print(f"Valid durations: {len([d for d in durations if d > 0])}")
print(f"Unknown durations (-1): {len([d for d in durations if d <= 0])}")
print(f"Errors during probe: {len(errors)}")

valid_durs = [d for d in durations if d > 0]
if valid_durs:
    total_sec = sum(valid_durs)
    print(f"Total audio duration: {total_sec:.2f} seconds ({total_sec/60:.2f} minutes, {total_sec/3600:.2f} hours)")
    print(f"Min duration: {min(valid_durs):.2f}s, Median: {sorted(valid_durs)[len(valid_durs)//2]:.2f}s, Max: {max(valid_durs):.2f}s")
    # Histogram buckets: <5s, 5-15s, 15-30s, 30-60s, 60-120s, >120s
    buckets = {"<5s": 0, "5-15s": 0, "15-30s": 0, "30-60s": 0, "60-120s": 0, ">120s": 0}
    for d in valid_durs:
        if d < 5: buckets["<5s"] += 1
        elif d < 15: buckets["5-15s"] += 1
        elif d < 30: buckets["15-30s"] += 1
        elif d < 60: buckets["30-60s"] += 1
        elif d < 120: buckets["60-120s"] += 1
        else: buckets[">120s"] += 1
    print("Duration buckets:")
    for b, count in buckets.items():
        print(f"  {b:8s}: {count:3d} ({count*100/len(valid_durs):.1f}%)")

if errors:
    print("\nSample errors:")
    for fid, rel, err in errors[:5]:
        print(f"  File ID {fid}: {err} ({rel})")
