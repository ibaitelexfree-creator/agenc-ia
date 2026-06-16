import { Metadata } from 'next';
import Udalekuak from '@/components/sections/Udalekuak';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Udalekuak — Campamentos de Vela | GetxoBelaEskola';
    let description = 'Semanas de verano y Semana Santa en Getxo. Campamentos de navegación, paddle surf, Big SUP y convivencia para niños desde 3 años.';

    if (isEu) {
        title = 'Udalekuak — Bela Kanpamentuak | GetxoBelaEskola';
        description = 'Uda eta Semana Santuko asteak Getxon. Nabigazio kanpamentuak, paddle surfa, Big SUPa eta talde-bizikidetza 3 urtetik aurrerako haurrentzat.';
    } else if (isEn) {
        title = 'Udalekuak — Sailing Camps | GetxoBelaEskola';
        description = 'Summer and Easter camps in Getxo. Sailing camps, paddle surfing, Big SUP, and teamwork activities for kids from 3 years old.';
    } else if (isFr) {
        title = 'Udalekuak — Camps de Voile | GetxoBelaEskola';
        description = "Camps d'été et de Pâques à Getxo. Camps de voile, paddle surf, Big SUP et activités de groupe pour les enfants à partir de 3 ans.";
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

export default function UdalekuakPage() {
    return (
        <main className="min-h-screen bg-[#F0F8FF] text-[#0A3D6B] selection:bg-[#F4A830] selection:text-[#0A3D6B]">
            <Udalekuak />
        </main>
    );
}
