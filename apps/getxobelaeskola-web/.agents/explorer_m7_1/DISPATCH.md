# Dispatch Assignment: Explorer M7.1

## Identity & Role
- **Agent Name**: Explorer M7.1
- **Archetype**: `teamwork_preview_explorer`
- **Role**: FTS5 Schema & Cross-Modal Indexing Architecture Explorer
- **Milestone**: M7 (Cross-Modal Evidence Indexing & Final Forensic Verification Report)
- **Working Directory**: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m7_1`
- **Parent Conversation ID**: `910eb5c1-f883-4815-90d4-372a9142612a`

## Mandatory Authoritative Inputs
Before any analysis, you MUST read the following authoritative files in full:
1. `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md` (Verbatim user intent and requirements)
2. `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md` (Global blueprint, data contracts, and M7 scope)
3. `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\db_utils.py` (Database utilities & transaction locks)
4. Evidence Databases:
   - `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db` (Schema and existing evidence rows)
   - `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db` (Read-only baseline database)

## Scope & Objective
Investigate and design the high-performance SQLite FTS5 cross-modal unified search index (`cross_modal_index`) across all extracted evidence channels:
1. **Evidence Modalities to Index**:
   - Text Chat Messages: ~10,055 messages in `whatsapp_forensics.db` joined with repaired ISO timestamps and extracted forensic entities (`text_forensic_entities` in `run_evidence.db`).
   - Image OCR Text: `ocr_evidence` in `run_evidence.db` (RapidOCR and Tesseract outputs).
   - Audio Transcripts: `audio_evidence` in `run_evidence.db` (Whisper transcription text and speaker segments).
   - Document Text & Tables: `document_evidence` in `run_evidence.db` (extracted text and parsed table text from PDF, DOCX, ODS, XLSX, TXT).
2. **FTS5 Table Design**:
   - Virtual table schema: `cross_modal_index USING fts5(...)`
   - Fields: `content_id UNINDEXED`, `modality UNINDEXED`, `source_ref UNINDEXED`, `sender_or_creator UNINDEXED`, `timestamp_iso UNINDEXED`, `indexed_text`.
   - Tokenizer configuration: Evaluate `unicode61` (with `remove_diacritics 2` or `1`, tokenchars) vs `porter` or compound options, considering Spanish and Basque terminology.
   - External Content Table vs Standalone FTS5 table trade-offs in SQLite WAL mode.
3. **Query & Retrieval Architecture**:
   - Full-text search operators: boolean (`AND`, `OR`, `NOT`), prefix queries (`*`), phrase queries (`"..."`), proximity search (`NEAR(...)`).
   - Relevance ranking via `bm25(cross_modal_index)`.
   - Search snippet and highlight generation: `snippet(cross_modal_index, 5, '<b>', '</b>', '...', 64)`.
   - Verification queries: Demonstrate queries for key case entities (e.g., "Kutxabank", "ES43 2095", "G95526299", "Ibai", "100€", "cuota", "seguro").
4. **Indexing Performance & Concurrency**:
   - Ingestion batching ($B=500$ or $1000$) using `db_utils.py` immediate transactions.
   - Target throughput: indexing ~30,000 document records in <10 seconds without lock contention.

## Output Deliverables
1. Maintain `BRIEFING.md` and `progress.md` with active heartbeat.
2. Produce comprehensive report: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\explorer_m7_1\fts5_cross_modal_architecture.md`.
3. Produce self-contained `handoff.md` and notify parent via `send_message`.

## 2026-10-29T01:52:38Z
Explorer M7.1 dispatched with mission:
Analyze and specify the full SQLite FTS5 cross-modal unified search index architecture across chat messages, image OCR text, audio transcripts, and document text/tables.
