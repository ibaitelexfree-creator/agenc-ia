'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Anchor, Shield, Star, Award, ChevronRight, Users, Gift } from 'lucide-react';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import HoverImage from '@/components/shared/HoverImage';
import { m } from 'framer-motion';
import { hoverLift } from '@/lib/animations/variants';
import { useTranslations } from 'next-intl';

export default function ClubSociasPage() {
    const t = useTranslations('club_socias');
    
    const benefits = [
        {
            icon: <Anchor className="w-8 h-8 text-accent" />,
            title: t('benefits.b1_title'),
            desc: t('benefits.b1_desc')
        },
        {
            icon: <Users className="w-8 h-8 text-accent" />,
            title: t('benefits.b2_title'),
            desc: t('benefits.b2_desc')
        },
        {
            icon: <Shield className="w-8 h-8 text-accent" />,
            title: t('benefits.b3_title'),
            desc: t('benefits.b3_desc')
        },
        {
            icon: <Star className="w-8 h-8 text-accent" />,
            title: t('benefits.b4_title'),
            desc: t('benefits.b4_desc')
        },
        {
            icon: <Award className="w-8 h-8 text-accent" />,
            title: t('benefits.b5_title'),
            desc: t('benefits.b5_desc')
        },
        {
            icon: <Gift className="w-8 h-8 text-accent" />,
            title: t('benefits.b6_title'),
            desc: t('benefits.b6_desc')
        }
    ];

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* Cinematic Hero */}
            <section className="relative pt-8 landscape:pt-6 sm:pt-14 md:pt-20 lg:pt-24 pb-8 landscape:pb-6 md:pb-16 overflow-hidden bg-nautical-deep w-full -mt-[0.5vh] -mb-[0.5vh]">
                <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="w-full px-4 sm:px-6 md:px-12 relative z-10 text-center">
                    <header className="w-full max-w-full mx-auto space-y-2.5 landscape:space-y-2.5 md:space-y-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass-gold/10 border border-brass-gold/20 text-brass-gold text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1 md:mb-3 animate-fade-in-up">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {t('title')}
                        </span>
                        <h1 className="text-[clamp(1.35rem,3.8vw,4rem)] font-display text-sea-foam leading-[1.1] uppercase w-full">
                            {t('hero_title_part1')} <br className="hidden sm:inline" />
                            <span className="italic font-light text-accent/90">{t('hero_title_part2')}</span>
                        </h1>
                        <p className="w-full max-w-full text-foreground/70 font-light text-xs sm:text-sm md:text-base leading-relaxed border-l-2 md:border-l-0 border-sea-foam/10 pl-3 md:pl-0 mt-3 md:mt-5 text-left md:text-center">
                            {t('subtitle')} {t('description2')}
                        </p>
                    </header>
                </div>
            </section>

            {/* Split Image & Text Section */}
            <section className="py-8 landscape:py-10 md:py-16 relative overflow-hidden w-full">
                <div className="w-full px-4 sm:px-6 md:px-12">
                    <StaggeredEntrance type="slide" className="grid grid-cols-1 landscape:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-14 items-center w-full">
                        <div className="landscape:col-span-1 lg:col-span-6 w-full">
                            <div className="relative aspect-[3/2.03] w-full border-2 border-sea-foam/30 overflow-hidden shadow-2xl group bg-nautical-deep rounded-xl scale-y-[1.01]">
                                <Image
                                    src="/images/socias-angharad-wa0084.webp"
                                    alt="Socias Sailing action"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 contrast-[1.04] saturate-[1.02] sepia-[0.08] hue-rotate-[-3deg]"
                                />
                            </div>
                        </div>

                        <div className="landscape:col-span-1 lg:col-span-6 space-y-3 md:space-y-5 w-full max-w-full">
                            <h2 className="text-lg landscape:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display uppercase tracking-tight w-full">
                                {t('section_title_part1')} <br className="hidden sm:inline" />
                                <span className="italic font-light text-accent">{t('section_title_part2')}</span>
                            </h2>
                            <p className="text-foreground/80 font-light text-xs sm:text-sm md:text-base leading-relaxed w-full max-w-full">
                                {t('description1')}
                            </p>
                        </div>
                    </StaggeredEntrance>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-12 landscape:py-14 md:py-20 relative bg-sea-foam/[0.02] border-t border-sea-foam/10 w-full">
                <div className="w-full px-4 sm:px-6 md:px-12">
                    <header className="mb-8 md:mb-14 text-center w-full max-w-full">
                        <span className="text-accent uppercase tracking-[0.4em] text-[10px] sm:text-xs font-black mb-2 block">{t('benefits_eyebrow')}</span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display">{t('benefits_title')}</h2>
                        <div className="w-16 h-px bg-accent/40 mx-auto mt-3" />
                    </header>

                    <StaggeredEntrance type="slide" staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 w-full">
                        {benefits.map((benefit, i) => (
                            <m.div
                                key={i}
                                {...hoverLift}
                                className="relative group h-full bg-gradient-to-b from-amber-500/[0.08] to-amber-500/[0.03] border border-amber-500/35 hover:border-amber-400/70 p-5 md:p-7 rounded-2xl flex flex-col justify-between gap-3 backdrop-blur-md shadow-lg shadow-black/20 hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden"
                            >
                                {/* Decorative ambient background glow */}
                                <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all duration-500 pointer-events-none" />
                                
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:border-amber-400/50 group-hover:bg-amber-500/15 transition-all">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-base md:text-lg font-display text-sea-foam group-hover:text-amber-300 transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sea-foam/75 text-[11px] sm:text-xs font-light leading-relaxed">
                                        {benefit.desc}
                                    </p>
                                </div>
                            </m.div>
                        ))}
                    </StaggeredEntrance>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-14 landscape:py-14 md:py-20 relative bg-nautical-deep overflow-hidden border-t border-sea-foam/10 text-center w-full">
                <div className="absolute inset-0 bg-maps opacity-5 pointer-events-none" />
                <div className="w-full px-4 sm:px-6 md:px-12 relative z-10 space-y-6 md:space-y-10">
                    <h2 className="text-xl landscape:text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-tight w-full">
                        {t('cta_title')}
                    </h2>
                    <p className="text-sea-foam/60 text-xs sm:text-sm md:text-base font-light w-full max-w-2xl mx-auto leading-relaxed">
                        {t('cta_desc')}
                    </p>
                    <div className="pt-3">
                        <Link
                            href="/contacto/localizacion"
                            className="inline-flex items-center gap-2.5 border border-accent bg-accent/5 px-7 py-3.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-black text-accent hover:bg-accent hover:text-nautical-black transition-premium shadow-lg shadow-accent/15 group"
                        >
                            {t('cta_button')}
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
