// PreciosBloque.tsx
import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

const CHECKLIST_ITEMS = [
  "Las 3 actividades completas",
  "Todo el material homologado necesario",
  "Uso de embarcaciones colectivas",
  "Monitorado titulado por la FVV",
  "Seguros de responsabilidad civil y accidentes"
];

export default function PreciosBloque() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

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
          TRANSPARENCIA TOTAL
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Todo incluido por
        </motion.h2>

        {/* Count-Up Price Display */}
        <div className={styles['price-display-wrapper']}>
          <div className={styles['price-circle']}>
            <motion.span className={styles['price-num']}>
              {rounded}
            </motion.span>
            <span className={styles['price-unit']}>€ / alumno</span>
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
            <h4 className={styles['info-heading']}>Septiembre a Junio</h4>
            <p className={styles['info-text']}>La temporada perfecta. Recomendamos reservar primavera y otoño con suficiente antelación por alta demanda.</p>
          </div>
          <div className={styles['info-box']}>
            <span className={styles['info-icon']}>👨‍🏫</span>
            <h4 className={styles['info-heading']}>Ratio Profesorado</h4>
            <p className={styles['info-text']}>Por cada 10-12 alumnos asignamos un instructor titulado para cumplir los más altos estándares.</p>
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
            <h4 className={styles['weather-heading']}>Nos tomamos el mar en serio</h4>
            <p className={styles['weather-text']}>Si las condiciones meteorológicas no son aptas o seguras para realizar las actividades en el agua, adaptaremos la jornada con actividades alternativas en tierra o coordinaremos un cambio de fecha sin coste alguno. La seguridad de los alumnos es siempre lo primero.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
