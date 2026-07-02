'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function RegisterSuccessPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = useTranslations('register_success');
    const searchParams = useSearchParams();
    const router = useRouter();

    const returnTo = searchParams.get('returnTo');

    return (
        <main className="min-h-[80vh] flex items-center justify-center p-4 bg-nautical-black text-white">
            <div className="bg-card border border-white/10 p-8 rounded-sm w-full max-w-md shadow-2xl text-center space-y-8 animate-fade-in">
                
                {/* Visual Icon indicator */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full border border-accent flex items-center justify-center text-accent text-3xl font-light">
                        ✓
                    </div>
                </div>

                <header className="space-y-2">
                    <h1 className="text-3xl font-display italic text-white">{t('title')}</h1>
                    <p className="text-sm text-white/60 leading-relaxed font-light">{t('message')}</p>
                </header>

                <div className="flex flex-col gap-4 pt-4">
                    {returnTo && (
                        <button
                            onClick={() => router.push(returnTo)}
                            className="w-full btn btn-accent py-3 font-semibold tracking-wider text-xs uppercase"
                        >
                            {t('btn_continue')}
                        </button>
                    )}

                    <button
                        onClick={() => router.push(`/${locale}/student/dashboard`)}
                        className="w-full btn border border-white/15 hover:border-accent py-3 font-semibold tracking-wider text-xs uppercase transition-colors"
                    >
                        {t('btn_dashboard')}
                    </button>

                    <button
                        onClick={() => router.push(`/${locale}`)}
                        className="w-full py-3 text-2xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        {t('btn_home')}
                    </button>
                </div>
            </div>
        </main>
    );
}
