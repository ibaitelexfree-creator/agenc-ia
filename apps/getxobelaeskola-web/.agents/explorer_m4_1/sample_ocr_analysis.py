import sqlite3
import os
import sys
import time
import json
import random
from rapidocr_onnxruntime import RapidOCR

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
OUTPUT_OCR_SAMPLE = r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_1\sample_ocr_results.json"

conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get images by category
cursor.execute("SELECT file_id, rel_path, abs_path, file_size FROM file_inventory WHERE modality = 'IMAGE' AND status = 'PENDING'")
all_pending = cursor.fetchall()
conn.close()

# Stratify into categories
categories = {
    'received': [r for r in all_pending if 'WhatsApp Images' in r['rel_path'] and 'Sent' not in r['rel_path'] and 'Private' not in r['rel_path']],
    'sent': [r for r in all_pending if 'WhatsApp Images\\Sent' in r['rel_path']],
    'private': [r for r in all_pending if 'WhatsApp Images\\Private' in r['rel_path']],
    'manual_chats': [r for r in all_pending if 'Whatsapp web' in r['rel_path'] and not r['rel_path'].endswith('.webp')],
    'stickers_webp': [r for r in all_pending if r['rel_path'].endswith('.webp')],
}

random.seed(1337)
sample_set = []
# Pick 40 received, 30 sent, 30 private, 25 manual, 25 stickers = 150 total
sample_set.extend([('received', r) for r in random.sample(categories['received'], min(40, len(categories['received'])))])
sample_set.extend([('sent', r) for r in random.sample(categories['sent'], min(30, len(categories['sent'])))])
sample_set.extend([('private', r) for r in random.sample(categories['private'], min(30, len(categories['private'])))])
sample_set.extend([('manual_chats', r) for r in random.sample(categories['manual_chats'], min(25, len(categories['manual_chats'])))])
sample_set.extend([('stickers_webp', r) for r in random.sample(categories['stickers_webp'], min(25, len(categories['stickers_webp'])))])

print(f"Sample size: {len(sample_set)} images. Initializing RapidOCR...")
engine = RapidOCR()

results = []
t0 = time.time()
cat_stats = {cat: {'total': 0, 'with_text': 0, 'no_text': 0, 'fallback_candidates': 0, 'confidences': []} for cat in categories}

for cat, r in sample_set:
    p = r['abs_path']
    start_t = time.time()
    ocr_res, elapse = engine(p)
    duration = time.time() - start_t
    
    cat_stats[cat]['total'] += 1
    
    if ocr_res:
        lines = [box[1] for box in ocr_res]
        confs = [float(box[2]) for box in ocr_res]
        full_text = "\n".join(lines)
        mean_conf = sum(confs) / len(confs) if confs else 0.0
        char_count = sum(len(l) for l in lines)
        cat_stats[cat]['with_text'] += 1
        cat_stats[cat]['confidences'].append(mean_conf)
        
        fallback = False
        if mean_conf < 0.60:
            fallback = True
            cat_stats[cat]['fallback_candidates'] += 1
            
        results.append({
            'file_id': r['file_id'],
            'rel_path': r['rel_path'],
            'category': cat,
            'has_text': True,
            'char_count': char_count,
            'line_count': len(lines),
            'mean_confidence': round(mean_conf, 4),
            'fallback_triggered': fallback,
            'duration_sec': round(duration, 3),
            'snippet': full_text[:120].replace('\n', ' ')
        })
    else:
        cat_stats[cat]['no_text'] += 1
        results.append({
            'file_id': r['file_id'],
            'rel_path': r['rel_path'],
            'category': cat,
            'has_text': False,
            'char_count': 0,
            'line_count': 0,
            'mean_confidence': 0.0,
            'fallback_triggered': False,
            'duration_sec': round(duration, 3),
            'snippet': ''
        })

total_time = time.time() - t0
overall_with_text = sum(1 for r in results if r['has_text'])
overall_no_text = sum(1 for r in results if not r['has_text'])
overall_fallback = sum(1 for r in results if r['fallback_triggered'])
all_confs = [r['mean_confidence'] for r in results if r['has_text']]
overall_mean_conf = sum(all_confs) / len(all_confs) if all_confs else 0.0

summary = {
    'sample_size': len(sample_set),
    'elapsed_seconds': round(total_time, 2),
    'throughput_img_per_sec': round(len(sample_set) / total_time, 2),
    'overall_with_text': overall_with_text,
    'overall_with_text_pct': round(overall_with_text / len(sample_set) * 100, 2),
    'overall_no_text': overall_no_text,
    'overall_no_text_pct': round(overall_no_text / len(sample_set) * 100, 2),
    'overall_fallback_triggered': overall_fallback,
    'overall_fallback_pct': round(overall_fallback / len(sample_set) * 100, 2),
    'overall_mean_confidence': round(overall_mean_conf, 4),
    'category_breakdown': {}
}

for cat, st in cat_stats.items():
    confs = st['confidences']
    avg_c = round(sum(confs) / len(confs), 4) if confs else 0.0
    summary['category_breakdown'][cat] = {
        'total': st['total'],
        'with_text': st['with_text'],
        'with_text_pct': round(st['with_text'] / st['total'] * 100, 2) if st['total'] else 0,
        'no_text': st['no_text'],
        'no_text_pct': round(st['no_text'] / st['total'] * 100, 2) if st['total'] else 0,
        'fallback_candidates': st['fallback_candidates'],
        'fallback_pct': round(st['fallback_candidates'] / st['total'] * 100, 2) if st['total'] else 0,
        'mean_confidence': avg_c
    }

output_payload = {
    'summary': summary,
    'sample_records': results
}

with open(OUTPUT_OCR_SAMPLE, 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, indent=2)

print(f"\nOCR test complete on {len(sample_set)} images in {total_time:.2f}s ({len(sample_set)/total_time:.2f} img/s).")
print(f"Overall With Text: {overall_with_text} ({overall_with_text/len(sample_set)*100:.1f}%)")
print(f"Overall No Text  : {overall_no_text} ({overall_no_text/len(sample_set)*100:.1f}%)")
print(f"Fallback Triggered (mean conf < 0.60): {overall_fallback} ({overall_fallback/len(sample_set)*100:.1f}%)")
print(f"Overall Mean Confidence on images with text: {overall_mean_conf:.4f}")
print("\nCategory Breakdown:")
for cat, data in summary['category_breakdown'].items():
    print(f"  {cat:15}: With Text={data['with_text']}/{data['total']} ({data['with_text_pct']}%), AvgConf={data['mean_confidence']}")
