// CentrosHero.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, scaleIn } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

interface CentrosHeroProps {
  onLearnMoreClick: () => void;
  onReserveClick: () => void;
}

export default function CentrosHero({ onLearnMoreClick, onReserveClick }: CentrosHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const titleLines = ["La mar como", "herramienta", "educativa."];

  return (
    <section className={styles['hero-section']}>
      <div className={styles['hero-content']}>
        {/* Eyebrow */}
        <motion.span
          className={styles['hero-eyebrow']}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          CENTROS ESCOLARES · ASOCIACIONES
        </motion.span>

        {/* Staggered Title */}
        <motion.div
          className={styles['hero-title-container']}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {titleLines.map((line, i) => (
            <motion.h1
              key={i}
              variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp}
              className={styles['hero-title-line']}
            >
              {line}
            </motion.h1>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className={styles['hero-subtitle']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Acercamos la mar a los centros educativos y asociaciones a través de experiencias vivenciales donde deporte, ciencia y trabajo en equipo se unen en un entorno real y de confianza.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles['hero-ctas']}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={onReserveClick}
            className={styles['btn-primary']}
          >
            📧 Reservar fecha
          </motion.button>

          <motion.button
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={onLearnMoreClick}
            className={styles['btn-secondary']}
          >
            ↓ Saber más
          </motion.button>
        </motion.div>

        {/* Stat Pills */}
        <motion.div
          className={styles['hero-pills']}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.div
            variants={scaleIn}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            className={styles['stat-pill']}
          >
            <span className={styles['pill-num']}>👥 Hasta 60</span>
            <span className={styles['pill-label']}>Alumnos por día</span>
          </motion.div>

          <motion.div
            variants={scaleIn}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            className={styles['stat-pill']}
          >
            <span className={styles['pill-num']}>⏱️ 3 Horas</span>
            <span className={styles['pill-label']}>De jornada vivencial</span>
          </motion.div>

          <motion.div
            variants={scaleIn}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            className={styles['stat-pill']}
          >
            <span className={styles['pill-num']}>🪙 15 €</span>
            <span className={styles['pill-label']}>Por alumno</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
