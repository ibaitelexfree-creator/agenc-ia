'use client';

import { motion } from 'framer-motion';
import { ValorData } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface ValorCardProps {
  valor: ValorData;
  index: number;
}

export function ValorCard({ valor, index }: ValorCardProps) {
  return (
    <motion.div
      className={styles['valor-card']}
      initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 90,
        damping: 16
      }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className={styles['valor-icon']}
        initial={{ rotate: -180, scale: 0 }}
        whileInView={{ rotate: 0, scale: 1 }}
        viewport={{ once: false }}
        transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 150, damping: 12 }}
      >
        {valor.icon}
      </motion.div>
      <h4 className={styles['valor-titulo']}>{valor.titulo}</h4>
      <p className={styles['valor-texto']}>{valor.texto}</p>
    </motion.div>
  );
}
