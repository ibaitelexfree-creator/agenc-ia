import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
        }

        const supabase = createClient();

        // Delete subscription from newsletter_subscriptions
        const { error } = await supabase
            .from('newsletter_subscriptions')
            .delete()
            .eq('email', email);

        if (error) {
            console.error('Error unsubscribing email:', error);
            return NextResponse.redirect(new URL('/es/unsubscribe?status=error', request.url));
        }

        return NextResponse.redirect(new URL(`/es/unsubscribe?status=success&email=${encodeURIComponent(email)}`, request.url));
    } catch (err) {
        console.error('Unsubscribe error:', err);
        return NextResponse.redirect(new URL('/es/unsubscribe?status=error', request.url));
    }
}
