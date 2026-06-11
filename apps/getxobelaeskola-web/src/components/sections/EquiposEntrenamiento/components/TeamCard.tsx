// TeamCard.tsx
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";
import { Team } from "../data/teams";
import React from "react";

// ── Variantes del flip ────────────────────────────────────────
const flipVariants: Variants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const backContentVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.3 } }
};

interface TeamCardProps {
  team: Team;
  isActive: boolean;
  onToggle: () => void;
  entryDelay?: number;
}

// Custom CSS properties type declaration
interface CustomCSSProperties extends React.CSSProperties {
  "--accent"?: string;
}

// ── Componente ────────────────────────────────────────────────
export default function TeamCard({ team, isActive, onToggle, entryDelay = 0 }: TeamCardProps) {
  const { label, age, emoji, accentColor,
          description, schedule, focus, embarcaciones, note } = team;

  return (
    // Contenedor con perspectiva — da el efecto 3D al flip
    <motion.div
      className={styles['team-card-wrapper']}
      style={{ perspective: "900px" }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.7, delay: entryDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Capa que rota */}
      <motion.div
        className={styles['team-card-flipper']}
        animate={isActive ? "back" : "front"}
        variants={flipVariants}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ── CARA FRONTAL ────────────────────────────────── */}
        <div
          className={`${styles['team-card']} ${styles['team-card--front']}`}
          style={{ "--accent": accentColor } as CustomCSSProperties}
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
          aria-expanded={isActive}
          aria-label={`Ver equipo ${label}`}
        >
          {/* Borde superior coloreado */}
          <div className={styles['team-card__accent-bar']} />

          {/* Emoji grande */}
          <motion.div
            className={styles['team-card__emoji']}
            animate={isActive ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {emoji}
          </motion.div>

          <div className={styles['team-card__front-text']}>
            <span className={styles['team-card__label']}>{label}</span>
            <span className={styles['team-card__age']}>{age}</span>
          </div>

          {/* Indicador de apertura */}
          <motion.div
            className={styles['team-card__toggle-hint']}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>VER EQUIPO</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* ── CARA TRASERA ────────────────────────────────── */}
        <div
          className={`${styles['team-card']} ${styles['team-card--back']}`}
          style={{ "--accent": accentColor, transform: "rotateY(180deg)" } as CustomCSSProperties}
          onClick={onToggle}
          role="button"
          tabIndex={isActive ? 0 : -1}
          aria-label={`Cerrar equipo ${label}`}
        >
          {/* Borde de acento */}
          <div className={styles['team-card__accent-bar']} />

          {/* Contenido con su propia animación de entrada */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className={styles['team-card__back-content']}
                variants={backContentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className={styles['team-card__back-header']}>
                  <span className={styles['team-card__label']}>{label}</span>
                  <span className={styles['team-card__age']} style={{ color: accentColor }}>
                    {age}
                  </span>
                </div>

                <p className={styles['team-card__description']}>{description}</p>

                <div className={styles['team-card__meta']}>
                  <div className={styles['team-card__meta-row']}>
                    <span className={styles['team-card__meta-icon']}>📅</span>
                    <span>{schedule}</span>
                  </div>
                  <div className={styles['team-card__meta-row']}>
                    <span className={styles['team-card__meta-icon']}>🎯</span>
                    <span>{focus}</span>
                  </div>
                </div>

                {/* Chips de embarcaciones */}
                <div className={styles['team-card__chips']}>
                  {embarcaciones.map((e) => (
                    <span key={e} className={styles['team-card__chip']}
                          style={{ borderColor: accentColor }}>
                      {e}
                    </span>
                  ))}
                </div>

                {/* Nota especial si existe */}
                {note && (
                  <p className={styles['team-card__note']}>{note}</p>
                )}

                {/* Cerrar */}
                <button className={styles['team-card__close']}>
                  ↑ cerrar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
}
