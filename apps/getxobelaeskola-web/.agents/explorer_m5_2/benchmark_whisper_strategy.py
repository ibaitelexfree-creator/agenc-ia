import os
import sys
import gc
import time
import json
import sqlite3
import subprocess
from typing import Dict, Any, List

# Include CUDA DLLs loader
sys.path.append(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts")
try:
    import cuda_init
except ImportError:
    pass

import ctranslate2
from faster_whisper import WhisperModel
import av

def get_gpu_telemetry() -> Dict[str, float]:
    """Queries NVIDIA-SMI for memory and temperature."""
    try:
        cmd = [
            "nvidia-smi",
            "--query-gpu=memory.total,memory.free,memory.used,temperature.gpu",
            "--format=csv,noheader,nounits"
        ]
        out = subprocess.check_output(cmd, text=True).strip()
        parts = [float(p.strip()) for p in out.split(",")]
        return {
            "total_vram_mb": parts[0],
            "free_vram_mb": parts[1],
            "used_vram_mb": parts[2],
            "temperature_c": parts[3]
        }
    except Exception as e:
        return {"error": str(e)}

def probe_file(file_path: str):
    """Probes audio file using PyAV for duration and metadata."""
    container = av.open(file_path)
    audio_stream = next((s for s in container.streams if s.type == 'audio'), None)
    if not audio_stream:
        container.close()
        return None, None, None
    dur = float(container.duration) / 1000000.0 if container.duration is not None else None
    if dur is None and audio_stream.duration and audio_stream.time_base:
        dur = float(audio_stream.duration * audio_stream.time_base)
    codec = audio_stream.codec_context.name
    sample_rate = audio_stream.codec_context.sample_rate
    container.close()
    return dur, codec, sample_rate

def select_sample_audios():
    """Selects representative audio files across duration tiers."""
    db_path = r"file:c:/Users/User/Desktop/whatsapp_chats_zip/forensics_multiagent_run/run_evidence.db?mode=ro"
    conn = sqlite3.connect(db_path, uri=True)
    cur = conn.cursor()
    cur.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'AUDIO'")
    rows = cur.fetchall()
    conn.close()

    # Find candidate files with durations
    candidates = []
    for fid, rel, absp, size in rows:
        dur, codec, sr = probe_file(absp)
        if dur and dur > 0:
            candidates.append({"file_id": fid, "rel_path": rel, "abs_path": absp, "file_size": size, "duration": dur})

    # Pick samples:
    # 1. Very short (1-4s)
    # 2. Short (5-15s)
    # 3. Medium (20-40s)
    # 4. Long (60-120s)
    # 5. Very long (>180s)
    short_1 = min(candidates, key=lambda x: abs(x["duration"] - 2.5))
    short_2 = min(candidates, key=lambda x: abs(x["duration"] - 10.0))
    medium = min(candidates, key=lambda x: abs(x["duration"] - 30.0))
    long_1 = min(candidates, key=lambda x: abs(x["duration"] - 75.0))
    very_long = max(candidates, key=lambda x: x["duration"])

    selected = [short_1, short_2, medium, long_1, very_long]
    # Deduplicate
    seen = set()
    result = []
    for item in selected:
        if item["file_id"] not in seen:
            seen.add(item["file_id"])
            result.append(item)
    return result

def run_benchmarks():
    print("=== FASTER-WHISPER GPU STRATEGY BENCHMARK ===")
    initial_telem = get_gpu_telemetry()
    print(f"Initial GPU State: Used {initial_telem.get('used_vram_mb')} MB, Free {initial_telem.get('free_vram_mb')} MB, Temp {initial_telem.get('temperature_c')} C")

    samples = select_sample_audios()
    print(f"\nSelected {len(samples)} representative test audio files:")
    for s in samples:
        print(f"  File ID {s['file_id']}: {s['duration']:.2f}s | {s['file_size']}B | {os.path.basename(s['abs_path'])}")

    models_to_test = [
        ("tiny", "float16"),
        ("tiny", "int8_float16"),
        ("base", "float16"),
        ("base", "int8_float16"),
        ("small", "float16"),
        ("small", "int8_float16"),
    ]

    benchmark_results = []

    for model_name, compute_type in models_to_test:
        print(f"\n------------------------------------------------------------")
        print(f"BENCHMARKING: model={model_name}, compute_type={compute_type}")
        print(f"------------------------------------------------------------")
        
        pre_load_telem = get_gpu_telemetry()
        t0 = time.time()
        model = WhisperModel(model_name, device="cuda", device_index=0, compute_type=compute_type)
        load_time = time.time() - t0
        post_load_telem = get_gpu_telemetry()

        vram_model_footprint = post_load_telem.get("used_vram_mb", 0) - pre_load_telem.get("used_vram_mb", 0)
        print(f"Model Load Time: {load_time:.3f}s | Dedicated Model VRAM: {vram_model_footprint:.1f} MB (Total Used: {post_load_telem.get('used_vram_mb')} MB)")

        model_run_records = []
        total_audio_dur = 0.0
        total_proc_time = 0.0

        for s in samples:
            audio_path = s["abs_path"]
            dur = s["duration"]

            t_trans_start = time.time()
            segments, info = model.transcribe(
                audio_path,
                beam_size=5,
                word_timestamps=False,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            
            # Materialize segments generator
            seg_list = []
            full_text = []
            for seg in segments:
                seg_dict = {
                    "id": seg.id,
                    "seek": seg.seek,
                    "start": round(seg.start, 2),
                    "end": round(seg.end, 2),
                    "text": seg.text.strip(),
                    "avg_logprob": round(seg.avg_logprob, 4),
                    "no_speech_prob": round(seg.no_speech_prob, 4),
                    "compression_ratio": round(seg.compression_ratio, 3)
                }
                seg_list.append(seg_dict)
                full_text.append(seg.text.strip())

            proc_time = time.time() - t_trans_start
            total_audio_dur += dur
            total_proc_time += proc_time
            
            # Speedup factor = duration / proc_time (e.g. 20x faster than real-time)
            # Real Time Factor (RTF) standard definition = proc_time / duration (e.g. 0.05 RTF)
            speedup = dur / proc_time if proc_time > 0 else 0
            rtf = proc_time / dur if dur > 0 else 0

            merged_text = " ".join(full_text)
            print(f"  [{os.path.basename(audio_path)}] dur={dur:.1f}s | proc={proc_time:.2f}s | Speedup={speedup:.1f}x (RTF={rtf:.4f}) | Lang={info.language} ({info.language_probability:.2f})")
            print(f"     Preview: {merged_text[:90]}...")

            model_run_records.append({
                "file_id": s["file_id"],
                "audio_filename": os.path.basename(audio_path),
                "duration_sec": dur,
                "proc_time_sec": round(proc_time, 3),
                "speedup_factor": round(speedup, 2),
                "rtf": round(rtf, 4),
                "language": info.language,
                "language_probability": round(info.language_probability, 4),
                "segment_count": len(seg_list),
                "transcript_preview": merged_text[:120]
            })

        post_inf_telem = get_gpu_telemetry()
        del model
        gc.collect()
        time.sleep(0.5)
        post_del_telem = get_gpu_telemetry()
        print(f"Cleanup VRAM: Used after del={post_del_telem.get('used_vram_mb')} MB (Freed {post_inf_telem.get('used_vram_mb', 0) - post_del_telem.get('used_vram_mb', 0):.1f} MB)")

        overall_speedup = total_audio_dur / total_proc_time if total_proc_time > 0 else 0
        overall_rtf = total_proc_time / total_audio_dur if total_audio_dur > 0 else 0

        benchmark_results.append({
            "model_name": model_name,
            "compute_type": compute_type,
            "load_time_sec": round(load_time, 3),
            "vram_model_footprint_mb": round(vram_model_footprint, 1),
            "peak_vram_used_mb": post_inf_telem.get("used_vram_mb"),
            "total_test_audio_sec": round(total_audio_dur, 2),
            "total_proc_time_sec": round(total_proc_time, 2),
            "overall_speedup": round(overall_speedup, 2),
            "overall_rtf": round(overall_rtf, 4),
            "runs": model_run_records
        })

    # Save benchmark results
    out_file = r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m5_2\model_benchmark_results.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(benchmark_results, f, indent=2)
    print(f"\n=== BENCHMARK COMPLETE ===")
    print(f"Results written to: {out_file}")

if __name__ == "__main__":
    run_benchmarks()
