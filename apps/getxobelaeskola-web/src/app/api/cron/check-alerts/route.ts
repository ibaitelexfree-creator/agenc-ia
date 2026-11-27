import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/cron/auth';
import { checkAndNotifyWeatherAlerts } from '@/lib/services/weather-alerts';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const auth = verifyCronAuth(request);
    if (!auth.authorized && auth.errorResponse) {
        return NextResponse.json({ error: auth.errorResponse.error }, { status: auth.errorResponse.status });
    }

    try {
        const result = await checkAndNotifyWeatherAlerts();
        const statusCode = result.success ? 200 : 502;
        return NextResponse.json(result, { status: statusCode });
    } catch (error: any) {
        console.error('Cron Check-Alerts Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
