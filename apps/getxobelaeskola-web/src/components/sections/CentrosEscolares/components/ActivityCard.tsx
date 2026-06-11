// ActivityCard.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { scaleIn } from '@/lib/motionPresets';
import { Activity } from '../data/activities';
import styles from '../CentrosEscolares.module.css';

interface ActivityCardProps {
  activity: Activity;
  index: number;
}

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { id, icon, emoji_bg, title, subtitle, description, tags, color_accent } = activity;

  return (
    <motion.div
      className={styles['activity-card']}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? {} : {
        y: -8,
        borderColor: "rgba(0, 119, 182, 0.2)",
        boxShadow: "0 20px 40px rgba(0, 119, 182, 0.08)"
      }}
    >
      <div className={styles['card-header-row']}>
        {/* Floating ID number that animates on hover */}
        <motion.span
          className={styles['activity-id']}
          whileHover={shouldReduceMotion ? {} : { rotateY: 360, color: "var(--color-ocean)" }}
          transition={{ duration: 0.6 }}
        >
          {id}
        </motion.span>
        {/* Large icon with spring scale animation on hover */}
        <div className={styles['icon-wrapper']}>
          <span className={styles['emoji-bg']} aria-hidden="true">{emoji_bg}</span>
          <motion.span
            className={styles['icon-main']}
            whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {icon}
          </motion.span>
        </div>
      </div>

      <div className={styles['card-main-content']}>
        <span className={styles['activity-subtitle']}>{subtitle}</span>
        <h3 className={styles['activity-title']}>{title}</h3>
        <p className={styles['activity-desc']}>{description}</p>
      </div>

      <div className={styles['card-footer-tags']}>
        {tags.map((tag) => (
          <span key={tag} className={styles['activity-tag']}>
            {tag}
          </span>
        ))}
      </div>
      
      {/* Decorative accent bar at the bottom */}
      <div className={styles['card-accent-bar']} style={{ backgroundColor: color_accent }} />
    </motion.div>
  );
}
