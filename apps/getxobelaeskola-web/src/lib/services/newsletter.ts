import { createAdminClient } from '@/lib/supabase/admin';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';

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
 * Recovers newsletters stuck in 'processing' state for longer than timeoutMinutes (default 15m).
 * Reverts them to 'scheduled' so they can be picked up and resumed.
 */
export async function recoverStuckNewsletters(supabase: any, timeoutMinutes: number = 15): Promise<number> {
    const thresholdIso = new Date(Date.now() - timeoutMinutes * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from('newsletters')
        .update({
            status: 'scheduled',
            updated_at: new Date().toISOString()
        })
        .eq('status', 'processing')
        .lte('updated_at', thresholdIso)
        .select('id');

    if (error || !data) {
        return 0;
    }
    return data.length;
}

/**
 * Claims a scheduled newsletter atomically to prevent race conditions across multiple workers.
 * Transitions status from 'scheduled' -> 'processing'.
 */
export async function claimNewsletter(supabase: any, newsletterId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('newsletters')
        .update({
            status: 'processing',
            updated_at: new Date().toISOString()
        })
        .eq('id', newsletterId)
        .eq('status', 'scheduled')
        .select('id');

    if (error || !data || data.length === 0) {
        return false;
    }
    return true;
}

/**
 * Robust, atomic processor for scheduled newsletters.
 * Handles rate limits, per-recipient tracking, provider validation and retry states.
 */
export async function processScheduledNewsletters(): Promise<NewsletterProcessResult> {
    const supabase = createAdminClient();

    // 0. Recover any orphaned/crashed jobs stuck in 'processing'
    await recoverStuckNewsletters(supabase, 15);

    const nowIso = new Date().toISOString();

    // 1. Fetch candidates with status 'scheduled'
    const { data: pendingNewsletters, error: fetchError } = await (supabase as any)
        .from('newsletters')
        .select('*')
        .eq('status', 'scheduled')
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
        // Atomic claim: if another worker claimed it, skip immediately
        const claimed = await claimNewsletter(supabase, newsletter.id);
        if (!claimed) {
            console.log(`[NEWSLETTER] Newsletter ${newsletter.id} ya fue reclamada por otro proceso. Omitiendo.`);
            continue;
        }

        console.log(`[NEWSLETTER] Procesando newsletter reclamada: "${newsletter.title}" (ID: ${newsletter.id})`);

        // Check if existing delivery logs exist from a previous partial attempt
        const previousLogs: Array<{ email: string; status: 'delivered' | 'failed'; timestamp: string; error?: string }> = 
            Array.isArray(newsletter.delivery_logs) ? newsletter.delivery_logs : [];
        
        // Find emails already delivered
        const alreadyDelivered = new Set(
            previousLogs.filter(l => l.status === 'delivered').map(l => l.email.toLowerCase())
        );

        // Filter only recipients that still need delivery
        const recipientsToProcess = subscribers.filter(s => !alreadyDelivered.has(s.email.toLowerCase()));

        let deliveredCount = alreadyDelivered.size;
        let newlyDeliveredCount = 0;
        let failedCount = 0;
        const currentDeliveryLogs = [...previousLogs.filter(l => l.status === 'delivered')];

        const BATCH_SIZE = 2;
        const totalToProcess = recipientsToProcess.length;

        for (let i = 0; i < totalToProcess; i += BATCH_SIZE) {
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

                // Resend Idempotency Key header: identifies this specific campaign & recipient delivery attempt
                const idempotencyKey = `nl_${newsletter.id}_${Buffer.from(subscriberEmail).toString('base64').replace(/=/g, '')}`;

                try {
                    const response = await resend!.emails.send({
                        from: DEFAULT_FROM_EMAIL,
                        to: [subscriberEmail],
                        subject: newsletter.title,
                        html: htmlBody,
                        headers: {
                            'List-Unsubscribe': `<${unsubscribeUrl}>`,
                            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                            'X-Entity-Ref-ID': idempotencyKey
                        }
                    });

                    if (response.error) {
                        console.error(`[NEWSLETTER] Error enviando a ${subscriberEmail}:`, response.error);
                        failedCount++;
                        currentDeliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: response.error.message });
                    } else {
                        deliveredCount++;
                        newlyDeliveredCount++;
                        currentDeliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                    }
                } catch (err: any) {
                    console.error(`[NEWSLETTER] Excepción enviando a ${subscriberEmail}:`, err);
                    failedCount++;
                    currentDeliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: err?.message || 'Error de red' });
                }
            }));

            if (i + BATCH_SIZE < totalToProcess) {
                await sleep(1000);
            }
        }

        const isComplete = (deliveredCount === subscribers.length);
        const finalStatus = isComplete ? 'sent' : 'scheduled';

        const updatePayload: any = {
            status: finalStatus,
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
            .eq('id', newsletter.id);

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