// src/components/ui/AnimatedText.tsx
'use client'

import { motion } from 'framer-motion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type AnimatedTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  effect?: 'scramble' | 'fade-up' | 'chars'
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
            viewport={{ once: false }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
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
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <Tag style={style} className={className}>{text}</Tag>
    </motion.div>
  )
}
