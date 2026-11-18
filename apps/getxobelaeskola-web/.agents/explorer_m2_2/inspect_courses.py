import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_uri = "file:///C:/Users/User/Desktop/whatsapp_chats_zip/WhatsApp_Analysis_Results/whatsapp_forensics.db?mode=ro"
conn = sqlite3.connect(db_uri, uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

sample_msg_ids = [
    'MSG_0002107', # J80 promo
    'MSG_0002106', # Laser promo
    'MSG_0001978', # Meteo promo
    'MSG_0002108', # Konpondu promo
    'MSG_0005521', # Cuota Lutxo 1
    'MSG_0005522', # Cuota Lutxo 2
    'MSG_0005698', # Bono Pablo
    'MSG_0005630', # Bono Miriam
    'MSG_0000211', # Meteo fee
    'MSG_0001951', # Meteo fee 2
    'MSG_0001208', # Legal identity
    'MSG_0004398', # Commercial identity
    'MSG_0003793', # NIF photocopy
    'MSG_0000202', # Bank account intro
    'MSG_0002112', # Urko self-introduction
    'MSG_0004508'  # Imiau audit instructions
]

for mid in sample_msg_ids:
    cursor.execute("SELECT msg_id, date, time, sender, content FROM messages WHERE msg_id = ?", (mid,))
    r = cursor.fetchone()
    if r:
        print(f"==================================================")
        print(f"[{r['msg_id']}] {r['date']} {r['time']} | {r['sender']}")
        print(f"--------------------------------------------------")
        print(r['content'])
        print(f"==================================================\n")

conn.close()
