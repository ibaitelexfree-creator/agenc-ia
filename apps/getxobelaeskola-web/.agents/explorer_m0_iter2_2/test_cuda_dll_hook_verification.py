"""
test_cuda_dll_hook_verification.py
Milestone M0 Iteration 2: Explorer M0_Iter2_2 Verification Suite

Performs comprehensive empirical verification of NVIDIA CUDA 12 & cuDNN 9 DLL registration
via Python startup hooks (.pth / site hook) without requiring manual cuda_init imports.
"""

import os
import sys
import subprocess
from pathlib import Path

VENV_PYTHON = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe"
THIS_DIR = Path(__file__).resolve().parent

def run_in_clean_subprocess(code: str, cwd: str = r"c:\Users\User\Desktop") -> subprocess.CompletedProcess:
    """Executes a code snippet in a clean Python subprocess from a neutral working directory."""
    return subprocess.run(
        [VENV_PYTHON, "-c", code],
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=30
    )

def test_1_device_count_clean_process():
    """Verify ctranslate2.get_cuda_device_count() works from a fresh process without cuda_init."""
    code = "import ctranslate2; print('DEVICE_COUNT:', ctranslate2.get_cuda_device_count())"
    res = run_in_clean_subprocess(code)
    assert res.returncode == 0, f"Process failed: {res.stderr}"
    assert "DEVICE_COUNT: 1" in res.stdout, f"Unexpected stdout: {res.stdout}"
    print("[PASS] Test 1: ctranslate2.get_cuda_device_count() returned 1 in fresh process.", flush=True)

def test_2_nvidia_bins_in_path_on_startup():
    """Verify that all three NVIDIA binary directories are prepended to PATH on interpreter startup."""
    code = """
import os
path_entries = [p.lower() for p in os.environ.get('PATH', '').split(';')]
has_cublas = any('nvidia' in p and 'cublas' in p and 'bin' in p for p in path_entries)
has_cudnn = any('nvidia' in p and 'cudnn' in p and 'bin' in p for p in path_entries)
has_nvrtc = any('nvidia' in p and 'cuda_nvrtc' in p and 'bin' in p for p in path_entries)
print(f'CUBLAS:{has_cublas},CUDNN:{has_cudnn},NVRTC:{has_nvrtc}')
"""
    res = run_in_clean_subprocess(code)
    assert res.returncode == 0, f"Process failed: {res.stderr}"
    assert "CUBLAS:True,CUDNN:True,NVRTC:True" in res.stdout, f"Missing PATH entries: {res.stdout}"
    print("[PASS] Test 2: All 3 NVIDIA bin directories present in PATH on Python startup.", flush=True)

def test_3_ctranslate2_whisper_cuda_inference_clean_process():
    """Verify real GPU computation via faster-whisper without importing cuda_init."""
    code = """
import numpy as np
from faster_whisper import WhisperModel
model = WhisperModel('tiny', device='cuda', compute_type='float16')
t = np.linspace(0, 1.0, 16000, dtype=np.float32)
segments, info = model.transcribe(t)
print(f'INFERENCE_SUCCESS:{info.language}')
"""
    res = run_in_clean_subprocess(code)
    assert res.returncode == 0, f"GPU inference failed: {res.stderr}"
    assert "INFERENCE_SUCCESS:en" in res.stdout, f"Unexpected output: {res.stdout}"
    print("[PASS] Test 3: Unattended faster-whisper CUDA:0 inference succeeded (language: en).", flush=True)

def test_4_multiprocessing_child_inheritance():
    """Verify that multiprocessing child workers inherit DLL hooks using a dedicated module."""
    mp_script = str(THIS_DIR / "test_mp_spawn.py")
    res = subprocess.run(
        [VENV_PYTHON, mp_script],
        cwd=str(THIS_DIR),
        capture_output=True,
        text=True,
        timeout=30
    )
    assert res.returncode == 0, f"Multiprocessing failed: {res.stderr}"
    assert "nvidia_in_path=True, cuda_device_count=1" in res.stdout, f"Unexpected mp stdout: {res.stdout}"
    print("[PASS] Test 4: Multiprocessing child workers successfully inherited CUDA environment.", flush=True)

def main():
    print("=" * 70, flush=True)
    print("RUNNING EXPLORER M0_ITER2_2 EMPIRICAL VERIFICATION SUITE", flush=True)
    print("=" * 70, flush=True)
    test_1_device_count_clean_process()
    test_2_nvidia_bins_in_path_on_startup()
    test_3_ctranslate2_whisper_cuda_inference_clean_process()
    test_4_multiprocessing_child_inheritance()
    print("=" * 70, flush=True)
    print("ALL 4 TESTS PASSED: Standalone CUDA DLL Resolution is 100% Verified!", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    main()
