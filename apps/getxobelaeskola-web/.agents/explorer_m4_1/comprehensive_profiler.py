import sqlite3
import os
import sys
import time
import json
import random
from collections import Counter, defaultdict
import statistics
from PIL import Image, ImageFile

# Ensure Pillow handles large images safely if any
Image.MAX_IMAGE_PIXELS = None

DB_PATH = r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db"
OUTPUT_JSON = r"c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m4_1\image_profile_data.json"

print("Connecting to run_evidence.db...")
conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
    SELECT file_id, rel_path, abs_path, file_size, sha256, modality, status, terminal_code, error_message, mtime
    FROM file_inventory
    WHERE modality = 'IMAGE'
    ORDER BY file_id ASC
""")
rows = cursor.fetchall()
conn.close()

total_images = len(rows)
print(f"Total images loaded: {total_images:,}")

# 1. Full Integrity Scan using Image.open() + verify()
print("\nStarting full structural verification (Image.open + img.verify)...")
t0 = time.time()

verify_errors = []
formats = Counter()
modes = Counter()
dimensions = [] # (width, height)
aspect_ratios = [] # width / height
category_counts = Counter()

# Details per file
for idx, r in enumerate(rows):
    p = r['abs_path']
    rel = r['rel_path'].replace('\\', '/')
    
    # Categorize directory
    if 'com.whatsapp' in rel:
        if 'WhatsApp Images' in rel:
            if '/Sent/' in rel:
                cat = 'WhatsApp Images/Sent'
            elif '/Private/' in rel:
                cat = 'WhatsApp Images/Private'
            else:
                cat = 'WhatsApp Images/Received'
        else:
            cat = 'com.whatsapp/Other'
    elif 'Whatsapp web Extraccion manual' in rel:
        if 'Wireframe Skull' in rel:
            cat = 'Manual Extraction/Foreign (Wireframe Skull)'
        else:
            cat = 'Manual Extraction/Chat Attachments'
    else:
        cat = 'Other'
    category_counts[cat] += 1

    try:
        with Image.open(p) as img:
            fmt = img.format or 'UNKNOWN'
            mode = img.mode or 'UNKNOWN'
            w, h = img.size
            formats[fmt] += 1
            modes[mode] += 1
            dimensions.append((w, h))
            if h > 0:
                aspect_ratios.append(round(w / h, 3))
            img.verify()
    except Exception as e:
        verify_errors.append({
            'file_id': r['file_id'],
            'rel_path': r['rel_path'],
            'abs_path': p,
            'file_size': r['file_size'],
            'error': str(e)
        })
    
    if (idx + 1) % 2500 == 0 or (idx + 1) == total_images:
        print(f"  Processed {idx + 1:,} / {total_images:,} images ({time.time() - t0:.1f}s)...")

t1 = time.time()
print(f"Full verify completed in {t1 - t0:.2f}s ({total_images / (t1 - t0):.1f} img/s).")
print(f"Verify errors: {len(verify_errors)}")

# 2. Deep Pixel Decode Test (img.load()) on critical subsets
print("\nPerforming deep decode test (img.load())...")
deep_decode_errors = []
deep_decode_tested = 0

# Select subsets:
# a) All non-jpg images (.jpeg, .png, .webp)
# b) Foreign skull images
# c) Smallest 100 images
# d) Largest 100 images
# e) Stratified random sample of 500 JPGs
non_jpg_rows = [r for r in rows if not r['rel_path'].lower().endswith('.jpg')]
sorted_by_size = sorted(rows, key=lambda x: x['file_size'])
smallest_100 = sorted_by_size[:100]
largest_100 = sorted_by_size[-100:]

random.seed(42)
jpg_rows = [r for r in rows if r['rel_path'].lower().endswith('.jpg')]
random_jpg_sample = random.sample(jpg_rows, min(1000, len(jpg_rows)))

deep_test_set = {r['file_id']: r for r in (non_jpg_rows + smallest_100 + largest_100 + random_jpg_sample)}
print(f"Total targeted images for deep decode: {len(deep_test_set):,}")

t_deep0 = time.time()
for fid, r in deep_test_set.items():
    p = r['abs_path']
    deep_decode_tested += 1
    try:
        with Image.open(p) as img:
            img.load()
    except Exception as e:
        deep_decode_errors.append({
            'file_id': r['file_id'],
            'rel_path': r['rel_path'],
            'file_size': r['file_size'],
            'error': str(e)
        })

t_deep1 = time.time()
print(f"Deep decode completed in {t_deep1 - t_deep0:.2f}s ({deep_decode_tested / (t_deep1 - t_deep0):.1f} img/s).")
print(f"Deep decode errors: {len(deep_decode_errors)}")

# 3. Dimension & Aspect Ratio Statistics
widths = [d[0] for d in dimensions]
heights = [d[1] for d in dimensions]
megapixels = [(d[0] * d[1]) / 1_000_000 for d in dimensions]

orientation_counts = Counter()
for w, h in dimensions:
    if w > h:
        orientation_counts['Landscape (w > h)'] += 1
    elif h > w:
        orientation_counts['Portrait (h > w)'] += 1
    else:
        orientation_counts['Square (w == h)'] += 1

resolution_brackets = Counter()
for mp in megapixels:
    if mp < 0.1: # < 100k pixels (e.g. thumbnails / stickers)
        resolution_brackets['Thumbnail / Icon (< 0.1 MP)'] += 1
    elif mp < 0.5: # 0.1 - 0.5 MP
        resolution_brackets['Low Resolution (0.1 - 0.5 MP)'] += 1
    elif mp < 1.0: # 0.5 - 1.0 MP
        resolution_brackets['Medium Resolution (0.5 - 1.0 MP)'] += 1
    elif mp < 2.5: # 1.0 - 2.5 MP (typical WhatsApp 1600x1200 ~ 1.92 MP)
        resolution_brackets['Standard WhatsApp Res (1.0 - 2.5 MP)'] += 1
    elif mp < 5.0:
        resolution_brackets['High Resolution (2.5 - 5.0 MP)'] += 1
    elif mp < 12.0:
        resolution_brackets['Full Camera Resolution (5.0 - 12.0 MP)'] += 1
    else:
        resolution_brackets['Very High Resolution (> 12 MP)'] += 1

# Common exact resolutions
res_counter = Counter(dimensions)

# 4. Save results to JSON
results = {
    'summary': {
        'total_images_in_inventory': total_images,
        'status_pending': sum(1 for r in rows if r['status'] == 'PENDING'),
        'status_skipped': sum(1 for r in rows if r['status'] == 'SKIPPED'),
        'verify_errors_count': len(verify_errors),
        'deep_decode_tested': deep_decode_tested,
        'deep_decode_errors_count': len(deep_decode_errors),
    },
    'formats_detected': dict(formats),
    'modes_detected': dict(modes),
    'category_counts': dict(category_counts),
    'orientation_counts': dict(orientation_counts),
    'resolution_brackets': dict(resolution_brackets),
    'top_15_exact_resolutions': [
        {'resolution': f"{w}x{h}", 'count': cnt, 'percentage': round(cnt / total_images * 100, 2)}
        for (w, h), cnt in res_counter.most_common(15)
    ],
    'dimension_stats': {
        'width_min': min(widths) if widths else 0,
        'width_max': max(widths) if widths else 0,
        'width_median': statistics.median(widths) if widths else 0,
        'height_min': min(heights) if heights else 0,
        'height_max': max(heights) if heights else 0,
        'height_median': statistics.median(heights) if heights else 0,
        'megapixels_min': round(min(megapixels), 3) if megapixels else 0,
        'megapixels_max': round(max(megapixels), 2) if megapixels else 0,
        'megapixels_mean': round(statistics.mean(megapixels), 2) if megapixels else 0,
        'megapixels_median': round(statistics.median(megapixels), 2) if megapixels else 0,
    },
    'verify_errors': verify_errors,
    'deep_decode_errors': deep_decode_errors,
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f"\nResults successfully exported to {OUTPUT_JSON}.")
print("\n--- Summary Highlights ---")
print(f"Formats detected: {dict(formats)}")
print(f"Modes detected: {dict(modes)}")
print(f"Top 5 exact resolutions: {res_counter.most_common(5)}")
print(f"Orientations: {dict(orientation_counts)}")
print(f"Resolution brackets: {dict(resolution_brackets)}")
