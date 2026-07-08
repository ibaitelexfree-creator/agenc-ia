// src/components/ui/ParallaxHoverCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface ParallaxHoverCardProps {
  backgroundImage: string
  characterImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function ParallaxHoverCard({
  backgroundImage,
  characterImage,
  title = 'Getxo Bela Eskola',
  subtitle = 'Siente el viento, domina las olas',
  badge = 'EXPERIENCIA 3D'
}: ParallaxHoverCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tracking mouse position relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Create smooth springs for rotations and scales
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20
  })

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
          {/* Background Image Layer */}
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1.0,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
          >
            <Image
              src={backgroundImage}
              alt="Card Background"
              fill
              priority
              className="object-cover brightness-75 transition-all duration-300 group-hover:brightness-90"
              sizes="380px"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          </motion.div>

          {/* Character Image Layer - Pops out and stands upright */}
          <motion.div
            animate={{
              z: isHovered ? 80 : 0,
              scale: isHovered ? 1.12 : 0.98,
              rotateX: isHovered ? -8 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 15
            }}
            style={{
              transformStyle: 'preserve-3d',
              y: -13, // Shifted 13px up total
              x: 5, // Shifting the cutout 5px to the right
            }}
            className="absolute top-0 bottom-[-15px] left-0 right-0 w-full select-none pointer-events-none origin-bottom"
          >
            <Image
              src={characterImage}
              alt="Character Cutout"
              fill
              priority
              className="object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] filter"
              style={{
                // The drop-shadow makes the cutout pop in 3D against the background
                filter: isHovered 
                  ? 'drop-shadow(0 25px 20px rgba(0,0,0,0.85)) brightness(1.05)' 
                  : 'drop-shadow(0 10px 10px rgba(0,0,0,0.5)) brightness(0.95)',
                transition: 'filter 0.3s ease',
              }}
              sizes="380px"
            />
          </motion.div>

          {/* Info Card Overlay - Translated in Z space */}
          <motion.div
            animate={{
              z: isHovered ? 50 : 10,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-1 pointer-events-none"
          >
            {badge && (
              <span className="self-start text-[10px] tracking-widest text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded-full mb-1">
                {badge}
              </span>
            )}
            <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md">
              {title}
            </h3>
            <p className="text-sm text-slate-300 drop-shadow-md">
              {subtitle}
            </p>
          </motion.div>

          {/* Interactive Light Glare Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </div>
    </div>
  )
}
