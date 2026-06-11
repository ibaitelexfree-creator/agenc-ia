import { Metadata } from 'next';
import Voluntariado from '@/components/sections/Voluntariado';

interface PageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Hazte Voluntaria — Participa y Colabora | GetxoBelaEskola';
    let description = 'Únete a nuestro equipo de voluntariado en eventos deportivos, regatas adaptadas y campañas medioambientales. Vive la mar con Getxo Bela Eskola.';

    if (isEu) {
        title = 'Egin zaitez Boluntario — Parte Hartu eta Lagundu | GetxoBelaEskola';
        description = 'Batu zaitez gure boluntariotza taldera kirol ekitaldietan, estropada egokituetan eta itsasadarra babesteko ingurumen-kanpainetan.';
    } else if (isEn) {
        title = 'Become a Volunteer — Get Involved and Collaborate | GetxoBelaEskola';
        description = 'Join our volunteer team in sporting events, adapted regattas, and environmental campaigns. Experience the sea with Getxo Bela Eskola.';
    } else if (isFr) {
        title = 'Devenir Bénévole — Participez et Collaborez | GetxoBelaEskola';
        description = 'Rejoignez notre équipe de bénévoles lors d\'événements sportifs, de régates adaptées et de campagnes environnementales. Vivez la mer.';
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

export default function VoluntariaPage({ params: { locale } }: PageProps) {
    return (
        <main className="min-h-screen pt-20 bg-white selection:bg-[var(--color-sea,#0066CC)] selection:text-white">
            <Voluntariado locale={locale} />
        </main>
    );
}
