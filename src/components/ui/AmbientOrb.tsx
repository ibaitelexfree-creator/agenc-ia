'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AmbientOrbProps {
  color?: 'accent' | 'brass' | 'blue' | string;
  size?: string; // e.g. 'w-[300px] h-[300px]'
  className?: string;
  delay?: number;
}

export default function AmbientOrb({
  color = 'accent',
  size = 'w-[400px] h-[400px]',
  className = '',
  delay = 0,
}: AmbientOrbProps) {
  // Mapear colores predefinidos o aceptar uno customizado
  const getColorClass = () => {
    switch (color) {
      case 'accent':
        return 'bg-accent/15'; // --buoy-orange o similar
      case 'brass':
        return 'bg-[#c5a059]/15'; // --brass-gold
      case 'blue':
        return 'bg-nautical-blue/20'; // --nautical-blue
      default:
        return color; // Clase de Tailwind o bg- hex
    }
  };

  return (
    <motion.div
      className={`absolute rounded-full filter blur-[80px] pointer-events-none mix-blend-screen ${size} ${getColorClass()} ${className}`}
      initial={{ scale: 0.9, opacity: 0.5, x: 0, y: 0 }}
      animate={{
        scale: [0.9, 1.1, 0.95, 1.05, 0.9],
        opacity: [0.4, 0.7, 0.5, 0.6, 0.4],
        x: [0, 30, -20, 15, 0],
        y: [0, -40, 20, -10, 0],
      }}
      transition={{
        duration: 15,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
        delay,
      }}
    />
  );
}
