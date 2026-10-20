// PreciosBloque.tsx
import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

export default function PreciosBloque() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations('centros_escolares.precios');

  const CHECKLIST_ITEMS = [
    t('checklist_1'),
    t('checklist_2'),
    t('checklist_3'),
    t('checklist_4'),
    t('checklist_5')
  ];

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      animate(count, 15, { duration: 1.5, ease: "easeOut" });
    }
  }, [isInView, count]);

  return (
    <section ref={ref} className={styles['precios-section']}>
      <div className={styles['section-wrapper']}>
        
        <motion.span
          className={styles['section-eyebrow']}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('title')}
        </motion.h2>

        {/* Count-Up Price Display */}
        <div className={styles['price-display-wrapper']}>
          <div className={styles['price-circle']}>
            <motion.span className={styles['price-num']}>
              {rounded}
            </motion.span>
            <span className={styles['price-unit']}>{t('price_unit')}</span>
          </div>
        </div>

        {/* Checklist */}
        <motion.ul
          className={styles['precios-checklist']}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {CHECKLIST_ITEMS.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className={styles['checklist-item']}
            >
              <motion.span
                className={styles['check-icon']}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 + i * 0.08 }}
              >
                ✓
              </motion.span>
              <span className={styles['checklist-text']}>{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Informational blocks */}
        <div className={styles['precios-info-grid']}>
          <div className={styles['info-box']}>
            <span className={styles['info-icon']}>📅</span>
            <h4 className={styles['info-heading']}>{t('season_heading')}</h4>
            <p className={styles['info-text']}>{t('season_text')}</p>
          </div>
          <div className={styles['info-box']}>
            <span className={styles['info-icon']}>👨‍🏫</span>
            <h4 className={styles['info-heading']}>{t('ratio_heading')}</h4>
            <p className={styles['info-text']}>{t('ratio_text')}</p>
          </div>
        </div>

        {/* Weather warning alert box */}
        <motion.div
          className={styles['weather-alert']}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className={styles['weather-icon']}>🌦️</span>
          <div className={styles['weather-content']}>
            <h4 className={styles['weather-heading']}>{t('weather_heading')}</h4>
            <p className={styles['weather-text']}>{t('weather_text')}</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
