import { Metadata } from 'next';
import TrabajaConNosotras from '@/components/sections/TrabajaConNosotras';

interface PageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Trabaja con Nosotras — Ofertas de Empleo | GetxoBelaEskola';
    let description = 'Únete al equipo de la escuela de vela de Getxo. Buscamos instructoras de vela, personal de mantenimiento y coordinadoras de tierra.';

    if (isEu) {
        title = 'Lan egin gurekin — Enplegu Eskaintzak | GetxoBelaEskola';
        description = 'Batu zaitez Getxoko bela eskolako lan-taldera. Bela monitoreak, mantenu teknikariak eta lurreko koordinatzaileak bilatzen ditugu.';
    } else if (isEn) {
        title = 'Work with Us — Career Opportunities | GetxoBelaEskola';
        description = 'Join the team at the Getxo sailing school. We are looking for sailing instructors, maintenance staff, and land coordinators.';
    } else if (isFr) {
        title = 'Travailler avec Nous — Offres d\'Emploi | GetxoBelaEskola';
        description = 'Rejoignez l\'équipe de l\'école de voile de Getxo. Nous recherchons des monitrices de voile, du personnel de maintenance et des coordinatrices de terre.';
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

export default function TrabajaNosotrasPage({ params: { locale } }: PageProps) {
    return (
        <main className="min-h-screen pt-20 bg-white selection:bg-[var(--color-ocean,#0A3D5C)] selection:text-white">
            <TrabajaConNosotras locale={locale} />
        </main>
    );
}
