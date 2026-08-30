// src/components/sections/Section4Why.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
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
      className={`flip-card ${isRotated ? 'is-flipped' : ''}`}
      tabIndex={0}
      role="button"
      aria-expanded={isRotated}
      aria-label={`${title}. ${isRotated ? description : hook}`}
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
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (hovered) setHovered(false)
        }
      }}
    >
      <div className="flip-card__inner">
        {/* Front Face */}
        <div className="flip-card__face flip-card__face--front">
          <span className="flip-card__icon">
            {icon}
          </span>
          <h3 className="flip-card__title">
            {title}
          </h3>
          <p className="flip-card__hook">
            {hook}
          </p>
          <span className="flip-card__cta">
            Descubrir más ↻
          </span>
        </div>

        {/* Back Face */}
        <div className="flip-card__face flip-card__face--back">
          <span className="flip-card__label">
            {label}
          </span>
          <p className="flip-card__desc">
            {description}
          </p>
        </div>
      </div>
      <div className="flip-card__overlay" aria-hidden="true" />
    </div>
  )
}

const CoinIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 14v20M29 18.5c0-2.5-2.5-4.5-5.5-4.5S18 15.7 18 18.2c0 5 11 3.4 11 8.4 0 2.6-2.7 4.4-6 4.4s-6-1.9-6-4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const HandsIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <path d="M6 24l8-8 8 4 6-4 8 6-6 6-8-4-6 4-10-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 28l6 6 6-4M28 26l4 4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CompassIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
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
  const tHome = useTranslations('home.features')
  const [isPhone, setIsPhone] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  const t = (key: string) => {
    switch (key) {
      case 'title': return tHome('title') || 'Por qué elegirnos'
      case 'eyebrow': return ''
      case 'pillar1.title': return 'Económico'
      case 'pillar1.body': return 'Creemos que la vela debe estar al alcance de todo el mundo.'
      case 'pillar1.backTitle': return 'Vela para todos'
      case 'pillar1.backBody': return 'Al ser una escuela municipal, trabajamos para democratizarla con precios accesibles. Si navegas con asiduidad y te haces socio/a, puedes salir a navegar desde 52,5€ al mes.'
      case 'pillar2.title': return 'Comunidad'
      case 'pillar2.body': return 'No somos solo una escuela, somos una comunidad muy cercana y con valores.'
      case 'pillar2.backTitle': return 'Nuestra familia'
      case 'pillar2.backBody': return 'Un lugar donde conocer gente con las mismas ganas de mar, compartir experiencias y crecer navegando juntos. Aquí vienes a aprender, pero también a formar parte de algo.'
      case 'pillar3.title': return 'A tu medida'
      case 'pillar3.body': return 'Cada persona es diferente, y aquí lo tenemos muy en cuenta.'
      case 'pillar3.backTitle': return 'Tu experiencia'
      case 'pillar3.backBody': return 'No todo el mundo busca lo mismo al salir al mar, por eso adaptamos la experiencia a ti desde el primer momento. Cuéntanos qué te apetece, cuál es tu ritmo y tus objetivos, y te ayudamos a encontrar la forma de navegar que mejor encaje contigo.'
      default: return key
    }
  }

  useEffect(() => {
    const checkSize = () => setIsPhone(window.innerWidth < 768)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.flip-card')) {
        setActiveCardIndex(null)
      }
    }

    const handleFocusChange = () => {
      const active = document.activeElement as HTMLElement
      if (!active?.closest('.flip-card')) {
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
    <section className="promise" aria-labelledby="promise-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Magical Marine Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} className="pointer-events-none select-none">
        <Image
          src="/images/ai/section4-community.webp"
          alt="Comunidad y Mar"
          fill
          quality={70}
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.4 }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(135deg, rgba(11, 61, 99, 0.9) 0%, rgba(14, 116, 144, 0.75) 100%)' 
        }} />
      </div>

      <div className="promise__inner" style={{ position: 'relative', zIndex: 2 }}>
        {t('eyebrow') ? (
          <>
            <p className="promise__eyebrow" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('title')}</p>
            <h2 id="promise-heading" className="promise__title" style={{ color: 'white' }}>{t('eyebrow')}</h2>
          </>
        ) : (
          <h2 id="promise-heading" className="promise__title" style={{ color: 'white' }}>{t('title')}</h2>
        )}

        <motion.div
          className="promise__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={item} className="promise__item">
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

          <motion.div variants={item} className="promise__item">
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

          <motion.div variants={item} className="promise__item">
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
        style={{ position: 'absolute', bottom: '5%', right: isPhone ? '25%' : '10%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
