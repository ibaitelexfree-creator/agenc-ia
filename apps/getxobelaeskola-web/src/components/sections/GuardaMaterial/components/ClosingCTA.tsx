// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\components\ClosingCTA.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../GuardaMaterial.module.css';

const CHAR_DELAY = 55; // ms entre caracteres

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed('');
      setDone(false);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, CHAR_DELAY);
    return () => clearInterval(id);
  }, [active, text]);

  return { displayed, done };
}

export default function ClosingCTA() {
  const t = useTranslations('guarda_material.closing') as any;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-60px' });
  
  const phrase = t('phrase');
  const { displayed, done } = useTypewriter(phrase, isInView);

  return (
    <section ref={ref} className={styles.closingCta}>
      <svg className={styles.closingWave} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>

      <div className={styles.closingCtaTextWrapper}>
        <p className={styles.closingCtaPhrase} aria-live="polite">
          {displayed}
          {!done && (
            <motion.span
              className={styles.closingCtaCursor}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              aria-hidden="true"
            >
              |
            </motion.span>
          )}
        </p>
      </div>

      {done && (
        <motion.a
          href="#contacto"
          className={styles.closingCtaBtn}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
        >
          {t('btn')}
        </motion.a>
      )}
    </section>
  );
}
