import { createAdminClient } from '@/lib/supabase/admin';

export interface WeeklyChallengeResult {
    success: boolean;
    not_configured?: boolean;
    data?: any;
    message?: string;
    error?: string;
}

/**
 * Triggers weekly challenge generation idempotently.
 * Checks if the RPC function exists on the remote database.
 * If the table/function is not yet deployed, returns a safe unconfigured status without throwing.
 */
export async function triggerWeeklyChallenge(): Promise<WeeklyChallengeResult> {
    const supabase = createAdminClient();

    // First attempt to call get_or_create_weekly_challenge
    const { data, error } = await (supabase as any).rpc('get_or_create_weekly_challenge');

    if (error) {
        // If PostgreSQL error indicates function not found (PGRST202 or 42883)
        if (error.code === 'PGRST202' || error.message?.includes('not found') || error.message?.includes('does not exist')) {
            console.warn('[WEEKLY_CHALLENGE] RPC function get_or_create_weekly_challenge is not present in Supabase. Skipping safely.');
            return {
                success: true,
                not_configured: true,
                message: 'Weekly challenge migration pending in Supabase. Skipped safely.'
            };
        }

        console.error('[WEEKLY_CHALLENGE] RPC Execution failed:', error);
        return {
            success: false,
            error: error.message
        };
    }

    return {
        success: true,
        data,
        message: 'Weekly challenge retrieved or created successfully'
    };
}
