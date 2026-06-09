// src/components/ui/ShimmerBadge.tsx
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type ShimmerBadgeProps = {
  children: React.ReactNode
  color?: 'gold' | 'ocean' | 'coral'
}

const colorMap = {
  gold: {
    bg: 'var(--gold)',
    text: 'var(--ocean-deep)',
    shimmer: 'rgba(255,255,255,0.6)',
  },
  ocean: {
    bg: 'var(--ocean-bright)',
    text: 'white',
    shimmer: 'rgba(255,255,255,0.4)',
  },
  coral: {
    bg: 'var(--coral)',
    text: 'white',
    shimmer: 'rgba(255,255,255,0.4)',
  },
}

export function ShimmerBadge({ children, color = 'gold' }: ShimmerBadgeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { bg, text, shimmer } = colorMap[color]

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        backgroundColor: bg,
        color: text,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: '20px',
        overflow: 'hidden',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}

      {/* Barrido de brillo */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60%',
            height: '100%',
            background: `linear-gradient(90deg, transparent 0%, ${shimmer} 50%, transparent 100%)`,
            pointerEvents: 'none',
          }}
          animate={{ translateX: ['-100%', '250%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />
      )}
    </span>
  )
}
