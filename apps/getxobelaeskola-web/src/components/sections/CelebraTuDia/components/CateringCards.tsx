// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\CateringCards.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, Variants, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../CelebraTuDia.module.css';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: -70 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 12 }
  }
};

interface CateringCardsProps {
  onInquireClick: () => void;
}

export default function CateringCards({ onInquireClick }: CateringCardsProps) {
  const t = useTranslations('celebra_dia.catering') as any;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  const options = [
    {
      id: 1,
      title: t('option1_title'),
      desc: t('option1_desc'),
      emoji: '🍽️',
      btnText: t('option1_btn'),
      isPopular: false
    },
    {
      id: 2,
      title: t('option2_title'),
      desc: t('option2_desc'),
      emoji: '🧺',
      btnText: t('option2_btn'),
      badge: t('option2_badge'),
      isPopular: true
    },
    {
      id: 3,
      title: t('option3_title'),
      desc: t('option3_desc'),
      emoji: '🎒',
      btnText: t('option3_btn'),
      isPopular: false,
      isFree: true
    }
  ];

  return (
    <section ref={sectionRef} className={styles.cateringSection}>
      <h2 className={styles.cateringTitle}>{t('title')}</h2>
      <p className={styles.cateringSubtitle}>{t('subtitle')}</p>

      <motion.div
        className={styles.cateringGrid}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            className={`${styles.cateringCard} ${opt.isPopular ? styles.cateringCardPopular : ''}`}
            variants={cardVariants}
            whileHover={prefersReducedMotion ? {} : {
              scale: 1.04,
              rotateY: 6,
              z: 10,
              boxShadow: '0 20px 40px rgba(13, 43, 69, 0.08)'
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Shimmer popular badge */}
            {opt.isPopular && opt.badge && (
              <div className={styles.cateringBadge}>
                <motion.span
                  animate={prefersReducedMotion ? {} : {
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {opt.badge}
                </motion.span>
              </div>
            )}

            {/* Confetti particles for popular choice */}
            {opt.isPopular && !prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(4)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#FFD166' : '#EF6351',
                      left: `${20 + idx * 22}%`,
                      top: '10%'
                    }}
                    animate={{
                      y: [0, -40],
                      x: [0, idx % 2 === 0 ? 10 : -10],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: idx * 0.7,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            )}

            <span className={styles.cateringCardIcon}>{opt.emoji}</span>
            <h3 className={styles.cateringCardTitle}>{opt.title}</h3>
            <p className={styles.cateringCardDesc}>{opt.desc}</p>
            
            <button
              onClick={onInquireClick}
              className={`${styles.cateringCardBtn} ${opt.isFree ? styles.cateringCardBtnFree : ''}`}
            >
              {opt.btnText}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
