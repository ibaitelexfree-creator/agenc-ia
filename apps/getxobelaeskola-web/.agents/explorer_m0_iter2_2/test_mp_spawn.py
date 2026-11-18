"""
test_mp_spawn.py - Test multiprocessing child process DLL registration via .pth hook
"""
import multiprocessing as mp
import os
import sys

def worker_func(x):
    # Check if nvidia is in PATH in spawned child process
    has_nvidia = any('nvidia' in p.lower() for p in os.environ.get('PATH', '').split(';'))
    import ctranslate2
    cnt = ctranslate2.get_cuda_device_count()
    return f"Child Worker {x}: nvidia_in_path={has_nvidia}, cuda_device_count={cnt}"

def main():
    with mp.Pool(2) as pool:
        results = pool.map(worker_func, [1, 2])
        for r in results:
            print(r)

if __name__ == "__main__":
    main()
