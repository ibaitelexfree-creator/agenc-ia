'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

function CanvasBlobVideo({ videoSrc, imageSrc, paths, color, isHovered }: { videoSrc: string; imageSrc: string; paths: string[]; color: string; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Pre-tokenize SVG path numbers once on mount/props update to eliminate regex overhead in 60fps loop
  const parsedPaths = useRef<{ d: string; nums: number[] }[]>([])
  useEffect(() => {
    parsedPaths.current = paths.map(d => ({
      d,
      nums: d.match(/-?\d+(\.\d+)?/g)?.map(Number) || []
    }))
  }, [paths])

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
    video.preload = 'metadata'
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('loop', '')
    video.style.display = 'none'
    document.body.appendChild(video)
    videoRef.current = video

    let isVisible = true
    const startPlay = () => {
      if (isVisible) {
        video.play().catch(() => {})
      }
    }
    video.addEventListener('canplay', startPlay, { once: true })

    // IntersectionObserver: Pause video and animation frame loop when off-screen
    const canvasEl = canvasRef.current
    let observer: IntersectionObserver | null = null
    if (canvasEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      }, { threshold: 0.1 })
      observer.observe(canvasEl)
    } else {
      video.play().catch(() => {})
    }

    let animationFrameId: number
    const startTime = performance.now()
    let lastRender = 0
    const frameInterval = 1000 / 30

    // Canvas coordinate space is 800x800 for crystal-clear high DPI rendering
    const CANVAS_SIZE = 800
    const SCALE_FACTOR = CANVAS_SIZE / 100 // 8x scaling from SVG 0-100 viewBox

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render)

      if (!isVisible) return

      const elapsed = now - lastRender
      if (elapsed < frameInterval) return
      lastRender = now - (elapsed % frameInterval)

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      const cycleMs = 8000
      const progress = ((now - startTime) % cycleMs) / cycleMs
      
      const pData = parsedPaths.current
      if (!pData || pData.length < 3) return

      let fromObj = pData[0]
      let toObj = pData[1]
      let blend = 0

      if (progress < 0.333) {
        fromObj = pData[0]
        toObj = pData[1]
        blend = progress / 0.333
      } else if (progress < 0.666) {
        fromObj = pData[1]
        toObj = pData[2]
        blend = (progress - 0.333) / 0.333
      } else {
        fromObj = pData[2]
        toObj = pData[0]
        blend = (progress - 0.666) / 0.334
      }

      const fromNums = fromObj.nums
      const toNums = toObj.nums
      
      let interpolatedD = fromObj.d
      if (fromNums.length > 0 && fromNums.length === toNums.length) {
        let numIdx = 0
        interpolatedD = fromObj.d.replace(/-?\d+(\.\d+)?/g, () => {
          const startVal = fromNums[numIdx]
          const endVal = toNums[numIdx]
          numIdx++
          return ((startVal + (endVal - startVal) * blend) * SCALE_FACTOR).toFixed(2)
        })
      }

      if (typeof Path2D !== 'undefined') {
        const p = new Path2D(interpolatedD)

        // LAYER 1: IMAGE (Clipped to interpolated high-res morphing path)
        ctx.save()
        ctx.clip(p)
        if (fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          // Center & cover inside 800x800 canvas
          const imgAspect = fallbackImg.naturalWidth / fallbackImg.naturalHeight
          let dw = CANVAS_SIZE
          let dh = CANVAS_SIZE
          let dx = 0
          let dy = 0

          if (imgAspect > 1) {
            dw = CANVAS_SIZE * imgAspect
            dx = -(dw - CANVAS_SIZE) / 2
          } else {
            dh = CANVAS_SIZE / imgAspect
            dy = -(dh - CANVAS_SIZE) / 2
          }
          ctx.drawImage(fallbackImg, dx, dy, dw, dh)
        } else {
          ctx.fillStyle = `${color}33`
          ctx.fill(p)
        }
        ctx.restore()

        // LAYER 2: HIGH-DEF MORPHING STROKE BORDER
        ctx.save()
        if (isHovered) {
          ctx.fillStyle = `${color}22`
          ctx.fill(p)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = isHovered ? 8 : 5
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.stroke(p)
        ctx.restore()
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (observer && canvasEl) {
        observer.unobserve(canvasEl)
      }
      if (video.parentNode) {
        video.parentNode.removeChild(video)
      }
    }
  }, [videoSrc, imageSrc, color, isHovered])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export interface FacilityItem {
  id: string
  title: string
  badge: string
  desc: string
  imageSrc: string
  color: string
  icon: string
  paths: string[]
  centerPull: {
    x: number
    y: number
  }
}

interface FacilitiesBlobGalleryProps {
  items: FacilityItem[]
}

export function FacilityBlobCard({
  item,
  isHovered,
  anyHovered,
  onHoverStart,
  onHoverEnd,
}: {
  item: FacilityItem
  isHovered: boolean
  anyHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const d0 = item.paths[0] || "M50,10 C80,5 95,30 90,55 C85,80 65,95 45,90 C25,85 5,70 10,45 C15,20 20,15 50,10Z"
  const d1 = item.paths[1] || d0
  const d2 = item.paths[2] || d0

  return (
    <div
      className="relative flex flex-col items-center group cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* 🌊 Large Organic Morphing Blob with Center-Zoom Motion */}
      <motion.div
        className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center select-none"
        animate={{
          scale: isHovered ? 1.34 : anyHovered ? 0.9 : 1.0,
          x: isHovered ? item.centerPull.x : 0,
          y: isHovered ? item.centerPull.y : 0,
          zIndex: isHovered ? 50 : 10,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
          mass: 0.9,
        }}
      >
        {/* Soft volumetric glow around the blob */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            isHovered ? "opacity-80 scale-125" : "opacity-20 scale-95"
          }`}
          style={{
            background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`,
          }}
        />

        {/* Morphing Canvas */}
        <div className="w-full h-full relative z-10 drop-shadow-[0_16px_36px_rgba(0,0,0,0.25)]">
          <CanvasBlobVideo
            videoSrc=""
            imageSrc={item.imageSrc}
            paths={[d0, d1, d2]}
            color={item.color}
            isHovered={isHovered}
          />
        </div>
      </motion.div>

      {/* 🏷️ Title & Enriched Description Below the Blob - Letras Negras */}
      <motion.div
        className="mt-6 md:mt-8 max-w-sm sm:max-w-md text-center space-y-2.5 z-20 transition-all duration-500 px-4"
        animate={{
          y: isHovered ? -6 : 0,
          opacity: anyHovered ? 0.4 : 1,
        }}
      >
        <span
          className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-black/10 bg-black/5 shadow-sm"
          style={{ color: item.color }}
        >
          {item.badge}
        </span>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 tracking-tight drop-shadow-sm">
          {item.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
          {item.desc}
        </p>
      </motion.div>
    </div>
  )
}

export default function FacilitiesBlobGallery({ items }: FacilitiesBlobGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="relative w-full py-6 md:py-14">
      {/* Subtle background ambient light */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] bg-accent/5 rounded-full blur-[150px] opacity-75" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 max-w-6xl mx-auto">
          {items.map((item) => {
            const isHovered = hoveredId === item.id
            const anyHovered = hoveredId !== null && !isHovered

            return (
              <FacilityBlobCard
                key={item.id}
                item={item}
                isHovered={isHovered}
                anyHovered={anyHovered}
                onHoverStart={() => setHoveredId(item.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
