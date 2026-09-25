// src/components/sections/Section4Why.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Crab } from '@/components/creatures/Crab'
import { Section3To4CurvedExtension, S3ToS4CurveVariant } from '@/components/home-prototypes/Section3To4CurvedExtension'

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

interface Section4WhyProps {
  variant?: S3ToS4CurveVariant
  contentVariant?: string
}

export function Section4Why({ variant, contentVariant }: Section4WhyProps = {}) {
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

  const [windowWidth, setWindowWidth] = useState(1440)

  useEffect(() => {
    const checkSize = () => {
      setIsPhone(window.innerWidth < 768)
      setWindowWidth(window.innerWidth)
    }
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

  const isSupportedWave = Boolean(variant && ['home-3', 'home-4', 'home-5', 'home-6', 'home-7', 'home-8', 'home-9', 'home-10', 'home-11', 'home-12', 'home-13'].includes(variant))

  return (
    <section 
      className="promise" 
      aria-labelledby="promise-heading" 
      style={{ 
        position: 'relative', 
        zIndex: 1, 
        overflow: isSupportedWave ? 'visible' : 'hidden' 
      }}
    >
      {/* ClipPaths para la ola izquierda con distintas curvaturas y formas */}
      {isSupportedWave && (
        <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
          <defs>
            {/* Forma estándar suave Home 3 */}
            <clipPath id="s4-left-wave-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,1 L 0,0.22 C 0.20,0.08 0.48,0.48 0.72,0.32 C 0.86,0.22 0.94,0.58 1,1 Z" />
            </clipPath>
            {/* Forma elegante elegida (procedente de Home 7 anterior) */}
            <clipPath id="s4-wave-clip-form4" clipPathUnits="objectBoundingBox">
              <path d="M 0,1 L 0,0.45 C 0.28,0.22 0.52,0.58 0.75,0.44 C 0.88,0.36 0.95,0.68 1,1 Z" />
            </clipPath>
          </defs>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* CONFIGURACIÓN Y ESTRATEGIAS DE ALINEACIÓN CONTINUA DE IMAGEN ENTRE S3 Y S4  */}
      {/* Home 3: Base continua pura (ancho 100vw, top 0, ola a -188px de Sección 4) */}
      {/* Home 4: Ampliación moderada (+10%) centrada para zoom equilibrado         */}
      {/* Home 5: Ampliación media (+20%) con anclaje superior (muestra más horizonte)*/}
      {/* Home 6: Ampliación pronunciada (+30%) con encaje continuo perfecto        */}
      {/* Home 7: Zoom dinámico panorámico (+15%) compensado en altura               */}
      {/* Home 8: Extensión continua unificada con origen calculado en la ola       */}
      {/* ========================================================================= */}
      {(() => {
        // Altura aproximada de la ola que sobresale por encima de la Sección 4
        // En desktop: 188px; en mobile: 116px - usamos un offset estándar de 188px
        const strategies: Record<string, {
          scale: number
          waveTop: string
          waveX: string
          waveY: string
          containerY: string
          objectPosition: string
          shadowMode: 'base' | 'no-top-gradient' | 'negative-overlap' | 'flat-tone' | 'pure-clean'
        }> = {
          'home-3': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '0%',
            waveY: '0%',
            containerY: '0%',
            objectPosition: 'center 35%',
            shadowMode: 'base',
          },
          'home-4': {
            // Home 8 previa copiada a Home 4 (fusión pura y limpia)
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-5': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-6': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-7': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-8': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-9': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-10': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-11': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-12': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
          'home-13': {
            scale: 1.0,
            waveTop: '0px',
            waveX: '5.7%',
            waveY: '0.8%',
            containerY: '0.4%',
            objectPosition: 'center 55%',
            shadowMode: 'pure-clean',
          },
        }

        const currentStrategy = (variant && strategies[variant]) || strategies['home-3']

        const waveConfig = {
          sizeClass: 'w-[102%] sm:w-[78%] lg:w-[58%] h-[70px] sm:h-[151px] lg:h-[188px]',
          leftClass: 'left-[-14%]',
          clipId: 's4-wave-clip-form4',
        }

        return (
          <>
            {/* ========================================================================= */}
            {/* FONDO MARINO DE LA SECCIÓN 4 EXACTO COMO EN SECCIÓN 2 (COMPLETO SIN CORTES)*/}
            {/* ========================================================================= */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
              <Image
                src="/images/ai/cta-sunset.webp"
                alt="Getxo Bela Eskola Comunidad"
                fill
                quality={85}
                priority
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: currentStrategy.objectPosition 
                }}
              />
              {/* Capa de degradado azul marino adaptada según shadowMode */}
              {currentStrategy.shadowMode === 'no-top-gradient' ? (
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0) 0%, rgba(11, 61, 99, 0.4) 40%, rgba(0, 27, 58, 0.8) 100%)',
                  }} 
                />
              ) : currentStrategy.shadowMode === 'flat-tone' ? (
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: 'rgba(0, 27, 58, 0.35)',
                  }} 
                />
              ) : currentStrategy.shadowMode === 'pure-clean' ? (
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 27, 58, 0.7) 100%)',
                  }} 
                />
              ) : (
                <>
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: 'radial-gradient(circle at center, rgba(0, 27, 58, 0.2) 0%, rgba(0, 27, 58, 0.88) 100%)',
                    }} 
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0.35) 0%, rgba(11, 61, 99, 0.7) 50%, rgba(0, 27, 58, 0.85) 100%)',
                    }} 
                  />
                </>
              )}
            </div>

            {/* ========================================================================= */}
            {/* OLA CURVA IZQUIERDA HACIA LA SECCIÓN 3 CON LA MISMA ESCALA Y ENCAJE      */}
            {/* ========================================================================= */}
            {isSupportedWave && (
              <div
                className={`absolute bottom-[100%] ${waveConfig.leftClass} z-20 pointer-events-none select-none overflow-hidden ${waveConfig.sizeClass} s4-top-wave-container ${currentStrategy.shadowMode === 'negative-overlap' ? 'translate-y-[4px]' : ''}`}
                style={{
                  clipPath: `url(#${waveConfig.clipId})`,
                  WebkitClipPath: `url(#${waveConfig.clipId})`,
                  transform: `translateY(${currentStrategy.containerY})`,
                }}
                aria-hidden="true"
              >
                <div className="w-full h-full relative overflow-hidden">
                  {/* Lienzo del mismo ancho que la pantalla y alineado al 100% con la Sección 4 */}
                  <div 
                    className="absolute w-[100vw] h-[1000px] pointer-events-none"
                    style={{
                      left: '14%', // Contrarresta waveConfig.leftClass (left: -14%) para alinearse con los bordes de pantalla
                      top: currentStrategy.waveTop,
                      transform: `scale(${currentStrategy.scale}) translate(${currentStrategy.waveX}, ${currentStrategy.waveY})`,
                    }}
                  >
                    <Image
                      src="/images/ai/cta-sunset.webp"
                      alt=""
                      fill
                      quality={85}
                      priority
                      className="object-cover"
                      style={{ objectPosition: currentStrategy.objectPosition }}
                    />

                    {/* Filtro azul en la ola coordinado con shadowMode */}
                    {currentStrategy.shadowMode === 'no-top-gradient' ? (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0) 0%, rgba(11, 61, 99, 0.3) 100%)',
                        }} 
                      />
                    ) : currentStrategy.shadowMode === 'flat-tone' ? (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          background: 'rgba(0, 27, 58, 0.35)',
                        }} 
                      />
                    ) : currentStrategy.shadowMode === 'pure-clean' ? (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          background: 'transparent',
                        }} 
                      />
                    ) : (
                      <>
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{ 
                            background: 'radial-gradient(circle at center, rgba(0, 27, 58, 0.2) 0%, rgba(0, 27, 58, 0.88) 100%)',
                          }} 
                        />
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{ 
                            background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0.35) 0%, rgba(11, 61, 99, 0.6) 50%, rgba(0, 27, 58, 0.8) 100%)',
                          }} 
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )
      })()}

      {/* Prolongación curva de la zona beige de la Sección 3 en el cuadrante superior derecho de la Sección 4 (a la mitad de entrada, limpia sin línea amarilla) */}
      {variant && <Section3To4CurvedExtension variant={variant} />}


      <div 
        className="promise__inner" 
        style={{ 
          position: 'relative', 
          zIndex: 50,
          transform: 'none',
          transition: 'transform 0.4s ease'
        }}
      >
        {t('eyebrow') ? (
          <>
            <p className="promise__eyebrow" style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 2px 8px rgba(13,33,55,0.7)' }}>{t('title')}</p>
            <h2 id="promise-heading" className="promise__title" style={{ color: 'white', textShadow: '0 2px 14px rgba(13,33,55,0.85)' }}>{t('eyebrow')}</h2>
          </>
        ) : (
          <h2 id="promise-heading" className="promise__title" style={{ color: 'white', textShadow: '0 2px 14px rgba(13,33,55,0.85)' }}>{t('title')}</h2>
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
