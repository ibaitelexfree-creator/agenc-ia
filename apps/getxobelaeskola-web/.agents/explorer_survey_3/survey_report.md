# Digital Forensics Workstation Environment & Toolpaths Survey Report

**Author**: Explorer 3 (Toolpaths, Dependencies & Hardware Gate Specialist)  
**Date**: 2026-10-28  
**Scope**: Hardware platform verification, execution environment, toolpaths, and dependency validation for the WhatsApp Digital Forensic Operation.

---

## 1. Executive Summary & Verification Matrix

The execution workstation has been thoroughly inspected. All primary hardware subsystems, interpreters, and multimedia toolpaths have been empirically verified. The machine possesses exceptional compute and memory headroom, exceeding the requirements of the requested multi-agent architecture.

| Component / Subsystem | Current Status | Measured Specification | Forensic Readiness |
| :--- | :--- | :--- | :--- |
| **GPU Model & Driver** | Verified Active | NVIDIA GeForce RTX 4080 Laptop GPU, Driver 595.79, CUDA 13.2 | **READY** |
| **VRAM & Thermals** | Verified Baseline | 12,282 MiB Total, **8,177 MiB Free**, 41°C Baseline (Safety Limit: 75°C) | **READY (1 GPU Worker)** |
| **CPU & System RAM** | Verified Active | Intel Core i9-14900HX (24C / 32T), **63.6 GB Total RAM, 39.4 GB Free** | **READY (High Concurrency)** |
| **uv Package Manager** | Verified Active | `uv 0.12.3` on PATH; CPython 3.12.13 and 3.14.7 cached | **READY** |
| **FFmpeg Toolpath** | Verified Active | `C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe` (OPUS decoded) | **READY** |
| **Tesseract-OCR** | Missing / Available | Not installed; Available via `UB-Mannheim.TesseractOCR` 5.4.0.20240606 | **REQUIRES INSTALL** |
| **Target Directory** | Requires Creation | `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run` | **110.24 GB Free Disk** |
| **SQLite DB Path** | Path Discovered | Located in `WhatsApp_Analysis_Results\whatsapp_forensics.db` (11.89 MB) | **CRITICAL ROUTING NOTE** |
| **PyTorch-Free CTranslate2** | Architecture Verified | CUDA 12 + cuDNN 9 standalone wheels with `os.add_dll_directory` | **READY** |

---

## 2. Hardware Platform & Resource Telemetry

### 2.1 GPU Subsystem (NVIDIA GeForce RTX 4080 Laptop GPU)
Query executed: `nvidia-smi --query-gpu=gpu_name,driver_version,memory.total,memory.free,memory.used,temperature.gpu,power.draw,utilization.gpu,compute_cap --format=csv,noheader`

- **Device Name**: `NVIDIA GeForce RTX 4080 Laptop GPU`
- **Driver Version**: `595.79`
- **Driver CUDA Compatibility**: `CUDA 13.2`
- **Compute Capability**: `8.9` (Ada Lovelace architecture)
- **Total Physical VRAM**: `12,282 MiB` (~12.0 GB)
- **Free VRAM Available**: `8,177 MiB` (~8.0 GB / 8.18 GB)
- **Current Used VRAM**: `3,819 MiB` (consumed by Windows Desktop Window Manager, Chrome, and background productivity apps)
- **Baseline Temperature**: `41°C` (Well below the 75°C hardware-gate threshold)
- **Power Draw**: `17.84 W` (Idle / low baseline; maximum TGP cap: `175 W`)
- **Current GPU Utilization**: `27% - 45%` (Window composition and display)

### 2.2 Host CPU & Physical Memory
- **Processor**: `Intel(R) Core(TM) i9-14900HX`
  - Total Physical Cores: `24`
  - Total Logical Processors: `32` threads
- **Total Physical RAM**: `66,715,420 KB` (~63.6 GB)
- **Free Physical Memory**: `41,268,324 KB` (~39.4 GB free)
- **Implication**: The host workstation has immense CPU parallelism and memory headroom. The planned 4 CPU RapidOCR workers and 4 Document workers will utilize only 8 cores out of 32 logical processors, leaving 24 logical processors completely free for SQLite read indexers, SHA-256 I/O workers, and background OS tasks.

---

## 3. Python Runtime & `uv` Package Manager

### 3.1 `uv` Availability
- **Executable**: Available directly on system `PATH`
- **Version**: `uv 0.12.3 (507230998 2026-08-07 x86_64-pc-windows-msvc)`

### 3.2 Installed Python Interpreters
1. **CPython 3.12.13 (Recommended for Isolated Virtual Environment)**:
   - Path: `C:\Users\User\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none\python.exe`
   - Compatibility: Optimal compatibility across pre-built wheels (`ctranslate2`, `faster-whisper`, `onnxruntime`, `pymupdf`, `opencv-python`).
2. **CPython 3.11.7 (PlatformIO penv)**:
   - Path: `C:\Users\User\.platformio\penv\Scripts\python.exe`
   - Active on default PATH.
3. **CPython 3.14.7**:
   - Path: `C:\Users\User\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe`
   - Note: Too new for binary wheel compatibility with CTranslate2 and ONNX Runtime; should not be used for this project.

### 3.3 Dependency Resolution Benchmark
An automated dry-run compilation test using `uv pip compile --python 3.12` on the forensic package specifications resolved **49 distinct packages in 5.92 seconds** without a single version conflict:
- `faster-whisper==1.2.1`
- `ctranslate2==4.8.4`
- `nvidia-cublas-cu12==12.9.2.10`
- `nvidia-cudnn-cu12==9.27.0.42`
- `nvidia-cuda-nvrtc-cu12==12.9.86`
- `rapidocr-onnxruntime==1.4.4`
- `onnxruntime==1.31.1`
- `opencv-python==5.0.0.93`
- `pytesseract==0.3.13`
- `pymupdf==2.0`
- `python-docx==1.2.0`
- `odfpy==1.4.1`
- `openpyxl==3.1.5`
- `pandas==3.1.0`

---

## 4. FFmpeg Toolpath, Audio Codec & Real OPUS Execution Verification

### 4.1 Toolpath Verification
- **FFmpeg Binary**: `C:\Users\User\.platformio\penv\Scripts\ffmpeg.exe` (Confirmed on system PATH)
- **FFprobe Binary**: `C:\Users\User\.platformio\penv\Scripts\ffprobe.exe` (Confirmed on system PATH)
- **Build Version**: `ffmpeg version N-55702-g920046a` (built with GCC 4.7.3)

### 4.2 Codec Coverage
Querying decoders via `ffmpeg -decoders` confirmed full support for all target forensic audio formats:
- **Opus**: `libopus` (WhatsApp voice notes: `.opus`)
- **AMR-NB**: `amrnb`, `libopencore_amrnb` (Legacy mobile voice recordings)
- **AMR-WB**: `amrwb`, `libopencore_amrwb`
- **AAC**: `aac`, `aac_latm` (M4A / MP4 voice memos)
- **MP3**: `mp3`, `mp3float`
- **Vorbis**: `vorbis`, `libvorbis`

### 4.3 Real-World Execution Test
Tested `C:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\multimedia_toolkit.py` directly against actual forensic corpus files:
- **Audio OPUS Conversion**:
  - Input: `WhatsApp Chat with Urko Banc. org\PTT-20260423-WA0002.opus`
  - Output: 16 kHz Mono WAV (`1,061,772 bytes`)
  - Status: **`Success: True`**
- **PDF Extraction**:
  - Input: `presupuesto-70879.pdf`
  - Status: **`Success: True`**, 3 Pages, 8,728 characters extracted
- **Image Metadata**:
  - Input: `IMG-20230129-WA0000.jpg`
  - Status: **`Success: True`**, JPEG, 738x1600

---

## 5. Tesseract-OCR Status & Winget Installation Plan

### 5.1 Current Status
- Tesseract-OCR is **not currently installed** on the system.
- Standard installation paths checked:
  - `C:\Program Files\Tesseract-OCR\tesseract.exe`: `False`
  - `where.exe tesseract`: Not found on PATH.

### 5.2 Winget Package Discovery
`winget search UB-Mannheim.TesseractOCR` located the official package:
- **Package Name**: `Tesseract-OCR - open source OCR engine`
- **Package Id**: `UB-Mannheim.TesseractOCR`
- **Version**: `5.4.0.20240606`
- **Installer Type**: Nullsoft (`tesseract-ocr-w64-setup-5.4.0.20240606.exe`)
- **Default Installation Target**: `C:\Program Files\Tesseract-OCR\tesseract.exe`

### 5.3 Installation & Configuration Procedure
As authorized by Rule 2 in the project prompt, the builder/worker provisioning script should execute:
```powershell
winget install UB-Mannheim.TesseractOCR --accept-source-agreements --accept-package-agreements
```
Post-installation, workers must explicitly bind pytesseract to the binary:
```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

*Caveat*: If running the installer without elevated administrator privileges encounters a UAC prompt or fails, the builder can install or extract Tesseract binaries to a user-writable path (e.g., in `forensics_multiagent_run\tools\tesseract\`) or request user approval.

---

## 6. Target Working Directory, Disk Capacity & Database Path Discovery

### 6.1 Disk Storage on `C:` Drive
- **Total Capacity**: `952.86 GB`
- **Used Space**: `842.62 GB`
- **Free Space Available**: `110.24 GB` (`118,372,892,672 bytes`)
- **Conclusion**: Ample disk capacity for all intermediate wav buffers, OCR bounding boxes, SQLite databases, and forensic logs.

### 6.2 Target Directory State
- Directory: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`
- Current Status: **Does not exist yet**.
- Creation requirement:
  ```powershell
  New-Item -ItemType Directory -Path "c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run" -Force
  ```
  Subdirectories to create:
  - `forensics_multiagent_run\logs\`
  - `forensics_multiagent_run\checkpoints\`
  - `forensics_multiagent_run\transcripts\`
  - `forensics_multiagent_run\ocr\`
  - `forensics_multiagent_run\extracted_docs\`

### 6.3 Critical Database Location Finding
- The prompt specifies reading `whatsapp_forensics.db`.
- **Finding**: `whatsapp_forensics.db` does **not** exist in `c:\Users\User\Desktop\whatsapp_chats_zip\whatsapp_forensics.db`.
- **Actual Location**:
  `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`
  - File Size: `11,886,592 bytes` (~11.89 MB)
  - Accompanying files:
    - `whatsapp_forensics.db-shm` (`32,768 bytes`)
    - `whatsapp_forensics.db-wal` (`0 bytes`)
- **Action**: All agents and scripts must reference `WhatsApp_Analysis_Results\whatsapp_forensics.db` when establishing read-only connections and calculating baseline SHA-256 hashes.

---

## 7. CTranslate2 CUDA Acceleration Without PyTorch & ONNX Runtime Concurrency Architecture

### 7.1 Faster-Whisper / CTranslate2 on Windows Without PyTorch
Rule 1 strictly mandates: *"Do not install heavy PyTorch wheels solely for faster-whisper. Verify CTranslate2 CUDA compute support independently."*

#### The Architectural Challenge:
CTranslate2 (v4.8.4) dynamically compiles with CUDA 12 and cuDNN 9. On Windows, Python binaries dynamically load DLLs. Because PyTorch is not present to bundle CUDA runtimes into `site-packages\torch\lib`, CTranslate2 fails with:
`RuntimeError: Library cublas64_12.dll is not found or cannot be loaded` or `cudnn64_9.dll is not found`.

#### The Lean Solution:
1. Provision the virtual environment with standalone NVIDIA runtime wheels:
   ```bash
   uv pip install ctranslate2 faster-whisper nvidia-cublas-cu12 nvidia-cudnn-cu12
   ```
2. In Python 3.8+ on Windows, DLL resolution requires explicit directory registration. The audio worker initialization script must execute this snippet before importing `ctranslate2` or `faster_whisper`:
   ```python
   import os
   import sys
   import site

   if sys.platform == "win32":
       for sp in site.getsitepackages():
           for sub in ("cublas", "cudnn"):
               bin_dir = os.path.join(sp, "nvidia", sub, "bin")
               if os.path.isdir(bin_dir):
                   os.add_dll_directory(bin_dir)
   ```
3. Initialize the model:
   ```python
   from faster_whisper import WhisperModel
   model = WhisperModel("base", device="cuda", compute_type="float16")
   ```
4. **Fallback Guardrail**: If GPU initialization encounters any driver or CUDA error, or if VRAM exceeds 8.0 GB or thermals exceed 75°C, catch exception and fallback:
   ```python
   model = WhisperModel("base", device="cpu", compute_type="int8", cpu_threads=4)
   ```

### 7.2 ONNX Runtime & RapidOCR Concurrency Architecture
- `rapidocr-onnxruntime==1.4.4` relies on `onnxruntime==1.31.1`.
- When installed via CPU wheels, `onnxruntime` executes purely on CPU threads.
- **Strategic Separation**:
  - **GPU**: Exclusively dedicated to **1 Audio Worker** (CTranslate2 `cuda:0`, float16). This consumes ~1.5 - 2.5 GB VRAM, fitting safely inside the 8.18 GB free VRAM buffer.
  - **CPU**: Dedicated to **4 Parallel RapidOCR Image Workers** and **4 Document Workers**. Since the Intel i9-14900HX has 32 threads, this distributes OCR and document parsing seamlessly without contending for GPU VRAM or PCIe bandwidth.

---

## 8. Hardware Gate Checklist & Concurrency Recommendations for Orchestrator

1. **Virtual Environment Provisioning**:
   - Create isolated environment using uv and Python 3.12:
     ```powershell
     uv venv c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv --python 3.12
     ```
   - Install dependencies directly into `.venv`:
     ```powershell
     uv pip install --python c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe `
       faster-whisper ctranslate2 nvidia-cublas-cu12 nvidia-cudnn-cu12 `
       rapidocr-onnxruntime onnxruntime pytesseract pymupdf python-docx odfpy openpyxl pandas
     ```
2. **Worker Concurrency Profile**:
   - **Audio Worker**: `1 worker` (CUDA:0, float16 or int8_float16). Do not scale beyond 1 GPU worker unless VRAM is < 6.0 GB and thermals < 65°C.
   - **RapidOCR Workers**: `4 workers` (CPU / ONNX).
   - **Document Extraction Workers**: `4 workers` (CPU: PyMuPDF, python-docx, odfpy, pandas).
   - **Text Forensics & Lexical Indexers**: `2 workers` (SQLite read-only with WAL mode).
   - **Integrity & Reconciliation Worker**: `1 worker` (I/O, chunked SHA-256).
   - **Telemetry & Metrics Monitor**: `1 worker` (autonomous logging every 5 seconds).
3. **Database Baseline Guardrail**:
   - Before launching workers, execute PRAGMA checkpoint and baseline hashing against:
     `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`
   - Create the isolated ledger:
     `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`

---
*End of Survey Report*
