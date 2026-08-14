import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processScheduledNewsletters() {
    const supabase = createAdminClient();
    const nowIso = new Date().toISOString();

    // 1. Fetch all newsletters with status 'scheduled' and scheduled_for <= now (or scheduled without date)
    const { data: pendingNewsletters, error: fetchError } = await (supabase as any)
        .from('newsletters')
        .select('*')
        .eq('status', 'scheduled')
        .or(`scheduled_for.lte.${nowIso},scheduled_for.is.null`);

    if (fetchError || !pendingNewsletters || pendingNewsletters.length === 0) {
        return { success: true, processed: 0, message: 'No hay boletines pendientes de envío.' };
    }

    // 2. Fetch active subscribers from newsletter_subscriptions ONLY (explicit consent)
    const { data: subscribers, error: subError } = await (supabase as any)
        .from('newsletter_subscriptions')
        .select('email, locale');

    if (subError || !subscribers || subscribers.length === 0) {
        console.log('No active newsletter subscribers found.');
        return { success: true, processed: pendingNewsletters.length, totalSent: 0, message: 'No hay suscriptores en la lista.' };
    }

    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://getxobelaeskola.cloud';
    let totalSentCount = 0;
    let totalFailedCount = 0;
    const processResults: any[] = [];

    for (const newsletter of pendingNewsletters) {
        console.log(`Procesando newsletter: "${newsletter.title}" (ID: ${newsletter.id})`);

        let deliveredCount = 0;
        let failedCount = 0;
        const deliveryLogs: Array<{ email: string; status: 'delivered' | 'failed'; timestamp: string; error?: string }> = [];

        // Batch processing: 2 emails per second max to respect Resend rate limit
        const BATCH_SIZE = 2;
        const totalSubscribers = subscribers.length;

        for (let i = 0; i < totalSubscribers; i += BATCH_SIZE) {
            const chunk = subscribers.slice(i, i + BATCH_SIZE);

            await Promise.all(chunk.map(async (sub: { email: string; locale?: string }) => {
                const subscriberEmail = sub.email;
                const locale = sub.locale || 'es';
                const unsubscribeUrl = `${BASE_URL}/${locale}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

                const htmlBody = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                        <div style="text-align: center; margin-bottom: 24px; padding: 24px 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px 8px 0 0; border-bottom: 3px solid #38bdf8;">
                            <h2 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-size: 20px;">GETXO BELA ESKOLA</h2>
                            <p style="color: #38bdf8; margin: 4px 0 0 0; font-size: 11px; tracking: 1px; text-transform: uppercase;">Boletín Informativo</p>
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

                if (!resend) {
                    console.log(`[SIMULACIÓN] Enviado a ${subscriberEmail}`);
                    deliveredCount++;
                    deliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                    return;
                }

                try {
                    const response = await resend.emails.send({
                        from: DEFAULT_FROM_EMAIL,
                        to: [subscriberEmail],
                        subject: newsletter.title,
                        html: htmlBody,
                        headers: {
                            'List-Unsubscribe': `<${unsubscribeUrl}>`,
                            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
                        }
                    });

                    if (response.error) {
                        console.error(`Error enviando a ${subscriberEmail}:`, response.error);
                        failedCount++;
                        deliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: response.error.message });
                    } else {
                        deliveredCount++;
                        deliveryLogs.push({ email: subscriberEmail, status: 'delivered', timestamp: new Date().toISOString() });
                    }
                } catch (err: any) {
                    console.error(`Excepción enviando a ${subscriberEmail}:`, err);
                    failedCount++;
                    deliveryLogs.push({ email: subscriberEmail, status: 'failed', timestamp: new Date().toISOString(), error: err?.message || 'Error de red' });
                }
            }));

            // Pause 1 second between 2-email batches to guarantee rate limit compliance
            if (i + BATCH_SIZE < totalSubscribers) {
                await sleep(1000);
            }
        }

        // Update Newsletter status in DB
        const updatePayload = {
            status: 'sent',
            sent_at: new Date().toISOString()
        };

        await (supabase as any)
            .from('newsletters')
            .update(updatePayload)
            .eq('id', newsletter.id);

        totalSentCount += deliveredCount;
        totalFailedCount += failedCount;

        processResults.push({
            newsletterId: newsletter.id,
            title: newsletter.title,
            recipients: totalSubscribers,
            delivered: deliveredCount,
            failed: failedCount,
            lastError: deliveryLogs.find(l => l.status === 'failed')?.error || null
        });
    }

    return {
        success: true,
        processed: pendingNewsletters.length,
        totalSent: totalSentCount,
        totalFailed: totalFailedCount,
        results: processResults
    };
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
        
        const url = new URL(request.url);
        const secretParam = url.searchParams.get('key');
        const isKeyAuthorized = cronSecret && secretParam === cronSecret;

        let isAdmin = false;

        if (!isCron && !isKeyAuthorized) {
            try {
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('rol')
                        .eq('id', user.id)
                        .single();
                    isAdmin = profile?.rol === 'admin' || profile?.rol === 'instructor';
                }
            } catch (e) {
                console.log('No session in auth check');
            }
        }

        if (cronSecret) {
            if (!isCron && !isKeyAuthorized && !isAdmin) {
                return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
            }
        }

        const result = await processScheduledNewsletters();

        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Process Newsletters Cron Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    return POST(request);
}
