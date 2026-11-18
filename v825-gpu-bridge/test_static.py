import sys
import json
import asyncio
from server import server, gpu_bridge_echo, gpu_bridge_health, gpu_bridge_inference

async def run_tests():
    print("--- 1. Testing tool schema registration ---")
    tools = await server.list_tools()
    tool_names = [t.name for t in tools]
    print("Registered tools:", tool_names)
    assert "gpu_bridge_echo" in tool_names, "Missing gpu_bridge_echo"
    assert "gpu_bridge_health" in tool_names, "Missing gpu_bridge_health"
    assert "gpu_bridge_inference" in tool_names, "Missing gpu_bridge_inference"

    print("\n--- 2. Testing gpu_bridge_echo direct call ---")
    res = gpu_bridge_echo("Direct static test message")
    data = json.loads(res)
    print("Echo result:", data)
    assert data["received"] == "Direct static test message"
    assert data["server"] == "local-gpu-bridge"
    assert data["status"] == "success"

    print("\n--- 3. Testing gpu_bridge_health with LM Studio offline ---")
    health_res = gpu_bridge_health()
    hdata = json.loads(health_res)
    print("Health result (offline):", hdata)
    assert hdata["reachable"] is False
    assert hdata["error"] is not None

    print("\n--- 4. Testing gpu_bridge_inference argument validation ---")
    # Empty prompt
    err1 = json.loads(gpu_bridge_inference(""))
    assert err1["status"] == "error" and err1["error_type"] == "ValidationError"
    print("Empty prompt rejected as expected:", err1["error"])

    # Invalid max_tokens
    err2 = json.loads(gpu_bridge_inference("Hello", max_tokens=1000))
    assert err2["status"] == "error" and err2["error_type"] == "ValidationError"
    print("Excessive max_tokens rejected as expected:", err2["error"])

    # Invalid temperature
    err3 = json.loads(gpu_bridge_inference("Hello", temperature=-5.0))
    assert err3["status"] == "error" and err3["error_type"] == "ValidationError"
    print("Invalid temperature rejected as expected:", err3["error"])

    # Offline inference attempt
    err4 = json.loads(gpu_bridge_inference("Test prompt"))
    assert err4["status"] == "error" and err4["error_type"] == "EndpointUnavailableError"
    print("Offline inference returned clean structured error:", err4["error"])

    print("\nALL STATIC AND LOCAL LOGIC TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
