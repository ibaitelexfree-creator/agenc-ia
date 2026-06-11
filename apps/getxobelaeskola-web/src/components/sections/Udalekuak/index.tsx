// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\index.tsx
'use client';

import { useRef, useEffect } from 'react';
import styles from './Udalekuak.module.css';
import UdalekuakHero from './components/UdalekuakHero';
import UdalekuakIntro from './components/UdalekuakIntro';
import UdalekuakFeatureCards from './components/UdalekuakFeatureCards';
import UdalekuakTimeline from './components/UdalekuakTimeline';
import UdalekuakDetails from './components/UdalekuakDetails';
import UdalekuakCTA from './components/UdalekuakCTA';

export default function Udalekuak() {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const scrollToRegistration = () => {
    const section = document.getElementById('inscripcion');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Fase 2: Hero */}
      <UdalekuakHero onCtaClick={scrollToRegistration} />

      {/* Fase 3: Intro */}
      <UdalekuakIntro />

      {/* Fase 4: Feature Cards */}
      <UdalekuakFeatureCards />

      {/* Fase 5: Timeline */}
      <UdalekuakTimeline />

      {/* Fase 6: Details */}
      <UdalekuakDetails />

      {/* Fase 7: CTA Final */}
      <div ref={ctaRef}>
        <UdalekuakCTA />
      </div>
    </div>
  );
}
