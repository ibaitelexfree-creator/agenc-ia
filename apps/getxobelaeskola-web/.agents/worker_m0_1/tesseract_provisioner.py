"""
tesseract_provisioner.py - Automated Tesseract OCR Provisioner & Forensic Verification
Milestone M0: WhatsApp Digital Forensic Multi-Agent Operation
Automates unattended installation / 7-Zip extraction, language pack enrichment (spa + eus),
pytesseract binding, and synthetic in-memory OCR verification.
"""

import os
import sys
import shutil
import subprocess
import urllib.request
import logging
from typing import Dict, Any, Optional, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("tesseract_provisioner")

CANDIDATE_INSTALLER_URLS = [
    "https://github.com/tesseract-ocr/tesseract/releases/download/5.5.0/tesseract-ocr-w64-setup-5.5.0.20241111.exe",
    "https://github.com/tesseract-ocr/tesseract/releases/download/5.4.0/tesseract-ocr-w64-setup-5.4.0.20240606.exe",
    "https://github.com/tesseract-ocr/tesseract/releases/download/5.3.3/tesseract-ocr-w64-setup-5.3.3.20231005.exe",
    "https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.4.0.20240606.exe",
]

TESSDATA_FAST_SPA_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/spa.traineddata"
TESSDATA_FAST_EUS_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/eus.traineddata"
TESSDATA_FAST_ENG_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/eng.traineddata"
TESSDATA_FAST_OSD_URL = "https://github.com/tesseract-ocr/tessdata_fast/raw/main/osd.traineddata"

SEVEN_ZIP_EXE = r"C:\Program Files\7-Zip\7z.exe"

def get_candidate_paths(run_dir: str) -> List[str]:
    return [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
        os.path.join(run_dir, "tools", "tesseract", "tesseract.exe"),
        os.path.join(run_dir, "tools", "tesseract", "{app}", "tesseract.exe")
    ]

def find_tesseract_binary(run_dir: str = "") -> Optional[str]:
    """Scans standard candidate paths and PATH for existing tesseract.exe binary."""
    candidates = get_candidate_paths(run_dir)
    for path in candidates:
        if path and os.path.isfile(path):
            return os.path.abspath(path)
    
    which_path = shutil.which("tesseract")
    if which_path and os.path.isfile(which_path):
        return os.path.abspath(which_path)
    
    return None

def download_with_headers(url: str, dest_path: str) -> bool:
    """Downloads a file using browser User-Agent headers to bypass 403 blocks."""
    if os.path.isfile(dest_path) and os.path.getsize(dest_path) > 10000000:
        logger.info(f"File already downloaded at: {dest_path}")
        return True

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp, open(dest_path, "wb") as f:
            shutil.copyfileobj(resp, f)
        if os.path.isfile(dest_path) and os.path.getsize(dest_path) > 10000:
            return True
    except Exception as e:
        logger.warning(f"Download failed for {url}: {e}")
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass
    return False

def extract_with_7zip(installer_path: str, target_dir: str) -> bool:
    """Uses 7-Zip to extract Inno Setup installer without UAC elevation."""
    if not os.path.isfile(SEVEN_ZIP_EXE):
        logger.warning("7-Zip not found at expected path.")
        return False
    
    os.makedirs(target_dir, exist_ok=True)
    logger.info(f"Extracting installer via 7-Zip to: {target_dir}")
    cmd = [SEVEN_ZIP_EXE, "x", installer_path, f"-o{target_dir}", "-y"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        logger.warning(f"7-Zip extraction returned code {res.returncode}: {res.stderr.strip()}")
        return False

    # Inno Setup extracts files into {app} subfolder
    app_dir = os.path.join(target_dir, "{app}")
    if os.path.isdir(app_dir):
        logger.info(f"Moving extracted files from {app_dir} to {target_dir}...")
        for item in os.listdir(app_dir):
            src = os.path.join(app_dir, item)
            dst = os.path.join(target_dir, item)
            if not os.path.exists(dst):
                try:
                    shutil.move(src, dst)
                except Exception as e:
                    logger.warning(f"Could not move {item}: {e}")

    bin_path = os.path.join(target_dir, "tesseract.exe")
    return os.path.isfile(bin_path)

def install_tesseract_direct(run_dir: str) -> bool:
    """
    Downloads installer directly and unpacks via 7-Zip or PowerShell Start-Process.
    """
    temp_dir = os.path.join(run_dir, "downloads")
    os.makedirs(temp_dir, exist_ok=True)
    temp_installer = os.path.join(temp_dir, "tesseract_setup.exe")

    downloaded = False
    if os.path.isfile(temp_installer) and os.path.getsize(temp_installer) > 10000000:
        downloaded = True
    else:
        for url in CANDIDATE_INSTALLER_URLS:
            logger.info(f"Attempting download from: {url}")
            if download_with_headers(url, temp_installer):
                logger.info(f"Successfully downloaded installer ({os.path.getsize(temp_installer)} bytes).")
                downloaded = True
                break

    if not downloaded:
        logger.error("All direct installer download URLs failed.")
        return False

    local_target = os.path.join(run_dir, "tools", "tesseract")
    
    # Method 1: Extract via 7-Zip (No UAC elevation required)
    logger.info("Attempting 7-Zip extraction of Inno Setup package...")
    if extract_with_7zip(temp_installer, local_target):
        logger.info(f"7-Zip extraction successful! Tesseract binary in {local_target}")
        return True

    # Method 2: PowerShell Start-Process
    logger.info("7-Zip extraction not completed. Falling back to PowerShell Start-Process...")
    ps_cmd = f"Start-Process -FilePath '{temp_installer}' -ArgumentList '/VERYSILENT /NORESTART /SUPPRESSMSGBOXES /DIR={local_target}' -Wait"
    res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True)
    
    found = find_tesseract_binary(run_dir)
    return found is not None

def ensure_language_data(tesseract_exe: str, run_dir: str) -> str:
    """
    Ensures 'eng', 'spa', and 'eus' traineddata files are available.
    Returns the active TESSDATA_PREFIX directory.
    """
    default_tessdata = os.path.join(os.path.dirname(tesseract_exe), "tessdata")
    project_tessdata = os.path.join(run_dir, "tessdata")
    os.makedirs(project_tessdata, exist_ok=True)

    # Determine writable target directory
    target_tessdata = project_tessdata

    # Copy existing default traineddata from install folder if present
    if os.path.isdir(default_tessdata):
        for item in os.listdir(default_tessdata):
            if item.endswith(".traineddata"):
                src = os.path.join(default_tessdata, item)
                dst = os.path.join(project_tessdata, item)
                if not os.path.exists(dst):
                    try:
                        shutil.copy2(src, dst)
                    except Exception as e:
                        logger.warning(f"Failed to copy {item}: {e}")

    # Ensure required languages: eng, osd, spa, eus
    lang_urls = {
        "eng": TESSDATA_FAST_ENG_URL,
        "osd": TESSDATA_FAST_OSD_URL,
        "spa": TESSDATA_FAST_SPA_URL,
        "eus": TESSDATA_FAST_EUS_URL
    }
    for lang, url in lang_urls.items():
        lang_file = os.path.join(target_tessdata, f"{lang}.traineddata")
        if not os.path.isfile(lang_file) or os.path.getsize(lang_file) < 50000:
            logger.info(f"Downloading {lang}.traineddata...")
            download_with_headers(url, lang_file)

    os.environ["TESSDATA_PREFIX"] = target_tessdata
    return target_tessdata

def verify_pytesseract_functional(tesseract_exe: str, tessdata_dir: str) -> Dict[str, Any]:
    """Binds pytesseract, verifies version, languages, and runs an in-memory synthetic OCR test."""
    import pytesseract
    from PIL import Image, ImageDraw, ImageFont

    pytesseract.pytesseract.tesseract_cmd = tesseract_exe
    os.environ["TESSDATA_PREFIX"] = tessdata_dir

    version_str = str(pytesseract.get_tesseract_version())
    langs = pytesseract.get_languages()

    # Generate synthetic 480x120 RGB test image with crisp font
    img = Image.new("RGB", (480, 120), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.load_default(size=32)
    except Exception:
        font = ImageFont.load_default()
    draw.text((20, 40), "GETXO FORENSIC 2026", fill=(0, 0, 0), font=font)

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
    passed = ("GETXO" in extracted_text.upper() and ("2026" in extracted_text or "FORENSIC" in extracted_text.upper()))

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

def provision_and_verify(run_dir: str) -> Dict[str, Any]:
    """Master workflow orchestrator for Tesseract provisioning."""
    logger.info("Checking for existing Tesseract installation...")
    tesseract_exe = find_tesseract_binary(run_dir)

    if not tesseract_exe:
        logger.info("Tesseract not detected. Triggering direct extraction/installation...")
        install_tesseract_direct(run_dir)
        tesseract_exe = find_tesseract_binary(run_dir)

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
    import json
    print("\n--- TESSERACT PROVISIONING DIAGNOSTIC SUMMARY ---")
    print(json.dumps(result, indent=2))
