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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 is January, 9 is October
  const targetYear = currentMonth >= 9 ? currentYear + 1 : currentYear;

  return (
    <section className={styles.heroSection}>
      {/* BACKGROUND: Photo */}
      <div className={styles.heroBg} aria-hidden="true">
        <img
          src="/images/udalekuak-hero.jpg"
          alt="GetxoBelaEskola Udalekuak"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} style={{ zIndex: 5 }} />
      </div>

      {/* CENTERED CONTENT */}
      <div className={styles.heroContent} style={{ transform: 'translateY(-12vh)' }}>
        {/* Eyebrow */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={styles.heroEyebrow}
        >
          {t('eyebrow')}
        </motion.p>

        {/* Center Title: Udalekuak */}
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
          className={styles.heroTitle}
        >
          {t('title')}
        </motion.h1>

        {/* BOTTOM CONTENT GROUP (Subtitle + CTA) */}
        <div className={styles.heroBottomGroup}>
          {/* Subtitle (handwritten font Caveat) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
            className={styles.heroSubtitle}
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: 'easeInOut' }}
          >
            <button
              onClick={onCtaClick}
              className={styles.heroCta}
            >
              {t('cta', { year: targetYear })}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

