import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("c:/Users/User/Desktop/agenc-ia/apps/getxobelaeskola-web/.agents/explorer_m2_2/investigation_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("=== ALL FOUND IBANS ===")
for item in data['found_ibans']:
    print(f"[{item['msg_id']}] Sender: {item['sender']}")
    print(f"  IBANs: {item['ibans']}")
    print(f"  Content snippet: {item['content'][:200]}...")

print("\n=== ALL FOUND 20-DIGIT ACCOUNTS ===")
for item in data['found_20digits']:
    print(f"[{item['msg_id']}] Sender: {item['sender']}")
    print(f"  Account: {item['account']}")
    print(f"  Content snippet: {item['content'][:200]}...")

print("\n=== BANK MESSAGES SUMMARY ===")
for bm in data['bank_sample_messages']:
    print(f"[{bm['msg_id']}] {bm['date']} | {bm['sender']}: {bm['content'][:150]}")

print("\n=== BIZUM MESSAGES ===")
for bm in data['bizum_msgs']:
    print(f"[{bm['msg_id']}] {bm['date']} | {bm['sender']}: {bm['content']}")
