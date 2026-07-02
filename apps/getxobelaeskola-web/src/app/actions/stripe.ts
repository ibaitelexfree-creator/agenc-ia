'use server';

import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { StripeHandlers } from '@/lib/stripe/webhook-handlers';

export async function verifyPaymentSync(sessionId: string) {
    if (!sessionId) return { success: false, error: 'No session ID provided' };

    try {
        if (!stripe) {
            return { success: false, error: 'Stripe configuration missing' };
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return { success: false, error: 'Payment not completed' };
        }

        const supabase = createAdminClient() as any;
        
        // Idempotency check: Does it already exist in the database?
        const { mode } = session.metadata || {};
        
        if (mode === 'course' || mode === 'edition') {
            const { data } = await supabase.from('inscripciones').select('id').eq('stripe_session_id', sessionId).maybeSingle();
            if (data) return { success: true }; // Already processed by webhook
        } else if (mode === 'rental_test' || mode === 'rental') {
            const { data } = await supabase.from('reservas_alquiler').select('id').eq('stripe_session_id', sessionId).maybeSingle();
            if (data) return { success: true }; // Already processed by webhook
        } else if (mode === 'subscription') {
            const { data } = await supabase.from('subscriptions').select('id').eq('stripe_session_id', sessionId).maybeSingle();
            if (data) return { success: true }; // Already processed by webhook
        }

        // Process it synchronously using the same handlers as the webhook!
        const handlers = new StripeHandlers(supabase);
        await handlers.handleCheckoutCompleted(session);

        return { success: true };
    } catch (e: any) {
        console.error('Error in sync verification:', e);
        return { success: false, error: e.message };
    }
}
