// src/components/sections/Section4Why.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CounterNumber } from '@/components/ui/CounterNumber'
import { Crab } from '@/components/creatures/Crab'
import { Seahorse } from '@/components/creatures/Seahorse'
import { ShimmerBadge } from '@/components/ui/ShimmerBadge'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { useState } from 'react'

const pillars = ['pillar1', 'pillar2', 'pillar3'] as const

// Elegant cream-navy-gold palette
const COLORS = {
  bgMain: '#F8F5EF',       // Soft warm cream
  bgSecondary: '#F3EFE6',  // Secondary cream (covers)
  bgIvory: '#FCFAF7',      // Very light ivory (pages)
  navyAccent: '#123E63',   // Accent Navy
  goldAccent: '#C8A96A',   // Gold accent
  textDarkNavy: '#1B2F45', // Text dark navy
}

const FONTS = {
  serif: 'Cormorant Garamond, "Playfair Display", Georgia, serif',
  sans: 'Inter, Manrope, "DM Sans", sans-serif',
}

function PillarCard({ 
  pillar, 
  i, 
  t, 
  isOpen, 
  onClick 
}: { 
  pillar: 'pillar1' | 'pillar2' | 'pillar3'; 
  i: number; 
  t: any; 
  isOpen: boolean; 
  onClick: () => void; 
}) {
  return (
    <div
      onClick={onClick}
      className="w-full aspect-square relative"
      style={{
        perspective: '1800px',
        zIndex: isOpen ? 50 : 1,
        cursor: 'pointer',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        whileHover={isOpen ? undefined : "hover"}
        animate={{
          y: isOpen ? -10 : 0,
          scale: isOpen ? 1.05 : 1,
          transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }}
      >
        {/* Right Inside Page (Base page of the book) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.bgIvory,
            backgroundImage: 'radial-gradient(rgba(18, 62, 99, 0.02) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            borderRadius: isOpen ? '0 24px 24px 0' : '24px',
            borderLeft: isOpen ? '2px solid rgba(18, 62, 99, 0.15)' : `1px solid ${COLORS.navyAccent}`,
            padding: '2rem 1.75rem',
            borderRight: `2px solid ${COLORS.navyAccent}`,
            borderTop: `2px solid ${COLORS.navyAccent}`,
            borderBottom: `2px solid ${COLORS.navyAccent}`,
            boxShadow: isOpen 
              ? '10px 15px 35px rgba(27, 47, 69, 0.08), inset 10px 0 15px rgba(0,0,0,0.02)' 
              : '0 4px 15px rgba(27, 47, 69, 0.02)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            backfaceVisibility: 'hidden',
            transition: 'border-radius 0.4s ease, border-left 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Subtle Decorative Wave for Inside Page */}
          <svg
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '15px',
              opacity: 0.05,
              pointerEvents: 'none',
            }}
            viewBox="0 0 100 30"
          >
            <path d="M0 15 Q25 0 50 15 T100 15" fill="none" stroke={COLORS.navyAccent} strokeWidth="3" />
          </svg>

          {/* Top: Icon in the opened page header */}
          <motion.span 
            style={{ fontSize: '2.5rem', display: 'inline-block', lineHeight: 1 }}
            animate={isOpen ? {
              scale: [1, 1.2, 1],
              transition: { duration: 0.5, ease: 'easeInOut' }
            } : { scale: 1 }}
          >
            {t(`${pillar}.icon`)}
          </motion.span>

          {/* Middle: Title & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: COLORS.navyAccent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONTS.sans }}>
              {t(`${pillar}.backTitle`)}
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: COLORS.textDarkNavy, opacity: 0.9, fontFamily: FONTS.serif }}>
              {t(`${pillar}.backSubtitle`)}
            </h4>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={isOpen ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{ fontSize: '0.78rem', color: COLORS.textDarkNavy, lineHeight: 1.55, overflowY: 'auto', maxHeight: '110px', paddingRight: '4px', fontStyle: 'italic', fontFamily: FONTS.serif }}
            >
              "{t(`${pillar}.backBody`)}"
            </motion.p>
          </div>

          {/* Bottom: Close / Volver link */}
          <div
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              backgroundColor: 'rgba(18, 62, 99, 0.05)',
              color: COLORS.navyAccent,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: FONTS.sans,
            }}
          >
            <span>← Cerrar Diario</span>
          </div>
        </div>

        {/* Rotating cover wrapper (Front Cover & Left Inside Page) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center', // Open spine from left edge
            zIndex: 2,
          }}
          animate={{
            rotateY: isOpen ? -180 : 0, // Swings 180 degrees open
          }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Double-Sided cover - Front Face (Hardcover) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: COLORS.bgSecondary,
              borderRadius: '24px',
              padding: '2.25rem 2rem',
              border: `2px solid ${COLORS.navyAccent}`,
              boxShadow: '0 8px 24px rgba(27, 47, 69, 0.06)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            {/* Light reflection sweeping across surface on hover */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(110deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 80%)',
                top: 0,
                left: '-100%',
                zIndex: 3,
                pointerEvents: 'none',
              }}
              variants={{
                hover: {
                  left: '200%',
                  transition: { duration: 1.4, ease: 'easeInOut' }
                }
              }}
            />

            {/* Top: Icon (floats on hover) */}
            <motion.span 
              style={{ fontSize: '3.4rem', display: 'inline-block', lineHeight: 1 }}
              variants={{
                initial: { y: 0, rotate: 0 },
                hover: { 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                  transition: { 
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }
              }}
            >
              {t(`${pillar}.icon`)}
            </motion.span>

            {/* Middle: Title & Main Text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: COLORS.textDarkNavy,
                  fontFamily: FONTS.serif,
                  letterSpacing: '-0.02em',
                }}
              >
                {t(`${pillar}.title`)}
              </h3>
              {pillar === 'pillar1' && (
                <div style={{ transform: 'scale(1.05)', marginBottom: '0.25rem' }}>
                  <ShimmerBadge color="gold">
                    <span style={{ color: COLORS.textDarkNavy, fontWeight: 700 }}>
                      Desde{' '}
                      <CounterNumber
                        from={0}
                        to={52.5}
                        suffix="€/mes"
                        prefix=""
                        decimals={1}
                      />
                    </span>
                  </ShimmerBadge>
                </div>
              )}
              <p style={{ fontSize: '0.88rem', color: COLORS.textDarkNavy, lineHeight: 1.6, maxWidth: '280px', fontFamily: FONTS.sans }}>
                {t(`${pillar}.body`)}
              </p>
            </div>

            {/* Bottom: Learn More bookmark button */}
            <motion.div
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '50px',
                backgroundColor: COLORS.bgIvory,
                border: `1.5px solid ${COLORS.navyAccent}`,
                color: COLORS.navyAccent,
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 10px rgba(18, 62, 99, 0.05)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: FONTS.sans,
              }}
              variants={{
                initial: { backgroundColor: COLORS.bgIvory, color: COLORS.navyAccent },
                hover: { 
                  backgroundColor: COLORS.navyAccent, 
                  color: COLORS.bgIvory,
                  transition: { duration: 0.3 }
                }
              }}
            >
              <span>{t('learn_more')}</span>
              <motion.span
                variants={{
                  initial: { x: 0 },
                  hover: { x: 4, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.4 } }
                }}
              >
                →
              </motion.span>
            </motion.div>
          </div>

          {/* Double-Sided cover - Back Face (Left Page of open book) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: COLORS.bgIvory,
              backgroundImage: 'radial-gradient(rgba(18, 62, 99, 0.02) 1px, transparent 0)',
              backgroundSize: '16px 16px',
              borderRadius: '24px 0 0 24px',
              borderRight: `3px solid ${COLORS.navyAccent}`,
              padding: '2rem 1.75rem',
              borderTop: `2px solid ${COLORS.navyAccent}`,
              borderBottom: `2px solid ${COLORS.navyAccent}`,
              borderLeft: `2px solid ${COLORS.navyAccent}`,
              boxShadow: '-10px 15px 35px rgba(27, 47, 69, 0.05)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Compass / Sailing log illustration for visual immersion */}
            <span style={{ fontSize: '3rem', opacity: 0.65 }}>📖</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: COLORS.textDarkNavy, fontFamily: FONTS.serif, marginTop: '1.25rem', letterSpacing: '-0.01em' }}>
              Diario de a bordo
            </h4>
            <p style={{ fontSize: '0.78rem', color: COLORS.textDarkNavy, fontStyle: 'italic', fontFamily: FONTS.serif, marginTop: '0.5rem', maxWidth: '200px', lineHeight: 1.4 }}>
              "El mar une los destinos que la tierra separa."
            </p>
            {/* Subtle Decorative Wave at bottom left page */}
            <svg
              style={{
                width: '60px',
                height: '15px',
                opacity: 0.05,
                pointerEvents: 'none',
                marginTop: '1.25rem'
              }}
              viewBox="0 0 100 30"
            >
              <path d="M0 15 Q25 0 50 15 T100 15" fill="none" stroke={COLORS.navyAccent} strokeWidth="3" />
            </svg>
          </div>
        </motion.div>

        {/* Soft glowing active border */}
        {isOpen && (
          <motion.div
            layoutId="activeBorderGlow"
            className="absolute -inset-1 pointer-events-none rounded-[26px]"
            style={{
              border: `2px solid ${COLORS.navyAccent}`,
              boxShadow: '0 0 15px rgba(18, 62, 99, 0.15)',
              zIndex: 3,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}

export function Section4Why() {
  const t = useTranslations('s4')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section
      style={{
        gridArea: 's4',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.bgMain,
      }}
    >
      {/* Seahorse — floating creature on the upper left corner */}
      <Seahorse
        style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 15 }}
        enterDelay={0.5}
      />

      {/* Imagen superior */}
      <div style={{ position: 'relative', height: '40%', overflow: 'hidden' }}>
        <Image
          src="/images/ai/section4-community.webp"
          alt="Comunidad de vela en Getxo"
          fill
          quality={80}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, rgba(248, 245, 239, 0.2) 0%, ${COLORS.bgMain} 95%)`,
          }}
        />
        {/* Título flotando sobre la imagen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: 'clamp(1.5rem, 5vw, 3rem)',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color={COLORS.navyAccent} />
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: COLORS.textDarkNavy,
              lineHeight: 1.2,
              fontFamily: FONTS.serif,
            }}
          >
            {t('title')}
          </h2>
        </motion.div>
      </div>

      {/* Los 3 pilares */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{
          flex: 1,
          padding: 'clamp(1rem, 3vh, 1.5rem) clamp(1.5rem, 5vw, 3rem)',
          gap: '2.25rem',
          alignContent: 'center',
          maxWidth: '1350px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {pillars.map((pillar, i) => (
          <PillarCard 
            key={pillar} 
            pillar={pillar} 
            i={i} 
            t={t} 
            isOpen={activeIndex === i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          />
        ))}
      </div>

      {/* Cangrejo — criatura de la esquina */}
      <Crab
        style={{ position: 'absolute', bottom: '3%', right: '3%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
