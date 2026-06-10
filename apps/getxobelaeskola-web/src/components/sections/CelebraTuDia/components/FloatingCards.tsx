// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\FloatingCards.tsx
'use client';

import { useRef, useState } from 'react';
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
  hidden: { opacity: 0, y: 50, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function FloatingCards() {
  const t = useTranslations('celebra_dia.cards') as any;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  // Keep track of which cards are flipped (open detail back view)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const cardItems = [
    { id: 0, title: t('chill_title'), desc: t('chill_desc'), emoji: '🛋️', detail: t('chill_detail'), color: '#6BBF59' },
    { id: 1, title: t('velero_title'), desc: t('velero_desc'), emoji: '⛵', badge: t('velero_badge'), color: '#1B8FCF' },
    { id: 2, title: t('sup_title'), desc: t('sup_desc'), emoji: '🏄', color: '#FFD166' },
    { id: 3, title: t('combo_title'), desc: t('combo_desc'), emoji: '🔄', badge: t('combo_badge'), color: '#EF6351' },
    { id: 4, title: t('catering_title'), desc: t('catering_desc'), emoji: '🍱', color: '#F5E6C8' }
  ];

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section ref={sectionRef} className={styles.cardsSection}>
      <h2 className={styles.cardsTitle}>{t('title')}</h2>

      <motion.div
        className={styles.cardsGrid}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {cardItems.map((card) => {
          const isFlipped = !!flippedCards[card.id];
          return (
            <div
              key={card.id}
              className={styles.cardContainer}
              onClick={() => toggleFlip(card.id)}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="w-full h-full relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                {/* FRONT FACE */}
                <motion.div
                  className={`${styles.cardFace} ${styles.cardFront}`}
                  variants={cardVariants}
                  whileHover={prefersReducedMotion ? {} : {
                    y: -10,
                    boxShadow: '0 20px 35px rgba(13, 43, 69, 0.1)',
                    borderColor: card.color
                  }}
                >
                  <span className={styles.cardIcon}>{card.emoji}</span>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                  {card.badge && <span className={styles.cardBadge}>{card.badge}</span>}
                </motion.div>

                {/* BACK FACE */}
                <div
                  className={`${styles.cardFace} ${styles.cardBack}`}
                  style={{
                    backgroundColor: '#0D2B45',
                    color: '#FAFAFA'
                  }}
                >
                  <span className={styles.cardIcon}>{card.emoji}</span>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBackText}>
                    {card.detail || card.desc}
                  </p>
                  <span className="text-[10px] mt-4 uppercase tracking-wider text-sea-foam/50 font-bold">
                    [ Volver ]
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
