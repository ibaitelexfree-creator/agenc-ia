// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\GuardaMaterial\components\PricingCard.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../GuardaMaterial.module.css';

// ── Hook: counter animado ─────────────────────────────────────
function useCounter(to: number, duration: number = 1.5, shouldStart: boolean = false) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1] as const
    });
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [shouldStart, to, duration]);

  return display;
}

export default function PricingCard() {
  const t = useTranslations('guarda_material.pricing') as any;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-60px' });
  
  const targetPrice = parseInt(t('amount')) || 50;
  const price = useCounter(targetPrice, 1.4, isInView);

  const priceItems = [
    { icon: '📦', text: t('item1') },
    { icon: '🔑', text: t('item2') },
    { icon: '🚣', text: t('item3') },
    { icon: '🚿', text: t('item4') }
  ];

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className={styles.pricingSection}>
      <motion.p
        className={styles.sectionEyebrow}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {t('eyebrow')}
      </motion.p>

      <motion.div
        ref={ref}
        className={styles.pricingCard}
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 48, scale: 0.97 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div className={styles.pricingCardPrice}>
          <span className={styles.pricingCardAmount}>{price}</span>
          <div className={styles.pricingCardUnit}>
            <span className={styles.pricingCardCurrency}>{t('currency')}</span>
            <span className={styles.pricingCardPeriod}>/ {t('period')}</span>
          </div>
        </div>

        <motion.hr
          className={styles.pricingCardDivider}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        />

        <motion.ul
          className={styles.pricingCardList}
          variants={listVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {priceItems.map((item, i) => (
            <motion.li key={i} className={styles.pricingCardItem} variants={itemVariants}>
              <span className={styles.pricingCardItemIcon} aria-hidden="true">
                {item.icon}
              </span>
              {item.text}
            </motion.li>
          ))}
        </motion.ul>

        <motion.a
          href="#contacto"
          className={styles.pricingCardCta}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
        >
          {t('cta')}
        </motion.a>

        <motion.p
          className={styles.pricingCardNote}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          {t('note')}
        </motion.p>
      </motion.div>
    </section>
  );
}
