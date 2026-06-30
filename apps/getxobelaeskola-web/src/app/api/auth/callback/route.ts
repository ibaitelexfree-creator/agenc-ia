import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function getPublicOrigin(request: Request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const originHeader = request.headers.get('origin');
    
    if (originHeader && !originHeader.includes('localhost') && !originHeader.includes('127.0.0.1')) {
        return originHeader;
    }
    
    let resolvedHost = forwardedHost || host || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 
                     (resolvedHost.includes('localhost') || resolvedHost.includes('127.0.0.1') ? 'http' : 'https');
                     
    if (process.env.NODE_ENV === 'production' && (resolvedHost.includes('localhost') || resolvedHost.includes('127.0.0.1'))) {
        return 'https://getxobelaeskola.cloud';
    }
    
    return `${protocol}://${resolvedHost}`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // Read redirect cookie if present to bypass stripped URL parameters issues
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMatch = cookieHeader.split(';').find(c => c.trim().startsWith('sb-redirect-to='));
    const nextCookie = cookieMatch ? decodeURIComponent(cookieMatch.split('=')[1].trim()) : null;
    
    const next = nextCookie || searchParams.get('next') || '/';
    const origin = getPublicOrigin(request);

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Determine if we should redirect to a specific locale
            // For now, redirect to the 'next' path which could include the locale
            const response = NextResponse.redirect(`${origin}${next}`);
            response.cookies.set('sb-redirect-to', '', { path: '/', maxAge: 0 });
            return response;
        }
    }

    // return the user to an error page with instructions
    // or just back to login with an error, trying to preserve locale
    const localeMatch = next.match(/^\/([a-z]{2})\//);
    const errorLocale = localeMatch ? localeMatch[1] : 'es';
    const response = NextResponse.redirect(`${origin}/${errorLocale}/auth/login?error=auth_callback_error`);
    response.cookies.set('sb-redirect-to', '', { path: '/', maxAge: 0 });
    return response;
}
