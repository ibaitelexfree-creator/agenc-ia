// src/components/sections/Section1Hero.tsx
'use client'

import { useRef, useContext, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Seagull } from '@/components/creatures/Seagull'
import { Fish } from '@/components/creatures/Fish'
import { GlowButton } from '@/components/ui/GlowButton'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { ScrollContext } from '@/components/layout/ScrollEngine'
import { AnimatedText } from '@/components/ui/AnimatedText'

// Design Tokens
const COLORS = {
  navyCover: '#0A1E36',     // Deep ocean blue
  goldFoil: '#C8A96A',      // Gold foil accent
  paperWhite: '#FCFAF7',    // Premium paper white
  textDarkNavy: '#1B2F45',  // Text navy
  glassBg: 'rgba(10, 25, 45, 0.35)',
  glassBorder: 'rgba(200, 169, 106, 0.25)',
}

const FONTS = {
  serif: 'Cormorant Garamond, "Playfair Display", Georgia, serif',
  sans: 'Inter, Manrope, "DM Sans", sans-serif',
}

interface LuxuryCardProps {
  num: string;
  title: string;
  subtitle: string;
  href: string;
  index: number;
}

function LuxuryCard({ num, title, subtitle, href, index }: LuxuryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full aspect-square relative rounded-[20px] overflow-hidden"
        style={{
          border: `1.5px solid ${isHovered ? COLORS.goldFoil : COLORS.glassBorder}`,
          backgroundColor: isHovered ? 'rgba(10, 30, 54, 0.85)' : COLORS.glassBg,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(200, 169, 106, 0.1)' 
            : '0 8px 24px rgba(0, 0, 0, 0.1)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.6, ease: 'easeOut' }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        {/* Luxury Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.goldFoil, fontFamily: FONTS.serif, letterSpacing: '0.1em' }}>
            {num}
          </span>
          <svg style={{ width: '16px', height: '16px', color: COLORS.goldFoil, opacity: isHovered ? 1 : 0.6, transform: isHovered ? 'rotate(-45deg)' : 'none', transition: 'all 0.3s ease' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* Card Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', fontFamily: FONTS.serif, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.sans, lineHeight: 1.45, fontWeight: 300 }}>
            {subtitle}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}

export function Section1Hero() {
  const t = useTranslations('s1')
  const locale = useLocale()
  const scrollCtx = useContext(ScrollContext)
  
  const [tierraLoaded, setTierraLoaded] = useState(false)
  const [nubesLoaded, setNubesLoaded] = useState(false)
  const [barcoLoaded, setBarcoLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [mounted, setMounted] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setVideoLoaded(true)
      return
    }
    const timer = setTimeout(() => {
      setVideoLoaded(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [isMobile])

  const { scrollYProgress: localHeroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  } as any)

  const activeScroll = scrollCtx ? scrollCtx.scrollYProgress : localHeroScroll

  // Parallax Transform Layers
  const layer1Y = useTransform(activeScroll, [0, 0.2, 1], ['0%', '15%', '15%'])
  const layer2Y = useTransform(activeScroll, [0, 0.2, 1], ['0%', '25%', '25%'])
  const layer3Y = useTransform(activeScroll, [0, 0.2, 1], ['0%', '35%', '35%'])

  const CARDS = [
    {
      num: '01',
      title: t('card_cursos_title'),
      subtitle: t('card_cursos_subtitle'),
      href: `/${locale}/courses`,
    },
    {
      num: '02',
      title: t('card_club_title'),
      subtitle: t('card_club_subtitle'),
      href: `/${locale}/club`,
    },
    {
      num: '03',
      title: t('card_equipos_title'),
      subtitle: t('card_equipos_subtitle'),
      href: `/${locale}/about`,
    },
    {
      num: '04',
      title: t('card_udalekuak_title'),
      subtitle: t('card_udalekuak_subtitle'),
      href: `/${locale}/servicios/udalekuak`,
    },
    {
      num: '05',
      title: t('card_entidades_title'),
      subtitle: t('card_entidades_subtitle'),
      href: `/${locale}/contact`,
    },
  ]

  return (
    <section
      ref={heroRef}
      style={{
        gridArea: 's1',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: COLORS.navyCover,
      }}
    >
      {/* Background Layer 2: Sea & Land */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer2Y,
          width: '100%',
          height: '100%',
          zIndex: 2,
          scale: 1.02,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, 15, 0, -15, 0],
            x: [0, -4, 0, 4, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/tierra.webp?v=3"
            alt="Costa y mar del Abra de Getxo"
            fetchPriority="high"
            onLoad={() => setTierraLoaded(true)}
            style={{
              position: 'absolute',
              inset: '-10px',
              width: 'calc(100% + 20px)',
              height: 'calc(100% + 20px)',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Background Layer 1: Sky */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer1Y,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, 8, 0, -8, 0],
            x: [0, -2, 0, 2, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/cielo%20extendido%20v2.webp?v=3"
            alt="Cielo Abra de Getxo"
            fetchPriority="high"
            onLoad={() => setNubesLoaded(true)}
            style={{
              position: 'absolute',
              left: '-100px',
              right: '-100px',
              top: '-20px',
              bottom: '-20px',
              width: 'calc(100% + 200px)',
              height: 'calc(100% + 40px)',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          />
          {mounted && !isMobile && (
            <video
              src="/images/home/parallax/Fluffy_clouds_drifting_across_sky_202606160528.mp4"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              style={{
                position: 'absolute',
                left: '-100px',
                right: '-100px',
                top: '-20px',
                width: 'calc(100% + 200px)',
                height: '50%',
                objectFit: 'cover',
                objectPosition: 'center top',
                zIndex: 2,
                opacity: 0.9,
                pointerEvents: 'none',
              }}
            >
              <track kind="captions" src="data:text/vtt," label="No captions" default />
            </video>
          )}
        </motion.div>
      </motion.div>

      {/* Background Layer 3: Sailboat */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer3Y,
          width: '100%',
          height: '100%',
          zIndex: 3,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, -25, 0, 25, 0],
            x: [0, 4, 0, -4, 0],
            rotate: [0, 0.5, 0, -0.5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/velero.webp?v=3"
            alt="Velero navegando en Getxo"
            fetchPriority="high"
            onLoad={() => setBarcoLoaded(true)}
            style={{
              position: 'absolute',
              left: '-200px',
              right: '-100px',
              top: '-40px',
              bottom: '-40px',
              width: 'calc(100% + 300px)',
              height: 'calc(100% + 80px)',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <SailboatAccesoButton />
        </motion.div>
      </motion.div>

      {/* Gradient Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10, 30, 54, 0.25) 0%, rgba(10, 30, 54, 0.85) 100%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Main Editorial Content Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 'clamp(2rem, 5vh, 4rem) clamp(1.5rem, 6vw, 4rem) 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1.25rem',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {/* Eyebrow Location */}
        <SectionEyebrow text={t('eyebrow')} color={COLORS.goldFoil} />

        {/* Luxury Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M18 4 L4 28 L18 26 Z" fill={COLORS.goldFoil} opacity="0.9" />
            <path d="M18 8 L32 28 L18 26 Z" fill={COLORS.goldFoil} opacity="0.5" />
          </svg>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.sans }}>
            Getxo Bela Eskola
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'white',
            fontFamily: FONTS.serif,
            maxWidth: '900px',
            textAlign: 'left',
          }}
        >
          {t('title').split('|').map((part, index) => (
            <span key={index} style={{ display: 'block' }}>
              <AnimatedText text={part.trim()} effect="falling" delay={0.3 + index * 0.3} />
            </span>
          ))}
        </h1>

        {/* Subheadline and CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '650px', width: '100%', marginTop: '0.5rem' }}>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 300, lineHeight: 1.45, color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.sans, borderLeft: `3px solid ${COLORS.goldFoil}`, paddingLeft: '1rem' }}>
            {t('subtitle')}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <GlowButton href={`/${locale}/about`} color="gold" size="lg">
              {t('cta')}
            </GlowButton>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Luxury Cards Grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '0 clamp(1.5rem, 6vw, 4rem) clamp(2rem, 5vh, 4rem)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CARDS.map((card, idx) => (
            <LuxuryCard key={card.title} {...card} index={idx} />
          ))}
        </div>
      </div>

      {/* Floating Animated Creatures */}
      <Seagull
        style={{ position: 'absolute', top: '15%', right: '-10%', zIndex: 8 }}
        enterDelay={1.5}
        direction="left"
      />
      <Fish
        style={{ position: 'absolute', bottom: '18%', left: '-8%', zIndex: 8 }}
        enterDelay={2.0}
        direction="right"
        size="small"
      />
    </section>
  )
}

// ── Componente interno: botón de Acceso flotando en el velero ─────────────────
function SailboatAccesoButton() {
  const locale = useLocale()
  const [aspect, setAspect] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const [showButton, setShowButton] = useState(true)

  const labels: Record<string, { top: string; bottom: string }> = {
    es: { top: 'ACCESO', bottom: 'SOCIAS' },
    eu: { top: 'BAZKIDEEN', bottom: 'SARBIDEA' },
    en: { top: 'MEMBERS', bottom: 'ACCESS' },
    fr: { top: 'ACCÈS', bottom: 'MEMBRES' }
  }
  const label = labels[locale] || labels.es

  useEffect(() => {
    const updateSize = () => {
      const imgW = 2752
      const imgH = 1536
      const imgRatio = imgW / imgH
      const bleedLeft = 200
      const bleedRight = 100
      const bleedTop = 40
      const bleedBottom = 40
      const canvasW = window.innerWidth + bleedLeft + bleedRight
      const canvasH = window.innerHeight + bleedTop + bleedBottom
      const canvasRatio = canvasW / canvasH

      let actualW = 0
      let actualH = 0
      let left = 0
      let top = 0

      if (canvasRatio > imgRatio) {
        actualW = canvasW
        actualH = canvasW / imgRatio
        top = (canvasH - actualH) / 2
      } else {
        actualH = canvasH
        actualW = canvasH * imgRatio
        left = (canvasW - actualW) / 2
      }

      setAspect({ width: actualW, height: actualH, left: left - bleedLeft, top: top - bleedTop })
    }

    const handleScroll = () => {
      setShowButton(window.scrollY < 200)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (aspect.width === 0) return null

  const buttonLeft = aspect.left + (2487.5 / 2752) * aspect.width - 179
  const buttonTop = aspect.top + (273 / 1536) * aspect.height + 555
 
  return (
    <>
      {showButton && (
        <motion.div
          layoutId="acceso-button-wrapper"
          transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          style={{
            position: 'absolute',
            left: `${buttonLeft}px`,
            top: `${buttonTop}px`,
            x: '-50%',
            y: '-50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            zIndex: 50,
          }}
        >
          <Link
            href={`/${locale}/auth/login`}
            prefetch={false}
            className="cursor-pointer text-center select-none"
            style={{ 
              fontWeight: 900,
              whiteSpace: 'nowrap',
              padding: '20px 40px',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            <motion.div
              className={`flex flex-col items-center justify-center leading-[0.9] font-black tracking-[0.15em] text-center ${
                locale === 'eu' ? 'text-[14px]' : 'text-[18px]'
              }`}
              animate={{
                color: [COLORS.goldFoil, '#ffffff', COLORS.goldFoil],
                textShadow: [
                  '0 0 4px rgba(200,169,106,0.3)',
                  '0 0 15px rgba(200,169,106,0.6), 0 0 30px rgba(200,169,106,0.4)',
                  '0 0 4px rgba(200,169,106,0.3)'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <span>{label.top}</span>
              <span>{label.bottom}</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </>
  )
}
