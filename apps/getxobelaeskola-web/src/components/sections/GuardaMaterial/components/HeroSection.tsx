// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\components\HeroSection.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../GuardaMaterial.module.css';

const VARIANTS: Record<string, Variants> = {
  eyebrow: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  },
  titleContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  },
  titleLine: {
    hidden: { opacity: 0, y: '100%', skewY: 4 },
    visible: {
      opacity: 1,
      y: '0%',
      skewY: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  },
  divider: {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  },
  subtitle: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] as const }
    }
  }
};

export default function HeroSection() {
  const t = useTranslations('guarda_material.hero') as any;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start start', 'end start']
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const titleLines = [
    t('title_line1'),
    t('title_line2'),
    t('title_line3')
  ];

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      aria-label="Guarda tu material deportivo"
    >
      <motion.div
        className={styles.heroBg}
        style={{
          y: bgY,
          backgroundImage: `url('/images/ai/hero-deck-getxo.webp')`
        }}
        aria-hidden="true"
      />
      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroContent}>
        <motion.span
          className={styles.heroEyebrow}
          variants={VARIANTS.eyebrow}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h2
          className={styles.heroTitle}
          variants={VARIANTS.titleContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {titleLines.map((line, i) => (
            <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span
                className={styles.heroTitleLine}
                variants={VARIANTS.titleLine}
                style={{ display: 'block' }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div
          className={styles.heroDivider}
          aria-hidden="true"
        >
          <motion.span
            className={styles.heroDividerLine}
            variants={VARIANTS.divider}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          />
        </motion.div>

        <motion.p
          className={styles.heroSubtitle}
          variants={VARIANTS.subtitle}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t('subtitle')}
        </motion.p>
      </div>
    </section>
  );
}
