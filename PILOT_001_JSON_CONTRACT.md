# PILOT 001 JSON CONTRACT SPECIFICATION
**Document ID:** PILOT-001-CONTRACT-SPEC  
**Reference Task:** TASK-D40-01  
**Target Gateway Route:** `POST /v1/inference` (or `/v1/pilot/inference`)  
**Status:** PROPOSED FOR PILOT VERIFICATION  
**Security Level:** CONTROLLED LOCAL ENVIRONMENT ONLY — NO PRODUCTION TRAFFIC  

---

## 1. PURPOSE & ARCHITECTURAL SCOPE

This document defines the strict, bi-directional JSON payload contract for the first supervised AI pilot (`PILOT-001`). It governs communication between caller agents/orchestration workers and the Local Inference Gateway (`127.0.0.1:4000`) backed by local LM Studio runtime (`127.0.0.1:1234`).

> [!IMPORTANT]
> **Authentication Clarification**:  
> In accordance with security engineering best practices, including `task_id` or `agent_id` in the JSON body **DOES NOT** authenticate an agent. Cryptographic identity and authorization MUST be validated at the transport/session boundary using the Pre-Shared Key (`x-internal-service-token` or Bearer header). `agent_id` and `task_id` within the JSON body are **strictly informational and audit-binding identifiers** unless backed by a signed cryptographic token.

---

## 2. REQUEST CONTRACT SPECIFICATION

### 2.1 Required Fields & Validation Matrix

| Field | Type | Required? | Validation Rule / Range | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `task_id` | String | **YES** | Non-empty regex `^[A-Za-z0-9_\-\.]{3,64}$` | Informational / Audit | Traceability back to authorized task (e.g., `TASK-D40-01`) |
| `agent_id` | String | **YES** | Non-empty regex `^[A-Za-z0-9_\-\.]{3,64}$` | Informational / Audit | Identifies caller persona/role (e.g., `auditor-agent-01`) |
| `request_id` | String | **YES** | UUIDv4 or string `^[A-Za-z0-9_\-]{8,64}$` | **Validated & Echoed** | Idempotency and distributed log correlation |
| `model` | String | **YES** | Must match loaded local model identifier (e.g., `qwen2.5-7b-instruct`) | **Validated** | Target inference model identifier |
| `temperature` | Float | **YES** | Range: `0.0 <= temperature <= 2.0` (Default: `0.0` for deterministic tasks) | **Validated** | Sampling temperature |
| `messages` | Array | **YES** | Non-empty array of objects (`role`, `content`). Max total character length <= 8192 | **Validated** | Structured conversation / prompt sequence |
| `output_schema_version` | String | **YES** | Must be semver or string format (e.g., `1.0.0`) | **Validated** | Ensures caller expects compatible schema |

### 2.2 Optional / Configuration Fields

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `max_tokens` | Integer | `150` | Maximum completion tokens permitted (bounded by Gateway `GATEWAY_MAX_TOKENS = 4096`). |
| `timeout_ms` | Integer | `60000` | Client requested timeout in ms (capped at Gateway ceiling of 120000 ms). |

### 2.3 JSON Schema for Request (`pilot-request-schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PilotInferenceRequest",
  "type": "object",
  "required": [
    "task_id",
    "agent_id",
    "request_id",
    "model",
    "temperature",
    "messages",
    "output_schema_version"
  ],
  "properties": {
    "task_id": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_\\-\\.]{3,64}$",
      "description": "Informational task identifier for telemetry and audit logging."
    },
    "agent_id": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_\\-\\.]{3,64}$",
      "description": "Informational agent identifier. Does NOT grant authentication."
    },
    "request_id": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_\\-]{8,64}$",
      "description": "Client-generated or gateway-propagated correlation ID."
    },
    "model": {
      "type": "string",
      "enum": ["qwen2.5-7b-instruct", "local-model"],
      "description": "Target local LLM identifier. Must be actively loaded."
    },
    "temperature": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 2.0,
      "description": "Inference temperature."
    },
    "messages": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["role", "content"],
        "properties": {
          "role": {
            "type": "string",
            "enum": ["system", "user", "assistant"]
          },
          "content": {
            "type": "string",
            "minLength": 1,
            "maxLength": 8192
          }
        },
        "additionalProperties": false
      }
    },
    "output_schema_version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Schema version expected by the caller (e.g. 1.0.0)."
    },
    "max_tokens": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4096
    },
    "timeout_ms": {
      "type": "integer",
      "minimum": 100,
      "maximum": 120000
    }
  },
  "additionalProperties": false
}
```

---

## 3. RESPONSE CONTRACT SPECIFICATION

### 3.1 Required Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `task_id` | String | Echoed from request. |
| `agent_id` | String | Echoed from request. |
| `request_id` | String | Echoed or generated correlation ID. |
| `model` | String | Actual runtime model identifier resolved by the backend. |
| `status` | String | Standardized status enumeration (see Section 3.2). |
| `result` | Object \| Null | Payload object when `status == "SUCCESS"`; otherwise `null`. |
| `error` | Object \| Null | Error details when `status != "SUCCESS"`; otherwise `null`. |
| `execution_timestamp` | String | ISO 8601 UTC timestamp of response generation. |

### 3.2 Status Categorization Matrix

The response contract explicitly differentiates execution outcomes into distinct status categories:

| Status Code | HTTP Status | Description / Condition |
| :--- | :--- | :--- |
| `SUCCESS` | `200 OK` | Model inference succeeded, output generated and validated. |
| `INVALID_REQUEST` | `400 Bad Request` | Payload failed JSON schema validation (missing fields, malformed messages, out of bounds). |
| `AUTH_FAILURE` | `401 Unauthorized` | Missing or invalid Pre-Shared Key (`x-internal-service-token`). |
| `MODEL_UNAVAILABLE` | `503 Service Unavailable` / `400 Bad Request` | Target model not loaded, wrong identifier, or LM Studio runtime offline. |
| `TIMEOUT` | `504 Gateway Timeout` | Model inference exceeded `timeout_ms` or gateway default ceiling. |
| `INVALID_MODEL_OUTPUT` | `502 Bad Gateway` | Model generated malformed JSON or empty string when structured output was expected. |
| `RATE_LIMITED` | `429 Too Many Requests` | Maximum gateway concurrency slots occupied. |

### 3.3 Structure of `result` (Success Payload)

```json
{
  "text": "Raw generated text response from the LLM",
  "finish_reason": "stop",
  "parsed_json": { ... }, 
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 12,
    "total_tokens": 40
  },
  "timing": {
    "inference_ms": 320,
    "total_ms": 325
  }
}
```

### 3.4 Structure of `error` (Failure Payload)

```json
{
  "code": "MODEL_UNAVAILABLE",
  "message": "Connection to LM Studio failed at http://127.0.0.1:1234",
  "details": null
}
```

### 3.5 JSON Schema for Response (`pilot-response-schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PilotInferenceResponse",
  "type": "object",
  "required": [
    "task_id",
    "agent_id",
    "request_id",
    "model",
    "status",
    "result",
    "error",
    "execution_timestamp"
  ],
  "properties": {
    "task_id": {
      "type": "string"
    },
    "agent_id": {
      "type": "string"
    },
    "request_id": {
      "type": "string"
    },
    "model": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "SUCCESS",
        "INVALID_REQUEST",
        "AUTH_FAILURE",
        "MODEL_UNAVAILABLE",
        "TIMEOUT",
        "INVALID_MODEL_OUTPUT",
        "RATE_LIMITED"
      ]
    },
    "result": {
      "type": ["object", "null"]
    },
    "error": {
      "type": ["object", "null"]
    },
    "execution_timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "additionalProperties": false
}
```

---

## 4. EXAMPLE WIRE PAYLOADS

### 4.1 Synthetic Test Request
```http
POST /v1/inference HTTP/1.1
Host: 127.0.0.1:4000
Content-Type: application/json
x-internal-service-token: [REDACTED_HIGH_ENTROPY_PSK]

{
  "task_id": "TASK-D40-01",
  "agent_id": "auditor-agent",
  "request_id": "req-synth-001-test",
  "model": "qwen2.5-7b-instruct",
  "temperature": 0.0,
  "output_schema_version": "1.0.0",
  "messages": [
    {
      "role": "user",
      "content": "Return exactly {\"status\":\"ok\",\"source\":\"synthetic_test\"}"
    }
  ],
  "max_tokens": 50
}
```

### 4.2 Synthetic Test Response (Success)
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "task_id": "TASK-D40-01",
  "agent_id": "auditor-agent",
  "request_id": "req-synth-001-test",
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
      "prompt_tokens": 30,
      "completion_tokens": 15,
      "total_tokens": 45
    },
    "timing": {
      "inference_ms": 115,
      "total_ms": 118
    }
  },
  "error": null,
  "execution_timestamp": "2026-11-01T09:15:00.000Z"
}
```

---

## 5. PROPOSED GATEWAY INTEGRATION & RETROFIT PLAN

1. **Current Prototype Limitation**:  
   The existing `gateway-server.js` (`v8.32.46`) expects:
   ```json
   {
     "prompt": "...",
     "system_prompt": "...",
     "model": "...",
     "temperature": 0,
     "max_tokens": 150
   }
   ```
   It accepts `request_id` but does not yet accept or validate `task_id`, `agent_id`, `messages[]`, or `output_schema_version`.
2. **Backward Compatibility Strategy**:
   The Gateway will support an adapter layer: if `messages` is present, it constructs the payload for LM Studio directly; if `task_id` and `agent_id` are provided, it propagates them into the structured pilot response envelope.
3. **No Premature RBAC**:
   True cryptographic identity and authorization will remain strictly enforced by PSK and mutual TLS in subsequent tasks without creating complex, unverified RBAC structures prematurely.
