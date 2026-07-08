// src/components/ui/MultiLayerParallaxCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface MultiLayerParallaxCardProps {
  backgroundImage: string
  characterImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function MultiLayerParallaxCard({
  backgroundImage,
  characterImage,
  title = 'Aventuras en el Mar',
  subtitle = 'Efecto Parallax por Capas',
  badge = 'MULTICAPA'
}: MultiLayerParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Track mouse position relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for card rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20
  })

  // Multi-layer parallax translations (layers move independently based on cursor)
  // Background moves slightly in the opposite direction of the cursor (deep depth)
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 22 })
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 22 })

  // Character moves in the direction of the cursor (pops forward)
  const charX = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), { stiffness: 120, damping: 18 })
  const charY = useSpring(useTransform(y, [-0.5, 0.5], [-18, 18]), { stiffness: 120, damping: 18 })

  // Text layer moves even more for extreme depth
  const textX = useSpring(useTransform(x, [-0.5, 0.5], [-25, 25]), { stiffness: 120, damping: 18 })
  const textY = useSpring(useTransform(y, [-0.5, 0.5], [-25, 25]), { stiffness: 120, damping: 18 })

  // Hover state transitions for scale and Z depth
  const bgScale = useSpring(isHovered ? 1.08 : 1.02, { stiffness: 150, damping: 20 })
  const charScale = useSpring(isHovered ? 1.08 : 0.98, { stiffness: 120, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    x.set(mouseX / width)
    y.set(mouseY / height)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div className="flex items-center justify-center p-8">
      {/* 3D Perspective Container */}
      <div 
        style={{ perspective: '1200px' }} 
        className="relative cursor-pointer"
      >
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
          className="relative w-[380px] h-[380px] rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-cyan-500/10 hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)]"
        >
          {/* Layer 1: Background Image (Moves in opposite direction of mouse) */}
          <motion.div
            animate={{
              filter: isHovered ? 'brightness(0.9)' : 'brightness(0.75)',
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20
            }}
            style={{
              x: bgX,
              y: bgY,
              scale: bgScale,
              transformStyle: 'preserve-3d',
            }}
            className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] select-none pointer-events-none"
          >
            <Image
              src={backgroundImage}
              alt="Card Background"
              fill
              priority
              className="object-cover"
              sizes="420px"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
          </motion.div>

          {/* Layer 2: Character Cutout (Moves in same direction of mouse + stands vertical on hover) */}
          <motion.div
            animate={{
              z: isHovered ? 80 : 0,
              rotateX: isHovered ? -8 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 15
            }}
            style={{
              x: charX,
              y: charY,
              scale: charScale,
              transformStyle: 'preserve-3d',
            }}
            className="absolute top-[-30px] bottom-[-15px] left-0 right-[-30px] select-none pointer-events-none origin-bottom"
          >
            <Image
              src={characterImage}
              alt="Character Cutout"
              fill
              priority
              className="object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] filter"
              style={{
                filter: isHovered 
                  ? 'drop-shadow(0 25px 20px rgba(0,0,0,0.85)) brightness(1.05)' 
                  : 'drop-shadow(0 10px 10px rgba(0,0,0,0.5)) brightness(0.95)',
                transition: 'filter 0.3s ease',
              }}
              sizes="380px"
            />
          </motion.div>

          <motion.div
            animate={{
              z: isHovered ? 200 : 0,
              scale: isHovered ? 1.22 : 1.0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 15
            }}
            style={{
              x: textX,
              y: textY,
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-1.5 pointer-events-none"
          >
            {badge && (
              <motion.span 
                animate={{
                  y: isHovered ? -50 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 15
                }}
                className="text-[10px] tracking-widest text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm"
              >
                {badge}
              </motion.span>
            )}
            <motion.div 
              animate={{
                y: isHovered ? -50 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 15
              }}
              className="bg-white/85 backdrop-blur-md px-4 py-3 rounded-xl flex flex-col gap-1 w-[220px] text-center pointer-events-none"
            >
              <span className="text-[14px] font-black text-black whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {title}
              </span>
              <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {subtitle}
              </span>
            </motion.div>
          </motion.div>

          {/* Interactive Light Glare Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </div>
    </div>
  )
}
