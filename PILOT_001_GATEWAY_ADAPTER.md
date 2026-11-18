# PILOT-001 Gateway Adapter Documentation

**Version:** 1.0.0  
**Target Specification:** V8.32.72 / Gateway v8.32.46  
**Route Implemented:** `POST /v1/pilot/inference`  
**Execution Environment:** Local loopback (`127.0.0.1:4000`), Node.js 24, LM Studio (`127.0.0.1:1234`)

---

## 1. Architectural Role & Boundary

The PILOT-001 Gateway Adapter provides a backward-compatible, strictly validated interface on top of the Local Inference Gateway. It enforces the contract specified in `PILOT_001_JSON_CONTRACT.md` without disrupting the legacy `POST /v1/inference` route used by existing internal microservices.

### Key Architectural Tenets
1. **Separation of Concerns:** Legacy single-prompt calls use `/v1/inference`. Complex multi-message pilot tasks with structured outputs use `/v1/pilot/inference`.
2. **Zero-Trust Input Validation:** Validation executes before request admission or model invocation.
3. **Loopback Only:** All network communication is strictly confined to `127.0.0.1`.
4. **Synthetic Boundary:** Complete isolation from production databases, WhatsApp forensics archives, media files, or external APIs.

---

## 2. Authentication & Security Model

Authentication is enforced uniformly across the Gateway by `orchestration/middleware/internal-auth.js`:
- Requires a high-entropy Pre-Shared Key (`INTERNAL_SERVICE_PSK`, >= 32 characters).
- Accepts header `x-internal-service-token` or `Authorization: Bearer <token>`.
- Timing-safe constant-time verification using `crypto.timingSafeEqual` over SHA-256 digests.
- **Informational Identifiers:** `agent_id` and `task_id` are strictly informational and audit-binding identifiers. They are never treated as cryptographic authentication tokens.

---

## 3. Schema & Constraint Validation

All incoming requests and outgoing responses are checked against JSON Schema specifications (`pilot-request-schema.json` and `pilot-response-schema.json`) using `Ajv2020` with `ajv-formats`:
- **Disallowed Aliases:** Generic alias `local-model` is rejected. Models must match an actively loaded LM Studio identifier (e.g., `qwen2.5-7b-instruct`).
- **Aggregate Content Length:** Sum of all `messages[].content` strings must not exceed 8,192 characters.
- **Message Limit:** Bounded between 1 and 50 messages.
- **Mutual Exclusivity:**
  - `status == "SUCCESS"` requires `result != null` and `error == null`.
  - Failure statuses require `result == null` and `error != null`.
- **Timestamp:** Validated as strict ISO 8601 UTC date-time string.

---

## 4. Endpoints & Payloads

### Request: `POST /v1/pilot/inference`

Headers:
```http
Content-Type: application/json
x-internal-service-token: <HIGH_ENTROPY_PSK>
x-request-id: <OPTIONAL_CORRELATION_ID>
```

Body:
```json
{
  "task_id": "TASK-D40-02",
  "agent_id": "auditor-agent",
  "request_id": "req-synth-001",
  "model": "qwen2.5-7b-instruct",
  "temperature": 0.0,
  "output_schema_version": "1.0.0",
  "messages": [
    {
      "role": "system",
      "content": "You are a test validator. Respond in valid JSON only."
    },
    {
      "role": "user",
      "content": "Return: {\"status\":\"ok\",\"source\":\"synthetic_test\"}"
    }
  ],
  "max_tokens": 100,
  "timeout_ms": 30000
}
```

### Response: Success (`200 OK`)
```json
{
  "task_id": "TASK-D40-02",
  "agent_id": "auditor-agent",
  "request_id": "req-synth-001",
  "model": "qwen2.5-7b-instruct",
  "status": "SUCCESS",
  "result": {
    "text": "{\"status\":\"ok\",\"source\":\"synthetic_test\"}",
    "finish_reason": "stop",
    "parsed_json": {
      "status": "ok",
      "source": "synthetic_test"
    },
    "usage": {
      "prompt_tokens": 45,
      "completion_tokens": 15,
      "total_tokens": 60
    },
    "timing": {
      "inference_ms": 320,
      "total_ms": 328
    }
  },
  "error": null,
  "execution_timestamp": "2026-11-01T09:31:38.321Z"
}
```

### Response: Failure (e.g. `400 Bad Request` / `503 Service Unavailable`)
```json
{
  "task_id": "TASK-D40-02",
  "agent_id": "auditor-agent",
  "request_id": "req-synth-001",
  "model": "qwen2.5-7b-instruct",
  "status": "INVALID_REQUEST",
  "result": null,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Aggregate content length across all messages is 9000 chars, exceeding maximum of 8192",
    "details": null
  },
  "execution_timestamp": "2026-11-01T09:31:38.321Z"
}
```

---

## 5. Audit Logging & Phase Tracing

Phase telemetry is recorded for each inference request and queryable via `/v1/audit/logs?requestId=<request_id>`:
1. `PILOT_PHASE_1_RECEIVED`
2. `PILOT_PHASE_2_ADMITTED`
3. `PILOT_PHASE_3_DISPATCHED_TO_LM_STUDIO`
4. `PILOT_PHASE_4_RESPONSE_RECEIVED`
5. `PILOT_PHASE_5_COMPLETED`
