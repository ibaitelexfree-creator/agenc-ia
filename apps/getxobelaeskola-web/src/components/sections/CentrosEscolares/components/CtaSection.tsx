// CtaSection.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

interface CtaSectionProps {
  onReserveClick: () => void;
}

export default function CtaSection({ onReserveClick }: CtaSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleDownloadDossier = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // We can also trigger a visual micro-interaction/toast if needed
    console.log("Downloading dossier...");
  };

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
          PROPUESTA EDUCATIVA UNICA
        </motion.span>

        <motion.h2
          className={styles['cta-title']}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          ¿Lista para reservar la fecha para tu centro?
        </motion.h2>

        <motion.p
          className={styles['cta-description']}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Escríbenos indicando el número estimado de alumnos, el curso escolar y las posibles fechas que os vengan mejor. Nos encargaremos de organizar toda la logística de la jornada náutica.
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
            📧 Reservar fecha
          </motion.button>

          <motion.a
            href="/docs/actividades-nauticas-centros-escolares.pdf"
            download
            onClick={handleDownloadDossier}
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className={styles['btn-secondary']}
          >
            📄 Descargar dossier PDF
          </motion.a>
        </motion.div>

        <p className={styles['cta-note']}>
          Dossier informativo detallado: "Actividades náuticas para centros escolares y asociaciones"
        </p>
      </div>
    </section>
  );
}
