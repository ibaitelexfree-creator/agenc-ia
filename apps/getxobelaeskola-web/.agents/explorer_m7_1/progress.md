# Progress — Explorer M7.1: FTS5 Schema & Cross-Modal Indexing Architecture

Last visited: 2026-10-29T01:54:30Z

## Status Overview
- Milestone: M7
- State: Active Investigation
- Current Phase: Deep Schema & Tokenizer Analysis

## Checkpoints
- [x] Read authoritative inputs (`ORIGINAL_REQUEST.md`, `PROJECT.md`, `DISPATCH.md`, `db_utils.py`)
- [x] Initialize persistent `BRIEFING.md` and `progress.md`
- [ ] Inspect live schema and data distribution in `run_evidence.db` and `whatsapp_forensics.db`
- [ ] Evaluate FTS5 tokenizer configuration (`unicode61` vs `porter`, diacritics removal, `tokenchars` for IBAN, CIF, currency)
- [ ] Analyze storage architecture: Standalone virtual table vs External Content Table vs Contentless table
- [ ] Formulate cross-modal ingestion queries (Chat messages, RapidOCR/Tesseract OCR, Whisper transcripts, Document texts & tables)
- [ ] Specify query syntax, BM25 scoring, boolean expressions, and snippet/highlight generation
- [ ] Specify zero WAL lock contention ingestion batching ($B=500-1000$) using `db_utils.immediate_transaction()`
- [ ] Author comprehensive `fts5_cross_modal_architecture.md`
- [ ] Produce self-contained 5-component `handoff.md` and message parent
