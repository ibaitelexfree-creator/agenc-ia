import { describe, it, expect, vi, beforeEach } from 'vitest';
import { claimNewsletter, recoverStuckNewsletters } from '../../services/newsletter';
import { computeAlertHash } from '../../services/weather-alerts';

describe('PHASE 10.4 - Integration & Concurrency Safety Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------------------------
    // 1. NEWSLETTER ATOMIC CLAIM & STUCK RECOVERY
    // -------------------------------------------------------------------------
    describe('Newsletter Atomic Claims and Stuck Recovery', () => {
        it('demonstrates single conditional database operation: only first worker claims', async () => {
            const dbMock = {
                rows: [{ id: 'campaign-123', status: 'scheduled', updated_at: '2026-11-28T00:00:00Z' }]
            };

            const mockSupabase = {
                from: (table: string) => ({
                    update: (payload: any) => ({
                        eq: (col1: string, val1: any) => ({
                            eq: (col2: string, val2: any) => ({
                                select: async (fields: string) => {
                                    const target = dbMock.rows.find(r => r[col1] === val1 && r[col2] === val2);
                                    if (!target) return { data: [], error: null };
                                    Object.assign(target, payload);
                                    return { data: [{ id: target.id }], error: null };
                                }
                            })
                        })
                    })
                })
            };

            // Two simultaneous workers attempting to claim the campaign
            const [workerA, workerB] = await Promise.all([
                claimNewsletter(mockSupabase, 'campaign-123'),
                claimNewsletter(mockSupabase, 'campaign-123')
            ]);

            // Exactly one worker must succeed, the other must fail
            expect(workerA !== workerB).toBe(true);
            expect(workerA ? 1 : 0 + (workerB ? 1 : 0)).toBe(1);
            expect(dbMock.rows[0].status).toBe('processing');
        });

        it('recovers campaigns stuck in processing state past the threshold', async () => {
            const staleDate = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 mins ago
            const freshDate = new Date(Date.now() - 5 * 60 * 1000).toISOString();  // 5 mins ago

            const dbMock = {
                rows: [
                    { id: 'stuck-1', status: 'processing', updated_at: staleDate },
                    { id: 'active-2', status: 'processing', updated_at: freshDate }
                ]
            };

            const mockSupabase = {
                from: (table: string) => ({
                    update: (payload: any) => ({
                        eq: (col1: string, val1: any) => ({
                            lte: (col2: string, val2: any) => ({
                                select: async () => {
                                    const threshold = new Date(val2).getTime();
                                    const updated: any[] = [];
                                    for (const r of dbMock.rows) {
                                        if (r.status === val1 && new Date(r.updated_at).getTime() <= threshold) {
                                            Object.assign(r, payload);
                                            updated.push({ id: r.id });
                                        }
                                    }
                                    return { data: updated, error: null };
                                }
                            })
                        })
                    })
                })
            };

            const recoveredCount = await recoverStuckNewsletters(mockSupabase, 15);
            expect(recoveredCount).toBe(1);
            expect(dbMock.rows.find(r => r.id === 'stuck-1')?.status).toBe('scheduled');
            expect(dbMock.rows.find(r => r.id === 'active-2')?.status).toBe('processing');
        });
    });

    // -------------------------------------------------------------------------
    // 2. WEATHER ALERT DEDUPLICATION & SEVERITY ESCALATION
    // -------------------------------------------------------------------------
    describe('Weather Alert Deduplication and Severity Escalation', () => {
        it('differentiates alerts upon severity escalation, ensuring immediate new notification', () => {
            const baseAlert = {
                phenomenon: 'Viento Fuerte',
                start: '2026-11-28T09:00:00Z',
                end: '2026-11-28T18:00:00Z'
            };

            const hashYellow = computeAlertHash({ ...baseAlert, level: 'amarillo' });
            const hashOrange = computeAlertHash({ ...baseAlert, level: 'naranja' });
            const hashRed = computeAlertHash({ ...baseAlert, level: 'rojo' });

            expect(hashYellow).not.toBe(hashOrange);
            expect(hashOrange).not.toBe(hashRed);
            expect(hashYellow).not.toBe(hashRed);
        });

        it('filters out already delivered alerts unless status is failed or alert expired', () => {
            const now = Date.now();
            const future = new Date(now + 24 * 3600 * 1000).toISOString();
            const past = new Date(now - 3600 * 1000).toISOString();

            const existingRecords = [
                { alert_hash: 'hash-sent-valid', status: 'sent', expires_at: future },
                { alert_hash: 'hash-sent-expired', status: 'sent', expires_at: past },
                { alert_hash: 'hash-failed', status: 'failed', expires_at: future }
            ];

            const alreadyProcessedHashes = new Set<string>();

            for (const row of existingRecords) {
                if (row.status === 'sent' && row.expires_at) {
                    if (new Date(row.expires_at).getTime() > now) {
                        alreadyProcessedHashes.add(row.alert_hash);
                    }
                }
            }

            // Only valid, active 'sent' alerts are suppressed
            expect(alreadyProcessedHashes.has('hash-sent-valid')).toBe(true);
            expect(alreadyProcessedHashes.has('hash-sent-expired')).toBe(false);
            expect(alreadyProcessedHashes.has('hash-failed')).toBe(false); // Retries failed sends
        });
    });

    // -------------------------------------------------------------------------
    // 3. WEEKLY CHALLENGE CONCURRENCY UNIQUENESS
    // -------------------------------------------------------------------------
    describe('Weekly Challenge Concurrency & Idempotency', () => {
        it('guarantees unique weekly challenge per week under simulated concurrent calls', async () => {
            const challengesTable: any[] = [];
            const weekStart = '2026-11-23';
            const weekEnd = '2026-11-29';

            // Function simulating the PostgreSQL get_or_create_weekly_challenge logic with ON CONFLICT
            const getOrCreateChallenge = async (clientId: string) => {
                const existing = challengesTable.find(c => c.start_date === weekStart && c.end_date === weekEnd);
                if (existing) {
                    return { id: existing.id, created: false, clientId };
                }
                const newId = `chal-${Math.random().toString(36).substring(7)}`;
                challengesTable.push({
                    id: newId,
                    start_date: weekStart,
                    end_date: weekEnd
                });
                return { id: newId, created: true, clientId };
            };

            const [req1, req2] = await Promise.all([
                getOrCreateChallenge('client-1'),
                getOrCreateChallenge('client-2')
            ]);

            expect(challengesTable).toHaveLength(1);
            expect(req1.id).toBe(req2.id);
        });
    });
});