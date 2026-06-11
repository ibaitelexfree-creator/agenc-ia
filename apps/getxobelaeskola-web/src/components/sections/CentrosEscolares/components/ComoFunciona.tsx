// ComoFunciona.tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { scaleIn, fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

export default function ComoFunciona() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { ref: revealRef, isInView } = useScrollReveal(0.15);

  // Scroll Progress for the day timeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const barWidth = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className={styles['como-funciona-section']}>
      <div ref={revealRef} className={styles['section-wrapper']}>
        
        <motion.span
          className={styles['section-eyebrow']}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          LOGÍSTICA PEDAGÓGICA
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          ¿Cómo se organiza la jornada?
        </motion.h2>

        <motion.p
          className={styles['section-subtitle']}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Dividimos al alumnado en tres grupos que rotan de forma coordinada para garantizar que todos disfruten de cada actividad con total seguridad y atención personalizada.
        </motion.p>

        {/* 2.1 Rotation Diagram */}
        <div className={styles['rotation-diagram-container']}>
          <svg className={styles['rotation-svg']} viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arrows with path drawing animation */}
            <motion.path
              d="M 120,60 C 250,30 350,30 480,60"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            <motion.path
              d="M 120,150 C 250,150 350,150 480,150"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.7 }}
            />
            <motion.path
              d="M 120,240 C 250,270 350,270 480,240"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9 }}
            />

            {/* Nodes text directly inside SVG or mapped HTML */}
          </svg>

          {/* HTML Overlays to make it accessible & responsive */}
          <div className={styles['rotation-overlay']}>
            <div className={styles['rotation-group']}>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['group-node']}>
                <span>Grupo A</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['group-node']}>
                <span>Grupo B</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['group-node']}>
                <span>Grupo C</span>
              </motion.div>
            </div>

            <div className={styles['rotation-rotation']}>
              <span className={styles['rotate-badge']}>🔄 Rotación cada 50-60 min</span>
            </div>

            <div className={styles['rotation-activities']}>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>⛵ Bautismo Vela</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>🏄 Big SUP Colectivo</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>🐧 Taller Conciencia</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 2.2 Timeline del día (Scroll responsive progress bar) */}
        <div className={styles['timeline-container']}>
          <div className={styles['timeline-track']}>
            <motion.div
              style={shouldReduceMotion ? { width: "100%" } : { width: barWidth }}
              className={styles['timeline-fill']}
            />
          </div>
          <div className={styles['timeline-labels']}>
            <div className={styles['timeline-label-item']}>
              <span className={styles['time']}>09:00</span>
              <span className={styles['event']}>Recepción en Puerto</span>
            </div>
            <div className={styles['timeline-label-item']}>
              <span className={styles['time']}>10:30</span>
              <span className={styles['event']}>Primeras Rotaciones</span>
            </div>
            <div className={styles['timeline-label-item']}>
              <span className={styles['time']}>12:00</span>
              <span className={styles['event']}>Fin de Jornada</span>
            </div>
          </div>
        </div>

        {/* 2.3 Cards de datos */}
        <motion.div
          className={styles['logistics-cards']}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            className={styles['logistics-card']}
          >
            <span className={styles['card-icon']}>👥</span>
            <h4 className={styles['card-heading']}>3 Grupos Estables</h4>
            <p className={styles['card-text']}>Fomentamos equipos pequeños para dar una atención 100% segura y directa a cada participante.</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            className={styles['logistics-card']}
          >
            <span className={styles['card-icon']}>⏱️ 50-60 Minutos</span>
            <h4 className={styles['card-heading']}>Por Actividad</h4>
            <p className={styles['card-text']}>El tiempo perfecto para asimilar conceptos básicos en el agua y mantener la concentración a flote.</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            className={styles['logistics-card']}
          >
            <span className={styles['card-icon']}>⛵ Todo Incluido</span>
            <h4 className={styles['card-heading']}>Chalecos y Neoprenos</h4>
            <p className={styles['card-text']}>Facilitamos todo el material homologado necesario para realizar las actividades con máxima comodidad.</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
