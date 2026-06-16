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

export function Section1Hero() {
  const t = useTranslations('s1')
  const locale = useLocale()
  const scrollCtx = useContext(ScrollContext)
  
  const [videoLoaded, setVideoLoaded] = useState(false)
  
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
      imageSrc: '/images/cursos.jpg',
      paths: BLOB_PATHS.cursos,
      href: `/${locale}/servicios/cursos`,
    },
    {
      title: t('card_club_title'),
      subtitle: t('card_club_subtitle'),
      color: '#F4A623',
      videoSrc: '/videos/club_optimized.webm',
      imageSrc: '/images/club.jpg',
      paths: BLOB_PATHS.clubSocias,
      href: `/${locale}/servicios/socias`,
    },
    {
      title: t('card_equipos_title'),
      subtitle: t('card_equipos_subtitle'),
      color: '#1D6FA4',
      videoSrc: '/videos/equipos_optimized.webm',
      imageSrc: '/images/equipos.jpg',
      paths: BLOB_PATHS.equipos,
      href: `/${locale}/servicios/equipos`,
    },
    {
      title: t('card_udalekuak_title'),
      subtitle: t('card_udalekuak_subtitle'),
      color: '#8B5CF6',
      videoSrc: '/videos/udalekuak_optimized.webm',
      imageSrc: '/images/udalekuak.jpg',
      paths: BLOB_PATHS.udalekuak,
      href: `/${locale}/servicios/udalekuak`,
    },
    {
      title: t('card_entidades_title'),
      subtitle: t('card_entidades_subtitle'),
      color: '#0A0A0A',
      videoSrc: '/videos/entidades_optimized.webm',
      imageSrc: '/images/entidades.jpg',
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
      {/* Capa 1: Cielo (con parallax de scroll y balanceo de cámara sincronizado) */}
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
            src="/images/home/parallax/cielo extendido v2.webp?v=3"
            alt="Cielo Abra de Getxo"
            fetchPriority="high"
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
              transform: 'translateX(105px)',
            }}
          />
          <video
            src="/images/home/parallax/Fluffy_clouds_drifting_across_sky_202606160528.mp4"
            autoPlay
            loop
            muted
            playsInline
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
              zIndex: 2,
              opacity: 1,
              pointerEvents: 'none',
              transform: 'translateX(105px)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 2: Costa y mar (con parallax de scroll, escala y balanceo sincronizado de oleaje) */}
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

      {/* Capa 3: Velero (con parallax de scroll y balanceo de cabeceo contrario al mar) */}
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



      {/* Contenido principal — centrado y elevado para evitar colisión */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-30px' }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '800px',
          color: 'var(--white)',
          y: layer3Y,
          marginTop: '-180px',
        }}
      >
        {/* Eyebrow — ubicación */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-light)" />
        </motion.div>

        {/* Logo / Nombre de la escuela */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
          <LogoGBE />
        </motion.div>

        {/* Título principal */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--white)',
            marginBottom: '1.25rem',
          }}
        >
          {t('title')}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '560px',
            margin: '0 auto 2rem',
          }}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA con atracción magnética */}
        <motion.div variants={itemVariants}>
          <GlowButton href="#" color="coral" size="md">
            {t('cta')}
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Los 5 blobs interactivos alineados en fila al pie del Hero */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 40px)',
          padding: '0 24px',
          zIndex: 15,
        }}
      >
        {CARDS.map((card) => (
          <BlobCard key={card.title} {...card} />
        ))}
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

// ── Componente interno: logo GBE ───────────────────────────────────────────────
function LogoGBE() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M18 4 L4 28 L18 26 Z" fill="black" opacity="0.9" />
        <path d="M18 8 L32 28 L18 26 Z" fill="black" opacity="0.5" />
        <line x1="4" y1="30" x2="32" y2="30" stroke="black" strokeWidth="2" />
      </svg>
      <span
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'black',
        }}
      >
        Getxo Bela Eskola
      </span>
    </div>
  )
}



// ── Componente interno: botón de Acceso flotando en el velero ─────────────────
function SailboatAccesoButton() {
  const locale = useLocale()
  const [aspect, setAspect] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const [showButton, setShowButton] = useState(true)

  // Dictionary matching Navbar labels
  const labels: Record<string, string> = {
    es: 'Acceso',
    eu: 'Saioa hasi',
    en: 'Login',
    fr: 'Connexion'
  }
  const label = labels[locale] || 'Acceso'

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

  // Exact bounds midpoint on image coordinate space:
  // X midpoint: (2361 + 2614) / 2 = 2487.5
  // Y midpoint: (207 + 339) / 2 = 273
  // Image is translated by 210px to the right, and button is moved 310px to the left of the boat (resulting in -100px relative to centered)
  const buttonLeft = aspect.left + (2487.5 / 2752) * aspect.width - 183
  const buttonTop = aspect.top + (273 / 1536) * aspect.height + 125

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
            rotate: -27.53,
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
            className="text-[20px] uppercase tracking-[0.55em] text-white hover:text-black transition-premium cursor-pointer text-center select-none"
            style={{ 
              fontWeight: 950,
              whiteSpace: 'nowrap',
              border: 'none',
              background: 'rgba(0, 0, 0, 0.001)',
              padding: '25px 50px',
              display: 'inline-block'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0 8px rgba(255, 0, 0, 0.4)',
                  '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0 15px #ff0000, 0 0 30px #ff0000',
                  '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0 8px rgba(255, 0, 0, 0.4)'
                ]
              }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {label}
            </motion.span>
          </Link>
        </motion.div>
      )}
    </>
  )
}
