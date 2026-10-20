'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Sliders, X, Check } from 'lucide-react';
import { useCookieConsent } from './CookieConsentContext';

interface CookieSettingsModalProps {
    locale: string;
}

export function CookieSettingsModal({ locale }: CookieSettingsModalProps) {
    const t = useTranslations('cookies_banner');
    const { isModalOpen, closeModal, preferences, savePreferences, acceptAll, rejectAll } = useCookieConsent();

    const [analytics, setAnalytics] = useState(preferences.analytics);
    const [performance, setPerformance] = useState(preferences.performance);

    // Sincronizar estado local al abrir
    React.useEffect(() => {
        if (isModalOpen) {
            setAnalytics(preferences.analytics);
            setPerformance(preferences.performance);
        }
    }, [isModalOpen, preferences]);

    if (!isModalOpen) return null;

    const handleSave = () => {
        savePreferences({ analytics, performance });
    };

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
        >
            <div className="bg-[#0b1b2d] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white relative max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <Sliders className="w-6 h-6 text-accent" />
                        <h2 id="cookie-modal-title" className="text-xl sm:text-2xl font-bold tracking-wide">
                            {t('modal_title')}
                        </h2>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-white/60 hover:text-white p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-label={t('close')}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto pr-2 space-y-4 text-sm text-foreground/80 flex-1">
                    <p className="text-white/70 leading-relaxed">
                        {t('modal_description')}
                    </p>

                    {/* Categoría: Técnicas y Necesarias */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <span className="font-semibold text-white">{t('category_essential_title')}</span>
                            </div>
                            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                                {t('always_active')}
                            </span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            {t('category_essential_desc')}
                        </p>
                    </div>

                    {/* Categoría: Analítica */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white">{t('category_analytics_title')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={analytics}
                                    onChange={(e) => setAnalytics(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            {t('category_analytics_desc')}
                        </p>
                    </div>

                    {/* Categoría: Rendimiento (Speed Insights) */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white">{t('category_performance_title')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={performance}
                                    onChange={(e) => setPerformance(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            {t('category_performance_desc')}
                        </p>
                    </div>

                    <div className="pt-2 text-xs text-white/50">
                        <Link
                            href={`/${locale}/cookies`}
                            onClick={closeModal}
                            className="underline hover:text-accent transition-colors"
                        >
                            {t('read_full_policy')}
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                    <button
                        type="button"
                        onClick={rejectAll}
                        className="px-4 py-2.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider"
                    >
                        {t('reject_all')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2.5 rounded-lg border border-accent/40 bg-white/5 text-accent hover:bg-accent/10 transition-all text-xs font-semibold uppercase tracking-wider"
                    >
                        {t('save_preferences')}
                    </button>
                    <button
                        type="button"
                        onClick={acceptAll}
                        className="px-4 py-2.5 rounded-lg bg-accent text-[#001B3A] hover:bg-accent/90 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                    >
                        {t('accept_all')}
                    </button>
                </div>
            </div>
        </div>
    );
}
