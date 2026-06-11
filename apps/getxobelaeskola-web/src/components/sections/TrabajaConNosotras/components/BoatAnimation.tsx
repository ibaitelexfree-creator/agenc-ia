'use client';

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "../TrabajaConNosotras.module.css";
import { trabajaTranslations } from "../data/trabajaData";

interface BoatAnimationProps {
  state: "idle" | "dragover" | "sailing" | "success" | "error";
  locale: string;
}

function BoatSVG() {
  return (
    <svg width="52" height="36" viewBox="0 0 52 36" fill="none" aria-hidden="true">
      {/* Casco */}
      <path d="M4 22 Q26 30 48 22 L44 26 Q26 36 8 26 Z" fill="#0A3D5C" />
      {/* Mástil */}
      <line x1="26" y1="22" x2="26" y2="4" stroke="#0A3D5C" strokeWidth="1.5" />
      {/* Vela */}
      <path d="M26 6 Q38 12 34 22 Z" fill="#1A6FA8" opacity="0.85" />
      {/* Estela */}
      <motion.path
        d="M4 28 Q0 26 -8 28"
        stroke="#1A6FA8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.5}
        animate={{ opacity: [0.5, 0.2, 0.5], x: [0, -4, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function BoatAnimation({ state, locale }: BoatAnimationProps) {
  const t = trabajaTranslations[locale] || trabajaTranslations.es;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={styles['boat-anim-container']} aria-hidden="true">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            className={styles['boat-anim__idle']}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <span style={{ fontSize: "2rem" }}>📎</span>
            <p className={styles['boat-anim__idle-text']}>
              {t.dragzoneIdleText}
              <span className={styles['boat-anim__idle-sub']}>{t.dragzoneIdleSub}</span>
            </p>
          </motion.div>
        )}

        {state === "dragover" && (
          <motion.div
            key="dragover"
            className={styles['boat-anim__dragover']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              style={{ fontSize: "2.5rem", display: "block" }}
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🌊
            </motion.span>
            <p className={styles['boat-anim__idle-text']}>{t.dragzoneOverText}</p>
          </motion.div>
        )}

        {state === "sailing" && (
          <motion.div
            key="sailing"
            className={styles['boat-anim__sailing']}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={styles['boat-anim__boat-wrapper']}
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <BoatSVG />
            </motion.div>
            <p className={styles['boat-anim__idle-text']} style={{ marginTop: "0.5rem" }}>
              {t.dragzoneSailingText}
            </p>
          </motion.div>
        )}

        {(state === "success" || state === "error") && state === "success" && (
          <motion.div
            key="success"
            className={styles['boat-anim__success']}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.span
              style={{ fontSize: "2.5rem", display: "block" }}
              animate={shouldReduceMotion ? {} : { rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ✉️
            </motion.span>
            <p className={styles['boat-anim__success-text']}>{t.dragzoneSuccessText}</p>
            <p className={styles['boat-anim__success-filename']} id="boat-filename" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
