# Adversarial Stress Test Report: Milestone M2 Text Forensics & Lexical Indexer

**Agent**: Challenger 2 (Adversarial Idempotency & Invariant Challenger)  
**Target Milestone**: Milestone M2 (Text Forensics & Lexical Indexer)  
**Subject**: `text_forensics_extractor.py`, `run_evidence.db`, `whatsapp_forensics.db`  
**Date**: 2026-10-28  
**Verdict**: **APPROVE** (All critical invariants, idempotency, baseline protection, and negative boundaries mathematically and empirically verified; low-severity boundary edge cases noted with mitigations).

---

## 1. Executive Summary & Challenge Risk Assessment

**Overall Risk Assessment**: **LOW**

Challenger 2 executed an empirical, white-box adversarial stress test suite against the deliverables of Milestone M2. All four core mandates were tested under realistic and hostile conditions:
1. **Subprocess Idempotency & Invariant Verification**: Across multiple batch sizes (500, 100, 1000) executed via external subprocess (`.venv\Scripts\python.exe`), `text_forensics_extractor.py` inserted **EXACTLY 0 new rows** (delta = 0). The maximum primary key `max(id) = 972` was invariant, and a cryptographic digest across all 10 columns of all 972 rows confirmed **0 bytes mutated**.
2. **Negative Boundary Timestamp Auditing**: Querying `run_evidence.db` confirmed **EXACTLY 0 rows** with `2000-00-00` or malformed timestamps. All 965 non-null synthesized timestamps in `text_forensic_entities` strictly conform to RFC-3339 / ISO-8601 (`YYYY-MM-DDTHH:MM:SS`) and parse successfully with Python's `datetime.fromisoformat()`. All timestamps fall within the operational temporal envelope [2023-06-12, 2026-10-28]. Exactly 7 rows have `NULL` timestamps, correctly preserving missing dates from ODS preview summary headers rather than hallucinating timestamps.
3. **Cryptographic Baseline Invariance & Read-Only Defense**: `whatsapp_forensics.db` SHA-256 hash was confirmed identical to the baseline constant `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` before, during, and after all adversarial attacks. Hostile probes (`CREATE TABLE`, `INSERT`, `UPDATE`, `DROP TABLE`, `DELETE`) under `mode=ro` and via `db_utils.get_baseline_conn()` were deterministically rejected by SQLite (`OperationalError: attempt to write a readonly database`).
4. **Concurrency Stress Testing**: A multi-threaded harness (8 concurrent readers performing complex aggregations and range scans + 4 concurrent writers performing batch upserts under `immediate_transaction()`) executed concurrently against `run_evidence.db` table `text_forensic_entities`. Contention was absorbed seamlessly with 0 deadlocks, 0 lock timeout exceptions, and `PRAGMA integrity_check` returning `ok`.

---

## 2. Adversarial Challenges & Findings

### [Low] Challenge 1: Permissive 12-Hour AM/PM Hour Regex Accepts Non-Standard Hours

- **Assumption Challenged**: `synthesize_iso_timestamp` strictly enforces 12-hour clock domain constraints (`1 <= hour <= 12`).
- **Attack Scenario**: Adversarial inputs with `hour = 0` or `13 <= hour <= 23` combined with an AM designation (e.g. `"6/12/26", "00:00:00 AM"` or `"6/12/26", "13:00:00 AM"`).
- **Observed Behavior**:
  - `synthesize_iso_timestamp("6/12/26", "00:00:00 AM")` yields `"2026-06-12T00:00:00"`.
  - `synthesize_iso_timestamp("6/12/26", "13:00:00 AM")` yields `"2026-06-12T13:00:00"`.
  - Root Cause: `TIME_PATTERN = re.compile(r"^(\d{1,2}):(\d{2}):(\d{2})[\s\u202f\xa0]*(AM|PM)$")` captures any 1-2 digit number. For AM, the code executes `hour = 0 if h == 12 else h`. Thus `h = 13` remains `13`, which Python's `datetime(..., hour=13, ...)` accepts as valid 24-hour time.
- **Blast Radius**: Zero in production corpus. An audit of all 10,055 messages in `whatsapp_forensics.db` showed **0 messages** with `hour < 1` or `hour > 12`. All 10,013 standard messages strictly follow standard 12-hour formatting.
- **Mitigation**: In `synthesize_iso_timestamp`, validate `if not (1 <= h <= 12): return None` prior to datetime construction.

### [Low] Challenge 2: Silent Midnight Fallback on Non-Empty Unparseable Time String

- **Assumption Challenged**: If a non-empty `time_str` fails regex parsing, `synthesize_iso_timestamp` rejects the record and returns `None`.
- **Attack Scenario**: Passing a valid date with an arbitrary corrupt string in `time_str` (e.g. `"6/12/26", "<script>alert(1)</script>"` or `"6/12/26", "CORRUPT_TIME"`).
- **Observed Behavior**:
  - `synthesize_iso_timestamp` initialises `hour, minute, second = 0, 0, 0`. When `TIME_PATTERN.match(time_clean)` fails, it skips time parsing and successfully constructs `datetime(year, month, day, 0, 0, 0)`, returning `"2026-06-12T00:00:00"`.
- **Blast Radius**: Zero in production corpus. Zero messages in `whatsapp_forensics.db` contain corrupt time strings; all 10,013 standard messages match `TIME_PATTERN`.
- **Mitigation**: Check `if time_clean and not t_match: return None` if strict time validity is preferred over date-only retention.

---

## 3. Empirical Stress Test Results

| Test Scenario | Test Target | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **Baseline SHA-256 Checksum** | `whatsapp_forensics.db` | `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` | Exact match | **PASS** |
| **Direct Write Probe (CREATE)** | `whatsapp_forensics.db?mode=ro` | `OperationalError: attempt to write a readonly database` | Rejected as readonly | **PASS** |
| **Direct Write Probe (INSERT)** | `whatsapp_forensics.db?mode=ro` | `OperationalError: attempt to write a readonly database` | Rejected as readonly | **PASS** |
| **Direct Write Probe (UPDATE)** | `whatsapp_forensics.db?mode=ro` | `OperationalError: attempt to write a readonly database` | Rejected as readonly | **PASS** |
| **Direct Write Probe (DROP)** | `whatsapp_forensics.db?mode=ro` | `OperationalError: attempt to write a readonly database` | Rejected as readonly | **PASS** |
| **Direct Write Probe (DELETE)** | `whatsapp_forensics.db?mode=ro` | `OperationalError: attempt to write a readonly database` | Rejected as readonly | **PASS** |
| **Baseline PRAGMA query_only** | `db_utils.get_baseline_conn()` | `query_only == 1` & write attempt fails | Verified query_only=1, rejected write | **PASS** |
| **Negative Boundary: 2000-00-00** | `text_forensic_entities.timestamp_iso` | Exactly 0 rows matching `2000-00-00%` | Exactly 0 rows | **PASS** |
| **Negative Boundary: Malformed ISO** | `text_forensic_entities.timestamp_iso` | 0 rows not matching standard ISO pattern | Exactly 0 rows | **PASS** |
| **Python Datetime Parseability** | `text_forensic_entities.timestamp_iso` | 100% of 965 non-null rows parseable | 965 / 965 parsed successfully (0 errors) | **PASS** |
| **Temporal Envelope Validity** | `text_forensic_entities.timestamp_iso` | All dates within [2023-01-01, 2026-12-31] | Earliest: `2023-06-12T14:31:48`, Latest: `2026-10-28T03:48:50` | **PASS** |
| **Adversarial Timestamp Matrix** | `synthesize_iso_timestamp()` | Safe rejection of impossible dates/months | 100% of invalid dates (e.g. Feb 29 non-leap, month 13, day 32) return None | **PASS** |
| **Subprocess Idempotency (Batch 500)** | `text_forensics_extractor.py` | 0 new rows, max(id) unchanged, hash invariant | Pre: 972, Post: 972 (Delta: 0), Digest: `4fc066691cd4f9f3` invariant | **PASS** |
| **Subprocess Idempotency (Batch 100)** | `text_forensics_extractor.py` | 0 new rows, max(id) unchanged, hash invariant | Pre: 972, Post: 972 (Delta: 0), Digest: `4fc066691cd4f9f3` invariant | **PASS** |
| **Subprocess Idempotency (Batch 1000)** | `text_forensics_extractor.py` | 0 new rows, max(id) unchanged, hash invariant | Pre: 972, Post: 972 (Delta: 0), Digest: `4fc066691cd4f9f3` invariant | **PASS** |
| **Multi-Threaded Concurrency** | `run_evidence.db` (12 threads) | 0 deadlocks, 0 lock timeout exceptions | Completed 300+ transactions in 0.33s with 0 errors | **PASS** |
| **SQLite WAL Integrity** | `run_evidence.db` | `PRAGMA integrity_check` returns `ok` | Returned `["ok"]` | **PASS** |
| **Final Baseline Checksum** | `whatsapp_forensics.db` | Identical pre/post hash | `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` | **PASS** |

---

## 4. Unchallenged Areas

- **Entity Extraction Precision/Recall Semantics**: Semantic accuracy of regex classification (e.g. CUOTA vs TARIFF thresholds, actor entity boundary disambiguation) is within the domain of Challenger 1 (Lexical & Semantic Quality Challenger) and was spot-checked here for structural integrity.
- **Physical Media File Linking**: Attachment reconciliation against raw media files in the file inventory is explicitly deferred to Milestone M6.

---

## 5. Final Recommendation & Verdict

**Verdict**: **APPROVE**

Milestone M2 (Text Forensics & Lexical Indexer) satisfies all architectural and adversarial criteria:
- **Absolute Idempotency**: Re-running the extractor generates 0 row churn, 0 duplicate keys, and bit-level identical database state.
- **Negative Boundary**: Zero malformed or sentinel timestamps exist in `run_evidence.db`.
- **Baseline Invariance**: Production database `whatsapp_forensics.db` remains 100% bit-for-bit invariant under cryptographic verification.
- **Concurrency Robustness**: High-concurrency operations under SQLite WAL mode and `immediate_transaction()` are thread-safe and resilient.
