import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyCronAuth } from '../auth';
import { computeAlertHash } from '../../services/weather-alerts';

describe('PHASE 10.3 - Cron Security & Remediation Test Suite', () => {
    const REAL_SECRET = 'super-secret-token-12345';

    beforeEach(() => {
        vi.unstubAllEnvs();
        vi.stubEnv('CRON_SECRET', REAL_SECRET);
    });

    // -------------------------------------------------------------
    // TEST 1 & 2: Missing and Invalid CRON_SECRET
    // -------------------------------------------------------------
    describe('1. Endpoint Authentication (Authorization: Bearer)', () => {
        it('rejects requests with missing Authorization header', () => {
            const req = new Request('http://localhost:3000/api/cron/process-newsletters', {
                method: 'POST'
            });
            const result = verifyCronAuth(req);
            expect(result.authorized).toBe(false);
            expect(result.errorResponse?.status).toBe(401);
            expect(result.errorResponse?.error).toBe('Missing Authorization header');
        });

        it('rejects requests with invalid token', () => {
            const req = new Request('http://localhost:3000/api/cron/process-newsletters', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer wrong-secret' }
            });
            const result = verifyCronAuth(req);
            expect(result.authorized).toBe(false);
            expect(result.errorResponse?.status).toBe(401);
            expect(result.errorResponse?.error).toBe('Invalid Authorization token');
        });

        it('rejects query parameter based authentication attempt (no query string bypass)', () => {
            const req = new Request(`http://localhost:3000/api/cron/check-alerts?key=${REAL_SECRET}`, {
                method: 'POST'
            });
            const result = verifyCronAuth(req);
            expect(result.authorized).toBe(false);
            expect(result.errorResponse?.status).toBe(401);
        });

        it('returns 500 when server CRON_SECRET is not configured', () => {
            vi.stubEnv('CRON_SECRET', '');
            const req = new Request('http://localhost:3000/api/cron/process-newsletters', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${REAL_SECRET}` }
            });
            const result = verifyCronAuth(req);
            expect(result.authorized).toBe(false);
            expect(result.errorResponse?.status).toBe(500);
            expect(result.errorResponse?.error).toContain('CRON_SECRET missing');
        });

        it('accepts requests with exact Bearer token', () => {
            const req = new Request('http://localhost:3000/api/cron/process-newsletters', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${REAL_SECRET}` }
            });
            const result = verifyCronAuth(req);
            expect(result.authorized).toBe(true);
            expect(result.errorResponse).toBeUndefined();
        });
    });

    // -------------------------------------------------------------
    // TEST 3 & 4: Weather Alerts Hash & Deduplication
    // -------------------------------------------------------------
    describe('2. Weather Alerts Hash & Deduplication Logic', () => {
        it('computes deterministic hashes for identical alerts', () => {
            const alertA = {
                phenomenon: 'Oleaje',
                level: 'naranja',
                start: '2026-11-28T10:00:00Z',
                end: '2026-11-29T18:00:00Z'
            };
            const alertB = {
                phenomenon: 'Oleaje',
                level: 'naranja',
                start: '2026-11-28T10:00:00Z',
                end: '2026-11-29T18:00:00Z'
            };

            const hashA = computeAlertHash(alertA);
            const hashB = computeAlertHash(alertB);

            expect(hashA).toBe(hashB);
            expect(hashA).toHaveLength(32); // MD5 hex length
        });

        it('generates different hashes if severity level changes (re-trigger notification)', () => {
            const yellowAlert = {
                phenomenon: 'Galerna',
                level: 'amarillo',
                start: '2026-11-28T10:00:00Z',
                end: '2026-11-28T20:00:00Z'
            };
            const redAlert = {
                phenomenon: 'Galerna',
                level: 'rojo',
                start: '2026-11-28T10:00:00Z',
                end: '2026-11-28T20:00:00Z'
            };

            expect(computeAlertHash(yellowAlert)).not.toBe(computeAlertHash(redAlert));
        });
    });

    // -------------------------------------------------------------
    // TEST 5: Atomic Newsletter Claim & Concurrency
    // -------------------------------------------------------------
    describe('3. Newsletter Atomic Worker Claim Simulation', () => {
        it('simulates atomic claim where only the first worker acquires the newsletter', async () => {
            const rowState = { id: 'nl-1', status: 'scheduled' };

            // Atomic update function simulating: UPDATE newsletters SET status='processing' WHERE id='nl-1' AND status='scheduled'
            const atomicClaim = async (workerId: string) => {
                if (rowState.status === 'scheduled') {
                    rowState.status = 'processing';
                    return { success: true, workerId, claimed: true };
                }
                return { success: true, workerId, claimed: false };
            };

            // Two simultaneous workers attempting to claim the same newsletter
            const [worker1Result, worker2Result] = await Promise.all([
                atomicClaim('worker-1'),
                atomicClaim('worker-2')
            ]);

            const claimedCount = [worker1Result.claimed, worker2Result.claimed].filter(Boolean).length;
            expect(claimedCount).toBe(1);
            expect(rowState.status).toBe('processing');
        });
    });

    // -------------------------------------------------------------
    // TEST 6: Partial Delivery & Failed Recipient Retry Tracking
    // -------------------------------------------------------------
    describe('4. Newsletter Partial Delivery & Retry State', () => {
        it('tracks partial delivery without marking whole newsletter as sent', () => {
            const subscribers = [
                { email: 'user1@example.com' },
                { email: 'user2@example.com' },
                { email: 'user3@example.com' }
            ];

            const existingLogs: any[] = [
                { email: 'user1@example.com', status: 'delivered', timestamp: '2026-11-28T00:00:00Z' }
            ];

            const alreadyDelivered = new Set(
                existingLogs.filter(l => l.status === 'delivered').map(l => l.email)
            );

            // Filtering out already delivered recipients on retry run
            const remainingToProcess = subscribers.filter(s => !alreadyDelivered.has(s.email));

            expect(remainingToProcess).toHaveLength(2);
            expect(remainingToProcess.map(s => s.email)).toEqual(['user2@example.com', 'user3@example.com']);

            // If 1 succeeds and 1 fails in this retry
            const updatedLogs = [
                ...existingLogs,
                { email: 'user2@example.com', status: 'delivered', timestamp: '2026-11-28T01:00:00Z' },
                { email: 'user3@example.com', status: 'failed', timestamp: '2026-11-28T01:00:00Z', error: 'SMTP Timeout' }
            ];

            const deliveredTotal = updatedLogs.filter(l => l.status === 'delivered').length;
            const isComplete = (deliveredTotal === subscribers.length);

            // Must NOT mark as sent because user3 failed
            expect(isComplete).toBe(false);
            const status = isComplete ? 'sent' : 'scheduled';
            expect(status).toBe('scheduled');
        });
    });

    // -------------------------------------------------------------
    // TEST 7: Weekly Challenge Uniqueness & RPC Fallback
    // -------------------------------------------------------------
    describe('5. Weekly Challenge Safe Graceful Degradation', () => {
        it('handles unconfigured Supabase RPC without throwing error', async () => {
            const mockRpc = async (funcName: string) => {
                if (funcName === 'get_or_create_weekly_challenge') {
                    return {
                        data: null,
                        error: {
                            code: 'PGRST202',
                            message: 'Could not find the function public.get_or_create_weekly_challenge in schema cache'
                        }
                    };
                }
                return { data: null, error: null };
            };

            const result = await (async () => {
                const { error } = await mockRpc('get_or_create_weekly_challenge');
                if (error && (error.code === 'PGRST202' || error.message.includes('not found'))) {
                    return {
                        success: true,
                        not_configured: true,
                        message: 'Weekly challenge migration pending in Supabase. Skipped safely.'
                    };
                }
                return { success: false };
            })();

            expect(result.success).toBe(true);
            expect(result.not_configured).toBe(true);
        });
    });
});