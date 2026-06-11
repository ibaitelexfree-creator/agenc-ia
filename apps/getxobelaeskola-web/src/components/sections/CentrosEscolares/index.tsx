'use client';

// index.tsx
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import CentrosHero from './components/CentrosHero';
const ComoFunciona = dynamic(() => import('./components/ComoFunciona'), { ssr: false });
import ActividadesCards from './components/ActividadesCards';
import PreciosBloque from './components/PreciosBloque';
import CtaSection from './components/CtaSection';
import WaveDivider from './components/WaveDivider';

export default function CentrosEscolaresSection() {
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const scrollToMoreInfo = () => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReserveEmail = () => {
    const email = "info@getxobelaeskola.com";
    const subject = encodeURIComponent("Reserva Jornada Escolar - Getxo Bela Eskola");
    const body = encodeURIComponent(
      "¡Hola!\n\nNos gustaría solicitar información o reservar una jornada de vela escolar para nuestro centro.\n\n" +
      "- Nombre del centro educativo:\n" +
      "- Número aproximado de alumnos:\n" +
      "- Curso o rango de edad:\n" +
      "- Fechas tentativas o de interés:\n" +
      "- Teléfono y persona de contacto:\n\n" +
      "¡Muchas gracias!"
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <CentrosHero 
        onLearnMoreClick={scrollToMoreInfo} 
        onReserveClick={handleReserveEmail} 
      />

      {/* Wave transition from Hero (White) to Como Funciona (Off-white) */}
      <WaveDivider fillColor="var(--color-offwhite)" />

      {/* Section target anchor for 'Saber más' scroll */}
      <div ref={scrollTargetRef} id="descubre-centros">
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
      <CtaSection onReserveClick={handleReserveEmail} />
    </div>
  );
}
