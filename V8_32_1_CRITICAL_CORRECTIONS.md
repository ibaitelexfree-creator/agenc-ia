# V8.32.1 — CRITICAL SPECIFICATION CORRECTIONS & IMPLEMENTATION GATE REVIEW

**Document Version:** 8.32.1  
**Phase:** V8.32 Corrective Architectural Review & Implementation Gate  
**Classification:** AUTHORITATIVE TECHNICAL CORRECTIONS & EPISTEMIC GATE  
**Date:** 2026-10-30  
**Target Path:** `C:\Users\User\Desktop\agenc-ia\V8_32_1_CRITICAL_CORRECTIONS.md`  
**Execution Boundary:** STRICT READ-ONLY CODEBASE AUDIT (Zero Code Mutation, No Package Installs, Zero GPU Inferences, Real WhatsApp Data Quarantined)

---

## 1. EXECUTIVE VERDICT

### Overall Architectural Verdict: **CONDITIONAL GO**

The V8.32 architecture (`V8_32_GATEWAY_CORRECTED_IMPLEMENTATION_SPEC.md`) represents a major leap forward over historical versions (V8.25–V8.31), successfully grounding the physical hardware baseline (RTX 4080 Laptop GPU, 12,282 MiB GDDR6), adopting the Option C single-permit baseline ($N_{\text{permits}} = 1$), eliminating active inference ping probes, and proposing a dual-FSM model.

However, a strict multi-agent audit reveals **ten unresolved critical contradictions and latent architectural fictions** that would trigger catastrophic failures if implementation proceeded without correction:
1. **Upstream Socket Teardown Equated to Compute Cessation:** The spec treats receiving an upstream TCP EOF/RST as proof that CUDA kernels have stopped and slot memory is freed. This conflates the TCP transport layer with asynchronous CUDA compute streams.
2. **Ghost Slot Observability:** The SQLite schema (`slot_ledger`) and recovery diagrams assume the Gateway can identify, address, drain, or recover a specific internal LM Studio slot (0..3). LM Studio exposes no `/slots` API; internal slot routing is purely autonomous in C++.
3. **Resurrected Diagnostic Recovery Probes:** The spec claims a diagnostic probe confirms slot idleness during `SLOT_RECOVERING`, directly contradicting its own proofs (EV-06, EV-07) that active probes hit secondary slots and `/v1/models` returns 200 OK while CUDA compute threads are pinned at 100%.
4. **Boot-Time False Idleness Assumption:** The crash recovery procedure releases permits if LM Studio's HTTP endpoint responds to a non-inference probe, directly violating the Strict Permit Release Invariant (§14.2).
5. **FSM State Count Discrepancy & Orphaned State:** Section 7 declares 8 states but defines only 7 in the diagram. `SLOT_RESETTING` exists in the SQL schema and boot SQL, but is completely omitted from the FSM graph and transition rules.
6. **False Claim of Absolute KV-Cache Isolation:** Section 10.3 claims a token 0 nonce guarantees "absolute tenant isolation". A prefix nonce is an experimental prompt-level cache-prefix mitigation; it does not erase VRAM tensors, nor does it provide physical or cryptographic memory isolation on a single-user Windows 11 host.
7. **Flawed Monotonic Codepoint-to-Byte Index:** The secondary Unicode index formula ($\mathbf{M}_k[i] \le \mathbf{M}_k[i+1]$) is mathematically impossible across canonical combining mark reordering (UAX #15 CCC != 0) and CRLF normalization. Monotonicity holds strictly over Extended Grapheme Clusters (UAX #29).
8. **Replay Buffer Silent Overwrite:** The 256 KB ring buffer leaves behavior undefined when an in-flight generation exceeds 256 KB before a late observer joins.
9. **Scheduler Numerical Ambiguities:** The dynamic aging equation lacks explicit base weight values, formal time units, and deterministic tie-breaking.
10. **Conflation of Estimates and Predictions with Physical Measurements:** Performance figures (70–95 t/s, 80–115 W, 68–74 °C, 3,931 MiB free VRAM) were presented as settled baseline realities rather than mathematical estimates and unverified predictions.

**Implementation Authorization:**  
**CONDITIONAL GO** is granted for planning V8.33. **Zero code implementation is authorized during this session.** Direct code modifications remain strictly gated until these ten corrections are formally ratified into the architecture.

---

## 2. EVIDENCE LEDGER WITH EVIDENCE IDS

Every architectural parameter, observation, and capability is classified under strict epistemic standards:
- **`[VERIFIED]`**: Directly corroborated by live environment query, OS inspection, or runtime logs.
- **`[TECHNICALLY_SUPPORTED_NOT_TESTED]`**: Derives from established standards or library mechanics, but unverified by an active benchmark on this host.
- **`[CONTRADICTED]`**: Explicitly refuted by physical hardware queries, API contracts, or system architecture.
- **`[UNSUPPORTED]`**: Asserted without empirical evidence, log data, or mathematical proof.
- **`[UNKNOWN]`**: Indeterminate without executing live, instrumented tests.

| Evidence ID | Subject / Factual Claim | Epistemic Verdict | Empirical & Technical Grounds |
| :--- | :--- | :---: | :--- |
| **EV-01** | Python MCP SDK version `2.3.0` installed in `v825-gpu-bridge\.venv` | **VERIFIED** | Official LF Projects wheel verified on disk; clean import of `MCPServer`. |
| **EV-02** | `local-gpu-bridge` registered in active `mcp_config.json` | **VERIFIED** | Lines 34–39 of `C:\Users\User\.gemini\config\mcp_config.json` map to `.venv` and `server.py`. |
| **EV-03** | `gpu_bridge_echo` executes cleanly via native stdio MCP | **VERIFIED** | Validated in subagent trajectory `8601be95-3bd1-42a6-9236-711984190b09`. Pure in-memory tool. |
| **EV-04** | Physical GPU is NVIDIA GeForce RTX 4080 Laptop GPU (12,282 MiB) | **VERIFIED** | Confirmed by live OS WMI query and LM Studio host log line 475. RTX 3060 claims refuted. |
| **EV-05** | Windows DWM / OS display commitment is ~1,870–1,915 MiB | **VERIFIED** | Observed in LM Studio host log (`Used: 1.87 GB, Free: 11.01 GB, Total: 12.88 GB`). |
| **EV-06** | Active inference ping probe triggers backend collision | **VERIFIED / SUPPORTED** | LM Studio initializes with `n_slots = 4`. A ping probe routes to an idle slot in $<50\text{ms}$ while the aborted slot is still decoding. |
| **EV-07** | `GET /v1/models` 200 OK proves backend slot is idle | **CONTRADICTED** | REST dispatcher thread returns static memory struct in $<1\text{ms}$ while CUDA compute threads remain pinned at 100%. |
| **EV-08** | LM Studio exposes `GET /slots` on port 1234 | **CONTRADICTED** | Raw upstream `llama-server` supports `/slots`, but LM Studio's reverse proxy does not route `/slots` to clients. |
| **EV-09** | Upstream TCP EOF/RST proves CUDA computation has stopped | **CONTRADICTED** | Winsock socket teardown informs only the host socket layer; asynchronous CUDA kernels continue decoding until the next token flush/poll. |
| **EV-10** | Process SIGKILL of `LM Studio.exe` is safe on Windows 11 | **CONTRADICTED / UNSAFE** | Monolithic desktop GUI app; killing it orphans WDDM VRAM allocations and causes file sharing violations. |
| **EV-11** | V8.31 linear while loop desynchronizes on combining marks | **VERIFIED** | UAX #15 Canonical Combining Class (CCC) reordering swaps codepoints, causing runaway loop desync and offset corruption. |
| **EV-12** | `--no-mmap` isolates multi-tenant KV caches | **CONTRADICTED** | `--no-mmap` controls file-backed memory mapping of model weights from disk to RAM; zero relationship to dynamic VRAM KV cache tensors. |
| **EV-13** | Bearer tokens provide hard cryptographic isolation on localhost | **CONTRADICTED / OVERSTATED**| Any process running under the same Windows 11 user session can read memory via Win32 `ReadProcessMemory` or snoop loopback traffic. Tokens are cooperative namespace tags. |
| **EV-14** | Exact Qwen2.5-7B FP16 KV cache footprint is 56.0 KiB/token | **VERIFIED** | GQA architecture ($N_L = 28$, $n_{kv} = 4$, $d_h = 128$, FP16): $2 \times 4 \times 128 \times 28 \times 2 = 57,344\text{ bytes} = 56.0\text{ KiB}$. |
| **EV-15** | Central GPU Gateway on port 3333 currently exists | **CONTRADICTED** | Port 3333 is not listening. Current `server.py` directly connects to `127.0.0.1:1234`. |
| **EV-16** | Gateway can address and manage individual LM Studio slots | **CONTRADICTED** | LM Studio OpenAI API does not accept slot parameters; internal slot allocation is strictly encapsulated in C++. |
| **EV-17** | Token 0 nonce purges KV cache memory from VRAM | **CONTRADICTED** | Changing token 0 prevents prefix tree sharing; it does not zero or purge unallocated or trailing KV memory blocks. |
| **EV-18** | Monotonic codepoint-to-byte index holds across NFC CCC reordering | **CONTRADICTED** | Sorting combining marks non-monotonically scrambles raw byte offset sequences ($3 \not\le 1$). |

---

## 3. SIX-AGENT AUDIT FINDINGS

### Agent A: Backend Cancellation and GPU Lifecycle
* **Finding 1 (Socket EOF/RST Compute Equivalence):** **CONTRADICTED**. In `llama.cpp`/LM Studio, TCP socket events and GPU CUDA streams run asynchronously. A client disconnect or upstream socket reset causes a socket write failure only when the server attempts to flush a generated token. BLAS GEMM prompt prefill and in-flight iteration kernels cannot be halted mid-kernel. Treating EOF/RST as proof of compute completion causes GPU collisions.
* **Finding 2 (Line 218 & Line 235 Refuted):** Line 218 (*"Socket receives EOF/RST within T_drain <= 15s -> Transitions to SLOT_IDLE (Permit Released)"*) and Line 235 (*"proving compute has ceased; Permit Safely Released"*) are unsafe and contradicted. Releasing permits on socket teardown risks allocating new requests while the backend is still unwinding.
* **Finding 3 (Line 326 60s Timeout Ambiguity):** Line 326 states: *"Max Generation Duration: 60.0s | Socket RST -> HTTP 504"*. The spec fails to define the backend FSM transition. If returning 504 immediately unlocks the permit, it violates the quarantine invariant; if it locks the permit, it causes a DoS.

### Agent B: LM Studio Slot Observability and Recovery
* **Finding 1 (Slot Observability Absence):** **CONTRADICTED**. LM Studio abstracts `llama.cpp`'s internal slots ($n_{\text{slots}} = 4$) behind a desktop proxy. It does not route `GET /slots` (EV-08) and does not support slot parameters in `/v1/chat/completions`. The Gateway has zero ability to identify, reserve, inspect, or recover a specific internal slot.
* **Finding 2 (`slot_ledger` Schema Fiction):** Lines 403–415 define a table `slot_ledger (slot_id INTEGER PRIMARY KEY, ...)`. In Option C ($N_{\text{permits}} = 1$), this table actually tracks the **Gateway's logical permit lease**, not an LM Studio internal slot. Naming it `slot_ledger` creates an architectural fiction.
* **Finding 3 (Contradicted Diagnostic Probes in Recovery):** Lines 226–227 (`SLOT_RECOVERING -> Diagnostic Probe Confirms Idle -> SLOT_IDLE`) and Lines 457–460 (Boot-time non-inference verification restoring permits) directly contradict EV-06 (ping probes hit idle secondary slots) and EV-07 (`GET /v1/models` returns 200 OK while CUDA threads are at 100%).

### Agent C: KV-Cache and Tenant Isolation
* **Finding 1 (Reclassification of Root Nonce):** Section 10.3 claims root nonce injection at token 0 guarantees "absolute tenant isolation". This is **CONTRADICTED**. It is an **experimental prompt-level cache-prefix mitigation**.
* **Finding 2 (VRAM Retention):** A unique prefix prevents prefix-tree radix matches in `llama.cpp`, but neither `llama.cpp` nor LM Studio zeroes inactive KV cache buffers (`cudaMemset` is not called). Prior tenant context remains resident in unallocated GDDR6 memory.
* **Finding 3 (Single-User Windows 11 Boundary):** Under a single Windows user session, any local process can inspect memory via `ReadProcessMemory`, sniff loopback sockets, or read SQLite files. Bearer tokens are cooperative namespace tags only.

### Agent D: Unicode Normalization and Byte Provenance
* **Finding 1 (Dual-Layer IPM Soundness):** The interval model partitioning input text into disjoint intervals $\bigcup I_k$ anchored at UTF-8 lead bytes, CCC == 0, and structural delimiters is **VERIFIED** and mathematically sound.
* **Finding 2 (Monotonic Index Refuted):** Section 11.3’s formula $\mathbf{M}_k[i] \le \mathbf{M}_k[i+1]$ over individual codepoints is **CONTRADICTED**. When combining marks are reordered (e.g. $C + \text{CCC 230} + \text{CCC 220} \to C + \text{CCC 220} + \text{CCC 230}$), the raw byte offsets become non-monotonic ($[0, 3, 1, 5]$). Monotonic mapping holds **strictly at the Extended Grapheme Cluster (EGC) boundary level (UAX #29)**.
* **Finding 3 (Testing Harness Missing):** The 25 synthetic `.bin` test fixtures and property-based test harness (Hypothesis) specified in TM-10 are technically supported but currently unauthored.

### Agent E: FSM, SQLite, Idempotency, Timeouts & Scheduler Consistency
* **Finding 1 (FSM Count Discrepancy & Orphaned State):** Section 7 asserts 8 states, but the diagram only contains 7. `SLOT_RESETTING` appears in the SQLite `CHECK` constraint (line 409) and boot SQL (line 455), but is absent from the FSM diagram and transition definitions.
* **Finding 2 (Ring Buffer Overwrite Failure Mode):** The 256 KB replay ring buffer leaves behavior undefined when an in-flight generation produces $>256\text{ KB}$ of stream data before a duplicate observer connects.
* **Finding 3 (Scheduler Underspecification):** The dynamic aging equation lacks explicit base weight numerical constants, time units, and deterministic tie-breaking.

### Agent F: Independent Red-Team Audit
* **Finding 1 (Challenge of Claims A–E):** Confirmed all findings from Agents A–E. Acknowledged that V8.32 resolved major historical bugs (active ping probes, SIGKILL, hardware model drift), but introduced new contradictions in recovery and cancellation.
* **Finding 2 (Hardware Table Grounding):** Established strict segregation between direct hardware measurements, runtime log observations, mathematical estimates, and untested predictions.
* **Finding 3 (Current vs Target Topology):** Verified that `server.py` currently talks directly to `:1234` with an in-process `Semaphore(2)`; port 3333 does not yet exist.
* **Finding 4 (Implementation Gate):** Recommended **CONDITIONAL GO** with zero code authorization until specification corrections are locked.

---

## 4. INDEPENDENT RED-TEAM FINDINGS (SYNTHESIS & CHALLENGES)

Agent F independently challenged the assumptions of Agents A–E:

1. **Challenge to Agent A (Cancellation):** Is it possible that `llama.cpp` halts decode quickly enough that a passive drain window of 15s is always sufficient?  
   *Red-Team Conclusion:* No. Under heavy prompt prefill (e.g. 2,500 tokens), BLAS matrix multiplication runs in non-preemptible CUDA kernels that can monopolize the GPU for several seconds regardless of socket state. Furthermore, if Windows Winsock buffers absorb the RST without immediately interrupting the server loop, the server continues generating. The permit must remain locked in `SLOT_QUARANTINED` unless confirmed idle by a demonstrably reliable signal.
2. **Challenge to Agent B (Observability):** Can we query LM Studio process CPU/GPU utilization via NVML or OS performance counters to detect idleness?  
   *Red-Team Conclusion:* While theoretically possible, reading NVML GPU compute utilization is shared across all processes (including Windows DWM). In a laptop chassis, DWM rendering spikes GPU utilization to 20–40%, making GPU utilization a noisy, unreliable indicator of backend idleness. A software proxy cannot safely infer engine idleness from OS counters alone.
3. **Challenge to Agent C (KV-Cache):** Does token 0 divergence prevent attentional bleed in practice?  
   *Red-Team Conclusion:* Yes, prefix-tree matching in `llama.cpp` branches at token 0, which prevents reusing previously cached prompt states. However, calling this "guaranteed physical isolation" is a dangerous misnomer that misleads security reviews. It must be strictly branded as cache-prefix mitigation.
4. **Challenge to Agent D (Unicode):** Does EGC snapping introduce unacceptable overhead?  
   *Red-Team Conclusion:* No. Operating on short intervals ($<64$ codepoints) makes UAX #29 regex/table lookups negligible in Python ($<1\text{ms}$ per interval).

---

## 5. CORRECTED REQUEST FSM (DOWNSTREAM CLIENT PERSPECTIVE)

The Downstream Request Lifecycle FSM governs client connections across **10 deterministic states**. It is completely decoupled from backend GPU internals:

```
  [REQ_RECEIVED] ──(Validation / Queue Full)──► [REQ_REJECTED (4xx/503)]
        │
  (Admitted to Queue)
        ▼
   [REQ_QUEUED] ──(Queue Wait > 30.0s)────────► [REQ_TIMED_OUT (504)]
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

### Request FSM Invariants:
1. `REQ_QUEUED -> REQ_CANCELLED`: Occurs when downstream client disconnects before acquiring a permit. Dequeued with zero backend impact.
2. `REQ_PROCESSING / REQ_STREAMING -> REQ_CLIENT_ABORTED`: Occurs when downstream client drops the socket during active processing. The downstream connection is terminated, and a drain signal is dispatched to the Backend Resource FSM.
3. **Permit Independence:** Downstream state transitions do **not** directly release the logical permit. The permit is governed strictly by the Backend Resource FSM.

---

## 6. CORRECTED BACKEND RESOURCE FSM (UPSTREAM PERSPECTIVE)

To eliminate architectural fictions, the backend FSM is renamed from "Backend Slot FSM" to **Backend Resource FSM**, and the table is renamed from `slot_ledger` to `backend_lease_ledger`. It governs the single logical execution permit across **7 verified states** (purging the orphaned `SLOT_RESETTING` state):

```
       ┌────────────────────────────────────────────────────────┐
       │                                                        │
       ▼                                                        │ (Confirmed Operator Manual Reset)
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
               │ (Gateway Diagnostic Isolation - No Active Probes)
               ▼
       [RESOURCE_FATAL_HALT] (Permit PERMANENTLY LOCKED; Requires Operator Action)
```

### Corrected State Enumeration (Exactly 7 States):
1. `RESOURCE_IDLE`: Backend is confirmed free. Logical permit is available in the pool.
2. `RESOURCE_RESERVED`: Logical permit allocated to request; HTTP client preparing connection.
3. `RESOURCE_ACTIVE`: HTTP request active on upstream socket; tokens actively streaming.
4. `RESOURCE_DRAINING`: Client aborted or generation timed out. Gateway passively waits up to $T_{\text{drain}} = 15.0\text{s}$ for the backend to emit `[DONE]`. Permit remains **LOCKED**.
5. `RESOURCE_QUARANTINED`: Upstream socket closed unexpectedly, emitted error, or exceeded $T_{\text{drain}}$. Backend state is uncertain. Permit remains **PERMANENTLY LOCKED**.
6. `RESOURCE_FATAL_HALT`: Unrecoverable backend condition. Gateway enters fail-stop mode. Operator must restart LM Studio and signal reset.
7. *(Purged State):* `SLOT_RESETTING` is **PERMANENTLY DELETED**. Socket reset is an internal transport action within `RESOURCE_DRAINING`, not an independent FSM state.

---

## 7. SAFE CANCELLATION AND QUARANTINE SEMANTICS

### The Six Distinct Lifecycle Layers
The Gateway must never conflate network transport events with GPU execution:
1. **Client Socket Closure:** Client terminates connection to Gateway (`127.0.0.1:3333`).
2. **Upstream TCP Closure:** Gateway closes or resets TCP connection to LM Studio (`127.0.0.1:1234`).
3. **HTTP Request Termination:** LM Studio HTTP server detects socket close and aborts response.
4. **llama.cpp Request Cancellation:** LM Studio inference loop detects abort and cleans slot context.
5. **CUDA Kernel Completion:** Asynchronous GPU CUDA kernels finish executing on hardware.
6. **Backend Resource Availability:** Slot KV memory is clean; GPU is ready for new prompt prefill.

### Strict Permit Release Invariants
$$\mathbf{INVARIANT\text{ }1:}\quad \text{PermitPool.Release}() \iff \text{Backend Event} \equiv \text{STREAM\_DONE}$$
$$\mathbf{INVARIANT\text{ }2:}\quad \text{Backend Event} \in \{\text{EOF}, \text{ECONNRESET}, \text{TCP\_RST}, \text{TIMEOUT}\} \implies \text{Transition}(\text{RESOURCE\_QUARANTINED})$$

* **Rule 1 (Zero Release on EOF/RST):** Receiving TCP FIN (EOF), `ECONNRESET`, or sending `SO_LINGER=0` RST does **NOT** release the permit.
* **Rule 2 (Zero Release on Timeout):** Expiration of the 60.0s execution deadline or 15.0s drain window unconditionally locks the permit in `RESOURCE_QUARANTINED`.
* **Rule 3 (Zero Active Ping Probing):** Active ping probes (sending 1-token requests) are permanently prohibited because they route to idle secondary slots ($n_{\text{slots}} = 4$).
* **Rule 4 (Zero Process SIGKILL):** Gateway must never issue `TerminateProcess` or `SIGKILL` against `LM Studio.exe`.

---

## 8. CRASH RECOVERY PROTOCOL

### Boot-Time State Reconciliation
When the Gateway starts up:
1. **Database Integrity:** Execute `PRAGMA integrity_check` on `gateway_state.db`.
2. **Atomic In-Flight Quarantine:** Any lease recorded in `RESOURCE_RESERVED`, `RESOURCE_ACTIVE`, or `RESOURCE_DRAINING` is transitioned to `RESOURCE_QUARANTINED`:
   ```sql
   UPDATE backend_lease_ledger
   SET fsm_state = 'RESOURCE_QUARANTINED',
       last_heartbeat_utc = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
   WHERE fsm_state IN ('RESOURCE_RESERVED', 'RESOURCE_ACTIVE', 'RESOURCE_DRAINING');
   ```
3. **Prohibition of Silent Auto-Recovery:**  
   The Gateway must **NOT** restore permits to `RESOURCE_IDLE` based on:
   - `LM Studio.exe` process liveness (`backend_pid` check).
   - `GET /v1/models` returning HTTP 200 OK.
   - Successful TCP connection establishment to port 1234.
4. **Operator Reset Gate:**  
   If a lease was quarantined on boot, the permit remains locked. Admissions return `503 Service Unavailable`. The operator must explicitly verify that LM Studio is idle (or restart LM Studio) and execute the authorized manual recovery endpoint:
   `POST /v1/admin/reset-quarantine` (requiring admin credentials).

---

## 9. CORRECTED KV-CACHE ISOLATION CLASSIFICATION

1. **Reclassification:** Root nonce injection (`<|project_isolation_id: {Project_ID}_{HexDigest32}|>\n` at token position 0) is classified as an **Experimental Prompt-Level Cache-Prefix Mitigation**.
2. **Memory Retention Reality:** Prepending a nonce defeats `llama.cpp` radix-tree prefix matching across projects, forcing clean evaluation forward from token 0. However:
   - It does **not** erase or zero previously allocated KV cache memory in VRAM.
   - It does **not** provide physical or virtual memory isolation.
   - It does **not** protect against malicious processes running under the same Windows user session.
3. **Multi-Tenant Boundaries:** True adversarial multi-tenant confidentiality cannot be enforced via software proxy on localhost. The security model is strictly **Cooperative Local Project Scoping**.

---

## 10. CORRECTED UNICODE PROVENANCE MODEL

### 10.1 Mathematical Refutation of Codepoint-Monotonic Index
In Section 11.3, the spec proposed a secondary monotonic index array $\mathbf{M}_k \in \mathbb{N}^{M_k + 1}$ mapping canonical codepoint index $i$ to raw byte offset $N_k$, asserting $\mathbf{M}_k[i] \le \mathbf{M}_k[i+1]$.  
**This assertion is mathematically false** under UAX #15 Canonical Combining Class (CCC) reordering:
- Base character $C$ (1 byte at offset 0).
- Mark $M_1$ (CCC 230, 2 bytes at offset 1..3).
- Mark $M_2$ (CCC 220, 2 bytes at offset 3..5).
- Normalized NFC sequence sorts marks by CCC ascending: $C + M_2 + M_1$.
- Canonical codepoints map to raw byte offsets: $[0, 3, 1, 5]$.  
Because $3 \not\le 1$, the index is **strictly non-monotonic**.

### 10.2 Corrected Extended Grapheme Cluster (EGC) Provenance Model
Monotonicity holds **strictly at the Extended Grapheme Cluster (UAX #29) boundary level**:
1. Partition input into intervals $I_k$ anchored at UTF-8 lead bytes, CCC == 0, and structural delimiters.
2. Each interval $I_k$ maintains a **Grapheme Cluster Provenance Map** $\mathbf{G}_k$, mapping grapheme cluster index $g$ monotonically to raw byte spans:
   $$\mathbf{G}_k[g] = [\text{raw\_byte\_start}, \text{raw\_byte\_end}), \quad \mathbf{G}_k[g].\text{start} \le \mathbf{G}_k[g+1].\text{start}$$
3. Any sub-interval citation $[c_{\text{start}}, c_{\text{end}})$ in Layer 1 text must snap outward to enclosing grapheme cluster boundaries:
   $$c_{\text{start}}' = \text{GraphemeStart}(c_{\text{start}}), \quad c_{\text{end}}' = \text{GraphemeEnd}(c_{\text{end}})$$
4. Raw bytes remain immutable. Exact original byte spans are recovered via $\mathbf{G}_k$.

### 10.3 Synthetic Property-Based Test Matrix
Testing must be performed exclusively against 25 synthetic `.bin` fixtures covering:
1. NFC / NFD equivalence (Spanish/Basque vowels + combining accents).
2. CCC != 0 reordering permutations.
3. CR, LF, and CRLF line ending combinations.
4. Hangul Conjoining Jamo syllable composition.
5. ZWJ emoji sequences and skin tone modifiers.
6. Continuous unspaced scripts (Thai, Lao) with $>64$ codepoint fallback.
7. CJK ideographic punctuation and character boundaries.
8. Truncated and invalid UTF-8 byte sequences.

---

## 11. CORRECTED SCHEDULER AND IDEMPOTENCY SEMANTICS

### 11.1 Dynamic Priority Aging Specification
The priority queue min-heap evaluates dynamic priority using explicitly defined constants:
$$\text{EffectivePriority}(R) = \text{BaseWeight}(\text{Class}) - (W_{\text{age}} \times (t_{\text{now}} - t_{\text{enqueued}}))$$
- **Class Weights:**
  - $\text{BaseWeight}(\text{P0}) = 0$
  - $\text{BaseWeight}(\text{P1}) = 1,000$
  - $\text{BaseWeight}(\text{P2}) = 2,000$
- **Aging Rate:** $W_{\text{age}} = 50\text{ points/second}$ ($t$ in seconds). (A P2 request waiting 20s reaches effective priority 1,000, competing with fresh P1 requests).
- **Tie-Breaking Rule:** If $\text{EffectivePriority}(A) == \text{EffectivePriority}(B)$, tie-break deterministically by $\text{FIFO}(t_{\text{enqueued}})$. If still equal, tie-break by lexicographical `request_id`.
- **Absolute Starvation Bound:** Hard queue wait timeout $T_{\text{wait\_max}} = 30.0\text{s}$ (evicts with HTTP 504).
- **Option B Status:** Option B ($1\text{ general} + 1\text{ reserved } P0$) remains **STRICTLY BLOCKED**. Baseline is Option C ($N_{\text{permits}} = 1$).

### 11.2 Circular Replay Ring Buffer Bounds
- **Capacity:** 256 KB in-memory ring buffer per in-flight request.
- **Late Observer Bound:** If an in-flight stream's total output exceeds 256 KB, early tokens are overwritten. If a late observer joins after token 0 has been evicted:
  - Gateway does **not** corrupt the stream.
  - Gateway returns **HTTP 425 Too Early** (`STREAM_REPLAY_BUFFER_OVERFLOW`) advising the client to wait for final generation completion in SQLite.
- **Payload Mismatch:** Handled immediately with **HTTP 409 Conflict**.
- **Observer Disconnect:** Secondary observer drops socket $\implies$ observer reader task closes; primary backend stream continues unaffected.

---

## 12. HARDWARE MEASUREMENT VERSUS ESTIMATE TABLE

To prevent speculative inflation, all hardware and performance metrics are strictly categorized:

| Metric / Parameter | Value in Spec | Epistemic Classification | Grounding & Empirical Source |
| :--- | :--- | :---: | :--- |
| **Physical GPU Model** | NVIDIA GeForce RTX 4080 Laptop GPU | **DIRECT HARDWARE MEASUREMENT** | WMI query (`Win32_VideoController`) & LM Studio log line 475. |
| **Total Physical VRAM** | 12,282 MiB GDDR6 | **DIRECT HARDWARE MEASUREMENT** | WMI query & LM Studio log line 475. |
| **Windows OS / DWM Reserve** | 1,870 MiB (1,800–1,915 MiB) | **RUNTIME LOG OBSERVATION** | LM Studio log line 475 (`Used: 1.87 GB, Free: 11.01 GB`). |
| **Model Weights (Q4_K_M)** | 4,935 MiB (4.82 GB) | **RUNTIME LOG OBSERVATION** | LM Studio model loader log & disk size. |
| **KV Cache Footprint** | **56.0 KiB / token** ($57,344$ B) | **MATHEMATICAL CALCULATION** | Exact GQA formula: $2 \times 4 \times 128 \times 28 \times 2\text{ B}$. |
| **KV Cache @ 16,384 tokens**| 896.0 MiB | **MATHEMATICAL CALCULATION** | Exact formula: $16,384 \times 57,344\text{ B} = 896\text{ MiB}$. |
| **CUDA Context / Scratchpad**| ~650 MiB | **MATHEMATICAL ESTIMATE** | cuBLAS workspace heuristic; unmeasured via NVML. |
| **Total Committed Runtime VRAM**| 8,351 MiB | **MATHEMATICAL ESTIMATE** | Sum: OS (1,870) + Model (4,935) + Scratch (650) + KV (896). |
| **Unallocated Headroom** | 3,931 MiB (32.0%) | **MATHEMATICAL ESTIMATE** | Difference: $12,282\text{ MiB} - 8,351\text{ MiB}$. |
| **Sustained Throughput** | 70–95 tokens/second | **UNTESTED PREDICTION** | Memory bandwidth theoretical calculation; unverified by live run. |
| **GPU Power Draw** | 80 W – 115 W | **UNTESTED PREDICTION** | OEM mobile TGP envelope; unmeasured via `pynvml`. |
| **GPU Operating Temp** | 68 °C – 74 °C | **UNTESTED PREDICTION** | Optimal thermal dissipation model; unmeasured under batch load. |
| **Prompt Prefill TTFT** | $<1.2\text{s}$ multi-slot TTFT | **UNTESTED PREDICTION** | BLAS kernel estimate; unmeasured on this chassis. |

---

## 13. OUTSTANDING UNKNOWNS

The following items cannot be settled by static analysis and require empirical instrumentation in Phase 1:
1. **CUDA Stream Asynchronous Linger:** The precise millisecond distribution between upstream TCP RST and CUDA thread idle on this mobile chassis.
2. **Winsock Loopback RST Latency:** The delay between Gateway socket reset and LM Studio's event loop detecting `WSAECONNRESET`.
3. **Qwen2.5 Nonce Tokenization Overhead:** The exact number of BPE tokens consumed by `<|project_isolation_id:...|>`.
4. **Thermal Throttling Threshold:** Whether long continuous generations (>30 minutes) at high ambient temperatures cause clock throttling on the RTX 4080 Laptop GPU.

---

## 14. EXACT IMPLEMENTATION BLOCKERS

The following blockers must be addressed before writing any production Gateway code:
1. **Blocker 1 (FSM Schema Synchronization):** Update SQLite schema to replace `slot_ledger` with `backend_lease_ledger`, purge `SLOT_RESETTING`, and enforce the 7 verified states.
2. **Blocker 2 (Quarantine Lock Enforcement):** Remove all code paths and recovery logic that unlock permits on timeout, EOF, RST, or generic HTTP responses.
3. **Blocker 3 (Unicode EGC Formulation):** Replace codepoint monotonic indexing with UAX #29 Extended Grapheme Cluster span mapping.
4. **Blocker 4 (Replay Buffer Overflow Protocol):** Specify HTTP 425 response handling for ring buffer overflows.
5. **Blocker 5 (Synthetic Harness Preparation):** Generate the 25 deterministic `.bin` fixtures in `./tests/fixtures/synthetic_ingestion/`.

---

## 15. V8.33 STAGED IMPLEMENTATION PROPOSAL

Implementation will proceed strictly across 5 sequential, gated phases:

```
[Phase 1: Verification Baseline] ──► Test TM-01 (In-Memory MCP Echo on SDK 2.3.0)
             │
[Phase 2: Storage & Schemas]   ──► Implement SQLite WAL backend_lease_ledger & idempotency_ledger
             │
[Phase 3: Core Gateway Daemon]  ──► Implement Gateway (:3333) with Option C (N_permits=1)
             │
[Phase 4: Ingestion & IPM]     ──► Implement Dual-Layer Unicode IPM & 25 Synthetic Fixtures
             │
[Phase 5: Client Migration]    ──► Point server.py to :3333 and Stress-Test Option C
```

- **Phase 1 (Baseline Verification):** Run standalone MCP echo test (`gpu_bridge_echo`). Verify zero side-effects.
- **Phase 2 (Persistent Storage):** Implement SQLite database with WAL mode and corrected 7-state lease ledger.
- **Phase 3 (Core Gateway):** Build asyncio HTTP service on `127.0.0.1:3333` with single-permit priority scheduler, 10-state Request FSM, 7-state Backend FSM, and passive drain supervisor.
- **Phase 4 (Unicode IPM & Fixtures):** Implement interval partitioning with EGC snapping and run against 25 synthetic `.bin` fixtures. Real WhatsApp data remains sealed.
- **Phase 5 (Client Migration & Telemetry):** Update `v825-gpu-bridge/server.py` to route requests through `http://127.0.0.1:3333`, logging true empirical tokens/s, power, and thermals.

---

## 16. EXPLICIT AUTHORIZATION REQUIREMENTS FOR FUTURE CODE CHANGES

Any future transition from specification to code implementation requires **explicit user authorization** satisfying all of the following conditions:
1. **User Approval of V8.32.1:** User must review and approve this corrective document (`V8_32_1_CRITICAL_CORRECTIONS.md`).
2. **Phase-by-Phase Gating:** Authorization must be granted on a strict per-phase basis (starting with Phase 1 only).
3. **Option C Immutability:** No code may implement Option B ($1+1$) or increase $N_{\text{permits}} > 1$ without prior empirical benchmarks demonstrating zero DWM VRAM eviction.
4. **Permanent Quarantine of Real Data:** No script, agent, or test may open or access `C:\Users\User\Desktop\whatsapp_chats_zip`.

---

## 17. AUDIT & METADATA LEDGER

- **Exact List of Files Inspected:**
  1. `C:\Users\User\Desktop\agenc-ia\V8_32_GATEWAY_CORRECTED_IMPLEMENTATION_SPEC.md`
  2. `C:\Users\User\Desktop\agenc-ia\V8_31C_FINAL_TECHNICAL_VALIDATION.md`
  3. `C:\Users\User\Desktop\agenc-ia\V8_31B_EVIDENCE_RECONCILIATION_AUDIT.md`
  4. `C:\Users\User\Desktop\agenc-ia\V8_31A_INDEPENDENT_RED_TEAM_AUDIT.md`
  5. `C:\Users\User\Desktop\agenc-ia\v825-gpu-bridge\server.py`
  6. `C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\package.json`
- **Exact List of Files Created:**
  1. `C:\Users\User\Desktop\agenc-ia\V8_32_1_CRITICAL_CORRECTIONS.md`
- **Agents Actually Launched in Parallel:**
  1. `28eb723b-ccbc-403c-b5c6-6443f87bc4ef` — Agent A (Backend Cancellation & GPU Lifecycle)
  2. `5451d199-bc9d-45f8-9bc2-e90aeccb7767` — Agent B (LM Studio Slot Observability & Recovery)
  3. `1978ccb8-6a6a-4fb7-964f-132a22fbac27` — Agent C (KV-Cache & Tenant Isolation)
  4. `6bb0850d-e00d-4706-af31-188385a2d254` — Agent D (Unicode Normalization & Byte Provenance)
  5. `26ccabe8-6684-4634-b9c7-a8bf0813e658` — Agent E (FSM, SQLite, Idempotency & Scheduler)
  6. `37078953-2dcd-4d05-a386-2aa293861a8c` — Agent F (Independent Red-Team Auditor)
- **Tests Performed:** Static code inspection, specification consistency checks, mathematical KV-cache verification, and state transition invariant validation.
- **Tests Not Performed:** Live GPU token generation and benchmark executions (strictly deferred to authorized phases).
