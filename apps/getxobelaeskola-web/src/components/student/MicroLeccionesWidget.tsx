'use client';

import React, { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/platform';
import { Play, Clock } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import the player to avoid SSR issues and load only when needed
const MicroLeccionesPlayer = dynamic(() => import('./MicroLeccionesPlayer'), {
    ssr: false,
    loading: () => null
});

export interface MicroLeccion {
    id: string;
    titulo_es: string;
    titulo_eu: string;
    descripcion_es: string;
    descripcion_eu: string;
    video_url: string;
    thumbnail_url: string;
    duracion_segundos: number;
    categoria: string;
}

export default function MicroLeccionesWidget({ locale, translations, preloadedLessons }: { locale: string, translations: any, preloadedLessons?: MicroLeccion[] }) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const [lessons, setLessons] = useState<MicroLeccion[]>(preloadedLessons || []);
    const [loading, setLoading] = useState(!preloadedLessons);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

    useEffect(() => {
        if (preloadedLessons) return;

        async function fetchLessons() {
            try {
                const res = await fetch(getApiUrl('/api/student/micro-lecciones'));
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLessons(data);
                }
            } catch (error) {
                console.error('Error fetching micro-lessons:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLessons();
    }, [preloadedLessons]);

    if (loading) return <div className="animate-pulse h-40 bg-white/5 rounded-sm mb-12" />;
    if (lessons.length === 0) return null;

    return (
        <section className="mb-8 md:mb-12">
            <div className="flex justify-between items-end mb-3 md:mb-6">
                <h2 className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-accent font-normal sm:font-medium">
                    {translations.title || 'Micro-Lecciones'}
                </h2>
            </div>

            {/* Layout:
               - Mobile Portrait (< 640px): 3 + 2 layout (Row 1 has 3 items, Row 2 has 2 centered items)
               - Landscape / Tablets / Larger screens: Grid 5 columns (1 2 3 4 5)
            */}
            <div className="flex flex-wrap max-sm:justify-center sm:grid sm:grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 pb-4">
                {lessons.slice(0, 5).map((lesson, index) => (
                    <div
                        key={lesson.id}
                        onClick={() => setSelectedLessonIndex(index)}
                        className="max-sm:w-[calc(33.333%-0.375rem)] max-sm:[&:nth-child(4)]:w-[calc(40%-0.375rem)] max-sm:[&:nth-child(5)]:w-[calc(40%-0.375rem)] w-full aspect-[9/16] relative group cursor-pointer rounded-sm overflow-hidden border border-white/5 hover:border-accent/50 transition-all bg-nautical-black"
                    >
                        {/* Thumbnail */}
                        <Image
                            src={lesson.thumbnail_url || '/images/placeholder-vertical.jpg'}
                            alt={locale === 'es' ? lesson.titulo_es : lesson.titulo_eu}
                            fill
                            sizes="(max-width: 640px) 33vw, 20vw"
                            priority={index < 2}
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-accent/90 rounded-full flex items-center justify-center text-nautical-black shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                                <Play size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2.5">
                            <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-accent font-normal uppercase tracking-wider mb-0.5">
                                <Clock size={8} className="sm:w-2.5 sm:h-2.5" />
                                {Math.floor(lesson.duracion_segundos / 60)}:{(lesson.duracion_segundos % 60).toString().padStart(2, '0')}
                            </div>
                            <h3 className="text-[9px] sm:text-xs md:text-sm font-normal text-white/90 leading-tight line-clamp-2">
                                {locale === 'es' ? lesson.titulo_es : lesson.titulo_eu}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {selectedLessonIndex !== null && (
                <MicroLeccionesPlayer
                    lessons={lessons}
                    initialIndex={selectedLessonIndex}
                    onClose={() => setSelectedLessonIndex(null)}
                    locale={locale}
                />
            )}
        </section>
    );
}
