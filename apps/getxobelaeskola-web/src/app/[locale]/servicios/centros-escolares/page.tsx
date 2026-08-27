import { Metadata } from 'next';
import CentrosEscolaresSection from '@/components/sections/CentrosEscolares';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Centros Escolares y Asociaciones — Actividades Náuticas | GetxoBelaEskola';
    let description = 'Programas adaptados de vela, Big SUP y talleres medioambientales para colegios, institutos y asociaciones civiles. Un acercamiento seguro y formativo a la mar.';

    if (isEu) {
        title = 'Ikastetxeak eta Elkarteak — Itsas Jarduerak | GetxoBelaEskola';
        description = 'Bela, Big SUP eta ingurumen tailerretako programa egokituak ikastetxe, institutu eta elkarte zibilentzat. Itsasorako hurbilketa seguru eta hezigarria.';
    } else if (isEn) {
        title = 'Schools and Associations — Nautical Activities | GetxoBelaEskola';
        description = 'Adapted sailing, Big SUP, and environmental workshops for schools, high schools, and civil associations. A safe and educational experience at sea.';
    } else if (isFr) {
        title = 'Écoles et Associations — Activités Nautiques | GetxoBelaEskola';
        description = 'Programmes adaptés de voile, Big SUP et ateliers environnementaux pour les écoles, collèges et associations civiles. Une approche sûre et éducative de la mer.';
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ['/images/course-piragua-competition-double.jpg']
        }
    };
}

export default function CentrosEscolaresPage() {
    return (
        <main className="min-h-[100dvh] w-full selection:bg-[var(--nautical-blue)] selection:text-white pt-20">
            <CentrosEscolaresSection />
        </main>
    );
}
