# Attachment Matching & Forensic Classification Specification
**Milestone**: M6 — Source Integrity & Attachment Provenance Reconciliation  
**Explorer Agent**: Explorer M6.2 (`explorer_m6_2`)  
**Target Ledger**: `run_evidence.db` (Table: `attachment_links`)  
**Baseline Database (Strictly Read-Only)**: `whatsapp_forensics.db`  
**Date**: 2026-10-29  

---

## 1. Executive Summary & Mission Scope

Milestone M6 resolves the critical physical-to-logical evidentiary disconnect identified in the initial corpus survey:
1. In the baseline database `whatsapp_forensics.db`, the junction table `message_attachments` contains **0 rows**, and in the `attachments` table, both `source_conversation_id` and `source_message_id` are **NULL across all 15,068 rows**.
2. In `messages`, exactly **2,276 messages** contain attachment indicators with `is_attachment = 1`, and an additional **161 messages** contain formal document transmission placeholders (`<documento omitido>`) that were ingested with `is_attachment = 0`, yielding **2,437 core evidentiary attachment placeholders**.
3. In `run_evidence.db`, the `file_inventory` table catalogues **16,474 discovered physical media files** (14,561 images, 463 other/stickers, 397 audio files, 358 archives, 356 chat texts, 294 videos, 39 documents, 6 databases).

This report specifies the complete mathematical and deterministic blueprint for:
- **Empirical Census**: Exact distributions of message placeholders by syntax, chat, sender, modality, and temporal horizon.
- **Multi-Dimensional Correlation Engine**: 4 independent correlation dimensions (Exact Filename Match, Temporal Proximity Window $\Delta t \le 120\text{s}$, Modality Correspondence, and Cryptographic Hash Deduplication).
- **4-Tier Forensic Classification Scheme**: Deterministic decision trees and continuous scoring functions ($0.0 \le C \le 1.0$) for `CONFIRMED`, `PROBABLE`, `UNRESOLVED`, and `CONTRADICTED`.
- **Hardened Schema Specification**: DDL definition for `attachment_links` in `run_evidence.db` enforcing composite uniqueness, cascade integrity, and mathematical idempotency ($f(f(x)) = f(x)$).

---

## 2. Empirical Placeholder Census in `whatsapp_forensics.db`

### 2.1 Macro Census Overview

A full scan across all **10,055 messages** and **392 conversations** in the baseline database `whatsapp_forensics.db` reveals three distinct tiers of attachment placeholders:

| Placeholder Category | Baseline `is_attachment` | Count | Dominant Syntax in `content` | Target Physical Modality |
|---|:---:|---:|---|---|
| **Voice / Audio Notes** | `1` | **882** | `<mensaje de voz omitido>` | `AUDIO` (`.opus`) |
| **Images & Photos** | `1` | **1,201** | `<imagen omitida>`, `[Reenviado] <imagen omitida>`, captioned | `IMAGE` (`.jpg`, `.png`) |
| **Video Clips** | `1` | **193** | `<video omitido>`, `[Reenviado] <video omitido>` | `VIDEO` (`.mp4`, `.3gp`) |
| **Documents (Web Omission Anomaly)** | `0` | **161** | `<documento omitido> <filename>` | `DOCUMENT` (`.pdf`, `.docx`, etc.) |
| **Stickers** | `0` | **134** | `<sticker omitido>` | `OTHER` (`.webp`) |
| **Animated GIFs** | `0` | **15** | `<GIF omitido>` | `VIDEO` / `IMAGE` (`.mp4`) |
| **Video Messages (Note)** | `0` | **7** | `<mensaje de video omitido>` | `VIDEO` (`.mp4`) |
| **Audio Files (Non-PTT)** | `0` | **3** | `<audio omitido>` | `AUDIO` (`.opus`, `.m4a`) |
| **System / Interactive Notices** | `0` | **165** | `<Mensaje de album>`, `<Mensaje de interactive>`, etc. | `NONE` (Metadata only) |

#### Key Census Observations:
1. **The Core Attachment Total**: Summing formal attachments (`is_attachment = 1`, count = 2,276) and document transmissions (`<documento omitido>`, count = 161) yields exactly **2,437 actionable forensic placeholders**.
2. **Absence of `<adjunto omitido>`**: Natural language searches confirm that the literal token `<adjunto omitido>` does **not** exist in the Spanish WhatsApp Web/Android exports. Where "adjunto" occurs, it is either an embedded filename (e.g. `MSG_0008015`: `<documento omitido> adjunto_ing.pdf`) or conversational text (e.g. `MSG_0002602`: `<documento omitido> Urko, Adjunto encontrará la documentación de inscripción. Gracias.`).
3. **The Document Export Defect**: In the WhatsApp Web export process, transmitted documents (PDFs, Word docs, registration forms, payment slips) were rendered as text tokens `<documento omitido> <filename>`. The baseline ETL pipeline marked them as `is_attachment = 0`. These documents represent the primary legal and contractual evidence for Getxo Bela Eskola and must be reconciled in Milestone M6.

---

### 2.2 Detailed Breakdown of the 161 `<documento omitido>` Placeholders

The 161 document placeholders represent the highest evidentiary value files in the dispute (inscriptions, fee tariffs, bank transfer receipts, statutes). Their extension distribution is:

| File Extension | Count | Percentage | Representative Document Titles | Evidentiary Domain |
|---|---:|---:|---|---|
| **`.pdf`** | **118** | 73.3% | `Formulario Inscripción a cursos.pdf` (11), `Curso de iniciación en  J80.pdf` (10), `Formulario Inscripción Udalekus.pdf` (6), `Campamento de verano info.pdf` (5), `recibo Alberto Valin j80 iniciación.pdf`, `Justificante_transferencia_...pdf`, `Certificate SPOOFER.pdf`, `CERTIFICADO REGISTRO.pdf` | Member Enrollment, Bank Transfer Proofs, Federative Licenses |
| **`.docx`** | **16** | 9.9% | `TARIFAS GETXO BELA ESKOLA.docx`, `Curriculum Urko Santillan.docx`, `Protocolo de seguridad.docx` | Commercial Tariffs, Operational Procedures |
| **`.apk`** | **9** | 5.6% | `base.apk` (9 instances) | Software installations shared with staff |
| **`.txt`** | **1** | 0.6% | `Registro horas txiruka julio.txt` | Payroll / Staff Working Hours |
| **Extensionless / Descriptive Titles** | **17** | 10.6% | `Tabla de precios actualizada`, `DOC-20260801-WA0000.`, `Provisional .`, `actualizado`, `Acuerdo colaboracion Bermeo.pdf` | Price sheets, draft schedules, agreements |
| **TOTAL** | **161** | **100.0%** | | |

#### Regex Extraction Formula for Documents:
Milestone M2 validated this regular expression against all 10,055 messages with **100.0% precision (161/161 matches, 0 false positives)**:
```python
RE_DOC_PLACEHOLDER = re.compile(
    r'^(?P<prefix>\[Reenviado\]\s*)?<documento omitido>\s*(?P<filename>.+?)(?:\s+•\s+(?P<meta>.*))?$',
    re.DOTALL | re.IGNORECASE
)
```

---

### 2.3 Sender & Chat Distribution Analysis

The distribution of placeholders across conversations and senders reflects the organizational hierarchy of Getxo Bela Eskola:

#### Top Senders of Attachment Placeholders:
1. **Urko Santillan Soriano (`Tú` / Custodian)**:
   - Senders of **~62% of outbound document placeholders** (sending course guides `Curso de iniciación en  J80.pdf`, `Formulario Inscripción a cursos.pdf`, camp guides `Campamento de verano info.pdf`, and price sheets to prospective students and club members).
   - Author of **~48% of outbound image attachments** (sending promotional flyers, weather forecasts, regatta maps, rigging instructions).
   - Author of **~51% of audio voice notes** (directing instructors and updating parents).
2. **Key Instructional Staff (`Monitor 420`, `Equipo 420`)**:
   - **Asier** (`Asier Monitor 420`): High volume of voice notes and images concerning the *Uretan Blai* summer camp, Optimist boat damage, and daily rosters.
   - **Gonzalo Aragón** & **Eneko**: Transmit 420 regatta documents, technical tuning guides, and training voice notes.
   - **Ibon Basañez**: J80 adult cruiser logistics and weather voice notes.
3. **Members & Clients (`Socio Gbe`, `Socio Pakea`, Parents)**:
   - **Alberto Valin** (`Alberto Equipo 420 Socio Gbe`): Transmits signed receipts (`recibo Alberto Valin j80 iniciación.pdf`) and bank transfer confirmations (`Justificante_transferencia_...pdf`).
   - **Virginia Jorrín**: Transmits signed course forms and proof of fee payment (`Pago J80 -Virginia Jorrín.pdf`).
   - **Luciano Natali**: Transmits monthly membership dues bank transfer notices.
   - **Ainhoa**: Transmits course gift voucher requests and payment receipts.

---

### 2.4 Asymmetry Between Physical Files (16,474) and Placeholders (2,437)

A crucial forensic realization is that the relationship between physical media files and message placeholders is **not 1-to-1**:

```
[Physical Files in file_inventory: 16,474]
  ├── IMAGES:   14,561 files  ──────►  Chat Placeholders: 1,201  (Asymmetry: 12.1x more files)
  ├── AUDIO:       397 files  ◄──────  Chat Placeholders:   885  (Asymmetry: 2.2x more placeholders)
  ├── VIDEO:       294 files  ──────►  Chat Placeholders:   200  (Asymmetry: 1.5x more files)
  ├── DOCUMENTS:    39 files  ◄──────  Chat Placeholders:   161  (Asymmetry: 4.1x more placeholders)
  ├── OTHER:       463 files  (stickers, foreign, .nomedia)
  ├── ARCHIVES:    358 files  (Wasap.zip, split backups)
  ├── CHAT_TXT:    356 files  (WhatsApp export transcripts)
  └── DATABASE:      6 files  (forensic & backup DBs)
```

#### Causes of Asymmetry:
1. **Historical Media Horizon vs. Active Chat Export**:
   - The Android backup `com.whatsapp\WhatsApp\Media` contains accumulated media dating back to **January 2023** (over 3.5 years of media).
   - The WhatsApp Web chat exports in `Whatsapp web Extraccion manual...` were captured in **late 2026** and only contain conversation transcripts active between **2025 and 2026**.
   - Consequently, ~13,000 images and videos in `com.whatsapp` were sent/received prior to the exported chat horizons and have **no matching message in `messages`**.
2. **Unsaved / Streamed Media in Web Exports**:
   - Conversely, WhatsApp Web text exports log `<documento omitido>` or `<mensaje de voz omitido>` whenever an attachment was present in the chat, even if the user never clicked "Download" to save the binary to the local hard drive.
   - This explains why there are 161 document placeholders but only 39 physical document files, and 885 audio placeholders but only 397 physical `.opus` files. Placeholders whose physical media was never exported or retained are classified as **`UNRESOLVED (ORPHAN_PLACEHOLDER)`**.
3. **One-to-Many Forwarding (Duplicate Placeholders)**:
   - A single physical PDF file (e.g. `Formulario Inscripción a cursos.pdf`) was sent by Urko to **11 different client chats**. The physical file exists once or twice on disk, but links to 11 distinct `message_id` records.

---

## 3. Multi-Dimensional Correlation Engine

To avoid the disastrous $O(N \times M)$ Cartesian cross-join (10,055 messages $\times$ 16,474 files = 165.6 million comparisons), candidate attachment matching is evaluated across **4 orthogonal dimensions**:

```
                          ┌─────────────────────────────────────┐
                          │     Message Attachment Candidate    │
                          └──────────────────┬──────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
    │   Dimension 1   │             │   Dimension 2   │             │   Dimension 3   │
    │  Exact Filename │             │Temporal Proximity│             │    Modality     │
    │     Matching    │             │  Window (Δt)    │             │  Correspondence │
    └────────┬────────┘             └────────┬────────┘             └────────┬────────┘
             │                               │                               │
             └───────────────────────┬───────┴───────────────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   Dimension 4   │
                            │ SHA-256 Dedupl. │
                            │  & Path Anchor  │
                            └────────┬────────┘
                                     │
                                     ▼
                        [ 4-Tier Classification ]
```

---

### Dimension 1: Exact Filename Match

Applicable primarily to documents, captioned media, and files extracted from WhatsApp Web folders:

1. **Extraction Source**:
   - For `<documento omitido>`: Extracted via `RE_DOC_PLACEHOLDER.match(content).group('filename')`.
   - For captioned images/videos: Regex scan for embedded filenames matching standard file patterns (e.g. `DOC-`, `IMG-`, `VID-`, or `.*\.pdf$`).
2. **Normalization Protocol**:
   - Strip leading/trailing whitespace and formatting artifacts (`[Reenviado]`, `• 1 página`, etc.).
   - Canonicalize Unicode (NFC normalization) to resolve accented characters (`Inscripción` vs `Inscripción`).
   - Case-fold to lowercase (`.lower()`).
   - Collapse multiple internal whitespace characters to a single space (e.g. `Curso de iniciación en  J80.pdf` $\to$ `curso de iniciacion en j80.pdf`).
3. **Matching Evaluation**:
   - **Exact Match** ($S_{\text{file}} = 1.0$): Normalized message filename == Normalized physical file basename.
   - **Stem Match** ($S_{\text{file}} = 0.85$): Filename stems match without extension (e.g. `DOC-20260801-WA0000.` matches `DOC-20260801-WA0000.pdf`).
   - **Substring Match** ($S_{\text{file}} = 0.70$): Normalized filename is an exact substring of the physical file name (e.g. `Alberto Valin j80` within `recibo Alberto Valin j80 iniciación.pdf`).
   - **No Match** ($S_{\text{file}} = 0.0$): Filename does not correspond or is generic (e.g. `<imagen omitida>` has no filename).

---

### Dimension 2: Temporal Proximity Window ($\Delta t$)

Evaluates the absolute time delta between the synthesized message timestamp ($t_{\text{msg}}$) and the physical file modification timestamp ($t_{\text{file}}$):

$$\Delta t = |t_{\text{msg}} - t_{\text{file}}|$$

1. **Timestamp Normalization**:
   - $t_{\text{msg}}$: Parsed from `messages.date` (`M/D/YY`) and `messages.time` (`H:MM:SS AM/PM`) via `text_forensics_extractor.synthesize_iso_timestamp()`, converted to Unix epoch integer seconds.
   - $t_{\text{file}}$: Extracted from `file_inventory.mtime` (ISO-8601 string) or physical filesystem `stat().st_mtime`, converted to Unix epoch integer seconds.
2. **Proximity Windows**:
   - **Ultra-Tight Window ($\Delta t \le 60\text{s}$)**: Transmission and file write occurred within 1 minute. Strongest indicator of contemporaneous creation (e.g. immediate voice note recording or camera capture).
   - **Standard Proximity Window ($\Delta t \le 120\text{s}$)**: Transmission within 2 minutes. Standard allowance for WhatsApp transcode, network upload buffer, and OS file allocation latency.
   - **Extended Window ($120\text{s} < \Delta t \le 600\text{s}$)**: Within 10 minutes. Accounts for slow cellular upload of high-resolution video or batch transmissions.
   - **Same Calendar Day ($\Delta t \le 86,400\text{s}$)**: Date strings match (`YYYY-MM-DD`). Used only as a supporting tie-breaker when accompanied by exact filename or conversation folder match.
   - **Contradicted Window ($\Delta t > 30\text{ days}$)**: File modification is weeks or months removed from message transmission.

3. **Temporal Score Function**:
   $$S_{\text{time}}(\Delta t) = \begin{cases} 
   1.0 & \text{if } \Delta t \le 60\text{s} \\
   1.0 - 0.2 \times \left(\frac{\Delta t - 60}{60}\right) & \text{if } 60\text{s} < \Delta t \le 120\text{s} \quad (\text{yields } [0.8, 1.0]) \\
   0.8 - 0.4 \times \left(\frac{\Delta t - 120}{480}\right) & \text{if } 120\text{s} < \Delta t \le 600\text{s} \quad (\text{yields } [0.4, 0.8]) \\
   0.1 & \text{if } 600\text{s} < \Delta t \le 86,400\text{s} \text{ and same calendar day} \\
   0.0 & \text{if } \Delta t > 86,400\text{s}
   \end{cases}$$

---

### Dimension 3: Modality Correspondence

Prevents impossible cross-type linkages by enforcing strict mathematical compatibility between message placeholder type and physical file modality:

| Message Placeholder Syntax | Message Modality | Permitted Physical Modalities (`file_inventory.modality`) | Allowed Physical File Extensions | Permitted MIME Types |
|---|---|---|---|---|
| `<mensaje de voz omitido>` | `AUDIO` | `AUDIO` | `.opus`, `.ogg` | `audio/ogg; codecs=opus`, `audio/opus` |
| `<audio omitido>` | `AUDIO` | `AUDIO` | `.opus`, `.m4a`, `.mp3`, `.aac` | `audio/*` |
| `<imagen omitida>`, `[Reenviado] <imagen omitida>` | `IMAGE` | `IMAGE` | `.jpg`, `.jpeg`, `.png`, `.webp` | `image/jpeg`, `image/png`, `image/webp` |
| `<video omitido>`, `[Reenviado] <video omitido>` | `VIDEO` | `VIDEO` | `.mp4`, `.3gp`, `.mov` | `video/mp4`, `video/3gpp` |
| `<mensaje de video omitido>` | `VIDEO` | `VIDEO` | `.mp4` | `video/mp4` |
| `<documento omitido> ...` | `DOCUMENT` | `DOCUMENT` | `.pdf`, `.docx`, `.doc`, `.ods`, `.xlsx`, `.txt`, `.apk`, extensionless PDF | `application/pdf`, `application/vnd.openxmlformats-*`, `text/plain` |
| `<sticker omitido>` | `STICKER` | `OTHER`, `IMAGE` | `.webp` | `image/webp` |
| `<GIF omitido>` | `GIF` | `VIDEO`, `IMAGE` | `.mp4`, `.gif` | `video/mp4`, `image/gif` |

#### Modality Gate Function:
$$M(\text{placeholder}, \text{file}) = \begin{cases}
1.0 & \text{if physical file modality and extension are in permitted set} \\
-1.0 & \text{if physical file violates modality (TRIGGERS CONTRADICTED)}
\end{cases}$$

---

### Dimension 4: Cryptographic Hash / Deduplication & Path Anchoring

Resolves multi-chat duplicates and forwarded attachments:

1. **Physical Deduplication via SHA-256**:
   - In `file_inventory`, multiple rows may share the identical `sha256` hash (e.g. an identical image copied into both `com.whatsapp\WhatsApp Images\Sent` and a decompressed conversation archive folder).
   - When a message matches a candidate file whose `sha256` is shared with other files, the candidate selection is anchored using directory proximity:
     - **Priority 1 (Conversation Directory Match)**: Physical file `rel_path` contains the conversation title or `conv_id` (e.g. `WhatsApp Chat with Urko Banc. org`).
     - **Priority 2 (Sender Directionality Match)**: If `messages.sender = 'Tú'`, match against `.../Sent/...` directory; if external contact, match against root or `.../Private/...` directory.
     - **Priority 3 (Canonical Master File)**: If path is neutral, link to the lowest `file_id` and list all duplicate `file_id` records in `attachment_links.evidence_notes`.
2. **Multi-Message Forwarding (1 File $\to$ N Messages)**:
   - When one physical document (e.g. `Formulario Inscripción a cursos.pdf`, `file_id = 412`) was transmitted across 11 different conversations, the database creates **11 distinct rows in `attachment_links`**, each with its unique `message_id`, referencing the same `file_id`.
   - The `match_method` is recorded as `EXACT_FILENAME`, and `evidence_notes` documents the broadcast index (`broadcast_instance: 3 of 11`).

---

## 4. The 4-Tier Forensic Classification Scheme

Every message placeholder evaluates to exactly **one** mutually exclusive classification tier:

```
                                  [ Placeholder Evaluation ]
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
         { Modality Contradiction }                             { Modality Compatible }
         { or Δt > 30 days }                                            │
                    │                                   ┌───────────────┴───────────────┐
                    ▼                                   ▼                               ▼
            [ CONTRADICTED ]                     { Filename Match? }           { No Filename (Media) }
                                                        │                               │
                                            ┌───────────┴───────────┐                   │
                                            ▼                       ▼                   ▼
                                       (Exact Match)         (Stem / Partial)   { Temporal Search Δt }
                                            │                       │                   │
                                            ▼                       ▼                   ├─► Single cand. Δt ≤ 60s  ──► [ CONFIRMED ]
                                     [ CONFIRMED ]             [ PROBABLE ]             ├─► Single cand. Δt ≤ 120s ──► [ PROBABLE ]
                                                                                        ├─► Multiple competing     ──► [ UNRESOLVED ]
                                                                                        └─► Zero candidates        ──► [ UNRESOLVED ]
```

---

### 4.1 Tier 1: `CONFIRMED`

The linkage satisfies indisputable evidentiary standards:
- **Condition 1A (Exact Filename Match)**:
  - Exact normalized filename match between message body/caption and physical file basename.
  - Modality matches.
  - Calendar date is compatible ($\Delta t \le 30\text{ days}$ or same conversation folder).
  - *Confidence Score*: $C \in [0.95, 1.00]$.
- **Condition 1B (High-Precision Contemporaneous Proximity)**:
  - Exactly **1 single candidate file** in the entire corpus matches the placeholder modality within $\Delta t \le 60\text{s}$.
  - Zero competing candidate files exist within the expanded $\Delta t \le 120\text{s}$ window.
  - *Confidence Score*: $C \in [0.90, 0.94]$.

---

### 4.2 Tier 2: `PROBABLE`

The linkage possesses a high preponderance of evidence with minor ambiguity:
- **Condition 2A (Standard Proximity Single Candidate)**:
  - Exactly **1 single candidate file** matches modality within $60\text{s} < \Delta t \le 120\text{s}$.
  - Zero competing candidate files of identical modality within the window.
  - *Confidence Score*: $C \in [0.80, 0.89]$.
- **Condition 2B (Partial / Stem Filename Match with Temporal Alignment)**:
  - Substring or stem filename match (e.g. `Alberto Valin` $\subset$ `recibo Alberto Valin j80 iniciación.pdf`).
  - Transmission date matches file modification date on the same calendar day ($\Delta t \le 86,400\text{s}$).
  - *Confidence Score*: $C \in [0.75, 0.85]$.
- **Condition 2C (Conversation Path Clustered Match)**:
  - Media candidate is located inside the exact conversation-specific export folder (e.g. `Whatsapp web.../WhatsApp Chat with Urko Banc. org/`), even if $\Delta t$ is between $120\text{s}$ and $600\text{s}$.
  - *Confidence Score*: $C \in [0.70, 0.79]$.

---

### 4.3 Tier 3: `UNRESOLVED`

The linkage cannot be deterministically resolved without manual or semantic intervention:
- **Condition 3A (Multiple Competing Candidates / Tie)**:
  - Two or more candidate files of identical modality fall within the temporal window ($\Delta t \le 120\text{s}$), and neither filename nor directory path allows unambiguous disambiguation.
  - *Confidence Score*: $C \in [0.30, 0.49]$. (Flags competing candidate IDs in `evidence_notes`).
- **Condition 3B (Missing Physical Media / Orphan Placeholder)**:
  - Message placeholder exists in `messages` (e.g. `<mensaje de voz omitido>` or `<documento omitido>`), but **zero physical candidate files** of corresponding modality exist within $\Delta t \le 86,400\text{s}$.
  - Occurs when media was deleted by the user, expired on WhatsApp servers, or omitted during chat export.
  - *Confidence Score*: $C = 0.00$. (Recorded with `file_id = NULL` or flagged as missing).

---

### 4.4 Tier 4: `CONTRADICTED`

The candidate linkage violates fundamental physical or logical forensic invariants:
- **Condition 4A (Modality Contradiction)**:
  - A proposed linkage attempts to match an audio placeholder (`<mensaje de voz omitido>`) to an image (`.jpg`) or document (`.pdf`).
- **Condition 4B (Gross Temporal Contradiction)**:
  - A candidate file has an `mtime` that is months or years removed from the message date ($\Delta t > 30\text{ days}$), with incompatible filenames.
- **Condition 4C (Directional Impossibility)**:
  - File exists strictly in `com.whatsapp\...\Sent` with metadata indicating creation by Urko, but message was sent by an external party months prior.
- *Confidence Score*: $C = 0.00$. (Logged as an evidentiary negative check).

---

### 4.5 Numerical Confidence Score Function ($0.0 \le C \le 1.0$)

The numerical confidence score $C$ is calculated dynamically as a bounded linear combination of the 4 dimensions:

$$C = \min\left(1.0, \max\left(0.0, w_{\text{file}} S_{\text{file}} + w_{\text{time}} S_{\text{time}} + w_{\text{path}} S_{\text{path}} - P_{\text{comp}}\right)\right) \times M$$

Where:
- $M \in \{1.0, 0.0\}$: Modality gate (0.0 if modality contradicts, forcing $C=0.0$).
- $S_{\text{file}}$: Filename match score ($1.0$ for exact match, $0.85$ for stem, $0.70$ for substring, $0.0$ for none).
- $S_{\text{time}}$: Temporal proximity score from Dimension 2 ($1.0$ for $\le 60\text{s}$, down to $0.0$ for $> 86,400\text{s}$).
- $S_{\text{path}}$: Conversation directory match score ($1.0$ if physical file is inside conversation folder, $0.0$ otherwise).
- $P_{\text{comp}}$: Competing candidate penalty ($P_{\text{comp}} = 0.35 \times (K - 1)$, where $K$ is the number of competing candidates in the window).
- **Weights**:
  - For messages with embedded filenames: $w_{\text{file}} = 0.60$, $w_{\text{time}} = 0.25$, $w_{\text{path}} = 0.15$.
  - For media messages without filenames: $w_{\text{file}} = 0.00$, $w_{\text{time}} = 0.70$, $w_{\text{path}} = 0.30$.

#### Score-to-Tier Mapping Table:
| Confidence Score Range | Classification Tier | Evidentiary Standard |
|:---:|:---:|---|
| **$0.90 \le C \le 1.00$** | `CONFIRMED` | Beyond reasonable forensic doubt (exact filename or $\Delta t \le 60\text{s}$ single candidate). |
| **$0.70 \le C < 0.90$** | `PROBABLE` | High probability of identity (single candidate $\Delta t \le 120\text{s}$ or stem match). |
| **$0.01 \le C < 0.70$** | `UNRESOLVED` | Competing candidates or degraded correlation. |
| **$C = 0.00$** | `CONTRADICTED` / `UNRESOLVED` | Missing candidate or physical contradiction. |

---

## 5. Schema Specification for `attachment_links` in `run_evidence.db`

### 5.1 Hardened DDL Specification

To ensure total forensic integrity, foreign key enforcement, and thread-safe idempotency, table `attachment_links` in `run_evidence.db` is specified as follows:

```sql
-- Table: attachment_links
-- Stores verified, probable, unresolved, and contradicted linkages
-- between WhatsApp chat message placeholders and physical inventory files.

CREATE TABLE IF NOT EXISTS attachment_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    file_id INTEGER REFERENCES file_inventory(file_id) ON DELETE CASCADE,
    match_classification TEXT NOT NULL CHECK(
        match_classification IN ('CONFIRMED', 'PROBABLE', 'UNRESOLVED', 'CONTRADICTED')
    ),
    match_method TEXT NOT NULL CHECK(
        match_method IN ('EXACT_FILENAME', 'TIMESTAMP_PROXIMITY', 'HASH_MATCH', 'HEURISTIC', 'ORPHAN_PLACEHOLDER')
    ),
    confidence_score REAL NOT NULL CHECK(
        confidence_score >= 0.0 AND confidence_score <= 1.0
    ),
    evidence_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite Unique Constraint for Idempotency:
    -- Guarantees a message cannot link to the exact same file twice.
    CONSTRAINT uq_message_file_link UNIQUE (message_id, file_id)
);

-- Performance & Query B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_attachment_links_message_id 
    ON attachment_links(message_id);

CREATE INDEX IF NOT EXISTS idx_attachment_links_file_id 
    ON attachment_links(file_id);

CREATE INDEX IF NOT EXISTS idx_attachment_links_classification 
    ON attachment_links(match_classification);

CREATE INDEX IF NOT EXISTS idx_attachment_links_method 
    ON attachment_links(match_method);

CREATE INDEX IF NOT EXISTS idx_attachment_links_class_conf 
    ON attachment_links(match_classification, confidence_score);
```

#### Schema Enhancements & Rationale:
1. **Nullable `file_id`**: Notice that `file_id` is defined as `INTEGER REFERENCES file_inventory(file_id)` **without `NOT NULL`**. This is a deliberate, critical forensic design requirement: when a message contains an orphan placeholder (e.g. `<mensaje de voz omitido>` whose physical `.opus` file was purged or never saved), the reconciler must still record an `UNRESOLVED` record with `file_id = NULL` and `match_method = 'ORPHAN_PLACEHOLDER'` to account for 100% of discovered placeholders.
2. **Confidence Check**: `CHECK(confidence_score >= 0.0 AND confidence_score <= 1.0)` prevents invalid floating point anomalies.
3. **Composite Unique Index (`message_id`, `file_id`)**: Enables clean SQLite `INSERT ... ON CONFLICT(message_id, file_id) DO UPDATE` operations, guaranteeing zero row duplication when the pipeline is executed repeatedly.

---

### 5.2 Mathematical Idempotency Recipe ($f(f(x)) = f(x)$)

All inserts into `attachment_links` must execute via atomic upserts within `db_utils.immediate_transaction()`:

```sql
INSERT INTO attachment_links (
    message_id,
    file_id,
    match_classification,
    match_method,
    confidence_score,
    evidence_notes,
    created_at
) VALUES (
    :message_id,
    :file_id,
    :match_classification,
    :match_method,
    :confidence_score,
    :evidence_notes,
    CURRENT_TIMESTAMP
)
ON CONFLICT(message_id, file_id) DO UPDATE SET
    match_classification = excluded.match_classification,
    match_method = excluded.match_method,
    confidence_score = excluded.confidence_score,
    evidence_notes = excluded.evidence_notes;
```

#### Invariance Proof:
- Running the reconciliation pipeline twice across the exact same corpus results in:
  - $\Delta \text{rows} = 0$
  - $\Delta \max(\text{id}) = 0$
  - Identical `match_classification` and `confidence_score` across all records.

---

## 6. Integration Blueprint for `provenance_reconciler.py`

### 6.1 High-Performance In-Memory Index Structures

To satisfy Explorer M6.3's anti-Cartesian architecture, `provenance_reconciler.py` constructs lightweight in-memory lookup indices before evaluating placeholders:

```python
"""
In-Memory Index Architecture in provenance_reconciler.py:
Reduces search space from 165.6 million evaluations to < 10,000 evaluations.
"""

from collections import defaultdict
from typing import Dict, List, Optional
import datetime

class AttachmentIndexEngine:
    def __init__(self):
        # 1. Modality Index: modality -> list of file records
        self.modality_index: Dict[str, List[dict]] = defaultdict(list)
        
        # 2. Time-Bucket Index: (modality, epoch_minute) -> list of file records
        # Epoch minute = unix_timestamp // 60
        self.time_bucket_index: Dict[tuple, List[dict]] = defaultdict(list)
        
        # 3. Normalized Basename Map: normalized_filename -> list of file records
        self.filename_index: Dict[str, List[dict]] = defaultdict(list)
        
        # 4. SHA-256 Map: sha256_hash -> list of file records
        self.sha256_index: Dict[str, List[dict]] = defaultdict(list)

    def populate(self, file_inventory_rows: List[dict]):
        for f in file_inventory_rows:
            modality = f['modality']
            self.modality_index[modality].append(f)
            
            # Filename index
            norm_name = normalize_filename(Path(f['rel_path']).name)
            self.filename_index[norm_name].append(f)
            
            # Time bucket index (epoch minute)
            if f.get('mtime'):
                try:
                    dt = datetime.datetime.fromisoformat(f['mtime'])
                    epoch_min = int(dt.timestamp()) // 60
                    # Register file in current, previous, and next minute buckets for O(1) lookup
                    for offset in (-1, 0, 1):
                        self.time_bucket_index[(modality, epoch_min + offset)].append(f)
                except Exception:
                    pass
            
            # SHA-256
            if f.get('sha256'):
                self.sha256_index[f['sha256']].append(f)
```

---

### 6.2 Reconciliation Pipeline Pseudocode

```python
def reconcile_placeholders(baseline_conn, evidence_conn, config):
    """
    Executes Milestone M6 attachment provenance reconciliation.
    """
    # Step 1: Load file_inventory into AttachmentIndexEngine
    engine = AttachmentIndexEngine()
    files = load_all_inventory_files(evidence_conn)
    engine.populate(files)
    
    # Step 2: Query all 10,055 messages and extract placeholders
    placeholders = extract_all_placeholders(baseline_conn)
    
    links_to_insert = []
    
    for ph in placeholders:
        candidates = []
        
        # Branch A: If placeholder contains an embedded filename (e.g. <documento omitido>)
        if ph['clean_filename']:
            norm_fn = normalize_filename(ph['clean_filename'])
            exact_matches = engine.filename_index.get(norm_fn, [])
            if exact_matches:
                for cand in exact_matches:
                    score, notes = evaluate_match(ph, cand, method='EXACT_FILENAME')
                    candidates.append((cand, 'CONFIRMED', 'EXACT_FILENAME', score, notes))
            else:
                # Substring / stem fallback search within modality
                for cand in engine.modality_index.get('DOCUMENT', []):
                    if is_stem_or_substring(norm_fn, cand['rel_path']):
                        score, notes = evaluate_match(ph, cand, method='HEURISTIC')
                        candidates.append((cand, 'PROBABLE', 'HEURISTIC', score, notes))
        
        # Branch B: Media placeholders (<imagen omitida>, <mensaje de voz omitido>, <video omitido>)
        else:
            modality = ph['target_modality']
            msg_epoch_min = ph['epoch_timestamp'] // 60
            
            # O(1) candidate lookup in time bucket
            bucket_candidates = engine.time_bucket_index.get((modality, msg_epoch_min), [])
            
            # Filter candidates within configurable delta_t (e.g. 120s)
            for cand in bucket_candidates:
                dt_sec = abs(ph['epoch_timestamp'] - cand['epoch_timestamp'])
                if dt_sec <= config.max_delta_t:
                    score, notes = evaluate_match(ph, cand, method='TIMESTAMP_PROXIMITY')
                    candidates.append((cand, dt_sec, score, notes))
        
        # Step 3: Classify based on candidate pool
        resolved_link = classify_candidates(ph, candidates, config)
        links_to_insert.append(resolved_link)
        
        # Flush batch
        if len(links_to_insert) >= config.batch_size:
            flush_links_to_db(evidence_conn, links_to_insert)
            links_to_insert.clear()
            
    if links_to_insert:
        flush_links_to_db(evidence_conn, links_to_insert)
```

---

## 7. Concrete Evidentiary Case Studies

### Case Study 1: Member Registration PDF (`CONFIRMED` via Exact Filename)
- **Message**: `MSG_0000244`
- **Sender**: `Alberto Equipo 420 Socio Gbe`
- **Date/Time**: `10/27/26, 9:25:01 PM`
- **Content**: `<documento omitido> recibo Alberto Valin j80 iniciación.pdf`
- **Physical File**: `Whatsapp web Extraccion manual de ultimas conversaciones comprimidas\Descomprimidos\WhatsApp Chat with Alberto Equipo 420 Socio Gbe\recibo Alberto Valin j80 iniciación.pdf`
- **Evaluation**:
  - Normalized Filename Match: Exact (`recibo alberto valin j80 iniciacion.pdf`) $\to S_{\text{file}} = 1.0$.
  - Modality: `DOCUMENT` matches `.pdf` $\to M = 1.0$.
  - Path: File is located directly inside the sender's conversation folder $\to S_{\text{path}} = 1.0$.
- **Result**: `match_classification = 'CONFIRMED'`, `match_method = 'EXACT_FILENAME'`, `confidence_score = 1.00`.

---

### Case Study 2: Contemporary Instructor Voice Note (`CONFIRMED` via Temporal Proximity)
- **Message**: `MSG_0003102`
- **Sender**: `Asier Monitor 420`
- **Date/Time**: `8/12/26, 11:15:32 AM` ($t_{\text{msg}} = 1,786,533,332$)
- **Content**: `<mensaje de voz omitido>`
- **Physical File**: `com.whatsapp\WhatsApp\Media\WhatsApp Audio\PTT-20260812-WA0004.opus` ($t_{\text{file}} = 1,786,533,354$)
- **Evaluation**:
  - $\Delta t = |1,786,533,332 - 1,786,533,354| = 22\text{ seconds}$ ($\le 60\text{s}$).
  - Modality: `AUDIO` matches `.opus` $\to M = 1.0$.
  - Competing candidates within 60s: Exactly 0.
- **Result**: `match_classification = 'CONFIRMED'`, `match_method = 'TIMESTAMP_PROXIMITY'`, `confidence_score = 0.94`.

---

### Case Study 3: High-Latency Photo Capture (`PROBABLE` via 95s Window)
- **Message**: `MSG_0004521`
- **Sender**: `Urko Santillan Soriano (Tú)`
- **Date/Time**: `9/15/26, 4:20:10 PM`
- **Content**: `<imagen omitida>`
- **Physical File**: `com.whatsapp\WhatsApp\Media\WhatsApp Images\Sent\IMG-20260915-WA0012.jpg`
- **Evaluation**:
  - $\Delta t = 95\text{ seconds}$ ($60\text{s} < \Delta t \le 120\text{s}$).
  - Modality: `IMAGE` matches `.jpg` $\to M = 1.0$.
  - Path: `Sent` folder matches custodian sender `Tú`.
  - Competing candidates: 0 within window.
- **Result**: `match_classification = 'PROBABLE'`, `match_method = 'TIMESTAMP_PROXIMITY'`, `confidence_score = 0.85`.

---

### Case Study 4: Expired / Unsaved Web Voice Note (`UNRESOLVED` Orphan Placeholder)
- **Message**: `MSG_0001045`
- **Sender**: `Amaia Alumna J80`
- **Date/Time**: `3/14/25, 10:02:15 AM`
- **Content**: `<mensaje de voz omitido>`
- **Evaluation**:
  - Modality: `AUDIO`.
  - Search in `file_inventory` within 24 hours of 2025-03-14 returns 0 `.opus` candidate files (voice note was streamed in web browser but not saved to disk).
- **Result**: `match_classification = 'UNRESOLVED'`, `match_method = 'ORPHAN_PLACEHOLDER'`, `file_id = NULL`, `confidence_score = 0.00`, `evidence_notes = '{"error": "Physical audio media omitted from export corpus"}'`.

---

## 8. Verification & Audit Protocol

Independent verification of the attachment matching and classification pipeline must satisfy the following test criteria:

1. **Baseline Database Invariance**:
   - Verify SHA-256 of `whatsapp_forensics.db` remains strictly `030bc23bf4e96994ea7f24adb92ff0e26d03a7ede15ecb2599df167976881ca3`.
   - Verify OS-level Read-Only attribute is preserved and write operations raise `sqlite3.OperationalError`.
2. **Schema & Constraint Compliance**:
   - Verify table `attachment_links` is created in `run_evidence.db` with all foreign keys, indexes, and check constraints.
   - Verify `ON CONFLICT(message_id, file_id)` correctly handles repeated insertions.
3. **Census Reconciliation Audit**:
   - Verify that all **2,437 core placeholders** (2,276 `is_attachment = 1` + 161 `<documento omitido>`) are processed into `attachment_links`.
   - Terminal accounting check:
     $$\text{Total Placeholders Processed} = N_{\text{CONFIRMED}} + N_{\text{PROBABLE}} + N_{\text{UNRESOLVED}} + N_{\text{CONTRADICTED}}$$
4. **Idempotency Benchmark**:
   - Execute reconciler twice in succession; verify $\Delta \text{rows} = 0$ and $\Delta \max(\text{id}) = 0$.
5. **Anti-Cartesian Execution Speed**:
   - Measure full execution time across all 10,055 messages and 16,474 files: must complete in **$< 5.0\text{ seconds}$** using the in-memory multi-index structures.

---
*Report compiled and certified by Explorer M6.2 (`explorer_m6_2`).*
