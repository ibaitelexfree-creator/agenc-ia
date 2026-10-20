// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\HeroSection.tsx
'use client';

import { useRef, useState } from 'react';
import { motion, useInView, Variants, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../CelebraTuDia.module.css';

const VARIANTS: Record<string, Variants> = {
  eyebrow: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  letterContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  },
  letter: {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 150, damping: 12 }
    }
  },
  subtitle: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' }
    }
  },
  cta: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 1.1, type: 'spring', stiffness: 100 }
    }
  }
};

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const t = useTranslations('celebra_dia.hero') as any;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const titleText = t('title');
  const letters = titleText.split('');

  const wave1 = "M0,50 C150,20 350,80 500,50 L500,100 L0,100 Z";
  const wave2 = "M0,50 C150,80 350,20 500,50 L500,100 L0,100 Z";

  const floatTransition = prefersReducedMotion ? {} : {
    y: [0, -12, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
  };

  const spinGirl = () => {
    if (prefersReducedMotion) return;
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      aria-label="Celebra tu día en la escuela"
    >
      <div className={styles.heroContent}>
        <motion.span
          className={styles.heroEyebrow}
          variants={VARIANTS.eyebrow}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h1
          className={styles.heroTitle}
          variants={VARIANTS.letterContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <span className={styles.heroTitleLetters}>
            {titleText.split(' ').map((word: string, wordIdx: number) => (
              <span key={wordIdx} className={styles.heroWord}>
                {word.split('').map((char: string, charIdx: number) => (
                  <motion.span
                    key={charIdx}
                    className={styles.heroTitleLetter}
                    variants={VARIANTS.letter}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.15, rotate: [0, -5, 5, 0], color: '#1B8FCF' }}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordIdx < titleText.split(' ').length - 1 && (
                  <span className={styles.heroTitleLetter}>&nbsp;</span>
                )}
              </span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          variants={VARIANTS.subtitle}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t('subtitle')}
        </motion.p>

        <motion.button
          className={styles.heroCta}
          variants={VARIANTS.cta}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: '0 15px 30px rgba(239, 99, 81, 0.45)' }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={onCtaClick}
        >
          {t('cta')}
        </motion.button>
      </div>

      {/* Wave container bottom */}
      <div className={styles.waveContainer}>
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" className={styles.svgIcon}>
          <motion.path
            className={styles.wavePath}
            d={wave1}
            animate={prefersReducedMotion ? {} : { d: [wave1, wave2, wave1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </section>
  );
}
