import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
from rapidocr_onnxruntime import RapidOCR
import io

sys.stdout.reconfigure(encoding='utf-8')
ocr = RapidOCR()

for blur_r in [1.5, 2.0, 2.5, 3.0, 3.5]:
    img = Image.new("RGB", (600, 150), color=(240, 240, 240))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.load_default(size=20)
    except Exception:
        font = ImageFont.load_default()
    d.text((20, 20), "GETXO BELA ESKOLA CUOTA 2026", fill=(30, 30, 30), font=font)
    d.text((20, 60), "TRANSFERENCIA BANCARIA 150 EUR", fill=(30, 30, 30), font=font)
    d.text((20, 100), "ORDENANTE: IBAI SANTILLAN", fill=(30, 30, 30), font=font)
    
    # Heavy blur
    blurred = img.filter(ImageFilter.GaussianBlur(radius=blur_r))
    
    # Add noise
    arr = np.array(blurred).astype(np.float32)
    noise = np.random.normal(0, 25, arr.shape)
    noisy_arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    noisy_img = Image.fromarray(noisy_arr)
    
    # Compress with low JPEG quality
    buf = io.BytesIO()
    noisy_img.save(buf, format="JPEG", quality=20)
    buf.seek(0)
    final_img = Image.open(buf)
    
    p = f"test_fixtures/degraded_blur_{blur_r}.jpg"
    final_img.save(p)
    
    res, elapse = ocr(p)
    if res:
        scores = [float(x[2]) for x in res]
        tot_chars = sum([len(str(x[1])) for x in res])
        weighted = sum([len(str(x[1])) * float(x[2]) for x in res]) / tot_chars
        print(f"Blur {blur_r:.1f}: lines={len(res)}, chars={tot_chars}, conf={weighted:.4f}")
        for r in res:
            print(f"   [{float(r[2]):.2f}] {r[1]}")
    else:
        print(f"Blur {blur_r:.1f}: 0 text lines detected.")
