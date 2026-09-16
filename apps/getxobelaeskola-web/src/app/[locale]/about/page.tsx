import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import HoverVideoOrImage from '@/components/shared/HoverVideoOrImage';
import { getSeoAlternates } from '@/lib/seo';
import AboutStorySection from '@/components/about/AboutStorySection';

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

    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* 1. Cinematic Hero Section */}
            <section className="relative min-h-[85vh] sm:min-h-[100dvh] w-full flex items-center justify-center overflow-hidden py-12 sm:py-20 lg:py-0">
                <div className="absolute inset-0 z-0 w-full h-full">
                    <Image
                        src="/images/about-hero-heritage.webp"
                        alt="Maritime Heritage"
                        fill
                        priority
                        className="object-cover opacity-85 object-[center_60%] sm:object-[center_70%] md:object-[center_80%] lg:object-[center_82%] animate-slow-zoom grayscale-[20%] sepia-[10%] saturate-[1.05] contrast-[1.02] brightness-[0.98] blur-[0.3px] transition-all duration-1000 w-full h-full"
                        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-nautical-black/60 via-transparent to-nautical-black/75 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="flex flex-col items-center">
                        <span className="inline-block text-accent uppercase tracking-[clamp(0.15em,1vw,0.8em)] text-[10px] sm:text-xs md:text-sm font-bold mb-4 sm:mb-8 opacity-90 animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-[clamp(2.2rem,7vw,8rem)] font-display text-black font-bold leading-[0.98] sm:leading-[0.95] md:leading-[0.9] mb-6 sm:mb-10 animate-reveal relative max-w-6xl">
                            {t('header_title') ? (
                                <>
                                    {t('header_title')} <br />
                                </>
                            ) : null}
                            <span className="italic font-bold text-black">
                                {t('header_highlight')}
                            </span>
                        </h1>
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-6 md:gap-8 w-full max-w-4xl px-2 mt-48 sm:mt-60 md:mt-72 lg:mt-80">
                            <div className="hidden sm:block h-[1.5px] flex-grow bg-gradient-to-l from-black/60 to-transparent" />
                            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.4em] font-black text-center sm:text-left text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]">
                                {t('header_suffix')}
                            </p>
                            <div className="hidden sm:block h-[1.5px] flex-grow bg-gradient-to-r from-black/60 to-transparent" />
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
            <AboutStorySection
                title={t('commitment_title')}
                desc1={t('short_desc1')}
                desc2={t('short_desc2')}
                readMoreText={t('read_more')}
                modalData={{
                    title: t('modal.title'),
                    p1: t('modal.p1'),
                    p2: t('modal.p2'),
                    p3: t('modal.p3')
                }}
            />

            {/* 3. Panoramic CTA Section */}
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

