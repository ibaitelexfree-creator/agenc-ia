import React from 'react';
import { Metadata } from 'next';
import RegatasSection from '@/components/sections/Regatas';
import { getSeoAlternates } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    const title = isEu
        ? 'Estropadak eta Entrenamendu Taldeak | Getxo Bela Eskola'
        : isEn
        ? 'Regattas & Training Teams | Getxo Bela Eskola'
        : isFr
        ? 'Régates et Équipes d’Entraînement | Getxo Bela Eskola'
        : 'Regatas y Equipos de Entrenamiento | Getxo Bela Eskola';

    const description = isEu
        ? 'Getxo Bela Eskolako estropadak eta entrenamendu taldeak: Haurrak, Gazteak eta Helduak. Nabigatzen hazi, talde-lana eta itsasoaz gozatu.'
        : isEn
        ? 'Getxo Bela Eskola regattas and training teams: Youth, Juniors, and Adults. Grow sailing together with passion and teamwork.'
        : isFr
        ? 'Régates et équipes d’entraînement de Getxo Bela Eskola : Enfants, Jeunes et Adultes. Progressez en navigation dans un esprit d’équipe.'
        : 'Equipos de entrenamiento y regatas de Getxo Bela Eskola: Infantil, Jóvenes y Adultas. Aprende a competir y disfrutar del mar en equipo.';

    return {
        title,
        description,
        alternates: getSeoAlternates('club/regatas', locale),
        openGraph: {
            title,
            description,
            images: ['/images/equipos_thumb.webp']
        }
    };
}

export function generateStaticParams() {
    return ['es', 'eu', 'en', 'fr'].map(locale => ({ locale }));
}

export default function ClubRegatasPage() {
    return (
        <main className="min-h-screen bg-white">
            <RegatasSection />
        </main>
    );
}



