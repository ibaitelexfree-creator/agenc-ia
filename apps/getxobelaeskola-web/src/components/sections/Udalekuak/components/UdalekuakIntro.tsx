// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\Udalekuak\components\UdalekuakIntro.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../Udalekuak.module.css';

export default function UdalekuakIntro() {
  const t = useTranslations('udalekuak.intro') as any;
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={styles.introSection}>
      <div className={styles.introContent}>
        
        {/* Decorator line top */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={styles.decoratorLine}
        />

        <motion.h2
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={styles.introTitle}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className={styles.introParagraph}
        >
          {t('subtitle1')}{' '}
          <span className="text-[var(--color-seaweed)] font-semibold">{t('subtitle2')}</span>,
          {' '}{t('subtitle3')}{' '}
          <span className="text-[var(--color-sky)] font-semibold">{t('subtitle3')}</span>{' '}
          {t('subtitle4')}{' '}
          <span className="text-[var(--color-sun)] font-semibold">{t('subtitle4')}</span>{' '}
          {t('subtitle5')}
        </motion.p>

        {/* Note caveat (Accent handwritten style) */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
          className={styles.introNote}
        >
          {t('note')}
        </motion.p>

        {/* Decorator line bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className={styles.decoratorLine}
          style={{ marginTop: '2.5rem' }}
        />

      </div>
    </section>
  );
}
