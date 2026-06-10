import { Metadata } from 'next';
import JsonLd from '@/components/shared/JsonLd';
import dynamic from 'next/dynamic';
import { LandingPageClientV2 } from '@/components/home/LandingPageClientV2';

const NativeAppRedirect = dynamic(() => import('@/components/shared/NativeAppRedirect'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  let title = 'Inicio V2 | Getxo Bela Eskola';
  let description = 'Bienvenido a la versión vertical de Getxo Bela Eskola.';

  if (isEu) {
    title = 'Hasiera V2 | Getxo Bela Eskola';
  } else if (isEn) {
    title = 'Home V2 | Getxo Bela Eskola';
  } else if (isFr) {
    title = 'Accueil V2 | Getxo Bela Eskola';
  }

  return {
    title,
    description,
  };
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Getxo Bela Eskola V2",
    "image": "https://getxobelaeskola.cloud/images/home-hero-sailing-action.webp",
    "description": 'Escuela de vela en Getxo V2.',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Puerto Deportivo de Getxo",
      "addressLocality": "Getxo",
      "addressRegion": "Bizkaia",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.3441,
      "longitude": -3.0135
    },
    "url": "https://getxobelaeskola.cloud/home2",
    "telephone": "+34000000000"
  };

  return (
    <div className="w-full">
      <JsonLd data={jsonLd} />
      <NativeAppRedirect locale={locale} />
      <LandingPageClientV2 />

      {/* SEO Hidden H1 */}
      <h1 className="sr-only">
        {locale === 'eu' ? 'Getxo Bela Eskola V2 | Bela Eskola Getxon' :
          locale === 'en' ? 'Getxo Bela Eskola V2 | Sailing Lessons in Getxo' :
            locale === 'fr' ? 'Getxo Bela Eskola V2 | École de Voile à Getxo' :
              'Getxo Bela Eskola V2 | Escuela de Vela en Getxo'}
      </h1>
    </div>
  );
}
