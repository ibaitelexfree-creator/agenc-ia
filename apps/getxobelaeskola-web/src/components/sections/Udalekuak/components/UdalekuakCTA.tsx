// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakCTA.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from '../Udalekuak.module.css';

export default function UdalekuakCTA() {
  const t = useTranslations('udalekuak.cta') as any;
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="inscripcion" className={styles.ctaSection}>
      {/* Decorative Wave Top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className={styles.waveSvgTop}>
          <path d="M0,0 C300,80 900,0 1200,60 L1200,0 Z" />
        </svg>
      </div>

      {/* Pulsing star particles */}
      {!prefersReducedMotion && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
          animate={{
            opacity: [0.15, 0.85, 0.15],
            scale: [1, 1.6, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.5,
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main Content */}
      <div className={styles.ctaContent}>
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.ctaEyebrow}
        >
          {t('eyebrow')}
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.ctaTitle}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.ctaSubtitle}
        >
          {t('subtitle')}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={styles.ctaButtons}
        >
          <Link
            href={`/${locale}/contacto?motivo=udalekuak`}
            className={styles.btnPrimary}
          >
            {t('btn_enroll')}
          </Link>
          <Link
            href={`/${locale}/contacto`}
            className={styles.btnSecondary}
          >
            {t('btn_info')}
          </Link>
        </motion.div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={styles.waveSvgBottom}>
          <path d="M0,60 C400,0 800,40 1200,10 L1200,60 Z" />
        </svg>
      </div>
    </section>
  );
}
