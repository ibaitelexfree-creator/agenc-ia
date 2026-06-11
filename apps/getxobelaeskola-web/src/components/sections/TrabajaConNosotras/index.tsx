'use client';

import HeroTrabaja from "./components/HeroTrabaja";
import MantraStripe from "./components/MantraStripe";
import Beneficios from "./components/Beneficios";
import Perfiles from "./components/Perfiles";
import FormularioCV from "./components/FormularioCV";
import CTACierre from "./components/CTACierre";
import styles from "./TrabajaConNosotras.module.css";

interface TrabajaConNosotrasProps {
  locale: string;
}

export default function TrabajaConNosotras({ locale }: TrabajaConNosotrasProps) {
  return (
    <div id="trabaja-con-nosotras" className={styles['tcn-root']}>
      <HeroTrabaja locale={locale} />
      <MantraStripe locale={locale} />
      <Beneficios locale={locale} />
      <Perfiles locale={locale} />
      <FormularioCV locale={locale} />
      <CTACierre locale={locale} />
    </div>
  );
}
