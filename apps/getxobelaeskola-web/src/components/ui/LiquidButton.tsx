// src/components/ui/LiquidButton.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, useEffect, useId } from 'react'

interface LiquidButtonProps {
  text?: string
  waterColor?: string
  waterColorDeep?: string
}

export function LiquidButton({ 
  text = 'Hover Me',
  waterColor = '#22d3ee',
  waterColorDeep = '#0e7490'
}: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const rawUid = useId().replace(/:/g, '')
  const gradBackId = `a-grad-back-${rawUid}`
  const gradFrontId = `a-grad-front-${rawUid}`

  // Dimensions
  const [btnWidth, setBtnWidth] = useState(240)
  const [btnHeight, setBtnHeight] = useState(60)

  useEffect(() => {
    const btn = buttonRef.current
    if (btn) {
      setBtnWidth(btn.offsetWidth)
      setBtnHeight(btn.offsetHeight)
    }
  }, [])

  // Motion values to track normalized mouse coordinates (0 to 1)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(1.0) // Defaults to bottom (empty)

  // Spring values with physical underdamping to create realistic sloshing inertia
  const springX = useSpring(mouseX, { stiffness: 130, damping: 5 })
  const springY = useSpring(mouseY, { stiffness: 90, damping: 8 })

  // Time value for constant wave animation
  const time = useMotionValue(0)
  useEffect(() => {
    let id: number
    const start = performance.now()
    const tick = () => {
      time.set((performance.now() - start) / 1000)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [time])

  // Sway / Tilt the liquid based on horizontal cursor position (inertia effect, tilts up to 18 deg)
  const liquidRotate = useTransform(springX, [0, 1], [-18, 18])

  // Generate Path for Wave 1 (Front Wave, Cyan)
  const wavePath1 = useTransform(
    [springX, springY, time],
    ([latestX, latestY, t]: any) => {
      const w = btnWidth + 300 // Extended width to act as a buffer on left/right edges
      const h = btnHeight + 60 // Widen bottom space to prevent gaps
      
      // Calculate average water Y position based on mouseY
      // Constrained to a minimum of 20px from the top so waves remain visible when full
      const baseWaterY = latestY * (btnHeight - 25) + 30
      
      const dipX = latestX * btnWidth + 150 // Offset cursor coordinate by the 150px left margin
      const dipWidth = 55
      const dipDepth = 10
      
      const getTilt = (xVal: number) => {
        const xPercent = (xVal - 150) / btnWidth
        const sCurve = Math.sin((xPercent - 0.5) * Math.PI) // Smooth S-curve transition
        return (latestX - 0.5) * 35 * sCurve // Dynamic tilt offset
      }

      const wave = (xVal: number) => {
        const dist = Math.abs(xVal - dipX)
        let dipOffset = 0
        if (dist < dipWidth) {
          const factor = 1 - (dist / dipWidth)
          dipOffset = factor * factor * dipDepth
        }
        
        // Base sine wave + dip offset + curved inertia tilt (slowed to t * 2.0)
        return Math.sin(t * 2.0 - (xVal - 150) * 0.045) * 5.5 + dipOffset + getTilt(xVal)
      }

      // Generate a highly detailed, 20-segment curve using Quadratic Bezier interpolation for organic flow
      const steps = 20
      const stepW = w / steps
      
      const coords: any[] = []
      for (let i = 0; i <= steps; i++) {
        const x = i * stepW
        coords.push({ x, y: baseWaterY + wave(x) })
      }
      
      let d = `M 0 ${h} L 0 ${coords[0].y.toFixed(2)}`
      for (let i = 0; i < coords.length - 1; i++) {
        const midX = (coords[i].x + coords[i + 1].x) / 2
        const midY = (coords[i].y + coords[i + 1].y) / 2
        d += ` Q ${coords[i].x.toFixed(2)} ${coords[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`
      }
      
      const last = coords[coords.length - 1]
      d += ` L ${w} ${last.y.toFixed(2)} L ${w} ${h} Z`
      
      return d
    }
  )

  // Generate Path for Wave 2 (Back Wave, Teal)
  const wavePath2 = useTransform(
    [springX, springY, time],
    ([latestX, latestY, t]: any) => {
      const w = btnWidth + 300
      const h = btnHeight + 60
      
      // Constrained to a minimum of 18px from the top for volume layering
      const baseWaterY = latestY * (btnHeight - 25) + 28
      
      const dipX = latestX * btnWidth + 150
      const dipWidth = 65
      const dipDepth = 8
      
      const getTilt = (xVal: number) => {
        const xPercent = (xVal - 150) / btnWidth
        const sCurve = Math.sin((xPercent - 0.5) * Math.PI)
        return (latestX - 0.5) * 30 * sCurve
      }

      const wave = (xVal: number) => {
        const dist = Math.abs(xVal - dipX)
        let dipOffset = 0
        if (dist < dipWidth) {
          const factor = 1 - (dist / dipWidth)
          dipOffset = factor * factor * dipDepth
        }
        
        // Slowed down to t * 1.4
        return Math.cos(t * 1.4 + (xVal - 150) * 0.035) * 4.5 + dipOffset + getTilt(xVal)
      }

      // Generate a highly detailed, 20-segment curve using Quadratic Bezier interpolation for organic flow
      const steps = 20
      const stepW = w / steps
      
      const coords: any[] = []
      for (let i = 0; i <= steps; i++) {
        const x = i * stepW
        coords.push({ x, y: baseWaterY + wave(x) })
      }
      
      let d = `M 0 ${h} L 0 ${coords[0].y.toFixed(2)}`
      for (let i = 0; i < coords.length - 1; i++) {
        const midX = (coords[i].x + coords[i + 1].x) / 2
        const midY = (coords[i].y + coords[i + 1].y) / 2
        d += ` Q ${coords[i].x.toFixed(2)} ${coords[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`
      }
      
      const last = coords[coords.length - 1]
      d += ` L ${w} ${last.y.toFixed(2)} L ${w} ${h} Z`
      
      return d
    }
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(1.0)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="liquid-btn group relative px-8 py-4 border-none text-[17px] font-black tracking-[1px] overflow-hidden cursor-pointer rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg select-none"
        style={{
          outline: 'none',
          backgroundColor: waterColorDeep, // Dynamic ocean base deep color
        }}
      >
        {/* Button Text in white matching Version B style */}
        <span className="relative z-20 block pointer-events-none transition-colors duration-500 font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
          {text}
        </span>

        {/* Liquid Wave Container - Now static, S-curve slosh tilt is computed mathematically in paths */}
        <motion.div
          className="absolute left-[-150px] right-[-150px] bottom-[-60px] h-[160px] pointer-events-none z-10"
        >
          {/* SVG Canvas covering the button area */}
          <svg className="absolute inset-0 w-full h-[calc(100%+60px)] top-0 left-0 pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradBackId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={waterColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id={gradFrontId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={waterColor} stopOpacity="0.95" />
                <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.75" />
              </linearGradient>
            </defs>
            {/* Wave 2 (Back Wave - Teal Gradient) */}
            <motion.path 
              d={wavePath2} 
              fill={`url(#${gradBackId})`} 
            />
            {/* Wave 1 (Front Wave - Bright Cyan Gradient) */}
            <motion.path 
              d={wavePath1} 
              fill={`url(#${gradFrontId})`} 
            />
          </svg>
        </motion.div>

        {/* Glossy overlay to look like a glass container */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-15" />
        <div className="absolute inset-0 border border-white/15 rounded-full pointer-events-none z-15" />
      </button>
    </div>
  )
}
