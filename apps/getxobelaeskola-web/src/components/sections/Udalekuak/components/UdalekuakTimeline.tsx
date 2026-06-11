// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakTimeline.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

export default function UdalekuakTimeline() {
  const t = useTranslations('udalekuak.timeline') as any;
  const prefersReducedMotion = useReducedMotion();

  const timeline = [
    {
      id: 'semana-santa',
      label: t('ss_label'),
      sublabel: t('ss_sub'),
      color: '#F4A830'
    },
    {
      id: 'junio',
      label: t('jun_label'),
      sublabel: t('jun_sub'),
      color: '#5BB8D4'
    },
    {
      id: 'julio',
      label: t('jul_label'),
      sublabel: t('jul_sub'),
      color: '#5BB8D4'
    },
    {
      id: 'agosto',
      label: t('ago_label'),
      sublabel: t('ago_sub'),
      color: '#5BB8D4'
    },
    {
      id: 'septiembre',
      label: t('sep_label'),
      sublabel: t('sep_sub'),
      color: '#F4A830'
    }
  ];

  return (
    <section className={styles.timelineSection}>
      {/* SECTION HEADER */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`${styles.sectionHeader} ${styles.timelineTitle}`}
      >
        <p className={styles.sectionEyebrow} style={{ color: '#F4A830' }}>
          {t('eyebrow')}
        </p>
        <h2 className={styles.sectionTitle} style={{ color: '#FFFFFF' }}>
          {t('title')}
        </h2>
      </motion.div>

      {/* HORIZONTAL TIMELINE */}
      <div className={styles.timelineWrapper}>
        {/* Timeline Progress Line (scales from left) */}
        <motion.div
          initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={styles.timelineLineBg}
        />

        {/* Nodes */}
        <div className={styles.timelineNodes}>
          {timeline.map((item, index) => (
            <motion.div
              key={item.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={styles.timelineNode}
            >
              {/* Dot indicator */}
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.35 }}
                className={styles.timelineDot}
                style={{ backgroundColor: item.color }}
              />

              {/* Month label */}
              <span className={styles.timelineLabel}>
                {item.label}
              </span>

              {/* Subtitle notes */}
              <span className={styles.timelineSublabel}>
                {item.sublabel}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TIMELINE ACCENT FOOTER */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={styles.timelineNote}
      >
        {t('note')}
      </motion.p>
    </section>
  );
}
