import fitz
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

PDFS = [
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Análisis sangre 14.2.2024.pdf",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Poliza Urko.PDF",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\presupuesto-70879.pdf",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Resource (1).pdf",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Resource (2).pdf",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Resource (3).pdf",
    r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\Resource.pdf",
]

for p in PDFS:
    p_obj = Path(p)
    doc = fitz.open(p)
    print(f"\n=== {p_obj.name} ===")
    print(f"Pages: {doc.page_count}")
    print(f"Producer: {doc.metadata.get('producer')}, Creator: {doc.metadata.get('creator')}")
    total_chars = 0
    total_imgs = 0
    total_tables = 0
    for i, page in enumerate(doc):
        t = page.get_text()
        imgs = page.get_images()
        tabs = page.find_tables()
        total_chars += len(t.strip())
        total_imgs += len(imgs)
        total_tables += len(tabs.tables)
        if i == 0:
            print(f"  Page 1 sample: {repr(t.strip()[:150])}")
            print(f"  Page 1 tables found: {len(tabs.tables)}")
    print(f"Summary: total_chars={total_chars}, total_imgs={total_imgs}, total_tables={total_tables}")
    doc.close()
