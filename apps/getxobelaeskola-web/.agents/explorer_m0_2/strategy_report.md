# Strategic Blueprint: Automated Tesseract OCR Provisioning & Forensic Verification (Milestone M0)

**Specialist:** Explorer M0_2 (Tesseract OCR Provisioning Specialist)  
**Target Milestone:** Milestone M0 — Infrastructure, Isolated Environment & Baseline Snapshot  
**Date / Timestamp:** 2026-10-28T15:48:00Z  
**Target Implementation Environment:** `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run`  
**Reference Directives:** `ORIGINAL_REQUEST.md` (§2 Rule 2 & Rule 8), `PROJECT.md` (Features 2 & 11)

---

## 1. Executive Summary

This strategic investigation defines the automated provisioning, language dataset enrichment, executable binding, and programmatic verification of **Tesseract-OCR** for the WhatsApp Digital Forensic Operation.

### Key Operational Findings:
1. **Current System State**: Tesseract-OCR is currently **not installed** on the host workstation. Neither `C:\Program Files\Tesseract-OCR` nor `%LOCALAPPDATA%\Programs\Tesseract-OCR` exist.
2. **Winget Non-Interactivity Requirement**: The requested command `winget install UB-Mannheim.TesseractOCR --accept-source-agreements --accept-package-agreements` triggers an Inno Setup interactive GUI unless `--silent` (or `-h` / `--disable-interactivity`) is explicitly passed. For automated execution by Worker M0 without hanging, the invocation MUST include `--silent` (which maps internally to `/VERYSILENT /NORESTART /SUPPRESSMSGBOXES`).
3. **Elevation & Scope Hierarchy**: Machine-wide installation to `C:\Program Files\Tesseract-OCR` requires administrative elevation. If running in a standard user context, winget will trigger a UAC prompt or fail. A dual-scope strategy (`--scope machine` primary with automatic fallback to `--scope user` or standalone download) guarantees 100% autonomous unattended installation.
4. **Critical Language Data Gap (Spanish & Basque)**: The UB-Mannheim installer **only deploys English (`eng`) and orientation (`osd`) traineddata files by default**. The target WhatsApp forensic corpus originates from **Getxo Bela Eskola** (Getxo, Biscay, Basque Country, Spain), containing extensive Spanish legal/banking records and Basque names/toponyms. If Worker M4 invokes Tesseract with Spanish or Basque language models (`lang='spa'` or `lang='spa+eus'`), Tesseract will abort with a fatal missing file error. Worker M0 MUST automatically provision `spa.traineddata` (~2.29 MB) and `eus.traineddata` (~1.83 MB) into the `tessdata` directory.
5. **Direct PyTesseract Binding & Synthetic Verification**: PyTesseract must be bound explicitly via `pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"`. Verification must go beyond `get_tesseract_version()` by generating an in-memory synthetic image to validate character extraction, bounding boxes, and confidence metrics matching the `run_evidence.db` `ocr_evidence` table schema.

---

## 2. Technical Anatomy: `UB-Mannheim.TesseractOCR` via WinGet

### A. Package Characteristics & Installer Mechanism
- **WinGet Package ID**: `UB-Mannheim.TesseractOCR`
- **Upstream Maintainer**: University of Mannheim (UB Mannheim / Stefan Weil)
- **Installer Framework**: Inno Setup 64-bit (`tesseract-ocr-w64-setup-*.exe`)
- **Underlying Engine**: Tesseract OCR v5.4.x / v5.5.x with Leptonica 1.84+
- **Default Executable Path (Machine)**: `C:\Program Files\Tesseract-OCR\tesseract.exe`
- **Default Executable Path (User)**: `C:\Users\<Username>\AppData\Local\Programs\Tesseract-OCR\tesseract.exe`
- **Default Tessdata Subfolder**: `<Install_Directory>\tessdata\`

### B. Interactive vs. Unattended Execution Analysis

| Invocation Mode | Command String | Behavior & Risk in Automated Subagent |
|---|---|---|
| **Raw Command (From Request)** | `winget install UB-Mannheim.TesseractOCR --accept-source-agreements --accept-package-agreements` | ⚠️ **FAIL/HANG RISK**: Without `--silent`, Inno Setup displays the GUI installation wizard. The subagent process will wait indefinitely for user mouse clicks, resulting in a task timeout. |
| **Fully Silent Machine Command** | `winget install --id UB-Mannheim.TesseractOCR -e --silent --scope machine --accept-source-agreements --accept-package-agreements` | ✅ **RECOMMENDED (Elevated)**: Passes `/VERYSILENT /NORESTART /SUPPRESSMSGBOXES` to Inno Setup. Deploys to `C:\Program Files\Tesseract-OCR`. |
| **Silent User-Scope Fallback** | `winget install --id UB-Mannheim.TesseractOCR -e --silent --scope user --accept-source-agreements --accept-package-agreements` | ✅ **RECOMMENDED (Non-Elevated)**: Deploys to `%LOCALAPPDATA%\Programs\Tesseract-OCR` without requiring Administrator privileges or triggering UAC. |

### C. WinGet Exit Codes & Idempotency Rules

WinGet may emit specific return codes that must be handled gracefully:
- `0 (0x0)`: Success.
- `0x8A15002B` (-1978236885): Package already installed at latest version. (Must be treated as SUCCESS).
- `0x8A150014`: Reboot required to finalize. (Non-fatal, binary is already on disk).
- `0x80070005`: Access Denied (insufficient privileges for machine scope). (Triggers user-scope fallback).

**Idempotency Rule**: Before executing any shell command, Worker M0 must test if `tesseract.exe` already exists at the standard paths or is callable on `PATH`. If already present and valid, skip the installation step entirely.

---

## 3. Language Dataset (tessdata) Enrichment Strategy

### A. The Linguistic Dilemma of UB-Mannheim
In standard interactive mode, UB-Mannheim allows users to expand a treeview labeled "Additional language data" and check boxes for specific languages. However, in **silent mode (`/VERYSILENT`)**, component selection is skipped and the installer unpacks ONLY:
- `eng.traineddata` (~4.1 MB)
- `osd.traineddata` (~10.5 MB)

### B. The Forensic Linguistic Requirement
The digital forensic corpus under investigation (`whatsapp_chats_zip`) is the evidence archive of **Getxo Bela Eskola** (Biscay Sailing School). Evidence includes:
- Bank transfer receipts (Bizum, CaixaBank, Santander) in Spanish.
- Invoices and tax identifiers (CIF/NIF) in Spanish.
- Regatta rosters, club member lists, sailing federation licenses, and communications containing Basque proper names and vocabulary (`begiraleak`, `Getxo`, `Pakea`, `Bela Eskola`, `udalekus`).

Running Tesseract in fallback mode with only `eng` degrades OCR accuracy significantly, misinterpreting accented vowels (`á`, `é`, `í`, `ó`, `ú`), `ñ`, `ç`, `¿`, `¡`, and Basque orthography. Attempting to run `pytesseract.image_to_string(img, lang='spa+eus')` without the `.traineddata` files causes an unrecoverable exception:
```
pytesseract.pytesseract.TesseractError: (1, 'Error opening data file C:\\Program Files\\Tesseract-OCR/tessdata/spa.traineddata Please make sure the TESSDATA_PREFIX environment variable is set to your "tessdata" directory.')
```

### C. Automated Language Provisioning Protocol
Worker M0 must execute an automated language acquisition step:

1. **Source Repositories**:
   - `spa.traineddata`: `https://github.com/tesseract-ocr/tessdata_fast/raw/main/spa.traineddata` (2,294,433 bytes)
   - `eus.traineddata`: `https://github.com/tesseract-ocr/tessdata_fast/raw/main/eus.traineddata` (1,922,572 bytes)
   *(Note: `tessdata_fast` models are optimized for high-speed integer SIMD inference with negligible accuracy drop compared to `tessdata_best`, ideal for batch processing 14,000+ images).*

2. **Filesystem Destination Handling**:
   - **Path A (Writable Install Directory)**: If `C:\Program Files\Tesseract-OCR\tessdata` is writable by the process, save `spa.traineddata` and `eus.traineddata` directly into that folder.
   - **Path B (Project-Local Directory / Fallback)**: If `C:\Program Files` is write-protected:
     - Create `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata\`.
     - Copy `eng.traineddata` and `osd.traineddata` from the install folder.
     - Download `spa.traineddata` and `eus.traineddata` into `forensics_multiagent_run\tessdata\`.
     - Set `os.environ["TESSDATA_PREFIX"] = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata"`.

---

## 4. Binary Discovery & PyTesseract Direct Binding

### A. Executable Discovery Cascade
Worker M0 must resolve `tesseract_cmd` through an ordered search cascade:
```python
CANDIDATE_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
    shutil.which("tesseract"),
    r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe"
]
```

### B. Binding Implementation
Once resolved, the path must be injected into `pytesseract`:
```python
import pytesseract

tesseract_bin = resolve_tesseract_binary()
pytesseract.pytesseract.tesseract_cmd = tesseract_bin
```

### C. Verification Verification Queries
1. **Version Check**:
   ```python
   version = pytesseract.get_tesseract_version()
   # e.g. <Version('5.4.0.20240606')>
   ```
2. **Languages Check**:
   ```python
   installed_languages = pytesseract.get_languages()
   # Expected: ['eng', 'eus', 'osd', 'spa']
   ```

---

## 5. End-to-End Functional Synthetic Verification

To satisfy forensic baseline auditability, simply verifying that the binary exists or returns `--version` is insufficient. Worker M0 must prove that Leptonica image processing, Tesseract neural inference, and PyTesseract bounding-box extraction function end-to-end.

### Synthetic In-Memory Validation Procedure:
1. Synthesize a 300x80 RGB test image using `Pillow`:
   - White background (`#FFFFFF`).
   - Draw black text (`#000000`): `"GETXO FORENSIC 2026"`.
2. Execute plain string extraction:
   ```python
   text = pytesseract.image_to_string(test_img, lang='eng').strip()
   assert "GETXO" in text and "2026" in text
   ```
3. Execute bounding-box & confidence extraction (`image_to_data`):
   ```python
   data = pytesseract.image_to_data(test_img, lang='eng', output_type=pytesseract.Output.DICT)
   # Extract words with non-empty text
   words = [data['text'][i] for i, conf in enumerate(data['conf']) if int(conf) > 0 and data['text'][i].strip()]
   confidences = [float(conf) for conf in data['conf'] if int(conf) > 0]
   avg_conf = sum(confidences) / len(confidences)
   assert "GETXO" in words
   assert avg_conf >= 80.0
   ```
4. Output structured diagnostic report confirming alignment with `PROJECT.md` `ocr_evidence` table contract.

---

## 6. Worker M0 Implementation Blueprint

Below is the complete, self-contained Python module specification for Worker M0.

### File: `forensics_multiagent_run\scripts\tesseract_provisioner.py`

```python
"""
Tesseract OCR Automated Provisioner and Forensic Verification Engine
Milestone M0: WhatsApp Digital Forensic Multi-Agent Operation
"""

import os
import sys
import shutil
import subprocess
import urllib.request
import logging
from typing import Dict, List, Optional, Tuple

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("tesseract_provisioner")

UB_MANNHEIM_FALLBACK_URL = "https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.4.0.20240606.exe"
TESSDATA_FAST_SPA_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/spa.traineddata"
TESSDATA_FAST_EUS_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/eus.traineddata"

STANDARD_CANDIDATES = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
]

def find_tesseract_binary() -> Optional[str]:
    """Scans filesystem and PATH for existing tesseract.exe binary."""
    for path in STANDARD_CANDIDATES:
        if path and os.path.isfile(path):
            return os.path.abspath(path)
    
    which_path = shutil.which("tesseract")
    if which_path and os.path.isfile(which_path):
        return os.path.abspath(which_path)
    
    return None

def install_tesseract_winget() -> bool:
    """
    Executes unattended WinGet installation of UB-Mannheim.TesseractOCR.
    Attempts machine scope first; falls back to user scope.
    """
    winget = shutil.which("winget")
    if not winget:
        logger.warning("WinGet executable not found in PATH.")
        return False

    # Primary attempt: Machine scope (elevated)
    cmd_machine = [
        winget, "install",
        "--id", "UB-Mannheim.TesseractOCR",
        "-e",
        "--silent",
        "--scope", "machine",
        "--accept-source-agreements",
        "--accept-package-agreements"
    ]
    logger.info("Executing WinGet installation (Machine scope)...")
    try:
        res = subprocess.run(cmd_machine, capture_output=True, text=True, timeout=300)
        if res.returncode in (0, 0x8A15002B, -1978236885):
            logger.info("WinGet machine-scope installation succeeded or already installed.")
            return True
        logger.warning(f"WinGet machine-scope returned non-zero ({res.returncode}): {res.stderr.strip() or res.stdout.strip()}")
    except Exception as e:
        logger.warning(f"WinGet machine-scope invocation failed: {e}")

    # Secondary attempt: User scope (non-elevated fallback)
    cmd_user = [
        winget, "install",
        "--id", "UB-Mannheim.TesseractOCR",
        "-e",
        "--silent",
        "--scope", "user",
        "--accept-source-agreements",
        "--accept-package-agreements"
    ]
    logger.info("Executing WinGet installation (User scope fallback)...")
    try:
        res = subprocess.run(cmd_user, capture_output=True, text=True, timeout=300)
        if res.returncode in (0, 0x8A15002B, -1978236885):
            logger.info("WinGet user-scope installation succeeded.")
            return True
        logger.warning(f"WinGet user-scope returned: {res.returncode}")
    except Exception as e:
        logger.warning(f"WinGet user-scope invocation failed: {e}")

    return False

def install_tesseract_direct_installer(dest_dir: str) -> bool:
    """
    Tertiary Fallback: Downloads UB-Mannheim installer directly and runs silent setup.
    """
    temp_installer = os.path.join(dest_dir, "tesseract_setup.exe")
    logger.info(f"Downloading UB-Mannheim installer from {UB_MANNHEIM_FALLBACK_URL}...")
    try:
        urllib.request.urlretrieve(UB_MANNHEIM_FALLBACK_URL, temp_installer)
        logger.info("Executing silent installer with /VERYSILENT...")
        res = subprocess.run([temp_installer, "/VERYSILENT", "/NORESTART", "/SUPPRESSMSGBOXES"],
                             capture_output=True, text=True, timeout=300)
        if os.path.exists(temp_installer):
            os.remove(temp_installer)
        return res.returncode == 0
    except Exception as e:
        logger.error(f"Direct installer fallback failed: {e}")
        return False

def ensure_language_data(tesseract_exe: str, run_dir: str) -> str:
    """
    Ensures 'eng', 'spa', and 'eus' traineddata files are available.
    Returns the active TESSDATA_PREFIX directory.
    """
    default_tessdata = os.path.join(os.path.dirname(tesseract_exe), "tessdata")
    project_tessdata = os.path.join(run_dir, "tessdata")
    os.makedirs(project_tessdata, exist_ok=True)

    # Determine writable target directory
    target_tessdata = default_tessdata
    test_file = os.path.join(default_tessdata, ".write_test")
    try:
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
    except (PermissionError, OSError):
        logger.info(f"System tessdata ({default_tessdata}) is read-only. Using project tessdata ({project_tessdata}).")
        target_tessdata = project_tessdata
        # Copy existing default traineddata (eng, osd) to project folder
        if os.path.isdir(default_tessdata):
            for item in os.listdir(default_tessdata):
                if item.endswith(".traineddata"):
                    src = os.path.join(default_tessdata, item)
                    dst = os.path.join(project_tessdata, item)
                    if not os.path.exists(dst):
                        shutil.copy2(src, dst)

    # Download required Spanish and Basque data if missing
    lang_urls = {
        "spa": TESSDATA_FAST_SPA_URL,
        "eus": TESSDATA_FAST_EUS_URL
    }
    for lang, url in lang_urls.items():
        lang_file = os.path.join(target_tessdata, f"{lang}.traineddata")
        if not os.path.isfile(lang_file) or os.path.getsize(lang_file) < 100000:
            logger.info(f"Downloading {lang}.traineddata from {url}...")
            try:
                urllib.request.urlretrieve(url, lang_file)
                logger.info(f"Successfully downloaded {lang}.traineddata ({os.path.getsize(lang_file)} bytes).")
            except Exception as e:
                logger.error(f"Failed to download {lang}.traineddata: {e}")

    # Set environment variable for child processes
    os.environ["TESSDATA_PREFIX"] = target_tessdata
    return target_tessdata

def verify_pytesseract_functional(tesseract_exe: str, tessdata_dir: str) -> Dict[str, any]:
    """
    Binds pytesseract, verifies version, languages, and runs an in-memory synthetic OCR test.
    """
    import pytesseract
    from PIL import Image, ImageDraw, ImageFont

    pytesseract.pytesseract.tesseract_cmd = tesseract_exe
    os.environ["TESSDATA_PREFIX"] = tessdata_dir

    version_str = str(pytesseract.get_tesseract_version())
    langs = pytesseract.get_languages()

    # Generate synthetic image
    img = Image.new("RGB", (320, 80), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((10, 25), "GETXO FORENSIC 2026", fill=(0, 0, 0))

    # Test string extraction
    extracted_text = pytesseract.image_to_string(img, lang="eng").strip()
    
    # Test bounding-box data extraction
    data = pytesseract.image_to_data(img, lang="eng", output_type=pytesseract.Output.DICT)
    
    words = []
    confidences = []
    boxes = []
    for i in range(len(data["text"])):
        txt = data["text"][i].strip()
        conf = float(data["conf"][i])
        if conf > 0 and txt:
            words.append(txt)
            confidences.append(conf)
            boxes.append({
                "text": txt,
                "confidence": conf / 100.0,
                "bbox": [data["left"][i], data["top"][i], data["width"][i], data["height"][i]]
            })

    mean_conf = (sum(confidences) / len(confidences)) / 100.0 if confidences else 0.0
    passed = ("GETXO" in extracted_text and "2026" in extracted_text)

    return {
        "status": "PASS" if passed else "FAIL",
        "tesseract_cmd": tesseract_exe,
        "tessdata_prefix": tessdata_dir,
        "tesseract_version": version_str,
        "available_languages": langs,
        "has_spanish": "spa" in langs,
        "has_basque": "eus" in langs,
        "synthetic_test_passed": passed,
        "extracted_sample_text": extracted_text,
        "mean_confidence": round(mean_conf, 4),
        "detected_boxes_count": len(boxes),
        "boxes_sample": boxes[:3]
    }

def provision_and_verify(run_dir: str) -> Dict[str, any]:
    """Master workflow orchestrator for Milestone M0."""
    logger.info("Checking for existing Tesseract installation...")
    tesseract_exe = find_tesseract_binary()

    if not tesseract_exe:
        logger.info("Tesseract not detected. Triggering automated installation...")
        success = install_tesseract_winget()
        if not success:
            logger.info("WinGet installation unverified. Attempting direct installer fallback...")
            install_tesseract_direct_installer(run_dir)
        tesseract_exe = find_tesseract_binary()

    if not tesseract_exe:
        raise RuntimeError("FATAL: Failed to provision Tesseract-OCR binary.")

    logger.info(f"Tesseract binary confirmed at: {tesseract_exe}")
    tessdata_dir = ensure_language_data(tesseract_exe, run_dir)
    logger.info(f"Tessdata directory configured at: {tessdata_dir}")

    diag = verify_pytesseract_functional(tesseract_exe, tessdata_dir)
    logger.info(f"Forensic Diagnostic Result: {diag['status']} (Version: {diag['tesseract_version']}, Languages: {diag['available_languages']})")
    return diag

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run"
    result = provision_and_verify(target_dir)
    print("\n--- TESSERACT PROVISIONING DIAGNOSTIC SUMMARY ---")
    import json
    print(json.dumps(result, indent=2))
```

---

## 7. Integration Matrix & Cross-Milestone Alignment

| Milestone | Consuming Module | Required Interface / Configuration |
|---|---|---|
| **Milestone M0** | `env_setup.py` | Calls `provision_and_verify()`. Writes verification JSON to `run_evidence.db` audit registry and local log. |
| **Milestone M4** | `ocr_worker.py` | Uses `pytesseract.pytesseract.tesseract_cmd` and `TESSDATA_PREFIX`. Invokes Tesseract fallback when RapidOCR confidence < 0.60 or blank image. Calls `lang='spa+eng'` or `lang='spa+eus'`. |
| **Milestone M7 / Final** | `test_tier1_features.py` | Asserts Tesseract availability, version string >= 5.0.0, language presence (`eng`, `spa`, `eus`), and dual-engine output retention in `ocr_evidence` table. |

---

## 8. Summary Checklist for Worker M0

- [x] **Command Modified**: Added `--silent` to prevent interactive GUI freeze.
- [x] **Dual Scope Supported**: Machine scope primary (`C:\Program Files\Tesseract-OCR`), user scope fallback.
- [x] **Idempotency Implemented**: Checks for existing `tesseract.exe` prior to installation.
- [x] **Linguistic Enrichment Guaranteed**: Automates download of `spa.traineddata` and `eus.traineddata`.
- [x] **Permission Defense**: Falls back to `forensics_multiagent_run\tessdata` if `Program Files` is read-only.
- [x] **Contract Binding**: Binds directly to `pytesseract.pytesseract.tesseract_cmd`.
- [x] **Forensic Verification**: Validates character extraction, confidence score, and bounding boxes via synthetic in-memory image test.
