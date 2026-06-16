'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface BlobCardProps {
  title: string
  subtitle: string
  color: string         // color del título
  videoSrc: string      // ruta del video
  imageSrc: string      // fallback imagen
  paths: string[]       // las 3 rutas de morphing
  href: string
}

export function BlobCard({ title, subtitle, color, videoSrc, imageSrc, paths, href }: BlobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [inView, setInView] = useState(false)         // para mobile
  const videoRef = useRef<HTMLVideoElement>(null)
  const clipId = `clip-${title.replace(/\s/g, '')}`

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
  }, [isHovered, inView])

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

  return (
    <a
      id={`blob-card-${title.replace(/\s/g, '')}`}
      href={href}
      className="relative flex flex-col items-center gap-4 group cursor-pointer shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* El charco SVG */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32">
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
                d={paths[0]}
                animate={{ d: [paths[0], paths[1], paths[2], paths[0]] }}
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
                d={paths[0]}
                animate={{ d: [paths[0], paths[1], paths[2], paths[0]] }}
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
            d={paths[0]}
            animate={{
              d: [paths[0], paths[1], paths[2], paths[0]],
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
              <video
                ref={videoRef}
                loop
                muted
                playsInline
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
              </video>
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
      </div>

      {/* Texto de la etiqueta */}
      <div className="text-center">
        <motion.p
          className="font-bold tracking-[0.05em] text-[10px] sm:text-xs md:text-sm select-none uppercase"
          style={{ color: '#ffffff' }}
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-xs text-white mt-1"
            animate={{ opacity: isHovered ? 1 : 0.6, y: isHovered ? -2 : 0 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Indicador Ver más */}
      <motion.span
        className="text-xs font-medium"
        style={{ color: '#ffffff' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        Descubrir →
      </motion.span>
    </a>
  )
}
