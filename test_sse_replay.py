"""
Synthetic Test Suite: SSE Streaming, High-Water-Mark Replay, and Backpressure Buffer Semantics
Covers:
- HWM replay correctness and deduplication
- Concurrent event arrival during replay phase
- Observer queue overflow at capacity Q_obs = 96
- Slow-client backpressure and queue fullness
- History eviction and HISTORY_GAP_EXCEEDED severance
- Zero-loss and zero-duplication property verification
"""

import collections
import unittest
from typing import List, Optional, Dict, Any, Tuple

class SSEEvent:
    def __init__(self, seq_id: int, event_type: str, data: str):
        self.seq_id = seq_id
        self.event_type = event_type
        self.data = data

    def format_sse(self) -> str:
        return f"id: {self.seq_id:016d}\nevent: {self.event_type}\ndata: {self.data}\n\n"


class SSEReplayCoordinator:
    """
    Synthetic implementation of the SSE ring buffer and subscriber dispatch:
    - History Ring: maxlen = 64
    - Observer Queues: maxlen = 96
    - High-Water-Mark (HWM) Replay Protocol
    """
    def __init__(self, history_cap: int = 64, observer_cap: int = 96):
        self.history_cap = history_cap
        self.observer_cap = observer_cap
        self.history = collections.deque(maxlen=history_cap)
        self.observers: Dict[str, collections.deque] = {}
        self.current_seq = 0

    def emit_event(self, event_type: str, data: str) -> SSEEvent:
        self.current_seq += 1
        ev = SSEEvent(self.current_seq, event_type, data)
        self.history.append(ev)
        
        # Fan out to all active observers
        for obs_id, q in list(self.observers.items()):
            if len(q) >= self.observer_cap:
                # Observer queue overflow! Under spec, slow observer must be severed
                del self.observers[obs_id]
            else:
                q.append(ev)
        return ev

    def attach_observer(self, obs_id: str, last_event_id: Optional[int]) -> Tuple[List[SSEEvent], str]:
        """
        Attaches observer and returns (replay_events, status).
        If last_event_id is too old (gap exceeded), returns error and rejects.
        """
        q = collections.deque(maxlen=self.observer_cap)
        
        if last_event_id is None or last_event_id == 0:
            self.observers[obs_id] = q
            return [], "ATTACHED_LIVE"
        
        if not self.history:
            return [], "HISTORY_EMPTY"
            
        oldest_seq = self.history[0].seq_id
        newest_seq = self.history[-1].seq_id
        
        if last_event_id < oldest_seq - 1:
            return [], "HISTORY_GAP_EXCEEDED"
            
        if last_event_id >= newest_seq:
            self.observers[obs_id] = q
            return [], "ATTACHED_CAUGHT_UP"
            
        replay_slice = [ev for ev in self.history if ev.seq_id > last_event_id]
        self.observers[obs_id] = q
        
        return replay_slice, "ATTACHED_WITH_REPLAY"

    def drain_observer(self, obs_id: str, hwm_seq: int) -> List[SSEEvent]:
        """
        Drains observer queue applying HWM deduplication:
        Any event with seq_id <= hwm_seq was already replayed and is discarded.
        """
        if obs_id not in self.observers:
            return []
            
        q = self.observers[obs_id]
        emitted = []
        while q:
            ev = q.popleft()
            if ev.seq_id <= hwm_seq:
                continue
            emitted.append(ev)
        return emitted


class TestSSEReplaySynthetic(unittest.TestCase):

    def test_hwm_deduplication_under_race(self):
        """
        Test that events arriving in the live observer queue WHILE replay is transmitting
        are strictly deduplicated via HWM and emitted without loss or duplicate.
        """
        coord = SSEReplayCoordinator(history_cap=64, observer_cap=96)
        
        for i in range(10):
            coord.emit_event("chunk", f"chunk_{i+1}")
            
        replay_events, status = coord.attach_observer("obs_1", last_event_id=5)
        self.assertEqual(status, "ATTACHED_WITH_REPLAY")
        self.assertEqual([e.seq_id for e in replay_events], [6, 7, 8, 9, 10])
        
        hwm = replay_events[-1].seq_id
        self.assertEqual(hwm, 10)
        
        coord.emit_event("chunk", "chunk_11")
        coord.emit_event("chunk", "chunk_12")
        coord.emit_event("chunk", "chunk_13")
        
        live_emitted = coord.drain_observer("obs_1", hwm_seq=hwm)
        self.assertEqual([e.seq_id for e in live_emitted], [11, 12, 13])
        
        full_stream = [e.seq_id for e in (replay_events + live_emitted)]
        self.assertEqual(full_stream, [6, 7, 8, 9, 10, 11, 12, 13])

    def test_observer_queue_overflow_at_capacity_96(self):
        """
        Mandatory Adversarial Test:
        Can a 96-event observer queue overflow while replay is being transmitted?
        Simulate a slow client: does not drain. Fast producer emits > 96 events.
        """
        coord = SSEReplayCoordinator(history_cap=64, observer_cap=96)
        
        for i in range(5):
            coord.emit_event("chunk", f"initial_{i}")
        replay, status = coord.attach_observer("slow_client", last_event_id=0)
        
        for i in range(96):
            coord.emit_event("chunk", f"flood_{i}")
            
        self.assertIn("slow_client", coord.observers)
        self.assertEqual(len(coord.observers["slow_client"]), 96)
        
        coord.emit_event("chunk", "overflow_chunk")
        self.assertNotIn("slow_client", coord.observers, "Slow client exceeding Q_obs=96 must be severed from observers")

    def test_history_gap_exceeded_severance(self):
        """
        Test that reconnecting with an evicted Last-Event-ID triggers HISTORY_GAP_EXCEEDED
        and severs connection rather than silently dropping chunks.
        """
        coord = SSEReplayCoordinator(history_cap=64, observer_cap=96)
        
        for i in range(100):
            coord.emit_event("chunk", f"ev_{i+1}")
            
        replay, status = coord.attach_observer("stale_client", last_event_id=20)
        self.assertEqual(status, "HISTORY_GAP_EXCEEDED")
        self.assertEqual(len(replay), 0)
        self.assertNotIn("stale_client", coord.observers)


if __name__ == "__main__":
    unittest.main()
