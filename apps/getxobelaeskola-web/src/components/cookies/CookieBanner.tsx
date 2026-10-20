'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Cookie, Settings } from 'lucide-react';
import { useCookieConsent } from './CookieConsentContext';
import { CookieSettingsModal } from './CookieSettingsModal';

interface CookieBannerProps {
    locale: string;
}

export function CookieBanner({ locale }: CookieBannerProps) {
    const t = useTranslations('cookies_banner');
    const { isLoaded, hasChosen, acceptAll, rejectAll, openModal } = useCookieConsent();

    // No renderizar hasta que sepamos el estado de localStorage, o si el usuario ya eligió
    if (!isLoaded || hasChosen) {
        return <CookieSettingsModal locale={locale} />;
    }

    return (
        <>
            <section
                aria-label={t('banner_aria_label')}
                role="region"
                className="fixed bottom-0 left-0 right-0 z-[99990] p-4 sm:p-6 bg-[#00172e]/95 backdrop-blur-md border-t border-white/10 shadow-2xl text-white transition-all duration-300"
            >
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-start gap-3 sm:gap-4 max-w-3xl">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-accent/10 border border-accent/20 shrink-0 text-accent">
                            <Cookie className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-xs sm:text-sm text-foreground/80 space-y-1">
                            <p className="font-semibold text-white tracking-wide">
                                {t('title')}
                            </p>
                            <p className="text-white/70 leading-relaxed font-light">
                                {t('description')}{' '}
                                <Link
                                    href={`/${locale}/cookies`}
                                    className="underline text-accent hover:text-white font-medium transition-colors"
                                >
                                    {t('more_info')}
                                </Link>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2.5 w-full lg:w-auto shrink-0">
                        <button
                            type="button"
                            onClick={openModal}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider"
                            aria-label={t('configure')}
                        >
                            <Settings className="w-3.5 h-3.5" />
                            <span>{t('configure')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={rejectAll}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-white/25 bg-white/5 text-white hover:bg-white/15 hover:border-white/40 transition-all text-xs font-semibold uppercase tracking-wider"
                            aria-label={t('reject_all')}
                        >
                            {t('reject_all')}
                        </button>

                        <button
                            type="button"
                            onClick={acceptAll}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-accent text-[#001B3A] hover:bg-accent/90 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                            aria-label={t('accept_all')}
                        >
                            {t('accept_all')}
                        </button>
                    </div>
                </div>
            </section>
            <CookieSettingsModal locale={locale} />
        </>
    );
}
