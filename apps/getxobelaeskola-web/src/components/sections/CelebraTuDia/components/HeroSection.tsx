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

      {/* Niña saltando en la ola */}
      <motion.div
        className={styles.jumpingGirl}
        animate={floatTransition}
        onClick={spinGirl}
        whileHover={prefersReducedMotion ? {} : { rotate: 15 }}
      >
        <svg viewBox="0 0 100 120" className={styles.svgIcon}>
          {/* Flag */}
          <path d="M 40,20 L 75,30 L 40,40 Z" fill="#FFD166" stroke="#0D2B45" strokeWidth="2" />
          <line x1="40" y1="20" x2="40" y2="100" stroke="#0D2B45" strokeWidth="3" />
          {/* Girl Silhouette / Cartoon */}
          <circle cx="50" cy="50" r="12" fill="#EF6351" stroke="#0D2B45" strokeWidth="2" /> {/* Head */}
          <path d="M 44,62 Q 50,68 56,62 L 62,90 L 50,80 L 38,90 Z" fill="#1B8FCF" stroke="#0D2B45" strokeWidth="2" /> {/* Dress/Body */}
          <line x1="38" y1="62" x2="25" y2="45" stroke="#0D2B45" strokeWidth="2" strokeLinecap="round" /> {/* Arms */}
          <line x1="62" y1="62" x2="75" y2="45" stroke="#0D2B45" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="90" x2="40" y2="110" stroke="#0D2B45" strokeWidth="2" strokeLinecap="round" /> {/* Legs */}
          <line x1="55" y1="90" x2="60" y2="110" stroke="#0D2B45" strokeWidth="2" strokeLinecap="round" />
          {/* Confetti bubble if active */}
          {isConfettiActive && (
            <>
              <circle cx="20" cy="30" r="3" fill="#6BBF59" />
              <circle cx="80" cy="25" r="4" fill="#FFD166" />
              <circle cx="90" cy="60" r="3.5" fill="#EF6351" />
              <path d="M10,80 L15,85" stroke="#1B8FCF" strokeWidth="2" />
            </>
          )}
        </svg>
      </motion.div>

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
