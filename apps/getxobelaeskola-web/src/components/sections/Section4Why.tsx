// src/components/sections/Section4Why.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Seahorse } from '@/components/creatures/Seahorse'
import { Crab } from '@/components/creatures/Crab'

type FlipCardProps = {
  icon: React.ReactNode
  title: string
  hook: string
  label: string
  description: string
}

function FlipCard({ icon, title, hook, label, description }: FlipCardProps) {
  const t = useTranslations('s4')
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Rotate card either on desktop hover (state managed) or touch click
  const isRotated = hovered || flipped

  return (
    <div
      className="flip-card-wrapper"
      style={{
        position: 'relative',
        width: 'var(--card-w)',
        height: 'var(--card-h)',
        perspective: '1600px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <span className="sr-only">{title}. Pulsa para ver más detalles.</span>
      
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
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            boxShadow: isRotated ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
            transition: 'box-shadow var(--flip-duration) var(--flip-easing)',
            transformStyle: 'preserve-3d',
          }}
        >
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
          <h3
            className="flip-card__title"
            style={{
              fontFamily: 'var(--font-display-promise)',
              fontSize: 'var(--fs-card-title-front)',
              color: 'var(--color-navy-900)',
              margin: '0 0 10px',
              fontWeight: 600,
              transform: 'translateZ(90px)',
            }}
          >
            {title}
          </h3>
          <p
            className="flip-card__hook"
            style={{
              fontFamily: 'var(--font-body-promise)',
              fontSize: 'var(--fs-hook)',
              color: 'var(--color-ink-soft)',
              lineHeight: 1.5,
              margin: '0 0 16px',
              transform: 'translateZ(90px)',
            }}
          >
            {hook}
          </p>
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
            justifyContent: 'flex-start',
            padding: '28px 20px 20px',
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
              fontSize: 'var(--fs-eyebrow)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--color-gold)',
              margin: '0 0 12px',
              transform: 'translateZ(90px)',
            }}
          >
            {label}
          </span>
          <p
            className="flip-card__desc"
            style={{
              fontFamily: 'var(--font-body-promise)',
              fontSize: 'var(--fs-body)',
              color: 'var(--color-white)',
              opacity: 0.92,
              lineHeight: 1.6,
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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
}

export function Section4Why() {
  const t = useTranslations('s4')

  return (
    <section className="promise" aria-labelledby="promise-heading">
      {/* Seahorse — floating creature on the upper left corner */}
      <Seahorse
        style={{ position: 'absolute', top: '15%', left: '4%', zIndex: 15 }}
        enterDelay={0.5}
      />

      <div className="promise__inner">
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
            />
          </motion.div>

          <motion.div variants={item}>
            <FlipCard
              icon={<HandsIcon />}
              title={t('pillar2.title')}
              hook={t('pillar2.body')}
              label={t('pillar2.backTitle')}
              description={t('pillar2.backBody')}
            />
          </motion.div>

          <motion.div variants={item}>
            <FlipCard
              icon={<CompassIcon />}
              title={t('pillar3.title')}
              hook={t('pillar3.body')}
              label={t('pillar3.backTitle')}
              description={t('pillar3.backBody')}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Cangrejo — criatura de la esquina */}
      <Crab
        style={{ position: 'absolute', bottom: '3%', right: '10%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
