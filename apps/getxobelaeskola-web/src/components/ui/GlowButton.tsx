'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'
import { useRipple } from '@/hooks/useRipple'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type GlowButtonProps = {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  color?: 'coral' | 'ocean' | 'garnet'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  external?: boolean
}

export function GlowButton({
  href,
  onClick,
  children,
  color = 'coral',
  size = 'md',
  external = false,
}: GlowButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { x: magX, y: magY } = useMagneticCursor(ref, { strength: 0.45, radius: 80 })
  const { createRipple, RippleContainer } = useRipple()

  const bgColor =
    color === 'coral'
      ? 'var(--coral)'
      : color === 'garnet'
      ? '#A91D22'
      : 'var(--ocean-bright)'
  const glowColor =
    color === 'coral'
      ? 'rgba(232, 89, 60, 0.5)'
      : color === 'garnet'
      ? 'rgba(169, 29, 34, 0.5)'
      : 'rgba(10, 126, 200, 0.5)'

  const padding = size === 'xxl' ? '1.3rem 4rem' : size === 'xl' ? '1.1rem 3.5rem' : size === 'lg' ? '1rem 3rem' : size === 'sm' ? '0.5rem 1.4rem' : '0.85rem 2.5rem'
  const fontSize = size === 'xxl' ? '1.35rem' : size === 'xl' ? '1.2rem' : size === 'lg' ? '1.1rem' : size === 'sm' ? '0.85rem' : '1rem'

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={(e) => {
        createRipple(e as any)
        onClick?.()
      }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        position: 'relative',
        display: 'inline-block',
        backgroundColor: bgColor,
        color: 'white',
        padding,
        borderRadius: '50px',
        fontSize: 'inherit',
        fontWeight: 700,
        textDecoration: 'none',
        letterSpacing: '0.04em',
        overflow: 'hidden',
        x: magX,
        y: magY,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: [
                `0 4px 20px ${glowColor}`,
                `0 6px 32px ${glowColor}`,
                `0 4px 20px ${glowColor}`,
              ],
            }
      }
    >
      {children}
      <RippleContainer />
    </motion.a>
  )
}
