## 2026-10-29T01:24:42Z
You are Worker M6.1 (Streaming SHA-256 Hashing & Attachment Provenance Reconciler Worker) for Milestone M6 (Source Integrity & Attachment Provenance Reconciliation).

### 1. Mandatory Context & Inputs
You MUST read the following authoritative files before starting any implementation:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md` (MUST READ FIRST)
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- BASELINE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` (STRICTLY READ-ONLY)
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`
- DB UTILITIES: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py`
- EXPLORER M6.1 ARCHITECTURE: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m6_1\streaming_sha256_architecture.md`
- EXPLORER M6.2 CLASSIFICATION: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m6_2\attachment_matching_and_classification.md`
- EXPLORER M6.3 ANTI-CARTESIAN DESIGN: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m6_3\anti_cartesian_and_reconciliation_design.md`

### 2. Working Directory & Identity
- Working directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m6_1`
- Maintain `BRIEFING.md` and `progress.md` in your directory.
- Your target production script: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\provenance_reconciler.py`
- Your target verification test suite: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m6_provenance_reconciliation.py`

### 3. MANDATORY INTEGRITY WARNING
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A forensic auditor (teamwork_preview_auditor) will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### 4. Implementation Requirements
Follow the combined architecture from Explorers M6.1, M6.2, and M6.3:
1. **Streaming SHA-256 Hashing Pipeline:**
   - Implement `StreamingHasher` reading in 128 KB buffer chunks (`chunk_size = 131072`).
   - Use 4 parallel CPU worker threads/processes feeding an internal queue.
   - Decoupled SQLite single-writer worker flushing batches of 100 updates (`WHERE file_id = ?`) using `db_utils.immediate_transaction()`.
   - Update `file_inventory.sha256` and `updated_at`.
   - Ensure canonical hash `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` for 0-byte files.
   - Filter `WHERE sha256 IS NULL` for instant resumability and idempotency.

2. **Attachment Reconciliation Pipeline (Anti-Cartesian & 4-Tier Classification):**
   - In-memory indices built in <0.5s:
     * `TimeBucketIndex`: $W=300\text{s}$ epoch buckets for time proximity lookup.
     * `ModalityIndex`: separates AUDIO, IMAGE, VIDEO, DOCUMENT.
     * `FilenameInvertedIndex`: normalized filename -> list of candidates for exact document name matches.
   - Target placeholders:
     * 2,276 messages with `is_attachment = 1`
     * 161 messages with `<documento omitido> <filename>` (`is_attachment = 0`)
   - 4-Tier classification:
     * `CONFIRMED` ($0.90 \le C \le 1.0$)
     * `PROBABLE` ($0.70 \le C < 0.90$)
     * `UNRESOLVED` ($0.0 \le C < 0.70$)
     * `CONTRADICTED` ($C = 0.0$)
   - Populate `attachment_links` with single-writer WAL batching ($B=200$) and `ON CONFLICT(message_id, file_id) DO UPDATE`.
   - Support orphan placeholders with `file_id = NULL` and `match_method = 'ORPHAN_PLACEHOLDER'`.

3. **Production CLI Interface:**
   - `--hash-only`: Execute only streaming SHA-256 hashing.
   - `--link-only`: Execute only attachment link reconciliation.
   - `--all`: Execute streaming hashing followed by link reconciliation.
   - `--verify`: Verify all hashes and links without modifying the database.
   - Output structured telemetry report to `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m6_provenance_reconciliation_report.json`.

4. **Test Suite `test_m6_provenance_reconciliation.py`:**
   - Test 1: Bit-level chunk size invariance across 64KB, 128KB, 1MB, 4MB.
   - Test 2: Zero-byte canonical hash verification (`e3b0c442...b855`).
   - Test 3: Anti-Cartesian comparison count limit assertion (< 50,000 comparisons, runtime < 5s).
   - Test 4: 4-Tier classification distribution and schema constraint validation.
   - Test 5: Mathematical idempotency ($f(f(x)) = f(x)$, $\Delta\text{rows}=0$, $\Delta\max(\text{id})=0$).
   - Test 6: Baseline SQLite cryptographic read-only protection (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` unchanged).

5. **Execution Order:**
   - Run tests first using pytest via `.venv\Scripts\python.exe -m pytest` (assert 100% passing).
   - Execute `--all` across all 16,474 files and 10,055 messages.
   - Verify report and write `handoff.md`. Notify orchestrator via `send_message`.
