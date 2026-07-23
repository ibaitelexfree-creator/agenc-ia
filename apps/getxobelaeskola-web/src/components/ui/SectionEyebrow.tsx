'use client'

import { motion } from 'framer-motion'
import { AnimatedText } from './AnimatedText'

type SectionEyebrowProps = {
  text: string
  color?: string
  fontSize?: string
  hideLineOnMobile?: boolean
}

export function SectionEyebrow({ text, color = 'var(--ocean-bright)', fontSize = '0.7rem', hideLineOnMobile = false }: SectionEyebrowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '0.75rem',
      }}
    >
      {/* Línea decorativa que crece */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={hideLineOnMobile ? "hidden md:block" : ""}
        style={{
          width: '32px',
          height: '2px',
          backgroundColor: color,
          transformOrigin: 'left',
          flexShrink: 0,
          marginTop: '3px'
        }}
      />
      <AnimatedText
        text={text}
        effect="falling"
        delay={0.1}
        style={{
          fontSize,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color,
          margin: 0,
        }}
      />
    </motion.div>
  )
}
