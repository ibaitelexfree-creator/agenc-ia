// src/components/ui/PortholeParallaxCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

interface PortholeParallaxCardProps {
  backgroundImage: string
  characterImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function PortholeParallaxCard({
  backgroundImage,
  characterImage,
  title = 'Puerto de Getxo',
  subtitle = 'Visto desde el Ojo de Buey',
  badge = 'OJO DE BUEY'
}: PortholeParallaxCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Track coordinates for wave sway rocking (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for card rotation (kept flat or very minor dynamic shift if needed, currently static frame)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20
  })

  // Multi-layer parallax translations (independent layer shifts)
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 25 })
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 25 })

  const charX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 20 })
  const charY = useSpring(useTransform(y, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 20 })

  // Constant rocking simulation: gentle sway of a boat on waves
  useEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()
    
    const updateMotion = () => {
      const time = (performance.now() - startTime) / 1000 // seconds
      
      // Roll: Side-to-side rocking (X axis) using slow sine wave
      const roll = Math.sin(time * 0.6) * 0.45
      // Pitch: Up-and-down rocking (Y axis) using cosine wave with different frequency
      const pitch = Math.cos(time * 0.45) * 0.35
      
      x.set(roll)
      y.set(pitch)
      
      animationFrameId = requestAnimationFrame(updateMotion)
    }
    
    animationFrameId = requestAnimationFrame(updateMotion)
    return () => cancelAnimationFrame(animationFrameId)
  }, [x, y])

  // Hover state transitions for zoom
  const bgScale = useSpring(isHovered ? 1.12 : 1.05, { stiffness: 150, damping: 20 })
  const charScale = useSpring(isHovered ? 1.05 : 0.95, { stiffness: 120, damping: 15 })

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[720px] h-[720px] bg-transparent select-none"
        >
          {/* Circular Clipping Container for inner 3D elements */}
          <div className="absolute inset-[26%] rounded-full overflow-hidden mask-circular">
            {/* Layer 1: Background Image */}
            <motion.div
              animate={{
                filter: isHovered ? 'brightness(0.95)' : 'brightness(0.75)',
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
              className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)]"
            >
              <Image
                src={backgroundImage}
                alt="Sea View"
                fill
                priority
                className="object-cover"
                sizes="720px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 opacity-90" />
            </motion.div>

            {/* Layer 2: Character Cutout */}
            <motion.div
              animate={{
                z: isHovered ? 60 : 0,
                rotateX: isHovered ? -5 : 0,
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
              className="absolute top-[-20px] bottom-[-15px] left-0 right-0 w-full select-none pointer-events-none origin-bottom"
            >
              <Image
                src={characterImage}
                alt="Character Cutout"
                fill
                priority
                className="object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] filter"
                style={{
                  filter: isHovered 
                    ? 'drop-shadow(0 20px 15px rgba(0,0,0,0.8)) brightness(1.05)' 
                    : 'drop-shadow(0 8px 8px rgba(0,0,0,0.5)) brightness(0.95)',
                  transition: 'filter 0.3s ease',
                  y: -28,
                } as any}
                sizes="420px"
              />
            </motion.div>
          </div>

          {/* Transparent Porthole Window Frame Image Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden">
            <Image
              src="/images/home/paralax-2/ventana_marco.png?v=6"
              alt="Porthole Window Frame"
              fill
              priority
              className="object-cover scale-[1.01]"
              sizes="720px"
            />
          </div>



          {/* High-end circular glare reflections (Simulating thick glass window) */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none z-10" />
        </motion.div>
      </div>
    </div>
  )
}
