import { Metadata } from 'next';
import CelebraTuDia from '@/components/sections/CelebraTuDia';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Celebra aquí tu día | Cumpleaños y Eventos';
    let description = 'Celebra cumpleaños, eventos privados y despedidas en la bahía de Getxo con veleros, Big SUP y catering en nuestro Chill Out.';

    if (isEu) {
        title = 'Ospatu hemen zure eguna | Urtebetetzeak eta Ekitaldiak';
        description = 'Ospatu urtebetetzeak, ekitaldi pribatuak eta agurrak Getxoko badian belaontziekin, Big SUParekin eta cateringarekin gure Chill Out-ean.';
    } else if (isEn) {
        title = 'Celebrate your day here | Birthdays & Events';
        description = 'Celebrate birthdays, private events, and parties in the Getxo bay with sailing boats, Big SUP, and catering in our Chill Out zone.';
    } else if (isFr) {
        title = 'Célébrez votre journée ici | Anniversaires & Événements';
        description = 'Célébrez vos anniversaires, événements privés et fêtes dans la baie de Getxo avec des voiliers, du Big SUP et un traiteur dans notre espace Chill Out.';
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ['/images/LogoGetxoBelaEskola.webp']
        }
    };
}

export default function CumpleanosPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#0D2B45] selection:bg-[#EF6351] selection:text-white">
            <CelebraTuDia />
        </main>
    );
}
