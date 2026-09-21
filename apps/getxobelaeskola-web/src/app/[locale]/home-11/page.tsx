import { Metadata } from 'next';
import JsonLd from '@/components/shared/JsonLd';
import dynamic from 'next/dynamic';
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout';
import { getSeoAlternates } from '@/lib/seo';

const NativeAppRedirect = dynamic(() => import('@/components/shared/NativeAppRedirect'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'Home 11 - Prototipo Pergamino Cilíndrico 3D | Getxo Bela Eskola',
    description: 'Prototipo Home 11 con pergamino náutico superior e inferior estrecho y efecto de enrollado cilíndrico 3D.',
    alternates: getSeoAlternates('home-11', locale),
  };
}

export default async function Home11Page({ params: { locale } }: { params: { locale: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Getxo Bela Eskola - Home 11",
    "image": "https://getxobelaeskola.cloud/images/home-hero-sailing-action.webp",
    "description": "Escuela de vela en Getxo. Prototipo Home 11 con pergamino interactivo.",
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
    "url": "https://getxobelaeskola.cloud/home-11"
  };

  return (
    <div className="w-full">
      <JsonLd data={jsonLd} />
      <NativeAppRedirect locale={locale} />
      <HomePrototypeLayout variant="home-11" waveVariant="animated-organic" blobsElevated={7} />

      {/* SEO Hidden H1 */}
      <h1 className="sr-only">
        Getxo Bela Eskola | Prototipo Home 11
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
