// src/components/ui/ExperienceToggle.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRipple } from '@/hooks/useRipple'

type ExperienceToggleProps = {
  label: string
  optionA: { label: string; description: string }
  optionB: { label: string; description: string }
  onToggle?: (selected: 'a' | 'b') => void
}

export function ExperienceToggle({ label, optionA, optionB, onToggle }: ExperienceToggleProps) {
  const [selected, setSelected] = useState<'a' | 'b'>('a')
  const { createRipple, RippleContainer } = useRipple()

  const handleSelect = (option: 'a' | 'b') => {
    setSelected(option)
    onToggle?.(option)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--foam)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(10, 126, 200, 0.15)',
      }}
    >
      {/* Etiqueta */}
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
        }}
      >
        {label}
      </p>

      {/* Botones de toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '0.75rem',
        }}
      >
        {(['a', 'b'] as const).map((opt) => {
          const option = opt === 'a' ? optionA : optionB
          const isActive = selected === opt
          return (
            <motion.button
              key={opt}
              onClick={(e) => {
                createRipple(e)
                handleSelect(opt)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                border: isActive
                  ? '2px solid var(--ocean-bright)'
                  : '2px solid transparent',
                backgroundColor: isActive ? 'var(--ocean-bright)' : 'white',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {option.label}
              <RippleContainer />
            </motion.button>
          )
        })}
      </div>

      {/* Descripción animada */}
      <AnimatePresence mode="wait">
        <motion.p
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {selected === 'a' ? optionA.description : optionB.description}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
