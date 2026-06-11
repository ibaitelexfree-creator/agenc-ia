'use client';

import { motion } from 'framer-motion';
import { AreaCard } from './AreaCard';
import { voluntariadoAreas, voluntariadoTranslations } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface AreasGridProps {
  locale: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export function AreasGrid({ locale }: AreasGridProps) {
  const areas = voluntariadoAreas[locale] || voluntariadoAreas.es;
  const t = voluntariadoTranslations[locale] || voluntariadoTranslations.es;

  return (
    <div className={styles['areas-section']}>
      <motion.h3
        className={styles['section-title']}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        {t.areasTitle}
      </motion.h3>

      <motion.div
        className={styles['areas-grid']}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {areas.map((area, i) => (
          <AreaCard key={area.id} area={area} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
