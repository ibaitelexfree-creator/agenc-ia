"""
test_candidate_2.py - Test Candidate 2: dedicated module + clean import line
"""
import os
import sys

def test_module_syntax():
    # Candidate 2: Single line in .pth:
    pth_line = "import _nvidia_cuda_init"
    assert pth_line.startswith(("import ", "import\t")), "Must start with import"
    assert "\n" not in pth_line, "Must be single line"
    
    # Verify module logic structure
    module_code = '''"""
Automatic NVIDIA CUDA 12 & cuDNN 9 DLL Loader Hook
Auto-invoked on Python startup via nvidia_cuda_paths.pth.
"""
import os
import sys
import ctypes

def _init_nvidia_cuda():
    if sys.platform != "win32":
        return

    # Find site-packages directory from module location or site
    site_packages = os.path.dirname(os.path.abspath(__file__))
    nvidia_root = os.path.join(site_packages, "nvidia")
    if not os.path.isdir(nvidia_root):
        import site
        for sp in site.getsitepackages():
            cand = os.path.join(sp, "nvidia")
            if os.path.isdir(cand):
                nvidia_root = cand
                break

    if not os.path.isdir(nvidia_root):
        return

    registered_bins = []
    for subpkg in sorted(os.listdir(nvidia_root)):
        bin_dir = os.path.join(nvidia_root, subpkg, "bin")
        if os.path.isdir(bin_dir):
            try:
                os.add_dll_directory(bin_dir)
            except Exception:
                pass
            registered_bins.append(bin_dir)

    if registered_bins:
        curr_path = os.environ.get("PATH", "")
        new_bins = [b for b in registered_bins if b not in curr_path]
        if new_bins:
            os.environ["PATH"] = os.pathsep.join(new_bins) + os.pathsep + curr_path

    dll_order = ["cublasLt64_12.dll", "cublas64_12.dll", "cudnn64_9.dll"]
    for bin_dir in registered_bins:
        for dll_name in dll_order:
            dll_path = os.path.join(bin_dir, dll_name)
            if os.path.isfile(dll_path):
                try:
                    ctypes.CDLL(dll_path)
                except Exception:
                    pass

_init_nvidia_cuda()
'''
    compile(module_code, "_nvidia_cuda_init.py", "exec")
    print("Candidate 2 module compiles perfectly!")

if __name__ == "__main__":
    test_module_syntax()
