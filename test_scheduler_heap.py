"""
Synthetic Test Suite: Scheduler Min-Heap, Aging, and Dual-Clock SLA
Covers:
- Priority ordering and tie-breaking
- Linear priority aging calculations
- P0-P4 starvation scenarios & leap-frogging impossibility
- 180.0s hard wall-clock eviction boundary
- Contention clock pause / quarantine clock behavior
- Timer and cancellation edge cases
"""

import heapq
import time
import unittest
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

@dataclass(order=True)
class QueuedRequest:
    sort_key: tuple = field(init=False)
    priority_class: int  # 0 to 4
    enqueue_time: float
    arrival_counter: int
    request_id: str = field(compare=False)
    wall_deadline: float = field(compare=False)
    client_aborted: bool = field(default=False, compare=False)
    
    BASE_WEIGHTS = {0: 0.0, 1: 1000.0, 2: 2000.0, 3: 3000.0, 4: 4000.0}
    AGING_RATE = 1000.0 / 90.0  # 11.111... pts/sec

    def __post_init__(self):
        self.update_score(self.enqueue_time)

    def calculate_score(self, current_time: float) -> float:
        wait_wall = max(0.0, current_time - self.enqueue_time)
        base = self.BASE_WEIGHTS.get(self.priority_class, 4000.0)
        return base - (self.AGING_RATE * wait_wall)

    def update_score(self, current_time: float):
        self.sort_key = (self.calculate_score(current_time), self.arrival_counter)


class SchedulerMinHeap:
    def __init__(self, wall_sla_sec: float = 180.0, contention_sla_sec: float = 60.0):
        self.heap: List[QueuedRequest] = []
        self.counter: int = 0
        self.wall_sla = wall_sla_sec
        self.contention_sla = contention_sla_sec
        self.permit_busy = False
        self.permit_quarantined = False
        self.busy_accumulated_time = 0.0
        self.last_busy_start: Optional[float] = None
        self.quarantine_start: Optional[float] = None
        self.quarantine_accumulated_time = 0.0

    def enqueue(self, priority: int, current_time: float, request_id: str) -> QueuedRequest:
        self.counter += 1
        req = QueuedRequest(
            priority_class=priority,
            enqueue_time=current_time,
            arrival_counter=self.counter,
            request_id=request_id,
            wall_deadline=current_time + self.wall_sla
        )
        heapq.heappush(self.heap, req)
        return req

    def rebuild_heap(self, current_time: float):
        active = [r for r in self.heap if not r.client_aborted]
        for r in active:
            r.update_score(current_time)
        heapq.heapify(active)
        self.heap = active

    def set_permit_busy(self, current_time: float):
        if not self.permit_busy:
            self.permit_busy = True
            self.last_busy_start = current_time

    def set_permit_idle(self, current_time: float):
        if self.permit_busy:
            self.permit_busy = False
            if self.last_busy_start is not None:
                self.busy_accumulated_time += (current_time - self.last_busy_start)
                self.last_busy_start = None

    def set_permit_quarantined(self, current_time: float):
        self.permit_quarantined = True
        self.quarantine_start = current_time

    def clear_permit_quarantine(self, current_time: float):
        if self.permit_quarantined:
            self.permit_quarantined = False
            if self.quarantine_start is not None:
                self.quarantine_accumulated_time += (current_time - self.quarantine_start)
                self.quarantine_start = None

    def poll_evictions(self, current_time: float) -> List[tuple]:
        evicted = []
        remaining = []
        
        effective_quarantine_pause = self.quarantine_accumulated_time
        if self.permit_quarantined and self.quarantine_start is not None:
            effective_quarantine_pause += (current_time - self.quarantine_start)

        for req in self.heap:
            if req.client_aborted:
                evicted.append((req.request_id, "CLIENT_ABORT"))
                continue
            
            effective_wait = (current_time - req.enqueue_time) - effective_quarantine_pause
            
            if effective_wait >= self.wall_sla:
                evicted.append((req.request_id, "HTTP_504_WALL_CLOCK_EVICTED"))
            else:
                remaining.append(req)
        
        self.heap = remaining
        heapq.heapify(self.heap)
        return evicted

    def dispatch_next(self, current_time: float) -> Optional[QueuedRequest]:
        if self.permit_busy or self.permit_quarantined:
            return None
        self.poll_evictions(current_time)
        self.rebuild_heap(current_time)
        while self.heap:
            cand = heapq.heappop(self.heap)
            if not cand.client_aborted:
                return cand
        return None


class TestSchedulerSynthetic(unittest.TestCase):

    def test_priority_ordering_same_arrival(self):
        """Test strict priority ordering P0 > P1 > P2 > P3 > P4 on simultaneous arrival."""
        sched = SchedulerMinHeap()
        t0 = 1000.0
        sched.enqueue(4, t0, "req_p4")
        sched.enqueue(3, t0, "req_p3")
        sched.enqueue(2, t0, "req_p2")
        sched.enqueue(1, t0, "req_p1")
        sched.enqueue(0, t0, "req_p0")

        order = []
        while True:
            r = sched.dispatch_next(t0)
            if not r:
                break
            order.append(r.priority_class)
        
        self.assertEqual(order, [0, 1, 2, 3, 4], "Simultaneous arrivals must dispatch in strict priority order 0..4")

    def test_tie_breaking_fifo(self):
        """Test FIFO tie-breaking within identical priority class."""
        sched = SchedulerMinHeap()
        t0 = 1000.0
        sched.enqueue(2, t0, "p2_first")
        sched.enqueue(2, t0, "p2_second")
        sched.enqueue(2, t0, "p2_third")

        dispatched = [sched.dispatch_next(t0).request_id for _ in range(3)]
        self.assertEqual(dispatched, ["p2_first", "p2_second", "p2_third"], "Equal priority must break ties by FIFO counter")

    def test_p4_starvation_and_leapfrog_impossibility(self):
        """
        Adversarial Test: Can a P4 request ever overtake a fresh P0 before being evicted at 180s?
        Mathematical proof: Delta P = 4000 pts. Aging = 11.11 pts/s -> 360s needed.
        Hard wall-clock eviction occurs at 180.0s. Effective score at 180s = 2000.0 pts.
        Fresh P0 score = 0 pts. Since 2000.0 > 0, P4 CAN NEVER overtake fresh P0.
        """
        sched = SchedulerMinHeap(wall_sla_sec=180.0)
        t_start = 1000.0
        req_p4 = sched.enqueue(4, t_start, "victim_p4")
        
        time_steps = [1000.0 + 20.0 * i for i in range(1, 10)]
        
        for t in time_steps:
            if t < 1180.0:
                fresh_p0 = sched.enqueue(0, t, f"fresh_p0_at_{t}")
                sched.rebuild_heap(t)
                top = sched.heap[0]
                self.assertEqual(top.priority_class, 0, f"At t={t}, fresh P0 score ({top.sort_key[0]}) must beat aging P4 ({req_p4.calculate_score(t)})")
        
        t_evict = 1180.0
        evicted = sched.poll_evictions(t_evict)
        evicted_ids = [e[0] for e in evicted]
        self.assertIn("victim_p4", evicted_ids, "P4 must be evicted at 180.0s without ever being dispatched")
        
        score_at_180 = req_p4.calculate_score(t_evict)
        self.assertAlmostEqual(score_at_180, 2000.0, places=2)

    def test_quarantine_clock_pause(self):
        """
        Test that when permit transitions to RESOURCE_QUARANTINED,
        waiting queue wall-clock expiration is properly paused or accounted for.
        """
        sched = SchedulerMinHeap(wall_sla_sec=180.0)
        t0 = 1000.0
        sched.enqueue(1, t0, "req_p1")
        
        sched.set_permit_quarantined(1050.0)
        
        evictions = sched.poll_evictions(1200.0)
        self.assertEqual(len(evictions), 0, "Quarantined time must pause queue eviction clock, preventing false 504")
        
        sched.clear_permit_quarantine(1250.0)
        
        evictions_after = sched.poll_evictions(1381.0)
        self.assertEqual(len(evictions_after), 1)
        self.assertEqual(evictions_after[0], ("req_p1", "HTTP_504_WALL_CLOCK_EVICTED"))

    def test_cancellation_and_client_abort_edge_case(self):
        """Test client abort while queued: heap must purge cancelled items cleanly."""
        sched = SchedulerMinHeap()
        t0 = 1000.0
        r1 = sched.enqueue(1, t0, "r1")
        r2 = sched.enqueue(0, t0, "r2")
        r3 = sched.enqueue(0, t0, "r3")

        r2.client_aborted = True
        
        d1 = sched.dispatch_next(t0)
        d2 = sched.dispatch_next(t0)
        d3 = sched.dispatch_next(t0)
        
        self.assertEqual(d1.request_id, "r3")
        self.assertEqual(d2.request_id, "r1")
        self.assertIsNone(d3)


if __name__ == "__main__":
    unittest.main()
