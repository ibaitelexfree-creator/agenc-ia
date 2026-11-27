import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/cron/auth';
import { processScheduledNewsletters } from '@/lib/services/newsletter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const auth = verifyCronAuth(request);
    if (!auth.authorized && auth.errorResponse) {
        return NextResponse.json({ error: auth.errorResponse.error }, { status: auth.errorResponse.status });
    }

    try {
        const result = await processScheduledNewsletters();
        const statusCode = result.success ? 200 : (result.totalFailed > 0 && result.totalSent === 0 ? 502 : 200);

        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString()
        }, { status: statusCode });
    } catch (error: any) {
        console.error('Process Newsletters Cron Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, { status: 500 });
    }
}
