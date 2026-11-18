# V8.31 — GPU GATEWAY SECURITY & QUARANTINED INGESTION SPECIFICATION

**Document Version:** 8.31.0  
**Phase:** V8.31 Technical Architecture Specification  
**Classification:** READ-ONLY ARCHITECTURAL SPECIFICATION & SYSTEM DESIGN  
**Authority:** Incorporating V8.30-D, V8.30-E Red-Team Audit, and V8.30-F Remediation Validation  
**Target Delivery Path:** `C:\Users\User\Desktop\agenc-ia\V8_31_GATEWAY_SECURITY_INGESTION_SPECIFICATION.md`  
**Execution Status:** SPECIFICATION STAGE ONLY — STRICT STOP ON CODE IMPLEMENTATION, DEPLOYMENT, AND REAL-DATA INGESTION  

---

## 1. EXECUTIVE ARCHITECTURE SUMMARY

### 1.1 Objective and Scope
V8.31 establishes the authoritative technical blueprint for a centralized, secure, multi-project local GPU Gateway and a quarantined, synthetic-only ingestion pipeline. This architecture bridges the gap between client environments (specifically native Antigravity orchestrators and MCP bridge clients) and a shared local Large Language Model runtime (LM Studio running `llama.cpp` over an NVIDIA GeForce RTX 3060 12GB VRAM GPU).

This specification resolves critical architectural vulnerabilities and operational blindspots surfaced across previous phases:
1. **Multi-Process Concurrency Contention:** Multiple independent worker processes or MCP bridges attempting to coordinate GPU access without a centralized arbiter trigger out-of-memory (OOM) faults, thermal throttling, socket deadlocks, and context evictions.
2. **Cancellation False-Assumption Vulnerabilities:** Misplaced trust in TCP drops or HTTP `/v1/models` probes to infer inference aborts leads to scheduler permit exhaustion or concurrent token generation collisions.
3. **Cross-Project Memory and Data Contamination:** Lack of strict project token identity boundaries at the Gateway level risks prompt leakage across separate repositories or tenant workspaces.
4. **Forensic Provenance Loss:** Re-encoding or normalizing raw texts at ingestion destroys the cryptographic chain-of-custody, invalidating judicial or forensic evidence audits.
5. **Real-Data Ingestion Risks:** Premature parsing of production WhatsApp corpora before parser verification creates unrecoverable identity graph pollution and privacy exposure.

### 1.2 Architectural Principles
- **Centralized Authoritative Scheduling:** Exactly one Gateway process listens on `127.0.0.1:3333`. No peripheral worker or MCP process may maintain an independent scheduler.
- **Conservative Resource Allocation (Option C Baseline):** Exactly 1 general inference permit ($N_{\text{permits}} = 1$) is issued across the entire local machine. Virtual concurrency slots are explicitly rejected.
- **Strict Trust Isolation:** The inference backend (LM Studio on `127.0.0.1:1234`) is treated as an unauthenticated, untrusted execution sandbox. All security, authentication, rate limiting, and parameter validation are enforced exclusively by the Gateway.
- **Dual-Layer Bit-Exact Provenance:** Raw binary bytes remain immutable as Layer 0 (Legal Root of Trust). Operational text processing operates on Layer 1 (Canonical NFC + LF) via an explicitly calculated offset translation map.
- **Zero Real Data in V8.31:** Ingestion interfaces are restricted strictly to deterministic synthetic fixtures. Real WhatsApp archives (`C:\Users\User\Desktop\whatsapp_chats_zip`) remain completely sealed.

---

## 2. COMPONENT ARCHITECTURE & TOPOLOGY

```
+───────────────────────────────────────────────────────────────────────────────────────────+
│                               HOST ENVIRONMENT (Windows 11)                               │
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
│               └───────────────┬───────────────┴─────────────────────────────┘             │
│                               │                                                           │
│                               ▼                                                           │
│       ====================================================================                │
│       TRUST BOUNDARY 1: RESTRICTED LOOPBACK (127.0.0.1:3333)                              │
│       ====================================================================                │
│       +──────────────────────────────────────────────────────────────────+                │
│       │                 CENTRAL GPU GATEWAY SERVICE                      │                │
│       │                                                                  │                │
│       │  [Token Auth & Identity]   [Rate Limiting & Project Quotas]      │                │
│       │  [Parameter Validation]    [Authoritative Scheduler (Option C)]  │                │
│       │  [Cancellation Monitor]    [Active Health Prober]                │                │
│       │  [Audit Logger]            [Connection Pool Manager]             │                │
│       +────────────────────────────────┬─────────────────────────────────+                │
│                                        │                                                  │
│                                        │ Streaming HTTP / SSE                             │
│                                        │ Persistent Keep-Alive                            │
│                                        ▼                                                  │
│       ====================================================================                │
│       TRUST BOUNDARY 2: UNPROTECTED INTERNAL INFERENCE (127.0.0.1:1234)                   │
│       ====================================================================                │
│       +──────────────────────────────────────────────────────────────────+                │
│       │                LM STUDIO 0.4.27 (llama.cpp Engine)               │                │
│       │                                                                  │                │
│       │  - Resident Model: Qwen2.5-7B-Instruct-Q4_K_M                    │                │
│       │  - VRAM Context: 4,096 tokens (FP16 KV Cache)                    │                │
│       │  - Physical Hardware: NVIDIA RTX 3060 12GB VRAM                  │                │
│       +──────────────────────────────────────────────────────────────────+                │
+───────────────────────────────────────────────────────────────────────────────────────────+
```

### Component Responsibility Breakdown

| Component | Host / Runtime | Network / Transport | Responsibilities | Security Posture |
| :--- | :--- | :--- | :--- | :--- |
| **Antigravity Orchestrator** | Node / Electron Desktop Workstation | Native Memory / Child Process | High-level goal planning, subagent coordination, prompt formulation. | Trusted client application. |
| **MCP Bridge Process** | Python 3.11 child process (`v825-gpu-bridge`) | `stdio` to Antigravity; HTTP client to Gateway | Translates JSON-RPC tool calls into Gateway HTTP requests. Holds project secret. | Process-isolated client agent. |
| **Central GPU Gateway** | Standalone Python (FastAPI/uvicorn or asyncio daemon) | `127.0.0.1:3333` TCP | Authenticates projects, enforces single permit concurrency, handles aborts, validates schemas, monitors backend. | **Authoritative Security & Admission Boundary.** |
| **LM Studio Backend** | Standalone Desktop C++ runtime (`llama.cpp`) | `127.0.0.1:1234` TCP | Raw tensor computations, CUDA kernel execution, autoregressive token decode. | **Untrusted internal sandbox.** Zero auth, zero multi-tenancy awareness. |

---

## 3. TRUST BOUNDARIES AND ACCESS MATRIX

### 3.1 Boundary Definitions

1. **Boundary Alpha (Orchestrator to MCP Bridge):**
   - *Interface:* Standard OS pipes (`stdin`/`stdout`).
   - *Trust Model:* Process-level containment within Windows 11 desktop user session. Antigravity acts as parent; MCP server acts as child.
   - *Risk:* Crash of child process terminates stdio channel; stdio logging corruption by unescaped debug outputs breaking JSON-RPC framing.

2. **Boundary Beta (MCP Bridge / Client to Gateway):**
   - *Interface:* Loopback HTTP/1.1 or HTTP/2 at `127.0.0.1:3333`.
   - *Trust Model:* Mutual distrust. Gateway requires authenticated Bearer tokens mapped to pre-configured Project IDs. Gateway rejects any request exceeding configured rate limits, token lengths, or invalid schemas.
   - *Risk:* Token theft across local processes; denial-of-service via socket flooding; ungraceful socket drop during active generation.

3. **Boundary Gamma (Gateway to LM Studio Backend):**
   - *Interface:* Loopback HTTP/1.1 at `127.0.0.1:1234`.
   - *Trust Model:* Gateway treats LM Studio as an unhardened, non-isolated execution engine. LM Studio possesses NO concept of multi-tenancy, NO request authorization, and NO memory access controls.
   - *Risk:* Silent hangs in CUDA runtime; memory leakage; partial generation completion without client receipt; crash of backend under concurrent HTTP connections.

### 3.2 Access and Capability Matrix

| Role / Actor | Read Health | Submit Inference | Inspect Queue | Abort Own Request | Abort Foreign Request | Ingest Real WhatsApp |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Unauthenticated Client** | ❌ (Denied 401) | ❌ (Denied 401) | ❌ (Denied 401) | ❌ (Denied 401) | ❌ (Denied 401) | ❌ (Blocked) |
| **Project `getxo-vela`** | ✅ (Scoped) | ✅ (Quota: 1) | ✅ (Own jobs) | ✅ | ❌ (Denied 403) | ❌ (Blocked V8.31) |
| **Project `other-client`** | ✅ (Scoped) | ✅ (Quota: 1) | ✅ (Own jobs) | ✅ | ❌ (Denied 403) | ❌ (Blocked V8.31) |
| **Gateway Supervisor** | ✅ (Full) | ✅ (Direct Probe)| ✅ (All jobs) | ✅ (Any) | ✅ (Any) | ❌ (Blocked V8.31) |
| **LM Studio Backend** | N/A | N/A | N/A | N/A | N/A | ❌ (No filesystem access) |

---

## 4. REQUEST LIFECYCLE & SCHEDULER DESIGN

### 4.1 Authoritative Scheduler Architecture (Option C Baseline)
Under Option C, the system operates with **exactly one general inference permit** ($N_{\text{permits}} = 1$). 

```
                                      [ INCOMING REQUEST ]
                                               │
                                               ▼
                                   [ Layer 1: Auth & Schema ]
                                      ├── Valid Bearer Token?
                                      ├── Project Quota Exceeded?
                                      └── Payload Syntax & Token Count <= 1536?
                                               │
                                      (Pass)   ▼   (Fail) ──► [ REJECTED (400/401/429) ]
                                   [ Layer 2: Admission FIFO ]
                                      ├── Queue Depth < MAX_QUEUE (32)?
                                      └── Idempotency Key Observed?
                                               │
                                      (Pass)   ▼   (Full) ──► [ REJECTED (503 Service Unavailable) ]
                                     [ STATE: QUEUED ]
                                               │
                                               ▼
                              ┌─────────────────────────────────┐
                              │ Scheduler Loop: Acquire Permit? │
                              └────────────────┬────────────────┘
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼ (Permit Free)                               ▼ (Permit Busy)
               [ STATE: ADMITTED ]                               [ Wait in Queue ]
                        │                                             │
                        ▼                                             ├── Timeout (30s)? ──► [ TIMED_OUT ]
              [ STATE: RUNNING ]                                      └── Client Drop?    ──► [ CANCELLED_CONFIRMED ]
                        │
                        ├── Backend Streaming Execution
                        ├── Client SSE Frame Forwarding
                        │
         ┌──────────────┴────────────────────────────┐
         ▼ (Normal EOS)                              ▼ (Client Disconnect / Timeout)
[ STATE: COMPLETED ]                     [ STATE: CANCEL_REQUESTED ]
         │                                           │
         ▼                                           ▼
[ Permit Released: IDLE ]                (Initiate Force Abort Pipeline)
```

### 4.2 Mathematical Invariants of the Scheduler
1. **Strict Permit Exclusivity:**
   $$\sum_{i=1}^{M} \text{PermitsHeld}(P_i) \le 1$$
   At no point in time $t$ may the sum of allocated inference permits across all projects $P_i$ exceed 1.
2. **Deterministic Queue Bounding:**
   $$L_{\text{queue}}(t) \le 32, \quad \forall t$$
   Any request arriving when $L_{\text{queue}} = 32$ is immediately rejected with HTTP `503 Service Unavailable` and header `Retry-After: 5`.
3. **Queue Wait-Time Bound:**
   $$\text{MaxWaitTime} = 30.0\text{ seconds}$$
   If a request waits in `QUEUED` state for $T > 30.0\text{s}$ without permit acquisition, it transitions to `TIMED_OUT` and is dequeued.
4. **Idempotency Invariant:**
   $$\text{Result}(R_{\text{idempotency\_key}}, t_1) \equiv \text{Result}(R_{\text{idempotency\_key}}, t_2)$$
   If a duplicate request is received while the original is `QUEUED`, `ADMITTED`, or `RUNNING`, the second request attaches as an observer to the first request's output stream without taking an additional permit or queue slot.

---

## 5. CANCELLATION AND PERMIT SAFETY (WORKSTREAM B)

### 5.1 Falsification of Naive Cancellation Assumptions

| Naive Assumption | Physical Hardware & Software Reality | Architectural Consequence | Gateway Safeguard |
| :--- | :--- | :--- | :--- |
| **"SSE client disconnect cancels LM Studio compute."** | **FALSE.** LM Studio decodes tokens asynchronously in CUDA thread. If `"stream": false`, it computes all tokens regardless of TCP state. If `"stream": true`, it cancels ONLY on the next write attempt to a severed socket. | Uncontrolled GPU compute continues for seconds or minutes after client leaves. | Mandatory `"stream": true` enforcement; immediate physical socket reset (`SO_LINGER = 0`). |
| **"TCP RST immediately aborts backend decoding."** | **UNVERIFIED / CONDITIONAL.** `llama.cpp` socket polling occurs between token generations. If KV cache manipulation or tensor matrix multiplication is mid-flight, detection is delayed by up to 200–500ms. | A race window exists where the backend remains occupied even after socket reset. | Active probe verification before permit reassignment; drain timer. |
| **"HTTP GET /v1/models returning 200 OK proves slot is idle."** | **PROVEN FALSE (V8.30-F).** LM Studio's HTTP server is multi-threaded. The web dispatcher answers `/v1/models` from memory while internal CUDA worker threads are saturated at 100% compute. | Admitting a new request based on `/v1/models` triggers simultaneous execution, saturating VRAM. | Synthetic active inference probe (`ping`) measuring Time-To-First-Token (TTFT). |
| **"Calculated drain time guarantees completion."** | **PROVEN FALSE.** If the backend driver encounters a CUDA deadlock or infinite decode loop, drain timers expire while GPU remains hung. | Permanent scheduler lockup or admission collision. | Escalation protocol: Active Probe $\to$ Reset Escalation $\to$ Process Restart Signal. |

### 5.2 The 12 Formal Gateway States

The lifecycle of every inference request within the Gateway is governed by a deterministic finite state machine (FSM) comprising exactly 12 states:

```mermaid
stateDiagram-v2
    [*] --> QUEUED : Valid Request Admitted to Queue
    [*] --> REJECTED : Validation / Auth / Capacity Failure
    
    QUEUED --> ADMITTED : Permit Acquired by Scheduler
    QUEUED --> TIMED_OUT : Queue Wait > 30s
    QUEUED --> CANCELLED_CONFIRMED : Client Dropped While Queued
    
    ADMITTED --> RUNNING : Backend Upstream Stream Established
    ADMITTED --> BACKEND_UNKNOWN : Backend Refused TCP / Timeout
    
    RUNNING --> COMPLETED : Natural EOS / Stream Completed
    RUNNING --> FAILED : Backend 5xx / Bad JSON Stream
    RUNNING --> TIMED_OUT : Generation Exceeded max_execution_time (60s)
    RUNNING --> CANCEL_REQUESTED : Client Dropped Connection
    
    CANCEL_REQUESTED --> CANCELLED_CONFIRMED : Socket RST + Probe Latency < 250ms
    CANCEL_REQUESTED --> CANCELLED_UNCONFIRMED : Socket RST Executed, Probe In-Flight / Delayed
    
    CANCELLED_UNCONFIRMED --> QUARANTINED : Active Probe Failed / Timed Out
    CANCELLED_UNCONFIRMED --> COMPLETED : Natural Drain Finished
    
    BACKEND_UNKNOWN --> QUARANTINED : Health Check Unresponsive
    
    QUARANTINED --> QUEUED : Automatic Recovery via Supervisor Restart
    QUARANTINED --> [*] : Fatal Gateway Lockout Notification
```

#### State Definitions and Invariants

1. **`QUEUED`**: Request validated and placed in priority FIFO queue. Does NOT hold an inference permit.
2. **`REJECTED`**: Request denied immediately at admission boundary. No resources allocated.
3. **`ADMITTED`**: Scheduler has assigned the single general inference permit to this request ID. Backend TCP connection pending.
4. **`RUNNING`**: Downstream client SSE and upstream backend SSE streams are actively linked and pumping tokens.
5. **`COMPLETED`**: Upstream emission terminated gracefully with `data: [DONE]`. Permit released to `IDLE`.
6. **`FAILED`**: Backend returned HTTP error, malformed token framing, or CUDA exception. Permit released to `IDLE` after clean socket close.
7. **`TIMED_OUT`**: Either queue residency exceeded 30s, or active generation exceeded 60s. Socket forcibly torn down.
8. **`CANCEL_REQUESTED`**: Downstream client connection severed (`ECONNRESET` / EOF). Permit remains LOCKED to prevent collision.
9. **`CANCELLED_CONFIRMED`**: Backend socket forcefully reset, active ping probe responded with TTFT $< 250\text{ms}$. Permit safely released to `IDLE`.
10. **`CANCELLED_UNCONFIRMED`**: Backend socket reset, but active probe has not yet confirmed slot availability. Permit held in cooldown.
11. **`BACKEND_UNKNOWN`**: Backend socket experienced abnormal termination or transport error leaving slot occupancy ambiguous.
12. **`QUARANTINED`**: Backend failed to recover within cooldown window or probe timed out. Permit is locked down. Gateway emits alert and blocks new admissions.

### 5.3 Force-Abort and Permit Recovery Protocol
When state enters `CANCEL_REQUESTED`:
1. **Force Socket Reset:** The Gateway immediately closes the upstream TCP socket to LM Studio using `SO_LINGER` set to 0 bytes / 0 seconds timeout. This issues a hard TCP RST packet to `127.0.0.1:1234`.
2. **Calculated Drain Window:**
   $$T_{\text{drain}} = \min(10.0, \max(1.5, (\text{max\_tokens} - \text{tokens\_emitted}) \times 0.035))$$
   The Gateway pauses permit reassignment for at least $T_{\text{drain}}$ seconds unless active probe succeeds earlier.
3. **Active Health Probe:** The Gateway dispatches an ultra-low overhead synthetic probe:
   ```json
   POST /v1/chat/completions
   {
     "model": "qwen2.5-7b-instruct",
     "messages": [{"role": "user", "content": "ping"}],
     "max_tokens": 1,
     "stream": false
   }
   ```
   - **Case A (Fast Confirmation):** Probe returns HTTP 200 within $< 250\text{ms}$. Backend slot is proven idle. Request transitions to `CANCELLED_CONFIRMED`. Permit returns to `IDLE`.
   - **Case B (Slow/Delayed Probe):** Probe does not return within 250ms but succeeds within 3.0s. Permit transitions from `CANCELLED_UNCONFIRMED` to `CANCELLED_CONFIRMED`.
   - **Case C (Probe Hang/Timeout):** Probe exceeds 3.0s or fails with connection refused. State transitions to `QUARANTINED`.

---

## 6. SECURITY AND MULTI-PROJECT ISOLATION (WORKSTREAM C)

### 6.1 Authentication and Identification Schema
The Gateway mandates HTTP Bearer Authentication on all endpoints (except `/health/live` which returns basic uptime).

```http
POST /v1/chat/completions HTTP/1.1
Host: 127.0.0.1:3333
Authorization: Bearer sec_live_9f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c
X-Project-ID: getxo-vela
X-Agent-ID: research-subagent-01
X-Idempotency-Key: idemp_20261030_a83fe77c
Content-Type: application/json
```

### 6.2 Gateway Enforcement vs. Upstream Convention

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ENFORCEMENT LAYER MAPPING                            │
├──────────────────────────────────┬─────────────────────────────────────┤
│        GATEWAY ENFORCED          │          CLIENT CONVENTION          │
│   (Hard Boundary - Cryptographic)│       (Soft / Cooperative)          │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 1. Bearer Token Verification     │ 1. Subagent Role Naming             │
│ 2. Project ID Matching           │ 2. Task Prompt Formatting           │
│ 3. Per-Project Concurrency (<=1) │ 3. Downstream JSON Post-Processing  │
│ 4. Rate Limiting (RPM / TPM)     │ 4. Voluntary Token Budgeting        │
│ 5. Parameter Ceiling Enforcement │ 5. Agent-side Memory Pruning        │
│ 6. Output Sanitization & Logging │                                     │
│ 7. Audit Ledger Recording        │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 6.3 Cross-Project Data Isolation Mechanics
1. **Stateless Backend Invariant:** LM Studio MUST be operated with session context saving disabled (`--no-mmap` or non-persistent session flags in `llama-server`).
2. **Explicit Cache Neutralization:** Every request sent from the Gateway to LM Studio includes explicit boundary delimiters and does NOT utilize backend-side persistent conversation IDs.
3. **Tenant Memory Segregation:** If future LM Studio runtimes implement prompt caching across requests, the Gateway MUST enforce a cache-busting token or system fingerprint when the incoming `X-Project-ID` changes, preventing cross-tenant KV cache reuse.

### 6.4 Resource Quota Matrix

| Parameter | Project `getxo-vela` | Project `default` | Validation Failure Action |
| :--- | :--- | :--- | :--- |
| **Max Concurrent Permits** | 1 | 1 | Queue if space; else HTTP 429 |
| **Max Requests Per Minute (RPM)** | 30 | 10 | HTTP 429 with `Retry-After` |
| **Max Tokens Per Request (`max_tokens`)** | 1,536 | 1,024 | Clamped to ceiling or HTTP 400 |
| **Max Context Size (`prompt` tokens)** | 2,560 | 2,048 | HTTP 400 Request Entity Too Large |
| **Queue Timeout** | 30.0s | 15.0s | HTTP 504 Gateway Timeout |
| **Max Execution Duration** | 60.0s | 45.0s | Force Socket RST $\to$ HTTP 504 |

---

## 7. QUARANTINED INGESTION ARCHITECTURE (WORKSTREAM D)

### 7.1 Strict Boundary Rule for V8.31
Under V8.31, **zero real WhatsApp archives, exports, or media files may be accessed, read, parsed, or processed**.
The ingestion pipeline is bound exclusively to synthetic fixture files located in a sandboxed directory:
`./tests/fixtures/synthetic_ingestion/`

### 7.2 Ingestion Record Schema (Synthetic Fixture Standard)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SyntheticIngestionFixtureRecord",
  "type": "object",
  "required": [
    "fixture_id",
    "source_archive_filename",
    "raw_bytes_base64",
    "expected_raw_sha256",
    "synthetic_description",
    "injected_anomalies"
  ],
  "properties": {
    "fixture_id": { "type": "string", "pattern": "^syn_[a-z0-9_]+$" },
    "source_archive_filename": { "type": "string" },
    "raw_bytes_base64": { "type": "string" },
    "expected_raw_sha256": { "type": "string", "pattern": "^[a-f0-9]{64}$" },
    "synthetic_description": { "type": "string" },
    "injected_anomalies": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "NFD_BASQUE_DIACRITICS",
          "CRLF_MIXED_NEWLINES",
          "INVALID_UTF8_SURROGATE",
          "MULTI_CHILD_SINGLE_JID",
          "PARENT_PROXY_PAYMENT",
          "TRUNCATED_OFFSET_SPAN"
        ]
      }
    }
  }
}
```

### 7.3 Ingestion Pipeline Finite State Machine

```
   [ SYNTHETIC FIXTURE READ ]
               │
               ▼
   [ Layer 0 Ingestion: Hash & Verify ]
       ├── SHA-256(raw_bytes) == expected_raw_sha256?
       └── Raw size <= 50 MB?
               │
      (Pass)   ▼   (Fail) ──► [ QUARANTINE_REJECTED: HASH_MISMATCH ]
   [ Idempotency & Duplicate Check ]
       ├── raw_sha256 already exists in DB?
               │
     (Fresh)   ▼   (Duplicate) ──► [ LOG_IDEMPOTENT_DUPLICATE & SKIP ]
   [ Decoding & Provenance Mapping ]
       ├── Decode UTF-8 (Strict)
       ├── Check for Unpaired Surrogates / Corrupted Byte Sequences
       ├── Build Layer 0 -> Layer 1 Offset Translation Map
       └── Compute Layer 1 Canonical SHA-256
               │
      (Pass)   ▼   (Fail) ──► [ QUARANTINE_REJECTED: UNICODE_DECODE_FAULT ]
   [ Synthetic Corpus Store Write ]
       └── Write to DB under BEGIN IMMEDIATE transaction
```

---

## 8. UNICODE & EVIDENCE PROVENANCE (WORKSTREAM E)

### 8.1 The Dual-Layer Architecture

To eliminate the conflict between judicial chain-of-custody (which requires bit-level fidelity to the acquired media) and LLM/NLP analysis (which requires normalized strings to prevent token fragmentation and regex failures), the V8.31 specification implements a **Dual-Layer Provenance Model**:

```
+───────────────────────────────────────────────────────────────────────────+
│                      LAYER 0: RAW BINARY ROOT OF TRUST                    │
├───────────────────────────────────────────────────────────────────────────┤
│ - Immutable byte sequence exactly as stored in fixture archive.           │
│ - Encoding metadata: Identified encoding (UTF-8, UTF-8-BOM, CP1252).       │
│ - Cryptographic Identity: SHA256(raw_bytes).                              │
│ - Absolute Byte Offsets: [byte_start, byte_end).                          │
│ - Forensic Guarantee: Hash verifiable against disk media at any future    │
│   date. Never modified, never normalized.                                 │
+───────────────────────────────────────────────────────────────────────────+
                                     │
                                     │ Transcode & Line Normalization
                                     ▼
+───────────────────────────────────────────────────────────────────────────+
│                   LAYER 1: CANONICAL OPERATIONAL VIEW                     │
├───────────────────────────────────────────────────────────────────────────┤
│ - Canonical Form: Unicode Normalization Form C (NFC).                     │
│ - Line Endings: Strictly LF ('\n'). All CRLF and CR converted.            │
│ - Cryptographic Identity: SHA256(canonical_utf8_bytes).                   │
│ - Character & Byte Offsets: [char_start, char_end), [cbyte_start, cbyte_end)│
│ - LLM Execution: Prompts and excerpt validations operate on Layer 1.      │
+───────────────────────────────────────────────────────────────────────────+
                                     ▲
                                     │
+───────────────────────────────────────────────────────────────────────────+
│                     OFFSET TRANSLATION MAP (BRIDGE)                       │
├───────────────────────────────────────────────────────────────────────────┤
│ Bijective/Surjective mapping array:                                       │
│ Index i in Layer 1 canonical text maps to [raw_byte_start, raw_byte_end)  │
│ in Layer 0 binary source.                                                 │
+───────────────────────────────────────────────────────────────────────────+
```

### 8.2 Handling Special Linguistic and Structural Edge Cases

#### 1. Spanish and Basque Diacritics (NFC vs. NFD)
- **Target Characters:** `ñ`, `Ñ`, `á`, `é`, `í`, `ó`, `ú`, `Á`, `É`, `Í`, `Ó`, `Ú`, `ü`, `Ü`.
- **The Problem:** macOS/iOS WhatsApp backups commonly export characters in NFD (Canonical Decomposition), e.g. `n` (`U+006E`) followed by Combining Tilde (`U+0303`). Linux/Windows and python tokenizers default to NFC (Canonical Composition), e.g. `ñ` (`U+00F1`).
- **Resolution:** In Layer 1, the text is composed into NFC. When an LLM cites `ñ` at canonical character index $C$, the translation map records that this single NFC character spans two raw bytes in Layer 0.

#### 2. Line Ending Transformations (CRLF $\to$ LF)
- Windows exports contain `\r\n` (2 bytes). Layer 1 normalizes this to `\n` (1 character, 1 byte).
- The Offset Translation Map binds the single `\n` character in Layer 1 to the 2-byte range `[offset, offset+2)` in Layer 0.

#### 3. Invalid UTF-8 and Multi-Byte UTF-8 Characters
- Emojis (e.g. ⛵ `U+26F5` or 🏆 `U+1F3C6`) consist of 3 or 4 UTF-8 bytes and may form surrogate pairs in UTF-16 environments.
- Layer 1 preserves valid multi-byte code points in NFC.
- Any byte sequence that fails UTF-8 decoding in Layer 0 cannot be silently replaced by `U+FFFD`. Any invalid sequence triggers immediate fixture quarantine: `QUARANTINE_REJECTED: UNICODE_DECODE_FAULT`.

### 8.3 Algorithmic Specification: Offset Mapping Engine

```python
# Algorithmic Reference Specification - Deterministic Provenance Engine
import unicodedata
import hashlib
from typing import NamedTuple, List, Tuple, Dict, Any

class OffsetSpan(NamedTuple):
    raw_byte_start: int
    raw_byte_end: int

class ProvenanceMap(NamedTuple):
    raw_sha256: str
    canonical_sha256: str
    canonical_text: str
    char_to_raw_span: List[OffsetSpan]

def build_dual_layer_provenance(raw_bytes: bytes) -> ProvenanceMap:
    raw_sha = hashlib.sha256(raw_bytes).hexdigest()
    
    # Pass 1: Decode raw bytes while tracking exact byte slices per character
    raw_chars: List[str] = []
    raw_spans: List[OffsetSpan] = []
    
    byte_idx = 0
    raw_len = len(raw_bytes)
    while byte_idx < raw_len:
        b = raw_bytes[byte_idx]
        if b < 0x80:
            seq_len = 1
        elif (b & 0xE0) == 0xC0:
            seq_len = 2
        elif (b & 0xF0) == 0xE0:
            seq_len = 3
        elif (b & 0xF8) == 0xF0:
            seq_len = 4
        else:
            raise ValueError(f"Invalid UTF-8 start byte 0x{b:02x} at byte {byte_idx}")
            
        seq_bytes = raw_bytes[byte_idx : byte_idx + seq_len]
        try:
            char = seq_bytes.decode('utf-8')
        except UnicodeDecodeError as e:
            raise ValueError(f"UTF-8 decode failure at byte offset {byte_idx}: {e}")
            
        raw_chars.append(char)
        raw_spans.append(OffsetSpan(byte_idx, byte_idx + seq_len))
        byte_idx += seq_len
        
    # Pass 2: Line ending normalization (CRLF -> LF)
    clean_chars: List[str] = []
    clean_spans: List[OffsetSpan] = []
    i = 0
    num_raw = len(raw_chars)
    while i < num_raw:
        if raw_chars[i] == '\r' and (i + 1 < num_raw) and raw_chars[i+1] == '\n':
            # Collapse \r\n to single \n, spanning both raw byte regions
            combined_span = OffsetSpan(raw_spans[i].raw_byte_start, raw_spans[i+1].raw_byte_end)
            clean_chars.append('\n')
            clean_spans.append(combined_span)
            i += 2
        elif raw_chars[i] == '\r':
            clean_chars.append('\n')
            clean_spans.append(raw_spans[i])
            i += 1
        else:
            clean_chars.append(raw_chars[i])
            clean_spans.append(raw_spans[i])
            i += 1
            
    clean_text = "".join(clean_chars)
    
    # Pass 3: NFC Unicode Normalization with Span Projection
    canonical_text = unicodedata.normalize('NFC', clean_text)
    canonical_bytes = canonical_text.encode('utf-8')
    canonical_sha = hashlib.sha256(canonical_bytes).hexdigest()
    
    # Re-align spans after NFC composition
    char_to_raw: List[OffsetSpan] = []
    src_idx = 0
    clean_len = len(clean_chars)
    
    for can_char in canonical_text:
        accum = clean_chars[src_idx]
        start_byte = clean_spans[src_idx].raw_byte_start
        end_byte = clean_spans[src_idx].raw_byte_end
        src_idx += 1
        
        while unicodedata.normalize('NFC', accum) != can_char and src_idx < clean_len:
            accum += clean_chars[src_idx]
            end_byte = clean_spans[src_idx].raw_byte_end
            src_idx += 1
            
        char_to_raw.append(OffsetSpan(start_byte, end_byte))
        
    return ProvenanceMap(
        raw_sha256=raw_sha,
        canonical_sha256=canonical_sha,
        canonical_text=canonical_text,
        char_to_raw_span=char_to_raw
    )
```

### 8.4 Evidence Verification and Escalation Rules
When an evidence record is verified:
1. **Layer 1 Direct Match:** The quoted excerpt string MUST equal `canonical_text[char_start:char_end]` exactly.
2. **Layer 0 Projection Verification:** The projected byte range `[raw_byte_start, raw_byte_end)` is extracted from the raw binary source. It MUST decode to a string sequence whose NFC normalization equals the quoted excerpt.
3. **Escalation / Rejection:** If `raw_bytes` cannot be cleanly projected, or if the excerpt spans across a non-translatable boundary, the evidence record is marked `EVIDENCE_UNVERIFIED_ESCALATED` and rejected from the downstream fact store.

---

## 9. MCP INTEGRATION & EXECUTION BOUNDARY (WORKSTREAM F)

### 9.1 Topology and Separation of Concerns

```
+───────────────────────────────────────────────────────────────────────────+
│                     ANTIGRAVITY APPLICATION HOST                          │
│  - Parent Process: language_server.exe (PID 40944)                        │
│  - Environment: Windows 11 Desktop Workstation                            │
│  - Execution: Reads mcp_config.json, spawns child stdio processes         │
+─────────────────────────────────────┬─────────────────────────────────────+
                                      │
                                      │ stdio (JSON-RPC 2.0)
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
│                        MCP SERVER CHILD PROCESS                           │
│  - Executable: .\v825-gpu-bridge\.venv\Scripts\python.exe                 │
│  - Script: C:\Users\User\Desktop\agenc-ia\v825-gpu-bridge\server.py       │
│  - Responsibilities:                                                      │
│    * Reads JSON-RPC requests from stdin.                                  │
│    * Emits JSON-RPC responses to stdout.                                  │
│    * Writes diagnostic logs exclusively to stderr.                        │
│    * Maintains persistent aiohttp client session to Gateway.              │
│    * Holds project-specific Bearer Token in environment variable.         │
+─────────────────────────────────────┬─────────────────────────────────────+
                                      │
                                      │ HTTP/1.1 Loopback (Bearer Auth)
                                      ▼
+───────────────────────────────────────────────────────────────────────────+
│                     CENTRAL GPU GATEWAY (:3333)                           │
│  - Independent Long-Running Windows Service / Daemon                      │
│  - Manages single permit admission, queueing, and timeouts               │
+───────────────────────────────────────────────────────────────────────────+
```

### 9.2 Tool Contracts for MCP Gateway Client

The MCP Server exposes exactly three tools to the Antigravity Orchestrator:

#### 1. `gpu_bridge_health`
- **Purpose:** Non-blocking status check on Gateway and backend reachability.
- **Parameters:** None.
- **Output:**
  ```json
  {
    "gateway_status": "ONLINE",
    "backend_status": "READY",
    "active_permit_holder": null,
    "queued_requests": 0,
    "model_resident": "Qwen2.5-7B-Instruct-Q4_K_M"
  }
  ```

#### 2. `gpu_bridge_echo`
- **Purpose:** Diagnostic tool verifying JSON-RPC stdio integrity without invoking backend GPU.
- **Parameters:** `message` (string, required).
- **Output:** `{"echo": "<message>", "status": "VERIFIED"}`.

#### 3. `gpu_inference`
- **Purpose:** Submits an inference task to the central GPU Gateway.
- **Parameters:**
  - `prompt` (string, required, length $\le 8192$ chars).
  - `max_tokens` (integer, optional, default 512, ceiling 1536).
  - `temperature` (float, optional, default 0.1, range 0.0–1.0).
  - `idempotency_key` (string, required, UUID v4 or task-hash).
- **Behavior:**
  - Connects to `127.0.0.1:3333/v1/chat/completions`.
  - Streams response chunks from Gateway.
  - Returns complete generated text, token usage, and latency metrics to orchestrator.

---

## 10. OBSERVABILITY & AUDIT LEDGER (WORKSTREAM G)

### 10.1 Structured Logging Standards
All Gateway events are emitted as single-line NDJSON (Newline Delimited JSON) to `stderr` and appended to a rotating disk ledger:
`C:\Users\User\Desktop\agenc-ia\logs\gpu_gateway_audit.log`

#### Schema of Audit Event
```json
{
  "timestamp": "2026-10-30T11:15:00.123456Z",
  "level": "INFO",
  "event": "INFERENCE_COMPLETED",
  "request_id": "req_8f9a2b3c-4d5e",
  "project_id": "getxo-vela",
  "agent_id": "research-worker-01",
  "idempotency_key": "idemp_20261030_a83fe77c",
  "queue_duration_ms": 142.5,
  "inference_duration_ms": 2845.1,
  "ttft_ms": 85.3,
  "tokens_prompt": 450,
  "tokens_generated": 210,
  "tokens_per_second": 73.8,
  "exit_state": "COMPLETED",
  "permit_id": "permit_opt_c_01",
  "backend_http_status": 200,
  "client_ip": "127.0.0.1",
  "payload_sha256": "4b2e8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e"
}
```

### 10.2 Privacy Redaction Policy
- **Prompt Masking:** In standard `INFO` logging, the raw prompt string and completion text MUST NEVER be written to the log ledger. Only token lengths, execution metrics, and cryptographic hashes of the prompt are recorded.
- **Debug Override:** Full prompt recording is permissible ONLY in a dedicated debug mode (`LOG_LEVEL=DEBUG`) writing to a secure, ephemeral session file with automated deletion upon process exit.

---

## 11. FAILURE RECOVERY PROCEDURES (WORKSTREAM G)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      GATEWAY RECOVERY MATRIX                           │
├───────────────────────┬────────────────────────────────────────────────┤
│ Incident Scenario     │ Automated Recovery Procedure                   │
├───────────────────────┼────────────────────────────────────────────────┤
│ 1. Gateway Crash      │ - Process supervisor restarts Gateway.         │
│                       │ - SQLite WAL rolls back uncommitted leases.    │
│                       │ - In-memory queue is flushed.                  │
│                       │ - Clients receive 503 and retry idempotently.  │
├───────────────────────┼────────────────────────────────────────────────┤
│ 2. LM Studio Restart  │ - Gateway detects backend TCP ECONNREFUSED.    │
│                       │ - Active requests marked BACKEND_UNKNOWN.      │
│                       │ - Gateway enters HEALTH_PROBE cooldown.        │
│                       │ - Reconnection backoff: 1s, 2s, 4s (max 30s).  │
├───────────────────────┼────────────────────────────────────────────────┤
│ 3. Client TCP Reset   │ - Gateway catches ClientPayloadError.          │
│                       │ - Forces socket RST (SO_LINGER=0) to LM Studio.│
│                       │ - Evaluates drain cooldown (T_drain).          │
│                       │ - Dispatches synthetic ping probe.             │
├───────────────────────┼────────────────────────────────────────────────┤
│ 4. Stale Request      │ - Queue watchdog purges requests older > 30s.  │
│                       │ - Returns HTTP 504 Gateway Timeout.            │
├───────────────────────┼────────────────────────────────────────────────┤
│ 5. Unknown Backend    │ - Permit state transitions to QUARANTINED.     │
│    State              │ - Gateway issues active ping probes every 2s.  │
│                       │ - If unrecovered in 15s, emits Alert Signal.   │
└───────────────────────┴────────────────────────────────────────────────┘
```

---

## 12. SYNTHETIC ACCEPTANCE TEST MATRIX (WORKSTREAM H)

This matrix defines 25 comprehensive synthetic acceptance tests. Each test represents a concrete operational verification case to be executed in future test phases.

| Test ID | Test Name | Preconditions | Synthetic Input / Trigger | Expected Result | Failure Condition | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth Token Valid | Gateway online; project secret configured. | `POST /v1/chat/completions` with valid Bearer token. | HTTP 200 / Request Queued. | HTTP 401 or 403 returned. | Log event `AUTH_SUCCESS`. |
| **TC-02** | Auth Token Missing / Invalid | Gateway online. | `POST` with `Bearer invalid_token_xyz`. | Immediate HTTP 401 Unauthorized. | Any request admitted or queued. | Audit log `AUTH_FAILURE`. |
| **TC-03** | Project Isolation | Projects `proj_a` and `proj_b` registered. | `proj_a` submits request attempting to access `proj_b` state. | Access blocked; context strictly isolated. | Cross-project token leakage. | Isolated session log confirmation. |
| **TC-04** | Invalid Project Identity | Valid token, mismatched `X-Project-ID`. | Request token belongs to `proj_a`, header claims `proj_b`. | HTTP 403 Forbidden. | Request admitted. | Audit log `PROJECT_ID_MISMATCH`. |
| **TC-05** | Queue Admission FIFO | Gateway idle; Option C permit free. | 3 synthetic requests submitted concurrently. | Req 1 admitted immediately; Reqs 2 & 3 placed in FIFO queue. | Reqs dispatched concurrently to LM Studio. | Queue index stamps in log. |
| **TC-06** | Queue Saturation (Max 32) | 32 requests holding queue slots. | 33rd request arrives. | Immediate HTTP 503 Service Unavailable + `Retry-After: 5`. | 33rd request accepted or hangs. | HTTP 503 response header check. |
| **TC-07** | Duplicate Request Handling | Req 1 is `RUNNING`. | Req 2 arrives with identical `X-Idempotency-Key`. | Req 2 attaches to Req 1 stream; does not consume permit. | Double inference or permit starvation. | Exact identical response stream received. |
| **TC-08** | Backend Unavailable | LM Studio offline (port 1234 closed). | Valid request submitted to Gateway. | Gateway returns HTTP 502 Bad Gateway after connection retry. | Unhandled traceback or hang > 5s. | Diagnostic error log `BACKEND_UNREACHABLE`. |
| **TC-09** | Backend Restart Mid-Stream | Request `RUNNING` with 50 tokens emitted. | LM Studio process killed via SIGKILL. | Gateway catches EOF, marks request `FAILED`, frees permit. | Gateway hangs indefinitely waiting for tokens. | Permit state resets to `IDLE`. |
| **TC-10** | Client Disconnect (Abort) | Request streaming tokens to client. | Client forcefully severs TCP socket. | Gateway forces socket RST to LM Studio; state $\to$ `CANCEL_REQUESTED`. | Backend decodes to max_tokens unimpeded. | Gateway log `CLIENT_ABORT_CAUGHT`. |
| **TC-11** | Confirmed Cancellation | Request aborted; backend stops. | Gateway sends synthetic probe ping. | Probe returns in $< 250\text{ms}$; state $\to$ `CANCELLED_CONFIRMED`. | Permit leaked or held permanently. | Probe latency metric in log. |
| **TC-12** | Unconfirmed Cancellation | Backend ignores RST, keeps decoding. | Probe ping delayed $> 500\text{ms}$. | Permit held in `CANCELLED_UNCONFIRMED` until cooldown expires. | New request dispatched while backend busy. | Cooldown timer active in ledger. |
| **TC-13** | Permit Quarantine | Backend hangs completely on probe. | Active probe times out after 3.0s. | State $\to$ `QUARANTINED`; new admissions blocked with 503. | Corrupted requests queued indefinitely. | Alert log `PERMIT_QUARANTINED`. |
| **TC-14** | Permit Recovery from Quarantine| Backend in `QUARANTINED`. | LM Studio restarted; health probe succeeds. | Gateway recovers permit; state $\to$ `IDLE`. | Gateway remains stuck in quarantine. | Health log `QUARANTINE_LIFTED`. |
| **TC-15** | Unicode NFC / NFD Equivalence| Synthetic fixture contains NFD `ñ` (`n\u0303`). | Dual-layer provenance mapping executed. | Layer 1 produces NFC `ñ` (`\u00f1`); map points to 2 raw bytes. | Offset desync or character corruption. | Byte slice decodes to NFC match. |
| **TC-16** | CRLF / LF Offset Mapping | Synthetic fixture contains Windows `\r\n`. | Line normalization executed. | Layer 1 produces single `\n`; map spans both raw bytes. | Byte offsets shifted by 1 per line. | End-of-file byte offset exact. |
| **TC-17** | Invalid UTF-8 Sequence | Fixture contains orphan byte `0x80`. | Ingestion decoder executed. | Fixture rejected with `UNICODE_DECODE_FAULT`. | Silent replacement with `\ufffd`. | Rejection audit log entry. |
| **TC-18** | Original Hash Preservation | Fixture with NFD and CRLF ingested. | SHA-256 computed on Layer 0. | Layer 0 hash matches raw archive bit-exact. | Hash matches normalized text instead. | `raw_sha256 == expected_raw_sha256`. |
| **TC-19** | Canonical Hash Consistency | Two fixtures with identical semantic text (one NFC, one NFD). | Provenance pipeline executed on both. | Both produce identical `canonical_text_sha256`. | Canonical hashes differ. | Hash equality assertion true. |
| **TC-20** | Evidence Span Projection | LLM cites excerpt spanning diacritic. | Offset translation engine queried. | Correct Layer 0 byte boundaries returned. | Substring mismatch on raw slice. | Raw byte slice NFC matches excerpt. |
| **TC-21** | Duplicate Ingestion Protection| Ingestion engine receives identical fixture twice. | Ingestion executed sequentially. | Second ingestion detected as duplicate; skipped idempotently. | Duplicate database rows inserted. | DB unique constraint verified. |
| **TC-22** | Idempotent Ingestion Retries | Ingestion worker crashes mid-transaction. | Worker restarted with same fixture. | SQLite WAL rolls back partial write; retry completes cleanly. | Partial orphaned evidence rows. | DB foreign keys consistent. |
| **TC-23** | Gateway Crash & State Reset | Gateway killed while jobs queued. | Gateway restarted. | In-memory queues reset; database state reconciled. | Stale locks prevent restart. | Clean startup in `< 1.0\text{s}`. |
| **TC-24** | MCP Client Disconnection | MCP server stdio pipe severed. | Antigravity session terminated. | MCP server shuts down gracefully; closes HTTP session to Gateway. | Orphaned background python processes. | Process list shows clean termination. |
| **TC-25** | Structured Audit Trail | 10 varied requests executed. | Log ledger inspected. | Exactly 10 structured NDJSON audit records with valid hashes. | Missing events or unescaped lines. | JSON parser validates 100% lines. |

---

## 13. IMPLEMENTATION PREREQUISITES

Before any code for V8.31 can be written or executed, the following technical prerequisites must be satisfied:

1. **Virtual Environment Resolution for MCP Bridge:**
   - The virtual environment `C:\Users\User\Desktop\agenc-ia\v825-gpu-bridge\.venv` must have the `mcp` library installed or linked. (Currently blocked: `ModuleNotFoundError: No module named 'mcp'`).
2. **MCP Configuration Registration:**
   - Explicit user approval must be granted to add the `local-gpu-bridge` entry to `C:\Users\User\.gemini\config\mcp_config.json`.
3. **Gateway Dedicated Port Reservation:**
   - Verification that TCP port `3333` is free and unreserved on `127.0.0.1`.
4. **Backend Resident Model Verification:**
   - LM Studio 0.4.27 must be verified to have `Qwen2.5-7B-Instruct-Q4_K_M` loaded with 4,096 context window on `127.0.0.1:1234`.
5. **Synthetic Fixture Directory Provisioning:**
   - Sandbox path `./tests/fixtures/synthetic_ingestion/` prepared with synthetic JSON fixtures.

---

## 14. EXPLICIT UNRESOLVED TECHNICAL QUESTIONS

The following technical questions cannot be answered by specification alone and require empirical, experimental verification during future testing phases:

1. **`llama-server` SSE Abort Latency:**
   - *Question:* What is the exact distribution of elapsed time (in milliseconds) between sending a TCP RST packet to `127.0.0.1:1234` and the CUDA core releasing execution on the active batch?
   - *Requirement:* Must be measured using hardware telemetry (NVIDIA NVML / `nvidia-smi dmon`) during simulated client drops.
2. **Windows Loopback Socket RST Reliability:**
   - *Question:* Does `asyncio` or `socket.SO_LINGER(1, 0)` under Windows 11 `af_inet` loopback reliably deliver immediate `WSAECONNRESET` to a local peer process, or does the Windows TCP stack defer RST delivery until the next read/write poll?
3. **LM Studio HTTP Concurrency Saturation:**
   - *Question:* When LM Studio is actively decoding on its single slot, does dispatching a concurrent HTTP request cause an immediate socket reject, queue internally within LM Studio's embedded web server, or crash the runtime?
4. **Non-ASCII Offset Performance at Scale:**
   - *Question:* Does the linear pass character-to-byte span mapping array (`ProvenanceMap.char_to_raw_span`) introduce unacceptable RAM overhead when processing massive multi-megabyte synthetic fixtures?

---

## 15. GO / NO-GO IMPLEMENTATION GATE

```
┌────────────────────────────────────────────────────────────────────────┐
│                   V8.31 FORMAL ARCHITECTURAL GATE                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                  GATE STATUS: SPECIFICATION APPROVED                   │
│                  IMPLEMENTATION STATUS: STRICT NO-GO                   │
│                                                                        │
│  This document completes the architectural specification required by   │
│  V8.31.                                                                │
│                                                                        │
│  Execution of implementation code, package installation, MCP           │
│  configuration edits, database creation, or real-data ingestion        │
│  REMAINS STRICTLY PROHIBITED.                                          │
│                                                                        │
│  CRITICAL GATE CONDITIONS FOR NEXT STAGE:                              │
│  1. Explicit user authorization for MCP environment setup.             │
│  2. Delivery and audit of synthetic test fixtures.                     │
│  3. Execution of the empirical socket RST verification experiments.    │
│  4. Zero access to C:\Users\User\Desktop\whatsapp_chats_zip.           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---
*End of V8.31 Specification. Authored by Independent Systems Architecture & Gatekeeper Agent.*




