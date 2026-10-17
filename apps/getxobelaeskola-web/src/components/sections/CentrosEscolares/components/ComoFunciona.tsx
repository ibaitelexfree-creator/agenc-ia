import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { scaleIn, fadeUp, staggerContainer } from '@/lib/motionPresets';
import styles from '../CentrosEscolares.module.css';

export default function ComoFunciona() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { ref: revealRef, isInView } = useScrollReveal(0.15);
  const t = useTranslations('centros_escolares.como_funciona');

  // Scroll Progress for the day timeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  } as any);

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
          {t('eyebrow')}
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          className={styles['section-subtitle']}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>

        {/* 2.1 Rotation Diagram */}
        <div className={styles['rotation-diagram-container']}>
          <svg className={styles['rotation-svg']} viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--color-ocean)" />
              </marker>
            </defs>

            {/* Arrows with path drawing animation */}
            <motion.path
              d="M 170,55 C 320,15 480,15 630,55"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#arrow)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            <motion.path
              d="M 170,147 C 320,147 480,147 630,147"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#arrow)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.7 }}
            />
            <motion.path
              d="M 170,239 C 320,279 480,279 630,239"
              stroke="var(--color-ocean)"
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#arrow)"
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
                <span>{t('group_a')}</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['group-node']}>
                <span>{t('group_b')}</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['group-node']}>
                <span>{t('group_c')}</span>
              </motion.div>
            </div>

            <div className={styles['rotation-rotation']}>
              <span className={styles['rotate-badge']}>{t('rotation_badge')}</span>
            </div>

            <div className={styles['rotation-activities']}>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>{t('activity_sailing')}</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>{t('activity_bigsup')}</span>
              </motion.div>
              <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles['activity-node']}>
                <span>{t('activity_awareness')}</span>
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
              <span className={styles['event']}>{t('timeline_0900_event')}</span>
            </div>
            <div className={styles['timeline-label-item']}>
              <span className={styles['time']}>10:30</span>
              <span className={styles['event']}>{t('timeline_1030_event')}</span>
            </div>
            <div className={styles['timeline-label-item']}>
              <span className={styles['time']}>12:00</span>
              <span className={styles['event']}>{t('timeline_1200_event')}</span>
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
            <span className={styles['card-icon']}>{t('card_groups_icon')}</span>
            <h4 className={styles['card-heading']}>{t('card_groups_heading')}</h4>
            <p className={styles['card-text']}>{t('card_groups_text')}</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            className={styles['logistics-card']}
          >
            <span className={styles['card-icon']}>{t('card_time_icon')}</span>
            <h4 className={styles['card-heading']}>{t('card_time_heading')}</h4>
            <p className={styles['card-text']}>{t('card_time_text')}</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
            className={styles['logistics-card']}
          >
            <span className={styles['card-icon']}>{t('card_material_icon')}</span>
            <h4 className={styles['card-heading']}>{t('card_material_heading')}</h4>
            <p className={styles['card-text']}>{t('card_material_text')}</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
