// src/components/ui/ThreeDVideoParallaxCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

interface ThreeDVideoParallaxCardProps {
  backgroundImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function ThreeDVideoParallaxCard({
  backgroundImage,
  title = 'Simulador de Video 3D',
  subtitle = 'Dolly-In & Parallax Efecto',
  badge = 'CINEMATIC 3D'
}: ThreeDVideoParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })

  // Motion values for tilt (interaction)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Springs for smooth 3D rotation of the card itself
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 18 })

  // Background displacement (moves opposite or slower)
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 })
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 })

  // Foreground displacement (moves more aggressively)
  const fgX = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 90, damping: 16 })
  const fgY = useSpring(useTransform(y, [-0.5, 0.5], [-12, 12]), { stiffness: 90, damping: 16 })

  // Lighting overlay displacement
  const glossX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mouseX = e.clientX - rect.left - rect.width / 2
    const mouseY = e.clientY - rect.top - rect.height / 2
    
    x.set(mouseX / rect.width)
    y.set(mouseY / rect.height)

    // Calculate light percentage coordinates
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    setLightPos({ x: px, y: py })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    setLightPos({ x: 50, y: 50 })
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div style={{ perspective: '1500px' }} className="relative cursor-pointer">
        {/* Main 3D Card Container */}
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
          {/* Layer 1: Background (Outer scenery with gentle depth-blur & slow dolly-in zoom) */}
          <motion.div
            style={{
              x: bgX,
              y: bgY,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              // Loop dolly-in zoom of 8 seconds
              scale: isHovered ? [1.06, 1.18, 1.06] : [1.03, 1.12, 1.03],
              // Handheld camera sway
              rotateZ: [0, 0.4, -0.4, 0],
              y: [0, 2, -2, 0]
            }}
            transition={{
              scale: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 12, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 6, ease: 'easeInOut' }
            }}
            className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] select-none pointer-events-none"
          >
            <Image
              src={backgroundImage}
              alt="3D Scene Background"
              fill
              className="object-cover"
              sizes="440px"
              priority
            />
          </motion.div>

          {/* Layer 2: Foreground Subject (Sharp, isolated with radial mask, zooms differently) */}
          <motion.div
            style={{
              x: fgX,
              y: fgY,
              transformStyle: 'preserve-3d',
              z: 30,
              maskImage: 'radial-gradient(circle 180px at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(circle 180px at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
            }}
            animate={{
              // Loop dolly-in with offset to create parallax depth
              scale: isHovered ? [1.09, 1.22, 1.09] : [1.05, 1.15, 1.05],
              // Counter-sway for depth mismatch
              rotateZ: [0, -0.3, 0.3, 0],
            }}
            transition={{
              scale: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 12, ease: 'easeInOut' },
            }}
            className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] select-none pointer-events-none"
          >
            <Image
              src={backgroundImage}
              alt="3D Scene Foreground"
              fill
              className="object-cover"
              sizes="440px"
            />
          </motion.div>

          {/* Layer 3: Natural Ambient Sunlight Glow & Interactive Glimmer */}
          <motion.div
            style={{
              z: 50,
              x: glossX,
              background: `radial-gradient(circle 240px at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`
            }}
            className="absolute inset-0 pointer-events-none mix-blend-screen z-[4]"
          />

          {/* Ambient Lighting Edge Reflection */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-[8]" />

          {/* Title & Info Overlays */}
          <motion.div
            animate={{
              z: isHovered ? 80 : 25,
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-1.5 pointer-events-none z-10"
          >
            {badge && (
              <span className="text-[9px] tracking-widest text-cyan-400 font-bold bg-slate-950/90 border border-cyan-950/80 px-2.5 py-0.5 rounded-full shadow-lg">
                {badge}
              </span>
            )}
            <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-900/60 flex flex-col gap-0.5 w-[210px] text-center shadow-2xl">
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
