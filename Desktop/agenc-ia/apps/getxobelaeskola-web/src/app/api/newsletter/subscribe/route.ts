// API Endpoint: Newsletter Subscription & Automatic Welcome Email Dispatch via Resend (Live Deployment Build Test)
import { NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, locale = 'es' } = body;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido o no proporcionado' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Guardar o actualizar registro en Supabase (newsletter_subscriptions)
        const supabase = createAdminClient();
        const { error: dbError } = await supabase
            .from('newsletter_subscriptions')
            .upsert(
                { email: normalizedEmail, updated_at: new Date().toISOString() },
                { onConflict: 'email' }
            );

        if (dbError) {
            console.error('Error insertando suscripción newsletter en Supabase:', dbError);
            // Continuar para intentar enviar el correo aunque la DB devuelva un aviso no crítico
        }

        // 2. Enviar correo de bienvenida vía Resend
        if (!resend) {
            console.log(`[SIMULACIÓN NEWSLETTER] Email de bienvenida a: ${normalizedEmail}`);
            return NextResponse.json({
                success: true,
                message: 'Suscripción registrada (Modo simulación de email: RESEND_API_KEY no detectada)',
                emailSent: false
            });
        }

        const subject = locale === 'eu'
            ? 'Zatoz gurekin nabigatzera! Ongi etorri Getxo Bela Eskolara ⛵'
            : '¡Bienvenido a Getxo Bela Eskola! ⛵ Tu suscripción está confirmada';

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="${locale}">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #0a2540 0%, #0052cc 100%); padding: 32px 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">GETXO BELA ESKOLA</h1>
                        <p style="color: #b3d4ff; margin: 6px 0 0 0; font-size: 14px;">Puerto Deportivo El Abra-Getxo</p>
                    </div>

                    <!-- Body -->
                    <div style="padding: 36px 28px; color: #334155;">
                        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">¡Gracias por unirte a nuestra comunidad náutica! 🌊</h2>
                        
                        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                            ${locale === 'eu' 
                                ? 'Mila esker Getxo Bela Eskolako buletinean izena emateagatik. Hemendik aurrera, gure ikastaro berrien, ekitaldien eta nabigazio aholkuen berri izango duzu lehenik.'
                                : 'Estamos encantados de tenerte a bordo. A partir de ahora recibirás antes que nadie nuestras novedades, aperturas de cursos de navegación, descuentos exclusivos y eventos en el mar.'
                            }
                        </p>

                        <div style="background-color: #f8fafc; border-left: 4px solid #0052cc; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
                            <p style="margin: 0; font-size: 14px; color: #1e293b; font-weight: 500;">
                                💡 <strong>${locale === 'eu' ? 'Aholkua' : '¿Listo para navegar?'}:</strong> ${locale === 'eu' ? 'Bisitatu gure webgunea ikastaro guztiak ikusteko.' : 'Consulta nuestra oferta de cursos y bautismos de vela directamente en la web.'}
                            </p>
                        </div>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="https://getxobelaeskola.cloud" 
                               style="background-color: #0052cc; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 6px rgba(0,82,204,0.3);">
                                ${locale === 'eu' ? 'Ikusi Ikastaroak' : 'Ver Cursos Disponible'}
                            </a>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

                        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-bottom: 0;">
                            Getxo Bela Eskola · Puerto Deportivo El Abra-Getxo, Local 2 · 48992 Getxo, Bizkaia<br>
                            Si no solicitaste esta suscripción, puedes ignorar este correo.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const { data: resendData, error: resendError } = await resend.emails.send({
            from: DEFAULT_FROM_EMAIL,
            to: [normalizedEmail],
            subject: subject,
            html: htmlContent,
        });

        if (resendError) {
            console.error('Error al enviar correo con Resend:', resendError);
            return NextResponse.json({
                success: true,
                emailSent: false,
                error: resendError.message,
                message: 'Suscripción guardada en base de datos, pero falló el envío de correo'
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            emailSent: true,
            emailId: resendData?.id,
            message: 'Suscripción completada y correo enviado con éxito'
        });

    } catch (err: any) {
        console.error('Excepción en /api/newsletter/subscribe:', err);
        return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
    }
}