'use client';

import { motion, useReducedMotion } from "framer-motion";
import { trabajaBeneficios, trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface BeneficiosProps {
  locale: string;
}

export default function Beneficios({ locale }: BeneficiosProps) {
  const BENEFICIOS = trabajaBeneficios[locale] || trabajaBeneficios.es;
  const t = trabajaTranslations[locale] || trabajaTranslations.es;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles['beneficios-section']}>
      <motion.p
        className={styles['tw-section-eyebrow']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.4 }}
      >
        {t.benefitsEyebrow}
      </motion.p>

      <div className={styles['beneficios-grid']}>
        {BENEFICIOS.map((item) => (
          <motion.article
            key={item.id}
            className={styles['bene-card']}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: item.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover="hover"
          >
            {/* Icono con micro-rebote al hover */}
            <motion.div
              className={styles['bene-card__icon']}
              variants={{
                hover: shouldReduceMotion ? {} : {
                  scale: 1.18,
                  rotate: [0, -8, 6, 0],
                  transition: { duration: 0.4, type: "spring", stiffness: 300 }
                }
              }}
            >
              {item.emoji}
            </motion.div>

            <h3 className={styles['bene-card__headline']}>{item.headline}</h3>
            <p className={styles['bene-card__body']}>{item.body}</p>

            {/* Indicador de acento — aparece al hover */}
            <motion.div
              className={styles['bene-card__indicator']}
              initial={{ scaleX: 0, originX: 0 }}
              variants={{
                hover: { scaleX: 1,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }
              }}
            />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
