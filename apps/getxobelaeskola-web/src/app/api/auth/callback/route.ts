import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';

    // Construct the public origin using headers to correctly support reverse proxies (e.g. Nginx, Vercel)
    const host = request.headers.get('host') || new URL(request.url).host;
    const protocol = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http');
    const origin = `${protocol}://${host}`;

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Determine if we should redirect to a specific locale
            // For now, redirect to the 'next' path which could include the locale
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    // or just back to login with an error, trying to preserve locale
    const localeMatch = next.match(/^\/([a-z]{2})\//);
    const errorLocale = localeMatch ? localeMatch[1] : 'es';
    return NextResponse.redirect(`${origin}/${errorLocale}/auth/login?error=auth_callback_error`);
}
