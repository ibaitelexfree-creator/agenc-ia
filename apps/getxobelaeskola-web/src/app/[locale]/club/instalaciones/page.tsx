import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSeoAlternates } from '@/lib/seo';
import FacilitiesBlobGallery, { FacilityItem } from '@/components/facilities/FacilitiesBlobGallery';
import { BLOB_PATHS } from '@/data/blobPaths';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    const title = isEu 
        ? 'Gure Instalazioak | Getxo Bela Eskola'
        : isEn
        ? 'Our Facilities | Getxo Bela Eskola'
        : isFr
        ? 'Nos Installations | Getxo Bela Eskola'
        : 'Nuestras Instalaciones | Getxo Bela Eskola';

    const description = isEu
        ? 'Ezagutu Getxo Bela Eskolako instalazioak: pantalan propioa, ikus-entzunezko gelak, aldagelak eta ekipamendu osoa Getxoko Kirol Portuan.'
        : isEn
        ? 'Explore Getxo Bela Eskola facilities: private pontoon, audiovisual classrooms, lockers and full equipment at Getxo Marina.'
        : isFr
        ? 'Découvrez les installations de Getxo Bela Eskola : ponton privé, salles de classe audiovisuelles, vestiaires et équipement complet au port de Getxo.'
        : 'Conoce las instalaciones de Getxo Bela Eskola: pantalán propio, aula audiovisual, vestuarios cuidados y salida directa al mar en el Puerto Deportivo de Getxo.';

    return {
        title,
        description,
        alternates: getSeoAlternates('club/instalaciones', locale),
        openGraph: {
            title,
            description,
            images: ['/images/about-patio.jpg']
        }
    };
}

export default async function FacilitiesPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'facilities_page' });

    const facilityItems: FacilityItem[] = [
        {
            id: 'instalaciones',
            title: t('items.instalaciones.title'),
            badge: t('items.instalaciones.badge'),
            desc: t('items.instalaciones.desc'),
            imageSrc: '/images/about-patio.jpg',
            color: '#2EC4B6',
            icon: '⚓',
            paths: BLOB_PATHS.cursos,
            centerPull: { x: 28, y: 24 },
        },
        {
            id: 'pantalan',
            title: t('items.pantalan.title'),
            badge: t('items.pantalan.badge'),
            desc: t('items.pantalan.desc'),
            imageSrc: '/images/about-own-pontoon.jpg',
            color: '#F4A623',
            icon: '⛵',
            paths: BLOB_PATHS.clubSocias,
            centerPull: { x: -28, y: 24 },
        },
        {
            id: 'aulas',
            title: t('items.aulas.title'),
            badge: t('items.aulas.badge'),
            desc: t('items.aulas.desc'),
            imageSrc: '/images/facilities-aulas.webp',
            color: '#1D6FA4',
            icon: '📚',
            paths: BLOB_PATHS.equipos,
            centerPull: { x: 28, y: -24 },
        },
        {
            id: 'aseos',
            title: t('items.aseos.title'),
            badge: t('items.aseos.badge'),
            desc: t('items.aseos.desc'),
            imageSrc: '/images/facilities-aseos.webp',
            color: '#0D9488',
            icon: '🚿',
            paths: BLOB_PATHS.entidades,
            centerPull: { x: -28, y: -24 },
        },
    ];

    return (
        <main className="min-h-screen bg-white text-gray-900 selection:bg-accent selection:text-white pb-24">
            {/* Cinematic Fullscreen Hero (100vh) */}
            <section className="relative min-h-screen sm:min-h-[100dvh] w-full flex items-center justify-center overflow-hidden py-16 sm:py-24">
                <div className="absolute inset-0 z-0 w-full h-full">
                    {/* Desktop Hero Image */}
                    <Image
                        src="/images/facilities-hero-desktop.webp"
                        alt="Instalaciones Getxo Bela Eskola"
                        fill
                        priority
                        className="hidden md:block object-cover opacity-35 filter brightness-95 saturate-110"
                        sizes="100vw"
                    />
                    {/* Mobile Hero Image */}
                    <Image
                        src="/images/facilities-hero-mobile.webp"
                        alt="Instalaciones Getxo Bela Eskola"
                        fill
                        priority
                        className="block md:hidden object-cover opacity-35 filter brightness-95 saturate-110"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-white pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="flex flex-col items-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        <span className="inline-block text-accent uppercase tracking-[0.4em] sm:tracking-[0.6em] text-xs sm:text-sm font-black animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-display text-gray-950 font-bold leading-[1.02] tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.8)]">
                            {t('header_title')} <span className="italic font-bold text-accent">{t('header_highlight')}</span>
                        </h1>
                        <p className="text-base sm:text-xl text-gray-800 max-w-2xl font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]">
                            {t('header_desc')}
                        </p>
                        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto pt-2" />
                    </div>
                </div>

                {/* Aesthetic Coordinates Decor */}
                <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-1 text-[9px] tracking-[0.3em] text-gray-500 uppercase font-semibold">
                    <span>43° 20&apos; 40&quot; N</span>
                    <span>2° 59&apos; 14&quot; W</span>
                </div>
            </section>

            {/* Interactive Organic Morphing Blobs */}
            <FacilitiesBlobGallery items={facilityItems} />

            {/* Bottom CTA Card with Strong Volumetric Shadow & Crisp Black Typography */}
            <section className="container mx-auto px-4 sm:px-6 text-center mt-12 md:mt-20">
                <div className="bg-white border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] rounded-3xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
                    {/* Subtle top ocean accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-[#2EC4B6] to-accent" />
                    
                    <h2 className="text-2xl sm:text-4xl font-display text-gray-900 font-bold mb-4 tracking-tight">
                        {t('cta_title')}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
                        {t('cta_desc')}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href={`/${locale}/club/conocenos`}
                            className="px-8 py-3.5 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-xs font-bold uppercase tracking-[0.2em] text-gray-900 transition-all duration-300 rounded-xl shadow-sm"
                        >
                            {t('btn_about')}
                        </Link>
                        <Link
                            href={`/${locale}/servicios/cursos`}
                            className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-xs font-black uppercase tracking-[0.2em] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-accent/30"
                        >
                            {t('btn_courses')}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

