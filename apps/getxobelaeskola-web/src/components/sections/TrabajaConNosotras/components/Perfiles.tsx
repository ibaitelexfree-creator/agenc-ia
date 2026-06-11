'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trabajaPerfiles, trabajaTranslations, PerfilData } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface PerfilesProps {
  locale: string;
}

interface PerfilRowProps {
  perfil: PerfilData;
  isOpen: boolean;
  onToggle: () => void;
}

function PerfilRow({ perfil, isOpen, onToggle }: PerfilRowProps) {
  const { emoji, title, description, requisitos, chips } = perfil;

  return (
    <div className={styles['perfil-row']}>
      {/* Cabecera clicable */}
      <button
        className={styles['perfil-row__header']}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`perfil-${perfil.id}`}
      >
        <div className={styles['perfil-row__left']}>
          <span className={styles['perfil-row__emoji']} aria-hidden="true">{emoji}</span>
          <span className={styles['perfil-row__title']}>{title}</span>
        </div>

        {/* Icono +/× con rotación */}
        <motion.div
          className={styles['perfil-row__toggle']}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "tween", duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden="true"
        >
          +
        </motion.div>
      </button>

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`perfil-${perfil.id}`}
            className={styles['perfil-row__body']}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles['perfil-row__body-inner']}>
              {/* Descripción */}
              <p className={styles['perfil-row__desc']}>{description}</p>

              {/* Requisitos */}
              <ul className={styles['perfil-row__reqs']}>
                {requisitos.map((r, i) => (
                  <motion.li
                    key={i}
                    className={styles['perfil-row__req']}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  >
                    <span className={styles['perfil-row__req-check']} aria-hidden="true">✓</span>
                    {r}
                  </motion.li>
                ))}
              </ul>

              {/* Chips de habilidades */}
              <div className={styles['perfil-row__chips']}>
                {chips.map((chip, i) => (
                  <motion.span
                    key={chip}
                    className={styles['perfil-chip']}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 220 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Perfiles({ locale }: PerfilesProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const PERFILES = trabajaPerfiles[locale] || trabajaPerfiles.es;
  const t = trabajaTranslations[locale] || trabajaTranslations.es;

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className={styles['perfiles-section']}>
      <motion.p
        className={styles['tw-section-eyebrow']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        {t.profilesEyebrow}
      </motion.p>

      <motion.h2
        className={styles['perfiles__title']}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.profilesTitle}
      </motion.h2>

      <motion.div
        className={styles['perfiles-list']}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {PERFILES.map((perfil) => (
          <PerfilRow
            key={perfil.id}
            perfil={perfil}
            isOpen={openId === perfil.id}
            onToggle={() => toggle(perfil.id)}
          />
        ))}
      </motion.div>
    </section>
  );
}
