import { createAdminClient } from '@/lib/supabase/admin';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import crypto from 'crypto';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export interface NewsletterProcessResult {
    success: boolean;
    processed: number;
    totalSent: number;
    totalFailed: number;
    message?: string;
    results?: any[];
    error?: string;
}

/**
 * Claims a scheduled newsletter atomically with a bounded worker lease.
 * Returns true if this worker successfully acquired the campaign lease.
 * A campaign can be claimed if:
 * 1. status = 'scheduled'
 * 2. OR status = 'processing' but lease_expires_at <= NOW() (stale/crashed worker)
 */
export async function claimNewsletterWithLease(
    supabase: any,
    newsletterId: string,
    workerId: string,
    leaseDurationSeconds: number = 600
): Promise<boolean> {
    const now = new Date();
    const leaseExpiresAt = new Date(now.getTime() + leaseDurationSeconds * 1000).toISOString();
    const nowIso = now.toISOString();

    // 1. Claim scheduled campaign
    const { data: claimScheduled, error: err1 } = await supabase
        .from('newsletters')
        .update({
            status: 'processing',
            locked_by: workerId,
            lease_expires_at: leaseExpiresAt,
            updated_at: nowIso
        })
        .eq('id', newsletterId)
        .eq('status', 'scheduled')
        .select('id');

    if (!err1 && claimScheduled && claimScheduled.length > 0) {
        return true;
    }

    // 2. Reclaim stale/crashed campaign whose lease expired
    const { data: claimStale, error: err2 } = await supabase
        .from('newsletters')
        .update({
            status: 'processing',
            locked_by: workerId,
            lease_expires_at: leaseExpiresAt,
            updated_at: nowIso
        })
        .eq('id', newsletterId)
        .eq('status', 'processing')
        .lte('lease_expires_at', nowIso)
        .select('id');

    if (!err2 && claimStale && claimStale.length > 0) {
        console.warn(`[NEWSLETTER] Worker ${workerId} reclaimed expired lease for campaign ${newsletterId}.`);
        return true;
    }

    return false;
}

/**
 * Renews the worker lease actively during batch processing.
 * ATOMIC CONDITIONAL UPDATE:
 * Only succeeds if locked_by STILL matches this worker AND status is 'processing' AND lease hasn't already expired!
 * Prevents stale workers from extending an expired lease or stealing back a reclaimed campaign.
 */
export async function renewWorkerLease(
    supabase: any,
    newsletterId: string,
    workerId: string,
    extensionSeconds: number = 600
): Promise<boolean> {
    const now = new Date();
    const nowIso = now.toISOString();
    const newLeaseExpiresAt = new Date(now.getTime() + extensionSeconds * 1000).toISOString();

    const { data, error } = await supabase
        .from('newsletters')
        .update({
            lease_expires_at: newLeaseExpiresAt,
            updated_at: nowIso
        })
        .eq('id', newsletterId)
        .eq('locked_by', workerId)
        .eq('status', 'processing')
        .gt('lease_expires_at', nowIso)
        .select('id');

    if (error || !data || data.length === 0) {
        return false;
    }
    return true;
}

/**
 * Verifies if the current worker still holds an active, unexpired lease.
 */
export async function verifyWorkerLease(
    supabase: any,
    newsletterId: string,
    workerId: string
): Promise<boolean> {
    const { data, error } = await supabase
        .from('newsletters')
        .select('locked_by, lease_expires_at, status')
        .eq('id', newsletterId)
        .single();

    if (error || !data) return false;

    if (data.status !== 'processing') return false;
    if (data.locked_by && data.locked_by !== workerId) return false;
    if (data.lease_expires_at && new Date(data.lease_expires_at).getTime() < Date.now()) return false;

    return true;
}

/**
 * Robust, atomic processor for scheduled newsletters with active lease renewals and provider idempotency.
 */
export async function processScheduledNewsletters(): Promise<NewsletterProcessResult> {
    const supabase = createAdminClient();
    const workerId = `worker_${process.pid}_${crypto.randomBytes(4).toString('hex')}`;
    const nowIso = new Date().toISOString();

    // 1. Fetch candidates with status 'scheduled' or expired processing leases
    const { data: pendingNewsletters, error: fetchError } = await (supabase as any)
        .from('newsletters')
        .select('*')
        .or(`status.eq.scheduled,and(status.eq.processing,lease_expires_at.lte.${nowIso})`)
        .or(`scheduled_for.lte.${nowIso},scheduled_for.is.null`);

    if (fetchError || !pendingNewsletters || pendingNewsletters.length === 0) {
        return { success: true, processed: 0, totalSent: 0, totalFailed: 0, message: 'No hay boletines pendientes de envío.' };
    }

    // 2. Critical guard: Provider configuration check
    if (!resend) {
        console.error('[NEWSLETTER] Resend API client is not configured. Aborting execution without mutating newsletter states to sent.');
        return {
            success: false,
            processed: 0,
            totalSent: 0,
            totalFailed: 0,
            message: 'Proveedor de correo (Resend) no configurado. Se mantiene el estado programado.'
        };
    }

    // 3. Fetch active subscribers
    const { data: subscribers, error: subError } = await (supabase as any)
        .from('newsletter_subscriptions')
        .select('email, locale')
        .eq('active', true);

    if (subError || !subscribers || subscribers.length === 0) {
        console.log('[NEWSLETTER] No active newsletter subscribers found.');
        return {
            success: true,
            processed: pendingNewsletters.length,
            totalSent: 0,
            totalFailed: 0,
            message: 'No hay suscriptores activos en la lista.'
        };
    }

    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://getxobelaeskola.com' : 'http://localhost:3000');
    let totalSentCount = 0;
    let totalFailedCount = 0;
    const processResults: any[] = [];

    for (const newsletter of pendingNewsletters) {
        // Atomic claim with initial 10-minute lease
        const claimed = await claimNewsletterWithLease(supabase, newsletter.id, workerId, 600);
        if (!claimed) {
            console.log(`[NEWSLETTER] Newsletter ${newsletter.id} ya fue reclamada por otro proceso activo. Omitiendo.`);
            continue;
        }

        console.log(`[NEWSLETTER] Worker ${workerId} procesando newsletter reclamada: "${newsletter.title}" (ID: ${newsletter.id})`);

        const previousLogs: Array<{ email: string; status: 'delivered' | 'failed'; timestamp: string; error?: string }> = 
            Array.isArray(newsletter.delivery_logs) ? newsletter.delivery_logs : [];
        
        const alreadyDelivered = new Set(
            previousLogs.filter(l => l.status === 'delivered').map(l => l.email.toLowerCase())
        );

        const recipientsToProcess = subscribers.filter(s => !alreadyDelivered.has(s.email.toLowerCase()));

        let deliveredCount = alreadyDelivered.size;
        let newlyDeliveredCount = 0;
        let failedCount = 0;
        const currentDeliveryLogs = [...previousLogs.filter(l => l.status === 'delivered')];

        const BATCH_SIZE = 2;
        const totalToProcess = recipientsToProcess.length;

        for (let i = 0; i < totalToProcess; i += BATCH_SIZE) {
            // Heartbeat + Renewal: Actively renew the lease for 10 more minutes
            const renewed = await renewWorkerLease(supabase, newsletter.id, workerId, 600);
            if (!renewed) {
                console.error(`[NEWSLETTER] Worker ${workerId} no pudo renovar el lease (expiró o fue reclamado). Abortando para evitar duplicados.`);
                break;
            }

            const chunk = recipientsToProcess.slice(i, i + BATCH_SIZE);

            await Promise.all(chunk.map(async (sub: { email: string; locale?: string }) => {
                const subscriberEmail = sub.email;
                const locale = sub.locale || 'es';
                const unsubscribeUrl = `${BASE_URL}/${locale}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

                const htmlBody = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                        <div style="text-align: center; margin-bottom: 24px; padding: 24px 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px 8px 0 0; border-bottom: 3px solid #38bdf8;">
                            <h2 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-size: 20px;">GETXO BELA ESKOLA</h2>
                            <p style="color: #38bdf8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase;">Boletín Informativo</p>
                        </div>
                        <h2 style="color: #0f172a; text-align: left; font-size: 22px; margin-bottom: 16px;">${newsletter.title}</h2>
                        <div style="font-size: 15px; line-height: 1.7; color: #475569; white-space: pre-wrap; margin-bottom: 32px;">
                            ${newsletter.content}
                        </div>
                        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
                            <p style="margin: 4px 0;"><strong>Getxo Bela Eskola</strong> - Puerto Deportivo El Abra-Getxo, Local 2, 48992 Getxo, Bizkaia</p>
                            <p style="margin: 12px 0 0 0;">
                                <a href="${unsubscribeUrl}" style="color: #ef4444; text-decoration: underline; font-weight: bold;">Darse de baja de esta lista</a>
                            </p>
                        </div>
                    </div>
                `;

                // Resend Official Idempotency Key (under 256 characters)
                const officialIdempotencyKey = `nl_${newsletter.id}_${Buffer.from(subscriberEmail).toString('base64').replace(/=/g, '')}`;

                try {
                    const response = await resend!.emails.send({
                        from: DEFAULT_FROM_EMAIL,
                        to: [subscriberEmail],
                        subject: newsletter.title,
                        html: htmlBody,
                        headers: {
                            'List-Unsubscribe': `<${unsubscribeUrl}>`,
                            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                            'X-Entity-Ref-ID': officialIdempotencyKey
                        }
                    }, {
                        idempotencyKey: officialIdempotencyKey
                    });

                    if (response.error) {
                        // HTTP 409 or conflict error handling: if response contains already processed idempotent email
                        if (response.error.name === 'invalid_idempotent_request' || (response.error as any).statusCode === 409) {
                            console.warn(`[NEWSLETTER] Recipient ${subscriberEmail} already delivered via idempotent request.`);
                            deliveredCount++;
                            newlyDeliveredCount++;
                            currentDeliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                        } else {
                            console.error(`[NEWSLETTER] Error enviando a ${subscriberEmail}:`, response.error);
                            failedCount++;
                            currentDeliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: response.error.message });
                        }
                    } else {
                        deliveredCount++;
                        newlyDeliveredCount++;
                        currentDeliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                    }
                } catch (err: any) {
                    if (err?.statusCode === 409 || err?.message?.includes('idempotent')) {
                        console.warn(`[NEWSLETTER] Caught 409 conflict: ${subscriberEmail} was already sent.`);
                        deliveredCount++;
                        newlyDeliveredCount++;
                        currentDeliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                    } else {
                        console.error(`[NEWSLETTER] Excepción enviando a ${subscriberEmail}:`, err);
                        failedCount++;
                        currentDeliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: err?.message || 'Error de red' });
                    }
                }
            }));

            if (i + BATCH_SIZE < totalToProcess) {
                await sleep(1000);
            }
        }

        // Final lease validation before committing final campaign status
        const leaseStillHeld = await verifyWorkerLease(supabase, newsletter.id, workerId);
        if (!leaseStillHeld) {
            console.warn(`[NEWSLETTER] Worker ${workerId} omitió actualización final de ${newsletter.id} porque perdió la titularidad del lease.`);
            continue;
        }

        const isComplete = (deliveredCount === subscribers.length);
        const finalStatus = isComplete ? 'sent' : 'scheduled';

        const updatePayload: any = {
            status: finalStatus,
            locked_by: null,
            lease_expires_at: null,
            recipients_count: subscribers.length,
            delivered_count: deliveredCount,
            failed_count: failedCount,
            delivery_logs: currentDeliveryLogs,
            updated_at: new Date().toISOString()
        };

        if (isComplete) {
            updatePayload.sent_at = new Date().toISOString();
        }

        await (supabase as any)
            .from('newsletters')
            .update(updatePayload)
            .eq('id', newsletter.id)
            .eq('locked_by', workerId);

        totalSentCount += newlyDeliveredCount;
        totalFailedCount += failedCount;

        processResults.push({
            newsletterId: newsletter.id,
            title: newsletter.title,
            totalSubscribers: subscribers.length,
            delivered: deliveredCount,
            failed: failedCount,
            status: finalStatus
        });
    }

    return {
        success: totalFailedCount === 0,
        processed: pendingNewsletters.length,
        totalSent: totalSentCount,
        totalFailed: totalFailedCount,
        results: processResults
    };
}