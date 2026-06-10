// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\index.tsx
'use client';

import HeroSection from './components/HeroSection';
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
