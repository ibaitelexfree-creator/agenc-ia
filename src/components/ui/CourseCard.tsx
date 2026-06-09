// src/components/ui/CourseCard.tsx
'use client'

import { motion } from 'framer-motion'

type CourseCardProps = {
  name: string
  duration?: string
  href?: string
  highlight?: boolean
  ctaLabel: string
}

export function CourseCard({ name, duration, href = '#', highlight = false, ctaLabel }: CourseCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{
        display: 'block',
        backgroundColor: highlight ? 'var(--ocean-bright)' : 'white',
        color: highlight ? 'white' : 'var(--ocean-deep)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        border: highlight ? 'none' : '1px solid rgba(10, 126, 200, 0.2)',
        textDecoration: 'none',
        boxShadow: highlight
          ? '0 4px 20px rgba(10, 126, 200, 0.3)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '0.5rem',
      }}
    >
      <p
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: duration ? '0.3rem' : 0,
        }}
      >
        {name}
      </p>
      {duration && (
        <p
          style={{
            fontSize: '0.75rem',
            opacity: highlight ? 0.85 : 0.6,
            fontWeight: 400,
          }}
        >
          {duration}
        </p>
      )}
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          marginTop: '0.5rem',
          color: highlight ? 'rgba(255,255,255,0.9)' : 'var(--ocean-bright)',
          letterSpacing: '0.05em',
        }}
      >
        {ctaLabel}
      </p>
    </motion.a>
  )
}
