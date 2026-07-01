'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

interface BlobCardProps {
  title: string
  subtitle: string
  color: string         // color del título
  videoSrc: string      // ruta del video
  imageSrc: string      // fallback imagen
  paths: string[]       // las 3 rutas de morphing
  href: string
  index?: number
}

export function BlobCard({ title, subtitle, color, videoSrc, imageSrc, paths = [], href, index = 0 }: BlobCardProps) {
  const d0 = paths[0] || "M50,10 C80,5 95,30 90,55 C85,80 65,95 45,90 C25,85 5,70 10,45 C15,20 20,15 50,10Z"
  const d1 = paths[1] || d0
  const d2 = paths[2] || d0

  const [isHovered, setIsHovered] = useState(false)
  const [inView, setInView] = useState(false)         // para mobile
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const clipId = `clip-${title.replace(/\s/g, '')}`

  const [pageLoaded, setPageLoaded] = useState(false)
  const [loadVideo, setLoadVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [timeToReveal, setTimeToReveal] = useState(false)
  const [startReveal, setStartReveal] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)

  // Detect page load event or readyState to ensure videos load last
  useEffect(() => {
    const handleLoad = () => {
      setPageLoaded(true)
    }

    if (document.readyState === 'complete') {
      setPageLoaded(true)
    } else {
      window.addEventListener('load', handleLoad)
      // Fallback timer to make sure cards reveal even if page load event gets blocked/delayed
      const fallbackTimer = setTimeout(() => {
        setPageLoaded(true)
      }, 3500)
      return () => {
        window.removeEventListener('load', handleLoad)
        clearTimeout(fallbackTimer)
      }
    }
  }, [])

  // Lazy load video only when hovered or when in view (mobile)
  useEffect(() => {
    if (isHovered || inView) {
      setLoadVideo(true)
    }
  }, [isHovered, inView])

  // Check if the video is already cached/loaded when loadVideo triggers
  useEffect(() => {
    if (loadVideo && videoRef.current) {
      if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        setVideoReady(true)
      }
    }
  }, [loadVideo])

  // Staggered reveal timeline per card based on its index with random gaps between 400ms and 800ms
  useEffect(() => {
    if (!pageLoaded) return

    // Calculate cumulative delay using a deterministic pseudo-random gap [400, 800] per step
    let cumulativeDelay = 600; // Base buffer after page load
    for (let i = 1; i <= index; i++) {
      // Deterministic hash based on step i to get consistent gaps on client renders
      const hash = Math.sin(i * 9876.54) * 10000;
      const randGap = (hash - Math.floor(hash)) * 400 + 400; // Random value in [400, 800]
      cumulativeDelay += randGap;
    }

    const timer = setTimeout(() => {
      setTimeToReveal(true)
    }, cumulativeDelay)

    return () => clearTimeout(timer)
  }, [pageLoaded, index])

  // Trigger the reveal as soon as the staggered time slot has arrived (no video block)
  useEffect(() => {
    if (timeToReveal) {
      setStartReveal(true)
    }
  }, [timeToReveal])

  // Atracción magnética muy suave y lenta (como fluido/líquido)
  const { x: magX, y: magY } = useMagneticCursor(cardRef, { 
    strength: 0.35, 
    radius: 90,
    stiffness: 60,
    damping: 15,
    mass: 1.2
  })

  // Control de reproducción del video (hover en desktop / inView en mobile)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const shouldPlay = isHovered || inView
    if (shouldPlay) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, inView, loadVideo])

  // Intersection Observer para activar en mobile al estar al centro de la pantalla
  useEffect(() => {
    const card = document.getElementById(`blob-card-${title.replace(/\s/g, '')}`)
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.intersectionRatio > 0.6)
      },
      { threshold: [0.6] }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [title])

  // Estado para los parámetros de movimiento aleatorio generados en el cliente
  const [motionParams, setMotionParams] = useState<{
    yAmpRise1: number
    yAmpFall1: number
    yAmpRise2: number
    yAmpFall2: number
    xOffsetRise1: number
    xOffsetFall1: number
    xOffsetRise2: number
    xOffsetFall2: number
    rot1: number
    rot2: number
    rot3: number
    rot4: number
  } | null>(null)

  useEffect(() => {
    // Generamos amplitudes verticales independientes para cada una de las subidas/bajadas (2 ciclos completos)
    // Rango vertical de subida (le restamos 5 para evitar colisiones arriba)
    const yRise1 = 10 + Math.random() * 15
    const yFall1 = 10 + Math.random() * 15
    const yRise2 = 10 + Math.random() * 15
    const yFall2 = 10 + Math.random() * 15

    // Generamos offsets horizontales totalmente independientes (izquierda/derecha, amplios/estrechos)
    const xRise1 = (Math.random() * 70) - 35 // -35px a +35px
    const xFall1 = (Math.random() * 70) - 35
    const xRise2 = (Math.random() * 70) - 35
    const xFall2 = (Math.random() * 70) - 35

    // Rotaciones aleatorias para cada golpe
    const r1 = (Math.random() * 6) - 3 // -3° a +3°
    const r2 = (Math.random() * 6) - 3
    const r3 = (Math.random() * 6) - 3
    const r4 = (Math.random() * 6) - 3

    setMotionParams({
      yAmpRise1: yRise1,
      yAmpFall1: yFall1,
      yAmpRise2: yRise2,
      yAmpFall2: yFall2,
      xOffsetRise1: xRise1,
      xOffsetFall1: xFall1,
      xOffsetRise2: xRise2,
      xOffsetFall2: xFall2,
      rot1: r1,
      rot2: r2,
      rot3: r3,
      rot4: r4,
    })
  }, [])

  // floatY y floatX van acompasados en fase con la marea (2 ciclos completos de 12s cada uno = 24s total)
  // Cada subida y bajada tiene vectores (X, Y) completamente asimétricos e independientes
  const floatY = motionParams 
    ? [
        0, 
        -(motionParams.yAmpRise1 - 5), 
        0, 
        motionParams.yAmpFall1, 
        0, 
        -(motionParams.yAmpRise2 - 5), 
        0, 
        motionParams.yAmpFall2, 
        0
      ]
    : [0, 0, 0, 0, 0, 0, 0, 0, 0]

  const floatX = motionParams
    ? [
        0, 
        motionParams.xOffsetRise1, 
        0, 
        motionParams.xOffsetFall1, 
        0, 
        motionParams.xOffsetRise2, 
        0, 
        motionParams.xOffsetFall2, 
        0
      ]
    : [0, 0, 0, 0, 0, 0, 0, 0, 0]

  const floatRotate = motionParams
    ? [
        0, 
        motionParams.rot1, 
        0, 
        motionParams.rot2, 
        0, 
        motionParams.rot3, 
        0, 
        motionParams.rot4, 
        0
      ]
    : [0, 0, 0, 0, 0, 0, 0, 0, 0]

  return (
    <motion.a
      ref={cardRef}
      id={`blob-card-${title.replace(/\s/g, '')}`}
      href={href}
      className="relative flex flex-col items-center gap-2 group cursor-pointer shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { scale: 0, opacity: 0 },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 90,
            damping: 14,
            mass: 1.1,
            delay: 0.15 // Emerge right at the peak of the glow portal
          }
        }
      }}
      initial="hidden"
      animate={startReveal ? "visible" : "hidden"}
      style={{
        x: magX,
        y: magY,
      }}
    >
      {/* El charco SVG (flota en tempo de 24s con el velero, pero con personalidad propia y se agranda al hover) */}
      <motion.div
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-40 lg:h-40"
        animate={{
          y: floatY,
          x: floatX,
          rotate: floatRotate,
          scale: isHovered ? 1.18 : 1.0,
        }}
        transition={{
          y: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          scale: { type: 'spring', stiffness: 200, damping: 15 }
        }}
      >
        {/* SVG Defs para clipPath */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Máscara al 90% para la imagen y el video */}
            <clipPath id={clipId}>
              <motion.path
                d={d0}
                animate={{ d: [d0, d1, d2, d0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                transform="translate(50 50) scale(0.90) translate(-50 -50)"
              />
            </clipPath>
            {/* Máscara al 100% para el brillo del hover */}
            <clipPath id={`${clipId}-full`}>
              <motion.path
                d={d0}
                animate={{ d: [d0, d1, d2, d0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </clipPath>
            <linearGradient id={`${clipId}-gradient`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Forma visible de fondo que respira e interactúa al hover */}
          <motion.path
            d={d0}
            animate={{
              d: [d0, d1, d2, d0],
              scale: isHovered ? 1.06 : 1.0,
              fill: isHovered ? `${color}44` : `${color}22`
            }}
            transition={{
              d: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
              fill: { duration: 0.3 }
            }}
            stroke={color}
            strokeWidth="0.8"
            style={{ transformOrigin: 'center' }}
          />

          {/* Imagen recortada */}
          <g clipPath={`url(#${clipId})`}>
            <image
              href={imageSrc}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="xMidYMid slice"
              style={{
                opacity: isHovered || inView ? 0 : 1,
                transition: 'opacity 0.4s'
              }}
            />
          </g>

          {/* Video recortado */}
          <g clipPath={`url(#${clipId})`}>
            <foreignObject x="0" y="0" width="100" height="100">
              {loadVideo && (
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setVideoReady(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isHovered || inView ? 1 : 0,
                    transition: 'opacity 0.4s',
                  }}
                >
                  {videoSrc.endsWith('.webm') ? (
                    <>
                      <source src={videoSrc} type="video/webm" />
                      <source src={videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
                    </>
                  ) : (
                    <source src={videoSrc} type="video/mp4" />
                  )}
                  <track kind="captions" src="data:text/vtt," label="No captions" default />
                </video>
              )}
            </foreignObject>
          </g>

          {/* Brillo al pasar el cursor */}
          <motion.rect
            x="0"
            y="0"
            width="100"
            height="100"
            clipPath={`url(#${clipId}-full)`}
            fill={`url(#${clipId}-gradient)`}
            pointerEvents="none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </svg>

        {/* Portal de Teletransportación Mágica */}
        <AnimatePresence>
          {!revealComplete && startReveal && (
            <>
              {/* Resplandor de luz central */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.8, 1.4, 0],
                  opacity: [0, 1, 0.8, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.3,
                  times: [0, 0.25, 0.6, 1],
                  ease: "easeOut",
                }}
                onAnimationComplete={() => setRevealComplete(true)}
                className="absolute inset-[-40%] rounded-full pointer-events-none mix-blend-screen"
                style={{
                  background: `radial-gradient(circle, #ffffff 0%, ${color} 45%, transparent 70%)`,
                  filter: 'blur(16px)',
                  boxShadow: `0 0 45px 15px ${color}, 0 0 90px 30px #ffffff`,
                  zIndex: 30,
                }}
              />
              {/* Onda expansiva de luz en anillo */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 2.3],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                  delay: 0.1,
                }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: `3px double ${color}`,
                  boxShadow: `0 0 25px ${color}, inset 0 0 25px ${color}`,
                  filter: 'blur(1px)',
                  zIndex: 29,
                }}
              />
              {/* Brillo mágico / destello de hadas giratorio */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="absolute inset-[-20%] rounded-full pointer-events-none mix-blend-color-dodge"
                style={{
                  background: `radial-gradient(circle, #ffffff 10%, ${color} 30%, transparent 60%)`,
                  filter: 'blur(8px) brightness(1.5)',
                  zIndex: 31,
                }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Texto de la etiqueta */}
      <div className="text-center">
        <motion.p
          className="font-bold tracking-[0.05em] text-sm sm:text-base md:text-lg select-none uppercase"
          style={{ color: '#ffffff' }}
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-sm sm:text-base text-white mt-[2px]"
            animate={{ opacity: isHovered ? 1 : 0.6, y: isHovered ? -2 : 0 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

    </motion.a>
  )
}
