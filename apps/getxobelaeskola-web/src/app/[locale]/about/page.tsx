import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import HoverImage from '@/components/shared/HoverImage';
import { getSeoAlternates } from '@/lib/seo';

import AboutValuesSection from '@/components/about/AboutValuesSection';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const title = isEu ? 'Gure Eskola' : 'Nuestra Escuela';
    const description = isEu
        ? 'Ezagutu Getxo Bela Eskolako historia, gure ondarea eta itsas balioak. 1993tik nabigazioaren pasioa hurbiltzen.'
        : 'Conoce la historia de Getxo Bela Eskola, nuestro patrimonio y valores náuticos. Compartiendo la pasión por el mar desde 1993.';

    return {
        title,
        description,
        alternates: getSeoAlternates('about', locale),
        openGraph: {
            title,
            description,
            images: ['/images/about-hero-heritage.webp']
        }
    };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'about_page' });

    const valuesItems = [
        {
            title: t('values.v1_title'),
            desc: t('values.v1_desc'),
            icon: "⚓",
            bg: "/images/home-hero-sailing-action.webp"
        },
        {
            title: t('values.v2_title'),
            desc: t('values.v2_desc'),
            icon: "⛵",
            bg: "/images/course-raquero-students.webp"
        },
        {
            title: t('values.v3_title'),
            desc: t('values.v3_desc'),
            icon: "🌊",
            bg: "/images/home-cta-join.webp"
        }
    ];

    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* 1. Cinematic Hero Section */}
            <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-hero-heritage.webp"
                        alt="Maritime Heritage"
                        fill
                        priority
                        className="object-cover opacity-65 animate-slow-zoom-out object-[center_35%] sm:object-[center_38%]"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-nautical-black/80 via-transparent to-nautical-black/90 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="flex flex-col items-center">
                        <span className="inline-block text-accent uppercase tracking-[clamp(0.2em,1.2vw,0.8em)] text-xs sm:text-sm font-bold mb-6 sm:mb-10 opacity-80 animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-[clamp(2.5rem,8.5vw,9.5rem)] font-display text-sea-foam leading-[0.95] md:leading-[0.9] mb-8 sm:mb-12 drop-shadow-sm animate-reveal relative max-w-6xl">
                            {t('header_title')} <br />
                            <span className="italic font-light text-brass-gold/90">
                                {t('header_highlight')}
                            </span>
                        </h1>
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-6 md:gap-8 w-full max-w-4xl opacity-60 animate-fade-in px-2" style={{ animationDelay: '1s' }}>
                            <div className="hidden sm:block h-px flex-grow bg-gradient-to-l from-sea-foam/30 to-transparent" />
                            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] font-light text-center sm:text-left text-sea-foam">
                                {t('header_suffix')}
                            </p>
                            <div className="hidden sm:block h-px flex-grow bg-gradient-to-r from-sea-foam/30 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Aesthetic Coordinates Decor */}
                <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 hidden md:flex flex-col items-end gap-1.5 text-[8px] sm:text-[9px] tracking-[0.3em] text-sea-foam/35 uppercase font-light">
                    <span>43° 20&apos; 40&quot; N</span>
                    <span>2° 59&apos; 14&quot; W</span>
                </div>
            </section>

            {/* 2. Heritage & Story Section */}
            <section className="py-12 sm:py-20 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <StaggeredEntrance className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Decorative Quote Mark */}
                        <div className="lg:col-span-1 hidden lg:block self-start pt-12">
                            <span className="font-display text-8xl xl:text-9xl text-accent/10 italic leading-none">&quot;</span>
                        </div>

                        <div className="lg:col-span-5 space-y-6 sm:space-y-8 md:space-y-12 relative">
                            <div className="space-y-4 md:space-y-6">
                                <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] font-display leading-tight tracking-tight text-sea-foam">
                                    {t('commitment_title')} <br />
                                    <span className="italic font-light text-accent/80 underline decoration-sea-foam/10 underline-offset-[8px] sm:underline-offset-[12px]">
                                        {t('commitment_highlight')}
                                    </span>
                                </h2>
                            </div>

                            <div className="space-y-5 sm:space-y-6 md:space-y-8">
                                <p className="text-foreground/80 font-light text-base sm:text-lg md:text-xl leading-relaxed first-letter:text-4xl sm:first-letter:text-5xl md:first-letter:text-6xl first-letter:font-display first-letter:text-accent first-letter:float-left first-letter:mr-3 sm:first-letter:mr-4 first-letter:mt-1">
                                    {t('desc1')}
                                </p>
                                <div className="p-4 sm:p-6 md:p-8 border-l-2 border-brass-gold/20 bg-sea-foam/[0.02] backdrop-blur-sm space-y-3 sm:space-y-4">
                                    <p className="text-foreground/70 font-light text-sm sm:text-base md:text-lg leading-relaxed italic">
                                        {t('desc2')}
                                    </p>
                                    <p className="text-foreground/70 font-light text-sm sm:text-base md:text-lg leading-relaxed italic">
                                        {t('desc3')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 lg:pl-4 xl:pl-8 mt-8 lg:mt-0">
                            <div className="relative aspect-[3/4] max-w-md sm:max-w-lg mx-auto lg:max-w-none group">
                                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-full h-full border border-sea-foam/10 group-hover:-top-1 group-hover:-right-1 transition-all duration-700 pointer-events-none" />
                                <HoverImage
                                    src="/images/course-raquero-students.webp"
                                    alt="Sea Experience"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                    containerClassName="h-full shadow-2xl"
                                    imageClassName="object-cover scale-105 group-hover:scale-100"
                                />
                                {/* Image Badge - anchored relatively and cleanly positioned on all screens */}
                                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:-left-4 lg:-left-6 bg-nautical-deep/95 backdrop-blur-md px-4 py-2.5 sm:px-6 sm:py-4 border border-sea-foam/15 shadow-2xl z-20 transition-transform duration-300">
                                    <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold whitespace-nowrap">
                                        EST. 1993
                                    </span>
                                </div>
                            </div>
                        </div>
                    </StaggeredEntrance>
                </div>
            </section>

            {/* 3. The Pillars (Values) Section */}
            <section className="py-20 sm:py-28 md:py-40 relative bg-sea-foam/[0.01]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="container mx-auto px-4 sm:px-6 relative max-w-7xl">
                    <header className="mb-16 sm:mb-24 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        <span className="text-accent uppercase tracking-[0.4em] sm:tracking-[0.6em] text-xs sm:text-sm font-bold">Nuestra Esencia</span>
                        <h2 className="text-[clamp(2.25rem,5vw,5rem)] font-display text-sea-foam leading-tight">{t('define_title')}</h2>
                        <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                    </header>

                    <AboutValuesSection items={valuesItems} />
                </div>
            </section>

            {/* 4. Panoramic CTA Section */}
            <section className="relative min-h-[60vh] md:min-h-[75vh] py-20 md:py-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/home-cta-join.webp"
                        alt="Join us"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-5xl">
                    <h2 className="text-[clamp(2.75rem,10vw,11.5rem)] font-display mb-8 sm:mb-12 md:mb-16 italic lowercase leading-none opacity-30 hover:opacity-100 transition-opacity duration-1000 cursor-default select-none text-sea-foam">
                        {t('cta_title')}
                    </h2>
                    <div className="space-y-8 sm:space-y-12">
                        <p className="text-foreground/75 font-light max-w-xl mx-auto text-base sm:text-xl md:text-2xl leading-relaxed tracking-wide text-sea-foam px-2">
                            {t('cta_desc')}
                        </p>
                        <Link
                            href={`/${locale}/courses`}
                            className="group relative inline-flex items-center gap-4 sm:gap-8 px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 border border-sea-foam/20 hover:border-accent transition-all duration-700 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-0 bg-accent group-hover:w-full transition-all duration-700 ease-out z-0" />
                            <span className="relative z-10 text-sea-foam group-hover:text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] font-black transition-colors duration-700">
                                {t('cta_button')}
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

