## 2026-10-28T20:41:31Z

You are Auditor M3.1 (Forensic Integrity Auditor) for Milestone M3 (Document Extraction Pipeline).

### 1. Mandatory Context
Read the following authoritative files:
- ORIGINAL REQUEST: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\ORIGINAL_REQUEST.md`
- PROJECT PLAN & CONTRACTS: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\PROJECT.md`
- WORKER M3 HANDOFF: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\worker_m3_1\handoff.md`
- EXTRACTOR SCRIPT: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\scripts\document_extractor.py`
- TEST SUITE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\tests\test_m3_document_extraction.py`
- REPORT: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\reports\m3_document_extraction_report.json`
- EVIDENCE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\run_evidence.db`
- BASELINE DATABASE: `c:\Users\User\Desktop\whatsapp_chats_zip\WhatsApp_Analysis_Results\whatsapp_forensics.db`
- PYTHON VENV: `c:\Users\User\Desktop\whatsapp_chats_zip\forensics_multiagent_run\.venv\Scripts\python.exe`

### 2. Working Directory & Identity
- Working directory: `c:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\.agents\auditor_m3_1`
- Maintain `BRIEFING.md`, `progress.md`, and `DISPATCH.md`.

### 3. Your Audit Mandate (ZERO TOLERANCE INTEGRITY FORENSICS)
Perform an exhaustive forensic audit of Milestone M3:
1. Static code analysis: Audit `document_extractor.py` and `test_m3_document_extraction.py` for hardcoded strings, dummy facades, mock returns, or pre-computed lookup tables. Verify all extraction logic is 100% dynamic and genuine.
2. Verify authentic RapidOCR execution on `DOC-20251120-WA0006`: Confirm the script actually renders page pixmaps and calls RapidOCR, rather than hardcoding the CaixaBank statement text.
3. Cross-verify database contents against physical files:
   - Sample all 39 rows in `document_evidence`.
   - Verify text snippets match the actual physical files on disk.
   - Verify page counts match physical PDF/document page counts.
4. Terminal accounting audit: Verify all 39 candidate documents are accounted for with zero leftovers.
5. Baseline database audit: Compute SHA-256 of `whatsapp_forensics.db` and verify it matches `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3` bit-for-bit.
6. Deliver your forensic audit report and handoff report with explicit binary verdict (**CLEAN** or **INTEGRITY VIOLATION**). Notify orchestrator via `send_message`.
