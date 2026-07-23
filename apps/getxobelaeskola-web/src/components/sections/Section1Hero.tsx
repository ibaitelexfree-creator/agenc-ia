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
  const [isTabletPortrait, setIsTabletPortrait] = useState(false)
  const [isTabletLandscape, setIsTabletLandscape] = useState(false)
  const [isPhone, setIsPhone] = useState(false)

  const [mounted, setMounted] = useState(false)

  const allHeroAssetsLoaded = tierraLoaded && nubesLoaded && barcoLoaded

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const isTabletSize = (w >= 768 && w <= 1024) || (h >= 768 && h <= 1024)
      setIsMobile(w < 1280) // 1280px matches the xl layout breakpoint
      setIsTabletPortrait(isTabletSize && h > w)
      setIsTabletLandscape(isTabletSize && w >= h)
      setIsPhone(w < 768)   // 768px covers mobile and small phone sizes
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [aspect, setAspect] = useState({ width: 0, height: 0, left: 0, top: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (!heroRef.current) return
      const containerW = heroRef.current.clientWidth
      const containerH = heroRef.current.clientHeight

      const imgW = 1920
      const imgH = 1072
      const imgRatio = imgW / imgH
      const bleedLeft = 364
      const bleedRight = 234
      const bleedTop = 78
      const bleedBottom = 78
      const canvasW = containerW + bleedLeft + bleedRight
      const canvasH = containerH + bleedTop + bleedBottom
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

    updateSize()
    
    // Add timeouts to correct layout timing shifts on load
    const t1 = setTimeout(updateSize, 100)
    const t2 = setTimeout(updateSize, 500)
    
    window.addEventListener('resize', updateSize)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  // Precargar en paralelo las 3 imágenes clave (tierra, cielo y barco)
  useEffect(() => {
    let isMounted = true
    const assets = [
      { url: '/images/home/parallax/tierra.webp?v=3', setLoaded: setTierraLoaded },
      { url: '/images/home/parallax/cielo%20extendido%20v2.webp?v=3', setLoaded: setNubesLoaded },
      { url: '/images/home/parallax/velero.webp?v=3', setLoaded: setBarcoLoaded },
    ]

    assets.forEach(({ url, setLoaded }) => {
      const img = new window.Image()
      img.src = url
      if (img.complete && img.naturalWidth !== 0) {
        if (isMounted) setLoaded(true)
      } else {
        img.onload = () => {
          if (isMounted) setLoaded(true)
        }
        img.onerror = () => {
          if (isMounted) setLoaded(true)
        }
      }
    })

    // Temporizador de seguridad (5s máx) por si hay problemas extremos de red
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setTierraLoaded(true)
        setNubesLoaded(true)
        setBarcoLoaded(true)
      }
    }, 5000)

    return () => {
      isMounted = false
      clearTimeout(fallbackTimer)
    }
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
  const boatContainerRef = useRef<HTMLDivElement>(null)

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
      {/* Overlay de carga inicial de pantalla completa: Oculta absolutamente todo hasta que las 3 imágenes estén listas */}
      <AnimatePresence>
        {!allHeroAssetsLoaded && (
          <motion.div
            key="hero-loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: '#0d2137',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
            }}
          >
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  borderTop: '2px solid #2EC4B6',
                  borderRight: '2px solid transparent',
                }}
              />
            </div>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Cargando travesía...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
          {aspect.width > 0 && (
            <div
              style={{
                position: 'absolute',
                left: isTabletLandscape 
                  ? `calc(${aspect.left}px + 2.25vw)` 
                  : isTabletPortrait 
                  ? `calc(${aspect.left}px + 1.5vw)` 
                  : `${aspect.left}px`,
                top: `${aspect.top}px`,
                width: `${aspect.width}px`,
                height: `${aspect.height}px`,
                transform: isPhone ? 'translateX(-100px) scale(0.9)' : 'translateX(-100px)',
                transformOrigin: 'center center',
              }}
            >
              <img
                src="/images/home/parallax/velero.webp?v=3"
                alt="Velero navegando en Getxo"
                fetchPriority="high"
                onLoad={() => setBarcoLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <SailboatAccesoButton />
            </div>
          )}
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



      {/* Contenido principal — alineado con container fluido para evitar desbordamientos */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={allHeroAssetsLoaded ? 'visible' : 'hidden'}
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
          marginTop: isPhone ? '-120px' : '-60px', // Pull the container up on mobile
          top: isPhone ? '-30px' : '0px',
        }}
      >
        {/* Eyebrow — ubicación */}
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'flex-start',
            marginBottom: '0.75rem',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-light)" fontSize="0.95rem" />
        </div>
 
          {/* Logo / Nombre de la escuela */}
          <div style={{ marginBottom: '1rem' }}>
            <LogoGBE />
          </div>
  
          {/* Título principal */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              color: 'var(--white)',
              marginBottom: '0.85rem',
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
              margin: '0 0 1.25rem',
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
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
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
          >
            <GlowButton href="#" color="garnet" size="lg">
              {t('cta')}
            </GlowButton>
          </motion.div>
        </motion.div>

      {/* Los 5 blobs/videos interactivos */}
      <div
        style={{
          position: 'absolute',
          bottom: isTabletPortrait ? 'calc(20px + 10vh)' : isTabletLandscape ? 'calc(20px - 1vh)' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1280px',
          padding: '0 20px',
          zIndex: 15,
        }}
      >
        <AnimatePresence>
          {allHeroAssetsLoaded && (
            isPhone ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                }}
              >
                {/* Fila superior: 3 blobs ligeramente desplazados a la derecha para dejar espacio al widget de accesibilidad de la izquierda */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    transform: 'translateX(18px)', // Desplazamiento a la derecha
                  }}
                >
                  {CARDS.slice(0, 3).map((card, idx) => (
                    <BlobCard key={card.title} {...card} index={idx} />
                  ))}
                </div>
                {/* Fila inferior: 2 blobs centrados olímpicamente */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                  }}
                >
                  {CARDS.slice(3, 5).map((card, idx) => (
                    <BlobCard key={card.title} {...card} index={idx + 3} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: isTabletLandscape 
                    ? 'clamp(6px, 1.8vw, 20px)' 
                    : isTabletPortrait 
                    ? 'clamp(10px, 2.5vw, 32px)' 
                    : 'clamp(14px, 3.2vw, 42px)',
                  width: '100%',
                  transform: isTabletLandscape ? 'scale(0.90)' : 'none',
                  transformOrigin: 'bottom center',
                }}
              >
                {CARDS.map((card, idx) => (
                  <BlobCard key={card.title} {...card} index={idx} />
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Criaturas animadas — pasan detrás del contenido */}
      <Seagull
        style={{
          position: 'absolute',
          top: '15%',
          right: isPhone ? '10%' : '-10%', // 20% más a la izquierda (de -10% a 10%)
          zIndex: 2, // Detrás del barco (zIndex 3) y delante del cielo (zIndex 1)
          transform: isPhone ? 'scale(0.8)' : 'none', // 20% más pequeña
        }}
        enterDelay={1.5}
        direction="left"
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
  const [showButton, setShowButton] = useState(false)

  // Dictionary matching Navbar labels for Acceso Socias (split into two lines)
  const labels: Record<string, { top: string; bottom: string }> = {
    es: { top: 'ACCESO', bottom: 'SOCIAS' },
    eu: { top: 'BAZKIDEEN', bottom: 'SARBIDEA' },
    en: { top: 'MEMBERS', bottom: 'ACCESS' },
    fr: { top: 'ACCÈS', bottom: 'MEMBRES' }
  }
  const label = labels[locale] || labels.es

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY < 200)
    }

    if ((window as any).__navbarAuthLoaded) {
      setShowButton(window.scrollY < 200)
      window.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      const handler = () => {
        setShowButton(window.scrollY < 200)
        window.addEventListener('scroll', handleScroll, { passive: true })
      }
      window.addEventListener('auth-loaded', handler)
      return () => {
        window.removeEventListener('auth-loaded', handler)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {showButton && (
        <motion.div
          style={{
            position: 'absolute',
            left: '85.23%',
            top: '66.40%',
            translate: '-50% -50%',
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
              padding: '23px 50px',
              display: 'inline-block'
            }}
          >
            <motion.div
              className={`flex flex-col items-center justify-center leading-[0.85] font-black tracking-[0.12em] text-center ${
                locale === 'eu' ? 'text-[19px]' : 'text-[23px]'
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
