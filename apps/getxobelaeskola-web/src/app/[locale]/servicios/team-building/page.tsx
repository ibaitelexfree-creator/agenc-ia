import { Metadata } from 'next';
import TeamBuilding from '@/components/sections/TeamBuilding';

interface PageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Team Building & Regata Corporativa | GetxoBelaEskola';
    let description = 'Actividades corporativas de liderazgo, cohesión y team building a bordo de nuestra flota de veleros J80 en Getxo. Descubre el poder del mar.';

    if (isEu) {
        title = 'Team Building eta Enpresa Estropadak | GetxoBelaEskola';
        description = 'Lidergoa, talde-lana eta enpresa motibazioko jarduerak Getxon gure J80 belaontzi tripulazioekin. Ezagutu itsasoaren indarra.';
    } else if (isEn) {
        title = 'Team Building & Corporate Regattas | GetxoBelaEskola';
        description = 'Leadership, cohesion, and corporate team building activities on board our J80 sailing fleet in Getxo. Experience the ocean.';
    } else if (isFr) {
        title = 'Team Building & Régates d\'Entreprise | GetxoBelaEskola';
        description = 'Activités de leadership, cohésion et team building d\'entreprise à bord de nos voiliers J80 à Getxo. Découvrez la mer.';
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ['/images/home-hero-sailing-action.webp']
        }
    };
}

export default function TeamBuildingPage() {
    return (
        <main className="min-h-screen pt-20 bg-white selection:bg-[#005F8A] selection:text-white">
            <TeamBuilding />
        </main>
    );
}
