"""
cuda_init.py - Standalone NVIDIA CUDA 12 & cuDNN 9 Dynamic Library Loader
Milestone M0: WhatsApp Digital Forensic Multi-Agent Operation
Registers standalone PyPI CUDA 12 wheel DLL directories with the Windows loader via os.add_dll_directory(),
prepends to PATH, and preloads cublasLt, cublas, and cudnn into process memory via ctypes.
"""

import os
import sys
import site
import ctypes
import logging

logger = logging.getLogger("cuda_init")

_INITIALIZED = False

def init_cuda_dlls() -> bool:
    """
    Registers standalone NVIDIA CUDA 12 and cuDNN 9 DLL directories
    with the Windows DLL loader via os.add_dll_directory, updates PATH,
    and preloads DLLs into the process virtual address space.
    """
    global _INITIALIZED
    if _INITIALIZED or sys.platform != "win32":
        return True

    registered_paths = []
    
    candidate_dirs = []
    try:
        candidate_dirs.extend(site.getsitepackages())
    except Exception:
        pass
    try:
        if site.getusersitepackages():
            candidate_dirs.append(site.getusersitepackages())
    except Exception:
        pass
        
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    venv_site_packages = os.path.join(base_dir, ".venv", "Lib", "site-packages")
    if os.path.isdir(venv_site_packages) and venv_site_packages not in candidate_dirs:
        candidate_dirs.append(venv_site_packages)

    for sp in candidate_dirs:
        nvidia_root = os.path.join(sp, "nvidia")
        if os.path.isdir(nvidia_root):
            for subpkg in sorted(os.listdir(nvidia_root)):
                bin_dir = os.path.join(nvidia_root, subpkg, "bin")
                if os.path.isdir(bin_dir):
                    try:
                        os.add_dll_directory(bin_dir)
                    except Exception as exc:
                        logger.warning(f"Failed to add DLL dir {bin_dir}: {exc}")
                    
                    if bin_dir not in os.environ.get("PATH", ""):
                        os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
                    registered_paths.append(bin_dir)

    # Pre-load core CUDA libraries in exact dependency order:
    # 1. cublasLt
    # 2. cublas
    # 3. cudnn
    dll_order = ["cublasLt64_12.dll", "cublas64_12.dll", "cudnn64_9.dll"]
    for dll_name in dll_order:
        for p in registered_paths:
            dll_path = os.path.join(p, dll_name)
            if os.path.isfile(dll_path):
                try:
                    ctypes.CDLL(dll_path)
                    logger.info(f"Preloaded: {dll_path}")
                except Exception as e:
                    logger.warning(f"Could not preload {dll_name}: {e}")

    _INITIALIZED = True
    return len(registered_paths) > 0

# Auto-execute upon import
init_cuda_dlls()
