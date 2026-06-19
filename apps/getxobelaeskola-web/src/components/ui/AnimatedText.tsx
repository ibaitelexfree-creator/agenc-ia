// src/components/ui/AnimatedText.tsx
'use client'

import { motion } from 'framer-motion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type AnimatedTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  effect?: 'scramble' | 'fade-up' | 'chars' | 'falling' | 'falling-words'
  delay?: number
  style?: React.CSSProperties
  className?: string
}

// Efecto "chars" — cada letra entra individualmente
const charVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
}

// Efecto "falling" — las letras caen del cielo y rebotan
const fallingCharVariants = {
  hidden: { 
    opacity: 0, 
    y: -100, 
    scale: 0.5,
    rotate: -15,
    filter: 'blur(6px)'
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.035,
      type: 'spring' as const,
      stiffness: 130,
      damping: 11,
      mass: 0.75,
    },
  }),
}

// Efecto "falling-words" — las palabras caen del cielo y rebotan
const fallingWordVariants = {
  hidden: { 
    opacity: 0, 
    y: -60, 
    scale: 0.8,
    rotate: -6,
    filter: 'blur(3px)'
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.07,
      type: 'spring' as const,
      stiffness: 110,
      damping: 13,
      mass: 0.85,
    },
  }),
}

export function AnimatedText({
  text,
  as: Tag = 'span',
  effect = 'fade-up',
  delay = 0,
  style,
  className,
}: AnimatedTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { ref: scrambleRef, displayText } = useTextScramble(text)

  if (prefersReducedMotion) {
    return <Tag style={style} className={className}>{text}</Tag>
  }

  if (effect === 'scramble') {
    return (
      <Tag
        ref={scrambleRef as React.Ref<any>}
        style={{ fontVariantNumeric: 'tabular-nums', ...style }}
        className={className}
      >
        {displayText}
      </Tag>
    )
  }

  if (effect === 'chars') {
    return (
      <Tag style={{ display: 'inline', ...style }} className={className}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i + delay / 0.03}
            variants={charVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }

  if (effect === 'falling') {
    return (
      <Tag style={{ display: 'inline', ...style }} className={className}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i + delay / 0.035}
            variants={fallingCharVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
            style={{ display: 'inline-block', transformOrigin: 'center' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }

  if (effect === 'falling-words') {
    return (
      <Tag style={{ display: 'inline', ...style }} className={className}>
        {text.split(' ').map((word, i) => (
          <motion.span
            key={i}
            custom={i + delay / 0.07}
            variants={fallingWordVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
            style={{ display: 'inline-block', marginRight: '0.25em', transformOrigin: 'center' }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    )
  }

  // Default: fade-up
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <Tag style={style} className={className}>{text}</Tag>
    </motion.div>
  )
}
