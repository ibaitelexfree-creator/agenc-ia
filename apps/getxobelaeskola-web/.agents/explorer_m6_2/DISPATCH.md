## 2026-10-29T01:10:55Z
You are Explorer M6.2 (Attachment Placeholder & Link Classifier Explorer) for Milestone M6 (Source Integrity & Attachment Provenance Reconciliation).

### 1. Mandatory Context & Inputs
You MUST read the following authoritative files before starting any investigation:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md` (MUST READ FIRST)
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- BASELINE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` (STRICTLY READ-ONLY)
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`
- DB UTILITIES: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py`

### 2. Working Directory & Identity
- Working directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m6_2`
- Maintain `BRIEFING.md` and `progress.md` in your directory.
- You are read-only: do NOT modify production databases or production code.

### 3. Your Specific Mission
Investigate and design the attachment placeholder extraction, multi-dimensional correlation rules, and 4-tier classification scheme:
1. Placeholder Census in `whatsapp_forensics.db`:
   - Query `messages` table for `is_attachment = 1` and text patterns like `<adjunto omitido>`, `<documento omitido>`, `<audio omitido>`, `<imagen omitida>`, `<video omitido>`, `<sticker omitido>`, and any embedded filenames.
   - Record exact counts, distribution by chat/sender, and timestamp patterns.
2. Multi-Dimensional Matching Logic:
   - Dimension 1: Exact Filename Match (filename mentioned in message body or caption).
   - Dimension 2: Temporal Proximity Window (message `timestamp_iso` vs physical file `mtime` within configurable $\Delta t \le 120\text{s}$).
   - Dimension 3: Modality Correspondence (audio placeholder to `.opus`, image placeholder to `.jpg/.png`, document placeholder to `.pdf/.docx`, etc.).
   - Dimension 4: Cryptographic Hash / Deduplication (handling duplicate attachments across multiple chats).
3. 4-Tier Forensic Classification Scheme:
   - Define exact, deterministic rules for:
     * `CONFIRMED`: Exact filename match OR (single candidate within $\Delta t \le 60\text{s}$ AND exact modality match).
     * `PROBABLE`: Single candidate within $\Delta t \le 120\text{s}$ AND exact modality match.
     * `UNRESOLVED`: Multiple competing candidates within window OR candidate missing.
     * `CONTRADICTED`: Placeholder timestamp/modality contradicts physical file attributes.
   - Define numerical confidence score calculation ($0.0 \le C \le 1.0$).
4. Schema Specification for `attachment_links`:
   - Table `attachment_links` in `run_evidence.db`:
     `(id INTEGER PRIMARY KEY AUTOINCREMENT, message_id TEXT NOT NULL, file_id INTEGER REFERENCES file_inventory(file_id), match_classification TEXT NOT NULL, match_method TEXT NOT NULL, confidence_score REAL, evidence_notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
   - Composite unique constraints and indexes to guarantee idempotency.
5. Deliverables:
   - Deliver comprehensive report at: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m6_2\attachment_matching_and_classification.md`.
   - Deliver `handoff.md` with: Observation, Logic Chain, Caveats, Conclusion, Verification Method.
   - When complete, notify orchestrator via `send_message`.
