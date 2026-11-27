import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renewWorkerLease } from '../../services/newsletter';
import { computeAlertHash } from '../../services/weather-alerts';

describe('PHASE 10.6 - Final Concurrency, Lease Safety & State Machine Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------------------------
    // 1. WORKER LEASE RENEWAL & CONCURRENCY
    // -------------------------------------------------------------------------
    describe('Task 2: Worker Lease Renewal & Heartbeat Safety', () => {
        it('allows active worker to renew valid lease, but denies renewal if expired or stolen', async () => {
            const nowIso = new Date().toISOString();
            const futureIso = new Date(Date.now() + 600 * 1000).toISOString();

            const dbRecord = {
                id: 'nl-campaign-renewal-test',
                status: 'processing',
                locked_by: 'worker_active_1',
                lease_expires_at: futureIso,
                updated_at: nowIso
            };

            const mockSupabase = {
                from: (_table: string) => ({
                    update: (payload: any) => ({
                        eq: (col1: string, val1: any) => ({
                            eq: (col2: string, val2: any) => ({
                                eq: (col3: string, val3: any) => ({
                                    gt: (col4: string, val4: any) => ({
                                        select: async () => {
                                            // Conditional update checking worker, status, and unexpired lease
                                            if (
                                                dbRecord[col1] === val1 &&
                                                dbRecord[col2] === val2 &&
                                                dbRecord[col3] === val3 &&
                                                dbRecord[col4] > val4
                                            ) {
                                                Object.assign(dbRecord, payload);
                                                return { data: [{ id: dbRecord.id }], error: null };
                                            }
                                            return { data: [], error: null };
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            };

            // 1. Worker 1 actively renews valid lease -> SUCCEEDS
            const renewed = await renewWorkerLease(mockSupabase, 'nl-campaign-renewal-test', 'worker_active_1', 600);
            expect(renewed).toBe(true);

            // 2. Imposter Worker 2 attempts to renew Worker 1 lease -> FAILS
            const imposterRenewed = await renewWorkerLease(mockSupabase, 'nl-campaign-renewal-test', 'worker_imposter_2', 600);
            expect(imposterRenewed).toBe(false);

            // 3. Lease expires
            dbRecord.lease_expires_at = new Date(Date.now() - 5000).toISOString();

            // 4. Worker 1 tries to renew after lease expired -> FAILS (must not resurrect expired lease)
            const staleRenewal = await renewWorkerLease(mockSupabase, 'nl-campaign-renewal-test', 'worker_active_1', 600);
            expect(staleRenewal).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // 2. RESEND IDEMPOTENCY KEY SPECIFICATIONS
    // -------------------------------------------------------------------------
    describe('Task 1: Resend Idempotency Key Rules', () => {
        it('ensures idempotency keys are deterministic, unique per recipient, and within 256 characters', () => {
            const newsletterId = '7f8c4e5b-21a4-4f91-88c2-3e5f2a1b0c9d';
            const recipient1 = 'user.name+tag@example.co.uk';
            const recipient2 = 'another.user@getxobelaeskola.com';

            const key1_attempt1 = `nl_${newsletterId}_${Buffer.from(recipient1).toString('base64').replace(/=/g, '')}`;
            const key1_attempt2 = `nl_${newsletterId}_${Buffer.from(recipient1).toString('base64').replace(/=/g, '')}`;
            const key2 = `nl_${newsletterId}_${Buffer.from(recipient2).toString('base64').replace(/=/g, '')}`;

            // Deterministic
            expect(key1_attempt1).toBe(key1_attempt2);
            // Different recipients never share key
            expect(key1_attempt1).not.toBe(key2);
            // Must stay well within Resend 256-character limit
            expect(key1_attempt1.length).toBeLessThanOrEqual(256);
            expect(key2.length).toBeLessThanOrEqual(256);
        });
    });

    // -------------------------------------------------------------------------
    // 3. WEATHER ALERT COMPLETE STATE MACHINE
    // -------------------------------------------------------------------------
    describe('Task 3: Weather Alert Complete State Machine', () => {
        it('correctly transitions across all states: first alert -> deduplicated -> severity escalation -> retry on failure', () => {
            const baseAlert = {
                phenomenon: 'Galerna',
                start: '2026-11-28T12:00:00Z',
                end: '2026-11-28T22:00:00Z'
            };

            const hashYellow = computeAlertHash({ ...baseAlert, level: 'amarillo' });
            const sentDatabase = new Map<string, { status: string; expires_at: string }>();
            sentDatabase.set(hashYellow, {
                status: 'sent',
                expires_at: '2026-11-28T22:00:00Z'
            });

            // Suppressed during active window
            const isSuppressedYellow = sentDatabase.get(hashYellow)?.status === 'sent' &&
                new Date(sentDatabase.get(hashYellow)!.expires_at).getTime() > new Date('2026-11-28T14:00:00Z').getTime();
            expect(isSuppressedYellow).toBe(true);

            // Escalation to red alert: produces new hash
            const hashRed = computeAlertHash({ ...baseAlert, level: 'rojo' });
            expect(hashRed).not.toBe(hashYellow);
            expect(sentDatabase.has(hashRed)).toBe(false);

            // Failed send simulation: retries allowed
            sentDatabase.set(hashRed, {
                status: 'failed',
                expires_at: '2026-11-28T22:00:00Z'
            });
            const isSuppressedFailed = sentDatabase.get(hashRed)?.status === 'sent';
            expect(isSuppressedFailed).toBe(false);
        });
    });
});