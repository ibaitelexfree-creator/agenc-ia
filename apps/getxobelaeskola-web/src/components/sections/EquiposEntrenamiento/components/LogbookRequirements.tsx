import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REQUIREMENTS } from "../data/requirements";
import styles from "../EquiposEntrenamiento.module.css";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('equipos_entrenamiento.logbook');

  return (
    <section className={styles['logbook-section']}>

      <motion.p
        className={styles['section-eyebrow--light']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        {t('title_eyebrow')}
      </motion.p>

      <motion.h2
        className={styles['section-title--light']}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {t('title')}
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
          <span className={styles['logbook__title']}>{t('log_title')}</span>
          <span className={styles['logbook__subtitle']}>{t('log_subtitle')}</span>
        </div>

        <div className={styles['logbook__divider']} />

        {/* Entradas en Grid Responsive */}
        <div className={styles['logbook__entries-grid']}>
          {REQUIREMENTS.map((req, i) => {
            const reqKey = req.id;
            const title = t(`${reqKey}.title`);
            const body = t(`${reqKey}.body`);
            const highlight = req.highlight ? t(`${reqKey}.highlight`) : undefined;

            return (
              <motion.div
                key={req.id}
                className={styles['logbook__entry']}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header de la tarjeta: Número y Check */}
                <div className={styles['logbook__entry-top']}>
                  <span className={styles['logbook__entry-num']}>[{req.number}]</span>
                  <div className={styles['logbook__check']}>
                    <AnimatedCheck
                      delay={0.4 + i * 0.1}
                      isVisible={isInView}
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className={styles['logbook__entry-body']}>
                  <div className={styles['logbook__entry-header']}>
                    <span className={styles['logbook__entry-icon']} aria-hidden="true">
                      {req.icon}
                    </span>
                    <span className={styles['logbook__entry-title']}>{title}</span>
                  </div>
                  <p className={styles['logbook__entry-text']}>{body}</p>
                  {highlight && (
                    <span className={styles['logbook__highlight']}>{highlight}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Firma del logbook */}
        <div className={styles['logbook__signature']}>
          <span>{t('signature')}</span>
        </div>

      </motion.div>
    </section>
  );
}
