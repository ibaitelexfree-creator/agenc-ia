'use client';

import { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Anchor } from 'lucide-react';

function LoginPageContent({ locale }: { locale: string }) {
    const t = useTranslations('auth');
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    // Auto-redirect if already authenticated
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
            if (session) {
                supabase.from('profiles').select('rol').eq('id', session.user.id).single().then(({ data }) => {
                    if (data && (data.rol === 'admin' || data.rol === 'instructor')) {
                        router.replace(returnTo || `/${locale}/staff`);
                    } else {
                        router.replace(returnTo || `/${locale}/student/dashboard`);
                    }
                });
            } else {
                setChecking(false);
            }
        });
    }, [locale, router, returnTo]);

    if (checking) {
        return (
            <div className="min-h-screen bg-nautical-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-nautical-black flex flex-col relative overflow-hidden">
            {/* Background Gradient Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brass-gold/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Desktop Hero Column */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-1/2 overflow-hidden pointer-events-none">
                <img
                    src="/images/login-page-captain.jpeg"
                    alt="Capitán"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-nautical-black via-transparent to-nautical-black" />
                <div className="absolute bottom-16 left-12 xl:left-20 z-10 max-w-lg">
                    <h2 className="text-4xl xl:text-5xl font-display mb-3 italic text-sea-foam leading-tight">{t('hero_text')}</h2>
                    <p className="text-accent uppercase tracking-widest text-[10px] font-bold">Getxo Bela Eskola · Est. 1992</p>
                </div>
            </div>

            {/* Content Container — Centered form across mobile, tablet, desktop */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:w-1/2 lg:ml-auto relative z-10">
                <div className="w-full max-w-sm">
                    {/* Brand Header */}
                    <header className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-5">
                            <Anchor className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-display text-sea-foam mb-2">{t('login_title')}</h1>
                        <p className="text-sea-foam/60 text-sm">{t('login_desc')}</p>
                    </header>

                    {/* Login Form */}
                    <LoginForm locale={locale} />

                    {/* Register Link */}
                    <footer className="mt-8 text-center">
                        <p className="text-sea-foam/60 text-xs">
                            {t('no_account')}{' '}
                            <Link
                                href={`/${locale}/auth/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                                className="text-accent hover:text-sea-foam transition-colors font-bold"
                            >
                                {t('create_one')}
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    );
}

export default function LoginPageClient({ locale }: { locale: string }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-nautical-black" />}>
            <LoginPageContent locale={locale} />
        </Suspense>
    );
}
