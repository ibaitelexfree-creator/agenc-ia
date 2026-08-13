import { requireInstructor } from '@/lib/auth-guard';
import { NextResponse } from 'next/server';
import { processScheduledNewsletters } from '@/app/api/cron/process-newsletters/route';

export async function POST(request: Request) {
    try {
        const { profile, supabaseAdmin, error: authError } = await requireInstructor();
        if (authError) return authError;

        const body = await request.json();
        const { title, content, scheduled_for, status } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Título y contenido son obligatorios' }, { status: 400 });
        }

        const isScheduled = !!scheduled_for && new Date(scheduled_for).getTime() > Date.now();

        const { data, error } = await supabaseAdmin
            .from('newsletters')
            .insert({
                title,
                content,
                scheduled_for: scheduled_for || null,
                status: isScheduled ? 'scheduled' : 'scheduled', // insert as scheduled so processScheduledNewsletters handles sending & logging
                created_by: profile?.id
            })
            .select()
            .single();

        if (error) throw error;

        // If not scheduled for future, process and send immediately right now!
        if (!isScheduled) {
            await processScheduledNewsletters();
        }

        return NextResponse.json({ success: true, newsletter: data });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
