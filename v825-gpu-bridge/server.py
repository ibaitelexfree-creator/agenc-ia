"""
local-gpu-bridge MCP Server
V8.25 - Antigravity Local MCP GPU Bridge
"""

import sys
import time
import json
import uuid
import datetime
import threading
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, List
from mcp.server.mcpserver import MCPServer

# Create MCP server instance
server = MCPServer(
    name="local-gpu-bridge",
    description="Bridge connecting Antigravity agents to local GPU inference via LM Studio"
)

# Internal concurrency limiter (Phase 1 specification: limit to 2 concurrent inference requests)
_inference_semaphore = threading.Semaphore(2)

def _log_stderr(msg: str):
    """Logs diagnostic messages strictly to stderr to keep stdout clean for MCP stdio protocol."""
    sys.stderr.write(f"[{datetime.datetime.now(datetime.timezone.utc).isoformat()}] [local-gpu-bridge] {msg}\n")
    sys.stderr.flush()

@server.tool(
    name="gpu_bridge_echo",
    description="Verify end-to-end MCP communication without using the GPU."
)
def gpu_bridge_echo(message: str) -> str:
    """Echo tool for validation."""
    req_id = str(uuid.uuid4())
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    _log_stderr(f"gpu_bridge_echo invoked: req_id={req_id}")
    
    result = {
        "received": str(message),
        "server": "local-gpu-bridge",
        "status": "success",
        "timestamp": now_iso,
        "request_id": req_id
    }
    return json.dumps(result, ensure_ascii=False)

@server.tool(
    name="gpu_bridge_health",
    description="Check the local LM Studio API status without generating tokens."
)
def gpu_bridge_health() -> str:
    """Health check for local LM Studio endpoint."""
    target_url = "http://127.0.0.1:1234/v1/models"
    req_id = str(uuid.uuid4())
    _log_stderr(f"gpu_bridge_health invoked: req_id={req_id}")
    
    start_t = time.perf_counter()
    reachable = False
    http_status = None
    available_models: List[str] = []
    error_msg = None
    
    try:
        req = urllib.request.Request(target_url, headers={"User-Agent": "Antigravity-LocalGPUBridge/1.0"})
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            http_status = resp.status
            reachable = (resp.status == 200)
            data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, dict) and "data" in data and isinstance(data["data"], list):
                available_models = [m.get("id", "") for m in data["data"] if "id" in m]
    except urllib.error.HTTPError as e:
        http_status = e.code
        error_msg = f"HTTP {e.code}: {e.reason}"
    except urllib.error.URLError as e:
        error_msg = f"URLError: {e.reason}"
    except Exception as e:
        error_msg = f"Exception: {str(e)}"
        
    latency_ms = round((time.perf_counter() - start_t) * 1000.0, 2)
    
    result = {
        "reachable": reachable,
        "http_status": http_status,
        "available_models": available_models,
        "latency_ms": latency_ms,
        "error": error_msg,
        "request_id": req_id
    }
    return json.dumps(result, ensure_ascii=False)

@server.tool(
    name="gpu_bridge_inference",
    description="Execute a controlled inference request through local LM Studio."
)
def gpu_bridge_inference(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: float = 0.0,
    max_tokens: int = 150,
    request_id: Optional[str] = None
) -> str:
    """Execute local inference against LM Studio with strict validation."""
    assigned_req_id = request_id if request_id and str(request_id).strip() else str(uuid.uuid4())
    _log_stderr(f"gpu_bridge_inference invoked: req_id={assigned_req_id}")
    
    # Validation checks
    if not isinstance(prompt, str) or not prompt.strip():
        return json.dumps({
            "status": "error",
            "error_type": "ValidationError",
            "error": "Prompt must be a non-empty string.",
            "request_id": assigned_req_id
        }, ensure_ascii=False)
        
    if not isinstance(temperature, (int, float)) or temperature < 0.0 or temperature > 2.0:
        return json.dumps({
            "status": "error",
            "error_type": "ValidationError",
            "error": f"Invalid temperature: {temperature}. Must be between 0.0 and 2.0.",
            "request_id": assigned_req_id
        }, ensure_ascii=False)
        
    if not isinstance(max_tokens, int) or max_tokens <= 0 or max_tokens > 300:
        return json.dumps({
            "status": "error",
            "error_type": "ValidationError",
            "error": f"Invalid max_tokens: {max_tokens}. Must be an integer between 1 and 300.",
            "request_id": assigned_req_id
        }, ensure_ascii=False)

    messages = []
    if system_prompt and isinstance(system_prompt, str) and system_prompt.strip():
        messages.append({"role": "system", "content": system_prompt.strip()})
    messages.append({"role": "user", "content": prompt.strip()})
    
    endpoint = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "messages": messages,
        "temperature": float(temperature),
        "max_tokens": int(max_tokens),
        "stream": False
    }
    
    # Internal concurrency gate (max 2 concurrent)
    acquired = _inference_semaphore.acquire(timeout=60.0)
    if not acquired:
        return json.dumps({
            "status": "error",
            "error_type": "ConcurrencyLimitError",
            "error": "Server concurrency limit reached (max 2 outstanding inference requests).",
            "request_id": assigned_req_id
        }, ensure_ascii=False)
        
    start_time = time.perf_counter()
    try:
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=body,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Antigravity-LocalGPUBridge/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=60.0) as resp:
            latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
            resp_data = json.loads(resp.read().decode("utf-8"))
            
            choices = resp_data.get("choices", [])
            generated_text = ""
            finish_reason = None
            if choices and isinstance(choices, list):
                msg_obj = choices[0].get("message", {})
                generated_text = msg_obj.get("content", "")
                finish_reason = choices[0].get("finish_reason")
                
            model_id = resp_data.get("model", "unknown")
            usage = resp_data.get("usage", {})
            
            return json.dumps({
                "status": "success",
                "text": generated_text,
                "model": model_id,
                "latency_ms": latency_ms,
                "finish_reason": finish_reason,
                "usage": usage,
                "request_id": assigned_req_id
            }, ensure_ascii=False)
    except urllib.error.HTTPError as e:
        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
        try:
            err_body = e.read().decode("utf-8")
        except Exception:
            err_body = e.reason
        return json.dumps({
            "status": "error",
            "error_type": "HTTPError",
            "http_status": e.code,
            "error": f"HTTP {e.code}: {err_body}",
            "latency_ms": latency_ms,
            "request_id": assigned_req_id
        }, ensure_ascii=False)
    except urllib.error.URLError as e:
        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
        return json.dumps({
            "status": "error",
            "error_type": "EndpointUnavailableError",
            "error": f"LM Studio endpoint unreachable: {e.reason}",
            "latency_ms": latency_ms,
            "request_id": assigned_req_id
        }, ensure_ascii=False)
    except TimeoutError:
        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
        return json.dumps({
            "status": "error",
            "error_type": "TimeoutError",
            "error": "Inference request timed out after 60 seconds.",
            "latency_ms": latency_ms,
            "request_id": assigned_req_id
        }, ensure_ascii=False)
    except Exception as e:
        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
        return json.dumps({
            "status": "error",
            "error_type": "InternalError",
            "error": f"Unexpected error: {str(e)}",
            "latency_ms": latency_ms,
            "request_id": assigned_req_id
        }, ensure_ascii=False)
    finally:
        _inference_semaphore.release()

if __name__ == "__main__":
    _log_stderr("Starting local-gpu-bridge MCP server via stdio transport...")
    server.run(transport="stdio")
