# V8.32.3 — FINAL ARCHITECTURAL SPECIFICATION & BLOCKER RECONCILIATION

**Document Version:** 8.32.3  
**Phase:** V8.32 Final Architectural Reconciliation & Gate Closure  
**Classification:** AUTHORITATIVE TECHNICAL ARCHITECTURAL SPECIFICATION  
**Date:** 2026-10-30  
**Target Path:** `C:\Users\User\Desktop\agenc-ia\V8_32_3_FINAL_ARCHITECTURAL_SPECIFICATION.md`  
**Execution Boundary:** STRICT READ-ONLY SPECIFICATION (Zero Source Code Mutation, Zero Config Modification, Zero Package Installs, Zero GPU Inferences, Real WhatsApp Data Quarantined)

---

## 1. EXECUTIVE SUMMARY

V8.32.3 establishes the definitive, mathematically reconciled, and blocker-resolved architectural specification for the centralized **Local GPU Gateway Bridge**. It synthesizes the foundational work of `V8_32_GATEWAY_CORRECTED_IMPLEMENTATION_SPEC.md`, incorporates the corrections of `V8_32_1_CRITICAL_CORRECTIONS.md`, builds upon the dual-FSM topology of `V8_32_2_FINAL_ARCHITECTURAL_SPECIFICATION.md`, and comprehensively resolves all five architectural blockers (`AUD-G-01` through `AUD-G-05`) and three advisory findings (`AUD-G-06` through `AUD-G-08`) established in `V8_32_2_AGENT_G_INDEPENDENT_AUDIT.md`.

The primary mission of the Gateway is to provide a single, robust, out-of-process mediator daemon listening strictly on loopback address `127.0.0.1:3333`. This daemon acts as the authoritative admission controller, priority scheduler, request lifecycler, idempotency manager, observer fan-out coordinator, and data provenance boundary between client orchestration environments (such as Antigravity agents, Model Context Protocol bridges, and CLI workers) and the local Large Language Model runtime (LM Studio 0.4.27 running `llama.cpp` over an NVIDIA GeForce RTX 4080 Laptop GPU at `127.0.0.1:1234`).

### Core Resolutions in V8.32.3:

1. **Epistemic Decoupling of Hardware Idleness (Blocker 1 - `AUD-G-01`):**  
   Formally acknowledges that application-layer SSE `data: [DONE]\n\n`, socket EOF, TCP FIN/RST, HTTP 200, and heuristic settle buffers ($T_{\text{settle}} = 200\text{ms}, 500\text{ms}, 1000\text{ms}$) do not independently prove physical GPU core or CUDA stream idleness. Prohibits inventing unsupported LM Studio API endpoints or adaptive heuristics claiming hardware safety. Establishes a rigorous permit release policy where normal completion requires both clean SSE termination and connection completion, while any uncertain completion transitions fail-closed to `RESOURCE_QUARANTINED`.
2. **Defensive, Multi-Scenario Quarantine Recovery (Blocker 2 - `AUD-G-03`):**  
   Completely discards naive manual reset mechanisms that relied on GUI visual inspection, reachable ports, or blind REST endpoints. Specifies six distinct recovery scenarios with explicit initial states, available/unavailable evidence, operator actions, and programmatic preconditions. Enforces that `POST /v1/admin/reset-quarantine` requires cryptographically verified admin credentials, validated backend port state, and a mandatory post-reset stabilization period ($T_{\text{quiescent}} \ge 2.0\text{s}$) before releasing the single permit.
3. **Complete SQLite Layer 0 Raw Byte & Unicode Provenance Architecture (Blocker 3 - `AUD-G-05`):**  
   Replaces high-level claims with full SQLite schema DDL (`provenance_documents`, `provenance_intervals`, `provenance_metadata`). Implements an immutable dual-layer model mapping canonical normalized text back to original UTF-8 byte spans via UAX #29 Extended Grapheme Cluster (EGC) boundary outward snapping. Formalizes handling of UAX #15 Canonical Combining Class (CCC != 0) reordering, Hangul composition, continuous scripts (Thai/Lao), emoji ZWJ sequences, and malformed UTF-8. Defines 25 synthetic property-based test invariants.
4. **Bounded Asynchronous Fan-Out & Observer Isolation (Blocker 4 - `AUD-G-04`):**  
   Replaces the unbounded circular replay buffer with an independent, bounded asynchronous queue architecture (`asyncio.Queue(maxsize=64)`) per observer. Eliminates head-of-line blocking, memory leaks, and primary stream interference. Enforces that slow or dead observers are evicted with `HTTP 408 Request Timeout` or `HTTP 409 Conflict` (`REPLAY_STREAM_BUFFER_OVERFLOW`) without impacting the upstream generation loop.
5. **Realized Admission Control & Cooperative Ingress Security (Blocker 5 - `AUD-G-02`):**  
   Eliminates the false assumption that listening on port 3333 automatically blocks direct access to LM Studio on port 1234. Categorizes admission control on Windows 11 as **Cooperative Multi-Process Ingress**. Formally confirms that LM Studio 0.4.27 does not provide a secret API key or authentication mechanism. Establishes a rigorous, read-only Migration Audit Protocol in Phase 7 to identify and reroute all localhost clients.
6. **Mathematically Sound Priority Scheduler & Starvation Prevention (`AUD-G-06`):**  
   Evaluates four candidate scheduling models and implements a unified solution: recalibrates base weights and aging rate ($W_{\text{age}} = 100.0\text{ pts/s}$), extends queue wait timeout to $T_{\text{wait\_max}} = 60.0\text{s}$, and implements **Head-of-Queue Deadline Suspension** ($T_{\text{deadline\_freeze}}$) while the single permit is leased. Proves mathematically that P2 requests surpass fresh P0 requests within $20.0\text{s}$, providing a guaranteed $40.0\text{s}$ scheduling window.
7. **Advisory Reconciliation & Epistemic Rigor (`AUD-G-07`, `AUD-G-08`):**  
   Preserves the experimental status of prompt-level cache-prefix nonces under Qwen2.5 BPE tokenization (`AUD-G-07`). Affirms that single-user Windows 11 loopback security is strictly cooperative (`AUD-G-08`). Segregates physical measurements from predictions across all sections.
8. **Permanent WhatsApp Data Quarantine:**  
   Reaffirms the absolute, unconditional sealing of `C:\Users\User\Desktop\whatsapp_chats_zip`. All testing and verification remain strictly restricted to synthetic companion fixtures.

---

## 2. ARCHITECTURAL OBJECTIVES & SYSTEM TOPOLOGY

### 2.1 Primary Objectives
1. **Concurrency Enforcement:** Enforce Option C ($N_{\text{permits}} = 1$) globally across all Antigravity agents, MCP tools, and external scripts, guaranteeing that the local GPU never experiences concurrent prompt prefill or generation collisions.
2. **Fail-Closed Safety:** Guarantee that whenever backend compute or hardware state is uncertain, the Gateway transitions to `RESOURCE_QUARANTINED`, preserving system integrity and preventing silent GPU lockups.
3. **Data Provenance Fidelity:** Maintain byte-for-byte immutable records of all processed text, allowing exact character- and token-level citations to map back to original raw UTF-8 byte offsets despite Unicode normalization.
4. **Resilient Client Decoupling:** Decouple downstream client lifecycles (disconnects, timeouts, re-attaches) from backend execution slots via bounded buffers and passive drain routines.
5. **Deterministic Operational Observability:** Maintain a cryptographically and structurally verifiable audit ledger of all leases, transitions, and hardware telemetry without logging sensitive plaintexts.

### 2.2 System Topology Diagram

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                               HOST ENVIRONMENT (Windows 11)                               |
+───────────────────────────────────────────────────────────────────────────────────────────+
│                                                                                           │
│  +─────────────────────────+     +─────────────────────────+     +─────────────────────+  │
│  │   Antigravity Agent A   │     │   Antigravity Agent B   │     │ Third-Party Tool /  │  │
│  │  (Getxo Vela Project)   │     │  (Other Project Repo)   │     │    Future Worker    │  │
│  +────────────┬────────────+     +────────────┬────────────+     +──────────┬──────────+  │
│               │                               │                             │             │
│               ▼                               ▼                             │             │
│  +─────────────────────────+     +─────────────────────────+                │             │
│  │ Local MCP Bridge Proc A │     │ Local MCP Bridge Proc B │                │             │
│  │  (stdio JSON-RPC 2.0)   │     │  (stdio JSON-RPC 2.0)   │                │             │
│  +────────────┬────────────+     +────────────┬────────────+                │             │
│               │                               │                             │             │
│               │   HTTP / JSON (Bearer Token)  │                             │             │
│               │   X-Project-ID / X-Priority   │                             │             │
│               └───────────────┬───────────────┴─────────────────────────────┘             │
│                               │                                                           │
│                               ▼                                                           │
│       ====================================================================                │
│       COOPERATIVE LOOPBACK BOUNDARY: RESTRICTED LOOPBACK (127.0.0.1:3333)                 │
│       ====================================================================                │
│       +──────────────────────────────────────────────────────────────────+                │
│       │                 CENTRAL GPU GATEWAY DAEMON                       │                │
│       │                                                                  │                │
│       │  [Admission Controller]         [Priority Min-Heap Scheduler]    │                │
│       │  [Decoupled Dual-FSM Manager]   [Bounded Async Fan-Out Queues]   │                │
│       │  [Layer 0 Raw Byte SQLite DB]   [UAX #29 EGC Provenance Engine]  │                │
│       │  [Passive Drain Supervisor]     [Persistent HTTP Connection Pool]│                │
│       │  [Safe Quarantine Controller]   [Structured Audit Ledger]        │                │
│       +────────────────────────────────┬─────────────────────────────────+                │
│                                        │                                                  │
│                                        │ Streaming HTTP / SSE                             │
│                                        │ Persistent Keep-Alive Connection                 │
│                                        ▼                                                  │
│       ====================================================================                │
│       UNPROTECTED LOCAL ENGINE BOUNDARY (127.0.0.1:1234)                                  │
│       ====================================================================                │
│       +──────────────────────────────────────────────────────────────────+                │
│       │                LM STUDIO 0.4.27 (llama.cpp Engine)               │                │
│       │                                                                  │                │
│       │  - Model: Qwen2.5-7B-Instruct-Q4_K_M (4,935 MiB)                 │                │
│       │  - Backend Geometry: n_slots = 4, Unified KV Cache               │                │
│       │  - Listening on: 127.0.0.1:1234 (Zero native auth support)       │                │
│       │  - Physical Hardware: NVIDIA RTX 4080 Laptop GPU (12,282 MiB)    │                │
│       +──────────────────────────────────────────────────────────────────+                │
+───────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3. EVIDENCE AND EPISTEMIC CLASSIFICATIONS

Every technical parameter, observation, assertion, and operational decision in this specification is categorized under strict epistemic criteria:

- **`[VERIFIED]`**: Directly corroborated by live environment query, OS WMI inspection, file system validation, or runtime logs on this host.
- **`[MATHEMATICALLY_DERIVED]`**: Calculated via deterministic mathematical formulas from verified hardware parameters.
- **`[TECHNICALLY_SUPPORTED_BUT_UNTESTED]`**: Supported by engine source code or official protocol specifications, but unmeasured by live instrumented benchmarks on this host.
- **`[ESTIMATED]`**: Derived from engineering heuristics or driver convention; subject to runtime variation.
- **`[UNTESTED_PREDICTION]`**: Theoretical projection of performance under load; requires empirical validation.
- **`[UNSUPPORTED]`**: Asserted without empirical evidence, log data, or mathematical derivation.
- **`[UNKNOWN]`**: Indeterminate without executing live, instrumented tests.
- **`[CONTRADICTED]`**: Explicitly refuted by physical hardware queries, API contracts, or system architecture.

### Authoritative Evidence Ledger:

| Evidence ID | Technical Subject / Claim | Epistemic Verdict | Empirical Grounds & Technical Basis |
| :--- | :--- | :---: | :--- |
| **EV-01** | Python MCP SDK version `2.3.0` installed in `v825-gpu-bridge\.venv` | **VERIFIED** | Official LF Projects wheel verified on disk; clean import of `MCPServer`. |
| **EV-02** | `local-gpu-bridge` registered in active `mcp_config.json` | **VERIFIED** | Lines 34–39 of `C:\Users\User\.gemini\config\mcp_config.json` map to `.venv` and `server.py`. |
| **EV-03** | `gpu_bridge_echo` executes cleanly via native stdio MCP | **VERIFIED** | Validated in subagent trajectory `8601be95-3bd1-42a6-9236-711984190b09`. Pure in-memory tool. |
| **EV-04** | Physical GPU is NVIDIA GeForce RTX 4080 Laptop GPU (12,282 MiB GDDR6) | **VERIFIED** | Confirmed by live OS WMI query and LM Studio host log line 475. RTX 3060 claims refuted. |
| **EV-05** | Windows DWM / OS display commitment is ~1,870–1,915 MiB | **VERIFIED** | Observed in LM Studio host log (`Used: 1.87 GB, Free: 11.01 GB, Total: 12.88 GB`). |
| **EV-06** | Active inference ping probe triggers backend collision | **VERIFIED** | LM Studio initializes with `n_slots = 4`. A ping probe routes to an idle slot in $<50\text{ms}$ while the aborted slot is still decoding. |
| **EV-07** | `GET /v1/models` 200 OK proves backend slot is idle | **CONTRADICTED** | REST dispatcher thread returns static memory struct in $<1\text{ms}$ while CUDA compute threads remain pinned at 100%. |
| **EV-08** | LM Studio exposes `GET /slots` on port 1234 | **CONTRADICTED** | Raw upstream `llama-server` supports `/slots`, but LM Studio's reverse proxy does not route `/slots` to clients. |
| **EV-09** | Upstream TCP EOF/RST proves CUDA computation has stopped | **CONTRADICTED** | Winsock socket teardown informs only the host socket layer; asynchronous CUDA kernels continue decoding until the next token flush/poll. |
| **EV-10** | Process SIGKILL of `LM Studio.exe` is safe on Windows 11 | **CONTRADICTED** | Monolithic desktop GUI app; killing it orphans WDDM VRAM allocations and causes file sharing violations. |
| **EV-11** | Character-by-character linear loop desynchronizes on combining marks | **VERIFIED** | UAX #15 Canonical Combining Class (CCC) reordering swaps codepoints, causing runaway loop desync and offset corruption. |
| **EV-12** | `--no-mmap` isolates multi-tenant KV caches | **CONTRADICTED** | `--no-mmap` controls file-backed memory mapping of model weights from disk to RAM; zero relationship to dynamic VRAM KV cache tensors. |
| **EV-13** | Bearer tokens provide hard cryptographic isolation on localhost | **CONTRADICTED** | Any process running under the same Windows 11 user session can read memory via Win32 `ReadProcessMemory` or snoop loopback traffic. |
| **EV-14** | Exact Qwen2.5-7B FP16 KV cache footprint is 56.0 KiB/token | **MATHEMATICALLY_DERIVED** | GQA architecture ($N_L = 28$, $n_{kv} = 4$, $d_h = 128$, FP16): $2 \times 4 \times 128 \times 28 \times 2 = 57,344\text{ bytes} = 56.0\text{ KiB}$. |
| **EV-15** | Central GPU Gateway on port 3333 currently exists | **CONTRADICTED** | Port 3333 is not listening. Current `server.py` directly connects to `127.0.0.1:1234`. |
| **EV-16** | Gateway can address and manage individual LM Studio slots | **CONTRADICTED** | LM Studio OpenAI API does not accept slot parameters; internal slot allocation is strictly encapsulated in C++. |
| **EV-17** | Token 0 nonce purges KV cache memory from VRAM | **CONTRADICTED** | Changing token 0 prevents prefix tree sharing; it does not zero or purge unallocated or trailing KV memory blocks. |
| **EV-18** | Monotonic codepoint-to-byte index holds across NFC CCC reordering | **CONTRADICTED** | Sorting combining marks non-monotonically scrambles raw byte offset sequences ($3 \not\le 1$). |
| **EV-19** | SSE `[DONE]` marker proves physical CUDA core idleness | **TECHNICALLY_SUPPORTED_BUT_UNTESTED** | `llama.cpp` emits `[DONE]` upon finishing sequence generation, but trailing async CUDA stream sync and slot cleanup timing on this chassis are unmeasured. |
| **EV-20** | Sustained inference throughput of 70–95 tokens/second | **UNTESTED_PREDICTION** | Theoretical projection based on memory bandwidth; unverified by live instrumentation. |
| **EV-21** | Total committed VRAM under 16k context is 8,351 MiB | **ESTIMATED** | Sum of measured OS (1,870) + Model (4,935) + calculated KV (896) + heuristic CUDA scratchpad (650). |
| **EV-22** | $T_{\text{settle}} = 200\text{ms}$ proves physical GPU idleness | **CONTRADICTED** | Arbitrary wall-clock delay. WDDM command buffer drainage and cuBLAS completion are unobservable via loopback sleep. |
| **EV-23** | LM Studio 0.4.27 supports incoming API key authentication | **CONTRADICTED** | Official documentation and CLI inspect confirm local server accepts open loopback connections without authentication flags. |

---

## 4. SIX-STATE CANONICAL BACKEND RESOURCE FSM

The Backend Resource FSM governs the availability of the single logical GPU execution permit ($N_{\text{permits}} = 1$) across **exactly six canonical states**. Phantom states (such as `SLOT_RESETTING` or `RESOURCE_RECOVERING`) are permanently eliminated.

```
       ┌────────────────────────────────────────────────────────┐
       │                                                        │
       ▼                                                        │ (Verified Operator Manual Reset)
[RESOURCE_IDLE] ◄──(Natural Backend `[DONE]`)──┐                │
       │                                       │                │
(Permit Acquired)                              │                │
       ▼                                       │                │
[RESOURCE_RESERVED]                            │                │
       │ (TCP Connected & Headers Flushed)     │                │
       ▼                                       │                │
[RESOURCE_ACTIVE] ──(Natural `[DONE]`)─────────┘                │
       │                                                        │
       │ (Trigger: REQ_CLIENT_ABORTED or Execution Timeout)     │
       ▼                                                        │
[RESOURCE_DRAINING]                                             │
       │                                                        │
       ├─── (Stream receives natural `[DONE]` within T_drain) ──┘ (Permit Released Safely)
       │
       └─── (Socket closed, RST, error, or T_drain > 15.0s)
               ▼
       [RESOURCE_QUARANTINED] (Permit LOCKED; Rejects Admissions)
               │
               │ (Gateway Diagnostic Isolation - Zero Active Probes)
               ▼
       [RESOURCE_FATAL_HALT] (Permit PERMANENTLY LOCKED; Requires Operator Action)
```

### 4.1 Canonical State Definitions

1. **`RESOURCE_IDLE`**:  
   The backend is verified ready for inference. Exactly one logical permit resides in the permit pool. New requests may be scheduled from the min-heap.
2. **`RESOURCE_RESERVED`**:  
   A queued request has acquired the logical permit. The Gateway is actively establishing the upstream TCP/HTTP connection to `127.0.0.1:1234` and transmitting request headers. The permit is locked.
3. **`RESOURCE_ACTIVE`**:  
   The upstream connection is established, request body is flushed, and the Gateway is actively receiving streaming Server-Sent Events (SSE) chunks from LM Studio. The permit is locked.
4. **`RESOURCE_DRAINING`**:  
   The downstream client disconnected prematurely, or the request exceeded its execution timeout ($T_{\text{exec}} = 60.0\text{s}$). The Gateway maintains the upstream socket connection and passively consumes incoming SSE chunks for up to $T_{\text{drain}} = 15.0\text{s}$ awaiting a natural `[DONE]` marker. The permit is locked.
5. **`RESOURCE_QUARANTINED`**:  
   The backend entered an uncertain compute state due to upstream socket teardown (FIN/RST), transport errors, HTTP 5xx responses, or drain timeout expiration. The logical permit is **LOCKED**. Admissions return `503 Service Unavailable`.
6. **`RESOURCE_FATAL_HALT`**:  
   A catastrophic hardware, driver, or unrecoverable software condition occurred (e.g. repeated crash, driver TDR, SQLite write failure, or operator freeze signal). The permit is **PERMANENTLY LOCKED**. Requires manual supervisory intervention and host restart.

### 4.2 Comprehensive State Transition Matrix

| From State | Event / Trigger Condition | To State | Permit Action | Rationale & Safety Justification |
| :--- | :--- | :--- | :---: | :--- |
| `RESOURCE_IDLE` | Scheduler dispatches head-of-queue request | `RESOURCE_RESERVED` | **Acquired** | Permit transferred from pool to active lease. Concurrency invariant maintained ($\sum \text{Permits} = 1$). |
| `RESOURCE_RESERVED` | TCP connect succeeds, HTTP headers flushed | `RESOURCE_ACTIVE` | **Retained** | Upstream request successfully initiated. |
| `RESOURCE_RESERVED` | TCP connection refused (`ECONNREFUSED`), timeout | `RESOURCE_QUARANTINED` | **Retained (Locked)** | Backend failed to accept connection. Engine state uncertain. |
| `RESOURCE_ACTIVE` | Natural `[DONE]` received + clean HTTP stream close | `RESOURCE_IDLE` | **Released** | Slot inference finished; slot context cleaned up by `llama.cpp`. |
| `RESOURCE_ACTIVE` | Downstream client disconnects (`ClientDisconnect`) | `RESOURCE_DRAINING` | **Retained** | Passive drain initiated; upstream socket kept open to observe completion. |
| `RESOURCE_ACTIVE` | Execution timer expires ($T_{\text{exec}} > 60.0\text{s}$) | `RESOURCE_DRAINING` | **Retained** | Passive drain initiated to allow in-flight generation to terminate cleanly. |
| `RESOURCE_ACTIVE` | Upstream socket drops (TCP FIN / RST / EOF) | `RESOURCE_QUARANTINED` | **Retained (Locked)** | Abrupt socket closure. Compute state unverified (**EV-09**). |
| `RESOURCE_ACTIVE` | Upstream returns HTTP 5xx or malformed chunk | `RESOURCE_QUARANTINED` | **Retained (Locked)** | Internal engine failure. Memory/compute state untrusted. |
| `RESOURCE_DRAINING` | Natural `[DONE]` received within $T_{\text{drain}} \le 15.0\text{s}$ | `RESOURCE_IDLE` | **Released** | Backend completed generation within drain envelope. |
| `RESOURCE_DRAINING` | Drain timer expires ($T_{\text{drain}} > 15.0\text{s}$) | `RESOURCE_QUARANTINED` | **Retained (Locked)** | Generation failed to conclude. Engine slot may be spinning. |
| `RESOURCE_DRAINING` | Upstream socket drops (TCP FIN / RST / EOF) | `RESOURCE_QUARANTINED` | **Retained (Locked)** | Socket drop during drain provides zero proof of compute cessation. |
| `RESOURCE_QUARANTINED`| Verified Operator Manual Recovery Protocol | `RESOURCE_IDLE` | **Released** | Operator verified host state and executed authenticated reset. |
| `RESOURCE_QUARANTINED`| Persistent unreachability / Driver TDR crash | `RESOURCE_FATAL_HALT` | **Retained (Locked)** | Unrecoverable backend corruption detected. System halted. |
| `RESOURCE_FATAL_HALT` | Full process recovery, driver reset, operator unlock| `RESOURCE_IDLE` | **Released** | Host and engine certified clean; supervisory restart complete. |

### 4.3 Strictly Forbidden State Transitions

The Gateway daemon must enforce that the following transitions are architecturally impossible:
1. `RESOURCE_DRAINING -> RESOURCE_IDLE` via TCP FIN / EOF / RST.
2. `RESOURCE_ACTIVE -> RESOURCE_IDLE` via downstream client disconnect.
3. `RESOURCE_QUARANTINED -> RESOURCE_IDLE` via automatic timer, ping probe, or `GET /v1/models` 200 OK.
4. `RESOURCE_RESERVED -> RESOURCE_IDLE` without either verified stream completion or authenticated manual reset.
5. Direct transition from `RESOURCE_IDLE` to `RESOURCE_ACTIVE` bypassing `RESOURCE_RESERVED`.

---

## 5. GATEWAY REQUEST LIFECYCLE FSM

The Downstream Request Lifecycle FSM governs incoming client connections over `127.0.0.1:3333` across **10 deterministic states**. It is completely decoupled from the Backend Resource FSM:

```
  [REQ_RECEIVED] ──(Validation / Queue Full)──► [REQ_REJECTED (4xx/503)]
        │
  (Admitted to Queue)
        ▼
   [REQ_QUEUED] ──(Queue Wait > 60.0s)────────► [REQ_TIMED_OUT (504)]
        │       ──(Client Drops Socket)───────► [REQ_CANCELLED]
  (Logical Permit Acquired)
        ▼
 [REQ_PROCESSING] ──(Client Drops Socket)─────► [REQ_CLIENT_ABORTED] ──► (Signal Upstream Drain)
        │         ──(Backend Connect Error)───► [REQ_FAILED (502)]
  (First Valid SSE Token)
        ▼
  [REQ_STREAMING] ──(Client Drops Socket)─────► [REQ_CLIENT_ABORTED] ──► (Signal Upstream Drain)
        │         ──(Backend Stream Error)────► [REQ_FAILED]
  (Natural End Token `[DONE]`)
        ▼
  [REQ_COMPLETED] (200 OK Clean Close)
```

### 5.1 Request FSM Invariants
1. **Immediate Dequeue on Client Drop:** If a client disconnects while in `REQ_QUEUED`, the request transitions immediately to `REQ_CANCELLED` and is evicted from the heap with zero backend resource consumption.
2. **Asynchronous Drain Notification:** If a client disconnects while in `REQ_PROCESSING` or `REQ_STREAMING`, the request transitions to `REQ_CLIENT_ABORTED`. The Gateway terminates the downstream connection and notifies the Backend Resource FSM to enter `RESOURCE_DRAINING`.
3. **Decoupled Termination:** Downstream request termination never directly mutates or unlocks backend permits. Only the Backend Resource FSM can transition permits to `RESOURCE_IDLE` or `RESOURCE_QUARANTINED`.

---

## 6. GPU COMPLETION AND PERMIT RELEASE POLICY (RESOLVING BLOCKER 1 / AUD-G-01)

### 6.1 The Epistemic Boundary of GPU Idleness
In V8.32.2, §7.3 asserted that receipt of `[DONE]` followed by a $200\text{ms}$ settle delay ($T_{\text{settle}} = 200\text{ms}$) allowed releasing the permit to `RESOURCE_IDLE`. Agent G identified this as a critical vulnerability (`AUD-G-01`), as it conflates an application-layer SSE text token with physical hardware idleness.

To establish complete architectural rigor, V8.32.3 explicitly delineates eight distinct completion and release layers:

```
[1. Client Request Completion]           <-- Downstream client finishes reading SSE stream.
                 │
[2. Gateway Client Disconnect]           <-- Client TCP socket closes or disconnects.
                 │
[3. Upstream HTTP Stream Termination]    <-- Gateway HTTP client receives final chunk and EOF.
                 │
[4. SSE Generation Completion]           <-- Upstream emits literal "data: [DONE]\n\n" marker.
                 │
[5. llama.cpp Slot Cleanup]              <-- C++ worker marks slot available & frees context.
                 │
[6. CUDA Execution Completion]           <-- Async CUDA streams finish executing trailing kernels.
                 │
[7. Backend Resource Availability]       <-- LM Studio is physically capable of new prefill.
                 │
[8. Gateway Permit Availability]         <-- Gateway permits next queued request to acquire lease.
```

### 6.2 Authoritative Epistemic Truths Regarding Hardware Completion
1. **Unverified Operational Heuristic:** The parameter $T_{\text{settle}} = 200\text{ms}$ is an **unverified operational heuristic**. Increasing it to $500\text{ms}$ or $1000\text{ms}$ does **not** establish physical GPU idleness.
2. **Non-Equivalence of Transport Signals:** Socket EOF, TCP FIN, TCP RST, HTTP 200 OK, and SSE `[DONE]` are fundamentally different transport events and are **never** interchangeable evidence of hardware state.
3. **No Unsupported API Invention:** The Gateway cannot query internal slot states because LM Studio 0.4.27 does not provide a `/slots` endpoint (**EV-08**), nor does it provide a CUDA stream synchronization endpoint.
4. **No Adaptive Settle Algorithm:** The Gateway will not invent an adaptive settle algorithm that claims hardware safety based on unmeasured loopback heuristics.

### 6.3 Conservative Permit Release Specification

The transition of the Backend Resource FSM from `RESOURCE_DRAINING -> RESOURCE_IDLE` or from `RESOURCE_ACTIVE -> RESOURCE_IDLE` is governed by the following deterministic rules:

$$\text{Transition to } \texttt{RESOURCE\_IDLE} \iff (\text{SSE} \equiv \texttt{data: [DONE]\textbackslash n\textbackslash n}) \land (\text{HTTP Stream EOF Clean}) \land (\Delta t_{\text{settle}} \ge T_{\text{settle\_min}})$$

Where:
- $T_{\text{settle\_min}} = 200\text{ms}$ is an operational buffer to allow user-space socket cleanup.
- **Normal Completion:** If both the `[DONE]` marker and clean HTTP EOF are received within the active execution window ($T_{\text{exec}} \le 60.0\text{s}$) or drain window ($T_{\text{drain}} \le 15.0\text{s}$), the permit transitions to `RESOURCE_IDLE`. This represents the *standard operational contract* of the upstream `llama-server`.
- **Uncertain Completion (Fail-Closed Quarantine):** If the upstream connection drops (TCP EOF, FIN, RST, or socket error) *before* `[DONE]` is received, or if $T_{\text{drain}}$ expires without `[DONE]`, physical GPU idleness **cannot be established**. The Gateway must transition unconditionally to `RESOURCE_QUARANTINED`.
- **Permit Lock:** The permit remains **permanently locked** in `RESOURCE_QUARANTINED` until the Quarantine Recovery Protocol (Section 8) is executed.

---

## 7. CANCELLATION AND DRAIN SEMANTICS

When a client cancels an in-flight request, or when a request times out, the Gateway must isolate the backend from abrupt socket teardown:

### 7.1 Passive Drain Sequence
1. **Downstream Termination:** Gateway immediately closes the downstream client socket and marks the Request FSM as `REQ_CLIENT_ABORTED`.
2. **Backend FSM State Change:** The Backend Resource FSM transitions immediately from `RESOURCE_ACTIVE` to `RESOURCE_DRAINING`.
3. **Upstream Socket Preservation:** The Gateway **MUST NOT** close or reset the upstream HTTP connection to LM Studio. Abruptly resetting the socket (`SO_LINGER=0`) does not interrupt in-flight CUDA prompt prefill kernels and risks corrupting LM Studio's internal C++ state (**EV-09**).
4. **Passive SSE Consumption:** A background task continues reading the upstream SSE stream into a discarded buffer.
5. **Drain Outcome:**
   - **Case A (Natural Completion):** The stream receives `data: [DONE]\n\n` within $T_{\text{drain}} = 15.0\text{s}$. The backend slot has naturally concluded. The Gateway logs the drain completion and transitions to `RESOURCE_IDLE`.
   - **Case B (Drain Timeout or Socket Drop):** If $15.0\text{s}$ elapses without `[DONE]`, or if the upstream socket closes prematurely, the Gateway transitions immediately to `RESOURCE_QUARANTINED`.

---

## 8. QUARANTINE AND MULTI-SCENARIO RECOVERY (RESOLVING BLOCKER 2 / AUD-G-03)

### 8.1 The Fallacy of Naive Recovery
Agent G finding `AUD-G-03` proved that prior recovery proposals relied on operator visual checks of the LM Studio GUI, port 1234 reachability, or a blind `POST /v1/admin/reset-quarantine` call. None of these prove physical GPU idleness. A frozen CUDA driver or an aborted slot prefill will leave the GUI responsive while future CUDA allocations fail catastrophically (**EV-06**, **EV-07**).

### 8.2 Mandatory Recovery Rule
A responsive GUI, reachable port, successful HTTP response, changed PID, or elapsed delay **MUST NOT** independently authorize transition to `RESOURCE_IDLE`.

### 8.3 Multi-Scenario Recovery Matrix

The Gateway implements six distinct operational recovery scenarios:

| Scenario | Trigger / Root Cause | Initial FSM State | Evidence Available | Evidence Unavailable | Required Operator Actions | Permit Status | Recovery Condition to `RESOURCE_IDLE` | Escalate to `FATAL_HALT` Condition |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **A: Gateway Restarted** | Gateway crashed/rebooted while lease was active. | `RESOURCE_QUARANTINED` | Database lease record; LM Studio PID on port 1234. | Whether LM Studio finished inference or is still decoding. | Inspect LM Studio GUI; if busy, await completion; if hung, reload model. | Locked | Admin reset with `{"confirm_backend_restarted": false}` + backend port 1234 open + $T_{\text{quiescent}} \ge 2.0\text{s}$. | Port 1234 unreachable after 60s or repeated crashes. |
| **B: Upstream TCP Dropped** | LM Studio closed socket prematurely (FIN/RST). | `RESOURCE_QUARANTINED` | Socket error code (`WSAECONNRESET`); Gateway error log. | CUDA kernel execution state; C++ slot memory state. | Operator checks LM Studio log; ejects model via GUI to flush VRAM; reloads model. | Locked | Admin reset requiring `{"confirm_backend_restarted": true}` indicating model reload + $T_{\text{quiescent}} \ge 2.0\text{s}$. | Model fails to reload or CUDA out-of-memory error. |
| **C: LM Studio Terminated** | LM Studio process closed or killed by user/OS. | `RESOURCE_QUARANTINED` | Port 1234 closed (`ECONNREFUSED`); PID terminated. | Residual WDDM driver memory state. | Operator relaunches LM Studio GUI and reloads Qwen2.5-7B. | Locked | Port 1234 accepting connections + new backend PID confirmed + Admin reset + $T_{\text{quiescent}} \ge 2.0\text{s}$. | Port 1234 remains closed; OS displays driver crash. |
| **D: LM Studio Restarted** | LM Studio restarted cleanly after crash/eject. | `RESOURCE_QUARANTINED` | New PID listening on 1234; fresh runtime log. | GPU memory fragmentation state. | Operator verifies clean model load in LM Studio log. | Locked | Admin reset with confirmed new PID + $T_{\text{quiescent}} \ge 2.0\text{s}$. | New PID crashes upon first test request. |
| **E: Driver/CUDA Failure** | NVIDIA driver TDR or `CUDA_ERROR_UNKNOWN`. | `RESOURCE_QUARANTINED` | Windows System Event Log (Event ID 4101); CUDA code 999. | Driver recovery progress; VRAM allocation validity. | Full reboot of Windows 11 host or clean restart of display driver. | Locked | Complete host reboot + Gateway restart + clean model reload. | System freezes, bluescreens, or fails POST. |
| **F: Lease DB Recovery** | Boot reconciliation finds unresolved active lease. | `RESOURCE_QUARANTINED` | SQLite WAL state; previous request ID and timestamp. | Entire backend state from previous session. | Operator reviews unresolved request ID; verifies LM Studio state. | Locked | Admin reset endpoint executed with explicit reconciliation token + $T_{\text{quiescent}} \ge 2.0\text{s}$. | Corrupted SQLite database (`PRAGMA integrity_check` fails). |

### 8.4 Programmatic Quarantine Reset Endpoint Specification

The administrative reset endpoint `POST /v1/admin/reset-quarantine` must enforce the following sequence:

```python
# Programmatic Validation Sequence in Gateway Daemon
async def handle_reset_quarantine(request: Request) -> Response:
    # 1. Authenticate Request
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not hmac.compare_digest(token, GATEWAY_ADMIN_TOKEN):
        return JSONResponse(status_code=401, content={"error": "UNAUTHORIZED"})
    
    body = await request.json()
    confirm_backend_restarted = body.get("confirm_backend_restarted", False)
    
    # 2. Verify Upstream Port Reachability (Non-Inference TCP Handshake)
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection("127.0.0.1", 1234), timeout=1.0
        )
        writer.close()
        await writer.wait_closed()
    except Exception as e:
        return JSONResponse(
            status_code=503, 
            content={"error": "BACKEND_PORT_UNREACHABLE", "detail": str(e)}
        )
    
    # 3. Check Current PID vs Recorded PID
    current_pid = get_listening_pid_on_port(1234)
    recorded_pid = get_recorded_backend_pid()
    
    # If socket drop occurred previously, backend MUST have restarted
    if last_quarantine_reason == "UPSTREAM_SOCKET_DROP" and not confirm_backend_restarted:
        if current_pid == recorded_pid:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "RESTART_CONFIRMATION_REQUIRED",
                    "message": "Backend PID has not changed. Reload model or restart LM Studio."
                }
            )
            
    # 4. Enforce Quiescent Stabilization Period
    await asyncio.sleep(2.0)  # T_quiescent >= 2.0s
    
    # 5. Atomically Restore Permit in SQLite
    update_ledger_to_idle(new_pid=current_pid)
    return JSONResponse(status_code=200, content={"status": "RESOURCE_IDLE", "pid": current_pid})
```

---

## 9. LM STUDIO OBSERVABILITY LIMITATIONS

The Gateway operates under strictly documented boundaries regarding what can and cannot be observed from LM Studio 0.4.27:

1. **No Slot API:** LM Studio does not expose the raw `llama-server` `GET /slots` endpoint (**EV-08**). Any tracking of slot indices (0..3) is strictly internal to `llama.cpp`.
2. **No Slot Header:** The OpenAI chat completions API does not accept slot binding parameters (**EV-16**).
3. **Decoupled HTTP Listener:** `GET /v1/models` returns static metadata in $<1\text{ms}$ even when CUDA cores are saturated at 100% (**EV-07**).
4. **Active Probe Hazard:** Issuing synthetic ping prompts routes to idle secondary slots, creating a false-positive health signal while slot 0 is decoding (**EV-06**). Active probing is permanently forbidden.
5. **PID Resolution:** LM Studio is an Electron application comprising multiple child processes. The `backend_pid` recorded by the Gateway must strictly be the PID of the specific listening process on port `1234` (resolved via Win32 `GetExtendedTcpTable`), not the parent Electron UI wrapper.

---

## 10. TENANT SCOPING AND WINDOWS HOST SECURITY

### 10.1 Cooperative Localhost Security Model
On a single-user Windows 11 machine, hard multi-tenant cryptographic isolation is an impossibility (**EV-13**, `AUD-G-08`):
- Any process running in the same user session can attach debuggers, call `ReadProcessMemory`, inspect loopback sockets, or open SQLite databases.
- Bearer tokens passed in `Authorization: Bearer <Token>` are **cooperative project namespace tags**, designed to prevent accidental cross-project collision and provide access scoping. They are not enterprise-grade multi-tenant boundaries.

### 10.2 Experimental Prompt-Level Cache-Prefix Nonce
The project isolation prefix:
$$\text{Prefix} = \texttt{"<\|project\_isolation\_id: \{Project\_ID\}\_\{HexDigest32\}\|>\textbackslash n"}$$
is strictly classified as an **Experimental Prompt-Level Cache-Prefix Mitigation**.

**Architectural Facts (`AUD-G-07`):**
1. **Divergence at Token $K$:** Radix prefix cache trees in `llama.cpp` match tokens sequentially. Because the prefix starts with the literal `<|project_isolation_id: `, the first several BPE tokens are identical across all projects. Divergence occurs at token $K$ (the start of the unique project ID).
2. **Tokenizer Splitting:** Under Qwen2.5 BPE tokenization, custom delimiters `<|...|>` may not exist in the vocabulary and may be split into separate text tokens (`<`, `|`, `project`, etc.). This adds a fixed token overhead (estimated at 15–25 tokens) per request.
3. **No VRAM Erasure:** Changing the prefix prevents cache-tree matching; it does not zero physical VRAM buffers. Residual tensors remain in GDDR6 until overwritten.

---

## 11. UNICODE PROVENANCE ARCHITECTURE (RESOLVING BLOCKER 3 / AUD-G-05)

### 11.1 Mathematical Refutation of Codepoint-Level Monotonicity
V8.32 proposed a codepoint-to-byte index mapping $\mathbf{M}_k[i] \le \mathbf{M}_k[i+1]$. As proven by Agent D and confirmed by Agent G, **this assumption is mathematically invalid** under UAX #15 Canonical Combining Class (CCC != 0) reordering.

**Formal Proof:**
- Consider a base character $C$ at byte offset 0.
- Combining mark $M_1$ with $\text{CCC} = 230$ occupies bytes 1..2.
- Combining mark $M_2$ with $\text{CCC} = 220$ occupies bytes 3..4.
- Original raw UTF-8 byte stream: $[C, M_1, M_2]$ (5 bytes).
- Unicode NFC normalization sorts non-zero combining marks in ascending CCC order.
- Normalized codepoint sequence: $C + M_2 + M_1$.
- Canonical codepoint indices: $c_0 = C$, $c_1 = M_2$, $c_2 = M_1$.
- Mapping back to raw source byte offsets yields:
  $$\mathbf{M}_k[0] = 0, \quad \mathbf{M}_k[1] = 3, \quad \mathbf{M}_k[2] = 1$$
Because $\mathbf{M}_k[1] = 3$ and $\mathbf{M}_k[2] = 1$, the assertion $3 \le 1$ is **FALSE**. Monotonicity fails.

### 11.2 Corrected Extended Grapheme Cluster (EGC) Snapping Model
Monotonicity holds strictly at the **Extended Grapheme Cluster (UAX #29)** boundary:

$$\mathbf{G}_k[g].\text{raw\_byte\_start} \le \mathbf{G}_k[g+1].\text{raw\_byte\_start}$$

#### Invariants of the EGC Provenance Engine:
1. **Layer 0 Raw Byte Immutability:** Raw input bytes are stored immutably in SQLite as raw BLOBs without decoding or transformation.
2. **Interval Partitioning:** Raw text is partitioned into intervals $I_k$ bounded by UTF-8 lead bytes, $\text{CCC} = 0$ codepoints, and structural whitespace/punctuation.
3. **EGC Span Monotonicity:** Within each interval, each Extended Grapheme Cluster $g$ maps monotonically to an immutable source byte span $[\text{start}, \text{end})$.
4. **Outward Snapping Rule:** Citations or span references produced by an LLM over normalized text are snapped outward to the enclosing EGC boundaries:
   $$c_{\text{start}}' = \text{EGC\_Start}(c_{\text{start}}), \quad c_{\text{end}}' = \text{EGC\_End}(c_{\text{end}})$$
5. **Multi-Codepoint Synthesis:** Hangul Jamo syllables ($L + V + T \to \text{Syllable}$) and ligatures map to the full contiguous source byte span covering all constituent original codepoints.
6. **Continuous Scripts:** Unspaced scripts (Thai, Lao) lacking whitespace delimiters are chunked at safe $\text{CCC} = 0$ boundaries with a maximum interval limit of 64 codepoints.
7. **Malformed UTF-8 Handling:** Invalid UTF-8 lead or continuation bytes are preserved immutably in Layer 0. In the canonical mapping, invalid bytes are snapped to individual 1-byte raw intervals and mapped to the Unicode Replacement Character (`U+FFFD`).

---

## 12. SQLITE SCHEMA AND PERSISTENCE SPECIFICATION (RESOLVING BLOCKER 3 / AUD-G-05)

To permanently resolve `AUD-G-05`, the complete SQLite schema for Layer 0 raw byte storage, EGC interval indices, backend lease tracking, and idempotency is specified below.

### 12.1 Authoritative SQLite Schema DDL

```sql
-- Database File: gateway_state.db
-- WAL mode and foreign key constraints enabled on connection
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;

-- 1. BACKEND LEASE LEDGER (Enforces Option C Single Permit Baseline)
CREATE TABLE IF NOT EXISTS backend_lease_ledger (
    lease_id INTEGER PRIMARY KEY CHECK(lease_id = 1), -- Singleton permit
    backend_pid INTEGER NOT NULL,
    request_id TEXT,
    fsm_state TEXT NOT NULL CHECK(fsm_state IN (
        'RESOURCE_IDLE',
        'RESOURCE_RESERVED',
        'RESOURCE_ACTIVE',
        'RESOURCE_DRAINING',
        'RESOURCE_QUARANTINED',
        'RESOURCE_FATAL_HALT'
    )),
    lease_acquired_utc TEXT,
    last_heartbeat_utc TEXT NOT NULL,
    quarantine_reason TEXT
);

-- Initialize singleton permit row if empty
INSERT OR IGNORE INTO backend_lease_ledger (lease_id, backend_pid, fsm_state, last_heartbeat_utc)
VALUES (1, 0, 'RESOURCE_IDLE', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));

-- 2. LAYER 0 PROVENANCE DOCUMENTS (Immutable Raw Byte Storage)
CREATE TABLE IF NOT EXISTS provenance_documents (
    doc_id TEXT PRIMARY KEY,                       -- UUIDv4 or SHA-256 hash string
    project_id TEXT NOT NULL,                      -- Cooperative project scope
    raw_bytes BLOB NOT NULL,                       -- Exact, immutable original UTF-8 bytes
    raw_byte_length INTEGER NOT NULL,              -- Size in bytes (max 10 MiB per doc)
    raw_sha256 TEXT NOT NULL,                      -- Hex-encoded SHA-256 of raw_bytes
    canonical_text TEXT NOT NULL,                  -- NFC-normalized canonical text
    canonical_char_length INTEGER NOT NULL,        -- Length in Unicode codepoints
    canonical_sha256 TEXT NOT NULL,                -- Hex-encoded SHA-256 of canonical_text
    normalization_form TEXT NOT NULL DEFAULT 'NFC',-- Unicode normalization applied
    mapping_version TEXT NOT NULL DEFAULT '1.0',   -- EGC mapping algorithm version
    created_at_utc TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prov_doc_project ON provenance_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_prov_doc_raw_sha ON provenance_documents(raw_sha256);

-- 3. PROVENANCE INTERVALS (UAX #29 EGC Mapping Table)
CREATE TABLE IF NOT EXISTS provenance_intervals (
    interval_id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_id TEXT NOT NULL REFERENCES provenance_documents(doc_id) ON DELETE CASCADE,
    interval_index INTEGER NOT NULL,               -- 0-based sequence within document
    raw_byte_start INTEGER NOT NULL,               -- Source byte start offset (inclusive)
    raw_byte_end INTEGER NOT NULL,                 -- Source byte end offset (exclusive)
    canonical_char_start INTEGER NOT NULL,         -- Canonical codepoint start offset
    canonical_char_end INTEGER NOT NULL,           -- Canonical codepoint end offset
    egc_count INTEGER NOT NULL,                    -- Number of Extended Grapheme Clusters
    contains_ccc_reordering BOOLEAN NOT NULL,      -- Flag: CCC != 0 reordering occurred
    contains_composition BOOLEAN NOT NULL          -- Flag: Hangul or combining composition
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_prov_interval_seq ON provenance_intervals(doc_id, interval_index);
CREATE INDEX IF NOT EXISTS idx_prov_interval_lookup ON provenance_intervals(doc_id, canonical_char_start, canonical_char_end);

-- 4. IDEMPOTENCY LEDGER (Request De-duplication and Result Cache)
CREATE TABLE IF NOT EXISTS idempotency_ledger (
    lookup_key TEXT PRIMARY KEY,                   -- SHA256(project_id || "::" || idempotency_key)
    request_id TEXT NOT NULL UNIQUE,
    payload_hash TEXT NOT NULL,                    -- SHA256(request_body_bytes)
    execution_status TEXT NOT NULL CHECK(execution_status IN (
        'STATUS_PROCESSING',
        'STATUS_COMPLETED',
        'STATUS_FAILED_CLIENT_ABORT',
        'STATUS_FAILED_BACKEND_ERROR',
        'STATUS_FAILED_CRASH'
    )),
    response_headers_json TEXT,                    -- Serialized HTTP response headers
    response_body_text TEXT,                       -- Cached response content
    created_at_utc TEXT NOT NULL,
    completed_at_utc TEXT
);

CREATE INDEX IF NOT EXISTS idx_idempotency_req_id ON idempotency_ledger(request_id);
```

### 12.2 Storage Limits and Lifecycle Retention
1. **Document Size Clamping:** Single document storage is clamped to a maximum of $10\text{ MiB}$ ($10,485,760\text{ bytes}$). Payloads exceeding this limit are rejected with `HTTP 413 Payload Too Large`.
2. **Transaction Atomicity:** When storing a document, the `provenance_documents` insert and all associated `provenance_intervals` rows are executed inside a single `BEGIN IMMEDIATE TRANSACTION ... COMMIT` block.
3. **Retention Policy:** Synthetic test records are deleted post-verification. Production provenance records are retained indefinitely under append-only invariants.

---

## 13. BOUNDED ASYNCHRONOUS FAN-OUT AND OBSERVER ISOLATION (RESOLVING BLOCKER 4 / AUD-G-04)

### 13.1 Vulnerabilities of the Circular Replay Buffer
V8.32.2 relied on an in-memory 256 KB circular ring buffer where secondary observers attached directly to an active stream. Agent G finding `AUD-G-04` demonstrated that:
- Slow secondary consumers introduce backpressure, causing the broadcaster loop to stall.
- Stalling the broadcaster stalls the primary upstream reader, pausing GPU token drainage.
- Observer socket disconnects raise unhandled exceptions in the broadcast loop.
- Generations exceeding 256 KB silently overwrite early chunks, breaking stream replays.

### 13.2 Bounded Fan-Out Architecture Specification

The Gateway implements an isolated, bounded fan-out architecture using per-observer asynchronous queues:

```
                  ┌───────────────────────────────────────────────┐
                  │          UPSTREAM SSE READER TASK             │
                  │   Reads chunks from 127.0.0.1:1234 (httpx)    │
                  └───────────────────────┬───────────────────────┘
                                          │
                                 (Raw Chunk Emitted)
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │          BROADCAST DISPATCHER TASK            │
                  │   Iterates active observers non-blockingly    │
                  └───────┬───────────────────────────────┬───────┘
                          │                               │
             (put_nowait) │                  (put_nowait) │
                          ▼                               ▼
               ┌──────────────────────┐        ┌──────────────────────┐
               │  PRIMARY QUEUE       │        │  OBSERVER QUEUE      │
               │  asyncio.Queue(64)   │        │  asyncio.Queue(64)   │
               └──────────┬───────────┘        └──────────┬───────────┘
                          │                               │
                          ▼                               ▼
               ┌──────────────────────┐        ┌──────────────────────┐
               │ Primary HTTP Client  │        │ Late Observer Client │
               │ (Stream 200 OK)      │        │ (Stream 200 OK)      │
               └──────────────────────┘        └──────────────────────┘
```

### 13.3 Rigorous Fan-Out Rules and Constraints
1. **Per-Observer Bounded Queue:** Every attached client (primary or observer) receives an independent `asyncio.Queue(maxsize=64)`.
2. **Observer Cap:** A maximum of $N_{\text{max\_observers}} = 4$ concurrent observers may attach to an in-flight request. A fifth observer request is rejected with `HTTP 429 Too Many Requests`.
3. **Non-Blocking Dispatch (`put_nowait`):** The broadcast dispatcher iterates attached observer queues and calls `queue.put_nowait(chunk)`.
4. **Slow-Consumer Eviction Policy:** If an observer's queue is full (`asyncio.QueueFull`), the broadcaster does **not** wait. It immediately evicts the slow observer, closes its downstream connection with `HTTP 408 Request Timeout`, and logs a warning. **The primary upstream reader is never blocked.**
5. **Exception Isolation:** If an observer drops its socket (`ConnectionResetError`, `BrokenPipeError`), the exception is caught in the observer's dedicated task. The observer is removed from the subscriber registry with zero impact on the broadcast task or primary stream.
6. **Buffer Overflow Resolution (`HTTP 409 Conflict`):** If an observer joins after the in-flight stream has already emitted more than 64 chunks ($~16\text{ KiB}$), the observer cannot catch up. It is rejected with `HTTP 409 Conflict` and structured metadata directing it to await final SQLite persistence (`REPLAY_STREAM_BUFFER_OVERFLOW`).
7. **Buffer Lifecycle Ownership:** The broadcast registry is owned by the request lifecycle coordinator. When the primary generation terminates, final chunks are flushed to all healthy queues, the SQLite record is marked `STATUS_COMPLETED`, and observer queues are cleanly closed.

---

## 14. IDEMPOTENCY AND CRASH RECOVERY

### 14.1 Idempotency Key Semantics
Requests specify an idempotency key via the HTTP header `X-Idempotency-Key: <UUID|String>`.  
The Gateway computes:
$$\text{LookupKey} = \text{SHA256}(\text{Project\_ID} \mathbin{\Vert} \texttt{"::"} \mathbin{\Vert} \text{Idempotency\_Key})$$
$$\text{PayloadHash} = \text{SHA256}(\text{RequestBodyBytes})$$

- If `LookupKey` is not found, the request is registered and scheduled.
- If `LookupKey` exists and `PayloadHash` matches:
  - If the original request is **completed**, the cached response is served immediately from SQLite.
  - If the original request is **in-flight**, the client is attached to the bounded fan-out coordinator as an observer.
- If `LookupKey` exists and `PayloadHash` differs, the Gateway immediately rejects the request with **HTTP 409 Conflict** (`IDEMPOTENCY_PAYLOAD_MISMATCH`).

### 14.2 Boot-Time Reconciliation Protocol
When the Gateway process launches:
1. **Integrity Check:** Execute `PRAGMA integrity_check` on `gateway_state.db`. If corrupted, transition immediately to `RESOURCE_FATAL_HALT`.
2. **Quarantine Active Leases:** Any active lease found in SQLite is unconditionally quarantined:
   ```sql
   UPDATE backend_lease_ledger
   SET fsm_state = 'RESOURCE_QUARANTINED',
       last_heartbeat_utc = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
       quarantine_reason = 'BOOT_RECOVERY_UNCERTAIN_STATE'
   WHERE fsm_state IN ('RESOURCE_RESERVED', 'RESOURCE_ACTIVE', 'RESOURCE_DRAINING');
   ```
3. **Crash-Mark Incomplete Requests:**
   ```sql
   UPDATE idempotency_ledger
   SET execution_status = 'STATUS_FAILED_CRASH',
       completed_at_utc = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
   WHERE execution_status = 'STATUS_PROCESSING';
   ```

---

## 15. SCHEDULER AND STARVATION PREVENTION (RESOLVING AUD-G-06)

### 15.1 Evaluation of Scheduler Options
In V8.32.2, with $W_{\text{age}} = 70.0\text{ pts/s}$ and $T_{\text{wait\_max}} = 30.0\text{s}$, a P2 request reached effective priority 0 at $t = 28.57\text{s}$. Agent G finding `AUD-G-06` revealed that this left a razor-thin window of only $1.43\text{ seconds}$ before HTTP 504 eviction. Because a single GPU inference generation takes 5–15 seconds, a P2 request at the head of the queue would reliably time out and be evicted before the active permit was released.

We evaluate four candidate designs:
- **Option A (Higher Aging Rate):** Increase $W_{\text{age}} = 100.0\text{ pts/s}$. P2 reaches P0 at $t = 20.0\text{s}$. At $T_{\text{wait\_max}} = 30.0\text{s}$, the scheduling window is $10.0\text{s}$. Still vulnerable if an active request takes $>10.0\text{s}$.
- **Option B (Queue Timeout Extension):** Keep $W_{\text{age}} = 70.0\text{ pts/s}$, increase $T_{\text{wait\_max}} = 60.0\text{s}$. P2 reaches P0 at $t = 28.57\text{s}$, providing a $31.43\text{s}$ scheduling window.
- **Option C (Head-of-Queue Deadline Suspension):** Once a request reaches Rank 1 (head of the min-heap), its queue wait deadline is suspended while awaiting the active GPU permit lease.
- **Option D (Recommended Hybrid Design):** Combine **Option A + Option B + Option C**.
  - Recalibrate $W_{\text{age}} = 100.0\text{ pts/s}$.
  - Set baseline queue wait timeout to $T_{\text{wait\_max}} = 60.0\text{s}$.
  - Enforce **Head-of-Queue Deadline Suspension**: If a request occupies Rank 1 in the heap, its 60-second eviction timer is paused while the single permit is actively leased in `RESOURCE_ACTIVE` or `RESOURCE_DRAINING`.

### 15.2 Authoritative Priority Heap Model

| Priority Class | Header Value | Base Weight ($\text{BaseWeight}$) | Consumer Domain |
| :---: | :---: | :---: | :--- |
| **P0** | `X-Priority: P0` | **0** | Interactive User Chat / Emergency System Abort |
| **P1** | `X-Priority: P1` | **1,000** | Interactive Agent Tool Calling / Codebase Query |
| **P2** | `X-Priority: P2` | **2,000** | Background Batch Processing / Document Ingestion |

### 15.3 Mathematical Formulation & Invariants
Dynamic effective priority is computed whenever scheduling occurs:

$$\text{EffectivePriority}(R) = \text{BaseWeight}(C) - \left( 100.0 \times \Delta t \right)$$

where $\Delta t$ is elapsed queue wait time in seconds (float).

**Mathematical Starvation Proof:**
1. A P2 request enters with base weight $2,000$.
2. At $t = 10.0\text{s}$, effective priority is $2,000 - 1,000 = 1,000$, competing equally with fresh P1 requests.
3. At $t = 20.0\text{s}$, effective priority is $2,000 - 2,000 = 0$, competing equally with fresh P0 requests.
4. At $t = 30.0\text{s}$, effective priority is $2,000 - 3,000 = -1,000$, strictly dominating any newly arriving P0, P1, or P2 request.
5. With $T_{\text{wait\_max}} = 60.0\text{s}$, the request has an absolute $40.0\text{-second}$ window of priority dominance before timeout.
6. Under Head-of-Queue Deadline Suspension, if the P2 request reaches Rank 1 while an active P0 request is running a 25-second generation, the eviction timer freezes, guaranteeing that the P2 request acquires the permit immediately upon permit release.

**Deterministic Tie-Breaking:**
1. **Primary:** Minimum enqueue timestamp ($\min(t_{\text{enqueued}})$).
2. **Secondary:** Lexicographical order of `request_id` string.

---

## 16. CENTRALIZED ADMISSION CONTROL AND MIGRATION AUDIT (RESOLVING BLOCKER 5 / AUD-G-02)

### 16.1 The Fallacy of Network-Level Port Exclusivity
Agent G finding `AUD-G-02` proved that having the Gateway listen on `127.0.0.1:3333` does not prevent local processes from directly hitting `127.0.0.1:1234`. Because LM Studio 0.4.27 does not support incoming API authentication or loopback access restrictions (**EV-23**), admission control across the workstation is **strictly cooperative**.

### 16.2 Read-Only Migration Audit Protocol (Phase 7 Requirement)
Before the Gateway daemon is declared production-ready, a strict read-only audit must be performed across all orchestration files to detect and eliminate direct references to port `1234`.

#### Audit Classification Rules:
The audit script must inspect files and classify references to `1234`:
1. **Legitimate Gateway Upstream Reference:** The single configuration line inside the Gateway daemon connecting to `http://127.0.0.1:1234/v1/chat/completions`.
2. **Historical / Documentation Reference:** Markdown files (e.g. `V8_32_*.md`) discussing port 1234. Permitted read-only.
3. **Active Client Violation (Blocker):** Any MCP bridge (e.g. `v825-gpu-bridge/server.py`), agent configuration, or CLI script containing `1234`. Must be updated to `3333`.

#### Sealed Directory Exclusion:
The audit scan **MUST NOT** scan, enumerate, or open files within:
`C:\Users\User\Desktop\whatsapp_chats_zip`

---

## 17. PHYSICAL HARDWARE & PERFORMANCE SPECIFICATION

All physical hardware and performance parameters are segregated by epistemic classification:

| Parameter / Metric | Specified Value | Epistemic Status | Empirical & Technical Grounds |
| :--- | :--- | :---: | :--- |
| **GPU Hardware Model** | NVIDIA GeForce RTX 4080 Laptop GPU | **VERIFIED** | WMI query (`Win32_VideoController`) & LM Studio log line 475. |
| **Physical VRAM Capacity**| 12,282 MiB GDDR6 | **VERIFIED** | WMI query & LM Studio log line 475. |
| **Windows OS / DWM Reserve** | 1,870 MiB (1,800–1,915 MiB range) | **VERIFIED** | Observed in LM Studio host log (`Used: 1.87 GB, Free: 11.01 GB`). |
| **Model Weights (Qwen2.5-7B Q4_K_M)** | 4,935 MiB (4.82 GB) | **VERIFIED** | LM Studio model loader log and physical `.gguf` file size. |
| **KV Cache Footprint** | **56.0 KiB / token** ($57,344$ bytes) | **MATHEMATICALLY_DERIVED** | GQA formula: $2 \times 4 \times 128 \times 28 \times 2\text{ bytes} = 57,344\text{ bytes}$. |
| **KV Cache @ 16,384 tokens**| 896.0 MiB | **MATHEMATICALLY_DERIVED** | $16,384 \times 57,344\text{ bytes} = 939,524,096\text{ bytes} = 896.0\text{ MiB}$. |
| **CUDA Context / Scratchpad**| ~650 MiB | **ESTIMATED** | Heuristic cuBLAS workspace buffer; unmeasured via NVML. |
| **Total Committed VRAM** | 8,351 MiB | **ESTIMATED** | Sum: OS (1,870) + Model (4,935) + Scratchpad (650) + KV (896). |
| **Unallocated VRAM Headroom**| 3,931 MiB (32.0%) | **ESTIMATED** | Headroom: $12,282\text{ MiB} - 8,351\text{ MiB}$. |
| **Sustained Throughput** | 70–95 tokens/second | **UNTESTED_PREDICTION** | Theoretical memory bandwidth estimate; unverified by live benchmark. |
| **GPU Operating Power** | 80 W – 115 W | **UNTESTED_PREDICTION** | Mobile TGP envelope spec; unmeasured via `pynvml`. |
| **GPU Operating Temperature**| 68 °C – 74 °C | **UNTESTED_PREDICTION** | Mobile cooling model projection; unmeasured under sustained batch load. |
| **Loopback Settle Latency** | Heuristic buffer ($T_{\text{settle}} = 200\text{ms}$) | **ESTIMATED** | Operational socket flush delay; not proof of CUDA core idleness. |

---

## 18. PRESERVED ARCHITECTURAL DECISIONS

V8.32.3 strictly preserves the following core decisions ratified across V8.32, V8.32.1, and V8.32.2:
1. **Option C Baseline:** Exactly one global logical execution permit ($N_{\text{permits}} = 1$). No concurrent inference.
2. **Canonical Six States:** Exactly 6 states in the Backend Resource FSM. Zero phantom states.
3. **Fail-Closed Quarantine:** Any unexpected socket teardown, timeout, or transport fault locks the permit in `RESOURCE_QUARANTINED`.
4. **No Permit Release on TCP EOF/RST:** Transport closure is never treated as compute cessation.
5. **No Active Ping Probes:** Diagnostic inference probes are permanently eliminated.
6. **No False LM Studio Slot Observability:** The Gateway manages its own logical permits, not internal C++ slots.
7. **No Unsupported CUDA Completion Claims:** Acknowledges user-space inability to directly probe CUDA stream queues.
8. **Experimental Project Nonce Status:** Scoped strictly as a prompt-level cache-prefix mitigation.
9. **Single-User Security Demotion:** Localhost Bearer tokens are cooperative namespace scoping tags.
10. **SQLite WAL Crash Recovery:** Unresolved leases at boot are unconditionally quarantined.
11. **No Process SIGKILL:** Forbids killing `LM Studio.exe` via `TerminateProcess` or `taskkill /F`.
12. **Permanent WhatsApp Data Sealing:** Absolute exclusion of `C:\Users\User\Desktop\whatsapp_chats_zip`.
13. **Strict Epistemic Segregation:** Measurements, mathematical derivations, estimates, and predictions remain segregated.

---

## 19. RECONCILIATION OF AGENT G AUDIT FINDINGS

| Finding ID | Agent G Audit Finding Summary | Status in V8.32.3 | Disposition Reasoning & Architectural Correction in V8.32.3 | Remaining Uncertainty | Implementation Blocker Status | Minimum Evidence Required to Close |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **AUD-G-01** | Settle buffer ($T_{\text{settle}} = 200\text{ms}$) equates application-layer `[DONE]` with CUDA completion without proof. | **ACCEPTED** | §6 formally acknowledges $T_{\text{settle}} = 200\text{ms}$ as an unverified operational heuristic. Establishes fail-closed quarantine for uncertain stream termination. Prohibits claiming physical idleness. | Exact post-`[DONE]` CUDA stream drain timing on mobile chassis. | **RESOLVED AT SPEC LEVEL** (Requires empirical benchmark in Phase 8) | NVML / CUDA event latency logging in Phase 8. |
| **AUD-G-02** | Gateway on `:3333` does not prevent local processes from directly calling unprotected backend on `:1234`. | **ACCEPTED** | §16 establishes that admission control is cooperative across local tools. Confirms LM Studio 0.4.27 lacks native auth. Specifies mandatory read-only codebase audit in Phase 7. | Whether third-party external apps hit port 1234. | **RESOLVED AT SPEC LEVEL** (Requires migration audit in Phase 7) | Clean scan of codebase in Phase 7 showing zero unauthorized `1234` references. |
| **AUD-G-03** | Manual reset endpoint resets quarantine without proving backend or driver idleness. | **ACCEPTED** | §8 completely redesigns recovery across 6 distinct scenarios. Enforces programmatic port check, PID validation, and mandatory $T_{\text{quiescent}} \ge 2.0\text{s}$ post-reset stabilization. | Undetected driver kernel deadlock (TDR). | **RESOLVED AT SPEC LEVEL** (Requires test suite in Phase 5) | Fault-injection unit tests in Phase 5 verifying reset preconditions. |
| **AUD-G-04** | Circular replay buffer allows slow observers to cause backpressure, memory leaks, and stream stalls. | **ACCEPTED** | §13 replaces replay buffer with bounded `asyncio.Queue(maxsize=64)` per observer. Enforces non-blocking `put_nowait`, slow-consumer eviction, and exception isolation. | Performance under maximum observer fan-out ($N=4$). | **RESOLVED AT SPEC LEVEL** (Requires test suite in Phase 4) | Unit tests in Phase 4 verifying slow consumer eviction without primary stall. |
| **AUD-G-05** | Specification asserts Layer 0 raw byte preservation but provides zero schema or disk storage design. | **ACCEPTED** | §12 provides full SQLite schema DDL (`provenance_documents`, `provenance_intervals`) with foreign keys, indexes, BLOB storage, and transaction constraints. | Disk I/O overhead on large batch document ingestion. | **RESOLVED AT SPEC LEVEL** (Requires schema test in Phase 3) | Synthetic schema creation and constraint validation in Phase 3. |
| **AUD-G-06** | Queue wait timeout at 30.0s leaves only 1.43s window for aged P2 requests to be scheduled. | **ACCEPTED** | §15 recalibrates $W_{\text{age}} = 100.0\text{ pts/s}$, extends $T_{\text{wait\_max}} = 60.0\text{s}$, and implements Head-of-Queue Deadline Suspension during active permit leases. | Heap re-sort overhead under heavy queue depth. | **RESOLVED AT SPEC LEVEL** (Advisory closed) | Priority heap unit tests in Phase 4 demonstrating starvation prevention. |
| **AUD-G-07** | BPE tokenizer may split `<|...|>` delimiters, adding variable token overhead to prompt nonces. | **ACCEPTED** | §10 documents that custom delimiters split into multiple tokens, adding 15–25 tokens of overhead. Scoped strictly as prompt-level cache-prefix mitigation. | Exact token count of nonce under Qwen2.5 tokenizer. | **RESOLVED AT SPEC LEVEL** (Advisory closed) | Tokenization script in Phase 6 measuring exact BPE token length. |
| **AUD-G-08** | Bearer tokens in localhost memory can be extracted by local processes under the same user session. | **ACCEPTED** | §10 formally reaffirms that localhost security on single-user Windows 11 is strictly cooperative. Demotes Bearer tokens to cooperative namespace scoping tags. | Residual process memory visibility. | **RESOLVED AT SPEC LEVEL** (Advisory closed) | Formal documentation of security boundary locked in architecture. |

---

## 20. IMPLEMENTATION ROADMAP (STAGED PHASES & GATES)

Implementation will proceed strictly across eight sequential, gated phases. **Zero code implementation is authorized during this specification phase.** Each phase requires explicit user authorization before entry.

```
[Phase 1: Existing Evidence & Environment Review] (READ-ONLY)
              │
[Phase 2: Environment & Tooling Baseline] (READ-ONLY)
              │
[Phase 3: Synthetic Storage & Schema Validation] (ISOLATED SYNTHETIC TEST)
              │
[Phase 4: Gateway Core Daemon Development] (GATEWAY CORE DAEMON)
              │
[Phase 5: Cancellation & Quarantine Stress Validation] (FAULT INJECTION)
              │
[Phase 6: Unicode EGC Provenance Implementation] (SYNTHETIC FIXTURES)
              │
[Phase 7: Client Migration & stdio MCP Integration] (READ-ONLY AUDIT + REFACTOR)
              │
[Phase 8: Controlled GPU Benchmarking & Telemetry] (CONTROLLED LIVE BENCHMARK)
```

### Detailed Phase Specifications:

#### Phase 1: Existing Evidence & Environment Review (Read-Only)
- **Objective:** Verify existing documentation, audit reports, and environment configuration without modifying any files.
- **Authorized Scope:** Read-only inspection of reports, environment variables, and repository layout.
- **Prohibited Actions:** No file creation, no editing, no package installs, no GPU inferences. Real WhatsApp data remains sealed.
- **Entry Criteria:** Ratification of V8.32.3 by user.
- **Exit Criteria:** Verification that historical test reports and hashes match baseline records.
- **Required Evidence:** Static report hash verification log.
- **Failure Behavior:** If reports are missing or altered, halt and report drift to operator.
- **Rollback Strategy:** N/A (Read-only).
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 2.

#### Phase 2: Environment & Tooling Baseline (Read-Only)
- **Objective:** Verify Python `.venv`, MCP SDK version 2.3.0, SQLite CLI, and loopback socket connectivity.
- **Authorized Scope:** Execute read-only version checks via `python -c "import mcp; print(mcp.__version__)"`.
- **Prohibited Actions:** No package installation, no virtual environment modification.
- **Entry Criteria:** Phase 1 approved by user.
- **Exit Criteria:** MCP SDK 2.3.0 confirmed; Python environment clean; port 3333 confirmed available.
- **Required Evidence:** Terminal output demonstrating clean import of `MCPServer`.
- **Failure Behavior:** If dependencies are broken, notify user and await remediation plan.
- **Rollback Strategy:** N/A (Read-only).
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 3.

#### Phase 3: Synthetic Storage & Schema Validation (Isolated Synthetic Storage)
- **Objective:** Deploy and validate the SQLite schema DDL (`gateway_state.db`) in a temporary synthetic test directory.
- **Authorized Scope:** Author isolated schema creation scripts in `./tests/synthetic/`.
- **Prohibited Actions:** Do not write to production database paths. Do not touch real WhatsApp data.
- **Entry Criteria:** Phase 2 approved by user.
- **Exit Criteria:** 100% of schema constraints (Option C singleton permit, FSM state checks, foreign keys, unique indexes) pass automated validation.
- **Required Evidence:** Automated test log confirming constraint violation rejections.
- **Failure Behavior:** Fix schema DDL syntax or constraint definitions in test script.
- **Rollback Strategy:** Delete temporary test database file.
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 4.

#### Phase 4: Gateway Core Daemon Development (Core Gateway Implementation)
- **Objective:** Implement the out-of-process Gateway daemon listening on `127.0.0.1:3333` with Option C concurrency, 10-state Request FSM, 6-state Backend Resource FSM, priority min-heap scheduler, and bounded fan-out queues.
- **Authorized Scope:** Create Gateway daemon modules in a dedicated directory. Test against mock HTTP upstreams.
- **Prohibited Actions:** Do not connect to real LM Studio. Do not modify existing `v825-gpu-bridge/server.py`.
- **Entry Criteria:** Phase 3 approved by user.
- **Exit Criteria:** Clean pass of mock HTTP integration suite; slow observer eviction verified; starvation prevention verified.
- **Required Evidence:** Automated mock test execution log showing zero permit leaks and proper priority scheduling.
- **Failure Behavior:** Identify race condition or queue stall; refactor async logic.
- **Rollback Strategy:** Revert created daemon code files.
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 5.

#### Phase 5: Cancellation & Quarantine Stress Validation (Fault-Injection Testing)
- **Objective:** Validate fail-closed quarantine and multi-scenario recovery against simulated network and engine faults.
- **Authorized Scope:** Run unit and integration tests simulating client disconnects, upstream socket drops (FIN/RST), 15s drain timeouts, and administrative reset calls.
- **Prohibited Actions:** No interaction with real LM Studio or physical GPU.
- **Entry Criteria:** Phase 4 approved by user.
- **Exit Criteria:** Zero permit leaks; 100% of faults transition to `RESOURCE_QUARANTINED`; reset endpoint enforces port and PID validation.
- **Required Evidence:** Fault-injection report proving permit remains locked across all failure vectors.
- **Failure Behavior:** Isolate state leak in FSM transition logic.
- **Rollback Strategy:** Halt testing; refactor FSM handler.
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 6.

#### Phase 6: Unicode EGC Provenance Implementation (Synthetic Fixture Testing)
- **Objective:** Implement the UAX #29 Extended Grapheme Cluster provenance engine and validate against 25 synthetic `.bin` companion fixtures.
- **Authorized Scope:** Author synthetic ingestion fixtures in `./tests/fixtures/synthetic_ingestion/`. Run property-based tests (Hypothesis).
- **Prohibited Actions:** Absolutely no access to `C:\Users\User\Desktop\whatsapp_chats_zip`.
- **Entry Criteria:** Phase 5 approved by user.
- **Exit Criteria:** 100% round-trip fidelity between canonical normalized text and immutable raw byte spans across CCC reordering, Hangul, CRLF, and emoji ZWJ sequences.
- **Required Evidence:** Hypothesis test execution report demonstrating zero provenance offset desyncs.
- **Failure Behavior:** Refactor interval partitioning or snapping logic.
- **Rollback Strategy:** Revert parser module.
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 7.

#### Phase 7: Client Migration & stdio MCP Integration (Cooperative Migration)
- **Objective:** Perform the read-only codebase migration audit, refactor `v825-gpu-bridge/server.py` to route through `:3333`, and verify end-to-end stdio MCP tool execution.
- **Authorized Scope:** Execute codebase scan for `1234`. Refactor `server.py` to call `http://127.0.0.1:3333/v1/chat/completions`.
- **Prohibited Actions:** Do not scan or open WhatsApp data directory. Do not alter MCP configuration paths.
- **Entry Criteria:** Phase 6 approved by user.
- **Exit Criteria:** Zero unmigrated references to port `1234`; `gpu_bridge_inference` tool functions cleanly over stdio through the Gateway.
- **Required Evidence:** Migration audit scan log and clean MCP JSON-RPC execution transcript.
- **Failure Behavior:** Revert `server.py` to backup and isolate MCP protocol error.
- **Rollback Strategy:** Restore `server.py` from version control backup.
- **User Approval Gate:** Explicit user authorization required to proceed to Phase 8.

#### Phase 8: Controlled GPU Benchmarking & Telemetry (Live Physical Benchmark)
- **Objective:** Execute controlled, instrumented inference requests through the Gateway to live LM Studio 0.4.27 on the RTX 4080 Laptop GPU, capturing true physical performance metrics.
- **Authorized Scope:** Dispatch single-stream and queued multi-request workloads. Record NVML power, thermals, VRAM allocation, and post-`[DONE]` CUDA drainage timing.
- **Prohibited Actions:** Do not run unconstrained concurrency ($N > 1$). Do not process real WhatsApp data.
- **Entry Criteria:** Phase 7 approved by user; LM Studio running with Qwen2.5-7B-Instruct.
- **Exit Criteria:** Verification of sustained tokens/s, zero VRAM thrashing, DWM stability, and empirical measurement of post-`[DONE]` CUDA stream idle latency.
- **Required Evidence:** Authoritative physical telemetry benchmark log.
- **Failure Behavior:** If CUDA OOM or driver reset occurs, immediately halt and transition Gateway to `RESOURCE_QUARANTINED`.
- **Rollback Strategy:** Terminate benchmark runner; reset Gateway via admin endpoint.
- **User Approval Gate:** Final system acceptance by user.

---

## 21. OUTSTANDING UNKNOWNS

The following technical properties cannot be resolved by static specification and require empirical measurement in Phase 8:
1. **Asynchronous CUDA Stream Linger Latency:** The precise millisecond distribution between upstream SSE `[DONE]` emission on loopback and the complete cessation of CUDA core execution and memory deallocation in `llama.cpp` on this mobile RTX 4080 chassis.
2. **Winsock Loopback RST Propagation Delay:** The exact latency between socket closure and LM Studio's event loop detecting `WSAECONNRESET` under heavy prompt prefill.
3. **Qwen2.5 Nonce Tokenization Overhead:** The exact number of BPE tokens consumed by `<|project_isolation_id: ...|>`, and whether LM Studio's build splits custom delimiters into separate text tokens.
4. **Sustained Mobile Thermal Envelope:** Whether continuous high-throughput generation (>30 minutes) at high ambient room temperature triggers thermal clock throttling on the RTX 4080 Laptop GPU.

---

## 22. FINAL ARCHITECTURAL VERDICT

### Architectural Verdict: **CONDITIONAL GO**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        V8.32.3 FINAL ARCHITECTURAL VERDICT                             │
│                                                                                        │
│               EXECUTIVE VERDICT: CONDITIONAL GO — SPECIFICATION CLOSED                 │
│                                                                                        │
│  The V8.32.3 specification comprehensively resolves all five architectural blockers     │
│  identified by Agent G (AUD-G-01 through AUD-G-05) and reconciles all advisory         │
│  findings (AUD-G-06 through AUD-G-08):                                                 │
│                                                                                        │
│  1. BLOCKER 1 (AUD-G-01): RESOLVED AT SPECIFICATION LEVEL.                            │
│     Epistemic boundary of GPU idleness established. T_settle = 200ms recognized as an │
│     unverified heuristic. Fail-closed quarantine enforced for uncertain completions.  │
│                                                                                        │
│  2. BLOCKER 2 (AUD-G-03): RESOLVED AT SPECIFICATION LEVEL.                            │
│     Quarantine recovery redesigned across 6 failure scenarios with explicit evidence    │
│     matrices, programmatic TCP checks, PID validation, and T_quiescent >= 2.0s delay. │
│                                                                                        │
│  3. BLOCKER 3 (AUD-G-05): RESOLVED AT SPECIFICATION LEVEL.                            │
│     Complete SQLite DDL defined for Layer 0 raw byte storage, UAX #29 EGC interval     │
│     mapping, and idempotency tracking with transaction and size constraints.           │
│                                                                                        │
│  4. BLOCKER 4 (AUD-G-04): RESOLVED AT SPECIFICATION LEVEL.                            │
│     Bounded asynchronous fan-out queues (asyncio.Queue(maxsize=64)) specified per      │
│     observer with non-blocking dispatch, slow-consumer eviction, and error isolation.  │
│                                                                                        │
│  5. BLOCKER 5 (AUD-G-02): RESOLVED AT SPECIFICATION LEVEL.                            │
│     Admission control topology classified as cooperative loopback ingress. Lack of    │
│     native LM Studio auth confirmed. Phase 7 read-only migration audit specified.      │
│                                                                                        │
│  6. ADVISORY FINDINGS (AUD-G-06, AUD-G-07, AUD-G-08): FULLY RECONCILED.                │
│     Scheduler starvation resolved via W_age = 100.0, T_wait_max = 60s, and deadline   │
│     suspension. Nonce tokenization overhead documented. Local security model ratified. │
│                                                                                        │
│  AUTHORIZATION RESTRICTION:                                                            │
│  CONDITIONAL GO means the architectural specification is complete and mathematically   │
│  reconciled for implementation planning. ZERO CODE IMPLEMENTATION IS AUTHORIZED.       │
│  No phase may begin without explicit user authorization.                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 23. CONFIRMATION OF STRICT EXECUTION BOUNDARIES

The following execution invariants were strictly maintained during this session:
1. **Source Code Unmodified:** Zero lines of existing code in `server.py`, `test_static.py`, or any other repository file were modified.
2. **Configuration Unmodified:** `mcp_config.json` and all environment settings remain untouched.
3. **No Packages Installed:** Zero packages were installed, updated, or removed in `.venv` or globally.
4. **Zero GPU Inference:** LM Studio was not launched, stopped, or queried. Zero GPU inference benchmarks were executed.
5. **No Subagents Launched:** Zero subagents or background tasks were launched.
6. **Real WhatsApp Data Sealed:** The directory `C:\Users\User\Desktop\whatsapp_chats_zip` was **NEVER** opened, enumerated, read, or indexed.
7. **Single Output Document:** Exactly one file was created: `V8_32_3_FINAL_ARCHITECTURAL_SPECIFICATION.md`.
