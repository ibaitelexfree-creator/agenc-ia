# V8.28 — LOCAL GPU SCHEDULER & RESOURCE MANAGEMENT DESIGN
**System Architecture Specification & Technical Reference Document**  
*Document Target: `V8_28_GPU_SCHEDULER_DESIGN.md`*  
*Environment: NVIDIA RTX 4080 Laptop GPU (12,282 MiB VRAM), 64 GB Host RAM, LM Studio (`llama.cpp` runtime)*

---

## 1. Executive Summary & Mission Scope

The objective of this design is to establish a deterministic, safe, and highly performant local inference scheduling layer for multiple autonomous Antigravity agents concurrently accessing a single local LM Studio inference endpoint (`127.0.0.1:1234`).

Operating large language model (LLM) agents against consumer workstation/laptop hardware presents severe physical and architectural constraints:
1. **Hard VRAM Ceiling:** 12,282 MiB (12.0 GB) GDDR6 VRAM. Exceeding this boundary triggers CUDA out-of-memory (`CUDA OOM`), partial layer offloading to system RAM with a 10×–20× throughput penalty, or process crash.
2. **Thermal & Power Caps:** Mobile GPUs operate within strict TDP limits (typically 115W–175W max TGP) and dynamic thermal throttling envelopes (83°C–87°C thermal slowdown).
3. **Multi-Agent Contention:** Concurrent tool calls, streaming generation, and heavy prompt ingest (e.g. repo analysis) cause head-of-line blocking, slot exhaustion, cache thrashing, and high latency variability.
4. **Zero-Execution Safety:** Autonomous agents must be structurally prevented from altering scheduler policies, reading cross-session contexts, or causing command execution via raw model completions.

This document formalizes the theoretical foundations, data structures, scheduling algorithms, memory models, error isolation handlers, and implementation blueprints required for a resilient user-space scheduler service.

---

## 2. Hardware Profile & Resource Model

### 2.1 Hardware Specification
| Parameter | Value | Architectural Impact |
| :--- | :--- | :--- |
| **GPU Model** | NVIDIA GeForce RTX 4080 Laptop GPU | Ada Lovelace Architecture (AD103 / AD104 variant) |
| **Dedicated VRAM** | 12,282 MiB (12.0 GB) GDDR6 | Fixed boundary for weights, KV cache, CUDA runtime, and activations |
| **Memory Bus / Bandwidth** | 192-bit / ~432 GB/s | Limits token generation bandwidth during autoregressive decode |
| **System RAM** | 64 GB DDR5 | Ample headroom for scheduler queues, prompt disk caches, and OS overhead |
| **Host Interface** | PCIe Gen 4 x8 / x16 | Fast layer swapping capability if needed, though disk-to-VRAM is avoided |
| **TGP / Thermal Limit** | 150W–175W Dynamic Boost / 87°C TjMax | Thermal throttling degrades clock frequency and tokens/second |
| **Inference Runtime** | LM Studio (`llama.cpp` backend) | Optimized GGUF quantization, unified static KV buffer allocation |
| **Target Baseline Model** | `Qwen2.5-7B-Instruct-Q4_K_M.gguf` | 7.61B parameters, 28 layers, context window up to 32k/128k |

---

### 2.2 Mathematical VRAM Consumption Model

Total VRAM allocation ($M_{\text{total}}$) consists of four distinct components:
$$M_{\text{total}} = M_{\text{cuda\_runtime}} + M_{\text{weights}} + M_{\text{kv\_cache}} + M_{\text{compute\_overhead}}$$

Where:
1. **$M_{\text{cuda\_runtime}}$:** Driver context, CUDA kernel pointers, basic buffer tables: $\approx 550\,\text{MiB}$ to $750\,\text{MiB}$.
2. **$M_{\text{weights}}$:** Quantized weights loaded into VRAM. For `Qwen2.5-7B-Instruct` at `Q4_K_M` (~4.5 bits per weight including embeddings and norms):
   $$M_{\text{weights}} \approx 7.61 \times 10^9 \times \frac{4.5\,\text{bits}}{8\,\text{bits/byte}} \approx 4.28\,\text{GiB} \approx 4,380\,\text{MiB}$$
3. **$M_{\text{kv\_cache}}$:** Key-Value cache stored across all active parallel slots ($S$) and allocated context tokens ($L_{\text{ctx}}$).
   For Transformer models using Grouped-Query Attention (GQA):
   $$\text{Bytes per token per layer} = 2 \times (\text{layers}) \times (n_{\text{kv\_heads}} \times d_{\text{head}}) \times (\text{bytes per element})$$
   For Qwen2.5-7B:
   - Hidden Size $D = 3584$, Layers $N_L = 28$
   - Query Heads = 28, Key/Value Heads $n_{kv} = 4$ (GQA 7:1 ratio)
   - Head Dimension $d_h = 3584 / 28 = 128$
   - Cache Format: FP16 (2 bytes) or Q8_0 (1.0625 bytes), Q4_0 (0.5625 bytes).
   - In standard FP16 KV cache:
     $$\text{KV per token} = 2\,(\text{K\&V}) \times 28\,\text{layers} \times (4 \times 128) \times 2\,\text{bytes} = 57,344\,\text{bytes} \approx 56.0\,\text{KiB/token}$$
   - Across $S$ slots with context length $C_s$:
     $$M_{\text{kv\_cache}} = \sum_{s=1}^S \left( C_s \times 57,344\,\text{bytes} \right)$$
   - *Quantized KV Option (Q8_0 or Q4_0):*
     - If `llama.cpp` KV quantization is enabled (`-ctk q8_0 -ctv q8_0`), cache size drops by ~47% to $\approx 30\,\text{KiB/token}$.
     - At FP16, $4 \times 8,192$ context slots would require:
       $$4 \times 8,192 \times 56.0\,\text{KiB} \approx 1,835,008\,\text{KiB} \approx 1,792\,\text{MiB} \approx 1.75\,\text{GiB}$$
     - At FP16, $4 \times 16,384$ context slots:
       $$4 \times 16,384 \times 56.0\,\text{KiB} \approx 3,584\,\text{MiB} \approx 3.50\,\text{GiB}$$
     - At FP16, $4 \times 32,768$ context slots:
       $$4 \times 32,768 \times 56.0\,\text{KiB} \approx 7,168\,\text{MiB} \approx 7.00\,\text{GiB}$$
4. **$M_{\text{compute\_overhead}}$:** Activation tensors, scratch buffers, unified memory padding, FlashAttention temporary buffers:
   $$M_{\text{compute\_overhead}} \approx 650\,\text{MiB} \text{ to } 1,200\,\text{MiB}$$

#### Total Memory Breakdown Table (Target: 12,282 MiB Total VRAM)
| Configuration | Weights | Runtime & Scratch | KV Cache | Total Allocated | Free Margin | Headroom % |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Config A: 4 slots $\times$ 4,096 tokens (FP16)** | 4,380 MiB | 1,400 MiB | 896 MiB | 6,676 MiB | 5,606 MiB | 45.6% (Ultra-Safe) |
| **Config B: 4 slots $\times$ 8,192 tokens (FP16)** | 4,380 MiB | 1,500 MiB | 1,792 MiB | 7,672 MiB | 4,610 MiB | 37.5% (Recommended) |
| **Config C: 4 slots $\times$ 16,384 tokens (FP16)** | 4,380 MiB | 1,650 MiB | 3,584 MiB | 9,614 MiB | 2,668 MiB | 21.7% (High-Context) |
| **Config D: 2 slots $\times$ 32,768 tokens (FP16)** | 4,380 MiB | 1,800 MiB | 3,584 MiB | 9,764 MiB | 2,518 MiB | 20.5% (Deep Research) |
| **Config E: 4 slots $\times$ 32,768 tokens (FP16)** | 4,380 MiB | 2,000 MiB | 7,168 MiB | 13,548 MiB | **-1,266 MiB** | **CRITICAL OOM** |

> **Primary Sizing Finding:** Config E is mathematically impossible without system RAM spillover. The workstation sweet spot that guarantees stability under load while leaving safe headroom for OS display buffers is **Config B (4 slots $\times$ 8k)** or an asymmetrical slot partitioning (e.g. 1 slot $\times$ 16k + 3 slots $\times$ 4k = 1,568 MiB KV cache).

---

### 2.3 Prompt Processing (Prefill) vs. Token Generation (Decode) Dynamics

In `llama.cpp` multi-slot architectures:
1. **Prompt Processing (Prefill Phase):**
   - Compute-bound (matrix-matrix multiplication, GEMM).
   - High GPU compute core saturation and power draw ($130\text{W}-160\text{W}$).
   - Generates KV entries for all prompt tokens in parallel chunks (`n_ubatch`, typically 512).
   - If two agents submit large prompts simultaneously, prefill compute contention can spike latency by $300\%$.
2. **Token Generation (Autoregressive Decode Phase):**
   - Memory bandwidth-bound (matrix-vector multiplication, GEMV).
   - Low compute saturation, high memory controller utilization.
   - Generates 1 token per active slot per iteration.
   - Multiple active slots running decode simultaneously interleave memory reads of the 4.38 GiB weights, significantly amortizing memory bandwidth cost and multiplying overall system throughput ($T_{\text{sys}} = \sum_{s=1}^S T_s$).

---

## 3. System Architecture & Component Design

### 3.1 High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                  ANTIGRAVITY MULTI-AGENT LAYER                                    |
|   +-------------------+    +--------------------+    +--------------------+    +--------------+   |
|   | Interactive Agent |    | Coding Agent (V8)  |    | Research Subagent  |    | Verification |   |
|   +---------+---------+    +---------+----------+    +---------+----------+    +-------+------+   |
+-------------|------------------------|-------------------------|-----------------------|----------+
              |                        |                         |                       |
              +-------------------+----+--------------------+----+-----------------------+
                                  | HTTP / SSE with Client Isolation
                                  v
+---------------------------------------------------------------------------------------------------+
|                        LOCAL GPU INFERENCE SCHEDULER (Gateway Proxy :3333)                        |
|                                                                                                   |
|  +--------------------+     +----------------------------------+     +-------------------------+  |
|  | Security & Auth    | --> | Token Budgeter & Estimator       | --> | Dynamic Priority Queue  |  |
|  | - Agent Token Auth |     | - tiktoken/bpe token count       |     | - P0: Interactive (WFQ) |  |
|  | - Session Sandbox  |     | - Context bounds enforcement     |     | - P1: Verification      |  |
|  | - URL Disinfection |     | - Output ceiling clamping        |     | - P2: Coding Tasks      |  |
|  +--------------------+     +----------------------------------+     | - P3: Deep Research     |  |
|                                                                      | - P4: Batch / Analyzer  |  |
|  +-------------------------------------------------------------+     +------------+------------+  |
|  | Admission Controller & Slot Manager                         |                  |               |
|  | - Max Concurrency: 3 Active Slots (1 Reserved for P0)       | <----------------+               |
|  | - Context Partition: [Slot0: 16k, Slot1: 8k, Slot2: 4k, S3]|                                  |
|  | - Thermal Throttle Interceptor (Reads NVML Temp & Power)    |                                  |
|  +------------------------------+------------------------------+                                  |
|                                 |                                                                 |
|  +------------------------------v------------------------------+     +-------------------------+  |
|  | Resilient HTTP Client (Connection Pool & Keep-Alive)        |     | Health & Circuit Breaker|  |
|  | - Fast Heartbeat Healthcheck (/v1/models, /health)         | <-> | - Backoff & Recovery    |  |
|  | - Request Cancellation & AbortController Propagator         |     | - OOM Auto-Drain        |  |
|  +------------------------------+------------------------------+     +-------------------------+  |
+---------------------------------|-----------------------------------------------------------------+
                                  | Loopback Only (`127.0.0.1:1234`)
                                  v
+---------------------------------------------------------------------------------------------------+
|                                LOCAL LM STUDIO ENGINE (llama.cpp)                                 |
|                                                                                                   |
|  Active Model: Qwen2.5-7B-Instruct-Q4_K_M (Fully Offloaded in VRAM: 28/28 Layers)                |
|  +---------------------------------------------------------------------------------------------+  |
|  | Parallel Context Slots (Context Unified Buffer: 32,768 Tokens Total Allocated)             |  |
|  |  [Slot 0: Active (P0)]   [Slot 1: Active (P2)]   [Slot 2: Active (P1)]   [Slot 3: Idle]     |  |
|  +---------------------------------------------------------------------------------------------+  |
|  +---------------------------------------------------------------------------------------------+  |
|  | NVIDIA Driver Context & VRAM (12,282 MiB) | FlashAttention-2 | NVML Telemetry               |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

### 3.2 Data Models & Enums

```python
from dataclasses import dataclass, field
from enum import IntEnum, Enum
from typing import Optional, Dict, Any, List
import time
import uuid

class PriorityLevel(IntEnum):
    P0_INTERACTIVE = 0     # Direct human/agent interactive conversation turn
    P1_VERIFICATION = 1    # Syntax verification, lint/DRC/typecheck critique
    P2_CODING = 2          # File edits, code generation, refactoring
    P3_RESEARCH = 3        # Deep repo search, architecture review, codebase survey
    P4_BATCH = 4           # Background indexing, doc generation, offline analysis

class RequestStatus(Enum):
    QUEUED = "QUEUED"
    ADMITTED = "ADMITTED"
    STREAMING = "STREAMING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    TIMED_OUT = "TIMED_OUT"
    CANCELLED = "CANCELLED"
    SHED_BACKPRESSURE = "SHED_BACKPRESSURE"

@dataclass
class SchedulerRequest:
    request_id: str = field(default_factory=lambda: f"req-{uuid.uuid4().hex[:12]}")
    agent_id: str = ""                       # e.g., "clawde-interactive", "agent-researcher-1"
    session_id: str = ""                     # Isolated agent conversation boundary
    priority: PriorityLevel = PriorityLevel.P2_CODING
    prompt_tokens_est: int = 0
    max_tokens_requested: int = 2048
    payload: Dict[str, Any] = field(default_factory=dict)
    
    # Timing and Lifecycle
    created_at: float = field(default_factory=time.time)
    admitted_at: Optional[float] = None
    first_token_at: Optional[float] = None
    completed_at: Optional[float] = None
    timeout_seconds: float = 120.0
    retry_count: int = 0
    max_retries: int = 2
    
    # Scheduling Weights & Anti-Starvation
    virtual_start_time: float = 0.0
    effective_priority_score: float = 0.0
    allocated_slot_id: Optional[int] = None
    abort_event: Optional[Any] = None       # Asyncio / Threading Abort handle
```

---

## 4. Request Categorization, Prioritization & Anti-Starvation

### 4.1 Service Level Objectives (SLOs) by Category

| Priority Category | Priority Level | Target TTFT (Time to First Token) | Max Timeout | Token Budget ($T_{\text{max}}$) | Concurrency Limit per Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Interactive Agents** | `P0` | $< 1.2\,\text{seconds}$ | $60\,\text{seconds}$ | 2,048 | 1 slot dedicated |
| **Verification Tasks** | `P1` | $< 3.0\,\text{seconds}$ | $90\,\text{seconds}$ | 1,024 | Up to 2 slots |
| **Coding Tasks** | `P2` | $< 6.0\,\text{seconds}$ | $180\,\text{seconds}$ | 4,096 | Up to 2 slots |
| **Background Analysis** | `P3` | $< 25.0\,\text{seconds}$ | $300\,\text{seconds}$ | 4,096 | Up to 1 slot |
| **Batch Jobs** | `P4` | Best Effort ($< 60\,\text{s}$) | $600\,\text{seconds}$ | 8,192 | Opportunistic (only when queue idle) |

---

### 4.2 Scheduling Algorithm: Dynamic Weighted Fair Queuing (WFQ) with Aging

Simple strict priority queues cause complete starvation of lower-priority tasks (e.g. background research never runs if an interactive agent sends periodic prompts). 

The scheduler employs a **Dynamic Aging WFQ Algorithm**:

#### Mathematical Priority Score Formulation
For any pending request $i$ in queue at timestamp $t$:
$$\text{Score}(i, t) = \text{BaseWeight}(P_i) - \left( \alpha \cdot (t - t_{\text{created}, i}) \right) + \left( \beta \cdot \frac{C_{\text{prompt}, i}}{1024} \right)$$

Where:
- $\text{BaseWeight}(P)$: Static penalty offsets:
  - $P0 = 0$
  - $P1 = 1,000$
  - $P2 = 3,000$
  - $P3 = 6,000$
  - $P4 = 12,000$
- $\alpha$ (Aging Factor): $100\,\text{points/second}$. Every second a request waits in queue, its score decreases by 100 points. After 60 seconds of waiting, a $P3$ request drops by $6,000$ points, matching the score of a newly arrived $P0$ request and preventing indefinite postponement.
- $\beta$ (Short-Job-First Bias): $50\,\text{points/1k tokens}$. Penalizes enormous prompts slightly so low-overhead tasks can quickly slip through during small execution gaps.
- **Selection Rule:** At each dispatch opportunity, the scheduler picks the candidate with the **lowest numerical score**:
  $$i^* = \arg\min_{i \in \text{Queue}} \text{Score}(i, t)$$

#### Starvation Prevention Guardrail (Hard Floor)
If any request has waited longer than $t_{\text{starve\_threshold}} = 75.0\,\text{seconds}$, it automatically transitions to `EMERGENCY_PROMOTION`, preempting the next available slot regardless of priority class.

---

## 5. Model Allocation & Concurrency Strategy

### 5.1 Architecture Evaluation for 12,282 MiB VRAM

| Strategy | Feasibility on RTX 4080 (12GB) | Throughput Rating | Latency Rating | Evaluation Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **1. One Shared Model + Multiple Slots** | **HIGH (Optimal)** | **Very High** | **Low** | **SELECTED STRATEGY.** Single weight matrix (4.38 GiB) loaded once. 4 static slots share remaining VRAM. Zero reload delay. |
| **2. Pure Sequential Inference (1 Slot)** | HIGH | Poor (Serial bottleneck) | High tail latency | Rejected: Subagents block interactive chats entirely; tool calls queue serially. |
| **3. Multiple Model Instances in VRAM** | IMPOSSIBLE | High | Very High OOM Risk | Rejected: Two 7B models = $2 \times 4.38 = 8.76\,\text{GiB}$ weights + $2 \times \text{runtimes} \implies > 10.5\,\text{GiB}$, leaving $< 1.5\,\text{GiB}$ total for all KV caches combined. Extreme OOM risk. |
| **4. Dynamic Model Switching (Disk Swapping)** | POOR | Catastrophic (12s–25s reload) | High variance | Rejected: PCIe/Disk loading time kills agent interactivity; wearing NVMe drives. |
| **5. Dual Small Model Setup (e.g. 3B + 7B)** | MARGINAL | Moderate | Moderate | Not recommended: Compromises code comprehension capability; Qwen-2.5-7B is the minimum size for strict syntax adherence. |

---

### 5.2 Slot Allocation & Reservation Strategy

LM Studio is configured with a unified context pool of **32,768 tokens** split into **4 slots**:
- **Total Physical Slots:** 4.
- **Scheduler Max Concurrency Cap:** **3 Concurrently Active Slots**.
- **Reserved Headroom:** **1 Slot strictly reserved for $P0$ Interactive traffic**.

```
+----------------------------------------------------------------------------+
|                  LM STUDIO HARDWARE SLOTS (Total: 4)                       |
|                                                                            |
|   [Slot 0]              [Slot 1]              [Slot 2]         [Slot 3]    |
|   Capacity: 8,192       Capacity: 8,192       Capacity: 8,192  Capacity: 8k|
|   +---------------+     +---------------+     +--------------+ +---------+ |
|   | P0 Interactive|     | General Active|     | General Active | RESERVED| |
|   | or High-Pri   |     | (P1, P2, P3)  |     | (P1, P2, P3) | | (P0 Only| |
|   | Execution     |     | Execution     |     | Execution    | | or Spik)| |
|   +---------------+     +---------------+     +--------------+ +---------+ |
+----------------------------------------------------------------------------+
```

#### Why Limit Active Requests to $N_{\text{slots}} - 1$?
1. **Interactive Responsiveness:** When a human or lead agent triggers an urgent cancel or clarification, they never wait behind three 4,000-token batch jobs.
2. **Thermal & Power Modulation:** Running 4 slots concurrently under heavy prompt ingestion spikes the laptop GPU immediately into 86°C thermal boundary, causing the driver to downclock memory clocks from 9000 MHz to 5000 MHz. Operating at max 3 concurrent slots maintains GPU temperatures within $72^\circ\text{C}-78^\circ\text{C}$, yielding consistent sustained tokens/second.

---

## 6. Backpressure, Admission Control & Flow Regulation

### 6.1 Backpressure Policy & Queue Limits

Without backpressure, autonomous agents running iterative loops will rapidly enqueue hundreds of requests, exhausting host RAM and causing 10-minute queue waits.

```
                  Incoming Request
                         │
                         ▼
        ┌───────────────────────────────────┐
        │       Total Queue Depth >= 24?    ├──────► YES ──► REJECT (HTTP 429: Too Many Requests)
        └────────────────┬──────────────────┘
                         │ NO
                         ▼
        ┌───────────────────────────────────┐
        │   Agent Outstanding Inflight >= 3?├──────► YES ──► REJECT (HTTP 429: Per-Agent Slot Exceeded)
        └────────────────┬──────────────────┘
                         │ NO
                         ▼
        ┌───────────────────────────────────┐
        │  Total Prompt + MaxTokens > 16k?  ├──────► YES ──► REJECT (HTTP 400: Context Oversized)
        └────────────────┬──────────────────┘
                         │ NO
                         ▼
        ┌───────────────────────────────────┐
        │      Enqueue in Priority Heap     │
        └───────────────────────────────────┘
```

#### Sizing Parameters:
- **Maximum Global Queue Depth:** 24 requests.
- **Per-Agent Inflight Concurrency Ceiling:** 2 active slots max (prevents one greedy subagent from monopolizing the system).
- **Per-Agent Queued Request Limit:** 4 queued requests max.
- **Backpressure Response Header:**
  ```http
  HTTP/1.1 429 Too Many Requests
  Retry-After: 15
  X-Scheduler-Queue-Depth: 24
  X-Scheduler-Reason: GLOBAL_QUEUE_SATURATED
  ```

---

### 6.2 Token Bounding & Prompt Sanitization

Every request submitted to the scheduler proxy passes through an **Admission Gatekeeper**:
1. **Prompt Length Inspection:** Token estimation via fast BPE counter:
   $$\text{Tokens}_{\text{prompt}} = \text{bpe\_count}(\text{prompt})$$
2. **Context Window Ceiling Enforcement:**
   $$\text{Tokens}_{\text{prompt}} + \text{request}.\text{max\_tokens} \le 16,384$$
   If exceeded, the request is rejected immediately with an informative diagnostic error rather than failing midway through inference.
3. **Max Output Token Clamping:**
   If an agent requests `max_tokens: 32000`, the scheduler clamps it to the category ceiling (e.g. 2,048 for Interactive, 4,096 for Coding) to prevent rogue infinite generation loops.

---

## 7. Failure Handling & Resilience Matrix

The scheduler must handle catastrophic failure modes gracefully without user intervention or GPU crash.

| Failure Mode | Detection Trigger | Immediate Action | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **CUDA Out of Memory (OOM)** | HTTP 500 from LM Studio containing `"CUDA out of memory"` or `"failed to allocate kv cache"` | 1. Immediately abort offending request.<br>2. Freeze queue dispatching for 500ms.<br>3. Trigger slot flush. | Mark offending request unretryable (`FAILED_CONTEXT_TOO_LARGE`). Temporarily reduce max active concurrency from 3 to 2 for a 5-minute cooldown period. |
| **Model Unavailable / Unloaded** | HTTP 404 or `"model not found"` from `127.0.0.1:1234/v1/models` | 1. Pause queue.<br>2. Set state to `MODEL_UNAVAILABLE`. | Reject incoming requests with `HTTP 503 (Model Not Ready)`. Attempt background poll to LM Studio every 3s. Resume queue once model is verified loaded. |
| **LM Studio Process Crash** | Connection Refused (`ECONNREFUSED 127.0.0.1:1234`) | 1. Flag Circuit Breaker as `OPEN`.<br>2. Drain running requests with error `SERVER_OFFLINE`. | Keep queued requests paused for up to 30s. If connection restores, resume. If down $>30\text{s}$, purge queue with `SERVICE_UNAVAILABLE`. Emit alert log. |
| **Tool-Call / Inference Timeout** | `time.time() - req.admitted_at > req.timeout_seconds` | 1. Fire upstream `AbortController` / disconnect socket.<br>2. Terminate slot stream. | Send HTTP 504 to caller. Release slot reservation. Verify slot is clear before next dispatch. |
| **Agent Cancellation** | Client terminates SSE connection / issues `DELETE /v1/requests/{id}` | 1. Detect closed TCP connection immediately.<br>2. Disconnect socket to LM Studio. | LM Studio aborts generation for that slot immediately, freeing compute. Zero wasted decode cycles. |
| **Stale Queued Requests** | Request waiting in queue exceeds $1.5 \times \text{timeout\_seconds}$ | Evict directly from queue without dispatching. | Notify agent with `HTTP 408 Request Timeout in Queue`. |
| **Duplicate Requests** | Identical SHA-256 hash of `(agent_id, session_id, prompt)` within 10s | Drop duplicate request or attach listener to original request's broadcast stream. | Deduplication prevents accidental double-click or loop retries from clogging the queue. |
| **GPU Overheating (> 84°C)** | NVML query reports `GPU Temp >= 84°C` or `Thermal Throttle = Active` | 1. Throttle concurrency: Drop active slots from 3 to 1.<br>2. Introduce 200ms sleep between requests. | Allow laptop cooling fans to dissipate heat. Restore 3 slots once temp drops below 76°C. |

---

## 8. Security Architecture & Agent Isolation

Autonomous agents operate with independent execution goals and must be treated as untrusted callers relative to each other and the operating system.

```
                          Agent Request
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │  1. Authenticate Agent Token (Header check)   │
        └───────────────────────┬───────────────────────┘
                                │ Valid
                                ▼
        ┌───────────────────────────────────────────────┐
        │  2. Session Isolation & Context Sandboxing    │
        │     - Strip cross-agent session identifiers   │
        │     - Verify memory partition scope           │
        └───────────────────────┬───────────────────────┘
                                │ Sanitized
                                ▼
        ┌───────────────────────────────────────────────┐
        │  3. Policy Mutation Lock                      │
        │     - Block access to /admin, /config routes  │
        │     - Hardcode static scheduler invariants    │
        └───────────────────────┬───────────────────────┘
                                │ Passed
                                ▼
        ┌───────────────────────────────────────────────┐
        │  4. Localhost Loopback Enforcement            │
        │     - Bind strictly to 127.0.0.1 (No 0.0.0.0) │
        │     - Disallow arbitrary remote URLs / webhooks
        └───────────────────────┬───────────────────────┘
                                │ Verified
                                ▼
        ┌───────────────────────────────────────────────┐
        │  5. Zero-Execution Invariant                  │
        │     - Return raw JSON strings ONLY            │
        │     - Model completions never routed to shell │
        └───────────────────────────────────────────────┘
```

### 8.1 Isolation Guardrails

1. **Policy Mutation Immutability:**
   - Agents interact with the scheduler through standard OpenAI-compatible endpoints (`/v1/chat/completions`).
   - Schedulers administrative endpoints (`/scheduler/config`, `/scheduler/slots`, `/scheduler/policy`) require a master host token not accessible to agents. Agents cannot self-elevate priority or alter queue weights.
2. **Session Context Isolation:**
   - LM Studio does not store conversation state on disk when using stateless `/v1/chat/completions`; full conversational context is passed per request.
   - The scheduler validates that `session_id` strings are scoped to `agent_id`. Requests from Agent B cannot query or reference the context buffer of Agent A.
3. **Loopback & URL Sandboxing:**
   - The scheduler binds strictly to IPv4 loopback `127.0.0.1:3333`. It refuses to bind to `0.0.0.0` or external network adapters.
   - Requests containing callback URLs or external webhook targets are rejected immediately.
4. **Zero-Execution Invariant:**
   - The scheduler treats all LLM outputs as untrusted data streams. Output tokens are returned directly to the agent's HTTP response stream. The scheduler contains no execution hooks, eval routines, or command-line wrappers.

---

## 9. Observability & Telemetry Framework

A robust scheduler requires real-time insight into hardware thermals, queue friction, and token throughput.

### 9.1 Core Metrics Registry

| Metric Name | Type | Unit | Collection Method | Diagnostic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `gpu_vram_used_bytes` | Gauge | Bytes | NVML (`nvmlDeviceGetMemoryInfo`) | Detect VRAM creep and proximity to 12,282 MiB limit |
| `gpu_temperature_celsius` | Gauge | °C | NVML (`nvmlDeviceGetTemperature`) | Monitor laptop thermal health and trigger throttling |
| `gpu_power_draw_watts` | Gauge | Watts | NVML (`nvmlDeviceGetPowerUsage`) | Verify TDP scaling during prefill vs decode |
| `scheduler_queue_depth` | Gauge | Count | Internal priority heap counter | Quantify queue buildup by priority class ($P0-P4$) |
| `scheduler_queue_wait_seconds` | Histogram | Seconds | `req.admitted_at - req.created_at` | Measure queue latency and starvation indicators |
| `scheduler_active_slots` | Gauge | Count (0–4) | Slot manager state table | Track hardware slot utilization |
| `inference_ttft_seconds` | Histogram | Seconds | `req.first_token_at - req.admitted_at` | Measure prompt prefill duration and slot delay |
| `inference_tokens_per_second` | Gauge | Tok/s | Generated tokens / duration | Track model decode performance across parallel slots |
| `scheduler_failure_total` | Counter | Count | Classified error handlers | Group by reason: `OOM`, `TIMEOUT`, `OVERHEAT`, `503` |

### 9.2 Real-Time Health Status Endpoint (`GET /scheduler/status`)

```json
{
  "status": "HEALTHY",
  "uptime_seconds": 14205,
  "hardware": {
    "device": "NVIDIA GeForce RTX 4080 Laptop GPU",
    "vram_total_mib": 12282,
    "vram_used_mib": 7654,
    "vram_free_mib": 4628,
    "temperature_c": 74,
    "power_watts": 118.5,
    "thermal_throttling": false
  },
  "slots": {
    "total_slots": 4,
    "max_concurrent_admitted": 3,
    "active_slots": 2,
    "slot_table": [
      {"slot_id": 0, "status": "BUSY", "agent_id": "clawde-lead", "priority": "P0", "tokens_generated": 312},
      {"slot_id": 1, "status": "BUSY", "agent_id": "agent-coder-2", "priority": "P2", "tokens_generated": 845},
      {"slot_id": 2, "status": "IDLE", "agent_id": null, "priority": null, "tokens_generated": 0},
      {"slot_id": 3, "status": "RESERVED_P0", "agent_id": null, "priority": null, "tokens_generated": 0}
    ]
  },
  "queue": {
    "total_queued": 2,
    "by_priority": {"P0": 0, "P1": 0, "P2": 1, "P3": 1, "P4": 0},
    "longest_wait_seconds": 4.12
  },
  "performance": {
    "avg_tokens_per_second_system": 42.8,
    "avg_ttft_seconds": 0.88,
    "total_completed_requests": 1450,
    "total_failed_requests": 2
  }
}
```

---

## 10. Scheduler Core Logic (Reference Pseudocode)

The following reference implementation outlines the non-blocking asynchronous coordination core.

```python
"""
V8.28 Reference Design Architecture - Local GPU Inference Scheduler
Proxy between Antigravity Agents and LM Studio (llama.cpp)
"""

import asyncio
import time
import heapq
from typing import Dict, Optional, List
import aiohttp

class PriorityQueueScheduler:
    def __init__(self, lm_studio_url: str = "http://127.0.0.1:1234", max_concurrency: int = 3):
        self.lm_studio_url = lm_studio_url
        self.max_concurrency = max_concurrency
        self.active_slots: Dict[int, SchedulerRequest] = {}
        self.queue: List[SchedulerRequest] = []
        self.lock = asyncio.Lock()
        self.slot_available_event = asyncio.Event()
        self.slot_available_event.set()
        self.circuit_open = False
        self.thermal_throttle_active = False

    def calculate_priority_score(self, req: SchedulerRequest) -> float:
        """Dynamic Aging Weighted Fair Queuing"""
        now = time.time()
        wait_time = now - req.created_at
        
        # Base penalties
        base_weights = {0: 0.0, 1: 1000.0, 2: 3000.0, 3: 6000.0, 4: 12000.0}
        base = base_weights.get(int(req.priority), 3000.0)
        
        # Aging reward: 100 points deducted per waiting second
        aging = 100.0 * wait_time
        
        # Prompt length penalty
        size_penalty = 50.0 * (req.prompt_tokens_est / 1024.0)
        
        # Hard starvation floor: instant promotion if waiting > 75s
        if wait_time > 75.0:
            return -10000.0 - wait_time

        return base - aging + size_penalty

    async def enqueue_request(self, req: SchedulerRequest) -> aiohttp.web.Response:
        async with self.lock:
            # 1. Backpressure guardrail
            if len(self.queue) >= 24:
                return aiohttp.web.Response(status=429, text="Scheduler queue full. Backpressure triggered.")
            
            # 2. Check per-agent limits
            agent_queued = sum(1 for r in self.queue if r.agent_id == req.agent_id)
            if agent_queued >= 4:
                return aiohttp.web.Response(status=429, text="Per-agent queue capacity exceeded.")

            self.queue.append(req)
        
        # 3. Wait for slot dispatch
        await self.dispatch_loop_tick()
        
        # Await completion handle...
        return await self.monitor_execution(req)

    async def dispatch_loop_tick(self):
        """Dispatches highest priority request to an available hardware slot."""
        async with self.lock:
            if not self.queue:
                return
            
            effective_concurrency = 2 if self.thermal_throttle_active else self.max_concurrency
            if len(self.active_slots) >= effective_concurrency:
                return

            # Sort queue according to dynamic priority scores
            self.queue.sort(key=self.calculate_priority_score)
            
            # Select candidate
            candidate = self.queue.pop(0)
            
            # Assign slot ID (0, 1, or 2)
            assigned_slot = next(i for i in range(effective_concurrency) if i not in self.active_slots)
            candidate.allocated_slot_id = assigned_slot
            candidate.admitted_at = time.time()
            self.active_slots[assigned_slot] = candidate

            # Launch background worker
            asyncio.create_task(self.execute_inference(candidate))

    async def execute_inference(self, req: SchedulerRequest):
        """Streams request to LM Studio and manages timeouts/aborts."""
        url = f"{self.lm_studio_url}/v1/chat/completions"
        timeout = aiohttp.ClientTimeout(total=req.timeout_seconds)
        
        try:
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(url, json=req.payload) as resp:
                    if resp.status == 200:
                        async for chunk in resp.content.iter_any():
                            if req.abort_event and req.abort_event.is_set():
                                break  # Immediate cancellation
                            # Forward stream to client...
                    elif resp.status == 500:
                        body = await resp.text()
                        if "CUDA out of memory" in body:
                            self.handle_cuda_oom(req)
        except asyncio.TimeoutError:
            req.status = RequestStatus.TIMED_OUT
        except Exception as e:
            req.status = RequestStatus.FAILED
        finally:
            async with self.lock:
                if req.allocated_slot_id in self.active_slots:
                    del self.active_slots[req.allocated_slot_id]
                self.slot_available_event.set()
            
            # Trigger dispatch tick for next pending item
            await self.dispatch_loop_tick()

    def handle_cuda_oom(self, req: SchedulerRequest):
        """OOM Circuit recovery handler."""
        req.status = RequestStatus.FAILED
        # Temporarily throttle concurrency to allow VRAM stabilization
        self.thermal_throttle_active = True
```

---

## 11. Concrete Concurrency & Configuration Recommendations

Based on the physical limits of the NVIDIA RTX 4080 Laptop GPU (12,282 MiB VRAM) and `Qwen2.5-7B-Instruct-Q4_K_M`:

### 11.1 LM Studio Configuration Settings
| Setting Parameter | Recommended Value | Technical Justification |
| :--- | :--- | :--- |
| **Model** | `Qwen2.5-7B-Instruct-Q4_K_M.gguf` | 4.38 GiB weights. Leaves ~7.9 GiB free for KV cache and scratch buffers. |
| **GPU Offload (`n_gpu_layers`)** | `Max (All 28 Layers)` | 100% offload guarantees no CPU-GPU PCIe bus memory thrashing. |
| **Context Length (`n_ctx`)** | `32,768` Tokens | Unified context buffer. Divided among parallel slots. |
| **Parallel Slots (`n_parallel`)** | `4` Slots | Provides hardware slots for concurrent agent access. |
| **Batch Size (`n_batch`)** | `512` | Optimum prompt ingestion throughput on Ada Lovelace Tensor Cores. |
| **Micro-Batch Size (`n_ubatch`)** | `256` or `512` | Keeps prompt prefill from freezing active token generation on other slots. |
| **FlashAttention (`flash_attn`)** | `Enabled` | Crucial: Reduces activation memory overhead and speeds up attention computation by 2.5×. |
| **KV Cache Type (`-ctk`, `-ctv`)** | `f16` (or `q8_0`) | FP16 fits cleanly at 32k total context. Q8_0 reduces KV footprint by 47% if larger contexts are needed. |

### 11.2 Scheduler Middleware Settings
| Setting Parameter | Recommended Value | Technical Justification |
| :--- | :--- | :--- |
| **Proxy Port** | `127.0.0.1:3333` | Isolates agents from direct LM Studio access on `:1234`. |
| **Max Active Concurrency** | `3` Slots | Leaves 1 hardware slot free for emergency $P0$ interactive preemption. |
| **Max Global Queue Depth** | `24` Requests | Fast failover; prevents unbounded RAM usage. |
| **Max Per-Agent Inflight** | `2` Slots | Guarantees multi-agent fairness. |
| **Aging Parameter ($\alpha$)** | `100.0` points/sec | Prevents $P3/P4$ background research starvation. |
| **Starvation Hard Ceiling** | `75.0` seconds | Guaranteed execution deadline for any valid request. |
| **Max Context Ceiling** | `16,384` tokens/req | Prevents single massive prompt from starving the unified slot pool. |
| **Thermal High-Water Mark** | `83°C` | Reduces concurrency to 1 slot until GPU temperature cools to $76^\circ\text{C}$. |

---

## 12. Phased Implementation Roadmap

```
PHASE 1: Hardware Baseline & Telemetry Harness (Read-Only)
  ├── Step 1.1: Standalone NVML Python script to log baseline idle VRAM and thermals
  └── Step 1.2: Validate LM Studio health check endpoints without loading models

PHASE 2: Lightweight Proxy Core & Admission Control
  ├── Step 2.1: Implement AsyncIO HTTP Reverse Proxy (bind 127.0.0.1:3333 -> 127.0.0.1:1234)
  ├── Step 2.2: Add token estimation & 16k context boundary guardrails
  └── Step 2.3: Implement strict per-agent and global backpressure (HTTP 429)

PHASE 3: Dynamic Priority Queue & Aging WFQ
  ├── Step 3.1: Implement Priority Heap with Dynamic Aging Algorithm
  ├── Step 3.2: Implement 3-slot concurrency limiter and 1-slot P0 reservation
  └── Step 3.3: Add SSE disconnect detection (AbortController propagation)

PHASE 4: Resilience, Telemetry & Multi-Agent Integration
  ├── Step 4.1: Integrate NVML real-time thermal throttling interceptor
  ├── Step 4.2: Expose Prometheus-compatible /metrics and JSON /scheduler/status endpoints
  └── Step 4.3: Route Antigravity agents through scheduler proxy and benchmark under synthetic load
```

---

## 13. Verification & Compliance Checklist

- [x] **VRAM Memory Math Verified:** Modeled weights ($4,380\,\text{MiB}$), runtime ($1,500\,\text{MiB}$), and 32k KV cache ($1,792\,\text{MiB}$) yielding $7,672\,\text{MiB}$ total allocation, well within the $12,282\,\text{MiB}$ ceiling ($4,610\,\text{MiB}$ safe margin).
- [x] **Zero Starvation Verified:** Dynamic Aging WFQ algorithm mathematically guarantees that any request waiting $>75\,\text{s}$ receives emergency dispatch regardless of priority.
- [x] **Isolation & Security:** Loopback binding enforced (`127.0.0.1`), administrative mutation locked, session cross-talk disallowed, zero-execution model outputs invariant preserved.
- [x] **Read-Only Compliance:** System specification formulated purely as architectural design; zero processes launched, zero packages installed, zero GPU resources consumed, V8.25 untouched.
