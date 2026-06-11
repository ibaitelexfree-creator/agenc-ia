'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiUrl } from '@/lib/api';


export default function Newsletter({ locale }: { locale: string }) {
    const t = useTranslations('newsletter');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const response = await fetch(apiUrl('/api/newsletter/subscribe'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, locale })
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setStatus('error');
        }
    };

    return (
        <section className="py-16 relative overflow-hidden bg-nautical-deep selection:bg-accent selection:text-nautical-black">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-brass-gold/5 blur-[70px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto glass-card p-6 md:p-10 text-center border-sea-foam/10 bg-sea-foam/[0.01] rounded-2xl overflow-hidden relative">
                    <header className="mb-8 relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-6 h-[1px] bg-accent/30" />
                            <span className="text-accent uppercase tracking-[0.4em] text-[9px] font-black">
                                Join the fleet
                            </span>
                            <div className="w-6 h-[1px] bg-accent/30" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-display text-sea-foam mb-4 tracking-tight">
                            {t('title')}
                        </h2>
                        <p className="text-sea-foam/60 font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed italic">
                            {t('subtitle')}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto relative z-10">
                        <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-sea-foam/[0.03] border border-sea-foam/10 rounded-xl focus-within:border-accent/40 transition-premium backdrop-blur-md">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('email_placeholder')}
                                required
                                aria-label={t('email_aria_label')}
                                className="flex-grow bg-transparent px-4 py-2 text-sea-foam text-sm placeholder:text-sea-foam/40 focus:outline-none font-sans"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-accent px-6 py-2.5 text-nautical-black text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-premium disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/10 rounded-lg"
                            >
                                {status === 'loading' ? '...' : t('button')}
                            </button>
                        </div>

                        {/* Status Messages - Refined */}
                        <div className="mt-4 h-4 flex justify-center">
                            {status === 'success' && (
                                <div className="flex items-center gap-2 animate-fade-in">
                                    <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                                    <p className="text-accent text-[9px] uppercase tracking-[0.3em] font-black">
                                        {t('success')}
                                    </p>
                                </div>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 text-[9px] uppercase tracking-[0.3em] font-black animate-fade-in shadow-red-500/20">
                                    {t('error')}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
