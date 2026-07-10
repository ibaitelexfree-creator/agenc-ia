// src/components/ui/BoatPivotParallaxCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface BoatPivotParallaxCardProps {
  backgroundImage: string
  boatImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function BoatPivotParallaxCard({
  backgroundImage,
  boatImage,
  title = 'Mar y Barca',
  subtitle = 'Fondo Pivotante con Oleaje',
  badge = 'PIVOT & TILT 3D'
}: BoatPivotParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tracking mouse position relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Springs for 3D rotation (Dynamic Tilt)
  const rotateXMouse = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 20 })
  const rotateYMouse = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 })

  // Parallax layers displacement based on mouse
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 22 })
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 22 })

  const boatX = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { stiffness: 100, damping: 18 })
  const boatY = useSpring(useTransform(y, [-0.5, 0.5], [-14, 14]), { stiffness: 100, damping: 18 })

  const waveX = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 15 })

  // Mouse position values for the interactive glare effect (in percentage)
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100])

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

  // Combine background glare style
  const glareStyle = {
    background: useTransform(
      [glareX, glareY],
      ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)`
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {/* 3D Perspective Container */}
      <div style={{ perspective: '1200px' }} className="relative cursor-pointer">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: rotateXMouse,
            rotateY: rotateYMouse,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[380px] h-[380px] rounded-2xl bg-slate-950 border border-slate-900 shadow-2xl overflow-hidden hover:shadow-cyan-500/10 transition-shadow duration-300"
        >
          {/* Layer 1: Background Sea Image (Pivots 30 degrees backwards on Hover) */}
          <motion.div
            animate={{
              rotateX: isHovered ? 30 : 0,
              z: isHovered ? -35 : 0,
              scale: isHovered ? 1.15 : 1.0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 18
            }}
            style={{
              x: bgX,
              y: bgY,
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
              transformPerspective: 1200,
            }}
            className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] select-none pointer-events-none rounded-2xl overflow-hidden"
          >
            <Image
              src={backgroundImage}
              alt="Sea Background"
              fill
              className="object-cover"
              sizes="420px"
              priority
            />
            {/* Subtle dark gradient mapping to tie elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-85" />
          </motion.div>

          {/* Layer 1.5: Animated background sea waves in deep parallax space */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[2]">
            {/* Soft wave layer 1 */}
            <motion.div
              animate={{
                x: [-120, 0],
                y: [0, 2, 0],
              }}
              transition={{
                x: { repeat: Infinity, ease: 'linear', duration: 20 },
                y: { repeat: Infinity, ease: 'easeInOut', duration: 5 },
              }}
              className="absolute bottom-[35px] left-0 w-[800px] h-[55px] opacity-20"
            >
              <svg viewBox="0 24 150 28" className="w-full h-full" preserveAspectRatio="none">
                <path d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" className="fill-cyan-800" />
              </svg>
            </motion.div>
          </div>

          {/* Wake & Foam dynamic particles emerging from the sides of the boat hull */}
          <div className="absolute inset-0 pointer-events-none select-none z-[3]">
            {/* Left Side Wake Spray */}
            <motion.div
              animate={{
                x: [135, -20],
                y: [240, 260],
                scale: [0.2, 1.6],
                opacity: [0, 0.9, 0.3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: 'easeOut',
              }}
              className="absolute w-4 h-4 bg-white/40 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{
                x: [150, 10],
                y: [245, 255],
                scale: [0.3, 1.4],
                opacity: [0, 0.8, 0.2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.0,
                delay: 1.0,
                ease: 'easeOut',
              }}
              className="absolute w-3.5 h-3.5 bg-cyan-100/30 rounded-full blur-[1.5px]"
            />

            {/* Right Side Wake Spray */}
            <motion.div
              animate={{
                x: [230, 380],
                y: [242, 262],
                scale: [0.2, 1.6],
                opacity: [0, 0.9, 0.3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                delay: 0.2,
                ease: 'easeOut',
              }}
              className="absolute w-4 h-4 bg-white/40 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{
                x: [215, 360],
                y: [247, 257],
                scale: [0.3, 1.4],
                opacity: [0, 0.8, 0.2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.0,
                delay: 1.2,
                ease: 'easeOut',
              }}
              className="absolute w-3.5 h-3.5 bg-cyan-100/30 rounded-full blur-[1.5px]"
            />
          </div>

          {/* Layer 2: Boat (Gently floating and rocking automatically; pops out on hover) */}
          <motion.div
            animate={{
              z: isHovered ? 75 : 15,
              scale: isHovered ? 1.08 : 0.97,
              y: [4, 0, 7, 1, 4], // Elegant automatic floating motion
              rotateZ: [-1.2, 1.2, -1.2], // Automatic rolling (left/right tilt)
              rotateX: isHovered ? -5 : [-0.5, 0.5, -0.5], // Pitching
            }}
            style={{
              x: boatX,
              y: boatY,
              transformStyle: 'preserve-3d',
              originY: 0.95
            }}
            transition={{
              y: { repeat: Infinity, duration: 6.5, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 8.0, ease: 'easeInOut' },
              rotateX: isHovered ? { type: 'spring', stiffness: 120, damping: 15 } : { repeat: Infinity, duration: 5.5, ease: 'easeInOut' },
              type: 'spring',
              stiffness: 120,
              damping: 15
            }}
            className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none select-none z-[4]"
          >
            <Image
              src={boatImage}
              alt="Sailing Boat"
              fill
              className="object-cover drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] brightness-110 contrast-105"
              sizes="420px"
              priority
            />
          </motion.div>

          {/* Layer 3: Translucent foreground sea waves overlay (wrapping the boat in depth space) */}
          <motion.div
            style={{
              x: waveX,
              z: 68,
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-0 inset-x-0 h-[100px] pointer-events-none select-none overflow-hidden z-[5]"
          >
            <svg
              className="absolute bottom-0 w-full h-full opacity-60"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
            >
              <defs>
                <path
                  id="front-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="opacity-90">
                <use
                  href="#front-wave"
                  x="48"
                  y="0"
                  className="fill-cyan-100/10 animate-[wave_14s_linear_infinite]"
                />
                <use
                  href="#front-wave"
                  x="48"
                  y="3"
                  className="fill-white/10 animate-[wave_6s_linear_infinite]"
                />
              </g>
            </svg>
          </motion.div>

          {/* Interactive Ambient Light Glare Sheet overlay */}
          <motion.div
            style={glareStyle}
            className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-0 hover:opacity-100 transition-opacity duration-300"
          />

          {/* Info Card Overlay - Pops out high in Z space */}
          <motion.div
            animate={{
              z: isHovered ? 95 : 20,
              y: isHovered ? -12 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 18
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
