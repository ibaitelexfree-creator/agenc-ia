// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\index.tsx
'use client';

import dynamic from 'next/dynamic';
const HeroSection = dynamic(() => import('./components/HeroSection'), { ssr: false });
import ValueProps from './components/ValueProps';
import MaterialCarousel from './components/MaterialCarousel';
import PricingCard from './components/PricingCard';
import ClosingCTA from './components/ClosingCTA';
import styles from './GuardaMaterial.module.css';

export default function GuardaMaterial() {
  return (
    <div id="guarda-material" className={styles.container} aria-label="Guarda tu material deportivo">
      <HeroSection />
      <ValueProps />
      <MaterialCarousel />
      <PricingCard />
      <ClosingCTA />
    </div>
  );
}
