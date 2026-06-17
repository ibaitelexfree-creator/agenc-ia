import { Metadata } from 'next';
import JsonLd from '@/components/shared/JsonLd';
import dynamic from 'next/dynamic';
import { LandingPageClientV2 } from '@/components/home/LandingPageClientV2';

import { getSeoAlternates } from '@/lib/seo';

const NativeAppRedirect = dynamic(() => import('@/components/shared/NativeAppRedirect'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  let title = 'Inicio | Getxo Bela Eskola';
  let description = 'Bienvenido a Getxo Bela Eskola. Aprende a navegar, alquila material y vive experiencias náuticas inolvidables en el Puerto de Getxo.';

  if (isEu) {
    title = 'Hasiera | Getxo Bela Eskola';
    description = 'Ongi etorri Getxo Bela Eskolara. Ikasi nabigatzen, alokatu materiala eta bizi itsas esperientzia ahaztezinak Getxon.';
  } else if (isEn) {
    title = 'Home | Getxo Getxo Bela Eskola';
    description = 'Welcome to Getxo Getxo Bela Eskola. Learn to sail, rent equipment and live unforgettable nautical experiences in Getxo Marina.';
  } else if (isFr) {
    title = 'Accueil | Getxo Getxo Bela Eskola';
    description = 'Bienvenue à Getxo Getxo Bela Eskola. Apprenez la voile, louez du matériel et vivez des expériences nautiques inoubliables à Getxo.';
  }

  return {
    title,
    description,
    alternates: getSeoAlternates('', locale),
  };
}

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Getxo Bela Eskola",
    "image": "https://getxobelaeskola.cloud/images/home-hero-sailing-action.webp",
    "description": locale === 'eu' ? 'Bela eskola Getxon. Ikasi nabigatzen.' : 'Escuela de vela en Getxo. Aprende a navegar.',
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
    "url": "https://getxobelaeskola.cloud",
    "telephone": "+34000000000",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "184"
    }
  };

  return (
    <div className="w-full">
      <JsonLd data={jsonLd} />
      <NativeAppRedirect locale={locale} />
      <LandingPageClientV2 />

      {/* SEO Hidden H1 */}
      <h1 className="sr-only">
        {locale === 'eu' ? 'Getxo Bela Eskola | Bela Eskola Getxon' :
          locale === 'en' ? 'Getxo Getxo Bela Eskola | Sailing Lessons in Getxo' :
            locale === 'fr' ? 'Getxo Getxo Bela Eskola | École de Voile à Getxo' :
              'Getxo Bela Eskola | Escuela de Vela en Getxo'}
      </h1>
    </div>
  );
}
