'use client';

import { motion } from 'framer-motion';
import { ValorCard } from './ValorCard';
import { voluntariadoValores, voluntariadoTranslations } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface ValoresGridProps {
  locale: string;
}

export function ValoresGrid({ locale }: ValoresGridProps) {
  const valores = voluntariadoValores[locale] || voluntariadoValores.es;
  const t = voluntariadoTranslations[locale] || voluntariadoTranslations.es;

  return (
    <div className={styles['valores-container']}>
      <motion.h3
        className={styles['section-title']}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        {t.valoresTitle}
      </motion.h3>

      <div className={styles['valores-grid']}>
        {valores.map((valor, i) => (
          <ValorCard key={i} valor={valor} index={i} />
        ))}
      </div>
    </div>
  );
}
