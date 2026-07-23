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
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-hero-heritage.webp"
                        alt="Maritime Heritage"
                        fill
                        priority
                        className="object-cover opacity-20 scale-100 animate-slow-zoom"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-nautical-black via-transparent to-nautical-black" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="flex flex-col items-center">
                        <span className="inline-block text-accent uppercase tracking-[1em] text-sm font-bold mb-12 opacity-80 animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-4xl md:text-7xl lg:text-[10rem] font-display text-sea-foam leading-[0.9] mb-12 drop-shadow-sm animate-reveal relative">
                            {t('header_title')} <br />
                            <span className="italic font-light text-brass-gold/90">
                                {t('header_highlight')}
                            </span>
                        </h1>
                        <div className="flex items-center gap-8 w-full max-w-4xl opacity-60 animate-fade-in" style={{ animationDelay: '1s' }}>
                            <div className="h-px bg-sea-foam/20 flex-1" />
                            <div className="text-[10px] uppercase tracking-[0.5em] text-brass-gold font-mono whitespace-nowrap">
                                43.3486° N, 3.0131° W • GETXO
                            </div>
                            <div className="h-px bg-sea-foam/20 flex-1" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Heritage / Story Section */}
            <section className="py-32 md:py-64 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-5xl">
                    <StaggeredEntrance className="space-y-24">
                        <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display text-sea-foam sticky top-32">
                                    {t('heritage_title')}
                                </h2>
                            </div>
                            <div className="space-y-12 text-lg md:text-xl font-light text-foreground/80 leading-relaxed">
                                <p className="first-letter:text-6xl first-letter:font-display first-letter:text-accent first-letter:mr-4 first-letter:float-left">
                                    {t('heritage_text1')}
                                </p>
                                <p>{t('heritage_text2')}</p>
                            </div>
                        </div>

                        {/* Visual Asset Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16">
                            <div className="relative h-[500px] group overflow-hidden">
                                <HoverImage
                                    src="/images/about-hero-heritage.webp"
                                    alt="Historical Getxo"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-nautical-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 text-xs font-mono tracking-widest text-sea-foam/60 uppercase">
                                    {t('img_caption_1')}
                                </div>
                            </div>
                            <div className="relative h-[500px] group overflow-hidden md:mt-24">
                                <HoverImage
                                    src="/images/home-hero-sailing-action.webp"
                                    alt="Modern Fleet"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-nautical-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 text-xs font-mono tracking-widest text-sea-foam/60 uppercase">
                                    {t('img_caption_2')}
                                </div>
                            </div>
                        </div>
                    </StaggeredEntrance>
                </div>
            </section>

            {/* 3. The Pillars (Values) Section */}
            <section className="py-32 md:py-64 relative bg-sea-foam/[0.01]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="container mx-auto px-6 relative">
                    <header className="mb-32 text-center max-w-4xl mx-auto space-y-8">
                        <span className="text-accent uppercase tracking-[0.6em] text-sm font-bold">Nuestra Esencia</span>
                        <h2 className="text-4xl md:text-6xl lg:text-8xl font-display text-sea-foam">{t('define_title')}</h2>
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                    </header>

                    <AboutValuesSection items={valuesItems} />
                </div>
            </section>

            {/* 4. Panoramic CTA Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-8xl lg:text-[12rem] font-display mb-16 italic lowercase leading-none opacity-20 hover:opacity-100 transition-opacity duration-1000 cursor-default select-none text-sea-foam">
                        {t('cta_title')}
                    </h2>
                    <div className="space-y-16">
                        <p className="text-foreground/75 font-light max-w-xl mx-auto text-2xl leading-relaxed tracking-wide text-sea-foam">
                            {t('cta_desc')}
                        </p>
                        <Link
                            href={`/${locale}/courses`}
                            className="group relative inline-flex items-center gap-8 px-16 py-8 border border-sea-foam/20 hover:border-accent transition-all duration-700 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-0 bg-accent group-hover:w-full transition-all duration-700 ease-out z-0" />
                            <span className="relative z-10 text-sea-foam group-hover:text-white text-[10px] uppercase tracking-[0.5em] font-black transition-colors duration-700">
                                {t('cta_button')}
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
