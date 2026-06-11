// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakFeatureCards.tsx
'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function UdalekuakFeatureCards() {
  const t = useTranslations('udalekuak.features') as any;
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      id: 'nav',
      emoji: '⛵',
      color: '#5BB8D4',
      bgHover: '#EBF7FC',
      title: t('nav_title'),
      text: t('nav_desc')
    },
    {
      id: 'water',
      emoji: '🏄',
      color: '#2D7A4F',
      bgHover: '#EAF4EE',
      title: t('water_title'),
      text: t('water_desc')
    },
    {
      id: 'team',
      emoji: '👥',
      color: '#0A3D6B',
      bgHover: '#E8EFF6',
      title: t('team_title'),
      text: t('team_desc')
    },
    {
      id: 'friday',
      emoji: '🎉',
      color: '#F4A830',
      bgHover: '#FEF6E4',
      title: t('friday_title'),
      text: t('friday_desc')
    }
  ];

  return (
    <section className={styles.featuresSection}>
      {/* SECTION HEADER */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={styles.sectionHeader}
      >
        <p className={styles.sectionEyebrow}>{t('eyebrow')}</p>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>
      </motion.div>

      {/* CARDS GRID */}
      <motion.div
        className={styles.featuresGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feat) => (
          <motion.div
            key={feat.id}
            variants={cardVariants}
            whileHover={prefersReducedMotion ? {} : {
              y: -10,
              boxShadow: '0 20px 45px rgba(10, 61, 107, 0.12)',
              backgroundColor: feat.bgHover
            }}
            className={styles.featureCard}
          >
            {/* Emoji */}
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.2, rotate: [-4, 4, -4, 0] }}
              transition={{ duration: 0.4 }}
              className={styles.featureEmoji}
            >
              {feat.emoji}
            </motion.div>

            {/* Accent Line */}
            <div
              className={styles.featureLine}
              style={{ backgroundColor: feat.color }}
            />

            {/* Title */}
            <h3 className={styles.featureTitle}>
              {feat.title}
            </h3>

            {/* Body Text */}
            <p className={styles.featureText}>
              {feat.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
