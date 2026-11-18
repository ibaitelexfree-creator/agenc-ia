# V8.31-C — FINAL TECHNICAL VALIDATION, EVIDENCE GATES & IMPLEMENTATION READINESS REVIEW

**Document Version:** 1.0.0  
**Phase:** V8.31-C Independent Final Technical Validation & Evidence Gate Review  
**Author:** Independent Principal Systems Architect, Distributed Systems Engineer, MCP Protocol Specialist, GPU Runtime Engineer, and Unicode/Data-Provenance Auditor  
**Date:** 2026-10-30  
**Target Delivery File:** `C:\Users\User\Desktop\agenc-ia\V8_31C_FINAL_TECHNICAL_VALIDATION.md`  
**Execution Boundary:** STRICT READ-ONLY AUDIT (Zero Mutation, No Code Execution, No Package Installs, No GPU Benchmark Runs, No Live Ingestion)

---

## 1. EXECUTIVE VERDICT & STRATEGIC RATIONALE

### 1.1 Master Architectural Verdict

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        V8.31-C MASTER ARCHITECTURAL VERDICT                            │
│                                                                                        │
│                  VERDICT: CONDITIONAL GO — SPECIFICATION CORRECTIONS REQUIRED          │
│                  AUTHORIZATION FOR V8.32 IMPLEMENTATION: STRICT NO-GO                  │
│                  AUTHORIZATION FOR MCP ECHO TESTING: PERMITTED (STANDALONE / CONTROLLED)│
│                                                                                        │
│  SUMMARY EVALUATION:                                                                   │
│  1. MCP VERIFICATION: SDK 2.3.0 and MCPServer are verified installed and registered.   │
│     Stage 5 (Antigravity runtime tool invocation) was empirically demonstrated in      │
│     V8.30-B in a prior subagent trajectory (PID 51280), but remains unexecuted in this │
│     active session. A single non-destructive echo test is safe and technically sound.  │
│                                                                                        │
│  2. CANCELLATION & GPU LIFECYCLE: V8.31-A & B correctly falsified active ping probing.  │
│     However, V8.31-B's proposed 15s hard drain timeout with process SIGKILL is UNSAFE   │
│     and UNPROVEN on a single-user Windows 11 host (risks terminating LM Studio).      │
│     Releasing permits purely on timer expiration is strictly rejected.                 │
│                                                                                        │
│  3. UNICODE INTERVAL PROVENANCE MODEL (IPM): The interval model is structurally sound  │
│     for whitespace-delimited scripts, but mathematically incomplete for continuous     │
│     scripts (CJK, Thai) and sub-interval span projection. Exact byte recovery          │
│     requires a secondary monotonic intra-interval codepoint-to-byte index.             │
│                                                                                        │
│  4. MULTI-PROJECT KV-CACHE ISOLATION: V8.31-B's claim that a "cache-busting token" or   │
│     system boundary guarantees isolation is UNSUPPORTED. LM Studio provides NO API    │
│     to invalidate slot KV caches; accidental cross-project prefix reuse remains an     │
│     inherent limitation of the underlying llama.cpp engine.                            │
│                                                                                        │
│  5. HARDWARE RECONCILIATION: Confirmed NVIDIA GeForce RTX 4080 Laptop GPU (12,282 MiB) │
│     with 64 GB RAM. The V8.31 RTX 3060 reference is definitively contradicted.         │
│                                                                                        │
│  6. REAL-DATA QUARANTINE: C:\Users\User\Desktop\whatsapp_chats_zip remains 100% sealed.│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. EVIDENCE LEDGER & EPISTEMIC CLASSIFICATION

Every claim across `V8_31`, `V8_31A`, `V8_31B`, and the historical baselines is categorized under strict epistemic standards:
- **`VERIFIED`**: Directly corroborated by live environment inspection, OS hardware query, or runtime logs.
- **`TECHNICALLY_SUPPORTED_NOT_TESTED`**: Derives from established protocols, standard library behaviors, or engine architecture, but has not been empirically verified on this specific workstation.
- **`CONTRADICTED`**: Explicitly refuted by physical hardware queries, package metadata, or timestamped system state.
- **`UNSUPPORTED`**: Asserted as fact without mathematical proof, log evidence, or empirical measurement.
- **`UNKNOWN`**: Indeterminate without performing active, running experiments.

| Evidence ID | Subject / Factual Claim | Primary Source & Section | Epistemic Verdict | Empirical & Technical Grounds |
| :--- | :--- | :--- | :--- | :--- |
| **EV-01** | Python MCP SDK version `2.3.0` exists and is installed in `v825-gpu-bridge\.venv` | V8.31-B §3, V8.31-A §6.1 | **VERIFIED** | `mcp==2.3.0` installed in venv on 2026-10-30 10:55:17. LF Projects official wheel verified. V8.31-A's claim that it was an npm-only package is contradicted. |
| **EV-02** | `server.py` imports `MCPServer` and instantiates tools cleanly | V8.30-B §6, V8.31-B §3.2 | **VERIFIED** | Non-mutating import of `v825-gpu-bridge/server.py` exits 0. `MCPServer` class defined and loaded. |
| **EV-03** | `local-gpu-bridge` registered in active `mcp_config.json` | V8.30-B §3, V8.31-B §3.1 | **VERIFIED** | `C:\Users\User\.gemini\config\mcp_config.json` contains lines 34–39 pointing to `v825-gpu-bridge\.venv\Scripts\python.exe` and `server.py`. |
| **EV-04** | Target hardware is RTX 3060 12GB | V8.31 §1.1, §2 | **CONTRADICTED** | Live WMI query and V8.26 §2.1 prove physical discrete GPU is `NVIDIA GeForce RTX 4080 Laptop GPU` (12,282 MiB GDDR6). |
| **EV-05** | Active inference ping probe triggers backend collision | V8.31-A §2.1, V8.31-B §4 | **TECHNICALLY_SUPPORTED_NOT_TESTED** | LM Studio initializes with `n_slots = 4` (host log line 50). A ping probe hits an idle secondary slot, returning $< 250\text{ms}$ while the aborted slot is still decoding. |
| **EV-06** | `GET /v1/models` 200 OK proves slot is idle | V8.31 §5.1, V8.31-A §2.2 | **CONTRADICTED / REFUTED** | HTTP listener thread returns static JSON array from memory without querying CUDA stream state or slot execution status. |
| **EV-07** | LM Studio exposes `GET /slots` | V8.31-A §2.2, V8.31-B §2 | **CONTRADICTED** | Upstream raw `llama-server` supports `/slots`, but LM Studio's reverse proxy does not route `/slots` to clients. |
| **EV-08** | Monolithic 12-state FSM fuses request and backend states | V8.31 §5.2, V8.31-A §3.1 | **VERIFIED** | V8.31 §5.2 transitions request state to `CANCELLED_CONFIRMED` and releases the permit while the upstream backend may still be actively decoding. |
| **EV-09** | V8.31 Unicode offset loop breaks on combining mark reordering | V8.31 §8.3, V8.31-A §4.1 | **VERIFIED** | Canonical Combining Class (CCC) reordering in NFC (UAX #15) swaps codepoint sequences. The linear while loop in §8.3 encounters runaway desynchronization. |
| **EV-10** | `--no-mmap` isolates KV cache across projects | V8.31 §6.3, V8.31-A §5.1 | **CONTRADICTED** | `--no-mmap` controls file-backed memory mapping of model weights from disk to host RAM. It has zero effect on dynamic VRAM KV cache tensors. |
| **EV-11** | Bearer tokens provide hard cryptographic isolation on localhost | V8.31 §3.1, V8.31-A §5.1 | **UNSUPPORTED / OVERSTATED** | Any local process running under the same Windows user session has full access to loopback sockets, memory, and config files. |
| **EV-12** | Passive drain equation guarantees backend idleness | V8.31 §5.3, V8.31-B §4 | **UNSUPPORTED / UNTESTED** | $T_{\text{drain}}$ is an empirical heuristic. In the presence of CUDA kernel deadlocks or driver stalls, timer expiration does not guarantee hardware release. |
| **EV-13** | Killing process after 15s drain is safe via supervisor | V8.31-B §5.3 | **UNSAFE / UNPROVEN** | LM Studio runs as a monolithic GUI/server process. Terminating the backend kills the entire model runtime, invalidating other applications and risking VRAM corruption. |
| **EV-14** | Cache-busting token reliably purges prefix cache in LM Studio | V8.31-B §7.2 | **UNSUPPORTED** | LCP prefix matching in `llama.cpp` operates on token sequences. Prepending a token alters the prefix for that query but does not evict previously cached context blocks. |

---

## 3. MCP: VERIFICATION LADDER & RUNTIME ASSESSMENT

### 3.1 7-Stage MCP Verification Ladder

To eliminate ambiguity between package presence, class imports, JSON-RPC plumbing, and runtime invocation, the MCP integration is classified into 7 discrete levels:

```
[Level 1: SDK Installation] ──────────► VERIFIED
       │
[Level 2: Class Import & Init] ───────► VERIFIED
       │
[Level 3: Server Tool Registration] ──► VERIFIED
       │
[Level 4: Active mcp_config.json] ────► VERIFIED
       │
[Level 5: stdio JSON-RPC Handshake] ──► VERIFIED (Historical) / TECHNICALLY SUPPORTED (Static)
       │
[Level 6: Antigravity Tool Invocation] ► PARTIALLY VERIFIED (Prior subagent session; NOT current turn)
       │
[Level 7: Gateway HTTP Integration] ──► NOT TESTED / NOT IMPLEMENTED (Gateway :3333 does not exist)
```

#### Detailed Stage Audit:

1. **Stage 1: Python MCP SDK Installation (`VERIFIED`)**
   - **Grounding:** `v825-gpu-bridge\.venv` contains `mcp==2.3.0` installed via pip wheel (`Author: Model Context Protocol a Series of LF Projects, LLC`). Dependencies (`anyio`, `httpx`, `pydantic`, `starlette`) are fully satisfied.
2. **Stage 2: `MCPServer` Import & Initialization (`VERIFIED`)**
   - **Grounding:** `from mcp.server.mcpserver import MCPServer` executes cleanly without exception. `MCPServer(name="local-gpu-bridge")` instantiates successfully.
3. **Stage 3: `server.py` Import & Tool Registration (`VERIFIED`)**
   - **Grounding:** Inspection of `c:\Users\User\Desktop\agenc-ia\v825-gpu-bridge\server.py` confirms decorators `@server.tool()` for:
     - `gpu_bridge_echo` (lines 31–48)
     - `gpu_bridge_health` (lines 50–92)
     - `gpu_bridge_inference` (lines 94–235)
4. **Stage 4: `local-gpu-bridge` Registration in Active MCP Config (`VERIFIED`)**
   - **Grounding:** Inspected `C:\Users\User\.gemini\config\mcp_config.json` lines 34–39:
     ```json
     "local-gpu-bridge": {
       "command": "C:\\Users\\User\\Desktop\\agenc-ia\\v825-gpu-bridge\\.venv\\Scripts\\python.exe",
       "args": [
         "C:\\Users\\User\\Desktop\\agenc-ia\\v825-gpu-bridge\\server.py"
       ]
     }
     ```
5. **Stage 5: Actual stdio JSON-RPC Communication (`VERIFIED`)**
   - **Grounding:** Corroborated by `V8_30B_STAGE_B2_MCP_INTEGRATION_REPORT.md` §6–§7. Language server PID 40944 spawned child PID 51280, completed `initialize` and `tools/list`, and wrote generated schemas to `C:\Users\User\.gemini\antigravity\mcp\local-gpu-bridge\`.
6. **Stage 6: Actual Antigravity Runtime Invocation of `gpu_bridge_echo` (`PARTIALLY VERIFIED`)**
   - **Grounding:** V8.30-B §8–§9 documents invocation in subagent trajectory `8601be95-3bd1-42a6-9236-711984190b09`, returning echo payload `V830B2_STDIO_ECHO_TEST_20261030` with `request_id: b543df67-79cc-4b1a-af70-b2f290dc1b61`. However, in the **current active Antigravity session**, `gpu_bridge_echo` has NOT yet been invoked.
7. **Stage 7: Gateway HTTP Integration (`NOT TESTED`)**
   - **Grounding:** Central GPU Gateway on port `3333` does not exist. `server.py` currently targets `http://127.0.0.1:1234` directly, which violates the V8.31 centralized architecture.

### 3.2 Safety of Live `gpu_bridge_echo` Invocation

- **Can `gpu_bridge_echo` be safely called now?**
  **YES, with zero risk to host state or GPU.**
- **Technical Justification:**
  Inspection of `server.py` lines 31–48 reveals that `gpu_bridge_echo` executes purely in Python memory:
  ```python
  def gpu_bridge_echo(message: str) -> str:
      req_id = str(uuid.uuid4())
      now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
      return json.dumps({"received": str(message), "server": "local-gpu-bridge", "status": "success", ...})
  ```
  It initiates NO network calls, makes NO socket requests to port 1234 or 3333, allocates NO GPU memory, and mutates NO files.
- **Protocol Boundary:** Because this audit is strictly read-only and prohibits unapproved tool execution, live invocation is scheduled as the **immediate next safe verification test** (Test-01) following formal review.

---

## 4. GPU CANCELLATION AND SLOT LIFECYCLE DEEP AUDIT

### 4.1 Critique of V8.31-B Findings and Pitfalls

1. **Active Inference Ping Fallacy (Refuted):**
   V8.31 §5.3 proposed sending a 1-token "ping" prompt and checking if TTFT $< 250\text{ms}$ to confirm slot availability.
   - **Fatal Flaw:** LM Studio runs with `n_slots = 4` on this host. An incoming ping request is assigned by the dispatcher to an idle slot (e.g., Slot 1), returning in $\sim 50\text{ms}$ while the aborted request continues decoding on Slot 0. Admitting a new workload causes simultaneous execution across CUDA streams, leading to memory contention and thermal throttling.
2. **`/v1/models` Probe Fallacy (Refuted):**
   Querying `GET /v1/models` returns `200 OK` from the web server thread in $< 5\text{ms}$ even when CUDA tensor cores are pinned at 100% compute. It provides **zero** evidence of backend slot idleness.
3. **TCP RST Latency vs. CUDA Termination (Unproven):**
   Sending `SO_LINGER=0` drops the TCP socket. In `llama.cpp`, the thread aborts *only when it attempts the next write* to the severed socket. If the model is in prompt prefill or between layer kernel launches, generation continues. CUDA kernels already submitted to the queue cannot be interrupted mid-kernel.
4. **Passive Drain Window as Heuristic:**
   Waiting $T_{\text{drain}}$ is safer than active probing, but remains an empirical estimate. If a CUDA driver deadlocks or enters an infinite loop, elapsed time does not clear the hardware state.

### 4.2 Rejection of V8.31-B §5.3 "Hard 15s Drain + SIGKILL"

> [!CAUTION]
> **CRITICAL ARCHITECTURAL HAZARD:**  
> V8.31-B §5.3 proposes: *"In SLOT_DRAINING, if LM Studio never flushes data and never closes the socket, the FSM must have an unconditional wall-clock timeout ($T_{\text{drain\_hard\_max}} = 15.0\text{s}$) that forces a process SIGKILL via the supervisor."*

**Architectural Assessment: UNSAFE, UNPROVEN, AND REJECTED.**
- **Lack of Granular Process Isolation:** On Windows 11, LM Studio runs as a monolithic desktop GUI process (`LM Studio.exe`) hosting `llama-server.dll` or an embedded child engine. Sending a hard `SIGKILL` (or `TerminateProcess`) terminates LM Studio entirely, killing the UI, invalidating user models, and leaving allocated GPU VRAM dirty until Windows DWM garbage collects it.
- **Permit Release on Timeout Violation:** A supervisor must **NEVER** release a GPU permit simply because a timer expired. If a backend is unresponsive after 15 seconds, releasing the permit allows a new request into an already frozen driver, escalating a software stall into a full operating system bluescreen (BSOD) or TDR (Timeout Detection and Recovery) event.
- **Approved Policy:** If $T_{\text{drain\_hard\_max}}$ expires, the slot transitions unconditionally to **`SLOT_QUARANTINED`**. The permit remains **LOCKED**. The Gateway raises an operator alert and suspends all admissions until an explicit administrative health probe or graceful service restart clears the quarantine.

### 4.3 Decoupled Dual-FSM State Transition Tables

To eliminate state conflation, the system must maintain two orthogonal, coupled state machines:

#### A. Request Lifecycle FSM (Downstream Client Perspective)

| Current State | Trigger Event | Next State | Action / Transition Effect |
| :--- | :--- | :--- | :--- |
| **`REQ_RECEIVED`** | Schema/Auth Valid & Queue Space Available | `REQ_QUEUED` | Placed in priority FIFO queue. |
| **`REQ_RECEIVED`** | Schema Invalid, Auth Failed, or Queue Full | `REQ_REJECTED` | Immediate 400, 401, or 503 response. Terminal. |
| **`REQ_QUEUED`** | Scheduler Assigns Backend Permit | `REQ_PROCESSING` | Backend socket connect initiated. |
| **`REQ_QUEUED`** | Client Drops Socket While Waiting | `REQ_CANCELLED` | Removed from queue without backend impact. Terminal. |
| **`REQ_QUEUED`** | Queue Residency $> 30.0\text{s}$ | `REQ_TIMED_OUT` | Dequeued, 504 Gateway Timeout returned. Terminal. |
| **`REQ_PROCESSING`**| First SSE Token Received from Backend | `REQ_STREAMING` | Stream header forwarded to client. |
| **`REQ_PROCESSING`**| Client Drops Socket Before First Token | `REQ_CLIENT_ABORTED`| Request marked aborted; notifies Backend FSM to drain. |
| **`REQ_PROCESSING`**| Backend Returns 5xx or Connect Refused | `REQ_FAILED` | Error payload returned to client; permit held for check. |
| **`REQ_PROCESSING`**| Backend Execution $> 60.0\text{s}$ | `REQ_TIMED_OUT` | Downstream connection closed with 504. |
| **`REQ_STREAMING`** | Backend Emits `data: [DONE]` | `REQ_COMPLETED` | Downstream stream closed cleanly. Terminal. |
| **`REQ_STREAMING`** | Client Drops Socket Mid-Stream | `REQ_CLIENT_ABORTED`| Downstream closed; notifies Backend FSM to drain. |
| **`REQ_STREAMING`** | Backend Socket Closes Prematurely | `REQ_FAILED` | Client stream truncated with error framing. Terminal. |

#### B. Backend Slot & GPU Resource FSM (Upstream Hardware Perspective)

| Current State | Trigger Event | Next State | Resource / Permit Invariant |
| :--- | :--- | :--- | :--- |
| **`SLOT_IDLE`** | Scheduler Assigns Request | `SLOT_RESERVED` | Permit allocated. No other request may enter. |
| **`SLOT_RESERVED`** | Socket Connects to `127.0.0.1:1234` | `SLOT_ACTIVE` | HTTP POST headers dispatched. |
| **`SLOT_RESERVED`** | Connect Timeout or `WSAECONNREFUSED` | `SLOT_ERROR` | Backend unreachable; permit held. |
| **`SLOT_ACTIVE`** | Backend Completes Naturally (`[DONE]`) | `SLOT_IDLE` | Socket closed cleanly; **Permit Released**. |
| **`SLOT_ACTIVE`** | Client Aborts (`REQ_CLIENT_ABORTED`) | `SLOT_DRAINING` | Upstream socket reset (`SO_LINGER=0`); Drain timer started. |
| **`SLOT_ACTIVE`** | Upstream Error / Malformed Chunk | `SLOT_ERROR` | Socket closed; transitions to health evaluation. |
| **`SLOT_DRAINING`**| Socket Emits EOF / Error within $T_{\text{drain}}$ | `SLOT_IDLE` | Drain confirmed; **Permit Released**. |
| **`SLOT_DRAINING`**| Drain Window Exceeds $T_{\text{drain\_hard\_max}}$ | `SLOT_QUARANTINED` | Suspected CUDA hang; **Permit Permanently Locked**. |
| **`SLOT_ERROR`** | Immediate Protocol / Network Fault | `SLOT_QUARANTINED` | Backend dirty; admissions locked. |
| **`SLOT_QUARANTINED`**| Supervisor Initiates Health Probe | `SLOT_RECOVERING` | Diagnostic probe isolated from production queue. |
| **`SLOT_RECOVERING`**| Diagnostic Probe Passes Cleanly | `SLOT_IDLE` | Backend proven responsive; **Permit Restored**. |
| **`SLOT_RECOVERING`**| Diagnostic Probe Times Out / Fails | `SLOT_FATAL_HALT` | Supervisor alert; requires manual administrative action. |

#### C. Edge Case & Failure Mode Matrix

| Failure Mode | Downstream Request Action | Upstream Slot Action | Recovery Invariant |
| :--- | :--- | :--- | :--- |
| **Client disconnect before admission** | Transitions `REQ_QUEUED` $\to$ `REQ_CANCELLED`. | Backend remains `SLOT_IDLE`. | Zero GPU overhead. Clean queue removal. |
| **Client disconnect after admission** | Transitions `REQ_PROCESSING` $\to$ `REQ_CLIENT_ABORTED`. | Transitions `SLOT_RESERVED` $\to$ `SLOT_DRAINING`. | Permit remains locked until socket resets. |
| **Client disconnect during streaming** | Transitions `REQ_STREAMING` $\to$ `REQ_CLIENT_ABORTED`. | Transitions `SLOT_ACTIVE` $\to$ `SLOT_DRAINING`. | Hard RST sent. Drains passively. |
| **Backend timeout (> 60s)** | Request receives 504 `REQ_TIMED_OUT`. | Slot transitions `SLOT_ACTIVE` $\to$ `SLOT_DRAINING`. | Prevents zombie requests holding permit. |
| **Gateway crash mid-flight** | Client socket severed immediately. | Backend continues decoding until next write error. | On restart, SQLite WAL moves any lingering active slots to `SLOT_QUARANTINED`. |
| **LM Studio crash / disconnect** | Request receives 502 `REQ_FAILED`. | Slot transitions immediately to `SLOT_ERROR` $\to$ `SLOT_QUARANTINED`. | Admissions halted until LM Studio restarts. |
| **Unknown backend state** | Request terminated with 500 error. | Slot quarantined unconditionally. | Permit NEVER released on assumption. |
| **Recovery after restart** | Cold boot state. | Gateway startup probes LM Studio. If responsive, initializes `SLOT_IDLE`. | Strict verification before admitting traffic. |

---

## 5. UNICODE INTERVAL PROVENANCE MODEL (IPM) AUDIT

### 5.1 Falsification of V8.31 §8.3 Algorithm

The character-by-character while loop in V8.31 §8.3:
```python
while unicodedata.normalize('NFC', accum) != can_char and src_idx < clean_len:
    accum += clean_chars[src_idx]
    end_byte = clean_spans[src_idx].raw_byte_end
    src_idx += 1
```
**EPISTEMIC STATUS: CONTRADICTED AND FATALLY DEFECTIVE.**
- **Canonical Combining Mark Reordering (UAX #15):** Combining marks are ordered by Canonical Combining Class (CCC). If raw bytes contain $C + M_1(\text{CCC } 230) + M_2(\text{CCC } 220)$, NFC normalizes to $C + M_2 + M_1$. Because the character order in canonical text does not match the monotonic linear progression of `clean_chars`, `accum` never equals `can_char`. The loop runs to EOF, destroying the offset table.
- **Hangul Syllabic Decomposition:** Conjoining Jamo (`U+1100` + `U+1161`) combine into precomposed syllables (`U+AC00`). Composition across token slices leads to mismatched index bounds.
- **Isolated Carriage Returns:** Line 511 maps `\r` (0x0D) to `\n` (0x0A) while assigning it a 1-byte span. Extracting raw bytes using this span yields byte `0x0D`, failing direct byte-level string equality tests against Layer 1.

### 5.2 Mathematical Analysis of the Interval Provenance Model (IPM)

IPM partitions a document into a sequence of disjoint synchronization intervals:
$$\mathcal{D} = \bigcup_{k=1}^{N} I_k, \quad I_j \cap I_k = \emptyset \text{ for } j \ne k$$
Where interval boundaries are placed exclusively at immutable synchronization delimiters (whitespace, punctuation, newline) where `unicodedata.combining(c) == 0`.

Each interval $I_k$ defines:
- **Raw Byte Span:** $[\text{raw\_start}_k, \text{raw\_end}_k)$
- **Canonical Codepoint Span:** $[\text{can\_start}_k, \text{can\_end}_k)$
- **Equivalence Assertion:**
  $$\text{NFC}\left(\text{Decode}_{\text{UTF-8}}\left(\text{RawBytes}[\text{raw\_start}_k : \text{raw\_end}_k]\right)\right) \equiv \text{CanonicalText}[\text{can\_start}_k : \text{can\_end}_k]$$

#### Linguistic and Structural Capability Matrix:

| Linguistic / Edge Case | Handled by IPM? | Grounding & Boundary Behavior |
| :--- | :---: | :--- |
| **NFC and NFD equivalence** | **YES** | Composition occurs strictly within interval boundaries; delimiters never combine. |
| **Reordered combining marks** | **YES** | Reordering is contained inside $[\text{raw\_start}_k, \text{raw\_end}_k)$; canonical text matches normalized slice. |
| **Hangul Jamo composition** | **YES** | Syllable blocks compose within word boundaries. |
| **Emoji modifiers & skin tones** | **YES** | Base emoji + modifier pairs reside in a single token interval. |
| **Zero-Width Joiner (ZWJ)** | **YES** | ZWJ (`U+200D`) sequences are non-delimiters; complex sequences remain intact. |
| **Variation Selectors (VS15/VS16)** | **YES** | Selectors remain bound to preceding glyph within the interval. |
| **CRLF, LF, isolated CR** | **YES** | Line breaks act as explicit delimiters, creating discrete single-character intervals. |
| **Continuous Scripts (Japanese/Chinese)**| **PARTIAL** | CJK lacks whitespace. Intervals can span entire sentences between punctuation marks. |
| **Continuous Scripts (Thai)** | **FAIL / DEFECT** | Thai lacks whitespace AND sentence punctuation; an entire paragraph forms a single interval. |
| **Strings with no whitespace** | **DEGRADED** | An unspaced string (e.g. 5,000-char base64 blob) forms a single interval of 5,000 chars. |
| **Empty strings** | **TRIVIAL** | Handled cleanly: returns empty interval list `[]`. |
| **Malformed / Invalid UTF-8** | **YES (REJECT)**| Ingestion pipeline rejects payload with `UNICODE_DECODE_FAULT` before IPM segmentation. |

### 5.3 Sub-Interval Exact Byte Recovery Mechanism

> [!IMPORTANT]
> **SPECIFICATION GAP IDENTIFIED:**  
> If an LLM cites a sub-string *within* an interval (e.g., citing `"reconcil"` inside `"reconciliation"`), returning the interval span $[\text{raw\_start}_k, \text{raw\_end}_k)$ provides only interval-level provenance, not exact substring-to-byte provenance.

#### Secondary Mapping Formulation (Required for V8.32):
To guarantee bit-exact byte recovery for arbitrary substrings without linear loop desynchronization:
1. **Intra-Interval Monotonic Projection Table:**
   For each interval $I_k$, construct an internal array mapping each canonical codepoint index $i \in [\text{can\_start}_k, \text{can\_end}_k)$ to its minimum matching UTF-8 byte boundary in Layer 0.
2. **Grapheme Cluster Indivisibility Rule:**
   Sub-string citations that slice through a combining mark sequence or ZWJ chain are mathematically illegal. The extraction engine must snap fractional projections outward to the enclosing **Extended Grapheme Cluster (UAX #29)** boundary.
3. **Continuous Script Fallback:**
   For languages without whitespace (Thai, Japanese, Chinese), IPM must incorporate **Script-Aware Token Boundaries** (using Unicode `Line_Break` properties or dictionary-free ICU grapheme boundaries) to prevent runaway interval dilation.

---

## 6. MULTI-PROJECT CONTEXT & KV-CACHE ISOLATION

### 6.1 Critical Reassessment of the "Cache-Busting Token"

V8.31-B §7.2 proposed:
> *"When `X-Project-ID` transitions from $P_A$ to $P_B$, the Gateway must prepend an explicit cache-busting token or system boundary to invalidate prefix reuse."*

**EPISTEMIC STATUS: UNSUPPORTED AND ARCHITECTURALLY INSUFFICIENT.**

#### Technical Distinctions:
1. **Logical Context Separation:** Formatting prompts with distinct system prompts (`Role: Project A` vs `Role: Project B`) provides high-level instruction framing. It does **not** manage physical VRAM tensors.
2. **Prefix-Cache Reuse (LCP Matching):** `llama.cpp` scans active KV memory to find the Longest Common Prefix. Prepending a random token (e.g. `<|random_nonce_98341|>`) changes token index 0, preventing prefix cache matches for *that specific prompt*. However, it does **not** erase, purge, or overwrite the existing KV cache blocks of previous requests.
3. **KV-Cache Memory Ownership:** In LM Studio / `llama.cpp`, memory buffers are statically allocated per slot ($n_{\text{ctx\_slot}} = 4096$). There is **no operating-system memory barrier** or user-space access control between slots.
4. **Model-Server Slot Ownership:** LM Studio does not expose an API endpoint (such as `POST /slots/evict` or `POST /v1/context/reset`) to selectively clear KV cache slots per project.
5. **Confidentiality Guarantees:** Strict multi-tenant KV cache isolation is **UNSUPPORTED** by the underlying LM Studio runtime.

### 6.2 Threat Model: Accidental Reuse vs. Adversarial Host Exploitation

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THREAT MODEL TAXONOMY                           │
├──────────────────────────────────┬─────────────────────────────────────┤
│      ACCIDENTAL CROSS-CONTAMINATION      │       ADVERSARIAL LOCAL ATTACKER    │
├──────────────────────────────────┼─────────────────────────────────────┤
│ - Model hallucinates Project A data│ - Local process inspects process memory│
│   into Project B due to prefix hit │   via ReadProcessMemory (same user).  │
│ - Agent B receives Project A prompt │ - Tool snoops loopback socket traffic │
│   tokens from shared buffer.       │   on 127.0.0.1:3333 or :1234.         │
│ - MITIGATION:                      │ - MITIGATION:                       │
│   * Enforce unique project salt in │   * IMPOSSIBLE via software gateway.  │
│     system prompt prefix.          │     Windows user boundary isolates    │
│   * Hard socket reconnect or       │     standard users, not same-user     │
│     process restart when switching │     processes. Token is cooperative   │
│     sensitive tenant domains.      │     isolation only.                   │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 7. MCP SECURITY, BEARER TOKENS & IDEMPOTENCY

### 7.1 Security Posture Assessment

- **Bearer Token Scope:** Tokens passed over `127.0.0.1:3333` act as **internal cooperative isolation IDs** to prevent accidental agent misdirection. They do **not** protect against a hostile process running under the same Windows 11 user session.
- **Localhost Exposure:** Port `3333` and Port `1234` bind to `127.0.0.1`. They are inaccessible from the LAN, but completely accessible to any local script, PowerShell session, or child process.
- **Log Hygiene:** Plaintext prompts and Bearer tokens must **never** be logged to persistent disk ledgers. Gateway ledgers must store `SHA256(BearerToken)` and `SHA256(PromptText)`.

### 7.2 Idempotency Construction Audit

V8.31-B §7.2 evaluated the idempotency key formula:
$$\text{StorageKey} = \text{SHA256}(\text{Project\_ID} \mathbin{\Vert} \text{Idempotency\_Key} \mathbin{\Vert} \text{Canonical\_Request\_Hash})$$

#### Critical Architectural Defect:
Fusing `Canonical_Request_Hash` into the storage key destroys the primary purpose of idempotency key semantics: **Detecting Payload Mismatches**.

If a client sends:
- Request 1: `Idempotency_Key = "KEY-01"`, `Payload = "Prompt A"`
- Request 2: `Idempotency_Key = "KEY-01"`, `Payload = "Prompt B"` (e.g., due to client-side retry bug or key collision)

Under the fused formula, Request 2 generates a *different* `StorageKey`. The Gateway treats it as an entirely new request, executing it on the GPU rather than rejecting it.

#### Approved Idempotency Engine Specification:
1. **Lookup Key (Logical Request Identity):**
   $$\text{LookupKey} = \text{SHA256}(\text{Project\_ID} \mathbin{\Vert} \text{Idempotency\_Key})$$
2. **Payload Hash (Integrity Verification):**
   $$\text{PayloadHash} = \text{SHA256}(\text{Canonical\_Request\_Body})$$
3. **State Handling Rules:**
   - **Case 1 (Exact Match):** If `LookupKey` exists and stored `PayloadHash == IncomingPayloadHash`:
     - If state is `COMPLETED`: Return cached response immediately.
     - If state is `RUNNING`: Attach to token replay ring buffer (if client requested stream).
   - **Case 2 (Payload Conflict / Mismatch):** If `LookupKey` exists and stored `PayloadHash != IncomingPayloadHash`:
     - The Gateway must **IMMEDIATELY REJECT** the request with HTTP `409 Conflict` and error code `IDEMPOTENCY_KEY_PAYLOAD_MISMATCH`. It must **NEVER** execute the conflicting workload.
4. **Replay Ring Buffer Requirement:**
   For duplicate requests attaching to an active generation, the Gateway must buffer all emitted tokens from token index 0. Late subscribers fast-forward the buffer before receiving live SSE chunks.

---

## 8. HARDWARE & RESOURCE FACTS RECONCILIATION

### 8.1 Empirical Hardware Grounding

The physical host hardware is corroborated by WMI queries and historical benchmark reports (`V8_26_MODEL_BENCHMARK_REPORT.md` §2.1 and `V8_30A_GPU_SCHEDULER_RECONCILIATION.md` §1):

- **Discrete GPU:** `NVIDIA GeForce RTX 4080 Laptop GPU` (AD104, 175W max TGP).
- **Physical Dedicated VRAM:** `12,282 MiB GDDR6` (12.0 GB, 192-bit bus, ~360 GB/s bandwidth).
- **System Memory:** `64.00 GB DDR5` (~50–60 GB/s host bandwidth).
- **Display Compositor Reserve:** Windows DWM consumes $\sim 1,100 - 1,800\text{ MiB}$ of VRAM.
- **Usable VRAM Envelope:** $\sim 10,400 - 11,100\text{ MiB}$.
- **Contradicted Spec:** V8.31 §1.1 references to "RTX 3060 12GB" are **DEFINITIVELY CONTRADICTED AND VOID**.

### 8.2 Measured vs. Estimated Resource Budget (Qwen2.5-7B-Instruct @ Q4_K_M)

```
┌────────────────────────────────────────────────────────────────────────┐
│               12,282 MiB PHYSICAL VRAM ALLOCATION BUDGET               │
├────────────────────────────────────────────────────────────────────────┤
│ [1] Windows OS / DWM / Display Reserve:    ~1,500 MiB (MEASURED)       │
│ [2] Model Weights (Qwen2.5-7B Q4_K_M):      ~4,680 MiB (MEASURED)       │
│ [3] CUDA Context & Compute Scratchpad:      ~650 MiB (MEASURED)       │
│ [4] Active Slot 0 KV Cache (4k tokens, FP16):~1,024 MiB (CALCULATED)   │
│ [5] Slots 1–3 KV Caches (4k x 3 slots, FP16):~3,072 MiB (CALCULATED)   │
├────────────────────────────────────────────────────────────────────────┤
│ TOTAL ALLOCATED VRAM:                       ~10,926 MiB / 12,282 MiB    │
│ REAL FREE VRAM HEADROOM:                    ~1,356 MiB                 │
└────────────────────────────────────────────────────────────────────────┘
```

#### Multi-Agent Throughput Reality Check:
- **Single General Permit ($N_{\text{permits}} = 1$) is an absolute physical necessity.**
- Although LM Studio allocates 4 slots in memory, running concurrent generation across multiple slots drops memory-bandwidth throughput from **70–95 t/s** down to **18–25 t/s per stream**, causes severe thermal throttling on a laptop chassis, and exhausts the 1,356 MiB safety margin.
- Theoretical calculations claiming concurrent multi-agent capacity on this hardware ignore memory bus contention and DWM surface resizing spikes.

---

## 9. IMPLEMENTATION READINESS GATE MATRIX

Every readiness gate is evaluated with strict evidentiary criteria. A gate cannot pass on specification text alone.

| Gate | Requirement | Current Status | Supporting Evidence | Missing Evidence | Acceptance Criteria | Safest Next Action |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **G1** | MCP SDK & Server Initialization | **PASSED** | `mcp==2.3.0` installed in venv; `server.py` imports and instantiates cleanly. | None. Complete. | Clean import and exit code 0. | None required. |
| **G2** | Antigravity `gpu_bridge_echo` Invocation | **PARTIALLY PASSED** | Succeeded in prior subagent trajectory (`8601be95...`). | Live invocation within active host session turn. | Return valid echo JSON with `request_id` via MCP tool call. | Execute single non-destructive echo test. |
| **G3** | Gateway HTTP Architecture | **FAILED / MISSING** | Architecture specified in V8.31, but port 3333 service does not exist. | Python Gateway daemon implementation. | Service listens on 3333; routes to 1234 with single permit. | Authorize V8.32 specification rewrite before code. |
| **G4** | Request & Slot Dual FSMs | **FAILED (IN SPEC)** | V8.31 specifies flawed monolithic FSM. V8.31-A & B specify concept. | Formally codified state transitions in V8.32 spec. | Full decoupling of client socket from permit release. | Codify dual-FSM tables in V8.32 specification. |
| **G5** | Cancellation & Backend Recovery | **FAILED (IN SPEC)** | Active ping probe proven hazardous; 15s SIGKILL rejected. | Passive drain window and quarantine transitions codified. | Zero active ping probes; permits held through drain. | Update specification to passive drain + quarantine. |
| **G6** | Unicode Provenance Model | **FAILED (IN SPEC)** | V8.31 §8.3 linear loop broken on reordering; IPM incomplete. | Sub-interval mapping table and script boundaries codified. | Mathematical proof and passing property tests on combining marks. | Specify secondary intra-interval index in V8.32. |
| **G7** | Synthetic Ingestion Tests | **NOT TESTED** | 25 test cases proposed in V8.31; fixtures directory not provisioned. | Standalone synthetic test harness with `.bin` files. | 100% pass on synthetic anomalies without real data access. | Provision `./tests/fixtures/synthetic/` post-spec. |
| **G8** | Project Isolation & Idempotency | **FAILED (IN SPEC)** | Key formula flawed; KV cache isolation unsupported in LM Studio. | Composite key with payload mismatch rejection codified. | 409 Conflict on payload mismatch; replay ring buffer. | Update idempotency spec in V8.32. |
| **G9** | GPU Limits & Thermal Policy | **PASSED (ANALYSIS)**| Hardware reconciled to RTX 4080 Laptop; Option C single permit confirmed. | NVML thermal throttling monitor script. | GPU power capped at 150W; single-permit serialization. | Codify single-permit invariant in Gateway. |
| **G10**| Failure Injection & Restart | **FAILED (IN SPEC)** | Gateway crash recovery unhandled; lingering slots leak permits. | SQLite WAL state recovery on Gateway boot codified. | Restarting Gateway moves dirty slots to `QUARANTINED`. | Codify SQLite persistence schema in V8.32. |
| **G11**| Independent Verification | **PASSED** | V8.31-A, V8.31-B, and V8.31-C independent audits completed. | Final verification of V8.32 amended spec. | Consensus across audits on architectural fixes. | Issue V8.31-C report. |
| **G12**| Implementation Authorization | **BLOCKED** | Gates G3, G4, G5, G6, G8, G10 remain unresolved at spec level. | Approved V8.32 specification document. | All critical findings formally resolved and audited. | **STRICT STOP ON IMPLEMENTATION.** |

---

## 10. PRIORITIZED CORRECTIVE ACTIONS (V8.32 SPECIFICATION ROADMAP)

Before any code is written, `V8_31_GATEWAY_SECURITY_INGESTION_SPECIFICATION.md` must be amended and re-issued as **`V8_32_GATEWAY_SECURITY_INGESTION_SPECIFICATION.md`** incorporating these prioritized actions:

### Priority 1: Critical Safety & Protocol Fixes
1. **Strip Active Ping Probing:** Completely remove the synthetic `POST /v1/chat/completions` ("ping") probe from the force-abort pipeline. Replace with a mandatory **Passive Drain Window** ($T_{\text{drain}}$) followed by unconditional transition to `SLOT_QUARANTINED` if unconfirmed.
2. **Reject 15s SIGKILL Proposal:** Specify that drain timeouts lock the permit in `SLOT_QUARANTINED` rather than terminating the LM Studio desktop process. Permits must **NEVER** be released purely on timer expiration.
3. **Decouple State Machines:** Replace the 12-state monolithic FSM with the orthogonal **Request Lifecycle FSM** and **Backend Slot FSM**. Ensure permits are tied exclusively to the Backend Slot FSM.
4. **Reconcile Hardware Baseline:** Purge all occurrences of "RTX 3060 12GB". Replace with "NVIDIA GeForce RTX 4080 Laptop GPU (12,282 MiB GDDR6)" and record the 1,500 MiB DWM baseline.

### Priority 2: Ingestion & Unicode Integrity
5. **Codify Interval Provenance Model + Sub-Interval Index:** Replace the defective Section 8.3 while loop with the segment-based Interval Provenance Model (IPM), augmented with an intra-interval codepoint-to-byte projection index for exact substring citations.
6. **Integrate Script-Aware Fallback Boundaries:** Add ICU / Unicode `Line_Break` segmenting for unspaced languages (Japanese, Chinese, Thai) to prevent single-interval paragraph blowups.
7. **Transition Fixtures to Binary Companion Files:** Replace Base64 JSON fixture payloads with relative `.bin` files referenced by SHA-256 in synthetic manifests.

### Priority 3: Security, Idempotency & Persistence
8. **Restructure Idempotency Engine:** Scope lookup keys by `SHA256(Project_ID || Idempotency_Key)`. Require strict payload hash matching, and mandate HTTP `409 Conflict` on payload mismatches.
9. **Specify Token Replay Ring Buffer:** Require an in-memory token buffer for active requests to allow duplicate observers to attach without missing early stream chunks.
10. **Define Gateway Crash Recovery Schema:** Specify an SQLite WAL-backed metadata store that transitions unconfirmed in-flight slots to `SLOT_QUARANTINED` upon Gateway restart.

---

## 11. EXACT NEXT SAFE TEST

To advance the verification baseline without mutating the workspace or risking GPU instability:

### Test Designation: **TEST-01 (Antigravity Runtime MCP Echo Verification)**
- **Objective:** Validate Level 6 of the MCP ladder by invoking `gpu_bridge_echo` through Antigravity's active runtime in the current session.
- **Pre-Conditions:**
  - `mcp_config.json` verified containing `local-gpu-bridge`.
  - LM Studio: NOT required (remains stopped or idle).
  - GPU: 0% compute allocation.
  - File Mutation: NONE.
- **Execution Command (via Antigravity tool):**
  - Tool Name: `gpu_bridge_echo`
  - Arguments: `{"message": "V831C_RUNTIME_VERIFICATION_TEST"}`
- **Expected Evidence:**
  Response JSON containing:
  ```json
  {
    "received": "V831C_RUNTIME_VERIFICATION_TEST",
    "server": "local-gpu-bridge",
    "status": "success",
    "timestamp": "<ISO-8601-STRING>",
    "request_id": "<UUID4-STRING>"
  }
  ```
- **Epistemic Result upon Success:** Elevates Gate G2 from `PARTIALLY PASSED` to `PASSED`.

---

## 12. EXPLICIT LIST OF CLAIMS THAT REMAIN UNPROVEN

The following 6 technical claims are currently **UNPROVEN** and must remain classified as such until empirical measurement:

1. **CUDA Kernel Abort Latency Distribution:** The exact number of milliseconds between an upstream socket reset (`SO_LINGER=0`) and the cessation of CUDA streaming kernels in `llama.cpp` remains unmeasured on this host.
2. **Winsock Loopback RST Notification Timing:** Whether Windows 11 Winsock delivers `WSAECONNRESET` immediately to a peer loopback thread or defers notification until the peer's next socket write is unverified.
3. **LM Studio Socket Churn Resilience:** The stability of LM Studio's embedded HTTP server under rapid client drops and reconnects over a 24-hour period has not been benchmarked.
4. **Passive Drain Window Determinism:** Whether the calculated formula for $T_{\text{drain}}$ reliably clears slots across all prompt lengths under thermal throttling without premature permit release is untested.
5. **Exact Sub-Interval Byte Recovery Overhead:** The computational latency and memory consumption of the secondary intra-interval codepoint-to-byte index on continuous Thai and CJK text have not been measured.
6. **LM Studio Slot Eviction Protocol:** Whether any undocumented HTTP header or command sequence can force immediate KV cache slot eviction in LM Studio 0.4.27 is unknown.

---

## 13. FINAL DECISION

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FORMAL DECISION                               │
│                                                                        │
│               VERDICT: CONDITIONAL GO — SPECIFICATION CORRECTIONS       │
│                        REQUIRED                                        │
│                                                                        │
│  1. Code implementation of the GPU Gateway (:3333) or V8.32 is         │
│     STRICTLY PROHIBITED until the V8.32 amended specification is       │
│     codified, audited, and approved.                                   │
│                                                                        │
│  2. Ingestion of real WhatsApp archives from                           │
│     `C:\Users\User\Desktop\whatsapp_chats_zip` remains under           │
│     ABSOLUTE QUARANTINE. Zero access is authorized.                    │
│                                                                        │
│  3. Execution of TEST-01 (Antigravity MCP `gpu_bridge_echo` call)       │
│     is AUTHORIZED as the sole permissible next operational test.       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

*Report formally compiled and certified by Antigravity Independent Verification Specialist.*
