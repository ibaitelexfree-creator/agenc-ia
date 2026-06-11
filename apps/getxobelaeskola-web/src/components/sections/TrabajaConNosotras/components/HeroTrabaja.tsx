'use client';

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SineWaveUnderline } from "./SineWaveUnderline";
import { trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface HeroTrabajaProps {
  locale: string;
}

const eyebrowV = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as any }
  }
};

const wordV = (delay: number) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as any }
  }
});

const roleV = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }
  },
  exit:    { opacity: 0, y: -10, filter: "blur(4px)",
    transition: { duration: 0.25 }
  }
};

export default function HeroTrabaja({ locale }: HeroTrabajaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const t = trabajaTranslations[locale] || trabajaTranslations.es;
  const CYCLING_ROLES = t.cyclingRoles;

  // Ciclo de roles
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % CYCLING_ROLES.length),
      3200
    );
    return () => clearInterval(id);
  }, [CYCLING_ROLES]);

  return (
    <section ref={ref} className={styles['hero-trabaja']} aria-label={t.titleMain + " " + t.titleAccent}>
      {/* Eyebrow */}
      <motion.span
        className={styles['tw-eyebrow']}
        variants={eyebrowV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {t.eyebrow}
      </motion.span>

      {/* Título — 2 palabras separadas para animarlas */}
      <div className={styles['tw-title-block']}>
        {/* "Trabaja con" */}
        <motion.span
          className={`${styles['tw-title']} ${styles['tw-title--main']}`}
          variants={wordV(0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {t.titleMain}
        </motion.span>

        {/* "nosotras." — con ola debajo */}
        <div className={styles['tw-title-accent-wrapper']}>
          <motion.span
            className={`${styles['tw-title']} ${styles['tw-title--accent']}`}
            variants={wordV(0.18)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            {t.titleAccent}
          </motion.span>
          {/* Ola animada debajo */}
          <SineWaveUnderline isVisible={isInView} />
        </div>
      </div>

      {/* Ciclo de roles */}
      <div className={styles['tw-roles-wrapper']} aria-live="polite" aria-atomic="true">
        <span className={styles['tw-roles-prefix']}>{t.buscamosPrefix}</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={roleIdx}
            className={styles['tw-role']}
            variants={roleV}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {CYCLING_ROLES[roleIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Párrafo intro */}
      <motion.p
        className={styles['tw-intro']}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {t.intro}
      </motion.p>

      {/* CTA hero */}
      <motion.a
        href="#formulario-cv"
        className={styles['tw-cta-btn']}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.45 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
      >
        {t.ctaHero}
      </motion.a>
    </section>
  );
}
