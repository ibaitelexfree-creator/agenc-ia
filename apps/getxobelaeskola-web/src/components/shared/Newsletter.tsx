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
        <section className="w-full py-6 sm:py-8 md:py-12 relative overflow-hidden bg-nautical-deep selection:bg-accent selection:text-nautical-black flex flex-col items-center justify-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-brass-gold/5 blur-[70px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full max-w-[96%] sm:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
                <div 
                  className="w-full mx-auto glass-card text-center border-sea-foam/10 bg-sea-foam/[0.01] rounded-2xl overflow-hidden relative flex flex-col justify-center items-center"
                  style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem) clamp(1rem, 4vw, 3rem)' }}
                >
                    <header className="mb-6 sm:mb-8 landscape:mb-3 relative z-10 w-full">
                        <div className="flex items-center justify-center gap-3 mb-2 sm:mb-4 landscape:mb-1.5">
                            <div className="w-8 h-[1px] bg-accent/40" />
                            <span 
                              className="text-accent uppercase tracking-[0.4em] font-black whitespace-nowrap"
                              style={{ fontSize: 'clamp(0.72rem, 1.2vw, 0.88rem)' }}
                            >
                                {t('eyebrow')}
                            </span>
                            <div className="w-8 h-[1px] bg-accent/40" />
                        </div>

                        <h2 
                          className="font-display text-sea-foam mb-3 sm:mb-5 landscape:mb-2 tracking-tight font-bold"
                          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
                        >
                            {t('title')}
                        </h2>
                        <p 
                          className="text-sea-foam/70 font-light max-w-3xl landscape:max-w-5xl mx-auto leading-relaxed italic"
                          style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)' }}
                        >
                            {t('subtitle')}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="w-full max-w-3xl landscape:max-w-5xl mx-auto relative z-10 mt-2 sm:mt-4">
                        <div className="flex flex-col sm:flex-row landscape:flex-row gap-3 p-2 bg-sea-foam/[0.04] border border-sea-foam/15 rounded-xl focus-within:border-accent/50 transition-premium backdrop-blur-md">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('email_placeholder')}
                                required
                                aria-label={t('email_aria_label')}
                                className="flex-grow w-full sm:w-auto landscape:w-auto min-w-0 bg-transparent px-4 py-3 text-sea-foam placeholder:text-sea-foam/40 focus:outline-none font-sans"
                                style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full sm:w-auto landscape:w-auto shrink-0 whitespace-nowrap bg-nautical-blue px-7 py-3 text-white uppercase tracking-[0.2em] font-black hover:bg-white hover:text-nautical-blue transition-premium disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-nautical-blue/15 rounded-lg flex items-center justify-center text-center cursor-pointer"
                                style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}
                            >
                                {status === 'loading' ? '...' : t('button')}
                            </button>
                        </div>

                        {/* Status Messages - Refined */}
                        <div className="mt-4 h-4 flex justify-center">
                            {status === 'success' && (
                                <div className="flex items-center gap-2 animate-fade-in">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <p className="text-accent uppercase tracking-[0.3em] font-black" style={{ fontSize: 'clamp(0.7rem, 1vw, 0.8rem)' }}>
                                        {t('success')}
                                    </p>
                                </div>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 uppercase tracking-[0.3em] font-black animate-fade-in shadow-red-500/20" style={{ fontSize: 'clamp(0.7rem, 1vw, 0.8rem)' }}>
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
