'use client';

import { useSearchParams } from 'next/navigation';
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

    // Client-side filtering
    const displayCourses = activeCategory
        ? initialCourses.filter(course => course.categoria_id === activeCategory)
        : initialCourses;

    return (
        <section className="pb-48 relative overflow-hidden">
            <div className="w-full max-w-full px-4 sm:px-6 md:px-8 landscape:px-4 relative z-10">
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
                ) : (
                    <motion.div 
                        layout
                        className="courses-grid-system grid portrait:grid-cols-1 portrait:md:grid-cols-2 portrait:lg:grid-cols-3 landscape:grid-cols-2 landscape:md:grid-cols-3 mt-6 md:mt-10 lg:mt-12"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <CourseCard course={course} locale={locale} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
