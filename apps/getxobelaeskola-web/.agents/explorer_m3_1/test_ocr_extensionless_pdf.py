import fitz
import io
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

PDF_PATH = r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\DOC-20251120-WA0006"

doc = fitz.open(PDF_PATH)
ocr = RapidOCR()

print(f"Testing OCR on {PDF_PATH} ({doc.page_count} pages)")

for page_idx in range(doc.page_count):
    page = doc[page_idx]
    # Render page to pixmap at 2x resolution (144 dpi) for high accuracy OCR
    pix = page.get_pixmap(dpi=150)
    img_bytes = pix.tobytes("png")
    
    result, elapse = ocr(img_bytes)
    print(f"\n--- Page {page_idx + 1} OCR Output ---")
    if result:
        print(f"Total lines detected: {len(result)}")
        for line in result[:15]:
            text, score = line[1], line[2]
            print(f"  [{score:.2f}] {text}")
        if len(result) > 15:
            print(f"  ... and {len(result) - 15} more lines.")
    else:
        print("No OCR text detected.")

doc.close()
