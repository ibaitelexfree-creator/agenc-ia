'use client';

import { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import styles from "../Regatas.module.css";
import { useTranslations } from "next-intl";
import { ChevronRight, Sparkles } from "lucide-react";
import RegatasModal from "./RegatasModal";

// Variante letra por letra
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

// Variante para el subtítulo
const subVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function HeroRegatas() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('equipos_entrenamiento.hero');

  const TITLE_WORD = "REGATAS";

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
          <h1 className={styles['hero-eq__title']}>
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
                {char}
              </motion.span>
            ))}
            <span className="sr-only">{TITLE_WORD}</span>
          </h1>
        </div>

        {/* Línea roja trazada — SVG */}
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

        {/* Subtítulo y Texto Corto */}
        <motion.div
          className={styles['hero-eq__subtitle-block']}
          variants={subVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className={styles['hero-eq__subtitle-line']}>
            La competición como aprendizaje y disfrute
          </p>

          <p className={styles['hero-eq__subtitle-body']}>
            La competición como aprendizaje y disfrute, no obligación. Participamos en regatas locales para mejorar técnica y confianza desde un enfoque humano. No buscamos campeonas, sino crecer navegando y vivir la mar intensamente.
          </p>

          {/* Botón interactivo para desplegar texto largo en modal emergente con blur */}
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#E63900] to-[#ff5722] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-[#E63900]/25 hover:shadow-[#E63900]/40 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-white/90" />
              <span>Conoce nuestra filosofía de regata</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal Popup interactivo con desenfoque de fondo */}
      <RegatasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
