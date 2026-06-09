'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  type?: 'words' | 'chars';
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function TextReveal({
  text,
  type = 'words',
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  once = true,
}: TextRevealProps) {
  // Configuración de variantes del contenedor
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Configuración de variantes para cada elemento (palabra o carácter)
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: '0.5em',
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 150,
      },
    },
  };

  // Si es tipo 'words', dividimos por espacios. Si es 'chars', dividimos por cada letra respetando palabras
  const renderContent = () => {
    if (type === 'words') {
      const words = text.split(' ');
      return words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span variants={itemVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ));
    } else {
      // Para chars, dividimos en palabras y luego en letras para no romper la separación
      const words = text.split(' ');
      return words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <span key={charIndex} className="inline-block overflow-hidden">
              <motion.span variants={itemVariants} className="inline-block">
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ));
    }
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {renderContent()}
    </motion.span>
  );
}
