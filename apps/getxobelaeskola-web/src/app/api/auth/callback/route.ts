import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sanitizeReturnTo } from '../../../../lib/security/url-validator';
import { getPublicOrigin } from '../../../../lib/security/origin-resolver';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // Read redirect cookie using next/headers
    let nextCookie: string | null = null;
    try {
        const cookieStore = cookies();
        nextCookie = cookieStore.get('sb-redirect-to')?.value || null;
    } catch (e) {
        console.error('Failed to read cookies in auth callback:', e);
    }
    
    const origin = getPublicOrigin(request);
    const rawNext = nextCookie || searchParams.get('next');
    const sanitizedNext = sanitizeReturnTo(rawNext, origin);
    const safeNext = sanitizedNext || '/';

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Determine if we should redirect to a specific locale
            // For now, redirect to the safe sanitized 'next' path
            const response = NextResponse.redirect(`${origin}${safeNext}`);
            response.cookies.set('sb-redirect-to', '', { path: '/', maxAge: 0 });
            return response;
        }
    }

    // return the user to an error page with instructions
    // or just back to login with an error, trying to preserve locale
    const localeMatch = safeNext.match(/^\/([a-z]{2})\//);
    const errorLocale = localeMatch ? localeMatch[1] : 'es';
    const response = NextResponse.redirect(`${origin}/${errorLocale}/auth/login?error=auth_callback_error`);
    response.cookies.set('sb-redirect-to', '', { path: '/', maxAge: 0 });
    return response;
}
