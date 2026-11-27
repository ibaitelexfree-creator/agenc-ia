import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/cron/auth';
import { triggerWeeklyChallenge } from '@/lib/services/weekly-challenge';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const auth = verifyCronAuth(request);
    if (!auth.authorized && auth.errorResponse) {
        return NextResponse.json({ error: auth.errorResponse.error }, { status: auth.errorResponse.status });
    }

    try {
        const result = await triggerWeeklyChallenge();
        const statusCode = result.success ? 200 : (result.not_configured ? 200 : 500);
        return NextResponse.json(result, { status: statusCode });
    } catch (error: any) {
        console.error('Weekly challenge cron error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
