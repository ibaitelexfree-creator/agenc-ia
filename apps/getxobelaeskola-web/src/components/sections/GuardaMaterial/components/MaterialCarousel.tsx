// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\components\MaterialCarousel.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../GuardaMaterial.module.css';

export default function MaterialCarousel() {
  const t = useTranslations('guarda_material.carousel') as any;
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  const materialItems = [
    {
      id: 'vela-ligera',
      title: t('vela_title'),
      description: t('vela_desc'),
      emoji: '⛵',
      bgColor: '#E8F4F8',
      accentColor: '#1A7EA8'
    },
    {
      id: 'windsurf',
      title: t('windsurf_title'),
      description: t('windsurf_desc'),
      emoji: '💨',
      bgColor: '#F5EDD6',
      accentColor: '#C85A2A'
    },
    {
      id: 'piragua',
      title: t('piragua_title'),
      description: t('piragua_desc'),
      emoji: '🛶',
      bgColor: '#E8F4F8',
      accentColor: '#2C4A3E'
    }
  ];

  return (
    <section ref={ref} className={styles.materialCarousel}>
      <motion.p
        className={styles.sectionEyebrow}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {t('eyebrow')}
      </motion.p>

      <motion.h2
        className={styles.carouselTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {t('title')}
      </motion.h2>

      <motion.div
        className={styles.carouselTabs}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {materialItems.map((item, i) => (
          <button
            key={item.id}
            className={`${styles.carouselTab} ${i === activeIdx ? styles.isActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <span aria-hidden="true">{item.emoji}</span>
            {item.title}

            {i === activeIdx && (
              <motion.span
                className={styles.carouselTabIndicator}
                layoutId="tab-indicator"
                transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      <div className={styles.carouselPanelWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className={styles.carouselPanel}
            style={{ backgroundColor: materialItems[activeIdx].bgColor }}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <motion.div
              className={styles.carouselEmoji}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' as const, stiffness: 260, damping: 18, delay: 0.1 }}
            >
              {materialItems[activeIdx].emoji}
            </motion.div>

            <motion.h3
              className={styles.carouselPanelTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              style={{ color: materialItems[activeIdx].accentColor }}
            >
              {materialItems[activeIdx].title}
            </motion.h3>

            <motion.p
              className={styles.carouselPanelBody}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
            >
              {materialItems[activeIdx].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
