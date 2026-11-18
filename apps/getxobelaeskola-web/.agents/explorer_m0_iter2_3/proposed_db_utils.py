"""
db_utils.py - Centralized SQLite Connection Factory & Forensic Integrity Provider
WhatsApp Digital Forensic Multi-Agent Operation — Milestone M0

Provides unified, robust, and hardened SQLite connection factories:
- get_evidence_conn(): Managed connection to run_evidence.db with persistent
  connection-level PRAGMAs (busy_timeout=30000, foreign_keys=ON, synchronous=NORMAL),
  WAL journal mode, and sqlite3.Row factory.
- get_baseline_conn(): Strictly read-only connection to whatsapp_forensics.db using
  file URI mode (?mode=ro), PRAGMA query_only=ON, and automated write-rejection verification.
- immediate_transaction(): Context manager ensuring BEGIN IMMEDIATE transactions to prevent
  multi-worker lock escalation deadlocks (OperationalError: database is locked).
"""

import ctypes
import os
import stat
import sys
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, Union, Any, Dict, Tuple

# Default canonical paths
DEFAULT_RUN_EVIDENCE_PATH = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db")
DEFAULT_BASELINE_PATH = Path(r"c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db")


def is_windows_readonly(file_path: Union[str, Path]) -> bool:
    """
    Checks whether a file has the OS-level read-only attribute (+R) set.
    Uses Win32 GetFileAttributesW on Windows with stat.S_IWRITE fallback.
    """
    p = Path(file_path).resolve()
    if not p.exists():
        return False
    if sys.platform == "win32":
        FILE_ATTRIBUTE_READONLY = 0x1
        attrs = ctypes.windll.kernel32.GetFileAttributesW(str(p))
        if attrs != -1:
            return bool(attrs & FILE_ATTRIBUTE_READONLY)
    mode = os.stat(p).st_mode
    return not bool(mode & stat.S_IWRITE)


def get_evidence_conn(
    db_path: Optional[Union[str, Path]] = None,
    timeout: float = 30.0,
    row_factory: Optional[Any] = sqlite3.Row,
    busy_timeout_ms: int = 30000,
    synchronous: str = "NORMAL",
    foreign_keys: bool = True,
    cache_size_kb: int = 64000
) -> sqlite3.Connection:
    """
    Returns a hardened connection to run_evidence.db with enforced connection-level PRAGMAs.

    Guarantees:
    - busy_timeout set to 30,000ms (30s) to absorb concurrent worker contention.
    - foreign_keys explicitly enabled (ON).
    - synchronous set to NORMAL for optimal WAL write throughput without data loss.
    - journal_mode set to WAL.
    - In-memory cache and temp_store optimized for multi-agent workloads.
    - row_factory configured to sqlite3.Row by default for dict-like column access.
    """
    target = Path(db_path or os.environ.get("FORENSICS_RUN_EVIDENCE_DB") or DEFAULT_RUN_EVIDENCE_PATH).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(str(target), timeout=timeout)
    if row_factory is not None:
        conn.row_factory = row_factory

    cur = conn.cursor()
    cur.execute(f"PRAGMA busy_timeout = {int(busy_timeout_ms)};")
    cur.execute(f"PRAGMA foreign_keys = {1 if foreign_keys else 0};")
    cur.execute(f"PRAGMA synchronous = {synchronous};")
    cur.execute("PRAGMA journal_mode = WAL;")
    cur.execute(f"PRAGMA cache_size = -{int(cache_size_kb)};")
    cur.execute("PRAGMA temp_store = MEMORY;")

    return conn


# Backward-compatible alias for Reviewer 2 verification suite
get_evidence_db_connection = get_evidence_conn


def get_baseline_conn(
    db_path: Optional[Union[str, Path]] = None,
    immutable: bool = False,
    timeout: float = 30.0,
    row_factory: Optional[Any] = sqlite3.Row,
    verify_ro: bool = True
) -> sqlite3.Connection:
    """
    Returns a strictly read-only connection to whatsapp_forensics.db.

    Guarantees:
    - Opened via URI mode with '?mode=ro' (and optional '&immutable=1').
    - PRAGMA query_only = ON; enforced on connection creation.
    - Automated read-only probe verification: guarantees write attempts fail
      with sqlite3.OperationalError: attempt to write a readonly database.
    - Preserves bit-level cryptographic baseline invariance.
    """
    target = Path(db_path or os.environ.get("FORENSICS_BASELINE_DB") or DEFAULT_BASELINE_PATH).resolve()
    if not target.exists():
        raise FileNotFoundError(f"Baseline forensic database not found at: {target}")

    uri_base = target.as_uri()
    query_params = ["mode=ro"]
    if immutable:
        query_params.append("immutable=1")
    uri = f"{uri_base}?{'&'.join(query_params)}"

    conn = sqlite3.connect(uri, uri=True, timeout=timeout)
    if row_factory is not None:
        conn.row_factory = row_factory

    cur = conn.cursor()
    cur.execute("PRAGMA query_only = ON;")
    cur.execute("PRAGMA busy_timeout = 30000;")

    if verify_ro:
        cur.execute("PRAGMA query_only;")
        qo = cur.fetchone()[0]
        if qo != 1:
            conn.close()
            raise RuntimeError("Baseline DB failed PRAGMA query_only verification!")

        # Active write-rejection probe
        try:
            cur.execute("CREATE TABLE _forensic_ro_probe (id INT);")
            cur.execute("DROP TABLE _forensic_ro_probe;")
            conn.close()
            raise PermissionError("CRITICAL FORENSIC VIOLATION: Baseline DB connection is writable!")
        except sqlite3.OperationalError as e:
            if "readonly" not in str(e).lower():
                conn.close()
                raise

    return conn


# Backward-compatible alias for Reviewer 2 verification suite
get_readonly_baseline_connection = get_baseline_conn


@contextmanager
def immediate_transaction(conn: sqlite3.Connection):
    """
    Context manager that wraps operations in a 'BEGIN IMMEDIATE' transaction.
    
    Prevents lock escalation deadlocks in multi-process/multi-threaded SQLite WAL
    deployments by acquiring the write lock upfront at transaction entry rather than
    deferring until the first write statement.
    """
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE;")
    try:
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise


def get_connection_pragmas(conn: sqlite3.Connection) -> Dict[str, Any]:
    """Inspects and returns key PRAGMA settings for the given connection."""
    cur = conn.cursor()
    cur.execute("PRAGMA busy_timeout;")
    bt = cur.fetchone()[0]
    cur.execute("PRAGMA foreign_keys;")
    fk = cur.fetchone()[0]
    cur.execute("PRAGMA synchronous;")
    sync = cur.fetchone()[0]
    cur.execute("PRAGMA journal_mode;")
    jm = cur.fetchone()[0]
    cur.execute("PRAGMA query_only;")
    qo = cur.fetchone()[0]
    return {
        "busy_timeout": bt,
        "foreign_keys": fk,
        "synchronous": sync,
        "journal_mode": jm,
        "query_only": qo
    }


def verify_baseline_integrity(conn: sqlite3.Connection) -> Tuple[bool, str]:
    """Runs PRAGMA integrity_check on the connection."""
    cur = conn.cursor()
    cur.execute("PRAGMA integrity_check;")
    rows = cur.fetchall()
    if rows == [("ok",)] or (len(rows) == 1 and rows[0][0] == "ok"):
        return True, "ok"
    return False, str(rows)


if __name__ == "__main__":
    print("[*] Self-testing db_utils...")
    print(f"[*] Target Evidence DB: {DEFAULT_RUN_EVIDENCE_PATH}")
    print(f"[*] Target Baseline DB: {DEFAULT_BASELINE_PATH}")

    # Check evidence connection
    with get_evidence_conn() as ev_conn:
        ev_pragmas = get_connection_pragmas(ev_conn)
        print(f"[+] Evidence DB connection verified: {ev_pragmas}")
        assert ev_pragmas["busy_timeout"] == 30000, "busy_timeout mismatch"
        assert ev_pragmas["foreign_keys"] == 1, "foreign_keys mismatch"
        assert ev_pragmas["synchronous"] == 1, "synchronous mismatch"
        assert ev_pragmas["journal_mode"] == "wal", "journal_mode mismatch"

    # Check baseline connection
    with get_baseline_conn() as base_conn:
        base_pragmas = get_connection_pragmas(base_conn)
        print(f"[+] Baseline DB connection verified: {base_pragmas}")
        assert base_pragmas["query_only"] == 1, "query_only mismatch"
        ok, msg = verify_baseline_integrity(base_conn)
        assert ok, f"Integrity check failed: {msg}"
        cur = base_conn.cursor()
        cur.execute("SELECT count(*) FROM messages;")
        msg_count = cur.fetchone()[0]
        print(f"[+] Baseline DB message count verified: {msg_count}")
        assert msg_count == 10055, f"Message count mismatch: {msg_count}"

    ro_attr = is_windows_readonly(DEFAULT_BASELINE_PATH)
    print(f"[*] Baseline file OS IsReadOnly status: {ro_attr}")
    print("[+] All db_utils self-tests PASSED successfully!")
