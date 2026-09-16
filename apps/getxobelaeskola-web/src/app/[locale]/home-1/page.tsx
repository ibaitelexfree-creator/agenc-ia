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

  let title = 'Home 1 (Versión Anterior) | Getxo Bela Eskola';
  const description = 'Versión anterior de Getxo Bela Eskola con ScrollEngineV2.';

  if (isEu) {
    title = 'Hasiera 1 (Aurreko Bertsioa) | Getxo Bela Eskola';
  } else if (isEn) {
    title = 'Home 1 (Previous Version) | Getxo Bela Eskola';
  } else if (isFr) {
    title = 'Accueil 1 (Version Précédente) | Getxo Bela Eskola';
  }

  return {
    title,
    description,
    alternates: getSeoAlternates('home-1', locale),
  };
}

export default async function Home1Page({ params: { locale } }: { params: { locale: string } }) {
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

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ];
}

