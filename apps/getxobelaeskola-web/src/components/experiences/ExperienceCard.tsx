'use client';

import Link from 'next/link';
import NauticalImage from '@/components/ui/NauticalImage';
import { useTranslations } from 'next-intl';
import { Compass, Users, Clock, ArrowRight, Star } from 'lucide-react';

interface ExperienceCardProps {
    experience: {
        id: string;
        nombre: string;
        nombre_eu?: string;
        nombre_en?: string;
        slug: string;
        descripcion?: string;
        descripcion_eu?: string;
        descripcion_en?: string;
        categoria: string;
        precio: number;
        imagen_url?: string;
        duracion?: string;
        min_participantes?: number;
    };
    locale: string;
}

export default function ExperienceCard({ experience, locale }: ExperienceCardProps) {
    const t = useTranslations('experiences_page');

    const getName = () => {
        if (locale === 'eu') return experience.nombre_eu || experience.nombre;
        if (locale === 'en') return experience.nombre_en || experience.nombre;
        return experience.nombre;
    };

    const getDescription = () => {
        if (locale === 'eu') return experience.descripcion_eu || experience.descripcion;
        if (locale === 'en') return experience.descripcion_en || experience.descripcion;
        return experience.descripcion;
    };

    return (
        <div className="group relative bg-sea-foam/[0.02] border border-sea-foam/10 overflow-hidden transition-all duration-700 hover:border-accent/30 hover:bg-sea-foam/[0.04] flex flex-col h-full rounded-2xl w-full max-w-full">
            {/* Top Badge Decor */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-30">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 bg-nautical-deep/80 backdrop-blur-md rounded-full border border-sea-foam/10">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brass-gold fill-brass-gold shrink-0" />
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.15em] sm:tracking-[0.3em] font-black text-sea-foam/80 whitespace-nowrap">{t('premium_experience')}</span>
                </div>
            </div>

            {/* Image Section - More cinematic Ratio */}
            <div className="relative aspect-[16/10] min-h-[140px] sm:min-h-0 overflow-hidden">
                <NauticalImage
                     src={experience.imagen_url || '/images/home-hero-sailing-action.webp'}
                    alt={getName()}
                    fill
                    className={`object-cover transition-transform duration-[3s] group-hover:scale-110 ${
                        (experience.slug === 'cumpleanos-navegacion' || experience.imagen_url?.includes('IMG_20241016_114549'))
                            ? 'brightness-[1.02] sepia-[0.12] saturate-[1.1]'
                            : 'saturate-[0.8] group-hover:saturate-100'
                    }`}
                />
                {/* Soft warm golden natural tone overlay for Birthday Sailing photo only */}
                {(experience.slug === 'cumpleanos-navegacion' || experience.imagen_url?.includes('IMG_20241016_114549')) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-orange-500/10 to-transparent pointer-events-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-8 text-right z-20">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.3em] text-white/40 block mb-0.5 sm:mb-1">{t('from')}</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-display text-white italic drop-shadow-lg">
                        {experience.precio}<span className="text-base sm:text-xl text-brass-gold ml-0.5 sm:ml-1">€</span>
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 md:p-10 flex flex-col flex-1 relative bg-gradient-to-br from-sea-foam/[0.01] to-transparent">
                <div className="flex flex-col h-full">
                    {/* Category */}
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.5em] text-brass-gold font-black mb-2 sm:mb-4 inline-block">
                        {t(experience.categoria)}
                    </span>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-sea-foam mb-3 sm:mb-6 leading-tight group-hover:text-accent transition-colors duration-500 italic break-words">
                        {getName()}
                    </h3>

                    <p className="text-sea-foam/60 text-xs sm:text-sm leading-relaxed font-light line-clamp-3 mb-4 sm:mb-8 group-hover:text-sea-foam/80 transition-colors">
                        {getDescription()}
                    </p>

                    {/* Info Row */}
                    <div className="mt-auto pt-4 sm:pt-8 border-t border-sea-foam/10 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2 sm:gap-6">
                            {experience.duracion && (
                                <div className="flex items-center gap-1.5 text-sea-foam/50">
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">{experience.duracion}</span>
                                </div>
                            )}
                            {experience.min_participantes && (
                                <div className="flex items-center gap-1.5 text-sea-foam/50">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">{experience.min_participantes}+ PAX</span>
                                </div>
                            )}
                        </div>

                        <Link
                            href={`/${locale}/contact`}
                            className="bg-sea-foam/5 hover:bg-sea-foam text-sea-foam hover:text-nautical-black p-2.5 sm:p-4 rounded-full transition-all duration-500 group/btn shrink-0"
                        >
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background Texture Decor */}
            <div className="absolute inset-0 bg-mesh opacity-[0.03] pointer-events-none" />
        </div>
    );
}
