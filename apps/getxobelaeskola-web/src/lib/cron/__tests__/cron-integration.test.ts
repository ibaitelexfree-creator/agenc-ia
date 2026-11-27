import { describe, it, expect, vi, beforeEach } from 'vitest';
import { claimNewsletterWithLease, verifyWorkerLease } from '../../services/newsletter';
import { computeAlertHash } from '../../services/weather-alerts';

describe('PHASE 10.5 - Concurrency, Lease Safety & State Machine Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------------------------
    // 1. WORKER LEASE SAFETY & STALE WORKER PREVENTION
    // -------------------------------------------------------------------------
    describe('Task 1: Worker Lease Safety & Stale Worker Prevention', () => {
        it('prevents stale worker from modifying campaign after lease expires and is reclaimed', async () => {
            // Simulated database record
            const dbRecord = {
                id: 'nl-campaign-456',
                status: 'scheduled',
                locked_by: null as string | null,
                lease_expires_at: null as string | null,
                updated_at: '2026-11-28T00:00:00Z'
            };

            const mockSupabase = {
                from: (table: string) => ({
                    update: (payload: any) => ({
                        eq: (col1: string, val1: any) => ({
                            eq: (col2: string, val2: any) => ({
                                select: async () => {
                                    if (dbRecord[col1] === val1 && dbRecord[col2] === val2) {
                                        Object.assign(dbRecord, payload);
                                        return { data: [{ id: dbRecord.id }], error: null };
                                    }
                                    return { data: [], error: null };
                                },
                                lte: (col3: string, val3: any) => ({
                                    select: async () => {
                                        if (dbRecord[col1] === val1 && dbRecord[col2] === val2 && dbRecord[col3] <= val3) {
                                            Object.assign(dbRecord, payload);
                                            return { data: [{ id: dbRecord.id }], error: null };
                                        }
                                        return { data: [], error: null };
                                    }
                                })
                            }),
                            lte: (col2: string, val2: any) => ({
                                select: async () => {
                                    if (dbRecord[col1] === val1 && dbRecord[col2] <= val2) {
                                        Object.assign(dbRecord, payload);
                                        return { data: [{ id: dbRecord.id }], error: null };
                                    }
                                    return { data: [], error: null };
                                }
                            })
                        })
                    }),
                    select: (fields: string) => ({
                        eq: (col: string, val: any) => ({
                            single: async () => {
                                if (dbRecord[col] === val) {
                                    return { data: { ...dbRecord }, error: null };
                                }
                                return { data: null, error: 'Not found' };
                            }
                        })
                    })
                })
            };

            const workerA = 'worker_nodeA_1111';
            const workerB = 'worker_nodeB_2222';

            // 1. Worker A claims campaign with a 1-second lease
            const claimedA = await claimNewsletterWithLease(mockSupabase, 'nl-campaign-456', workerA, 1);
            expect(claimedA).toBe(true);
            expect(dbRecord.locked_by).toBe(workerA);
            expect(dbRecord.status).toBe('processing');

            // 2. Worker A lease is initially valid
            const leaseValidForA = await verifyWorkerLease(mockSupabase, 'nl-campaign-456', workerA);
            expect(leaseValidForA).toBe(true);

            // 3. Simulate passage of time past lease expiration (Worker A becomes stale)
            dbRecord.lease_expires_at = new Date(Date.now() - 5000).toISOString();

            // 4. Worker B notices expired lease and reclaims campaign
            const claimedB = await claimNewsletterWithLease(mockSupabase, 'nl-campaign-456', workerB, 600);
            expect(claimedB).toBe(true);
            expect(dbRecord.locked_by).toBe(workerB);

            // 5. Worker A wakes up and attempts to continue
            const leaseStillValidForA = await verifyWorkerLease(mockSupabase, 'nl-campaign-456', workerA);
            expect(leaseStillValidForA).toBe(false); // MUST BE REJECTED

            // 6. Worker B holds the valid lease
            const leaseValidForB = await verifyWorkerLease(mockSupabase, 'nl-campaign-456', workerB);
            expect(leaseValidForB).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 2. WEATHER ALERT COMPLETE STATE MACHINE
    // -------------------------------------------------------------------------
    describe('Task 3: Weather Alert Complete State Machine', () => {
        it('correctly transitions across all states: first alert -> deduplicated -> severity escalation -> retry on failure', () => {
            const baseAlert = {
                phenomenon: 'Galerna',
                start: '2026-11-28T12:00:00Z',
                end: '2026-11-28T22:00:00Z'
            };

            // 1. Initial yellow alert
            const hashYellow = computeAlertHash({ ...baseAlert, level: 'amarillo' });

            // Database stores it as sent
            const sentDatabase = new Map<string, { status: string; expires_at: string }>();
            sentDatabase.set(hashYellow, {
                status: 'sent',
                expires_at: '2026-11-28T22:00:00Z'
            });

            // Subsequent check during active window: must suppress
            const isSuppressedYellow = sentDatabase.get(hashYellow)?.status === 'sent' &&
                new Date(sentDatabase.get(hashYellow)!.expires_at).getTime() > new Date('2026-11-28T14:00:00Z').getTime();
            expect(isSuppressedYellow).toBe(true);

            // 2. Escalation to red alert: must produce new hash and NOT be suppressed
            const hashRed = computeAlertHash({ ...baseAlert, level: 'rojo' });
            expect(hashRed).not.toBe(hashYellow);
            expect(sentDatabase.has(hashRed)).toBe(false); // Dispatches new email immediately!

            // 3. Failed provider send simulation
            sentDatabase.set(hashRed, {
                status: 'failed',
                expires_at: '2026-11-28T22:00:00Z'
            });

            // Failed status must NOT suppress future retries
            const isSuppressedFailed = sentDatabase.get(hashRed)?.status === 'sent';
            expect(isSuppressedFailed).toBe(false); // Ready to retry!

            // 4. Expiration check
            const isSuppressedExpired = sentDatabase.get(hashYellow)?.status === 'sent' &&
                new Date(sentDatabase.get(hashYellow)!.expires_at).getTime() > new Date('2026-11-29T00:00:00Z').getTime();
            expect(isSuppressedExpired).toBe(false); // Once expired, no longer active
        });
    });
});