// src/components/ui/PivotParallaxCard.tsx
'use client'

import { motion, useSpring } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface PivotParallaxCardProps {
  backgroundImage: string
  characterImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function PivotParallaxCard({
  backgroundImage,
  characterImage,
  title = 'Navega en Getxo',
  subtitle = 'Efecto de Fondo Pivotante',
  badge = 'PIVOT 45°'
}: PivotParallaxCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex items-center justify-center p-8">
      {/* 3D Perspective Container */}
      <div 
        style={{ perspective: '1200px' }} 
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[380px] h-[380px] rounded-2xl border border-slate-700/50 shadow-2xl transition-shadow duration-300 hover:shadow-cyan-500/10 hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)]"
        >
          {/* Background Image Layer - Pivots 30 degrees backwards from bottom edge */}
          <motion.div
            animate={{
              rotateX: isHovered ? 30 : 0,
              z: isHovered ? -30 : 0,
              scale: isHovered ? 1.12 : 1.0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 18
            }}
            style={{
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
              transformPerspective: 1200,
            }}
            className="absolute inset-0 w-full h-full select-none pointer-events-none rounded-2xl overflow-hidden"
          >
            <Image
              src={backgroundImage}
              alt="Card Background"
              fill
              priority
              className="object-cover"
              sizes="380px"
            />
            {/* Smooth brightness overlay simulating brightness(0.75) to brightness(0.9) */}
            <motion.div 
              animate={{
                opacity: isHovered ? 0.1 : 0.25
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black pointer-events-none"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
          </motion.div>

          {/* Character Image Layer - Stays vertical, translates forward (pops out) */}
          <div
            style={{
              transform: 'translateZ(10px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
          >
            <Image
              src={characterImage}
              alt="Character Cutout"
              fill
              priority
              className="object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
              style={{
                filter: isHovered 
                  ? 'brightness(1.08)' 
                  : 'brightness(0.95)',
                transition: 'filter 0.3s ease',
              }}
              sizes="380px"
            />
          </div>

          {/* Info Card Overlay - Pops out high in Z space */}
          <motion.div
            animate={{
              z: isHovered ? 90 : 15,
              y: isHovered ? -15 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 18
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

          {/* Frame Edge glow effect */}
          <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
