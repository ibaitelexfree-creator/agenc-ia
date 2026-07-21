// src/components/sections/Section1Hero.tsx
'use client'

import { useRef, useContext, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Seagull } from '@/components/creatures/Seagull'
import { Fish } from '@/components/creatures/Fish'
import { GlowButton } from '@/components/ui/GlowButton'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { ScrollContext } from '@/components/layout/ScrollEngine'
import { BlobCard } from '@/components/blobs/BlobCard'
import { BLOB_PATHS } from '@/data/blobPaths'
import { AnimatedText } from '@/components/ui/AnimatedText'

// Variantes de animación de entrada
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

const BLOB_POSITIONS = [
  { left: '60%', top: '35%' },
  { left: '74%', top: '22%' },
  { left: '78%', top: '58%' },
  { left: '68%', top: '75%' },
  { left: '88%', top: '50%' },
]

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

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280) // 1280px matches the xl layout breakpoint where the C-shape card structure has enough space on the left
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
    // Fallback timer for desktop to reveal content if video takes too long to load
    const timer = setTimeout(() => {
      setVideoLoaded(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [isMobile])
  
  // Parallax Setup
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: localHeroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  } as any)

  const activeScroll = scrollCtx ? scrollCtx.scrollYProgress : localHeroScroll

  // 3 capas de parallax con velocidades distintas
  // Si hay ScrollContext (V2), la animación ocurre al transicionar entre sección 1 y 2 (0.0 a 0.20)
  const layer1Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '15%', '15%'] : ['0%', '15%']
  )
  const layer2Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '25%', '25%'] : ['0%', '25%']
  )
  const layer3Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '35%', '35%'] : ['0%', '35%']
  )

  const CARDS = [
    {
      title: t('card_cursos_title'),
      subtitle: t('card_cursos_subtitle'),
      color: '#2EC4B6',
      videoSrc: '/videos/cursos_optimized.webm',
      imageSrc: '/images/cursos_thumb.webp',
      paths: BLOB_PATHS.cursos,
      href: `/${locale}/servicios/cursos`,
    },
    {
      title: t('card_club_title'),
      subtitle: t('card_club_subtitle'),
      color: '#F4A623',
      videoSrc: '/videos/club_optimized.webm',
      imageSrc: '/images/club_thumb.webp',
      paths: BLOB_PATHS.clubSocias,
      href: `/${locale}/servicios/socias`,
    },
    {
      title: t('card_equipos_title'),
      subtitle: t('card_equipos_subtitle'),
      color: '#1D6FA4',
      videoSrc: '/videos/equipos_optimized.webm',
      imageSrc: '/images/equipos_thumb.webp',
      paths: BLOB_PATHS.equipos,
      href: `/${locale}/servicios/equipos`,
    },
    {
      title: t('card_udalekuak_title'),
      subtitle: t('card_udalekuak_subtitle'),
      color: '#8B5CF6',
      videoSrc: '/videos/udalekuak_optimized.webm',
      imageSrc: '/images/udalekuak_thumb.webp',
      paths: BLOB_PATHS.udalekuak,
      href: `/${locale}/servicios/udalekuak`,
    },
    {
      title: t('card_entidades_title'),
      subtitle: t('card_entidades_subtitle'),
      color: '#0A0A0A',
      videoSrc: '/videos/entidades_optimized.webm',
      imageSrc: '/images/entidades_thumb.webp',
      paths: BLOB_PATHS.entidades,
      href: `/${locale}/servicios/team-building`,
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
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Capa 2: Costa y mar (con parallax de scroll, escala y balanceo sincronizado de oleaje) - CARGA 1º */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer2Y,
          width: '100%',
          height: '100%',
          zIndex: 2,
          scale: 1.015,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, 18, 0, -18, 0],
            x: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 12,
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
              left: '-10px',
              right: '-15px',
              top: '-10px',
              bottom: '-10px',
              width: 'calc(100% + 25px)',
              height: 'calc(100% + 20px)',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 1: Cielo (con parallax de scroll y balanceo de cámara sincronizado) - CARGA 2º */}
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
            y: [0, 10, 0, -10, 0],
            x: [0, -3, 0, 3, 0],
          }}
          transition={{
            duration: 12,
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
              left: '-112px',
              right: '-112px',
              top: '-20px',
              bottom: '-20px',
              width: 'calc(100% + 224px)',
              height: 'calc(100% + 40px)',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
              transform: 'translateX(105px)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 3: Velero (con parallax de scroll y balanceo de cabeceo contrario al mar) - CARGA 3º */}
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
            y: [0, -35, 0, 35, 0],
            x: [0, 6, 0, -6, 0],
            rotate: [0, 0.8, 0, -0.8, 0],
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
              left: '-280px',
              right: '-180px',
              top: '-60px',
              bottom: '-60px',
              width: 'calc(100% + 460px)',
              height: 'calc(100% + 120px)',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: 'translateX(292px)',
            }}
          />
          <SailboatAccesoButton />
        </motion.div>
      </motion.div>

      {/* Overlay gradiente oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,33,55,0.1) 0%, rgba(13,33,55,0.7) 100%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />



      {/* Contenido principal — alineado con container fluido para evitar desbordamientos en pantallas 13"-16" */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-30px' }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'left',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          width: '100%',
          maxWidth: 'min(1400px, 90vw)',
          margin: '0 auto',
          color: 'var(--white)',
          y: layer3Y,
          marginTop: '-40px',
        }}
      >
        {/* Eyebrow — ubicación */}
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-light)" fontSize="0.95rem" />
        </div>
 
        {/* Logo / Nombre de la escuela */}
        <div style={{ marginBottom: '1.2rem' }}>
          <LogoGBE />
        </div>
 
        {/* Título principal */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.8vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: 'var(--white)',
            marginBottom: '1rem',
            textAlign: 'left',
          }}
        >
          {t('title').split('|').map((part, index) => {
            return (
              <span key={index} style={{ display: 'block', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
                <AnimatedText
                  text={part.trim()}
                  effect="falling"
                  delay={0.6 + index * 0.45}
                />
              </span>
            );
          })}
        </h1>
 
        {/* Subtítulo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '16px',
            maxWidth: '710px',
            margin: '0 0 1.6rem',
            textAlign: 'left',
          }}
        >
          {/* Línea vertical color granate del logotipo */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 13, delay: 1.4 }}
            style={{
              width: '4px',
              backgroundColor: '#A91D22', // Granate del logo
              transformOrigin: 'top',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              fontWeight: 400,
              lineHeight: 1.35,
              color: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AnimatedText
              text={t('subtitle')}
              effect="falling"
              delay={1.5}
            />
          </div>
        </div>
 
        {/* CTA con atracción magnética */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 2.6 }}
          style={{ marginBottom: '1rem' }}
        >
          <GlowButton href="#" color="garnet" size="xxl">
            {t('cta')}
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Los 5 blobs/วิดีโอ interactivos จัดเรียงในแนวนอนด้านล่างสุดของ Hero (ขนาดลดลง ~25% ไม่ทับซ้อน) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          padding: '0 16px',
          zIndex: 15,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(10px, 2.5vw, 28px)',
            width: '100%',
          }}
        >
          {CARDS.map((card, idx) => (
            <BlobCard key={card.title} {...card} index={idx} />
          ))}
        </motion.div>
      </div>

      {/* Criaturas animadas — pasan detrás del contenido */}
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

// ── Componente interno: logo GBE (Reducido ~18% conservando estilo e identidad) ───────────────────────────────
function LogoGBE() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <motion.svg 
        width="33" 
        height="33" 
        viewBox="0 0 36 36" 
        fill="none" 
        aria-hidden="true"
        initial={{ y: -60, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
      >
        <path d="M18 4 L4 28 L18 26 Z" fill="white" opacity="0.9" />
        <path d="M18 8 L32 28 L18 26 Z" fill="white" opacity="0.5" />
        <line x1="4" y1="30" x2="32" y2="30" stroke="white" strokeWidth="2" />
      </motion.svg>
      <AnimatedText
        text="Getxo Bela Eskola"
        effect="falling"
        delay={0.35}
        style={{
          fontSize: '1.18rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'white',
        }}
      />
    </div>
  )
}



// ── Componente interno: botón de Acceso flotando en el velero ─────────────────
function SailboatAccesoButton() {
  const locale = useLocale()
  const [aspect, setAspect] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const [showButton, setShowButton] = useState(true)

  // Dictionary matching Navbar labels for Acceso Socias (split into two lines)
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
      const bleedLeft = 280
      const bleedRight = 180
      const bleedTop = 60
      const bleedBottom = 60
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

      // Subtract bleedLeft and bleedTop because the container starts at -bleedLeft and -bleedTop
      setAspect({ width: actualW, height: actualH, left: left - bleedLeft, top: top - bleedTop })
    }

    const handleScroll = () => {
      setShowButton(window.scrollY < 200)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (aspect.width === 0) return null

  // Relative anchor positioning calculated from boat's image coordinates
  const buttonLeft = aspect.left + (2487.5 / 2752) * aspect.width - Math.min(179, aspect.width * 0.06)
  const buttonTop = aspect.top + (273 / 1536) * aspect.height + Math.min(555, aspect.height * 0.36)
 
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
            rotate: 0,
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
            className="transition-premium cursor-pointer text-center select-none"
            style={{ 
              fontWeight: 950,
              whiteSpace: 'nowrap',
              border: 'none',
              background: 'rgba(0, 0, 0, 0.001)',
              padding: '25px 50px',
              display: 'inline-block'
            }}
          >
            <motion.div
              className={`flex flex-col items-center justify-center leading-[0.85] font-black tracking-[0.12em] text-center ${
                locale === 'eu' ? 'text-[18px]' : 'text-[24px]'
              }`}
              animate={{
                color: ['#ffffff', '#ff0000', '#ffffff'],
                textShadow: [
                  '0 0 4px rgba(255,255,255,0.4)',
                  '0 0 15px rgba(255,0,0,0.8), 0 0 30px rgba(255,0,0,0.6)',
                  '0 0 4px rgba(255,255,255,0.4)'
                ]
              }}
              transition={{
                duration: 1.2,
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
