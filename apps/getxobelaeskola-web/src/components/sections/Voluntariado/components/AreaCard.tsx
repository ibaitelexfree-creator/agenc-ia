'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AreaData } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface AreaCardProps {
  area: AreaData;
  index: number;
}

export function AreaCard({ area, index }: AreaCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles['area-card']}
      style={{ backgroundColor: area.color }}
      
      // Entrada en stagger
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 18
      }}
      
      // Hover flotante
      whileHover={shouldReduceMotion ? {} : {
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 102, 204, 0.12)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      {/* Icono con bounce propio */}
      <motion.div
        className={styles['area-emoji']}
        whileHover={shouldReduceMotion ? {} : { rotate: [0, -10, 10, -5, 0], scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        {area.emoji}
      </motion.div>

      <div className={styles['area-text']}>
        <h3 className={styles['area-titulo']}>{area.titulo}</h3>
        <span className={styles['area-subtitulo']}>{area.subtitulo}</span>
        <p className={styles['area-desc']}>{area.descripcion}</p>
      </div>
    </motion.div>
  );
}
