// HeroEquipos.tsx
import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";

// ── Variante letra por letra ──────────────────────────────────
const letterVariants: Variants = {
  hidden:  { opacity: 0, y: -80, rotateX: -45 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: {
      delay: i * 0.04,
      type: "spring",
      stiffness: 180,
      damping: 16,
    }
  })
};

// ── Variante para el subtítulo ────────────────────────────────
const subVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

// ── Variante para el scroll indicator ────────────────────────
const scrollDot: Variants = {
  animate: {
    y: [0, 10, 0],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
  }
};

const TITLE_WORD = "REGATAS";

export default function HeroEquipos() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className={styles['hero-equipos']}>

      {/* Eyebrow */}
      <motion.span
        className={styles['hero-eq__eyebrow']}
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={isInView
          ? { opacity: 1, letterSpacing: "0.25em" }
          : {}
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        GETXO BELA ESKOLA
      </motion.span>

      {/* Título — letras individuales con perspectiva 3D */}
      <div className={styles['hero-eq__title-wrapper']} style={{ perspective: "600px" }}>
        <h2 className={styles['hero-eq__title']}>
          {TITLE_WORD.split("").map((char, i) => (
            <motion.span
              key={i}
              className={styles['hero-eq__letter']}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
          {/* Para screen readers */}
          <span className="sr-only">{TITLE_WORD}</span>
        </h2>
      </div>

      {/* Línea bio que se dibuja — SVG */}
      <motion.svg
        className={styles['hero-eq__line']}
        viewBox="0 0 320 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M0 4 Q80 0 160 4 Q240 8 320 4"
          stroke="#E63900"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView
            ? { pathLength: 1, opacity: 1 }
            : {}
          }
          transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>

      {/* Subtítulo */}
      <motion.div
        className={styles['hero-eq__subtitle-block']}
        variants={subVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <p className={styles['hero-eq__subtitle-line']}>
          Entrenamientos y equipos
        </p>
        <p className={styles['hero-eq__subtitle-body']}>
          No buscamos campeonas a cualquier precio.<br/>
          Buscamos crecer navegando, compartir y disfrutar del camino juntas.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles['hero-eq__scroll']}
        aria-hidden="true"
        variants={scrollDot}
        animate="animate"
      >
        <span className={styles['hero-eq__scroll-line']} />
        <span className={styles['hero-eq__scroll-dot']} />
      </motion.div>

    </div>
  );
}
