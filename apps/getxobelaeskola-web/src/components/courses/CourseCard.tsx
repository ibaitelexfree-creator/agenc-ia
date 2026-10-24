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
        precio_texto?: string;
        duracion_texto?: string;
        edad_texto?: string;
        nivel_badge?: string;
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

    const courseUrl = `/${locale}/servicios/cursos/${course.slug}`;

    return (
        <Link href={courseUrl} className="block w-full h-full">
            <motion.div 
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative glass-card overflow-hidden cursor-pointer flex flex-col w-full h-full min-h-[290px] sm:min-h-[310px] lg:min-h-[330px] justify-between rounded-xl border border-sea-foam/10"
            >
                {/* Top Border Reveal Accent */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-700 z-20" />

                <div className="h-full flex flex-col justify-between w-full">
                    {/* Image Container with Cinematic Zoom */}
                    <div className="relative w-full h-[52%] min-h-[150px] sm:min-h-[170px] overflow-hidden course-card-img-container flex-shrink-0">
                        <NauticalImage
                            src={course.imagen_url}
                            category="veleros"
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover w-full h-full inset-0 transition-transform duration-[2s] ease-out group-hover:scale-110"
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 premium-gradient-overlay z-10" />
                    </div>

                    {/* Content Area - Close to image, Readable Typography */}
                    <div className="pt-2 sm:pt-3 pb-3 sm:pb-3.5 px-3.5 sm:px-5 lg:px-6 relative z-10 flex flex-col justify-between flex-grow overflow-hidden h-[48%]">
                        <div className="flex flex-col justify-start">
                            {/* Standardized Header Row with Fixed Height so that text is centered and cards stay strictly aligned */}
                            <div className="flex justify-between items-center border-b border-sea-foam/10 pb-1.5 gap-2 min-h-[52px] sm:min-h-[58px]">
                                <span className="text-[10.5px] sm:text-[11.4px] font-mono uppercase tracking-[0.1em] font-bold text-sea-foam/80 truncate">
                                    {course.nivel_badge || (course.nivel ? t(`levels.${course.nivel}`, { defaultValue: course.nivel }) : 'Getxo Bela Eskola')}
                                </span>
                                <div className="flex flex-col items-end justify-center flex-shrink-0">
                                    <div className="flex items-baseline gap-0.5">
                                        {course.precio_texto ? (
                                            <span className="text-sm sm:text-base lg:text-lg font-display text-accent italic font-semibold">
                                                {course.precio_texto}
                                            </span>
                                        ) : course.precio > 0 ? (
                                            <span className="text-base sm:text-xl lg:text-2xl font-display text-sea-foam italic">
                                                {course.precio}<span className="text-brass-gold text-xs sm:text-sm ml-0.5">€</span>
                                            </span>
                                        ) : (
                                            <span className="text-xs sm:text-sm font-display text-accent italic uppercase tracking-wider">
                                                {locale === 'eu' ? 'Kontsultatu' : 'A medida'}
                                            </span>
                                        )}
                                    </div>
                                    {(course.duracion_texto || course.edad_texto) && (
                                        <div className="flex flex-col items-end text-[10px] sm:text-[11px] text-sea-foam/60 font-light leading-tight mt-0.5">
                                            {course.duracion_texto && (
                                                <span>{course.duracion_texto}</span>
                                            )}
                                            {course.edad_texto && (
                                                <span className="text-brass-gold/90 font-medium">{course.edad_texto}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title area with fixed height for perfect vertical alignment across cards */}
                            <div className="h-[48px] sm:h-[54px] flex items-center">
                                <h3 className="text-base sm:text-lg lg:text-xl font-display text-sea-foam italic group-hover:text-accent transition-colors duration-500 leading-snug line-clamp-2">
                                    {name}
                                </h3>
                            </div>
                        </div>

                        {/* Bottom action anchored cleanly to bottom */}
                        <div className="mt-auto pt-2 relative z-10">
                            <div className="w-full inline-flex items-center justify-between py-1 px-0 border-t border-sea-foam/10 group-hover:border-accent transition-all duration-700">
                                <span className="text-xs uppercase tracking-[0.15em] font-bold text-sea-foam group-hover:text-accent transition-colors">
                                    {t('view_more')}
                                </span>
                                <span className="text-sm sm:text-base translate-x-0 group-hover:translate-x-2 transition-transform duration-700 opacity-0 group-hover:opacity-100 italic font-light text-accent">→</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Texture Decor */}
                <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none" />
            </motion.div>
        </Link>
    );
}
