// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\HorizontalTimeline.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../CelebraTuDia.module.css';

export default function HorizontalTimeline() {
  const t = useTranslations('celebra_dia.timeline') as any;
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Scale timeline progress line from 0 to 1 as user scrolls
  const scaleX = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);

  const steps = [
    { id: 1, time: t('step1_time'), title: t('step1_title'), desc: t('step1_desc'), emoji: '🏖️' },
    { id: 2, time: t('step2_time'), title: t('step2_title'), desc: t('step2_desc'), emoji: '⛵' },
    { id: 3, time: t('step3_time'), title: t('step3_title'), desc: t('step3_desc'), emoji: '🛋️' },
    { id: 4, time: t('step4_time'), title: t('step4_title'), desc: t('step4_desc'), emoji: '🍾' }
  ];

  return (
    <section ref={sectionRef} className={styles.timelineSection}>
      <h2 className={styles.timelineTitle}>{t('title')}</h2>

      <div className={styles.timelineWrapper}>
        {/* Horizontal Line background (Desktop only) */}
        <div className={styles.timelineLineBg} />

        {/* Animated Progress Line */}
        <motion.div
          className={styles.timelineLineProgress}
          style={{ scaleX }}
        />

        <div className={styles.timelineNodes}>
          {steps.map((step, i) => {
            // Calculate activation point per node (roughly corresponding to steps)
            const activationPoint = 0.25 + i * 0.16;

            return (
              <div key={step.id} className={styles.timelineNode}>
                {/* Node Icon */}
                <motion.div
                  className={styles.nodeIcon}
                  animate={prefersReducedMotion ? {} : {
                    y: [0, -6, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {step.emoji}
                </motion.div>

                {/* Node Time Label */}
                <span className={styles.nodeTime}>{step.time}</span>

                {/* Dot connected to timeline */}
                <motion.div
                  className={styles.nodeDot}
                  style={{
                    backgroundColor: prefersReducedMotion ? '#FAFAFA' : '#FAFAFA'
                  }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.3 }}
                />

                {/* Hito text */}
                <h3 className={styles.nodeTitle}>{step.title}</h3>
                <p className={styles.nodeDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
