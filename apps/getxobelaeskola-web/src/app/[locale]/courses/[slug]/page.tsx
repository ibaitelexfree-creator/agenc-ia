import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { listGoogleEvents } from '@/lib/google-calendar';

const BookingSelector = dynamic(() => import('@/components/booking/BookingSelector'), { ssr: false });
import JsonLd from '@/components/shared/JsonLd';

import { Metadata } from 'next';

export async function generateMetadata({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}): Promise<Metadata> {
    const supabase = createClient();
    let course: any = null;
    try {
        const { data } = await supabase
            .from('cursos')
            .select('*')
            .eq('slug', slug)
            .single();
        course = data;
    } catch (e) {
        console.error('Metadata fetch failed:', e);
    }

    // Re-use fallback logic for metadata
    const fallbacks: Record<string, any> = {
        'crucero-iniciacion': { nombre_es: 'Iniciación J80', nombre_eu: 'J80 Hastapena', imagen_url: '/images/courses/IniciacionJ80.webp' },
        'crucero-perfeccionamiento': { nombre_es: 'Crucero perfeccionamiento', nombre_eu: 'Gurutzaontzi hobekuntza', imagen_url: '/images/courses/PerfeccionamientoVela.webp' },
        'crucero-gennaker': { nombre_es: 'Crucero con gennaker', nombre_eu: 'Gurutzaontzia gennakerrarekin', imagen_url: '/images/J80.webp' },
        'entrenamientos-adultas': { nombre_es: 'Entrenamientos para adultas', nombre_eu: 'Helduentzako entrenamenduak', imagen_url: '/images/ai/hero-deck-getxo.webp' },
        'vela-ligera-iniciacion': { nombre_es: 'Vela ligera iniciación', nombre_eu: 'Bela arina hastapena', imagen_url: '/images/courses/CursodeVelaLigera.webp' },
        'vela-ligera-avanzado': { nombre_es: 'Vela ligera avanzado', nombre_eu: 'Bela arina aurreratua', imagen_url: '/images/alquiler-laser.webp' },
        'txikigune-sabados': { nombre_es: 'Txikigune (Sábados de navegación)', nombre_eu: 'Txikigune (Larunbateko nabigazioa)', imagen_url: '/images/course-raquero-students.webp' },
        'udalekuak-campamentos': { nombre_es: 'Udalekuak (Campamentos)', nombre_eu: 'Udalekuak (Campamentos)', imagen_url: '/images/course-raquero-students.webp' },
        'entrenamientos-infantiles-continuos': { nombre_es: 'Entrenamientos infantiles continuos', nombre_eu: 'Haurrentzako entrenamendu jarraituak', imagen_url: '/images/courses/CursodeVelaLigera.webp' },
        'entrenamientos-continuos-jovenes': { nombre_es: 'Entrenamientos continuos para jóvenes', nombre_eu: 'Gazteentzako entrenamendu jarraituak', imagen_url: '/images/course-detail-header-sailing.webp' },
        'bautismos': { nombre_es: 'Bautismos', nombre_eu: 'Bataioak', imagen_url: '/images/ai/section2-calm-bay.webp' },
        'familia': { nombre_es: 'Familia', nombre_eu: 'Familia', imagen_url: '/images/course-raquero-students.webp' },
        'cursos-personalizados': { nombre_es: 'Cursos personalizados', nombre_eu: 'Neurrira egindako ikastaroak', imagen_url: '/images/ai/section2-action-sea.webp' },
        'regata-corporativa': { nombre_es: 'Regata corporativa', nombre_eu: 'Enpresa estropada', imagen_url: '/images/ai/section4-community.webp' },
        'windsurf-iniciacion-perfeccionamiento': { nombre_es: 'Windsurf: Iniciación y perfeccionamiento', nombre_eu: 'Windsurfa: Hastapena eta hobekuntza', imagen_url: '/images/experiences/windsurf-mooring.jpg' },
        'mantenimiento-embarcaciones': { nombre_es: 'Mantenimiento de embarcaciones', nombre_eu: 'Ontzien mantentzea', imagen_url: '/images/facilities-hero-desktop.webp' },
        'costura-reparacion-velas': { nombre_es: 'Costura y reparación de velas', nombre_eu: 'Belen jostura eta konponketa', imagen_url: '/images/about-own-pontoon.webp' }
    };

    const displayCourse = (course || fallbacks[slug]) as any;
    if (!displayCourse) return { title: 'Curso no encontrado' };

    const tData = await getTranslations({ locale, namespace: 'courses_data' });
    const hasTranslation = tData.has(`${slug}.name`);

    const name = hasTranslation
        ? tData(`${slug}.name`)
        : (locale === 'es' ? displayCourse.nombre_es : (locale === 'eu' ? displayCourse.nombre_eu : displayCourse.nombre_es)) || 'Curso';

    const description = hasTranslation
        ? tData(`${slug}.description`)
        : (locale === 'es' ? displayCourse.descripcion_es : (locale === 'eu' ? displayCourse.descripcion_eu : displayCourse.descripcion_es)) || '';

    return {
        title: name,
        description: description,
        openGraph: {
            title: name,
            description: description,
            images: [displayCourse.imagen_url || '/images/home-hero-sailing-action.webp']
        },
        twitter: {
            card: 'summary_large_image',
            title: name,
            description: description,
        }
    };
}

export async function generateStaticParams() {
    const slugs = [
        'crucero-iniciacion',
        'crucero-perfeccionamiento',
        'crucero-gennaker',
        'entrenamientos-adultas',
        'vela-ligera-iniciacion',
        'vela-ligera-avanzado',
        'txikigune-sabados',
        'udalekuak-campamentos',
        'entrenamientos-infantiles-continuos',
        'entrenamientos-continuos-jovenes',
        'bautismos',
        'familia',
        'cursos-personalizados',
        'regata-corporativa',
        'windsurf-iniciacion-perfeccionamiento',
        'mantenimiento-embarcaciones',
        'costura-reparacion-velas'
    ];
    const locales = ['es', 'eu', 'en', 'fr'];
    return locales.flatMap(locale => slugs.map(slug => ({ locale, slug })));
}

export default async function CourseDetailPage({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}) {
    interface Edition {
        id: string;
        fecha_inicio: string;
        fecha_fin: string;
        plazas_totales: number;
        plazas_ocupadas: number;
        is_calendar_event?: boolean;
    }

    interface CourseFallback {
        id: string;
        nombre_es: string;
        nombre_eu: string;
        nombre_en?: string;
        nombre_fr?: string;
        descripcion_es: string;
        descripcion_eu: string;
        descripcion_en?: string;
        descripcion_fr?: string;
        precio: number;
        duracion_h: number;
        nivel: string;
        imagen_url: string;
        detalles?: {
            es: string[];
            eu: string[];
        };
    }
    const supabase = createClient();

    // 1. Fetch main course data
    let course: any = null;
    try {
        const { data } = await supabase
            .from('cursos')
            .select('*')
            .eq('slug', slug)
            .single();
        course = data;
    } catch (e) {
        console.error('Course fetch failed:', e);
    }

    // 2. Fetch real sessions/editions (if table works)
    let dbEditions: Edition[] = [];
    try {
        const { data: editionsData } = await supabase
            .from('ediciones_curso')
            .select('*')
            .eq('curso_id', course?.id)
            .gte('fecha_inicio', new Date().toISOString())
            .order('fecha_inicio', { ascending: true });
        dbEditions = (editionsData as unknown as Edition[]) || [];
    } catch (e) {
        console.error('Fetch editions failed', e);
    }

    // 3. Fetch from Google Calendar
    let calendarEditions: Edition[] = [];
    try {
        const events = await listGoogleEvents();
        // Match events that contain "J80" or course name keywords
        const searchTerms = [
            'J80',
            slug.split('-').join(' '),
            course?.nombre_es,
            course?.nombre_eu
        ].filter(Boolean).map(s => s!.toUpperCase());

        calendarEditions = events
            .filter((event: any) => {
                const summary = (event.summary || '').toUpperCase();
                const description = (event.description || '').toUpperCase();
                return searchTerms.some(term => summary.includes(term) || description.includes(term));
            })
            .map((event: any) => ({
                id: `ext_${event.id}`,
                fecha_inicio: event.start?.dateTime || event.start?.date,
                fecha_fin: event.end?.dateTime || event.end?.date,
                plazas_totales: 4, // Default according to user request
                plazas_ocupadas: 0,
                is_calendar_event: true,
                google_event_id: event.id
            }));
    } catch (e) {
        console.error('Fetch calendar events failed', e);
    }

    // 4. Merge and deduplicate (roughly by date)
    const allRealEditions = [...dbEditions, ...calendarEditions].sort(
        (a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime()
    );

    // 3. Fallback Registry (Always active to ensure UI works)
    const fallbacks: Record<string, CourseFallback> = {
        'crucero-iniciacion': {
            id: 'c-crucero-iniciacion',
            nombre_es: 'Iniciación J80',
            nombre_eu: 'J80 Hastapena',
            descripcion_es: 'Primer contacto con la navegación en crucero adaptado a cada persona, curso realmente completo: maniobras básicas, funcionamiento de las velas y el barco, meteorología, seguridad…',
            descripcion_eu: 'Gurutzaontzian nabigatzeko lehen kontaktua pertsona bakoitzari egokitua, ikastaro osoa: oinarrizko maniobrak, belen eta ontziaren funtzionamendua, meteorologia, segurtasuna…',
            precio: 180,
            duracion_h: 12,
            nivel: 'iniciacion',
            imagen_url: '/images/courses/IniciacionJ80.webp',
            detalles: {
                es: ['Maniobras básicas', 'Funcionamiento de las velas y barco', 'Meteorología y lectura de la mar', 'Seguridad a bordo · Flota J80'],
                eu: ['Oinarrizko maniobrak', 'Belen eta ontziaren funtzionamendua', 'Meteorologia eta itsasoaren irakurketa', 'Segurtasuna ontzian · J80 flota']
            }
        },
        'crucero-perfeccionamiento': {
            id: 'c-crucero-perfeccionamiento',
            nombre_es: 'Crucero perfeccionamiento',
            nombre_eu: 'Gurutzaontzi hobekuntza',
            descripcion_es: 'Para quienes ya navegan y quieren avanzar: trimado, maniobras finas, control del barco y lectura de la mar.',
            descripcion_eu: 'Dagoeneko nabigatzen dutenentzat eta aurrera egin nahi dutenentzat: trimatzea, maniobra zehatzak, ontziaren kontrola eta itsasoaren irakurketa.',
            precio: 180,
            duracion_h: 12,
            nivel: 'intermedio',
            imagen_url: '/images/courses/PerfeccionamientoVela.webp',
            detalles: {
                es: ['Trimado fino de velas', 'Control y gobierno del barco', 'Maniobras avanzadas', 'Lectura de viento y mar'],
                eu: ['Belen trimatze fina', 'Ontziaren kontrola eta gobernua', 'Maniobra aurreratuak', 'Haizearen eta itsasoaren irakurketa']
            }
        },
        'crucero-gennaker': {
            id: 'c-crucero-gennaker',
            nombre_es: 'Crucero con gennaker',
            nombre_eu: 'Gurutzaontzia gennakerrarekin',
            descripcion_es: 'Curso técnico y dinámico para aprender a manejar velas portantes con seguridad y confianza.',
            descripcion_eu: 'Ikastaro tekniko eta dinamikoa haize aldeko belak segurtasunez eta konfiantzaz erabiltzen ikasteko.',
            precio: 180,
            duracion_h: 12,
            nivel: 'avanzado',
            imagen_url: '/images/J80.webp',
            detalles: {
                es: ['Izada, trasluchada y arriada de gennaker', 'Rumbos portantes y ángulos de viento', 'Seguridad y coordinación en equipo', 'Dinámica en velero J80'],
                eu: ['Gennakerra igotzea, biratzea eta jaistea', 'Haize aldeko norabideak eta angeluak', 'Segurtasuna eta talde-koordinazioa', 'Dinamika J80 belaontzian']
            }
        },
        'entrenamientos-adultas': {
            id: 'c-entrenamientos-adultas',
            nombre_es: 'Entrenamientos para adultas',
            nombre_eu: 'Helduentzako entrenamenduak',
            descripcion_es: 'Sesiones regulares para mejorar técnica, ganar autonomía y navegar en equipo en distintos tipos de condiciones.',
            descripcion_eu: 'Ohiko saioak teknika hobetzeko, autonomia irabazteko eta hainbat baldintzatan taldean nabigatzeko.',
            precio: 100,
            duracion_h: 12,
            nivel: 'intermedio',
            imagen_url: '/images/ai/hero-deck-getxo.webp',
            detalles: {
                es: ['Programa continuo anual o mensual', 'Autonomía y trabajo en equipo', 'Navegación en diversas condiciones', 'Puesta a punto y maniobra'],
                eu: ['Urteko edo hileko programa jarraitua', 'Autonomia eta talde-lana', 'Nabigazioa askotariko baldintzetan', 'Puntuan jartzea eta maniobrak']
            }
        },
        'vela-ligera-iniciacion': {
            id: 'c-vela-ligera-iniciacion',
            nombre_es: 'Vela ligera iniciación',
            nombre_eu: 'Bela arina hastapena',
            descripcion_es: 'Un primer paso ideal para descubrir la navegación en veleros pequeños donde el contacto con las sensaciones del barco y con el viento son muchos mayores.',
            descripcion_eu: 'Lehen pauso ezin hobea belaontzi txikietan nabigazioa ezagutzeko, non ontziaren eta haizearen sentsazioekiko kontaktua askoz handiagoa den.',
            precio: 150,
            duracion_h: 12,
            nivel: 'iniciacion',
            imagen_url: '/images/courses/CursodeVelaLigera.webp',
            detalles: {
                es: ['Sensibilidad directa al timón y escotas', 'Equilibrio y dinámica con el viento', 'Aparejo y maniobras básicas', 'Monitores especializados'],
                eu: ['Sentikortasun zuzena lema eta eskotetan', 'Oreka eta dinamika haizearekin', 'Aparejua eta oinarrizko maniobrak', 'Monitore espezializatuak']
            }
        },
        'vela-ligera-avanzado': {
            id: 'c-vela-ligera-avanzado',
            nombre_es: 'Vela ligera avanzado',
            nombre_eu: 'Bela arina aurreratua',
            descripcion_es: 'Para quienes buscan profundizar: maniobras más precisas, autonomía total y una relación más fina con la mar.',
            descripcion_eu: 'Sakontzea bilatzen dutenentzat: maniobra zehatzagoak, autonomia osoa eta itsasoarekin harreman finagoa.',
            precio: 180,
            duracion_h: 12,
            nivel: 'avanzado',
            imagen_url: '/images/alquiler-laser.webp',
            detalles: {
                es: ['Maniobras de precisión y velocidad', 'Autonomía total a bordo', 'Táctica de rumbos y trimado fino', 'Lectura de rachas y corrientes'],
                eu: ['Doitasunezko eta abiadurazko maniobrak', 'Autonomia osoa ontzian', 'Norabide taktika eta trimatze fina', 'Hodeiertzaren eta korronteen irakurketa']
            }
        },
        'txikigune-sabados': {
            id: 'c-txikigune-sabados',
            nombre_es: 'Txikigune (Sábados de navegación)',
            nombre_eu: 'Txikigune (Larunbateko nabigazioa)',
            descripcion_es: 'Espacio semanal para niñas y niños que quieren disfrutar de la mar días sueltos sin compromisos. Navegación, juego, aprendizaje y convivencia.',
            descripcion_eu: 'Konpromisorik gabe egun solteetan itsasoaz gozatu nahi duten neska-mutilentzako asteroko espazioa. Nabigazioa, jolasa, ikaskuntza eta elkarbizitza.',
            precio: 35,
            duracion_h: 3,
            nivel: 'iniciacion',
            imagen_url: '/images/course-raquero-students.webp',
            detalles: {
                es: ['Días sueltos los sábados sin compromiso', 'Juegos marineros y aprendizaje activo', 'Convivencia y trabajo en equipo', 'Edades de 5 a 21 años'],
                eu: ['Egun solteak larunbatetan konpromisorik gabe', 'Itsas jolasak eta ikaskuntza aktiboa', 'Elkarbizitza eta talde-lana', '5 eta 21 urte bitartekoentzat']
            }
        },
        'udalekuak-campamentos': {
            id: 'c-udalekuak-campamentos',
            nombre_es: 'Udalekuak (Campamentos)',
            nombre_eu: 'Udalekuak (Campamentos)',
            descripcion_es: 'Campamentos de verano donde la navegación se combina con actividades acuáticas, trabajo en equipo y experiencias que se recuerdan toda la vida.',
            descripcion_eu: 'Udako kanpamentuak, non nabigazioa ur-jarduerekin, talde-lanarekin eta bizitza osorako oroitzen diren esperientziekin uztartzen den.',
            precio: 130,
            duracion_h: 20,
            nivel: 'iniciacion',
            imagen_url: '/images/course-raquero-students.webp',
            detalles: {
                es: ['Campamentos estivales semanales', 'Vela, paddle surf, kayak y juegos', 'Monitores titulados y ratio reducida', 'Experiencias de vida en el mar'],
                eu: ['Udako asteroko kanpamentuak', 'Bela, paddle surf, kayak eta jolasak', 'Monitore tituludunak eta talde txikiak', 'Itsasoko bizipen ahaztezinak']
            }
        },
        'entrenamientos-infantiles-continuos': {
            id: 'c-entrenamientos-infantiles-continuos',
            nombre_es: 'Entrenamientos infantiles continuos',
            nombre_eu: 'Haurrentzako entrenamendu jarraituak',
            descripcion_es: 'Grupos estables para niñas y niños que quieren aprender más, avanzar en técnica y disfrutar de la mar todo el año.',
            descripcion_eu: 'Gehiago ikasi, teknikan aurrera egin eta urte osoan itsasoaz gozatu nahi duten neska-mutilentzako talde egonkorrak.',
            precio: 85,
            duracion_h: 12,
            nivel: 'intermedio',
            imagen_url: '/images/courses/CursodeVelaLigera.webp',
            detalles: {
                es: ['Entrenamientos regulares escolares', 'Seguimiento pedagógico y técnico', 'Progresión en Optimist y flota ligera', 'Comunidad y deporte formativo'],
                eu: ['Eskola-urteko ohiko entrenamenduak', 'Jarraipen pedagogiko eta teknikoa', 'Garapena Optimist eta ontzi arinetan', 'Komunitatea eta heziketa-kirola']
            }
        },
        'entrenamientos-continuos-jovenes': {
            id: 'c-entrenamientos-continuos-jovenes',
            nombre_es: 'Entrenamientos continuos para jóvenes',
            nombre_eu: 'Gazteentzako entrenamendu jarraituak',
            descripcion_es: 'Grupos estables para jóvenes que buscan aprender y/o seguir creciendo en técnica, autonomía y trabajo en equipo.',
            descripcion_eu: 'Teknikan, autonomian eta talde-lanean ikasi edo hazten jarraitu nahi duten gazteentzako talde egonkorrak.',
            precio: 95,
            duracion_h: 12,
            nivel: 'avanzado',
            imagen_url: '/images/course-detail-header-sailing.webp',
            detalles: {
                es: ['Jóvenes de hasta 21 años', 'Perfeccionamiento técnico en flota', 'Autonomía y toma de decisiones', 'Navegación deportiva y regatas formativas'],
                eu: ['21 urtera arteko gazteak', 'Hobekuntza teknikoa flotan', 'Autonomia eta erabaki-hartzea', 'Kirol-nabigazioa eta heziketa-estropadak']
            }
        },
        'bautismos': {
            id: 'c-bautismos',
            nombre_es: 'Bautismos',
            nombre_eu: 'Bataioak',
            descripcion_es: 'Una primera experiencia en la mar, pensada para disfrutar sin presión y descubrir la navegación de manera sencilla y acompañada.',
            descripcion_eu: 'Itsasoko lehen esperientzia bat, presiorik gabe gozatzeko eta nabigazioa modu erraz eta gidatuan ezagutzeko pentsatua.',
            precio: 45,
            duracion_h: 2,
            nivel: 'iniciacion',
            imagen_url: '/images/ai/section2-calm-bay.webp',
            detalles: {
                es: ['Primer contacto suave y accesible', 'Sin necesidad de experiencia previa', 'Acompañamiento cercano por monitor', 'Vistas y sensaciones del Abra'],
                eu: ['Lehen kontaktu leun eta eskuragarria', 'Aurretiazko esperientziarik gabe', 'Monitorearen laguntza hurbila', 'Abrako bistak eta sentsazioak']
            }
        },
        'familia': {
            id: 'c-familia',
            nombre_es: 'Familia',
            nombre_eu: 'Familia',
            descripcion_es: 'Sesiones pensadas para compartir en familia, con ritmos tranquilos, dinámicas divertidas y navegación segura.',
            descripcion_eu: 'Familian partekatzeko pentsatutako saioak, erritmo lasaiekin, dinamika dibertigarriekin eta nabigazio seguruarekin.',
            precio: 160,
            duracion_h: 3,
            nivel: 'iniciacion',
            imagen_url: '/images/course-raquero-students.webp',
            detalles: {
                es: ['Actividad para todas las edades', 'Dinámicas adaptadas a niños y adultos', 'Barco en exclusiva con patrón', 'Recuerdos inolvidables juntos'],
                eu: ['Adin guztietarako jarduera', 'Haurrei eta helduei egokitutako dinamikak', 'Ontzi esklusiboa patroiarekin', 'Oroitzapen paregabeak elkarrekin']
            }
        },
        'cursos-personalizados': {
            id: 'c-cursos-personalizados',
            nombre_es: 'Cursos personalizados',
            nombre_eu: 'Neurrira egindako ikastaroak',
            descripcion_es: 'Formaciones a medida según objetivos, nivel y disponibilidad: desde técnica concreta hasta navegación por proyectos.',
            descripcion_eu: 'Helburuen, mailaren eta eskuragarritasunaren araberako prestakuntza pertsonalizatua: teknika zehatzetatik hasi eta proiektu bidezko nabigaziora arte.',
            precio: 0,
            duracion_h: 4,
            nivel: 'intermedio',
            imagen_url: '/images/ai/section2-action-sea.webp',
            detalles: {
                es: ['Formación 100% personalizada', 'Horarios y fechas a convenir', 'Objetivos técnicos o de travesía específicos', 'Atención individual o grupos cerrados'],
                eu: ['%100 prestakuntza pertsonalizatua', 'Ordutegiak eta datak adosteko', 'Helburu tekniko edo zeharkaldi zehatzak', 'Banakako arreta edo talde itxiak']
            }
        },
        'regata-corporativa': {
            id: 'c-regata-corporativa',
            nombre_es: 'Regata corporativa',
            nombre_eu: 'Enpresa estropada',
            descripcion_es: 'Experiencia para empresas y grupos: navegación, trabajo en equipo y convivencia en un entorno diferente y estimulante.',
            descripcion_eu: 'Enpresa eta taldeentzako esperientzia: nabigazioa, talde-lana eta elkarbizitza ingurune ezberdin eta susgarrirako batean.',
            precio: 0,
            duracion_h: 4,
            nivel: 'iniciacion',
            imagen_url: '/images/ai/section4-community.webp',
            detalles: {
                es: ['Team building y cohesión de equipos', 'Regata dinámica y participativa', 'Flota homogénea de veleros', 'Coordinación y briefing marinero'],
                eu: ['Team building eta talde kohesioa', 'Estropada dinamiko eta parte-hartzailea', 'Belaontzi flota homogeneoa', 'Koordinazioa eta itsas briefing-a']
            }
        },
        'windsurf-iniciacion-perfeccionamiento': {
            id: 'c-windsurf-iniciacion-perfeccionamiento',
            nombre_es: 'Windsurf: Iniciación y perfeccionamiento',
            nombre_eu: 'Windsurfa: Hastapena eta hobekuntza',
            descripcion_es: 'Aprendizaje progresivo para quien empieza desde cero o quiere avanzar en técnica. Trabajo de equilibrio, maniobras, lectura del viento y autonomía en la tabla.',
            descripcion_eu: 'Ikaskuntza progresiboa hutsetik hasten denarentzat edo teknikan aurrera egin nahi duenarentzat. Oreka, maniobrak, haizearen irakurketa eta ohol gaineko autonomia.',
            precio: 45,
            duracion_h: 10,
            nivel: 'iniciacion',
            imagen_url: '/images/experiences/windsurf-mooring.jpg',
            detalles: {
                es: ['1 sesión suelta (2,5h): 45 €', 'Bono 4 sesiones (10h): 150 € (37,5 €/salida)', 'Campus continuo (5 sesiones fijas 3h, 15h): 250 €', 'Tabla, vela, neopreno y chaleco incluidos'],
                eu: ['Saio 1 solte (2,5h): 45 €', '4 saioko bonua (10h): 150 € (37,5 €/saio)', 'Campus jarraitua (5 saio finko 3h, 15h): 250 €', 'Ohola, bela, neoprenoa eta salbagailua barne']
            }
        },
        'mantenimiento-embarcaciones': {
            id: 'c-mantenimiento-embarcaciones',
            nombre_es: 'Mantenimiento de embarcaciones',
            nombre_eu: 'Ontzien mantentzea',
            descripcion_es: 'Curso teórico-práctico de mantenimiento en general, enfocado principalmente a aprender a cuidar, revisar y mantener barcos de vela ligera y crucero.',
            descripcion_eu: 'Mantentze-lanei buruzko ikastaro teoriko-praktikoa oro har, batez ere bela arineko eta gurutzaontzietako ontziak zaintzen, berrikusten eta mantentzen ikastera bideratua.',
            precio: 100,
            duracion_h: 8,
            nivel: 'iniciacion',
            imagen_url: '/images/facilities-hero-desktop.webp',
            detalles: {
                es: ['8 horas totales (2 días · 4h/día) · 100 €', 'Casco, fibra, antifouling y gelcoat', 'Acastillaje, jarcia y cabuyería', 'Motor y electricidad básica'],
                eu: ['8 ordu guztira (2 egun · 4h/egun) · 100 €', 'Kaskoa, zuntza, antifouling-a eta gelcoata', 'Herdoil-kontrakoak, aparejua eta sokak', 'Oinarrizko motorra eta elektrizitatea']
            }
        },
        'costura-reparacion-velas': {
            id: 'c-costura-reparacion-velas',
            nombre_es: 'Costura y reparación de velas',
            nombre_eu: 'Belen jostura eta konponketa',
            descripcion_es: 'Taller especializado donde se aprende a coser, reparar y alargar la vida útil de velas y materiales textiles náuticos.',
            descripcion_eu: 'Belen eta itsas material ehungileen bizitza erabilgarria josten, konpontzen eta luzatzen ikasteko lantegi espezializatua.',
            precio: 90,
            duracion_h: 6,
            nivel: 'iniciacion',
            imagen_url: '/images/about-own-pontoon.webp',
            detalles: {
                es: ['Puntadas marineras y uso de máquina', 'Reparación de desgarros y refuerzos', 'Cuidado y mantenimiento de tejidos náuticos', 'Material y herramientas del velero'],
                eu: ['Itsas puntadak eta josteko makina', 'Urraturak konpontzea eta errefortzuak', 'Ehungintza nautikoaren zaintza', 'Belagilearen tresnak eta materialak']
            }
        }
    };

    const displayCourse = (course || fallbacks[slug]) as any;

    if (!displayCourse) {
        notFound();
    }

    const displayEditions = allRealEditions;

    const t = await getTranslations({ locale, namespace: 'courses' });
    const tData = await getTranslations({ locale, namespace: 'courses_data' });

    const hasTranslation = tData.has(`${slug}.name`);
    const name = hasTranslation
        ? tData(`${slug}.name`)
        : (locale === 'eu' && displayCourse.nombre_eu ? displayCourse.nombre_eu : displayCourse.nombre_es) || 'Course';

    const description = hasTranslation
        ? tData(`${slug}.description`)
        : (locale === 'eu' && displayCourse.descripcion_eu ? displayCourse.descripcion_eu : displayCourse.descripcion_es) || 'Course description...';

    const detailsRaw = hasTranslation ? tData.raw(`${slug}.details`) : null;
    const details = Array.isArray(detailsRaw)
        ? detailsRaw
        : (locale === 'es' ? displayCourse.detalles?.es : displayCourse.detalles?.eu) || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": name,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "Getxo Bela Eskola",
            "sameAs": "https://getxobelaeskola.cloud"
        },
        "image": displayCourse.imagen_url || 'https://getxobelaeskola.cloud/images/home-hero-sailing-action.webp',
        "offers": {
            "@type": "Offer",
            "price": displayCourse.precio,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <main className="min-h-screen bg-nautical-deep" suppressHydrationWarning>
            <JsonLd data={jsonLd} />
            <div className="fixed inset-0 bg-nautical-deep z-0" />

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="container mx-auto">
                    <Link href={`/${locale}/servicios/cursos`} className="text-sm uppercase tracking-[0.3em] text-accent mb-12 inline-block hover:pl-2 transition-all">
                        ← {t('back_to_catalog')}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Mobile: booking first (above-the-fold). Desktop: right column via order */}
                        <div className="space-y-12 lg:order-last">
                            <div className="relative h-[300px] md:h-[450px] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src={displayCourse.imagen_url || '/images/home-hero-sailing-action.webp'}
                                    alt={name}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="card-luxury p-10 bg-white/5 backdrop-blur-xl border border-white/10">
                                <h3 className="font-display text-4xl mb-6 text-sea-foam">{t('book_title')}</h3>
                                <BookingSelector
                                    editions={displayEditions}
                                    coursePrice={displayCourse.precio}
                                    courseId={displayCourse.id}
                                    activityType={slug.includes('campus') || slug.includes('udalekus') ? 'udalekus' : (slug.includes('vela-ligera') ? 'training' : 'course')}
                                    slug={slug}
                                />
                            </div>
                        </div>

                        <div className="space-y-12 lg:order-first">
                            <h1 className="text-6xl md:text-8xl font-display leading-tight">{name}</h1>
                            <div className="w-24 h-px bg-accent/30" />
                            <p className="text-xl font-light leading-relaxed text-foreground/80">
                                {description}
                            </p>

                            <div className="flex flex-wrap gap-10 text-xs uppercase tracking-widest font-bold text-sea-foam/50 border-t border-white/5 pt-10">
                                <div>
                                    <p className="text-accent mb-1">{t('duration')}</p>
                                    <p className="text-foreground">{displayCourse.duracion_h}h</p>
                                </div>
                                <div>
                                    <p className="text-accent mb-1">{t('level_label')}</p>
                                    <p className="text-foreground">{t(`levels.${displayCourse.nivel}`)}</p>
                                </div>
                                <div>
                                    <p className="text-accent mb-1">{t('investment_label')}</p>
                                    <p className="text-brass-gold text-lg">{displayCourse.precio}€</p>
                                </div>
                            </div>

                            {details.length > 0 && (
                                <div className="space-y-4 pt-12">
                                    <h4 className="text-xs uppercase tracking-widest font-bold text-accent">{t('learn_title')}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {details.map((detail: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-light text-foreground/70">
                                                <div className="w-1 h-1 bg-accent/40 rounded-full" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
