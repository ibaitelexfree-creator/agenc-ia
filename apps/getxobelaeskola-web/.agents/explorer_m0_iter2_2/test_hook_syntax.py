"""
test_hook_syntax.py - Test candidate .pth syntax and execution
"""
import os
import sys

def test_line_syntax():
    # Test Candidate 1: Single-line exec with repr/escapes
    line_candidate = '''import os, sys, site, ctypes; exec("for p in site.getsitepackages():\\n    nr = os.path.join(p, 'nvidia')\\n    if os.path.isdir(nr):\\n        for s in os.listdir(nr):\\n            b = os.path.join(nr, s, 'bin')\\n            if os.path.isdir(b):\\n                try: os.add_dll_directory(b)\\n                except Exception: pass\\n                if b not in os.environ.get('PATH', ''): os.environ['PATH'] = b + os.pathsep + os.environ.get('PATH', '')\\n                for d in ['cublasLt64_12.dll', 'cublas64_12.dll', 'cudnn64_9.dll']:\\n                    dp = os.path.join(b, d)\\n                    if os.path.isfile(dp):\\n                        try: ctypes.CDLL(dp)\\n                        except Exception: pass\\n")'''
    
    assert line_candidate.startswith(("import ", "import\t")), "Must start with 'import '"
    assert "\n" not in line_candidate, "Must be strictly a single line without literal newlines"
    
    # Execute line just as site.py does: exec(line)
    namespace = {}
    exec(line_candidate, namespace)
    print("Candidate 1 exec() executed successfully!")
    
    # Check if PATH was updated
    curr_path = os.environ.get("PATH", "")
    assert "cublas" in curr_path.lower(), "cublas must be in PATH"
    assert "cudnn" in curr_path.lower(), "cudnn must be in PATH"
    assert "cuda_nvrtc" in curr_path.lower(), "cuda_nvrtc must be in PATH"
    print("PATH contains cublas, cudnn, and cuda_nvrtc!")
    
    # Now test inference with faster-whisper without importing cuda_init
    import numpy as np
    from faster_whisper import WhisperModel
    m = WhisperModel('tiny', device='cuda', compute_type='float16')
    t = np.linspace(0, 1.0, 16000, dtype=np.float32)
    s, info = m.transcribe(t)
    print(f"Candidate 1 GPU inference succeeded! Language: {info.language}")

if __name__ == "__main__":
    test_line_syntax()
