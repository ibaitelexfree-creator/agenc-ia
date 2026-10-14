'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useCookieConsent } from './CookieConsentContext';

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false });

/**
 * Gate de telemetría y analítica que respeta el consentimiento previo del usuario.
 * Solo monta <Analytics /> y <SpeedInsights /> si el usuario ha otorgado consentimiento explícito.
 */
export function AnalyticsConsentGate() {
    const { isLoaded, preferences } = useCookieConsent();

    // No montar nada si aún no se ha resuelto el estado de consentimiento
    if (!isLoaded) {
        return null;
    }

    return (
        <>
            {preferences.analytics && <Analytics />}
            {preferences.performance && <SpeedInsights />}
        </>
    );
}
