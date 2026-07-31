'use client';

import { useTranslations } from 'next-intl';
import NauticalConverter from '@/components/tools/NauticalConverter/NauticalConverter';
import Image from 'next/image';

export default function ToolsPage() {
    const t = useTranslations('tools');

    return (
        <main className="min-h-screen bg-nautical-deep relative overflow-hidden flex flex-col pt-20 md:pt-24 pb-12 px-4 md:px-8">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-nautical-deep via-transparent to-nautical-deep z-10" />
                {/* Abstract background pattern if image fails */}
                <div className="absolute inset-0 opacity-5 bg-[url('/images/noise.png')] mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 md:space-y-3">
                    <div className="inline-block px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-1">
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-black text-amber-400">
                            {t('title')}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-display italic text-amber-400 font-extrabold leading-tight drop-shadow-sm">
                        {t('converter.title')}
                    </h1>
                    <p className="text-slate-300 max-w-xl mx-auto font-medium text-xs md:text-sm leading-relaxed">
                        {t('converter.subtitle')}
                    </p>
                </div>

                {/* Tool Component */}
                <NauticalConverter />
            </div>
        </main>
    );
}
