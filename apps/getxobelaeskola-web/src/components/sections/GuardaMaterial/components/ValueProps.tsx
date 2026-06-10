// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\components\ValueProps.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../GuardaMaterial.module.css';

const cardVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }
  }
});

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: -6,
    transition: { type: 'spring' as const, stiffness: 300, damping: 18 }
  }
};

export default function ValueProps() {
  const t = useTranslations('guarda_material.value_props') as any;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-60px' });

  const valuePropsData = [
    {
      id: 'storage',
      emoji: '⚓',
      headline: t('storage_title'),
      body: t('storage_desc'),
      delay: 0.0
    },
    {
      id: 'access',
      emoji: '🔑',
      headline: t('access_title'),
      body: t('access_desc'),
      delay: 0.15
    },
    {
      id: 'facilities',
      emoji: '🏄‍♀️',
      headline: t('facilities_title'),
      body: t('facilities_desc'),
      delay: 0.30
    }
  ];

  return (
    <section ref={ref} className={styles.valueProps}>
      <motion.p
        className={styles.sectionEyebrow}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('eyebrow')}
      </motion.p>

      <div className={styles.valuePropsGrid}>
        {valuePropsData.map((prop) => (
          <motion.article
            key={prop.id}
            className={styles.valueCard}
            variants={cardVariants(prop.delay)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover="hover"
          >
            <motion.div
              className={styles.valueCardIcon}
              variants={iconVariants}
            >
              <span role="img" aria-hidden="true">{prop.emoji}</span>
            </motion.div>

            <h3 className={styles.valueCardHeadline}>{prop.headline}</h3>
            <p className={styles.valueCardBody}>{prop.body}</p>

            <motion.div
              className={styles.valueCardAccent}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
