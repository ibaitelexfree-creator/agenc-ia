'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { GlowButton } from '@/components/ui/GlowButton'
import { useScrollLock } from '@/hooks/useScrollLock'

interface Section2CurvedProps {
  variant: 'home-1' | 'home-2' | 'home-3' | 'home-5' | 'home-6' | 'home-7' | 'home-8'
}

export function Section2Curved({ variant }: Section2CurvedProps) {
  const _t = useTranslations('s2_identity')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useScrollLock(modalRef, isModalOpen)

  // Auto-close modal when scrolling outer page
  useEffect(() => {
    if (!isModalOpen) return
    const initialScrollY = window.scrollY
    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 15) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isModalOpen])

  const sectionRef = useRef<HTMLElement>(null)
  // Repulsión física interactiva de cada burbuja
  const [bubbleOffsets, setBubbleOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ])

  // Coordenadas base estimadas en porcentaje de la zona beige
  // Burbuja 1: cx 20%, cy 10%
  // Burbuja 2: cx 90%, cy 65%
  // Burbuja 3: cx 55%, cy 80%
  // Burbuja 4: cx 72%, cy 23%
  useEffect(() => {
    if (variant !== 'home-7' && variant !== 'home-8') return

    const basePositions = [
      { xPct: 0.20, yPct: 0.10, radius: 60 },
      { xPct: 0.80, yPct: 0.75, radius: 75 },
      { xPct: 0.45, yPct: 0.80, radius: 55 },
      { xPct: 0.72, yPct: 0.23, radius: 75 },
    ]

    let animFrame: number
    let targetOffsets = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
    let currentOffsets = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]

    const handlePointerMove = (clientX: number, clientY: number) => {
      const section = sectionRef.current
      if (!section) return

      const beigeZone = section.querySelector('.home-bubble-masked-zone') as HTMLElement
      if (!beigeZone) return

      const rect = beigeZone.getBoundingClientRect()
      const mouseX = clientX - rect.left
      const mouseY = clientY - rect.top

      const repelDist = 200 // Distancia de influencia de repulsión

      targetOffsets = basePositions.map((bubble) => {
        const bubbleX = rect.width * bubble.xPct
        const bubbleY = rect.height * bubble.yPct
        const dx = bubbleX - mouseX
        const dy = bubbleY - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < repelDist && dist > 0) {
          // Fuerza de empuje proporcional a la cercanía (máximo ~75px)
          const force = (1 - dist / repelDist) * 75
          const angle = Math.atan2(dy, dx)
          return {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
          }
        }
        return { x: 0, y: 0 }
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const onPointerLeave = () => {
      targetOffsets = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]
    }

    const velocities = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
    const smoothedTargets = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]

    // Bucle de física con resorte amortiguado y fluido viscoso (repulsión gradual y suave)
    const updatePhysics = () => {
      let changed = false
      const stiffness = 0.038 // Muelle más suave y gradual
      const damping = 0.88   // Mayor viscosidad / amortiguación para un movimiento suave sin brusquedad

      const newOffsets = currentOffsets.map((curr, i) => {
        const rawTarget = targetOffsets[i]
        const smoothTarget = smoothedTargets[i]
        const vel = velocities[i]

        // Suavizar la entrada del objetivo para que la aceleración sea lenta y progresiva
        smoothTarget.x += (rawTarget.x - smoothTarget.x) * 0.08
        smoothTarget.y += (rawTarget.y - smoothTarget.y) * 0.08

        // Fuerza del resorte F = -k * (x - smoothTarget)
        const fx = (smoothTarget.x - curr.x) * stiffness
        const fy = (smoothTarget.y - curr.y) * stiffness

        // Actualizar velocidad con amortiguación
        vel.x = (vel.x + fx) * damping
        vel.y = (vel.y + fy) * damping

        const nextX = curr.x + vel.x
        const nextY = curr.y + vel.y

        if (Math.abs(vel.x) > 0.01 || Math.abs(vel.y) > 0.01 || Math.abs(rawTarget.x - curr.x) > 0.05 || Math.abs(rawTarget.y - curr.y) > 0.05) {
          changed = true
        }

        return { x: nextX, y: nextY }
      })

      if (changed) {
        currentOffsets = newOffsets
        setBubbleOffsets([...newOffsets])
      }
      animFrame = requestAnimationFrame(updatePhysics)
    }

    const sectionEl = sectionRef.current
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', onMouseMove, { passive: true })
      sectionEl.addEventListener('touchmove', onTouchMove, { passive: true })
      sectionEl.addEventListener('mouseleave', onPointerLeave)
      sectionEl.addEventListener('touchend', onPointerLeave)
    }

    animFrame = requestAnimationFrame(updatePhysics)

    return () => {
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', onMouseMove)
        sectionEl.removeEventListener('touchmove', onTouchMove)
        sectionEl.removeEventListener('mouseleave', onPointerLeave)
        sectionEl.removeEventListener('touchend', onPointerLeave)
      }
      cancelAnimationFrame(animFrame)
    }
  }, [variant])

  // Scroll progress para la sección completa
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Progreso de entrada de la sección (0 cuando empieza a asomarse por abajo, 1 cuando está centrada)
  const enterProgress = useTransform(scrollYProgress, [0.15, 0.45], [0, 1])

  // Expansión horizontal del ancho beige en Desktop para home-1..6 (28% -> 56%)
  const beigeWidth = useTransform(enterProgress, [0, 1], ['28%', '56%'])
  // Desplazamiento de la curva separadora pegada al borde derecho del beige
  const separatorLeft = useTransform(enterProgress, [0, 1], ['27.8%', '55.8%'])

  // Desplazamiento lateral para Home 1 (Slide-in)
  const slideX = useTransform(enterProgress, [0, 1], [-80, 0])
  const blurFilter = useTransform(enterProgress, [0, 1], ['blur(8px)', 'blur(0px)'])

  // Despliegue vertical para Home 2 (Unfold / scaleY)
  const unfoldScaleY = useTransform(enterProgress, [0, 1], [0.55, 1])
  const unfoldOpacity = useTransform(enterProgress, [0, 0.5], [0.4, 1])

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden bg-[#F6F2EC] text-[#0D2137] ${variant === 'home-5' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} flex flex-col justify-center`}>
      {/* Estructura Desktop Split & Mobile Stacked */}
      <div className={`relative w-full ${variant === 'home-5' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} flex flex-col lg:flex-row items-stretch`}>
        
        {/* ===================== VÍDEO DE FONDO ===================== */}
        {variant === 'home-7' || variant === 'home-8' ? (
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#0D2137]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover select-none pointer-events-none scale-105 filter brightness-[0.92] contrast-[1.05]"
            >
              <source src="/videos/sea-video-s2.mp4" type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[75%] h-[48vh] lg:h-full z-0 overflow-hidden bg-[#0D2137]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover select-none pointer-events-none scale-105 filter brightness-[0.92] contrast-[1.05]"
            >
              <source src="/videos/sea-video-s2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#0D2137]/10 to-[#0D2137]/35 pointer-events-none" />
          </div>
        )}

        {/* ===================== ZONA IZQUIERDA: BEIGE DINÁMICO / EDITORIAL ===================== */}
        <motion.div
          style={{
            ...(variant !== 'home-7' ? { width: beigeWidth } : {}),
            ...(variant === 'home-1' ? { x: slideX, filter: blurFilter } : {}),
            ...(variant === 'home-2' ? { scaleY: unfoldScaleY, opacity: unfoldOpacity, transformOrigin: 'top center' } : {})
          }}
          className={`relative z-10 w-full lg:w-[56%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:pl-16 lg:pr-24 ${variant === 'home-5' ? 'py-12 sm:py-16 lg:py-20' : 'py-16 sm:py-24 lg:py-28'} overflow-hidden ${(variant === 'home-7' || variant === 'home-8') ? 'home-bubble-masked-zone' : 'bg-[#F6F2EC]'}`}
        >
          {/* Capa beige con máscara SVG para Home-7 y Home-8 que perfora las ventanas hacia el vídeo de fondo */}
          {(variant === 'home-7' || variant === 'home-8') && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                <defs>
                  <mask id="s2-bubble-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    
                    {/* Burbuja 1: cx 20%, cy 10% */}
                    <g style={{ transform: `translate3d(${bubbleOffsets[0].x}px, ${bubbleOffsets[0].y}px, 0)` }}>
                      {variant === 'home-8' ? (
                        <g className="svg-bubble-1">
                          <motion.ellipse
                            cx="20%" cy="10%" rx="55" ry="48" fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.65 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: '20% 10%' }}
                          />
                        </g>
                      ) : (
                        <ellipse cx="20%" cy="10%" rx="55" ry="48" fill="black" className="svg-bubble-1" />
                      )}
                    </g>

                    {/* Burbuja 2: cx 80%, cy 75% */}
                    <g style={{ transform: `translate3d(${bubbleOffsets[1].x}px, ${bubbleOffsets[1].y}px, 0)` }}>
                      {variant === 'home-8' ? (
                        <g className="svg-bubble-2">
                          <motion.ellipse
                            cx="80%" cy="75%" rx="70" ry="60" fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.65 }}
                            transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: '80% 75%' }}
                          />
                        </g>
                      ) : (
                        <ellipse cx="80%" cy="75%" rx="70" ry="60" fill="black" className="svg-bubble-2" />
                      )}
                    </g>

                    {/* Burbuja 3: cx 45%, cy 80% */}
                    <g style={{ transform: `translate3d(${bubbleOffsets[2].x}px, ${bubbleOffsets[2].y}px, 0)` }}>
                      {variant === 'home-8' ? (
                        <g className="svg-bubble-3">
                          <motion.ellipse
                            cx="45%" cy="80%" rx="50" ry="46" fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.65 }}
                            transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: '45% 80%' }}
                          />
                        </g>
                      ) : (
                        <ellipse cx="45%" cy="80%" rx="50" ry="46" fill="black" className="svg-bubble-3" />
                      )}
                    </g>

                    {/* Burbuja 4: cx 72%, cy 23% */}
                    <g style={{ transform: `translate3d(${bubbleOffsets[3].x}px, ${bubbleOffsets[3].y}px, 0)` }}>
                      {variant === 'home-8' ? (
                        <g className="svg-bubble-4">
                          <motion.ellipse
                            cx="72%" cy="23%" rx="69" ry="60" fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.65 }}
                            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: '72% 23%' }}
                          />
                        </g>
                      ) : (
                        <ellipse cx="72%" cy="23%" rx="69" ry="60" fill="black" className="svg-bubble-4" />
                      )}
                    </g>
                  </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="#F6F2EC" mask="url(#s2-bubble-mask)" />
              </svg>
            </div>
          )}

          {/* ===================== CONTENIDO EDITORIAL CON ANIMACIONES DIFERENCIADAS ===================== */}
          <div className="max-w-xl mx-auto lg:mx-0 relative z-20 w-full">
            
            {/* Tag náutico superior */}
            <motion.div
              initial={variant === 'home-7' ? {} : { opacity: 0, y: -15 }}
              whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 text-[#9E7F41] uppercase tracking-[0.35em] text-xs font-mono font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[#9E7F41]" />
                Identidad & Comunidad
              </span>
            </motion.div>

            {/* Título de la Sección 2 según variante de animación */}
            {variant === 'home-3' ? (
              /* Home 3: Split words stagger náutico */
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 }
                  }
                }}
                className="text-3xl sm:text-5xl lg:text-[3.6rem] font-serif font-black tracking-tight text-[#0D2137] leading-[1.08] mb-6 flex flex-wrap gap-x-3 gap-y-1"
              >
                {['¿Qué', 'es', 'Getxo', 'Bela', 'Eskola?'].map((word, wIdx) => (
                  <motion.span
                    key={wIdx}
                    variants={{
                      hidden: { opacity: 0, y: 25, rotate: -2 },
                      visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6 } }
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>
            ) : (
              /* Home 6, 5, 1, 2 y 7: Cascada stagger fluida / muelle */
              <motion.h2
                initial={variant === 'home-7' ? {} : { opacity: 0, y: 30 }}
                whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.18, type: 'spring', stiffness: 85, damping: 18 }}
                className="text-3xl sm:text-5xl lg:text-[3.6rem] font-serif font-black tracking-tight text-[#0D2137] leading-[1.08] mb-6"
              >
                ¿Qué es<br />
                Getxo Bela Eskola?
              </motion.h2>
            )}

            {/* Separador artesanal náutico con estrella */}
            <motion.div
              initial={variant === 'home-7' ? {} : { scaleX: 0, opacity: 0 }}
              whileInView={variant === 'home-7' ? {} : { scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="flex items-center gap-3 w-40 my-6 origin-left"
            >
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#9E7F41] to-transparent" />
              <span className="text-[#E63900] text-xl font-bold">✦</span>
              <div className="h-[1.5px] flex-1 bg-gradient-to-l from-[#9E7F41] to-transparent" />
            </motion.div>

            {/* Frases editoriales con jerarquía fiel */}
            <div className="space-y-6 mb-10 text-left">
              <motion.p
                initial={variant === 'home-7' ? {} : { opacity: 0, x: -25 }}
                whileInView={variant === 'home-7' ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.75, delay: 0.35 }}
                className="text-xl sm:text-2xl lg:text-[1.7rem] font-light text-[#0D2137]/90 leading-snug border-l-2 border-[#9E7F41] pl-5 py-1"
              >
                No somos una escuela convencional, sino una comunidad cercana y con valores.
              </motion.p>
              <motion.p
                initial={variant === 'home-7' ? {} : { opacity: 0, x: -20 }}
                whileInView={variant === 'home-7' ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.75, delay: 0.45 }}
                className="text-base sm:text-lg lg:text-xl font-normal text-[#0D2137]/75 leading-relaxed pl-5"
              >
                Un lugar donde aprender a navegar, compartir y disfrutar de la mar.
              </motion.p>
            </div>

            {/* Botón "LEER MÁS" idéntico a la identidad */}
            <motion.div
              initial={variant === 'home-7' ? {} : { opacity: 0, y: 20 }}
              whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <GlowButton
                onClick={() => setIsModalOpen(true)}
                color="coral"
                size="md"
                className="!text-[#0D2137] !border-[#0D2137]/30 hover:!border-[#9E7F41] !bg-[#EFE7DC] hover:!bg-[#E6DECE] shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                LEER MÁS
              </GlowButton>
            </motion.div>
          </div>
        </motion.div>

        {/* ===================== SEPARADORES ORGÁNICOS SEGÚN VARIANTE ===================== */}
        {/* Desktop Separators (Vertical Wave / Curve) que acompaña la apertura de la zona beige */}
        <motion.div
          style={variant !== 'home-7' ? { left: separatorLeft } : {}}
          className={`hidden lg:block absolute left-[55.8%] top-0 bottom-0 z-20 pointer-events-none ${variant === 'home-6' ? 'w-[16vw] max-w-[280px]' : 'w-[9vw] max-w-[150px]'}`}
        >
          {(variant === 'home-5' || variant === 'home-1' || variant === 'home-2' || variant === 'home-3') && (
            /* Curva S náutica suave, elegante y minimalista */
            <svg
              className="h-full w-full fill-[#F6F2EC]"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L0,800 C30,730 80,630 35,460 C-5,310 75,150 0,0 Z" />
            </svg>
          )}

          {variant === 'home-6' && (
            /* Home-6: Formas MUCHO más locas, orgánicas, con curvas entrantes y salientes como gotas de agua */
            <svg
              className="h-full w-full fill-[#F6F2EC] overflow-visible"
              viewBox="0 0 200 800"
              preserveAspectRatio="none"
            >
              {/* Frontera líquida sinuosa de gran penetración */}
              <path d="M0,0 L0,800 C60,780 140,750 150,710 C165,660 70,640 40,600 C-10,540 160,530 185,460 C210,380 90,360 45,310 C-15,250 170,220 160,150 C150,80 70,60 0,0 Z" />
              {/* Gotas líquidas y protuberancias orgánicas desprendidas */}
              <circle cx="175" cy="270" r="14" fill="#F6F2EC" opacity="0.95" />
              <path d="M150,380 C175,370 190,400 175,420 C160,430 140,410 150,380 Z" fill="#F6F2EC" opacity="0.9" />
              <circle cx="160" cy="590" r="18" fill="#F6F2EC" opacity="0.92" />
              <path d="M135,660 C150,650 165,670 150,685 C135,695 125,675 135,660 Z" fill="#F6F2EC" opacity="0.85" />
            </svg>
          )}

          {(variant === 'home-7' || variant === 'home-8') && (
            /* Home-7 y Home-8: Curva sinuosa fluida con orillas orgánicas */
            <svg
              className="h-full w-full fill-[#F6F2EC]"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L0,800 C40,710 80,560 15,390 C-10,240 60,110 0,0 Z" />
            </svg>
          )}
        </motion.div>

        {/* Mobile Separators (Horizontal Wave / Curve between Beige & Video) */}
        <div className="block lg:hidden w-full h-[65px] relative -mt-[1px] z-20 pointer-events-none bg-[#F6F2EC]">
          <svg
            className="w-full h-full fill-[#0D2137]"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            {(variant === 'home-5' || variant === 'home-1' || variant === 'home-2' || variant === 'home-3') && (
              <path d="M0,100 L1000,100 L1000,40 C700,95 350,10 0,60 Z" />
            )}
            {variant === 'home-6' && (
              /* Versión móvil loca con protuberancias de gota */
              <path d="M0,100 L1000,100 L1000,20 C880,95 820,10 720,80 C600,130 520,-20 400,70 C300,120 200,-10 100,75 C50,100 0,30 0,30 Z" />
            )}
            {(variant === 'home-7' || variant === 'home-8') && (
              <path d="M0,100 L1000,100 L1000,30 C750,90 400,20 0,70 Z" />
            )}
          </svg>
        </div>

      </div>

      {/* ===================== MODAL "LEER MÁS" DE LA SECCIÓN 2 ===================== */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 27, 58, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '1rem',
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  backgroundColor: '#0D2137',
                  border: '1px solid rgba(158, 127, 65, 0.4)',
                  borderRadius: '1rem',
                  maxWidth: '42rem',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Cabecera del modal */}
                <div style={{ position: 'sticky', top: 0, backgroundColor: '#0D2137', padding: '1.5rem', borderBottom: '1px solid rgba(158, 127, 65, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#9E7F41' }} />
                    <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#9E7F41', letterSpacing: '0.05em' }}>GETXO BELA ESKOLA</span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#FAF8F5', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido del modal */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'serif', fontWeight: 'bold', color: '#FAF8F5', lineHeight: 1.2 }}>
                    Nuestra Filosofía y Valores
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#FAF8F5', opacity: 0.85, lineHeight: 1.6 }}>
                    <p>
                      En Getxo Bela Eskola entendemos el mar como una escuela de vida. No buscamos únicamente formar patrones o regatistas, sino transmitir la pasión por el mar, el respeto por el medio ambiente y los valores de la navegación tradicional.
                    </p>
                    <p>
                      Nuestra metodología combina la técnica rigurosa con un ambiente cercano y familiar. Creemos que la mejor manera de aprender es a través de la experiencia directa, la práctica constante y el compañerismo a bordo.
                    </p>
                    <p>
                      Tanto si nunca has subido a un barco como si buscas perfeccionar tus habilidades o competir al más alto nivel, en nuestra escuela encontrarás un equipo apasionado dispuesto a acompañarte en cada milla náutica.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ===================== ESTILOS ESPECÍFICOS PARA HOME-7 BURBUJAS ===================== */}
      <style jsx>{`
        /* Animación fluida de deriva orgánica continua en reposo (claramente perceptible) */
        .svg-bubble-1 {
          animation: svgFloat1 13s infinite ease-in-out;
          transform-origin: 20% 10%;
        }
        .svg-bubble-2 {
          animation: svgFloat2 15s infinite ease-in-out;
          transform-origin: 80% 75%;
        }
        .svg-bubble-3 {
          animation: svgFloat3 12s infinite ease-in-out;
          transform-origin: 45% 80%;
        }
        .svg-bubble-4 {
          animation: svgFloat4 14s infinite ease-in-out;
          transform-origin: 72% 23%;
        }

        /* Movimientos acuáticos visibles y elegantes en reposo (±18-24px) */
        @keyframes svgFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(18px, -20px) scale(1.04); }
          50% { transform: translate(-14px, 18px) scale(0.96); }
          75% { transform: translate(-20px, -12px) scale(1.02); }
        }

        @keyframes svgFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-20px, 18px) scale(1.03); }
          50% { transform: translate(18px, -22px) scale(0.97); }
          75% { transform: translate(22px, 14px) scale(1.04); }
        }

        @keyframes svgFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(16px, 20px) scale(1.04); }
          50% { transform: translate(-18px, -16px) scale(0.96); }
          75% { transform: translate(18px, -15px) scale(1.03); }
        }

        @keyframes svgFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-18px, -18px) scale(1.04); }
          50% { transform: translate(20px, 16px) scale(0.97); }
          75% { transform: translate(-14px, 20px) scale(1.03); }
        }

        @media (prefers-reduced-motion: reduce) {
          .svg-bubble-1, .svg-bubble-2, .svg-bubble-3, .svg-bubble-4 {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
