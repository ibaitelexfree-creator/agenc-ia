import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import CoursesListClient from '@/components/courses/CoursesListClient';
import { getSeoAlternates } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';

    const title = isEu ? 'Ikastaroak' : 'Cursos';
    const description = isEu
        ? 'Ezagutu gure bela, kayak eta nabigazio lizentzia ikastaroak Getxon. Formazio praktikoa eta teorikoa.'
        : 'En Getxo Bela Eskola ofrecemos cursos para todas las edades y niveles, siempre desde un enfoque cercano, progresivo y adaptado a cada persona.';

    return {
        title,
        description,
        alternates: getSeoAlternates('courses', locale),
        openGraph: {
            title,
            description,
            images: ['/images/course-raquero-students.webp']
        }
    };
}

export default async function CoursesPage({
    params: { locale }
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: 'courses_page' });
    const supabase = createClient();

    let categories: any[] = [];
    let allCourses: any[] = [];

    // Safe Static Fetching
    try {
        // Fetch categories
        const { data: catData } = await supabase
            .from('categorias')
            .select('*')
            .order('nombre_es');

        categories = catData || [];

        // Fetch ALL courses (no filtering here)
        const { data: coursesData } = await supabase
            .from('cursos')
            .select(`
                *,
                categoria:categoria_id (
                    id,
                    slug,
                    nombre_es,
                    nombre_eu
                )
            `)
            .eq('activo', true)
            .eq('visible', true)
            .order('created_at', { ascending: false });

        allCourses = coursesData || [];
    } catch (error) {
        console.error('Error loading courses for static build:', error);
        // Fallback or empty - handled by client empty state or fallback below
    }

    const fallbackCategories = [
        { id: 'cat-crucero', slug: 'crucero', nombre_es: 'Crucero', nombre_eu: 'Gurutzaontzia' },
        { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
        { id: 'cat-windsurf', slug: 'windsurf', nombre_es: 'Windsurf', nombre_eu: 'Windsurf' },
        { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Mantenimiento', nombre_eu: 'Mantentzea' }
    ];

    // Catálogo oficial exclusivo solicitado clasificado por: Crucero, Vela ligera, Windsurf, Mantenimiento
    const fallbackCourses = [
        // 1. CURSOS DE CRUCERO
        {
            id: 'c-crucero-iniciacion',
            slug: 'crucero-iniciacion',
            nombre_es: 'Crucero Ini',
            nombre_eu: 'Crucero Ini',
            subtitulo_es: 'Iniciación',
            subtitulo_eu: 'Hastapena',
            descripcion_es: 'Aprende a navegar, gana confianza y mejora tus habilidades a bordo de nuestros J80 y lleva tus habilidades a otro nivel.',
            descripcion_eu: 'Aprende a navegar, gana confianza y mejora tus habilidades a bordo de nuestros J80 y lleva tus habilidades a otro nivel.',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            duracion_dias: '3 días',
            edad_minima: '+ de 15 años',
            nivel: 'iniciacion',
            categoria_id: 'cat-crucero',
            categoria: { id: 'cat-crucero', slug: 'crucero', nombre_es: 'Crucero', nombre_eu: 'Gurutzaontzia' },
            imagen_url: '/images/courses/IniciacionJ80_v6.webp'
        },
        {
            id: 'c-entrenamientos-adultas',
            slug: 'entrenamientos-adultas',
            nombre_es: 'Eq. Entren. Adulto',
            nombre_eu: 'Eq. Entren. Adulto',
            subtitulo_es: 'Equipo de Entrenamiento',
            subtitulo_eu: 'Entrenamendu Taldea',
            descripcion_es: 'Equipo de entrenamiento para mejorar técnica, ganar autonomía y navegar en equipo en distintos tipos de condiciones.',
            descripcion_eu: 'Equipo de entrenamiento para mejorar técnica, ganar autonomía y navegar en equipo en distintos tipos de condiciones.',
            precio: 100,
            precio_texto: '100 € / mes',
            duracion_h: 12,
            edad_minima: '+ de 16 años',
            nivel: 'intermedio',
            categoria_id: 'cat-crucero',
            categoria: { id: 'cat-crucero', slug: 'crucero', nombre_es: 'Crucero', nombre_eu: 'Gurutzaontzia' },
            imagen_url: '/images/courses/entrenamientos-adultas.jpg'
        },
        {
            id: 'c-crucero-perfeccionamiento',
            slug: 'crucero-perfeccionamiento',
            nombre_es: 'Crucero perfeccionamiento',
            nombre_eu: 'Crucero perfeccionamiento',
            subtitulo_es: 'Avanzado',
            subtitulo_eu: 'Aurreratua',
            descripcion_es: 'Para quienes ya navegan y quieren avanzar: trimado, maniobras finas, control del barco y lectura de la mar.',
            descripcion_eu: 'Para quienes ya navegan y quieren avanzar: trimado, maniobras finas, control del barco y lectura de la mar.',
            precio: 140,
            precio_texto: '140 €',
            duracion_h: 8,
            duracion_dias: '2 días',
            edad_minima: '+ de 16 años',
            nivel: 'avanzado',
            categoria_id: 'cat-crucero',
            categoria: { id: 'cat-crucero', slug: 'crucero', nombre_es: 'Crucero', nombre_eu: 'Gurutzaontzia' },
            imagen_url: '/images/courses/PerfeccionamientoVela.webp'
        },
        {
            id: 'c-crucero-gennaker',
            slug: 'crucero-gennaker',
            nombre_es: 'Gennaker',
            nombre_eu: 'Gennaker',
            subtitulo_es: 'Avanzado',
            subtitulo_eu: 'Aurreratua',
            descripcion_es: 'Curso técnico y dinámico para aprender a manejar velas portantes con seguridad y confianza.',
            descripcion_eu: 'Curso técnico y dinámico para aprender a manejar velas portantes con seguridad y confianza.',
            precio: 140,
            precio_texto: '140 € / 2 días',
            duracion_h: 8,
            duracion_dias: '2 días',
            edad_minima: '+ de 16 años',
            nivel: 'avanzado',
            categoria_id: 'cat-crucero',
            categoria: { id: 'cat-crucero', slug: 'crucero', nombre_es: 'Crucero', nombre_eu: 'Gurutzaontzia' },
            imagen_url: '/images/J80.webp'
        },

        // 2. CURSOS DE VELA LIGERA
        {
            id: 'c-vela-ligera-iniciacion',
            slug: 'vela-ligera-iniciacion',
            nombre_es: 'Iniciación',
            nombre_eu: 'Iniciación',
            subtitulo_es: 'Iniciación',
            subtitulo_eu: 'Hastapena',
            descripcion_es: 'Descubre la emoción de la vela ligera, siente el viento y aprende a dominar tu embarcación.',
            descripcion_eu: 'Descubre la emoción de la vela ligera, siente el viento y aprende a dominar tu embarcación.',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            edad_minima: '+ de 15 años',
            nivel: 'iniciacion',
            categoria_id: 'cat-vela-ligera',
            categoria: { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
            imagen_url: '/images/courses/CursodeVelaLigera.webp'
        },
        {
            id: 'c-entrenamientos-infantiles-continuos',
            slug: 'entrenamientos-infantiles-continuos',
            nombre_es: 'Eq. Entren. Infantiles',
            nombre_eu: 'Eq. Entren. Infantiles',
            subtitulo_es: 'Equipo de Entrenamiento',
            subtitulo_eu: 'Entrenamendu Taldea',
            descripcion_es: 'Equipo de entrenamiento para niñas y niños que quieren aprender más, avanzar en técnica y disfrutar de la mar todo el año.',
            descripcion_eu: 'Equipo de entrenamiento para niñas y niños que quieren aprender más, avanzar en técnica y disfrutar de la mar todo el año.',
            precio: 120,
            precio_texto: '120 € / mes',
            duracion_h: 12,
            edad_minima: '5 a 12/15 años',
            nivel: 'intermedio',
            categoria_id: 'cat-vela-ligera',
            categoria: { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
            imagen_url: '/images/courses/CursodeVelaLigera.webp'
        },
        {
            id: 'c-entrenamientos-continuos-jovenes',
            slug: 'entrenamientos-continuos-jovenes',
            nombre_es: 'Eq. Entren. Jóvenes',
            nombre_eu: 'Eq. Entren. Jóvenes',
            subtitulo_es: 'Equipo de Entrenamiento',
            subtitulo_eu: 'Entrenamendu Taldea',
            descripcion_es: 'Equipo de entrenamiento para jóvenes que buscan seguir creciendo en técnica, autonomía y navegación deportiva.',
            descripcion_eu: 'Equipo de entrenamiento para jóvenes que buscan seguir creciendo en técnica, autonomía y navegación deportiva.',
            precio: 100,
            precio_texto: '100 € / mes',
            duracion_h: 12,
            edad_minima: '+12/15 años',
            nivel: 'intermedio',
            categoria_id: 'cat-vela-ligera',
            categoria: { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
            imagen_url: '/images/course-detail-header-sailing.webp'
        },
        {
            id: 'c-vela-ligera-avanzado',
            slug: 'vela-ligera-avanzado',
            nombre_es: 'Avanzado',
            nombre_eu: 'Avanzado',
            subtitulo_es: 'Avanzado',
            subtitulo_eu: 'Aurreratua',
            descripcion_es: 'Para quienes buscan profundizar: maniobras más precisas, autonomía total y una relación más fina con la mar.',
            descripcion_eu: 'Para quienes buscan profundizar: maniobras más precisas, autonomía total y una relación más fina con la mar.',
            precio: 180,
            precio_texto: '180 € / 3 días',
            duracion_h: 12,
            duracion_dias: '3 días',
            edad_minima: '+ de 16 años',
            nivel: 'avanzado',
            categoria_id: 'cat-vela-ligera',
            categoria: { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
            imagen_url: '/images/alquiler-laser.webp'
        },
        {
            id: 'c-udalekuak-campamentos',
            slug: 'udalekuak-campamentos',
            nombre_es: 'Udaleku',
            nombre_eu: 'Udaleku',
            subtitulo_es: 'Campamentos de vela',
            subtitulo_eu: 'Bela udalekuak',
            descripcion_es: 'Campamentos de verano donde la navegación en vela ligera se combina con actividades acuáticas y trabajo en equipo.',
            descripcion_eu: 'Campamentos de verano donde la navegación en vela ligera se combina con actividades acuáticas y trabajo en equipo.',
            precio: 130,
            precio_texto: '130 € / sem',
            duracion_h: 20,
            duracion_dias: 'Semanal',
            edad_minima: '+3 años',
            nivel: 'iniciacion',
            categoria_id: 'cat-vela-ligera',
            categoria: { id: 'cat-vela-ligera', slug: 'vela-ligera', nombre_es: 'Vela ligera', nombre_eu: 'Bela arina' },
            imagen_url: '/images/course-raquero-students.webp'
        },

        // 3. CURSO DE WINDSURF
        {
            id: 'c-windsurf-iniciacion-perfeccionamiento',
            slug: 'windsurf-iniciacion-perfeccionamiento',
            nombre_es: 'Iniciación',
            nombre_eu: 'Iniciación',
            subtitulo_es: 'Windsurf: Iniciación y perfeccionamiento',
            subtitulo_eu: 'Windsurfa: Hastapena eta hobekuntza',
            descripcion_es: 'Windsurf: Iniciación y perfeccionamiento. Aprendizaje progresivo para quien empieza desde cero o quiere avanzar en técnica.',
            descripcion_eu: 'Windsurf: Iniciación y perfeccionamiento. Aprendizaje progresivo para quien empieza desde cero o quiere avanzar en técnica.',
            precio: 45,
            precio_texto: 'Desde 45 €',
            duracion_h: 2.5,
            duracion_h_texto: '2,5h',
            nivel: 'iniciacion',
            categoria_id: 'cat-windsurf',
            categoria: { id: 'cat-windsurf', slug: 'windsurf', nombre_es: 'Windsurf', nombre_eu: 'Windsurf' },
            imagen_url: '/images/experiences/windsurf-mooring.jpg'
        },

        // 4. CURSOS DE MANTENIMIENTO
        {
            id: 'c-mantenimiento-embarcaciones',
            slug: 'mantenimiento-embarcaciones',
            nombre_es: 'Mantenimiento',
            nombre_eu: 'Mantenimiento',
            subtitulo_es: 'Mantenimiento de embarcaciones',
            subtitulo_eu: 'Ontzien mantentzea',
            descripcion_es: 'Mantenimiento de embarcaciones. Curso práctico enfocado a aprender a cuidar, revisar y mantener barcos de vela ligera y crucero.',
            descripcion_eu: 'Mantenimiento de embarcaciones. Curso práctico enfocado a aprender a cuidar, revisar y mantener barcos de vela ligera y crucero.',
            precio: 0,
            precio_texto: '',
            duracion_h: 8,
            nivel: 'iniciacion',
            categoria_id: 'cat-mantenimiento',
            categoria: { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Mantenimiento', nombre_eu: 'Mantentzea' },
            imagen_url: '/images/facilities-hero-desktop.webp'
        },
        {
            id: 'c-costura-reparacion-velas',
            slug: 'costura-reparacion-velas',
            nombre_es: 'Velas',
            nombre_eu: 'Velas',
            subtitulo_es: 'Costura y reparación de velas',
            subtitulo_eu: 'Belen jostura eta konponketa',
            descripcion_es: 'Costura y reparación de velas. Taller especializado donde se aprende a coser, reparar y alargar la vida útil de velas y materiales textiles náuticos.',
            descripcion_eu: 'Costura y reparación de velas. Taller especializado donde se aprende a coser, reparar y alargar la vida útil de velas y materiales textiles náuticos.',
            precio: 0,
            precio_texto: '',
            duracion_h: 6,
            nivel: 'iniciacion',
            categoria_id: 'cat-mantenimiento',
            categoria: { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Mantenimiento', nombre_eu: 'Mantentzea' },
            imagen_url: '/images/about-own-pontoon.webp'
        }
    ];

    // Usar catálogo estructurado como fuente de verdad garantizada y ordenada
    const displayCategories = fallbackCategories;
    const displayCourses = fallbackCourses;

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* Cinematic Header Section */}
            <section className="courses-header-section relative pt-[clamp(7.5rem,14vh,11rem)] pb-2 sm:pb-4 overflow-hidden w-full">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-brass-gold/5 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-left">
                    <header className="w-full max-w-4xl">
                        <span className="text-accent uppercase tracking-[0.6em] text-[clamp(0.65rem,0.8vw,0.875rem)] font-bold mb-2 sm:mb-4 block animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-[clamp(2rem,4.5vw,4.5rem)] font-display leading-[0.95] text-sea-foam mb-2 sm:mb-6 animate-reveal relative">
                            {t('header_title')} <span className="italic font-light text-brass-gold/90">{t('header_highlight')}</span>
                        </h1>
                        <p className="w-full max-w-3xl text-sea-foam/70 font-light text-[clamp(0.9rem,1.3vw,1.25rem)] leading-relaxed border-l-2 border-sea-foam/20 pl-4 sm:pl-6 md:pl-8 mt-3 sm:mt-6">
                            {t('header_desc')}
                        </p>
                    </header>
                </div>
            </section>

            {/* Client-side Course List Area */}
            <CoursesListClient
                initialCourses={displayCourses}
                categories={displayCategories}
                locale={locale}
            />

            {/* Minimal Background Decoration */}
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none z-0" />
        </main>
    );
}
