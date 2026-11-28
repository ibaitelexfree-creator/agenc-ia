/**
 * Origin Resolution Utility for Auth Callbacks
 *
 * Enforces canonical origin in production to prevent Host Header Injection
 * and origin spoofing attacks.
 */

export const CANONICAL_PROD_ORIGIN = 'https://getxobelaeskola.com';

export function getPublicOrigin(request: Request): string {
    // 1. Production Mode: Strict enforcement of canonical origin
    if (process.env.NODE_ENV === 'production') {
        return CANONICAL_PROD_ORIGIN;
    }

    // 2. Development / Local Testing: Strict whitelist (localhost:3000, 127.0.0.1:3000)
    const host = request.headers.get('host');
    if (host && (host === 'localhost:3000' || host === '127.0.0.1:3000')) {
        const proto = request.headers.get('x-forwarded-proto');
        const protocol = (proto === 'https' || proto === 'http') ? proto : 'http';
        return `${protocol}://${host}`;
    }

    // Fallback for any other environment
    return CANONICAL_PROD_ORIGIN;
}
