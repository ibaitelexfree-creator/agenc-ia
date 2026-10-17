'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CourseCard from './CourseCard';
import CourseFilters from './CourseFilters';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    id: string;
    nombre_es: string;
    nombre_eu: string;
    slug: string;
}

interface CourseListClientProps {
    initialCourses: any[];
    categories: Category[];
    locale: string;
}

export default function CoursesListClient({ initialCourses, categories, locale }: CourseListClientProps) {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');
    const tCourses = useTranslations('courses_page');

    // Client-side filtering with fail-safe fallback
    const filtered = useMemo(() => {
        if (!activeCategory) return null;
        return initialCourses.filter(course => 
            course.categoria_id === activeCategory ||
            course.categoria?.id === activeCategory ||
            course.categoria?.slug === activeCategory ||
            course.categoria?.nombre_es?.toLowerCase() === activeCategory?.toLowerCase()
        );
    }, [activeCategory, initialCourses]);

    const isAllSelected = !activeCategory;
    const displayCourses = filtered !== null ? filtered : initialCourses;

    // Group courses by category for the "All" view matching top filter categories order
    const groupedSections = useMemo(() => {
        if (!isAllSelected) return [];

        return (categories || []).map((cat, index) => {
            const courses = initialCourses.filter(course =>
                course.categoria_id === cat.id ||
                course.categoria?.id === cat.id ||
                course.categoria?.slug === cat.slug ||
                course.categoria?.nombre_es?.toLowerCase() === cat.nombre_es?.toLowerCase()
            );

            const titleKey = `category_sections.${cat.id}_title`;
            const catName = tCourses.has(titleKey)
                ? tCourses(titleKey)
                : locale === 'eu'
                ? `${cat.nombre_eu} Ikastaroak`
                : `Cursos de ${cat.nombre_es.toLowerCase()}`;

            const descKey = `category_sections.${cat.id}_desc`;
            const catDesc = tCourses.has(descKey) ? tCourses(descKey) : '';

            return {
                id: cat.id,
                slug: cat.slug,
                title: catName,
                desc: catDesc,
                courses
            };
        }).filter(sec => sec.courses.length > 0);
    }, [isAllSelected, categories, initialCourses, locale, tCourses]);

    return (
        <section className="pb-16 sm:pb-24 lg:pb-36 relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 courses-container-padding relative z-10">
                <CourseFilters categories={categories || []} locale={locale} />

                {displayCourses.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="inline-block p-8 border border-sea-foam/10 rounded-2xl bg-sea-foam/[0.02]">
                            <span className="text-4xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-display text-sea-foam mb-2">
                                {locale === 'eu' ? 'Ez da ikastarorik aurkitu' : 'No se encontraron cursos'}
                            </h3>
                            <p className="text-sea-foam/60 max-w-md mx-auto">
                                {locale === 'eu'
                                    ? 'Saiatu beste kategoria batekin edo garbitu iragazkiak.'
                                    : 'Intenta con otra categoría o limpia los filtros.'}
                            </p>
                        </div>
                    </div>
                ) : isAllSelected ? (
                    /* "All" View: Ordered by categories matching top filter with clean separator headers */
                    <div className="space-y-16 sm:space-y-20 lg:space-y-24 mt-6 sm:mt-10">
                        {groupedSections.map((sec) => (
                            <div key={sec.id} className="relative">
                                {/* Section Separator Header */}
                                <div className="border-b border-sea-foam/15 pb-5 sm:pb-6 mb-6 sm:mb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display text-sea-foam tracking-tight">
                                                {sec.title}
                                            </h2>
                                        </div>
                                        {sec.desc && (
                                            <p className="text-sea-foam/60 text-xs sm:text-sm max-w-md font-light leading-relaxed">
                                                {sec.desc}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Courses Grid for this section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full">
                                    <AnimatePresence initial={false} mode="popLayout">
                                        {sec.courses.map((course) => (
                                            <motion.div
                                                key={course.id}
                                                layout="position"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full h-full flex flex-col"
                                            >
                                                <CourseCard course={course} locale={locale} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Specific Category View (e.g. windsurf, jovenes, etc.): standard grid without section separators */
                    <div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-4 sm:mt-8 md:mt-12 courses-grid-system w-full max-w-full"
                    >
                        <AnimatePresence initial={false} mode="popLayout">
                            {displayCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    layout="position"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex flex-col"
                                >
                                    <CourseCard course={course} locale={locale} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
}
