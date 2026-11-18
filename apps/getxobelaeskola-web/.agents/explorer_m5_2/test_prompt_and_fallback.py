import os
import sys
import json
import sqlite3

sys.path.append(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts")
try:
    import cuda_init
except ImportError:
    pass

from faster_whisper import WhisperModel

print("Loading WhisperModel('small', device='cuda', compute_type='float16')...")
model = WhisperModel("small", device="cuda", device_index=0, compute_type="float16")

test_files = [
    (17171, r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20210604-WA0039.opus"),
    (17166, r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20210604-WA0013.opus"),
    (17188, r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20210613-WA0029.opus"),
    (17429, r"C:\Users\User\Desktop\whatsapp_chats_zip\Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Urko Banc. org\PTT-20251016-WA0000.opus")
]

prompt = "Conversaciones y notas de voz de WhatsApp en español y euskera de Getxo, Bizkaia: Kaixo, aita, aitite, ama, eskerrik asko, Getxo Bela Eskola, Pakea, Urko."

print("\n--- COMPARISON: NO PROMPT vs WITH FORENSIC PROMPT ---")
for fid, path in test_files:
    fname = os.path.basename(path)
    # 1. No prompt
    seg_raw, info_raw = model.transcribe(path, beam_size=5, vad_filter=True)
    text_raw = " ".join([s.text.strip() for s in seg_raw])
    
    # 2. With prompt
    seg_prompt, info_prompt = model.transcribe(path, beam_size=5, vad_filter=True, initial_prompt=prompt)
    text_prompt = " ".join([s.text.strip() for s in seg_prompt])
    
    print(f"\n[File {fid} | {fname}]")
    print(f"  Raw   (lang={info_raw.language}:{info_raw.language_probability:.2f}): {text_raw[:120]}")
    print(f"  Prompt(lang={info_prompt.language}:{info_prompt.language_probability:.2f}): {text_prompt[:120]}")
