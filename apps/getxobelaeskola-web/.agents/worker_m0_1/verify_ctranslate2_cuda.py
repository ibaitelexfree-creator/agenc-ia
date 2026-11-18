"""
verify_ctranslate2_cuda.py - CTranslate2 CUDA Acceleration & Zero-PyTorch Audit
Milestone M0: WhatsApp Digital Forensic Multi-Agent Operation
Validates CTranslate2 CUDA 12 compute on RTX 4080 Laptop GPU (cuda:0)
and independently proves torch is NOT installed.
"""

import sys
import os
import json
import time
import subprocess
import numpy as np
from typing import Dict, Any, List, Optional

# Register CUDA DLLs
try:
    from cuda_init import init_cuda_dlls
    init_cuda_dlls()
except ImportError:
    pass

def query_gpu_telemetry():
    """Queries current VRAM and temperature using nvidia-smi."""
    try:
        cmd = [
            "nvidia-smi",
            "--query-gpu=name,memory.total,memory.free,memory.used,temperature.gpu",
            "--format=csv,noheader,nounits"
        ]
        out = subprocess.check_output(cmd, text=True).strip()
        parts = [p.strip() for p in out.split(",")]
        return {
            "gpu_name": parts[0],
            "total_vram_mb": float(parts[1]),
            "free_vram_mb": float(parts[2]),
            "used_vram_mb": float(parts[3]),
            "temperature_c": float(parts[4]),
        }
    except Exception as e:
        return {"error": f"nvidia-smi failed: {e}"}

def run_verification(target_dir: str = None) -> Dict[str, Any]:
    if not target_dir:
        target_dir = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run"
    
    report = {
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "test_name": "CTranslate2 CUDA & Zero-PyTorch Verification",
        "verdict": "FAIL",
        "assertions": {}
    }

    print("=================================================================")
    print(" FORENSIC VERIFICATION: CTranslate2 CUDA & Zero-PyTorch Audit")
    print("=================================================================")

    # 1. Assert PyTorch is NOT installed
    print("[1/5] Checking PyTorch absence (Strict Rule 1 Compliance)...")
    try:
        import torch
        report["assertions"]["torch_absent"] = {
            "passed": False,
            "error": "CRITICAL VIOLATION: 'torch' module successfully imported!"
        }
        print("  [-] FAIL: PyTorch is installed!")
        raise AssertionError("PyTorch is installed in the isolated environment!")
    except ModuleNotFoundError:
        report["assertions"]["torch_absent"] = {
            "passed": True,
            "details": "Verified: 'torch' raises ModuleNotFoundError."
        }
        print("  [+] PASS: PyTorch is NOT installed (Zero PyTorch confirmed).")

    # 2. Inspect CTranslate2 Version & CUDA Device Detection
    print("[2/5] Inspecting CTranslate2 CUDA device support...")
    try:
        import ctranslate2
        ct2_version = ctranslate2.__version__
        cuda_count = ctranslate2.get_cuda_device_count()
        
        if cuda_count < 1:
            raise RuntimeError(f"CTranslate2 reports 0 CUDA devices! (count={cuda_count})")

        supported_types = list(ctranslate2.get_supported_compute_types("cuda", device_index=0))

        report["assertions"]["cuda_device_detected"] = {
            "passed": True,
            "ctranslate2_version": ct2_version,
            "cuda_device_count": cuda_count,
            "supported_compute_types": supported_types
        }
        print(f"  [+] PASS: CTranslate2 v{ct2_version} detected {cuda_count} CUDA device(s).")
        print(f"      Supported Compute Types on cuda:0: {', '.join(supported_types)}")
    except Exception as e:
        report["assertions"]["cuda_device_detected"] = {
            "passed": False,
            "error": str(e)
        }
        print(f"  [-] FAIL: CTranslate2 CUDA check failed: {e}")
        raise

    # 3. Pre-Compute Hardware & VRAM Telemetry
    print("[3/5] Querying baseline GPU telemetry...")
    telemetry_pre = query_gpu_telemetry()
    report["telemetry_baseline"] = telemetry_pre
    print(f"  [+] Device: {telemetry_pre.get('gpu_name')}")
    print(f"      Free VRAM: {telemetry_pre.get('free_vram_mb')} MB")
    print(f"      Temperature: {telemetry_pre.get('temperature_c')} °C")

    # 4. Real GPU Audio Inference Pass (faster-whisper)
    print("[4/5] Executing real GPU inference pass using faster-whisper...")
    try:
        from faster_whisper import WhisperModel

        t0 = time.time()
        print("      Instantiating WhisperModel('tiny', device='cuda', compute_type='float16')...")
        model = WhisperModel("tiny", device="cuda", device_index=0, compute_type="float16")
        init_latency_sec = round(time.time() - t0, 3)

        # Generate 1.0 second of synthetic 16kHz audio (440Hz tone)
        sample_rate = 16000
        t = np.linspace(0, 1.0, sample_rate, endpoint=False, dtype=np.float32)
        test_audio = 0.5 * np.sin(2 * np.pi * 440 * t)

        t_inf = time.time()
        segments, info = model.transcribe(test_audio, beam_size=1)
        segment_list = list(segments)
        inf_latency_sec = round(time.time() - t_inf, 3)

        report["assertions"]["gpu_inference"] = {
            "passed": True,
            "model_size": "tiny",
            "compute_type": "float16",
            "detected_language": info.language,
            "init_latency_sec": init_latency_sec,
            "inference_latency_sec": inf_latency_sec,
            "segments_generated": len(segment_list)
        }
        print(f"  [+] PASS: GPU inference successful!")
        print(f"      Model load latency: {init_latency_sec}s | Inference: {inf_latency_sec}s")
    except Exception as e:
        report["assertions"]["gpu_inference"] = {
            "passed": False,
            "error": str(e)
        }
        print(f"  [-] FAIL: Faster-whisper GPU execution failed: {e}")
        raise

    # 5. Post-Compute Hardware Telemetry & Thermal Verification
    print("[5/5] Checking post-inference thermal and memory state...")
    telemetry_post = query_gpu_telemetry()
    report["telemetry_post_inference"] = telemetry_post
    print(f"      Post-Inference Temp: {telemetry_post.get('temperature_c')} °C")
    print(f"      Post-Inference Free VRAM: {telemetry_post.get('free_vram_mb')} MB")

    report["verdict"] = "PASS"
    print("=================================================================")
    print(" VERDICT: ALL ASSERTIONS PASSED (100% AUDIT COMPLIANT)")
    print("=================================================================")

    # Write out JSON verification report
    report_path = os.path.join(target_dir, "reports", "CTranslate2_CUDA_Verification_Report.json")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Verification report written to: {report_path}")

    return report

if __name__ == "__main__":
    try:
        t_dir = sys.argv[1] if len(sys.argv) > 1 else None
        run_verification(t_dir)
        sys.exit(0)
    except Exception as exc:
        print(f"\n[FATAL] Verification failed: {exc}", file=sys.stderr)
        sys.exit(1)
