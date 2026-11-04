'use client';

import { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";
import { useTranslations } from "next-intl";
import { ChevronRight, FileText } from "lucide-react";
import FlyerEquiposModal from "./modal/FlyerEquiposModal";

// ── Variante letra por letra ──────────────────────────────────
const letterVariants: Variants = {
  hidden:  { opacity: 0, y: -80, rotateX: -45 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: {
      delay: i * 0.03,
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

export default function HeroEquipos() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const t = useTranslations('equipos_entrenamiento.hero');

  const TITLE_WORD = "EQUIPOS DE ENTRENAMIENTO";

  return (
    <>
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
          <h1 className={styles['hero-eq__title']} style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}>
            {TITLE_WORD.split("").map((char, i) => (
              <motion.span
                key={char + i}
                className={styles['hero-eq__letter']}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <span className="sr-only">{TITLE_WORD}</span>
          </h1>
        </div>

        {/* Línea azul corporativa que se dibuja — SVG */}
        <motion.svg
          className={styles['hero-eq__line']}
          viewBox="0 0 320 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.path
            d="M0 4 Q80 0 160 4 Q240 8 320 4"
            stroke="#0f4080"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView
              ? { pathLength: 1, opacity: 1 }
              : {}
            }
            transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>

        {/* Subtítulo con Texto Corto oficial de Equipos */}
        <motion.div
          className={styles['hero-eq__subtitle-block']}
          variants={subVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className={styles['hero-eq__subtitle-line']}>
            Grupos estables para aprender y evolucionar en el mar
          </p>

          <p className={styles['hero-eq__subtitle-body']}>
            Grupos estables para todas las edades que permiten aprender y evolucionar en la mar de forma continua. Entrenamientos durante todo el año para ganar técnica, autonomía y confianza navegando en equipo.
          </p>

          {/* Botón Popup para ver la información completa / dossier */}
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsFlyerOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#0f4080] to-[#1a5eb0] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-[#0f4080]/25 hover:shadow-[#0f4080]/40 transition-all duration-300"
            >
              <FileText className="w-4 h-4 text-white/90" />
              <span>Ver Dossier Completo (Horarios, Precios y Condiciones)</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Modal Popup interactivo con desenfoque de fondo al hacer clic fuera */}
      <FlyerEquiposModal isOpen={isFlyerOpen} onClose={() => setIsFlyerOpen(false)} />
    </>
  );
}
