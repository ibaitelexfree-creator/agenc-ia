// src/components/sections/Section4Why.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Seahorse } from '@/components/creatures/Seahorse'
import { Crab } from '@/components/creatures/Crab'

interface FlipCardProps {
  icon: React.ReactNode
  title: string
  hook: string
  label: string
  description: string
  isPhone?: boolean
  isFlipped: boolean
  onToggle: () => void
}

function FlipCard({ icon, title, hook, label, description, isPhone = false, isFlipped, onToggle }: FlipCardProps) {
  const t = useTranslations('s4')
  const [hovered, setHovered] = useState(false)

  // Rotate card either on desktop hover (state managed) or touch click
  const isRotated = hovered || isFlipped

  return (
    <div
      className="flip-card-wrapper"
      tabIndex={0}
      role="button"
      aria-expanded={isRotated}
      aria-label={`${title}. ${isRotated ? description : hook}`}
      style={{
        position: 'relative',
        width: isPhone ? '80vw' : 'var(--card-w)',
        height: isPhone ? '150px' : 'var(--card-h)',
        margin: isPhone ? '0 auto' : '0',
        perspective: '1600px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      onBlur={(e) => {
        // Reset card state when focus leaves this wrapper
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (hovered) setHovered(false)
        }
      }}
    >
      <span className="sr-only">{title}. Pulsa Enter para dar la vuelta.</span>
      
      {/* 3D Inner container that rotates */}
      <div
        className="flip-card__inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform var(--flip-duration) var(--flip-easing)',
          transformStyle: 'preserve-3d',
          transform: isRotated ? 'rotateY(180deg)' : 'rotateY(0deg)',
          pointerEvents: 'none', // Ignore pointer events so they don't trigger mouseleave during rotation
        }}
      >
        {/* Front Face */}
        <div
          className="flip-card__face flip-card__face--front"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 'var(--card-radius)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isPhone ? 'flex-start' : 'center',
            justifyContent: isPhone ? 'space-between' : 'center',
            padding: isPhone ? '16px 20px' : '24px 20px',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            boxShadow: isRotated ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
            transition: 'box-shadow var(--flip-duration) var(--flip-easing)',
            transformStyle: 'preserve-3d',
          }}
        >
          {!isPhone && (
            <span
              className="flip-card__icon"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-gold-soft)',
                color: 'var(--color-navy-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                transition: 'transform var(--flip-duration) var(--flip-easing)',
                transform: isRotated ? 'translateZ(90px) scale(1.08)' : 'translateZ(90px)',
              }}
            >
              {icon}
            </span>
          )}
          <h3
            className="flip-card__title"
            style={{
              fontFamily: 'var(--font-display-promise)',
              fontSize: isPhone ? '1.15rem' : 'var(--fs-card-title-front)',
              color: 'var(--color-navy-900)',
              margin: '0 0 4px',
              fontWeight: 600,
              transform: 'translateZ(90px)',
              textAlign: 'left',
            }}
          >
            {title}
          </h3>
          <p
            className="flip-card__hook"
            style={{
              fontFamily: 'var(--font-body-promise)',
              fontSize: isPhone ? '0.78rem' : 'var(--fs-hook)',
              color: 'var(--color-ink-soft)',
              lineHeight: 1.4,
              margin: isPhone ? '0' : '0 0 16px',
              transform: 'translateZ(90px)',
              textAlign: 'left',
            }}
          >
            {hook}
          </p>

          {isPhone ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateZ(90px)', marginTop: '8px' }}>
              <span
                className="flip-card__icon"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-gold-soft)',
                  color: 'var(--color-navy-900)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ transform: 'scale(0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon}
                </div>
              </span>
              <span
                className="flip-card__cta"
                style={{
                  fontFamily: 'var(--font-body-promise)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.02em',
                }}
              >
                {t('cta')}
              </span>
            </div>
          ) : (
            <span
              className="flip-card__cta"
              style={{
                fontFamily: 'var(--font-body-promise)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-gold)',
                letterSpacing: '0.02em',
                transform: 'translateZ(90px)',
              }}
            >
              {t('cta')}
            </span>
          )}
        </div>

        {/* Back Face */}
        <div
          className="flip-card__face flip-card__face--back"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 'var(--card-radius)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isPhone ? 'center' : 'flex-start',
            padding: isPhone ? '16px' : '28px 20px 20px',
            background: 'linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%)',
            transform: 'rotateY(180deg)',
            boxShadow: isRotated ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
            transition: 'box-shadow var(--flip-duration) var(--flip-easing)',
            transformStyle: 'preserve-3d',
          }}
        >
          <span
            className="flip-card__label"
            style={{
              fontFamily: 'var(--font-body-promise)',
              fontSize: isPhone ? '0.75rem' : 'var(--fs-eyebrow)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--color-gold)',
              margin: isPhone ? '0 0 6px' : '0 0 12px',
              transform: 'translateZ(90px)',
            }}
          >
            {label}
          </span>
          <p
            className="flip-card__desc"
            style={{
              fontFamily: 'var(--font-body-promise)',
              fontSize: isPhone ? '0.78rem' : 'var(--fs-body)',
              color: 'var(--color-white)',
              opacity: 0.92,
              lineHeight: 1.5,
              margin: 0,
              textAlign: 'center',
              transform: 'translateZ(90px)',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

const CoinIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
    <path d="M24 14v20M29 18.5c0-2.5-2.5-4.5-5.5-4.5S18 15.7 18 18.2c0 5 11 3.4 11 8.4 0 2.6-2.7 4.4-6 4.4s-6-1.9-6-4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
)

const HandsIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <path d="M6 24l8-8 8 4 6-4 8 6-6 6-8-4-6 4-10-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M14 28l6 6 6-4M28 26l4 4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const CompassIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
    <path d="M30 18l-8 6-4 8 8-6 4-8z" fill="currentColor"/>
  </svg>
)

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] as const } },
}

export function Section4Why() {
  const t = useTranslations('s4')
  const [isPhone, setIsPhone] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  useEffect(() => {
    const checkSize = () => setIsPhone(window.innerWidth < 768)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.flip-card-wrapper')) {
        setActiveCardIndex(null)
      }
    }

    const handleFocusChange = () => {
      const active = document.activeElement as HTMLElement
      if (!active?.closest('.flip-card-wrapper')) {
        setActiveCardIndex(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('focusin', handleFocusChange)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [])

  return (
    <section className="promise" aria-labelledby="promise-heading">
      {/* Seahorse — floating creature on the upper left corner */}
      <Seahorse
        style={{ position: 'absolute', top: '15%', left: '4%', zIndex: 15 }}
        enterDelay={0.5}
      />

      <div className="promise__inner" style={{ transform: isPhone ? 'translateY(7%)' : 'none', transition: 'transform 0.3s ease' }}>
        {t('eyebrow') ? (
          <>
            <p className="promise__eyebrow">{t('title')}</p>
            <h2 id="promise-heading" className="promise__title">{t('eyebrow')}</h2>
          </>
        ) : (
          <h2 id="promise-heading" className="promise__title">{t('title')}</h2>
        )}

        <motion.div
          className="promise__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={item}>
            <FlipCard
              icon={<CoinIcon />}
              title={t('pillar1.title')}
              hook={t('pillar1.body')}
              label={t('pillar1.backTitle')}
              description={t('pillar1.backBody')}
              isPhone={isPhone}
              isFlipped={activeCardIndex === 0}
              onToggle={() => setActiveCardIndex(activeCardIndex === 0 ? null : 0)}
            />
          </motion.div>

          <motion.div variants={item}>
            <FlipCard
              icon={<HandsIcon />}
              title={t('pillar2.title')}
              hook={t('pillar2.body')}
              label={t('pillar2.backTitle')}
              description={t('pillar2.backBody')}
              isPhone={isPhone}
              isFlipped={activeCardIndex === 1}
              onToggle={() => setActiveCardIndex(activeCardIndex === 1 ? null : 1)}
            />
          </motion.div>

          <motion.div variants={item}>
            <FlipCard
              icon={<CompassIcon />}
              title={t('pillar3.title')}
              hook={t('pillar3.body')}
              label={t('pillar3.backTitle')}
              description={t('pillar3.backBody')}
              isPhone={isPhone}
              isFlipped={activeCardIndex === 2}
              onToggle={() => setActiveCardIndex(activeCardIndex === 2 ? null : 2)}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Cangrejo — criatura de la esquina */}
      <Crab
        style={{ position: 'absolute', bottom: '3%', right: isPhone ? '25%' : '10%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
