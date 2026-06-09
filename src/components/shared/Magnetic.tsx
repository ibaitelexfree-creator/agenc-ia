'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({
  children,
  range = 40,      // Distancia máxima en px para empezar a atraer
  strength = 0.35,  // Multiplicador de fuerza (0.35 es sutil y elástico)
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Centro del elemento
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Distancia del cursor al centro
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Distancia euclidiana
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < range) {
      // Atraer el elemento hacia el cursor ponderado por la fuerza
      setPosition({ x: deltaX * strength, y: deltaY * strength });
    } else {
      // Si sale del rango, vuelve a su posición original
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
