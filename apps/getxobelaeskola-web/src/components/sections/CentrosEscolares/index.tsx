'use client';

// index.tsx
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import CentrosHero from './components/CentrosHero';
import ComoFunciona from './components/ComoFunciona';
import ActividadesCards from './components/ActividadesCards';
import PreciosBloque from './components/PreciosBloque';
import CtaSection from './components/CtaSection';
import WaveDivider from './components/WaveDivider';

export default function CentrosEscolaresSection() {
  const router = useRouter();
  const locale = useLocale();

  const handleReserveClick = () => {
    router.push(`/${locale}/contacto/localizacion`);
  };

  return (
    <div>
      {/* Hero Section */}
      <CentrosHero 
        onReserveClick={handleReserveClick} 
      />

      {/* Wave transition from Hero (White) to Como Funciona (Off-white) */}
      <WaveDivider fillColor="var(--color-offwhite)" />

      {/* Section target anchor for 'Saber más' scroll */}
      <div id="descubre-centros">
        {/* Como Funciona Section */}
        <ComoFunciona />
      </div>

      {/* Wave transition from Como Funciona (Off-white) to Actividades (White) */}
      <WaveDivider fillColor="var(--color-offwhite)" inverse={true} />

      {/* Actividades Section */}
      <ActividadesCards />

      {/* Wave transition from Actividades (White) to Precios (Off-white) */}
      <WaveDivider fillColor="var(--color-offwhite)" />

      {/* Precios Section */}
      <PreciosBloque />

      {/* Wave transition from Precios (Off-white) to CTA (White) */}
      <WaveDivider fillColor="var(--color-offwhite)" inverse={true} />

      {/* CTA Section */}
      <CtaSection onReserveClick={handleReserveClick} />
    </div>
  );
}
