'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

function CanvasBlobVideo({ videoSrc, paths }: { videoSrc: string; paths: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoSrc.endsWith('.webm') ? videoSrc.replace('.webm', '.mp4') : videoSrc
    video.autoplay = true
    video.loop = true
    video.muted = true
    // @ts-ignore
    video.playsInline = true
    // @ts-ignore
    video['webkit-playsinline'] = true
    video.preload = 'auto'
    video.style.display = 'none'
    document.body.appendChild(video)
    videoRef.current = video

    video.play().catch(() => {})

    let animationFrameId: number
    const startTime = performance.now()

    const render = (now: number) => {
      const canvas = canvasRef.current
      if (canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, 100, 100)

          // Interpolate SVG Morphing Path
          const elapsed = ((now - startTime) % 8000) / 8000
          let currentD = paths[0]
          if (elapsed < 0.33) {
            currentD = paths[0]
          } else if (elapsed < 0.66) {
            currentD = paths[1]
          } else {
            currentD = paths[2]
          }

          // Clip Canvas context to current Morphing Path
          ctx.save()
          const p = new Path2D(currentD)
          ctx.clip(p)
          ctx.drawImage(video, 0, 0, 100, 100)
          ctx.restore()
        }
      }
      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (video.parentNode) {
        video.parentNode.removeChild(video)
      }
    }
  }, [videoSrc, paths])

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={100}
      className="w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

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

  // Check if the video is already cached/loaded when loadVideo triggers
  useEffect(() => {
    if (loadVideo && videoRef.current) {
      if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        setVideoReady(true)
      }
    }
  }, [loadVideo])

  // Resolve which video format to use (mp4 as reliable fallback or direct videoSrc)
  const [videoUrl, setVideoUrl] = useState<string>(videoSrc)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const v = document.createElement('video')
      const canPlayWebm = v.canPlayType('video/webm')
      if (!canPlayWebm && videoSrc.endsWith('.webm')) {
        setVideoUrl(videoSrc.replace('.webm', '.mp4'))
      } else {
        setVideoUrl(videoSrc)
      }
    }
  }, [videoSrc])

  // Load and auto-play videos on all screen sizes (desktop, tablet, mobile) automatically
  useEffect(() => {
    setLoadVideo(true)
  }, [])

  // Quick staggered reveal timeline (no pageLoaded dependency to fix LCP)
  useEffect(() => {
    let cumulativeDelay = 100; // Fast base buffer
    for (let i = 1; i <= index; i++) {
      cumulativeDelay += 150; // Fast stagger per card
    }

    const timer = setTimeout(() => {
      setTimeToReveal(true)
    }, cumulativeDelay)

    return () => clearTimeout(timer)
  }, [index])

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

  // Control de reproducción del video (play automatically once loaded/ready with iOS/Safari fallbacks)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    // Ensure video is muted for iOS autoplay policy
    video.muted = true
    video.defaultMuted = true

    const playVideo = () => {
      if (video) {
        const promise = video.play()
        if (promise !== undefined) {
          promise.catch(() => {
            // Fallback for strict iOS power saving mode
          })
        }
      }
    }

    playVideo()

    // Add event listeners for iOS touch interaction fallback
    const handleTouch = () => {
      playVideo()
      window.removeEventListener('touchstart', handleTouch)
    }
    window.addEventListener('touchstart', handleTouch, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [loadVideo, videoReady, videoUrl])

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
      className="relative flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0"
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
            delay: 0.15
          }
        }
      }}
      initial="hidden"
      animate={startReveal ? "visible" : "hidden"}>

      {/* 🌊 UNIFIED SINGLE-SOURCE ARCHITECTURE (100% MATCHED MORPHING VIDEO & FRAME) */}
      <motion.div
        className="relative w-[52px] h-[52px] min-[360px]:w-[60px] min-[360px]:h-[60px] min-[410px]:w-[72px] min-[410px]:h-[72px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] lg:w-[135px] lg:h-[135px] xl:w-[150px] xl:h-[150px]"
        animate={{
          scale: isHovered ? 1.08 : 1.0,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 200, damping: 15 }
        }}
      >
        {/* 🌊 HYBRID HTML5 CANVAS + SVG STROKE ARCHITECTURE (Guarantees iOS Safari Blob Video Morphing) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <CanvasBlobVideo
            videoSrc={videoSrc}
            paths={[d0, d1, d2]}
          />
        </div>

        {/* 🎨 LAYER 2: MORPHING STROKE BORDER & SHIMMER */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ overflow: 'hidden' }}
        >
          <defs>
            <linearGradient id={`${clipId}-gradient`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* 🎨 LAYER 2: MORPHING STROKE BORDER (100% Identical Path & Keyframes) */}
          <motion.path
            d={d0}
            animate={{
              fill: isHovered ? `${color}33` : 'none'
            }}
            transition={{
              fill: { duration: 0.3 }
            }}
            stroke={color}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{ transformOrigin: '50px 50px' }}
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values={`${d0}; ${d1}; ${d2}; ${d0}`}
            />
          </motion.path>

          {/* 💡 LAYER 3: Glass hover shimmer */}
          <path
            d={d0}
            fill={`url(#${clipId}-gradient)`}
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values={`${d0}; ${d1}; ${d2}; ${d0}`}
            />
          </path>
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

      {/* ข้อความกำกับ — เพิ่มความคมชัดด้วย Drop Shadow โดยไม่มีกรอบพื้นหลังสีดำ */}
      <div className="text-center w-full max-w-[110px] min-[360px]:max-w-[125px] min-[410px]:max-w-[140px] sm:max-w-[170px] md:max-w-[190px] lg:max-w-[220px] z-20 pointer-events-none px-0.5">
        <motion.p
          className="font-extrabold tracking-[0.02em] text-[11px] min-[360px]:text-[12px] sm:text-sm md:text-[15px] lg:text-lg select-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.98)] leading-snug text-white"
          style={{ color: '#ffffff' }}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-[9px] min-[360px]:text-[11px] sm:text-xs md:text-[13px] lg:text-sm font-semibold text-white mt-[2px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.98)] leading-tight opacity-95"
            animate={{ opacity: isHovered ? 1 : 0.95, y: isHovered ? -1 : 0 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

    </motion.a>
  )
}
