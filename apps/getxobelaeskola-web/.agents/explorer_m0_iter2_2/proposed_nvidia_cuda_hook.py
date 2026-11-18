"""
nvidia_cuda_hook.py - Dedicated CUDA & cuDNN DLL Loader Hook
Target location: forensics_multiagent_run/.venv/Lib/site-packages/nvidia_cuda_hook.py
Automatically imported on interpreter startup via nvidia_cuda_paths.pth.
Registers standalone PyPI CUDA 12 wheels (cublas, cudnn, cuda_nvrtc) with Windows DLL loader.
"""
import os
import sys
import ctypes

def init_cuda_hook():
    if sys.platform != "win32":
        return

    # 1. Determine site-packages candidates
    site_packages_dirs = []
    # Relative to this hook file in site-packages
    this_dir = os.path.dirname(os.path.abspath(__file__))
    site_packages_dirs.append(this_dir)

    try:
        import site
        for sp in site.getsitepackages():
            if sp not in site_packages_dirs and os.path.isdir(sp):
                site_packages_dirs.append(sp)
    except Exception:
        pass

    # 2. Discover and register all nvidia/<subpkg>/bin directories
    registered_bins = []
    for sp in site_packages_dirs:
        nvidia_root = os.path.join(sp, "nvidia")
        if os.path.isdir(nvidia_root):
            for subpkg in sorted(os.listdir(nvidia_root)):
                bin_dir = os.path.join(nvidia_root, subpkg, "bin")
                if os.path.isdir(bin_dir):
                    try:
                        os.add_dll_directory(bin_dir)
                    except Exception:
                        pass
                    if bin_dir not in registered_bins:
                        registered_bins.append(bin_dir)

    # 3. Prepend to PATH for third-party C/C++ libraries (CTranslate2, ONNXRuntime)
    if registered_bins:
        curr_path = os.environ.get("PATH", "")
        new_bins = [b for b in registered_bins if b not in curr_path]
        if new_bins:
            os.environ["PATH"] = os.pathsep.join(new_bins) + os.pathsep + curr_path

    # 4. Preload critical CUDA 12 and cuDNN 9 libraries in strict dependency order
    dll_order = ["cublasLt64_12.dll", "cublas64_12.dll", "cudnn64_9.dll"]
    for bin_dir in registered_bins:
        for dll_name in dll_order:
            dll_path = os.path.join(bin_dir, dll_name)
            if os.path.isfile(dll_path):
                try:
                    ctypes.CDLL(dll_path)
                except Exception:
                    pass

init_cuda_hook()
