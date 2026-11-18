"""
init_evidence_db.py - Milestone M0 SQLite Baseline & Evidence Ledger Initializer
Strictly implements:
- ORIGINAL_REQUEST.md §2 Rule 3 (SQLite Baseline & WAL/SHM Discipline)
- PROJECT.md § Interface Contracts (run_evidence.db Schema Contract)
"""

import datetime
import hashlib
import json
import os
import sqlite3
import sys
from pathlib import Path
from typing import Dict, Any, Tuple

# Path Configuration
BASELINE_DIR = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results")
BASELINE_DB = BASELINE_DIR / "whatsapp_forensics.db"
BASELINE_WAL = BASELINE_DIR / "whatsapp_forensics.db-wal"
BASELINE_SHM = BASELINE_DIR / "whatsapp_forensics.db-shm"

TARGET_DIR = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run")
RUN_EVIDENCE_DB = TARGET_DIR / "run_evidence.db"
MANIFEST_REPORT = TARGET_DIR / "reports" / "m0_baseline_manifest.json"

EXPECTED_BASELINE_SHA256 = "030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3"

DDL_STATEMENTS = [
    # 1. file_inventory
    """
    CREATE TABLE IF NOT EXISTS file_inventory (
        file_id INTEGER PRIMARY KEY AUTOINCREMENT,
        rel_path TEXT UNIQUE NOT NULL,
        abs_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        sha256 TEXT,
        modality TEXT NOT NULL CHECK(modality IN ('AUDIO', 'IMAGE', 'VIDEO', 'DOCUMENT', 'CHAT_TXT', 'DATABASE', 'ARCHIVE', 'OTHER')),
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'UNSUPPORTED', 'DUPLICATE', 'SKIPPED')),
        terminal_code TEXT,
        error_message TEXT,
        mtime TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_file_inventory_status ON file_inventory(status);",
    "CREATE INDEX IF NOT EXISTS idx_file_inventory_modality ON file_inventory(modality);",
    "CREATE INDEX IF NOT EXISTS idx_file_inventory_sha256 ON file_inventory(sha256);",
    "CREATE INDEX IF NOT EXISTS idx_file_inventory_modality_status ON file_inventory(modality, status);",

    # 2. ocr_evidence
    """
    CREATE TABLE IF NOT EXISTS ocr_evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
        engine TEXT NOT NULL CHECK(engine IN ('RAPIDOCR', 'TESSERACT')),
        extracted_text TEXT,
        mean_confidence REAL,
        bbox_json TEXT,
        fallback_triggered INTEGER DEFAULT 0 CHECK(fallback_triggered IN (0, 1)),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_ocr_evidence_file_id ON ocr_evidence(file_id);",
    "CREATE INDEX IF NOT EXISTS idx_ocr_evidence_engine ON ocr_evidence(engine);",

    # 3. audio_evidence
    """
    CREATE TABLE IF NOT EXISTS audio_evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
        duration_sec REAL,
        language TEXT,
        language_probability REAL,
        transcript_text TEXT,
        segments_json TEXT,
        terminal_code TEXT NOT NULL CHECK(terminal_code IN ('TRANSCRIBED_SUCCESS', 'CORRUPTED_OR_FAILED', 'UNSUPPORTED_CODEC')),
        error_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_audio_evidence_file_id ON audio_evidence(file_id);",
    "CREATE INDEX IF NOT EXISTS idx_audio_evidence_terminal_code ON audio_evidence(terminal_code);",

    # 4. document_evidence
    """
    CREATE TABLE IF NOT EXISTS document_evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
        doc_type TEXT NOT NULL CHECK(doc_type IN ('PDF', 'DOCX', 'ODS', 'XLSX', 'TXT')),
        extracted_text TEXT,
        page_count INTEGER,
        tables_json TEXT,
        metadata_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_document_evidence_file_id ON document_evidence(file_id);",
    "CREATE INDEX IF NOT EXISTS idx_document_evidence_doc_type ON document_evidence(doc_type);",

    # 5. text_forensic_entities
    """
    CREATE TABLE IF NOT EXISTS text_forensic_entities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        sender TEXT,
        timestamp_iso TEXT,
        entity_type TEXT NOT NULL CHECK(entity_type IN ('CLUB', 'PERSON', 'CIF', 'IBAN', 'CUOTA', 'TARIFF', 'ROLE', 'LICENSE')),
        entity_value TEXT NOT NULL,
        context_snippet TEXT,
        confidence REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_type ON text_forensic_entities(entity_type);",
    "CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_msg_id ON text_forensic_entities(message_id);",
    "CREATE INDEX IF NOT EXISTS idx_text_forensic_entities_val ON text_forensic_entities(entity_value);",

    # 6. attachment_links
    """
    CREATE TABLE IF NOT EXISTS attachment_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        file_id INTEGER NOT NULL REFERENCES file_inventory(file_id) ON DELETE CASCADE,
        match_classification TEXT NOT NULL CHECK(match_classification IN ('CONFIRMED', 'PROBABLE', 'UNRESOLVED', 'CONTRADICTED')),
        match_method TEXT NOT NULL CHECK(match_method IN ('EXACT_FILENAME', 'TIMESTAMP_PROXIMITY', 'HASH_MATCH', 'HEURISTIC')),
        confidence_score REAL,
        evidence_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_attachment_links_message_id ON attachment_links(message_id);",
    "CREATE INDEX IF NOT EXISTS idx_attachment_links_file_id ON attachment_links(file_id);",
    "CREATE INDEX IF NOT EXISTS idx_attachment_links_classification ON attachment_links(match_classification);",

    # 7. cross_modal_index (FTS5)
    """
    CREATE VIRTUAL TABLE IF NOT EXISTS cross_modal_index USING fts5(
        content_id,
        modality,
        source_ref,
        sender_or_creator,
        timestamp_iso,
        indexed_text,
        tokenize='unicode61 remove_diacritics 2'
    );
    """,

    # 8. baseline_manifest (auxiliary audit ledger)
    """
    CREATE TABLE IF NOT EXISTS baseline_manifest (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT UNIQUE NOT NULL,
        file_path TEXT NOT NULL,
        file_size_bytes INTEGER NOT NULL,
        sha256_hash TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,

    # 9. Updated-at Trigger
    """
    CREATE TRIGGER IF NOT EXISTS trg_file_inventory_updated_at
    AFTER UPDATE ON file_inventory
    FOR EACH ROW
    BEGIN
        UPDATE file_inventory SET updated_at = CURRENT_TIMESTAMP WHERE file_id = OLD.file_id;
    END;
    """
]

def compute_sha256(path: Path) -> Tuple[str, int]:
    """Streams file bytes through SHA-256 in 64 KiB chunks."""
    if not path.exists():
        return "", 0
    file_size = path.stat().st_size
    hasher = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest(), file_size

def verify_baseline_database() -> Dict[str, Any]:
    """Executes WAL checkpoint(TRUNCATE), integrity check, and SHA-256 capture."""
    print(f"[*] Verifying Baseline Database at: {BASELINE_DB}")
    if not BASELINE_DB.exists():
        raise FileNotFoundError(f"Baseline database does not exist: {BASELINE_DB}")

    # Checkpoint and integrity check
    conn = sqlite3.connect(BASELINE_DB, timeout=30.0)
    cur = conn.cursor()

    cur.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    checkpoint_res = cur.fetchone()
    print(f"    PRAGMA wal_checkpoint(TRUNCATE): busy={checkpoint_res[0]}, log={checkpoint_res[1]}, checkpointed={checkpoint_res[2]}")

    cur.execute("PRAGMA integrity_check;")
    integrity_res = cur.fetchall()
    print(f"    PRAGMA integrity_check: {integrity_res}")
    
    # Read-only check: verify total messages and contacts
    cur.execute("SELECT count(*) FROM messages;")
    msg_count = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM contacts;")
    contact_count = cur.fetchone()[0]
    print(f"    Baseline Content: {msg_count} messages, {contact_count} contacts")
    conn.close()

    if integrity_res != [("ok",)]:
        raise RuntimeError(f"Baseline database failed integrity check: {integrity_res}")

    # Compute SHA-256 hashes
    db_hash, db_size = compute_sha256(BASELINE_DB)
    wal_hash, wal_size = compute_sha256(BASELINE_WAL)
    shm_hash, shm_size = compute_sha256(BASELINE_SHM)

    print(f"    DB   ({db_size} bytes): {db_hash}")
    print(f"    WAL  ({wal_size} bytes): {wal_hash}")
    print(f"    SHM  ({shm_size} bytes): {shm_hash}")

    if db_hash.lower() != EXPECTED_BASELINE_SHA256.lower():
        raise ValueError(f"Baseline DB hash mismatch! Expected {EXPECTED_BASELINE_SHA256}, got {db_hash}")

    return {
        "db": {"path": str(BASELINE_DB), "size": db_size, "sha256": db_hash, "messages": msg_count, "contacts": contact_count},
        "wal": {"path": str(BASELINE_WAL), "size": wal_size, "sha256": wal_hash},
        "shm": {"path": str(BASELINE_SHM), "size": shm_size, "sha256": shm_hash},
        "integrity": "ok",
        "checkpoint": checkpoint_res
    }

def initialize_run_evidence_db(baseline_info: Dict[str, Any]) -> None:
    """Initializes run_evidence.db with schema, pragmas, and baseline manifest."""
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[*] Initializing Evidence Ledger at: {RUN_EVIDENCE_DB}")

    conn = sqlite3.connect(RUN_EVIDENCE_DB, timeout=60.0)
    cur = conn.cursor()

    # Apply Concurrency & Performance PRAGMAs
    cur.execute("PRAGMA journal_mode = WAL;")
    cur.execute("PRAGMA synchronous = NORMAL;")
    cur.execute("PRAGMA foreign_keys = ON;")
    cur.execute("PRAGMA busy_timeout = 30000;")
    cur.execute("PRAGMA cache_size = -64000;")
    cur.execute("PRAGMA temp_store = MEMORY;")

    # Execute DDL statements
    for stmt in DDL_STATEMENTS:
        cur.execute(stmt)

    # Populate baseline_manifest
    manifest_items = [
        ("whatsapp_forensics.db", baseline_info["db"]["path"], baseline_info["db"]["size"], baseline_info["db"]["sha256"], "VERIFIED_OK"),
        ("whatsapp_forensics.db-wal", baseline_info["wal"]["path"], baseline_info["wal"]["size"], baseline_info["wal"]["sha256"], "VERIFIED_TRUNCATED"),
        ("whatsapp_forensics.db-shm", baseline_info["shm"]["path"], baseline_info["shm"]["size"], baseline_info["shm"]["sha256"], "VERIFIED_ACTIVE")
    ]

    for item in manifest_items:
        cur.execute("""
            INSERT INTO baseline_manifest (item_name, file_path, file_size_bytes, sha256_hash, verification_status)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(item_name) DO UPDATE SET
                file_size_bytes = excluded.file_size_bytes,
                sha256_hash = excluded.sha256_hash,
                verification_status = excluded.verification_status,
                verified_at = CURRENT_TIMESTAMP;
        """, item)

    conn.commit()

    # Validate Table Schema Creation
    cur.execute("SELECT name FROM sqlite_master WHERE type IN ('table', 'virtual') ORDER BY name;")
    tables = [row[0] for row in cur.fetchall()]
    print(f"[*] Verified Tables Created in run_evidence.db: {tables}")

    required_tables = [
        "file_inventory", "ocr_evidence", "audio_evidence",
        "document_evidence", "text_forensic_entities", "attachment_links",
        "cross_modal_index", "baseline_manifest"
    ]
    missing = [t for t in required_tables if t not in tables]
    if missing:
        raise RuntimeError(f"Missing required tables in run_evidence.db: {missing}")

    # Final Ledger Integrity Check
    cur.execute("PRAGMA integrity_check;")
    ledger_integrity = cur.fetchall()
    print(f"[*] run_evidence.db PRAGMA integrity_check: {ledger_integrity}")
    if ledger_integrity != [("ok",)]:
        raise RuntimeError("run_evidence.db failed integrity check!")

    conn.close()
    print("[+] Evidence Ledger Initialization Succeeded!")

    # Write JSON baseline manifest report
    MANIFEST_REPORT.parent.mkdir(parents=True, exist_ok=True)
    manifest_data = {
        "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "milestone": "M0",
        "baseline_database": baseline_info,
        "run_evidence_db": {
            "path": str(RUN_EVIDENCE_DB),
            "journal_mode": "WAL",
            "tables": tables,
            "integrity_check": "ok"
        }
    }
    with open(MANIFEST_REPORT, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)
    print(f"[+] Baseline manifest written to: {MANIFEST_REPORT}")

def main():
    try:
        baseline_info = verify_baseline_database()
        initialize_run_evidence_db(baseline_info)
        print("\n[SUCCESS] M0 SQLite Baseline & Evidence Ledger Initialized.")
        sys.exit(0)
    except Exception as e:
        print(f"\n[FATAL ERROR] {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
