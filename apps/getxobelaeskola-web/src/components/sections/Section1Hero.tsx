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
  const [isLandscape, setIsLandscape] = useState(false)
  const [viewportScale, setViewportScale] = useState(1)

  const [mounted, setMounted] = useState(false)

  // El LCP (el velero y el texto del hero) solo debe esperar a que cargue el barco
  const allHeroAssetsLoaded = barcoLoaded

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const landscapeMode = w > h
      
      const effW = Math.min(w, h)
      const isTabletSize = (effW >= 600 && effW <= 1024)
      
      setIsMobile(w < 768)
      setIsTabletPortrait(isTabletSize && !landscapeMode)
      setIsTabletLandscape(isTabletSize && landscapeMode)
      setIsPhone(effW < 600 && !landscapeMode)
      setIsLandscape(landscapeMode)

      if (landscapeMode) {
        if (h < 500) {
          setViewportScale(Math.max(0.48, h / 620))
        } else if (h < 750) {
          setViewportScale(Math.max(0.65, h / 780))
        } else if (h < 1200) {
          setViewportScale(Math.max(0.72, h / 1100))
        } else {
          setViewportScale(1)
        }
      } else {
        setViewportScale(1)
      }
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

  const tierraRef = useRef<HTMLImageElement>(null)
  const nubesRef = useRef<HTMLImageElement>(null)
  const boatRef = useRef<HTMLImageElement>(null)

  // Comprobar si las imágenes ya están en caché y cargadas en el montaje
  useEffect(() => {
    if (tierraRef.current && tierraRef.current.complete) {
      setTierraLoaded(true)
    }
    if (nubesRef.current && nubesRef.current.complete) {
      setNubesLoaded(true)
    }
    if (boatRef.current && boatRef.current.complete) {
      setBarcoLoaded(true)
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
    scrollCtx ? ['0%', '25%', '25%'] : ['0%', '25%']
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
      className="section-1-hero"
      style={{
        gridArea: 's1',
        position: 'relative',
        width: '100%',
        maxWidth: '1920px',
        minWidth: '320px',
        margin: '0 auto',
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '0px',
        boxSizing: 'border-box',
        backgroundColor: '#0D2137',
      }}
    >
      {/* Capa 1: Cielo y Video de Nubes (Fondo) — Step 1: Solid initial paint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          y: layer1Y,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            ref={nubesRef}
            src="/images/home/parallax/cielo%20extendido%20v2.webp?v=3"
            alt="Cielo Abra de Getxo"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setNubesLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          />

          {/* Step 2: Video de nubes */}
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onCanPlay={() => setVideoLoaded(true)}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 2,
            }}
          >
            <source src="/images/home/parallax/Fluffy_clouds_drifting_across_sky_202606160528.mp4" type="video/mp4" />
          </motion.video>
        </div>
      </motion.div>

      {/* Capa 2: Costa,ภูเขา และทะเล — Step 1: Solid initial paint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          y: layer2Y,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            ref={tierraRef}
            src="/images/home/parallax/tierra.webp?v=5"
            alt="Costa y mar del Abra de Getxo"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setTierraLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </motion.div>

      {/* Capa 3: Velero — Step 3: ค่อยๆ เฟดเข้าประจำตำแหน่งที่ 0.5s และเริ่มโยกตัวนุ่มนวล */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
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
            y: [0, 18, 0, -18, 0],
            x: [0, -5, 0, 5, 0],
            rotate: [0, 0.5, 0, -0.5, 0],
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
                left: `${aspect.left}px`,
                top: `${aspect.top}px`,
                width: `${aspect.width}px`,
                height: `${aspect.height}px`,
                transform: 'translateX(0px)',
                transformOrigin: 'top center',
              }}
            >
              <picture>
                {/* AVIF Sources */}
                <source
                  type="image/avif"
                  srcSet="/images/home/parallax/velero_mobile.avif?v=1 768w, /images/home/parallax/velero_desktop.avif?v=1 1920w"
                  sizes="(max-width: 768px) 768px, 1920px"
                />
                {/* WebP Sources */}
                <source
                  type="image/webp"
                  srcSet="/images/home/parallax/velero_mobile.webp?v=1 768w, /images/home/parallax/velero_desktop.webp?v=1 1920w"
                  sizes="(max-width: 768px) 768px, 1920px"
                />
                <img
                  ref={boatRef}
                  src="/images/home/parallax/velero_desktop.webp?v=1"
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
              </picture>
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
        animate={mounted ? 'visible' : 'hidden'}
        className="hero-text-container"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'left',
          padding: isPhone ? '0 1.2rem' : '0 clamp(1rem, 4vw, 4rem)',
          width: '100%',
          maxWidth: 'min(1400px, 90vw)',
          margin: '0 auto',
          color: 'var(--white)',
          y: layer3Y,
          marginTop: isLandscape ? `calc(-55px * ${viewportScale})` : isPhone ? '-40px' : '-140px',
          top: isLandscape ? '-2vh' : isMobile ? '-2vh' : '-2vh',
          transform: isLandscape ? `scale(${Math.max(0.62, viewportScale * 0.70)})` : 'none',
          transformOrigin: 'left center',
        }}
      >
        {/* Eyebrow — ubicación */}
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'flex-start',
            marginBottom: isLandscape ? '0.1rem' : isPhone ? '0.1rem' : '0.75rem',
            marginTop: '0px',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-light)" fontSize={(isPhone || isLandscape) ? '0.7rem' : '0.95rem'} />
        </div>
 
        {/* Logo / Nombre de la escuela */}
        <div style={{ marginBottom: isLandscape ? '0.1rem' : isPhone ? '0.1rem' : '1rem' }}>
          <LogoGBE isPhone={isPhone || isLandscape} />
        </div>
  
        {/* Título principal */}
        <h1
          style={{
            fontSize: isLandscape ? 'clamp(1.1rem, 3.8vw, 1.8rem)' : isPhone ? 'clamp(1.05rem, 4.2vw, 1.45rem)' : 'clamp(2rem, 4.2vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: (isPhone || isLandscape) ? 1.06 : 1.12,
            color: 'var(--white)',
            marginBottom: isLandscape ? '0.1rem' : isPhone ? '0.15rem' : '0.85rem',
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
            gap: (isPhone || isLandscape) ? '6px' : '16px',
            maxWidth: '710px',
            margin: isLandscape ? '0 0 0.15rem' : isPhone ? '0 0 0.25rem' : '0 0 1.25rem',
            textAlign: 'left',
          }}
        >
          {/* Línea vertical color granate del logotipo */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 13, delay: 1.4 }}
            style={{
              width: (isPhone || isLandscape) ? '3px' : '4px',
              backgroundColor: '#A91D22', // Granate del logo
              transformOrigin: 'top',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: isLandscape ? 'clamp(0.68rem, 1.9vw, 0.82rem)' : isPhone ? 'clamp(0.68rem, 2.6vw, 0.8rem)' : 'clamp(1rem, 1.8vw, 1.25rem)',
              fontWeight: 400,
              lineHeight: (isPhone || isLandscape) ? 1.15 : 1.35,
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
          className="mt-3 md:mt-4"
        >
          <GlowButton href="#" color="garnet" size="sm">
            {t('cta')}
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Los 5 blobs/videos interactivos */}
      <div
        className="hero-video-blobs-container"
        style={{
          position: 'absolute',
          bottom: isLandscape ? 'calc(9vh + env(safe-area-inset-bottom, 0px))' : 'calc(clamp(40px, 7vh, 100px) + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1280px',
          padding: '0 16px',
          zIndex: 15,
        }}
      >
        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="hero-blobs-grid"
              style={{
                width: '100%',
                transformOrigin: 'center bottom',
              }}
            >
              {CARDS.map((card, idx) => (
                <BlobCard key={card.title} {...card} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Criaturas animadas — pasan detrás del contenido */}
      <Seagull
        style={{
          position: 'absolute',
          top: isPhone ? '12%' : '15%',
          right: isPhone ? '43%' : '-10%',
          zIndex: 2, // Detrás del barco (zIndex 3) y delante del cielo (zIndex 1)
          transform: isPhone ? 'scale(0.8)' : 'none',
        }}
        enterDelay={1.5}
        direction="left"
      />
    </section>
  )
}

// ── Componente interno: logo GBE (Reducido ~18% conservando estilo e identidad) ───────────────────────────────
function LogoGBE({ isPhone }: { isPhone?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isPhone ? '8px' : '10px',
        maxWidth: '100%',
      }}
    >
      <motion.svg 
        width={isPhone ? "21.78" : "32.67"} 
        height={isPhone ? "21.78" : "32.67"} 
        viewBox="0 0 36 36" 
        fill="none" 
        aria-hidden="true"
        style={{ flexShrink: 0 }}
        initial={{ y: -60, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
      >
        <path d="M18 4 L4 28 L18 26 Z" fill="white" opacity="0.9" />
        <path d="M18 8 L32 28 L18 26 Z" fill="white" opacity="0.5" />
        <line x1="4" y1="30" x2="32" y2="30" stroke="white" strokeWidth="2" />
      </motion.svg>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <AnimatedText
          text="Getxo Bela Eskola"
          effect="falling"
          delay={0.35}
          style={{
            fontSize: isPhone ? '0.87rem' : '1.168rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'white',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
    </div>
  )
}



// ── Componente interno: botón de Acceso flotando en el velero ─────────────────
function SailboatAccesoButton() {
  const locale = useLocale()
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
    const handleScroll = () => {
      setShowButton(window.scrollY < 250)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

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
          className="scale-75 sm:scale-90 md:scale-100"
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
              padding: locale === 'eu' ? 'clamp(6px, 1vw, 16px) clamp(12px, 2vw, 34px)' : 'clamp(8px, 1.2vw, 20px) clamp(16px, 2.5vw, 44px)',
              display: 'inline-block'
            }}
          >
            <motion.div
              style={{
                fontSize: locale === 'eu' ? 'clamp(10px, 1.2vw, 18px)' : 'clamp(11px, 1.5vw, 22px)'
              }}
              className="flex flex-col items-center justify-center leading-[0.85] font-black tracking-[0.12em] text-center"
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
