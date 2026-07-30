import { requireInstructor } from '@/lib/auth-guard';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { supabaseAdmin, error: authError } = await requireInstructor();
        if (authError) return authError;

        const body = await request.json();
        const { id, title, content, scheduled_for, status, send_now } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID de mensaje no proporcionado' }, { status: 400 });
        }

        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        
        if (send_now) {
            updateData.status = 'sent';
            updateData.scheduled_for = null;
            updateData.sent_at = new Date().toISOString();
        } else if (scheduled_for !== undefined) {
            updateData.scheduled_for = scheduled_for || null;
            if (status !== undefined) {
                updateData.status = status;
            } else {
                updateData.status = scheduled_for ? 'scheduled' : 'sent';
            }
            if (updateData.status === 'sent') {
                updateData.sent_at = new Date().toISOString();
            }
        } else if (status !== undefined) {
            updateData.status = status;
        }

        const { data, error } = await supabaseAdmin
            .from('newsletters')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, newsletter: data });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
