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
        { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
        { id: 'cat-jovenes', slug: 'cursos-jovenes', nombre_es: 'Cursos para Jóvenes', nombre_eu: 'Gazteentzako Ikastaroak' },
        { id: 'cat-personalizados', slug: 'cursos-personalizados', nombre_es: 'Cursos Personalizados', nombre_eu: 'Ikastaro Pertsonalizatuak' },
        { id: 'cat-windsurf', slug: 'windsurf', nombre_es: 'Curso de Windsurf', nombre_eu: 'Windsurf Ikastaroa' },
        { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Cursos de Mantenimiento', nombre_eu: 'Mantentze Ikastaroak' }
    ];

    // Catálogo oficial exclusivo solicitado, con Adultas en primer lugar
    const fallbackCourses = [
        // 1. CURSOS PARA ADULTAS
        {
            id: 'c-crucero-iniciacion',
            slug: 'crucero-iniciacion',
            nombre_es: 'Iniciación J80',
            nombre_eu: 'J80 Hastapena',
            descripcion_es: 'Primer contacto con la navegación en crucero adaptado a cada persona, curso realmente completo: maniobras básicas, funcionamiento de las velas y el barco, meteorología, seguridad…',
            descripcion_eu: 'Gurutzaontzian nabigatzeko lehen kontaktua pertsona bakoitzari egokitua, ikastaro osoa: oinarrizko maniobrak, belen eta ontziaren funtzionamendua, meteorologia, segurtasuna…',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            nivel: 'iniciacion',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/courses/IniciacionJ80.webp'
        },
        {
            id: 'c-crucero-perfeccionamiento',
            slug: 'crucero-perfeccionamiento',
            nombre_es: 'Crucero perfeccionamiento',
            nombre_eu: 'Gurutzaontzi hobekuntza',
            descripcion_es: 'Para quienes ya navegan y quieren avanzar: trimado, maniobras finas, control del barco y lectura de la mar.',
            descripcion_eu: 'Dagoeneko nabigatzen dutenentzat eta aurrera egin nahi dutenentzat: trimatzea, maniobra zehatzak, ontziaren kontrola eta itsasoaren irakurketa.',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            nivel: 'intermedio',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/courses/PerfeccionamientoVela.webp'
        },
        {
            id: 'c-crucero-gennaker',
            slug: 'crucero-gennaker',
            nombre_es: 'Crucero con gennaker',
            nombre_eu: 'Gurutzaontzia gennakerrarekin',
            descripcion_es: 'Curso técnico y dinámico para aprender a manejar velas portantes con seguridad y confianza.',
            descripcion_eu: 'Ikastaro tekniko eta dinamikoa haize aldeko belak segurtasunez eta konfiantzaz erabiltzen ikasteko.',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            nivel: 'avanzado',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/J80.webp'
        },
        {
            id: 'c-entrenamientos-adultas',
            slug: 'entrenamientos-adultas',
            nombre_es: 'Entrenamientos para adultas',
            nombre_eu: 'Helduentzako entrenamenduak',
            descripcion_es: 'Sesiones regulares para mejorar técnica, ganar autonomía y navegar en equipo en distintos tipos de condiciones.',
            descripcion_eu: 'Ohiko saioak teknika hobetzeko, autonomia irabazteko eta hainbat baldintzatan taldean nabigatzeko.',
            precio: 100,
            precio_texto: '100 € / mes',
            duracion_h: 12,
            nivel: 'intermedio',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/ai/hero-deck-getxo.webp'
        },
        {
            id: 'c-vela-ligera-iniciacion',
            slug: 'vela-ligera-iniciacion',
            nombre_es: 'Vela ligera iniciación',
            nombre_eu: 'Bela arina hastapena',
            descripcion_es: 'Un primer paso ideal para descubrir la navegación en veleros pequeños donde el contacto con las sensaciones del barco y con el viento son muchos mayores.',
            descripcion_eu: 'Lehen pauso ezin hobea belaontzi txikietan nabigazioa ezagutzeko, non ontziaren eta haizearen sentsazioekiko kontaktua askoz handiagoa den.',
            precio: 150,
            precio_texto: '150 €',
            duracion_h: 12,
            nivel: 'iniciacion',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/courses/CursodeVelaLigera.webp'
        },
        {
            id: 'c-vela-ligera-avanzado',
            slug: 'vela-ligera-avanzado',
            nombre_es: 'Vela ligera avanzado',
            nombre_eu: 'Bela arina aurreratua',
            descripcion_es: 'Para quienes buscan profundizar: maniobras más precisas, autonomía total y una relación más fina con la mar.',
            descripcion_eu: 'Sakontzea bilatzen dutenentzat: maniobra zehatzagoak, autonomia osoa eta itsasoarekin harreman finagoa.',
            precio: 180,
            precio_texto: '180 €',
            duracion_h: 12,
            nivel: 'avanzado',
            categoria_id: 'cat-adultos',
            categoria: { id: 'cat-adultos', slug: 'cursos-adultos', nombre_es: 'Cursos para Adultas', nombre_eu: 'Helduentzako Ikastaroak' },
            imagen_url: '/images/alquiler-laser.webp'
        },

        // 2. CURSOS PARA JÓVENES (5-21 AÑOS)
        {
            id: 'c-txikigune-sabados',
            slug: 'txikigune-sabados',
            nombre_es: 'Txikigune (Sábados de navegación)',
            nombre_eu: 'Txikigune (Larunbateko nabigazioa)',
            descripcion_es: 'Espacio semanal para niñas y niños que quieren disfrutar de la mar días sueltos sin compromisos. Navegación, juego, aprendizaje y convivencia.',
            descripcion_eu: 'Konpromisorik gabe egun solteetan itsasoaz gozatu nahi duten neska-mutilentzako asteroko espazioa. Nabigazioa, jolasa, ikaskuntza eta elkarbizitza.',
            precio: 35,
            precio_texto: 'Desde 35 €',
            duracion_h: 3,
            nivel: 'iniciacion',
            categoria_id: 'cat-jovenes',
            categoria: { id: 'cat-jovenes', slug: 'cursos-jovenes', nombre_es: 'Cursos para Jóvenes', nombre_eu: 'Gazteentzako Ikastaroak' },
            imagen_url: '/images/course-raquero-students.webp'
        },
        {
            id: 'c-udalekuak-campamentos',
            slug: 'udalekuak-campamentos',
            nombre_es: 'Udalekuak (Campamentos)',
            nombre_eu: 'Udalekuak (Campamentos)',
            descripcion_es: 'Campamentos de verano donde la navegación se combina con actividades acuáticas, trabajo en equipo y experiencias que se recuerdan toda la vida.',
            descripcion_eu: 'Udako kanpamentuak, non nabigazioa ur-jarduerekin, talde-lanarekin eta bizitza osorako oroitzen diren esperientziekin uztartzen den.',
            precio: 130,
            precio_texto: '130 €',
            duracion_h: 20,
            nivel: 'iniciacion',
            categoria_id: 'cat-jovenes',
            categoria: { id: 'cat-jovenes', slug: 'cursos-jovenes', nombre_es: 'Cursos para Jóvenes', nombre_eu: 'Gazteentzako Ikastaroak' },
            imagen_url: '/images/course-raquero-students.webp'
        },
        {
            id: 'c-entrenamientos-infantiles-continuos',
            slug: 'entrenamientos-infantiles-continuos',
            nombre_es: 'Entrenamientos infantiles continuos',
            nombre_eu: 'Haurrentzako entrenamendu jarraituak',
            descripcion_es: 'Grupos estables para niñas y niños que quieren aprender más, avanzar en técnica y disfrutar de la mar todo el año.',
            descripcion_eu: 'Gehiago ikasi, teknikan aurrera egin eta urte osoan itsasoaz gozatu nahi duten neska-mutilentzako talde egonkorrak.',
            precio: 85,
            precio_texto: '85 € / mes',
            duracion_h: 12,
            nivel: 'intermedio',
            categoria_id: 'cat-jovenes',
            categoria: { id: 'cat-jovenes', slug: 'cursos-jovenes', nombre_es: 'Cursos para Jóvenes', nombre_eu: 'Gazteentzako Ikastaroak' },
            imagen_url: '/images/courses/CursodeVelaLigera.webp'
        },
        {
            id: 'c-entrenamientos-continuos-jovenes',
            slug: 'entrenamientos-continuos-jovenes',
            nombre_es: 'Entrenamientos continuos para jóvenes',
            nombre_eu: 'Gazteentzako entrenamendu jarraituak',
            descripcion_es: 'Grupos estables para jóvenes que buscan aprender y/o seguir creciendo en técnica, autonomía y trabajo en equipo.',
            descripcion_eu: 'Teknikan, autonomian eta talde-lanean ikasi edo hazten jarraitu nahi duten gazteentzako talde egonkorrak.',
            precio: 95,
            precio_texto: '95 € / mes',
            duracion_h: 12,
            nivel: 'avanzado',
            categoria_id: 'cat-jovenes',
            categoria: { id: 'cat-jovenes', slug: 'cursos-jovenes', nombre_es: 'Cursos para Jóvenes', nombre_eu: 'Gazteentzako Ikastaroak' },
            imagen_url: '/images/course-detail-header-sailing.webp'
        },

        // 3. CURSOS PERSONALIZADOS
        {
            id: 'c-bautismos',
            slug: 'bautismos',
            nombre_es: 'Bautismos',
            nombre_eu: 'Bataioak',
            descripcion_es: 'Una primera experiencia en la mar, pensada para disfrutar sin presión y descubrir la navegación de manera sencilla y acompañada.',
            descripcion_eu: 'Itsasoko lehen esperientzia bat, presiorik gabe gozatzeko eta nabigazioa modu erraz eta gidatuan ezagutzeko pentsatua.',
            precio: 45,
            precio_texto: '45 €',
            duracion_h: 2,
            nivel: 'iniciacion',
            categoria_id: 'cat-personalizados',
            categoria: { id: 'cat-personalizados', slug: 'cursos-personalizados', nombre_es: 'Cursos Personalizados', nombre_eu: 'Ikastaro Pertsonalizatuak' },
            imagen_url: '/images/ai/section2-calm-bay.webp'
        },
        {
            id: 'c-familia',
            slug: 'familia',
            nombre_es: 'Familia',
            nombre_eu: 'Familia',
            descripcion_es: 'Sesiones pensadas para compartir en familia, con ritmos tranquilos, dinámicas divertidas y navegación segura.',
            descripcion_eu: 'Familian partekatzeko pentsatutako saioak, erritmo lasaiekin, dinamika dibertigarriekin eta nabigazio seguruarekin.',
            precio: 160,
            precio_texto: 'Desde 160 €',
            duracion_h: 3,
            nivel: 'iniciacion',
            categoria_id: 'cat-personalizados',
            categoria: { id: 'cat-personalizados', slug: 'cursos-personalizados', nombre_es: 'Cursos Personalizados', nombre_eu: 'Ikastaro Pertsonalizatuak' },
            imagen_url: '/images/course-raquero-students.webp'
        },
        {
            id: 'c-cursos-personalizados',
            slug: 'cursos-personalizados',
            nombre_es: 'Cursos personalizados',
            nombre_eu: 'Neurrira egindako ikastaroak',
            descripcion_es: 'Formaciones a medida según objetivos, nivel y disponibilidad: desde técnica concreta hasta navegación por proyectos.',
            descripcion_eu: 'Helburuen, mailaren eta eskuragarritasunaren araberako prestakuntza pertsonalizatua: teknika zehatzetatik hasi eta proiektu bidezko nabigaziora arte.',
            precio: 0,
            precio_texto: 'A medida',
            duracion_h: 4,
            nivel: 'intermedio',
            categoria_id: 'cat-personalizados',
            categoria: { id: 'cat-personalizados', slug: 'cursos-personalizados', nombre_es: 'Cursos Personalizados', nombre_eu: 'Ikastaro Pertsonalizatuak' },
            imagen_url: '/images/ai/section2-action-sea.webp'
        },
        {
            id: 'c-regata-corporativa',
            slug: 'regata-corporativa',
            nombre_es: 'Regata corporativa',
            nombre_eu: 'Enpresa estropada',
            descripcion_es: 'Experiencia para empresas y grupos: navegación, trabajo en equipo y convivencia en un entorno diferente y estimulante.',
            descripcion_eu: 'Enpresa eta taldeentzako esperientzia: nabigazioa, talde-lana eta elkarbizitza ingurune ezberdin eta susgarrirako batean.',
            precio: 0,
            precio_texto: 'A medida',
            duracion_h: 4,
            nivel: 'iniciacion',
            categoria_id: 'cat-personalizados',
            categoria: { id: 'cat-personalizados', slug: 'cursos-personalizados', nombre_es: 'Cursos Personalizados', nombre_eu: 'Ikastaro Pertsonalizatuak' },
            imagen_url: '/images/ai/section4-community.webp'
        },

        // 4. CURSO DE WINDSURF
        {
            id: 'c-windsurf-iniciacion-perfeccionamiento',
            slug: 'windsurf-iniciacion-perfeccionamiento',
            nombre_es: 'Windsurf: Iniciación y perfeccionamiento',
            nombre_eu: 'Windsurfa: Hastapena eta hobekuntza',
            descripcion_es: 'Aprendizaje progresivo para quien empieza desde cero o quiere avanzar en técnica. Trabajo de equilibrio, maniobras, lectura del viento y autonomía en la tabla.',
            descripcion_eu: 'Ikaskuntza progresiboa hutsetik hasten denarentzat edo teknikan aurrera egin nahi duenarentzat. Oreka, maniobrak, haizearen irakurketa eta ohol gaineko autonomia.',
            precio: 45,
            precio_texto: 'Desde 45 €',
            duracion_h: 10,
            nivel: 'iniciacion',
            categoria_id: 'cat-windsurf',
            categoria: { id: 'cat-windsurf', slug: 'windsurf', nombre_es: 'Curso de Windsurf', nombre_eu: 'Windsurf Ikastaroa' },
            imagen_url: '/images/experiences/windsurf-mooring.jpg'
        },

        // 5. CURSOS DE MANTENIMIENTO
        {
            id: 'c-mantenimiento-embarcaciones',
            slug: 'mantenimiento-embarcaciones',
            nombre_es: 'Mantenimiento de embarcaciones',
            nombre_eu: 'Ontzien mantentzea',
            descripcion_es: 'Curso teórico-práctico de mantenimiento en general, enfocado principalmente a aprender a cuidar, revisar y mantener barcos de vela ligera y crucero.',
            descripcion_eu: 'Mantentze-lanei buruzko ikastaro teoriko-praktikoa oro har, batez ere bela arineko eta gurutzaontzietako ontziak zaintzen, berrikusten eta mantentzen ikastera bideratua.',
            precio: 100,
            precio_texto: '100 €',
            duracion_h: 8,
            nivel: 'iniciacion',
            categoria_id: 'cat-mantenimiento',
            categoria: { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Cursos de Mantenimiento', nombre_eu: 'Mantentze Ikastaroak' },
            imagen_url: '/images/facilities-hero-desktop.webp'
        },
        {
            id: 'c-costura-reparacion-velas',
            slug: 'costura-reparacion-velas',
            nombre_es: 'Costura y reparación de velas',
            nombre_eu: 'Belen jostura eta konponketa',
            descripcion_es: 'Taller especializado donde se aprende a coser, reparar y alargar la vida útil de velas y materiales textiles náuticos.',
            descripcion_eu: 'Belen eta itsas material ehungileen bizitza erabilgarria josten, konpontzen eta luzatzen ikasteko lantegi espezializatua.',
            precio: 90,
            precio_texto: '90 €',
            duracion_h: 6,
            nivel: 'iniciacion',
            categoria_id: 'cat-mantenimiento',
            categoria: { id: 'cat-mantenimiento', slug: 'mantenimiento', nombre_es: 'Cursos de Mantenimiento', nombre_eu: 'Mantentze Ikastaroak' },
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
