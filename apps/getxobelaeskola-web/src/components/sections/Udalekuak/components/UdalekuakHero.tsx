// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakHero.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

interface UdalekuakHeroProps {
  onCtaClick: () => void;
}

export default function UdalekuakHero({ onCtaClick }: UdalekuakHeroProps) {
  const t = useTranslations('udalekuak.hero') as any;
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={styles.heroSection}>
      {/* BACKGROUND: Video/Photo */}
      <div className={styles.heroBg} aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.heroVideo}
          poster="/images/course-piragua-competition-double.jpg"
        >
          <source src="/udalekuak/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />
      </div>

      {/* CENTERED CONTENT */}
      <div className={styles.heroContent}>
        {/* Eyebrow */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className={styles.heroEyebrow}
        >
          {t('eyebrow')}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className={styles.heroTitle}
        >
          {t('title')}
        </motion.h1>

        {/* Subtitle (handwritten font Caveat) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={styles.heroSubtitle}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <button
            onClick={onCtaClick}
            className={styles.heroCta}
          >
            {t('cta')}
          </button>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        className={styles.scrollIndicator}
        animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        onClick={onCtaClick}
      >
        <span className={styles.scrollText}>{t('scroll')}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}
