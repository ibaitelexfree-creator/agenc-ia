import { createAdminClient } from '@/lib/supabase/admin';
import { fetchEuskalmetAlerts } from '@/lib/euskalmet';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import crypto from 'crypto';

export interface WeatherAlertCheckResult {
    success: boolean;
    alerts_found: number;
    new_alerts: number;
    email_sent: boolean;
    deduplication_active: boolean;
    reason?: string;
    error?: string;
}

/**
 * Computes a deterministic MD5 hash for a given alert based on its characteristics.
 */
export function computeAlertHash(alert: any): string {
    const phenomenon = alert.phenomenon || '';
    const level = alert.level || '';
    const start = alert.start || '';
    const end = alert.end || '';
    const raw = `${phenomenon}_${level}_${start}_${end}`;
    return crypto.createHash('md5').update(raw).digest('hex');
}

/**
 * Checks for active weather alerts from Euskalmet, applies persistent deduplication,
 * and notifies admins via Resend if new severe alerts are present.
 */
export async function checkAndNotifyWeatherAlerts(): Promise<WeatherAlertCheckResult> {
    const alerts = await fetchEuskalmetAlerts();
    if (!alerts || alerts.length === 0) {
        return {
            success: true,
            alerts_found: 0,
            new_alerts: 0,
            email_sent: false,
            deduplication_active: true,
            reason: 'No alerts returned by provider'
        };
    }

    const activeAlerts = alerts.filter((a: any) => a.level !== 'verde' && a.level !== 'green');
    if (activeAlerts.length === 0) {
        return {
            success: true,
            alerts_found: alerts.length,
            new_alerts: 0,
            email_sent: false,
            deduplication_active: true,
            reason: 'No severe alerts'
        };
    }

    const supabase = createAdminClient();

    let deduplicationEnabled = true;
    const alreadyProcessedHashes: Set<string> = new Set();
    const candidateHashes = activeAlerts.map(a => computeAlertHash(a));

    const { data: existingRows, error: checkError } = await (supabase as any)
        .from('processed_weather_alerts')
        .select('alert_hash, status, expires_at')
        .in('alert_hash', candidateHashes);

    if (checkError) {
        console.warn('[WEATHER_ALERTS] processed_weather_alerts table not found in database. WARNING: Persistent deduplication disabled.');
        deduplicationEnabled = false;
    } else if (existingRows) {
        const now = new Date().getTime();
        for (const row of existingRows) {
            // Deduplicate ONLY IF status === 'sent' AND not yet expired
            if (row.status === 'sent' && row.expires_at) {
                const expiryTime = new Date(row.expires_at).getTime();
                if (expiryTime > now) {
                    alreadyProcessedHashes.add(row.alert_hash);
                }
            }
        }
    }

    const unnotifiedAlerts = activeAlerts.filter(a => !alreadyProcessedHashes.has(computeAlertHash(a)));

    if (unnotifiedAlerts.length === 0) {
        return {
            success: true,
            alerts_found: activeAlerts.length,
            new_alerts: 0,
            email_sent: false,
            deduplication_active: deduplicationEnabled,
            reason: 'All active alerts were already notified.'
        };
    }

    if (!resend) {
        console.error('[WEATHER_ALERTS] Resend client not configured. Cannot send email alert.');
        return {
            success: false,
            alerts_found: activeAlerts.length,
            new_alerts: unnotifiedAlerts.length,
            email_sent: false,
            deduplication_active: deduplicationEnabled,
            reason: 'Resend API key missing or invalid'
        };
    }

    const emailContent = unnotifiedAlerts.map((a: any) => `
        <h3>ALERTA: ${a.phenomenon || 'Meteorológica'}</h3>
        <p><strong>Nivel:</strong> ${a.level || 'Aviso'}</p>
        <p><strong>Comienzo:</strong> ${a.start || '---'}</p>
        <p><strong>Fin:</strong> ${a.end || '---'}</p>
        <p>${a.description || ''}</p>
    `).join('<hr/>');

    // Aggregate alert hash for batch idempotency key
    const aggregateHash = crypto.createHash('md5')
        .update(unnotifiedAlerts.map(a => computeAlertHash(a)).sort().join('_'))
        .digest('hex');
    const alertIdempotencyKey = `weather_alert_${new Date().toISOString().slice(0, 10)}_${aggregateHash}`;

    try {
        const emailResponse = await resend.emails.send({
            from: DEFAULT_FROM_EMAIL,
            to: ['info@getxobelaeskola.com'],
            subject: `⚠️ ADVERTENCIA METEOROLÓGICA: ${unnotifiedAlerts.length} Nuevas Alertas Activas`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d32f2f;">Avisos Meteorológicos Euskalmet - Getxo</h2>
                    <p>Se han detectado nuevos avisos activos para la zona de Costa Bizkaia:</p>
                    ${emailContent}
                    <br/>
                    <p style="font-size: 10px; color: #999;">Aviso automático de seguridad de Getxo Bela Eskola.</p>
                </div>
            `,
            headers: {
                'X-Entity-Ref-ID': alertIdempotencyKey
            }
        }, {
            idempotencyKey: alertIdempotencyKey
        });

        if (emailResponse.error) {
            console.error('[WEATHER_ALERTS] Resend provider returned error:', emailResponse.error);

            if (deduplicationEnabled) {
                const failRecords = unnotifiedAlerts.map(a => ({
                    alert_hash: computeAlertHash(a),
                    severity: a.level || 'warning',
                    description: (a.description || a.phenomenon || '').substring(0, 500),
                    status: 'failed',
                    expires_at: a.end ? new Date(a.end).toISOString() : new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
                    sent_at: null
                }));
                await (supabase as any)
                    .from('processed_weather_alerts')
                    .upsert(failRecords, { onConflict: 'alert_hash' });
            }

            return {
                success: false,
                alerts_found: activeAlerts.length,
                new_alerts: unnotifiedAlerts.length,
                email_sent: false,
                deduplication_active: deduplicationEnabled,
                error: emailResponse.error.message
            };
        }

        if (deduplicationEnabled) {
            const recordsToInsert = unnotifiedAlerts.map(a => {
                const expDate = a.end ? new Date(a.end) : new Date(Date.now() + 24 * 3600 * 1000);
                return {
                    alert_hash: computeAlertHash(a),
                    severity: a.level || 'warning',
                    description: (a.description || a.phenomenon || '').substring(0, 500),
                    status: 'sent',
                    expires_at: expDate.toISOString(),
                    sent_at: new Date().toISOString()
                };
            });

            await (supabase as any)
                .from('processed_weather_alerts')
                .upsert(recordsToInsert, { onConflict: 'alert_hash' });
        }

        return {
            success: true,
            alerts_found: activeAlerts.length,
            new_alerts: unnotifiedAlerts.length,
            email_sent: true,
            deduplication_active: deduplicationEnabled
        };
    } catch (sendError: any) {
        console.error('[WEATHER_ALERTS] Unexpected exception sending alert email:', sendError);
        return {
            success: false,
            alerts_found: activeAlerts.length,
            new_alerts: unnotifiedAlerts.length,
            email_sent: false,
            deduplication_active: deduplicationEnabled,
            error: sendError.message || 'Network error'
        };
    }
}