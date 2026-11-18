import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
from rapidocr_onnxruntime import RapidOCR
import pytesseract

sys.stdout.reconfigure(encoding='utf-8')

ocr = RapidOCR()
pytesseract.pytesseract.tesseract_cmd = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tools\tesseract\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tessdata"

# Create image with faint text and noise where RapidOCR gets some text but with low confidence (< 0.60)
for contrast_diff in [35, 45, 55, 65]:
    bg = 200
    fg = bg - contrast_diff
    img = Image.new("RGB", (600, 150), color=(bg, bg, bg))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.load_default(size=22)
    except Exception:
        font = ImageFont.load_default()
    d.text((20, 20), "GETXO BELA ESKOLA CUOTA 2026", fill=(fg, fg, fg), font=font)
    d.text((20, 60), "TRANSFERENCIA BANCARIA 150 EUR", fill=(fg, fg, fg), font=font)
    d.text((20, 100), "ORDENANTE: IBAI SANTILLAN", fill=(fg, fg, fg), font=font)
    
    # Add slight blur
    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
    
    test_path = f"test_fixtures/test_contrast_{contrast_diff}.png"
    img.save(test_path)
    
    res, elapse = ocr(test_path)
    if res:
        scores = [float(x[2]) for x in res]
        tot_chars = sum([len(str(x[1])) for x in res])
        weighted = sum([len(str(x[1])) * float(x[2]) for x in res]) / tot_chars
        print(f"Diff {contrast_diff:2d}: lines={len(res):2d}, chars={tot_chars:3d}, unweighted={np.mean(scores):.4f}, weighted={weighted:.4f}")
        for r in res:
            print(f"    [{float(r[2]):.2f}] {r[1]}")
    else:
        print(f"Diff {contrast_diff:2d}: 0 text lines detected.")
