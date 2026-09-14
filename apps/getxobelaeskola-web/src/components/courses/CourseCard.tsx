'use client';

import Link from 'next/link';
import NauticalImage from '@/components/ui/NauticalImage';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface CourseCardProps {
    course: {
        slug: string;
        nombre_es: string;
        nombre_eu: string;
        descripcion_es: string;
        descripcion_eu: string;
        precio: number;
        duracion_h: number;
        nivel: string;
        imagen_url: string;
    };
    locale: string;
}

export default function CourseCard({ course, locale }: CourseCardProps) {
    const t = useTranslations('courses');
    const tData = useTranslations('courses_data');

    const hasTranslation = tData.has(`${course.slug}.name`);
    const rawName = hasTranslation
        ? tData(`${course.slug}.name`)
        : (locale === 'es' ? course.nombre_es : (locale === 'eu' ? course.nombre_eu : course.nombre_es)) || course.nombre_es || 'Curso sin nombre';
    const name = rawName.replace(/beginner/gi, '').trim();

    const rawDescription = hasTranslation
        ? tData(`${course.slug}.description`)
        : (locale === 'es' ? course.descripcion_es : (locale === 'eu' ? course.descripcion_eu : course.descripcion_es)) || course.descripcion_es || '';
    const description = rawDescription.replace(/beginner/gi, '').trim();

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative glass-card overflow-hidden cursor-pointer flex flex-col w-full h-full min-h-[350px] sm:min-h-[380px] lg:min-h-[420px] justify-between rounded-xl border border-sea-foam/10"
        >
            {/* Top Border Reveal Accent */}
            <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-700 z-20" />

            <div className="h-full flex flex-col justify-between w-full">
                {/* Image Container with Cinematic Zoom */}
                <div className="relative w-full h-[45%] min-h-[140px] sm:min-h-[160px] overflow-hidden course-card-img-container flex-shrink-0">
                    <NauticalImage
                        src={course.imagen_url}
                        category="veleros"
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover w-full h-full inset-0 transition-transform duration-[2s] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 premium-gradient-overlay z-10" />

                    {/* Vertical Text Accent */}
                    <div className="hidden sm:block absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity duration-1000 rotate-90 origin-right pointer-events-none">
                        <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-sea-foam/50 whitespace-nowrap font-light group-hover:text-accent group-hover:font-medium transition-all">
                            {course.duracion_h} HOURS
                        </span>
                    </div>
                </div>

                {/* Content Area - Generous Padding & Readable Typography */}
                <div className="p-3.5 sm:p-5 lg:p-6 relative z-10 flex flex-col justify-between flex-grow overflow-hidden h-[55%] space-y-2">
                    <div className="space-y-1">
                        <div className="flex justify-between items-baseline border-b border-sea-foam/10 pb-1 gap-1">
                            <span className="text-[11px] sm:text-xs text-technical truncate opacity-80">
                                Premium Academy
                            </span>
                            <span className="text-base sm:text-xl lg:text-2xl font-display text-sea-foam italic flex-shrink-0">
                                {course.precio}<span className="text-brass-gold text-xs sm:text-sm ml-0.5">€</span>
                            </span>
                        </div>

                        <h3 className="text-sm sm:text-base lg:text-lg font-display text-sea-foam italic group-hover:text-accent transition-colors duration-500 leading-snug pt-1 line-clamp-2">
                            {name}
                        </h3>
                    </div>

                    <p className="text-sea-foam/70 font-light text-xs sm:text-sm leading-relaxed group-hover:text-sea-foam/90 transition-colors duration-500 line-clamp-2 my-auto">
                        {description}
                    </p>

                    <div className="pt-1 relative z-10">
                        <Link
                            href={`/${locale}/servicios/cursos/${course.slug}`}
                            className="group/link w-full inline-flex items-center justify-between py-1 px-0 border-t border-sea-foam/10 hover:border-accent transition-all duration-700"
                        >
                            <span className="text-xs uppercase tracking-[0.15em] font-bold text-sea-foam group-hover/link:text-accent transition-colors">
                                {t('view_more')}
                            </span>
                            <span className="text-sm sm:text-base translate-x-0 group-hover/link:translate-x-2 transition-transform duration-700 opacity-0 group-hover/link:opacity-100 italic font-light text-accent">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background Texture Decor */}
            <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none" />
        </motion.div>
    );
}
