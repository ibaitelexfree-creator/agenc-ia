import { NextRequest } from 'next/server';

export interface CronAuthResult {
    authorized: boolean;
    errorResponse?: { error: string; status: number };
}

/**
 * Validates that the request contains a valid 'Authorization: Bearer <CRON_SECRET>' header.
 * Rejects query strings or unauthenticated calls.
 */
export function verifyCronAuth(request: Request | NextRequest): CronAuthResult {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || cronSecret.trim().length === 0) {
        console.error('[CRON_AUTH] CRON_SECRET is not configured on the server.');
        return {
            authorized: false,
            errorResponse: { error: 'Server misconfiguration: CRON_SECRET missing', status: 500 }
        };
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return {
            authorized: false,
            errorResponse: { error: 'Missing Authorization header', status: 401 }
        };
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token || token !== cronSecret) {
        return {
            authorized: false,
            errorResponse: { error: 'Invalid Authorization token', status: 401 }
        };
    }

    return { authorized: true };
}
