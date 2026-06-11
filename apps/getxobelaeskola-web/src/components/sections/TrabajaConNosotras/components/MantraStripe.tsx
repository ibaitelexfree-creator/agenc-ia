'use client';

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface MantraStripeProps {
  locale: string;
}

export default function MantraStripe({ locale }: MantraStripeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });
  const t = trabajaTranslations[locale] || trabajaTranslations.es;
  const words = t.ctaCierrePhraseParts.slice(0, 3).join(" ").split(" "); // Get core mantra text from translations

  // Custom text fallback if phrase parts are empty
  const mantraText = locale === 'eu' 
    ? "Hemen ez duzu lan bakarrik egingo, egunero itsas inguruneaz irakatsi, ikasi eta gozatzeko esperientzia biziko duzu."
    : locale === 'en'
    ? "Here you won't just work, you will experience teaching, learning, and enjoying the marine environment every day."
    : locale === 'fr'
    ? "Ici, vous ne ferez pas que travailler, vous vivrez chaque jour l'expérience d'enseigner, d'apprendre et de profiter de l'environnement marin."
    : "Aquí no solo trabajarás, sino que vivirás la experiencia de enseñar, aprender y disfrutar del entorno marino cada día.";
  
  const displayWords = mantraText.split(" ");

  return (
    <section ref={ref} className={styles['mantra-stripe']}>
      <blockquote className={styles['mantra-quote']} aria-label={mantraText}>
        {displayWords.map((word, i) => (
          <motion.span
            key={i}
            className={styles['mantra-word']}
            initial={{ opacity: 0.15 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0.15 }}
            transition={{
              duration: 0.45,
              delay: i * 0.035,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </blockquote>
    </section>
  );
}
