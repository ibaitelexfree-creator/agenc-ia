// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakDetails.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

export default function UdalekuakDetails() {
  const t = useTranslations('udalekuak.details') as any;
  const prefersReducedMotion = useReducedMotion();

  const details = [
    { icon: '🎂', value: t('card1_val'), label: t('card1_lbl') },
    { icon: '👥', value: t('card2_val'), label: t('card2_lbl') },
    { icon: '📅', value: t('card3_val'), label: t('card3_lbl') },
    { icon: '📍', value: t('card4_val'), label: t('card4_lbl') }
  ];

  return (
    <section className={styles.detailsSection}>
      <div className={styles.detailsContent}>
        
        {/* HEADER */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className={styles.sectionHeader}
        >
          <p className={styles.detailLabel} style={{ textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
            {t('eyebrow')}
          </p>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--color-ocean)' }}>
            {t('title')}
          </h2>
        </motion.div>

        {/* DETAILS GRID */}
        <div className={styles.detailsGrid}>
          {details.map((det, i) => (
            <motion.div
              key={det.label}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
              className={styles.detailCard}
            >
              <div className={styles.detailIcon}>{det.icon}</div>
              <div className={styles.detailValue}>{det.value}</div>
              <div className={styles.detailLabel}>{det.label}</div>
            </motion.div>
          ))}
        </div>

        {/* DETAILS GLASSMORPHISM BODY */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.detailsTextBlock}
        >
          <p className={styles.detailsTextMain}>
            {t('body1')}
          </p>
          <p className={styles.detailsTextSub}>
            {t('body2')}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
