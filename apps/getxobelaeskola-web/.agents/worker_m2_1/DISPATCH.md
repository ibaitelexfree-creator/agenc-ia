## 2026-10-28T17:52:45Z
You are Worker M2 (Text Forensics & Lexical Indexer Specialist) in the WhatsApp Digital Forensic Operation.
Your Working Directory is: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m2_1
Read the original user request from: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md
Read the project blueprint from: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md
Read Explorer 1's report from: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m2_1\handoff.md
Read Explorer 2's report from: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m2_2\handoff.md
Read Explorer 3's report from: c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m2_3\handoff.md
Read central database utilities from: c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL CONSTRAINTS:
1. Baseline database at `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` is STRICTLY READ-ONLY. Open ONLY using `db_utils.get_baseline_conn(immutable=True)` with `?mode=ro` and `PRAGMA query_only = ON;`. NEVER write to this database!
2. Write ownership: You exclusively own `forensics_multiagent_run\scripts\text_forensics_extractor.py`, `forensics_multiagent_run\tests\test_m2_text_forensics.py`, `forensics_multiagent_run\reports\m2_text_forensics_report.json`, and table `text_forensic_entities` in `run_evidence.db`.
3. Use the isolated virtual environment at `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`.

Your Mission:
Implement the complete, production-grade Text Forensics & Lexical Indexer pipeline for Milestone M2:

1. **Build `forensics_multiagent_run\scripts\text_forensics_extractor.py`**:
   - **Schema initialization**: Ensure `text_forensic_entities` in `run_evidence.db` has columns: `id`, `message_id`, `sender`, `timestamp_iso`, `entity_type`, `entity_value`, `context_text`, `confidence`, `metadata_json`, `created_at`.
   - **Unique Index**: Create `UNIQUE INDEX IF NOT EXISTS uq_msg_entity ON text_forensic_entities(message_id, entity_type, entity_value)` to guarantee absolute idempotency.
   - **Timestamp Normalization**: Implement `synthesize_iso_timestamp(date, time)` following Explorer 1's blueprint. Parse `M/D/YY` and `H:MM:SS AM/PM` to RFC-3339 / ISO-8601 (`YYYY-MM-DDTHH:MM:SS`). Expand 2-digit years 23-26 to 2023-2026. Handle midnight (12 AM -> 00) and noon (12 PM -> 12). Handle the 42 `ODS_Preview` rows safely (return NULL or extract date from text, never raise exceptions or output `2000-00-00`).
   - **Entity Extraction**: Implement Explorer 2's high-precision regex extraction across all 10,055 messages:
     * `CLUB`: Getxo Bela Eskola (GBE), Asociación Club Deportivo Vela Pakea Munduari Itzulia, Pakea.
     * `CIF`: Club CIF `G95526299` and lowercase variants. Also extract personal DNI/NIF (Urko `16089994E`, etc.).
     * `IBAN`: Club account `ES43 2095 0000 7091 0910 0619` (unspaced / spaced), masked receipt accounts `*0619`, auxiliary accounts (Angharad, Gorka, La Forja), and Bizum mentions.
     * `CUOTA` / `FINANCIAL_TARIFF`: 100€ monthly dues, 180€ J80 initiation, 120€ Laser ILCA, 25€/day marine meteorology, 150€ navigation vouchers (bonos), 35€/h private lessons.
     * `PERSON` / `ROLE`: Urko Santillan Soriano (Director/Coach), Angharad Arambalza Bernaola (President/Admin), Ibai Santillan (Bangkok brother) vs Ibai Encina (sailor), coaches Asier, Gonzalo, Eneko, Ibon Basañez, Rafa.
     * `ATTACHMENT_REF` / `OMITTED_DOC`: Parse all 161 messages with `<documento omitido>` (filename, extension, metadata).
   - **Streaming & Transactions**: Read messages in batches of 500 using `db_utils.get_baseline_conn(immutable=True)`. Insert extracted entities into `text_forensic_entities` strictly inside `db_utils.immediate_transaction()` using `INSERT INTO text_forensic_entities (...) ON CONFLICT(message_id, entity_type, entity_value) DO UPDATE SET context_text = excluded.context_text, metadata_json = excluded.metadata_json`.
   - **CLI Support**: Add `--batch-size`, `--verify-only`, `--limit`, `--report` flags.
   - **Report Generation**: Output `forensics_multiagent_run\reports\m2_text_forensics_report.json` summarizing total messages processed, valid ISO timestamps synthesized, entity counts by type, top entities, and verification metrics.

2. **Build Test Suite `forensics_multiagent_run\tests\test_m2_text_forensics.py`**:
   - Unit tests for ISO timestamp synthesis (boundaries, 12 AM/PM, leap years, ODS previews).
   - Unit tests for entity extraction regexes (Club, CIF, IBAN, Tariffs, Actors, Omitted Docs).
   - Integration test running extraction against test fixture / database subset.
   - Idempotency test asserting zero duplicates on repeated runs.

3. **Execute & Verify**:
   - Run `test_m2_text_forensics.py` via `.venv\Scripts\python.exe`.
   - Run `text_forensics_extractor.py` to populate `run_evidence.db`.
   - Re-run `text_forensics_extractor.py` to verify idempotency (zero row increase).
   - Verify baseline DB SHA-256 (`030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`) is unmodified.

Deliverables:
- Maintain progress.md in your working directory.
- Author a 5-component handoff report (`handoff.md`).
Notify orchestrator via send_message when complete.
