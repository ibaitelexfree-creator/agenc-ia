'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { voluntariadoTranslations } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface TextoAcordeonProps {
  locale: string;
}

export function TextoAcordeon({ locale }: TextoAcordeonProps) {
  const [abierto, setAbierto] = useState(false);
  const t = voluntariadoTranslations[locale] || voluntariadoTranslations.es;

  return (
    <div className={styles['acordeon-container']}>
      {/* Texto intro siempre visible */}
      <motion.p
        className={styles['texto-intro']}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        {t.accordionIntro}
      </motion.p>

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            key="texto-completo"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={styles['texto-completo']}
          >
            {t.accordionParagraphs.map((parrafo, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                {parrafo}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón toggle */}
      <div className="flex justify-center mt-6">
        <motion.button
          className={styles['acordeon-toggle']}
          onClick={() => setAbierto(!abierto)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            animate={{ rotate: abierto ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            ▼
          </motion.span>
          <span>{abierto ? t.accordionLess : t.accordionMore}</span>
        </motion.button>
      </div>
    </div>
  );
}
