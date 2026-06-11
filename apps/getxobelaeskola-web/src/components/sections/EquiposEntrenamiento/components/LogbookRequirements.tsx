// LogbookRequirements.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REQUIREMENTS } from "../data/requirements";
import styles from "../EquiposEntrenamiento.module.css";

interface AnimatedCheckProps {
  color?: string;
  delay?: number;
  isVisible: boolean;
}

// SVG check animado
function AnimatedCheck({ color = "#E63900", delay = 0, isVisible }: AnimatedCheckProps) {
  return (
    <svg className={styles['logbook__check-svg']} viewBox="0 0 24 24" fill="none"
         aria-hidden="true">
      <motion.path
        d="M4 12L9 17L20 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export default function LogbookRequirements() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <section className={styles['logbook-section']}>

      <motion.p
        className={styles['section-eyebrow--light']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        REQUISITOS
      </motion.p>

      <motion.h2
        className={styles['section-title--light']}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Para unirte a la flota.
      </motion.h2>

      {/* El "cuaderno" */}
      <motion.div
        ref={ref}
        className={styles['logbook']}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Encabezado estilo bitácora */}
        <div className={styles['logbook__header']}>
          <span className={styles['logbook__title']}>CUADERNO DE BITÁCORA</span>
          <span className={styles['logbook__subtitle']}>Getxo Bela Eskola · Condiciones de acceso</span>
        </div>

        <div className={styles['logbook__divider']} />

        {/* Entradas */}
        {REQUIREMENTS.map((req, i) => (
          <motion.div
            key={req.id}
            className={styles['logbook__entry']}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Número de entrada */}
            <span className={styles['logbook__entry-num']}>[{req.number}]</span>

            {/* Contenido */}
            <div className={styles['logbook__entry-body']}>
              <div className={styles['logbook__entry-header']}>
                <span className={styles['logbook__entry-icon']} aria-hidden="true">
                  {req.icon}
                </span>
                <span className={styles['logbook__entry-title']}>{req.title}</span>
              </div>
              <p className={styles['logbook__entry-text']}>{req.body}</p>
              {req.highlight && (
                <span className={styles['logbook__highlight']}>{req.highlight}</span>
              )}
            </div>

            {/* Check animado */}
            <div className={styles['logbook__check']}>
              <AnimatedCheck
                delay={0.5 + i * 0.12}
                isVisible={isInView}
              />
            </div>
          </motion.div>
        ))}

        {/* Firma del logbook */}
        <div className={styles['logbook__signature']}>
          <span>Angharad · Getxo Bela Eskola · getxobelaeskola.cloud</span>
        </div>

      </motion.div>
    </section>
  );
}
