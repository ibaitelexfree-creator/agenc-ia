'use client';

import { HeroStatement } from './components/HeroStatement';
import { WaveBottom } from './components/WaveBottom';
import { AreasGrid } from './components/AreasGrid';
import { ValoresGrid } from './components/ValoresGrid';
import { TextoAcordeon } from './components/TextoAcordeon';
import { CTAFinal } from './components/CTAFinal';
import styles from './Voluntariado.module.css';

interface VoluntariadoProps {
  locale: string;
}

export default function Voluntariado({ locale }: VoluntariadoProps) {
  return (
    <div className={styles['vol-root']}>
      {/* ① Hero con ola */}
      <HeroStatement locale={locale} />
      <WaveBottom />
      
      {/* ② Qué puedes hacer */}
      <AreasGrid locale={locale} />
      
      {/* ③ Por qué vale la pena */}
      <ValoresGrid locale={locale} />
      
      {/* ④ Texto completo (acordeón) */}
      <TextoAcordeon locale={locale} />
      
      {/* ⑤ CTA con confetti */}
      <CTAFinal locale={locale} />
    </div>
  );
}
