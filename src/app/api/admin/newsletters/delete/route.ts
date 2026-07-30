import { requireInstructor } from '@/lib/auth-guard';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { supabaseAdmin, error: authError } = await requireInstructor();
        if (authError) return authError;

        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID de mensaje no proporcionado' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('newsletters')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
