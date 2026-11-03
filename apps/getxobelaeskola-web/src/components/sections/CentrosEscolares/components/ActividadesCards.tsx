// ActividadesCards.tsx
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ActivityCard from './ActivityCard';
import styles from '../CentrosEscolares.module.css';

export default function ActividadesCards() {
  const t = useTranslations('centros_escolares.actividades');

  const activities = [
    {
      id: "01",
      icon: "⛵",
      emoji_bg: "🌊",
      title: t('act_01_title'),
      subtitle: t('act_01_subtitle'),
      description: t('act_01_desc'),
      tags: t.raw('act_01_tags') as string[],
      color_accent: "#E63900"
    },
    {
      id: "02",
      icon: "🏄",
      emoji_bg: "💧",
      title: t('act_02_title'),
      subtitle: t('act_02_subtitle'),
      description: t('act_02_desc'),
      tags: t.raw('act_02_tags') as string[],
      color_accent: "#0f4080"
    },
    {
      id: "03",
      icon: "🐧",
      emoji_bg: "❄️",
      title: t('act_03_title'),
      subtitle: t('act_03_subtitle'),
      description: t('act_03_desc'),
      tags: t.raw('act_03_tags') as string[],
      color_accent: "#1A1A1A"
    },
    {
      id: "04",
      icon: "🪢",
      emoji_bg: "⚓",
      title: t('act_04_title'),
      subtitle: t('act_04_subtitle'),
      description: t('act_04_desc'),
      tags: t.raw('act_04_tags') as string[],
      color_accent: "#006699"
    },
    {
      id: "05",
      icon: "🧭",
      emoji_bg: "🚢",
      title: t('act_05_title'),
      subtitle: t('act_05_subtitle'),
      description: t('act_05_desc'),
      tags: t.raw('act_05_tags') as string[],
      color_accent: "#008080"
    }
  ];

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
          {t('eyebrow')}
        </motion.span>

        <motion.h2
          className={styles['section-title']}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('title')}
        </motion.h2>

        {/* Swipe instruction on mobile */}
        <span className={styles['swipe-hint']}>{t('swipe_hint')}</span>

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

        {/* Flexibility & Choice Notice Box with Framer Motion */}
        <motion.div
          className={styles['activities-flex-box']}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles['flex-badge']}>{t('flex_badge')}</span>
          <h3 className={styles['flex-title']}>{t('flex_title')}</h3>
          <p className={styles['flex-desc']}>{t('flex_desc')}</p>
          <div className={styles['flex-pills']}>
            <div className={styles['flex-pill']}>
              <span className={styles['flex-pill-icon']}>✨</span>
              <span>{t('flex_item_choice')}</span>
            </div>
            <div className={styles['flex-pill']}>
              <span className={styles['flex-pill-icon']}>🎯</span>
              <span>{t('flex_item_age')}</span>
            </div>
            <div className={styles['flex-pill']}>
              <span className={styles['flex-pill-icon']}>🌤️</span>
              <span>{t('flex_item_weather')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
