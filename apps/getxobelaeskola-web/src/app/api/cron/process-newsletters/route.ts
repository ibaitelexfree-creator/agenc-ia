import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processScheduledNewsletters } from '@/lib/services/newsletter';

export const dynamic = 'force-dynamic';

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
