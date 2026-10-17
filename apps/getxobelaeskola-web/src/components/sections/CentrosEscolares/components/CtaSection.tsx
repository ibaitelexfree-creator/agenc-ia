// CtaSection.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

interface CtaSectionProps {
  onReserveClick: () => void;
}

export default function CtaSection({ onReserveClick }: CtaSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations('centros_escolares.cta');

  return (
    <section className={styles['cta-section']}>
      <div className={styles['cta-container']}>
        <motion.span
          className={styles['cta-eyebrow']}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          {t('eyebrow')}
        </motion.span>

        <motion.h2
          className={styles['cta-title']}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          className={styles['cta-description']}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t('description')}
        </motion.p>

        <motion.div
          className={styles['cta-buttons']}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.button
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={onReserveClick}
            className={styles['btn-primary']}
          >
            {t('btn_reserve')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
