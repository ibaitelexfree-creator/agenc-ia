// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakHero.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

interface UdalekuakHeroProps {
  onCtaClick: () => void;
}

export default function UdalekuakHero({ onCtaClick }: UdalekuakHeroProps) {
  const t = useTranslations('udalekuak.hero') as any;
  const prefersReducedMotion = useReducedMotion();
  const [introEnded, setIntroEnded] = useState(false);
  const [loopDirection, setLoopDirection] = useState<'forward' | 'reverse'>('forward');

  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 is January, 9 is October
  const targetYear = currentMonth >= 9 ? currentYear + 1 : currentYear;

  // Handle switching and playing videos seamlessly
  useEffect(() => {
    if (!introEnded) return;

    if (loopDirection === 'forward') {
      const vid = forwardVideoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    } else {
      const vid = reverseVideoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [introEnded, loopDirection]);

  return (
    <section className={styles.heroSection}>
      {/* BACKGROUND: Video/Photo */}
      <div className={styles.heroBg} aria-hidden="true">
        {/* Intro Video */}
        <video
          autoPlay
          muted
          playsInline
          onEnded={() => setIntroEnded(true)}
          className={styles.heroVideo}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: introEnded ? 0 : 1,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: introEnded ? 0 : 4,
          }}
          poster="/images/course-piragua-competition-double.jpg"
        >
          <source src="/videos/Smoke_forming_text_Udalekuak_202606161557.mp4" type="video/mp4" />
          <track kind="captions" src="data:text/vtt," label="No captions" default />
        </video>

        {/* Slow Forward Loop Video */}
        <video
          ref={forwardVideoRef}
          muted
          playsInline
          onEnded={() => setLoopDirection('reverse')}
          className={styles.heroVideo}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: (introEnded && loopDirection === 'forward') ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 2,
          }}
        >
          <source src="/videos/Smoke_swirling_slow_forward.mp4" type="video/mp4" />
          <track kind="captions" src="data:text/vtt," label="No captions" default />
        </video>

        {/* Slow Reverse Loop Video */}
        <video
          ref={reverseVideoRef}
          muted
          playsInline
          onEnded={() => setLoopDirection('forward')}
          className={`${styles.heroVideo} ${styles.heroVideoReverse}`}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: (introEnded && loopDirection === 'reverse') ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 1,
          }}
        >
          <source src="/videos/Smoke_swirling_slow_reverse.mp4" type="video/mp4" />
          <track kind="captions" src="data:text/vtt," label="No captions" default />
        </video>

        <div className={styles.heroOverlay} style={{ zIndex: 5 }} />
      </div>

      {/* CENTERED CONTENT */}
      <div className={styles.heroContent}>
        {/* Eyebrow */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, letterSpacing: '0.2em' }}
          animate={introEnded ? { opacity: 1, letterSpacing: '0.4em' } : { opacity: 0, letterSpacing: '0.2em' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={styles.heroEyebrow}
        >
          {t('eyebrow')}
        </motion.p>

        {/* Subtitle (handwritten font Caveat) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={introEnded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: 'easeInOut' }}
          className={styles.heroSubtitle}
          style={{ marginTop: 'clamp(200px, 45vh, 440px)' }}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={introEnded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, delay: 2.4, ease: 'easeInOut' }}
        >
          <button
            onClick={onCtaClick}
            className={styles.heroCta}
          >
            {t('cta', { year: targetYear })}
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
