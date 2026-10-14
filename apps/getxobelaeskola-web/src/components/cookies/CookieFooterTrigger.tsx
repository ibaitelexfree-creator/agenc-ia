'use client';

import React from 'react';
import { useCookieConsent } from './CookieConsentContext';
import { useTranslations } from 'next-intl';

interface CookieFooterTriggerProps {
    className?: string;
}

export function CookieFooterTrigger({ className = '' }: CookieFooterTriggerProps) {
    const t = useTranslations('cookies_banner');
    const { openModal } = useCookieConsent();

    return (
        <button
            type="button"
            onClick={openModal}
            className={`cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit uppercase ${className}`}
        >
            {t('footer_configure_link')}
        </button>
    );
}
