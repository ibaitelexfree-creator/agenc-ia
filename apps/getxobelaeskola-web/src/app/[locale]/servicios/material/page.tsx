import { Metadata } from 'next';
import GuardaMaterial from '@/components/sections/GuardaMaterial';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Guarda tu material deportivo';
    let description = 'Información sobre tarifas y pañol para guardar tablas de windsurf, kayaks, velas y otros equipos náuticos en Getxo.';

    if (isEu) {
        title = 'Gorde zure kirol materiala';
        description = 'Getxoko windsurf taulak, kayakak, belak eta bestelako itsas kirol materiala gordetzeko tarifei eta lekuei buruzko informazioa.';
    } else if (isEn) {
        title = 'Store your sports equipment';
        description = 'Information about prices and storage facilities for windsurf boards, kayaks, sails and other nautical equipment in Getxo.';
    } else if (isFr) {
        title = 'Stockez votre matériel de sport';
        description = 'Informations sur les tarifs et les espaces de stockage pour planches de windsurf, kayaks, voiles et autres équipements nautiques à Getxo.';
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ['/images/ai/hero-deck-getxo.webp']
        }
    };
}

export default function GuardaMaterialPage() {
    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            <GuardaMaterial />
        </main>
    );
}

