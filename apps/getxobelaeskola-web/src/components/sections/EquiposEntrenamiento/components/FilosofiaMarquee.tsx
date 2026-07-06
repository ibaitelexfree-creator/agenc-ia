// FilosofiaMarquee.tsx
import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";
import { useTranslations } from "next-intl";

export default function FilosofiaMarquee() {
  const isHovered = useRef(false);
  const t = useTranslations('equipos_entrenamiento');
  
  const WORDS: string[] = t.raw('marquee') || [];

  // Duplicamos para el efecto seamless
  const TEXT = [...WORDS, ...WORDS]
    .map((w) => `${w}  ·  `)
    .join("");

  return (
    <div
      className={styles['marquee-band']}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      aria-hidden="true"                         /* decorativo */
    >
      <motion.div
        className={styles['marquee-track']}
        animate={{ x: [0, "-50%"] }}             /* mueve exactamente la mitad */
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={{ animationPlayState: "paused" }}   /* pausa al hover */
      >
        <span className={styles['marquee-text']}>{TEXT}</span>
        <span className={styles['marquee-text']} aria-hidden="true">{TEXT}</span>
      </motion.div>
    </div>
  );
}
