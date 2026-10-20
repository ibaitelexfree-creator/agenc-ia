'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { Anchor } from 'lucide-react';

function RegisterPageContent({ locale }: { locale: string }) {
    const t = useTranslations('auth');
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    return (
        <main className="min-h-screen bg-[#0D2137] text-white flex flex-col md:grid md:grid-cols-2 relative">
            {/* Background Ambient Glow Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-brass-gold/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Visual Hero Column: Split Screen on md+ (>= 768px), Branded Header Banner on mobile (< 768px) */}
            <div className="relative overflow-hidden w-full h-44 sm:h-56 md:h-auto md:min-h-screen flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16 select-none flex-shrink-0">
                <Image
                    src="/images/login-page-captain.jpeg"
                    alt="Experiencia de Vela"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover opacity-30 md:opacity-35 grayscale"
                />
                {/* Gradient: bottom-to-top on mobile, left-to-right on tablet/desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137] via-[#0D2137]/60 to-transparent md:bg-gradient-to-r md:from-[#0D2137]/80 md:via-transparent md:to-[#0D2137]" />

                <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display mb-1 md:mb-3 italic text-white leading-tight">
                        {t('hero_text')}
                    </h2>
                    <p className="text-accent uppercase tracking-widest text-[9px] sm:text-[10px] md:text-xs font-bold">
                        Getxo Bela Eskola · Est. 1992
                    </p>
                </div>
            </div>

            {/* Form Column: In-flow and centered, fully scrollable on any viewport */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:p-12 lg:p-16 w-full">
                <div className="w-full max-w-sm sm:max-w-md my-auto">
                    {/* Brand Header */}
                    <header className="text-center mb-8 sm:mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-4 sm:mb-5">
                            <Anchor className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-display text-white mb-2">
                            {t('register_title')}
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm">
                            {t('register_desc')}
                        </p>
                    </header>

                    {/* Register Form */}
                    <RegisterForm />

                    {/* Login Link */}
                    <footer className="mt-8 text-center">
                        <p className="text-white/60 text-xs">
                            {t('has_account')}{' '}
                            <Link
                                href={`/${locale}/auth/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                                className="text-accent hover:text-white transition-colors font-bold"
                            >
                                {t('login_here')}
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    );
}

export default function RegisterPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0D2137]" />}>
            <RegisterPageContent locale={locale} />
        </Suspense>
    );
}
