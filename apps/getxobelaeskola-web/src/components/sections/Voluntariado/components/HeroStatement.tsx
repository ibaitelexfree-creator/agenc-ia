'use client';

import { motion } from 'framer-motion';
import { voluntariadoTranslations } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface HeroStatementProps {
  locale: string;
}

export function HeroStatement({ locale }: HeroStatementProps) {
  const t = voluntariadoTranslations[locale] || voluntariadoTranslations.es;
  const words = t.heroTitleWords;

  return (
    <div className={styles['hero-vol']}>
      {/* Label flotante */}
      <motion.span 
        className={styles['vol-label']}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {t.heroLabel}
      </motion.span>

      {/* Título palabra a palabra */}
      <h2 className={styles['vol-hero-title']}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={styles['word-wrap']}
            initial={{ opacity: 0, y: 40, rotateX: -95 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              delay: 0.1 + i * 0.08,
              type: "spring",
              stiffness: 180,
              damping: 18
            }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </h2>

      {/* Línea divisora animada */}
      <motion.div
        className={styles['vol-divider']}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      />

      {/* Subtítulo */}
      <motion.p
        className={styles['vol-subtitle']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        {t.heroSubtitle}
      </motion.p>
    </div>
  );
}
