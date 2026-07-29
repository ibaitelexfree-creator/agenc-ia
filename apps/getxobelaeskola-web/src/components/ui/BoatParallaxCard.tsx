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

  const boundsRef = useRef({ left: 0, top: 0, width: 0, height: 0 })

  import { useEffect } from 'react'
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateBounds = () => {
      const rect = el.getBoundingClientRect()
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      }
    }
    
    const resizeObserver = new ResizeObserver(updateBounds)
    resizeObserver.observe(el)
    window.addEventListener('resize', updateBounds, { passive: true })
    updateBounds()
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBounds)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = boundsRef.current
    if (!bounds.width) return
    const mouseX = e.pageX - bounds.left - bounds.width / 2
    const mouseY = e.pageY - bounds.top - bounds.height / 2
    x.set(mouseX / bounds.width)
    y.set(mouseY / bounds.height)
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40" />
          </motion.div>

          {/* Layer 1.5: Semi-transparent background wave layers */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[2]">
            {/* Background Wave Layer 1 */}
            <motion.div
              animate={{
                x: [-150, 0],
                y: [0, 4, 0],
              }}
              transition={{
                x: { repeat: Infinity, ease: 'linear', duration: 18 },
                y: { repeat: Infinity, ease: 'easeInOut', duration: 6 },
              }}
              className="absolute bottom-[30px] left-0 w-[800px] h-[60px] opacity-25"
            >
              <svg viewBox="0 24 150 28" className="w-full h-full" preserveAspectRatio="none">
                <path d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" className="fill-cyan-700" />
              </svg>
            </motion.div>

            {/* Background Wave Layer 2 */}
            <motion.div
              animate={{
                x: [0, -150],
                y: [2, -2, 2],
              }}
              transition={{
                x: { repeat: Infinity, ease: 'linear', duration: 22 },
                y: { repeat: Infinity, ease: 'easeInOut', duration: 7 },
              }}
              className="absolute bottom-[10px] left-0 w-[800px] h-[70px] opacity-20"
            >
              <svg viewBox="0 24 150 28" className="w-full h-full" preserveAspectRatio="none">
                <path d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" className="fill-teal-600" />
              </svg>
            </motion.div>
          </div>

          {/* Wake & Foam particles (Trailing on both sides of the boat hull, balanced and natural) */}
          <div className="absolute inset-0 pointer-events-none select-none z-[3]">
            {/* Left Side Foam & Spray (Drifting left) */}
            <motion.div
              animate={{
                x: [120, -30],
                y: [248, 268],
                scale: [0.3, 1.7],
                opacity: [0, 0.95, 0.4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: 'easeOut',
              }}
              className="absolute w-4.5 h-4.5 bg-white/50 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{
                x: [135, -10],
                y: [253, 270],
                scale: [0.2, 1.4],
                opacity: [0, 0.85, 0.3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                delay: 0.7,
                ease: 'easeOut',
              }}
              className="absolute w-3.5 h-3.5 bg-cyan-100/40 rounded-full blur-[1.5px]"
            />
            <motion.div
              animate={{
                x: [150, 10],
                y: [246, 260],
                scale: [0.4, 1.9],
                opacity: [0, 0.9, 0.2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.9,
                delay: 1.4,
                ease: 'easeOut',
              }}
              className="absolute w-5 h-5 bg-white/30 rounded-full blur-[2px]"
            />

            {/* Right Side Foam & Spray (Drifting right, synchronized with 0.1s organic delay) */}
            <motion.div
              animate={{
                x: [240, 390],
                y: [253, 273],
                scale: [0.3, 1.7],
                opacity: [0, 0.95, 0.4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                delay: 0.1,
                ease: 'easeOut',
              }}
              className="absolute w-4.5 h-4.5 bg-white/50 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{
                x: [220, 370],
                y: [250, 268],
                scale: [0.2, 1.5],
                opacity: [0, 0.85, 0.3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                delay: 0.8,
                ease: 'easeOut',
              }}
              className="absolute w-3.5 h-3.5 bg-cyan-100/40 rounded-full blur-[1.5px]"
            />
            <motion.div
              animate={{
                x: [260, 410],
                y: [256, 276],
                scale: [0.4, 2.0],
                opacity: [0, 0.9, 0.2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.9,
                delay: 1.5,
                ease: 'easeOut',
              }}
              className="absolute w-5.5 h-5.5 bg-white/30 rounded-full blur-[2.5px]"
            />
          </div>

          {/* Dynamic Wave Crashes / Splash hitting the boat (synchronized with the rocking motion) */}
          <div className="absolute inset-0 pointer-events-none select-none z-[4] overflow-hidden">
            {/* Left side splash (Triggered on left roll) */}
            <motion.div
              animate={{
                scale: [0.85, 1.25, 0.9],
                opacity: [0.35, 0.95, 0.35],
                x: [-8, 8, -8],
                y: [223, 216, 223],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.6,
                ease: 'easeInOut',
              }}
              className="absolute left-[70px] w-[100px] h-[65px] opacity-70 filter blur-[1px]"
            >
              <svg viewBox="0 0 100 60" className="w-full h-full fill-cyan-100/45">
                <path d="M0 60 C30 45, 45 15, 55 5 C65 20, 75 45, 100 60 Z" />
                <circle cx="55" cy="10" r="3.5" className="fill-white/75" />
                <circle cx="48" cy="20" r="2.5" className="fill-white/60" />
                <circle cx="62" cy="25" r="3" className="fill-white/60" />
              </svg>
            </motion.div>

            {/* Right side splash (Triggered on right roll, offset phase) */}
            <motion.div
              animate={{
                scale: [0.9, 0.65, 1.2],
                opacity: [0.85, 0.2, 0.95],
                x: [8, -3, 8],
                y: [233, 238, 230],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.6,
                delay: 1.8,
                ease: 'easeInOut',
              }}
              className="absolute right-[80px] w-[90px] h-[60px] opacity-65 filter blur-[1.5px]"
            >
              <svg viewBox="0 0 100 60" className="w-full h-full fill-white/40">
                <path d="M0 60 C25 40, 55 10, 65 5 C75 15, 85 40, 100 60 Z" />
                <circle cx="65" cy="8" r="3" className="fill-white/80" />
                <circle cx="57" cy="18" r="2" className="fill-cyan-50/70" />
              </svg>
            </motion.div>
          </div>

          {/* Layer 2: Boat (Ultimate Rocking & Floating - perfectly balanced) */}
          <motion.div
            animate={{
              z: isHovered ? 50 : 15,
              y: [8, 3, 11, 6, 8], // Elegant floating motion (seated naturally in the water)
              rotateZ: [-1.4, 1.4, -1.4], // Rolling (left/right tilt)
              rotateX: [-0.6, 0.6, -0.6], // Pitching (front/back tilt)
            }}
            style={{
              x: boatX,
              y: boatY,
              transformStyle: 'preserve-3d',
            }}
            transition={{
              y: { repeat: Infinity, duration: 6.0, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 8.0, ease: 'easeInOut' },
              rotateX: { repeat: Infinity, duration: 5.0, ease: 'easeInOut' },
              type: 'spring',
              stiffness: 100,
              damping: 18
            }}
            className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none select-none z-[5]"
          >
            {/* Clean transparent cutout at identical aspect ratio and scale as background */}
            <Image
              src={boatImage}
              alt="Sailing Boat"
              fill
              className="object-cover opacity-100 filter brightness-110 contrast-105 saturate-105"
              sizes="420px"
            />
          </motion.div>

          {/* Layer 3: Translucent foreground sea waves overlay (lively with 4 layers and active foam overlay) */}
          <motion.div
            style={{
              x: waveX,
              z: 70,
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-0 inset-x-0 h-[115px] pointer-events-none select-none overflow-hidden z-[6]"
          >
            <svg
              className="absolute bottom-0 w-full h-full opacity-75"
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
              <g className="opacity-95">
                {/* Light shimmering surface waves revealing original background sea */}
                <use
                  href="#light-wave"
                  x="48"
                  y="0"
                  className="fill-cyan-200/10 animate-[wave_12s_linear_infinite]"
                />
                {/* Soft middle wave highlights */}
                <use
                  href="#light-wave"
                  x="48"
                  y="2"
                  className="fill-teal-200/15 animate-[wave_8s_linear_infinite]"
                />
                {/* Translucent wave crests */}
                <use
                  href="#light-wave"
                  x="48"
                  y="4"
                  className="fill-white/10 animate-[wave_5s_linear_infinite]"
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


