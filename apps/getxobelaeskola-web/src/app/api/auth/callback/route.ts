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
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';

    const origin = getPublicOrigin(request);

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
