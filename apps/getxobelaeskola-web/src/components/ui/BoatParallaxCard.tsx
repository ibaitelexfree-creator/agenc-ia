// src/components/ui/BoatParallaxCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface BoatParallaxCardProps {
  backgroundImage: string
  boatImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function BoatParallaxCard({
  backgroundImage,
  boatImage,
  title = 'Mar y Barca',
  subtitle = 'Navegando con oleaje 3D',
  badge = 'MAR DE SOMBRAS'
}: BoatParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Springs for 3D rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 })

  // Parallax layers displacement
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 22 })
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 22 })

  const boatX = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 18 })
  const boatY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 18 })

  const waveX = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 90, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mouseX = e.clientX - rect.left - rect.width / 2
    const mouseY = e.clientY - rect.top - rect.height / 2
    x.set(mouseX / rect.width)
    y.set(mouseY / rect.height)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div style={{ perspective: '1200px' }} className="relative cursor-pointer">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[380px] h-[380px] rounded-2xl bg-slate-950 border border-slate-900 shadow-2xl overflow-hidden hover:shadow-cyan-500/10 transition-shadow duration-300"
        >
          {/* Layer 1: Background Sea Image */}
          <motion.div
            style={{
              x: bgX,
              y: bgY,
              scale: isHovered ? 1.04 : 1.0,
              transformStyle: 'preserve-3d',
            }}
            className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] select-none pointer-events-none"
          >
            <Image
              src={backgroundImage}
              alt="Sea Background"
              fill
              className="object-cover"
              sizes="420px"
              priority
            />
            {/* Soft gradient overlay for dark sea integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
          </motion.div>

          {/* Layer 2: Boat (Gently floating and rocking) */}
          <motion.div
            animate={{
              z: isHovered ? 50 : 15,
              y: [0, -5, 0],
              rotateZ: [0, 1.5, 0, -1.5, 0]
            }}
            style={{
              x: boatX,
              y: boatY,
              transformStyle: 'preserve-3d',
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut'
              },
              rotateZ: {
                repeat: Infinity,
                duration: 6,
                ease: 'easeInOut'
              },
              type: 'spring',
              stiffness: 100,
              damping: 18
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <div className="relative w-[290px] h-[210px] overflow-hidden rounded-2xl">
              {/* Using blend mode screen + opacity to make the background transparent, keeping only boat and crew */}
              <Image
                src={boatImage}
                alt="Sailing Boat"
                fill
                className="object-cover mix-blend-screen opacity-85 filter brightness-110 contrast-125 saturate-120"
                sizes="300px"
              />
            </div>
          </motion.div>

          {/* Layer 3: Light, soft, translucent sea waves overlay */}
          <motion.div
            style={{
              x: waveX,
              z: 70,
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-0 inset-x-0 h-[80px] pointer-events-none select-none overflow-hidden"
          >
            <svg
              className="absolute bottom-0 w-full h-full opacity-60"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="light-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="opacity-90">
                {/* Gentle background wave */}
                <use
                  href="#light-wave"
                  x="48"
                  y="0"
                  className="fill-cyan-900/20 animate-[wave_16s_linear_infinite]"
                />
                {/* Soft middle wave */}
                <use
                  href="#light-wave"
                  x="48"
                  y="2"
                  className="fill-teal-950/30 animate-[wave_10s_linear_infinite]"
                />
                {/* Soft foreground wave matching the dark ocean bottom */}
                <use
                  href="#light-wave"
                  x="48"
                  y="4"
                  className="fill-slate-950/80 animate-[wave_7s_linear_infinite]"
                />
              </g>
            </svg>
          </motion.div>

          {/* Text and Title Overlay */}
          <motion.div
            animate={{
              z: isHovered ? 100 : 30,
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-5 inset-x-0 flex flex-col items-center gap-1 pointer-events-none z-10"
          >
            {badge && (
              <span className="text-[9px] tracking-widest text-cyan-400 font-bold bg-slate-950/90 border border-cyan-950 px-2 py-0.5 rounded-full shadow-lg">
                {badge}
              </span>
            )}
            <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-900 flex flex-col gap-0.5 w-[190px] text-center shadow-xl">
              <span className="text-[12px] font-black text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {title}
              </span>
              <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {subtitle}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
