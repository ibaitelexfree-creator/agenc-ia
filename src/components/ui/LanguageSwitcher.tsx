// src/components/ui/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const LOCALES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'eu', label: 'EU', name: 'Euskera' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: string) => {
    // Reemplazar el locale en el pathname actual
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setIsOpen(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
      }}
    >
      {/* Botón del locale actual */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: 'rgba(13, 33, 55, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74, 175, 232, 0.3)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {locale.toUpperCase()} ▾
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '6px',
              backgroundColor: 'rgba(13, 33, 55, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(74, 175, 232, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: '120px',
            }}
          >
            {LOCALES.map((loc) => (
              <motion.button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                whileHover={{ backgroundColor: 'rgba(10, 126, 200, 0.3)' }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px',
                  color: locale === loc.code ? 'var(--ocean-light)' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.85rem',
                  fontWeight: locale === loc.code ? 600 : 400,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ marginRight: '8px', opacity: 0.7 }}>{loc.label}</span>
                {loc.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
