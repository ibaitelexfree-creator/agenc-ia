'use client';

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface CTACierreProps {
  locale: string;
}

export default function CTACierre({ locale }: CTACierreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const t = trabajaTranslations[locale] || trabajaTranslations.es;
  const PHRASE_PARTS = t.ctaCierrePhraseParts;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? ref : undefined,
    offset: ["start end", "end start"],
  });
  // Línea decorativa que crece al scrollear
  const lineWidth = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  return (
    <section ref={ref} className={styles['cta-cierre']}>
      {/* Línea decorativa de scroll */}
      <motion.div
        className={styles['cta-cierre__line']}
        style={{ width: lineWidth }}
        aria-hidden="true"
      />

      {/* Frase línea a línea */}
      <div className={styles['cta-cierre__phrase-block']}>
        {PHRASE_PARTS.map((line, i) => (
          <motion.p
            key={i}
            className={`${styles['cta-cierre__phrase']} ${i === PHRASE_PARTS.length - 1 ? styles['cta-cierre__phrase--bold'] : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              type: "tween",
              duration: 0.6,
              delay: 0.1 + i * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Botón de contacto */}
      <motion.a
        href="#formulario-cv"
        className={styles['cta-cierre__btn']}
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.04, backgroundColor: "#fff",
          color: "#0A3D5C", transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
      >
        {t.ctaCierreBtn}
      </motion.a>
    </section>
  );
}
