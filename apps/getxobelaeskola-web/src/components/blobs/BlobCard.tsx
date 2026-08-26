'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

function CanvasBlobVideo({ videoSrc, imageSrc, paths, color, isHovered }: { videoSrc: string; imageSrc: string; paths: string[]; color: string; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fallbackImg = new Image()
    if (imageSrc) {
      fallbackImg.src = imageSrc
    }

    const video = document.createElement('video')
    const canPlayWebm = video.canPlayType('video/webm')
    video.src = (canPlayWebm && videoSrc.endsWith('.webm')) ? videoSrc : (videoSrc.endsWith('.webm') ? videoSrc.replace('.webm', '.mp4') : videoSrc)
    video.autoplay = true
    video.loop = true
    video.muted = true
    // @ts-ignore
    video.playsInline = true
    // @ts-ignore
    video['webkit-playsinline'] = true
    video.preload = 'auto'
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('loop', '')
    video.setAttribute('fetchpriority', 'high')
    video.style.display = 'none'
    document.body.appendChild(video)
    videoRef.current = video

    const startPlay = () => {
      video.play().catch(() => {})
    }
    video.addEventListener('canplay', startPlay, { once: true })
    video.play().catch(() => {})

    let animationFrameId: number
    const startTime = performance.now()

    const render = (now: number) => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, 100, 100)

          // Interpolate SVG Morphing Path smoothly matching SMIL 8s animation
          const cycleMs = 8000
          const progress = ((now - startTime) % cycleMs) / cycleMs
          
          let fromD = paths[0]
          let toD = paths[1]
          let blend = 0

          if (progress < 0.333) {
            fromD = paths[0]
            toD = paths[1]
            blend = progress / 0.333
          } else if (progress < 0.666) {
            fromD = paths[1]
            toD = paths[2]
            blend = (progress - 0.333) / 0.333
          } else {
            fromD = paths[2]
            toD = paths[0]
            blend = (progress - 0.666) / 0.334
          }

          // Parse and interpolate cubic bezier path numbers smoothly
          const fromNums = fromD.match(/-?\d+(\.\d+)?/g)?.map(Number) || []
          const toNums = toD.match(/-?\d+(\.\d+)?/g)?.map(Number) || []
          
          let interpolatedD = fromD
          if (fromNums.length > 0 && fromNums.length === toNums.length) {
            let numIdx = 0
            interpolatedD = fromD.replace(/-?\d+(\.\d+)?/g, () => {
              const startVal = fromNums[numIdx]
              const endVal = toNums[numIdx]
              numIdx++
              const val = startVal + (endVal - startVal) * blend
              return val.toFixed(2)
            })
          }

          if (typeof Path2D !== 'undefined') {
            const p = new Path2D(interpolatedD)

            // LAYER 1: VIDEO OR THUMBNAIL (Clipped to interpolated morphing path)
            ctx.save()
            ctx.clip(p)
            if (video.readyState >= 2) {
              ctx.drawImage(video, 0, 0, 100, 100)
            } else if (fallbackImg.complete && fallbackImg.naturalWidth > 0) {
              ctx.drawImage(fallbackImg, 0, 0, 100, 100)
            } else {
              ctx.fillStyle = `${color}55`
              ctx.fill(p)
            }
            ctx.restore()

            // LAYER 2: MORPHING STROKE BORDER (100% Identical Path and Render Frame)
            ctx.save()
            if (isHovered) {
              ctx.fillStyle = `${color}33`
              ctx.fill(p)
            }
            ctx.strokeStyle = color
            ctx.lineWidth = 2.5
            ctx.stroke(p)
            ctx.restore()
          }
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
  }, [videoSrc, paths, color, isHovered])

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
  isSceneReady?: boolean
}

export function BlobCard({ title, subtitle, color, videoSrc, imageSrc, paths = [], href, index = 0, isSceneReady }: BlobCardProps) {
  const d0 = paths[0] || "M50,10 C80,5 95,30 90,55 C85,80 65,95 45,90 C25,85 5,70 10,45 C15,20 20,15 50,10Z"
  const d1 = paths[1] || d0
  const d2 = paths[2] || d0

  const [isHovered, setIsHovered] = useState(false)
  const [inView, setInView] = useState(false)         // para mobile
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const clipId = `clip-${title.replace(/\s/g, '')}`

  const [loadVideo, setLoadVideo] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)

  // Check if the video is already cached/loaded
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
      initial="visible"
      animate="visible">

      {/* 🌊 UNIFIED SINGLE-SOURCE ARCHITECTURE (100% MATCHED MORPHING VIDEO & FRAME) */}
      <motion.div
        className="relative w-[46.00px] h-[46.00px] min-[360px]:w-[53.07px] min-[360px]:h-[53.07px] min-[410px]:w-[63.69px] min-[410px]:h-[63.69px] sm:w-[79.62px] sm:h-[79.62px] md:w-[97.31px] md:h-[97.31px] lg:w-[102.00px] lg:h-[102.00px] xl:w-[112.00px] xl:h-[112.00px] [@media(orientation:landscape)_and_(max-height:500px)]:!w-[41.16px] [@media(orientation:landscape)_and_(max-height:500px)]:!h-[41.16px]"
        animate={{
          scale: isHovered ? 1.08 : 1.0,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 200, damping: 15 }
        }}
      >
        {/* 🌊 SINGLE UNIFIED CANVAS ARCHITECTURE (Video, Morphing Stroke & Shimmer on same Canvas 2D Render Loop) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <CanvasBlobVideo
            videoSrc={videoSrc}
            imageSrc={imageSrc}
            paths={[d0, d1, d2]}
            color={color}
            isHovered={isHovered}
          />
        </div>

        {/* Portal de Teletransportación Mágica */}
        <AnimatePresence>
          {!revealComplete && (
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
      <div className="text-center w-full max-w-[107.8px] min-[360px]:max-w-[122.5px] min-[410px]:max-w-[137.2px] sm:max-w-[166.6px] md:max-w-[186.2px] lg:max-w-[180.0px] [@media(orientation:landscape)_and_(max-height:500px)]:!max-w-[78.4px] z-20 pointer-events-none px-0.5">
        <motion.p
          className="font-extrabold tracking-[0.02em] text-[10.78px] min-[360px]:text-[11.76px] sm:text-[13.72px] md:text-[14.70px] lg:text-[15.00px] [@media(orientation:landscape)_and_(max-height:500px)]:!text-[9.3px] select-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.98)] leading-snug text-white"
          style={{ color: '#ffffff' }}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-[8.82px] min-[360px]:text-[10.78px] sm:text-[11.76px] md:text-[12.74px] lg:text-[12.00px] [@media(orientation:landscape)_and_(max-height:500px)]:!text-[7.84px] font-semibold text-white mt-[2px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.98)] leading-tight opacity-95"
            animate={{ opacity: isHovered ? 1 : 0.95, y: isHovered ? -1 : 0 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

    </motion.a>
  )
}
