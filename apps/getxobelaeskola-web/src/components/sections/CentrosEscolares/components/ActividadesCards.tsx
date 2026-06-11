// ActividadesCards.tsx
import { motion } from 'framer-motion';
import { activities } from '../data/activities';
import ActivityCard from './ActivityCard';
import styles from '../CentrosEscolares.module.css';

export default function ActividadesCards() {
  return (
    <section className={styles['actividades-section']}>
      <div className={styles['section-wrapper']}>
        <motion.span
          className={styles['section-eyebrow']}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          EXPERIENCIAS VIVENCIALES
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Aprender es convivir.
        </motion.h2>

        {/* Swipe instruction on mobile */}
        <span className={styles['swipe-hint']}>← Desliza para ver más →</span>

        {/* Scrollable grid container */}
        <div className={styles['activities-grid-scroll']}>
          <div className={styles['activities-grid']}>
            {activities.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
