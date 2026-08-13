// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\index.tsx
'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './CelebraTuDia.module.css';
import HeroSection from './components/HeroSection';
import FloatingCards from './components/FloatingCards';
import SailingBackground from './components/SailingBackground';
import InteractiveBigSUP from './components/InteractiveBigSUP';
import CateringCards from './components/CateringCards';
import ClosingBalloons from './components/ClosingBalloons';

import ScenaPanoramica from './components/ScenaPanoramica';
const HorizontalTimeline = dynamic(() => import('./components/HorizontalTimeline'), { ssr: false });
const ChillOutSection = dynamic(() => import('./components/ChillOutSection'), { ssr: false });

export default function CelebraTuDia() {
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      {/* Fase 1: Hero */}
      <HeroSection onCtaClick={scrollToContact} />

      {/* Fase 2: Escena Panorámica */}
      <ScenaPanoramica />

      {/* Fase 3: Cards Flotantes */}
      <FloatingCards />

      {/* Fase 6: Velero cruzando */}
      <SailingBackground />

      {/* Fase 4: Timeline */}
      <HorizontalTimeline />

      {/* Fase 5: Big SUP interactivo */}
      <InteractiveBigSUP onBookClick={scrollToContact} />

      {/* Fase 7: Zona Chill Out */}
      <ChillOutSection />

      {/* Fase 8: Catering Cards */}
      <CateringCards onInquireClick={scrollToContact} />

      {/* Fase 9: CTA Final & Globos */}
      <div ref={footerRef}>
        <ClosingBalloons />
      </div>
    </div>
  );
}
