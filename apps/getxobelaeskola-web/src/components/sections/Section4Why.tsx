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
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="sr-only">{title}. Pulsa para ver más detalles.</span>
      <div className="flip-card__inner">
        <div className="flip-card__face flip-card__face--front">
          <span className="flip-card__icon" aria-hidden="true">{icon}</span>
          <h3 className="flip-card__title">{title}</h3>
          <p className="flip-card__hook">{hook}</p>
          <span className="flip-card__cta">Descubre más ↻</span>
        </div>
        <div className="flip-card__face flip-card__face--back">
          <span className="flip-card__label">{label}</span>
          <p className="flip-card__desc">{description}</p>
        </div>
      </div>
      {/* Flat transparent overlay captures cursor events on top, protecting 3D hover state */}
      <div className="flip-card__overlay" />
    </button>
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
        <p className="promise__eyebrow">{t('title')}</p>
        <h2 id="promise-heading" className="promise__title">{t('eyebrow')}</h2>

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
