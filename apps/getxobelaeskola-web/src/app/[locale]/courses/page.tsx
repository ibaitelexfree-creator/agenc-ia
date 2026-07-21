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

    // Fallback data reflecting the new catalog
    const fallbackCourses = [
        {
            id: '1',
            slug: 'iniciacion-adultos',
            nombre_es: 'Iniciación Adultos',
            nombre_eu: 'Helduentzako Hasiera',
            descripcion_es: 'Curso de iniciación a la navegación para adultos. 12 horas de formación práctica.',
            descripcion_eu: 'Helduentzako nabigazio ikastaroa (hasiera). 12 orduko prestakuntza praktikoa.',
            precio: 180,
            duracion_h: 12,
            nivel: 'iniciacion',
            categoria: { nombre_es: 'Cursos Adultos', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/J80.webp'
        },
        {
            id: '2',
            slug: 'campus-verano-getxo',
            nombre_es: 'Campus Verano (Haurrak)',
            nombre_eu: 'Udako Campusa (Haurrak)',
            descripcion_es: 'Campus de verano para niños de 5 a 21 años. 20 horas de diversión y vela.',
            descripcion_eu: '5 eta 21 urte bitarteko haurrendako udako campusa. 20 orduko dibertsioa eta bela.',
            precio: 130,
            duracion_h: 20,
            nivel: 'iniciacion',
            categoria: { nombre_es: 'Cursos Infantiles', nombre_eu: 'Haurrentzako Ikastaroak' },
            imagen_url: '/images/course-raquero-students.webp'
        },
        {
            id: '3',
            slug: 'windsurf-iniciacion',
            nombre_es: 'Iniciación Windsurf',
            nombre_eu: 'Windsurf Hasiera',
            descripcion_es: 'Aprende los fundamentos del windsurf en 5 sesiones de 2 horas.',
            descripcion_eu: 'Ikasi windsurfeko oinarriak 5 saiotan (2 ordu saio bakoitzeko).',
            precio: 150,
            duracion_h: 10,
            nivel: 'iniciacion',
            categoria: { nombre_es: 'Windsurf', nombre_eu: 'Windsurfa' },
            imagen_url: '/images/courses/PerfeccionamientoVela.webp'
        }
    ];

    const displayCourses = (allCourses && allCourses.length > 0) ? allCourses : fallbackCourses;

    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* Cinematic Header Section */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-brass-gold/5 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <header className="max-w-4xl">
                        <span className="text-accent uppercase tracking-[0.6em] text-sm font-bold mb-8 block animate-fade-in-up">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-[clamp(2.5rem,6vw,6.5rem)] font-display leading-[0.95] text-sea-foam mb-12 animate-reveal relative">
                            {t('header_title')} <br />
                            <span className="italic font-light text-brass-gold/90">{t('header_highlight')}</span>
                        </h1>
                        <p className="max-w-2xl text-sea-foam/60 font-light text-xl leading-relaxed border-l-2 border-sea-foam/10 pl-12 mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                            {t('header_desc')}
                        </p>
                    </header>
                </div>
            </section>

            {/* Client-side Course List Area */}
            <CoursesListClient
                initialCourses={displayCourses}
                categories={categories}
                locale={locale}
            />

            {/* Minimal Background Background Decoration */}
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none z-0" />
        </main>
    );
}
