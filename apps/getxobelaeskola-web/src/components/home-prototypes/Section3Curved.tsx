'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { GlowButton } from '@/components/ui/GlowButton'
import { useScrollLock } from '@/hooks/useScrollLock'

interface Section3CurvedProps {
  variant: 'home-1' | 'home-2' | 'home-3' | 'home-5' | 'home-6' | 'home-7' | 'home-8'
}

export function Section3Curved({ variant }: Section3CurvedProps) {
  const _t = useTranslations('s3_adapts_new')
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

  // Coordenadas base estimadas en porcentaje de la zona beige derecha (5 a 8)
  // Burbuja 5: cx 25%, cy 10%
  // Burbuja 6: cx 75%, cy 25%
  // Burbuja 7: cx 35%, cy 93%
  // Burbuja 8: cx 80%, cy 80%
  useEffect(() => {
    if (variant !== 'home-7' && variant !== 'home-8') return

    const basePositions = [
      { xPct: 0.18, yPct: 0.15, radius: 50 },
      { xPct: 0.75, yPct: 0.25, radius: 55 },
      { xPct: 0.35, yPct: 0.93, radius: 65 },
      { xPct: 0.80, yPct: 0.80, radius: 75 },
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

  // Scroll progress para la sección 3 completa
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Progreso de entrada de la sección (en home-5, home-6 y home-8 arranca de inmediato con el scroll para no perder golpes de desplazamiento)
  const enterProgress = useTransform(
    scrollYProgress,
    (variant === 'home-5' || variant === 'home-6' || variant === 'home-8') ? [0.0, 0.22] : [0.15, 0.45],
    [0, 1]
  )

  // Hook responsivo para detectar móvil y pantallas estrechas (<400px)
  const [isMobile, setIsMobile] = useState(false)
  const [isNarrowMobile, setIsNarrowMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsNarrowMobile(window.innerWidth < 400)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // En Desktop el ancho beige se expande con el scroll.
  const desktopBeigeWidth = useTransform(
    enterProgress,
    [0, 1],
    (variant === 'home-5' || variant === 'home-6' || variant === 'home-8') ? ['44%', '56%'] : ['28%', '56%']
  )
  const beigeWidth = isMobile ? '84%' : desktopBeigeWidth

  // En Móvil: TODA la pieza sólida beige (curva invertida ya anclada + rectángulo) se desplaza unida desde la derecha hacia la izquierda
  // S3 sale desde la derecha (de +100% a 0)
  const mobileSlideX = useTransform(enterProgress, [0, 1], ['100%', '0%'])

  // Opacidad del texto para que solo aparezca mágicamente cuando la zona beige ya ha llegado a su posición final
  const textOpacity = useTransform(enterProgress, [0.82, 1], [0, 1])
  const textTranslateY = useTransform(enterProgress, [0.82, 1], [15, 0])

  // Desplazamiento lateral para Home 1 (Slide-in desde la derecha) en Desktop
  const slideX = useTransform(enterProgress, [0, 1], [80, 0])
  const blurFilter = useTransform(enterProgress, [0, 1], ['blur(8px)', 'blur(0px)'])

  // Despliegue vertical para Home 2 (Unfold / scaleY)
  const unfoldScaleY = useTransform(enterProgress, [0, 1], [0.55, 1])
  const unfoldOpacity = useTransform(enterProgress, [0, 0.5], [0.4, 1])

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden bg-[#F6F2EC] text-[#0D2137] ${variant === 'home-5' || variant === 'home-6' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} -mt-[1px] flex flex-col justify-stretch items-stretch`}>
      {/* Inversión total de la composición: Vídeo Izquierda, Beige Derecha */}
      <div className={`relative w-full h-full flex-1 ${variant === 'home-5' || variant === 'home-6' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} flex flex-col lg:flex-row items-stretch`}>
        
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
              <source src="/videos/sea-video-s3.mp4" type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="relative lg:absolute lg:left-0 lg:top-0 lg:bottom-0 w-full lg:w-[75%] h-[48vh] lg:h-full z-0 overflow-hidden bg-[#0D2137]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover select-none pointer-events-none scale-105 filter brightness-[0.92] contrast-[1.05]"
            >
              <source src="/videos/sea-video-s3.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#0D2137]/10 to-[#0D2137]/35 pointer-events-none" />
          </div>
        )}

        {/* ===================== ZONA DERECHA: BEIGE + CURVA VERTICAL INVERTIDA ===================== */}
        <motion.div
          style={{
            ...(variant !== 'home-7' ? { width: beigeWidth } : {}),
            x: isMobile ? mobileSlideX : (variant === 'home-1' ? slideX : 0),
            ...(variant === 'home-1' ? { filter: blurFilter } : {}),
            ...(variant === 'home-2' ? { scaleY: unfoldScaleY, opacity: unfoldOpacity, transformOrigin: 'top center' } : {})
          }}
          className={`relative z-10 w-[84%] sm:w-[86%] lg:w-[56%] ml-auto h-full min-h-[85vh] lg:min-h-screen self-stretch flex items-stretch`}
        >
          {/* ===================== CURVA VERTICAL ORGÁNICA INVERTIDA ===================== */}
          {/* Anclada directamente al borde izquierdo del bloque beige: coincide exactamente en altura (top 0 a bottom 0) */}
          <div
            className={`absolute right-[calc(100%-2px)] top-0 bottom-0 z-20 pointer-events-none ${variant === 'home-6' ? 'w-[16vw] max-w-[280px]' : 'w-[14vw] sm:w-[12vw] lg:w-[9vw] max-w-[150px]'}`}
          >
            {(variant === 'home-5' || variant === 'home-1' || variant === 'home-2' || variant === 'home-3') && (
              /* Curva S náutica suave inversa */
              <svg
                className="h-full w-full fill-[#F6F2EC] scale-x-[-1]"
                viewBox="0 0 100 800"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L0,800 C30,730 80,630 35,460 C-5,310 75,150 0,0 Z" />
              </svg>
            )}

            {variant === 'home-6' && (
              /* Home-6: Formas MUCHO más locas invertidas con curvas orgánicas y gotas de agua */
              <svg
                className="h-full w-full fill-[#F6F2EC] scale-x-[-1] overflow-visible"
                viewBox="0 0 200 800"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L0,800 C60,780 140,750 150,710 C165,660 70,640 40,600 C-10,540 160,530 185,460 C210,380 90,360 45,310 C-15,250 170,220 160,150 C150,80 70,60 0,0 Z" />
                <circle cx="175" cy="270" r="14" fill="#F6F2EC" opacity="0.95" />
                <path d="M150,380 C175,370 190,400 175,420 C160,430 140,410 150,380 Z" fill="#F6F2EC" opacity="0.9" />
                <circle cx="160" cy="590" r="18" fill="#F6F2EC" opacity="0.92" />
                <path d="M135,660 C150,650 165,670 150,685 C135,695 125,675 135,660 Z" fill="#F6F2EC" opacity="0.85" />
              </svg>
            )}

            {(variant === 'home-7' || variant === 'home-8') && (
              /* Home-7 y Home-8: Curva sinuosa inversa */
              <svg
                className="h-full w-full fill-[#F6F2EC] scale-x-[-1]"
                viewBox="0 0 100 800"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L0,800 C40,710 80,560 15,390 C-10,240 60,110 0,0 Z" />
              </svg>
            )}
          </div>

          {/* Bloque beige con contenido y máscaras de burbujas */}
          <div
            className={`relative z-10 w-full h-full min-h-[85vh] lg:min-h-screen self-stretch flex flex-col ${variant === 'home-5' ? 'justify-start pt-6 sm:pt-8 lg:pt-10 pb-12 lg:pb-16' : 'justify-center py-16 sm:py-24 lg:py-28'} px-6 sm:px-12 md:px-16 lg:pl-24 lg:pr-16 overflow-hidden ${(variant === 'home-7' || variant === 'home-8') ? 'home-bubble-masked-zone' : 'bg-[#F6F2EC]'}`}
          >
            {/* Capa beige con máscara SVG para Home-7 y Home-8 que perfora las ventanas hacia el vídeo de fondo */}
            {(variant === 'home-7' || variant === 'home-8') && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                  <defs>
                    <mask id="s3-bubble-mask">
                      <rect x="0" y="0" width="100%" height="100%" fill="white" />
                      
                      {/* Burbuja 1: cx 22%, cy 10% (8% hacia abajo desde 2%) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[0].x}px, ${bubbleOffsets[0].y}px, 0)` }}>
                        {variant === 'home-8' ? (
                          <g className="svg-bubble-s3-1">
                            <motion.ellipse
                              cx="22%" cy="10%"
                              rx={isMobile ? "26" : "52"}
                              ry={isMobile ? "23" : "46"}
                              fill="black"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.65 }}
                              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                              style={{ transformOrigin: '22% 10%' }}
                            />
                          </g>
                        ) : (
                          <ellipse
                            cx="22%" cy="10%"
                            rx={isMobile ? "26" : "52"}
                            ry={isMobile ? "23" : "46"}
                            fill="black"
                            className="svg-bubble-s3-1"
                          />
                        )}
                      </g>

                      {/* Burbuja 2: cx 78%, cy 82% - Escalada proporcional en móvil */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[1].x}px, ${bubbleOffsets[1].y}px, 0)` }}>
                        {variant === 'home-8' ? (
                          <g className="svg-bubble-s3-2">
                            <motion.ellipse
                              cx="78%" cy="82%"
                              rx={isMobile ? "36" : "72"}
                              ry={isMobile ? "31" : "62"}
                              fill="black"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.65 }}
                              transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              style={{ transformOrigin: '78% 82%' }}
                            />
                          </g>
                        ) : (
                          <ellipse
                            cx="78%" cy="82%"
                            rx={isMobile ? "36" : "72"}
                            ry={isMobile ? "31" : "62"}
                            fill="black"
                            className="svg-bubble-s3-2"
                          />
                        )}
                      </g>

                      {/* Burbuja 3: cx 75%, cy 16% (13% abajo desde 3%) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[2].x}px, ${bubbleOffsets[2].y}px, 0)` }}>
                        {variant === 'home-8' ? (
                          <g className="svg-bubble-s3-3">
                            <motion.ellipse
                              cx="75%" cy="16%"
                              rx={isMobile ? "24" : "48"}
                              ry={isMobile ? "21" : "42"}
                              fill="black"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.65 }}
                              transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                              style={{ transformOrigin: '75% 16%' }}
                            />
                          </g>
                        ) : (
                          <ellipse
                            cx="75%" cy="16%"
                            rx={isMobile ? "24" : "48"}
                            ry={isMobile ? "21" : "42"}
                            fill="black"
                            className="svg-bubble-s3-3"
                          />
                        )}
                      </g>

                      {/* Burbuja 4: cx 20%, cy 93% (10% izquierda desde 30%, 15% abajo desde 78%) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[3].x}px, ${bubbleOffsets[3].y}px, 0)` }}>
                        {variant === 'home-8' ? (
                          <g className="svg-bubble-s3-4">
                            <motion.ellipse
                              cx="20%" cy="93%"
                              rx={isMobile ? "32" : "64"}
                              ry={isMobile ? "28" : "56"}
                              fill="black"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.65 }}
                              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              style={{ transformOrigin: '20% 93%' }}
                            />
                          </g>
                        ) : (
                          <ellipse
                            cx="20%" cy="93%"
                            rx={isMobile ? "32" : "64"}
                            ry={isMobile ? "28" : "56"}
                            fill="black"
                            className="svg-bubble-s3-4"
                          />
                        )}
                      </g>
                    </mask>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="#F6F2EC" mask="url(#s3-bubble-mask)" />
                </svg>
              </div>
            )}

            {/* ===================== CONTENIDO EDITORIAL DE LA SECCIÓN 3 ===================== */}
            {/* Zona invisible responsiva que encapsula todo el contenido con holgura inferior para sombras y halos */}
            <div className="relative z-20 w-full max-w-full flex flex-col justify-center overflow-x-hidden overflow-y-visible pb-8 sm:pb-10">
              <motion.div
                style={isMobile ? { opacity: textOpacity, y: textTranslateY } : {}}
                className="max-w-xl mx-auto lg:mx-0 w-full pb-4"
              >
                
                {/* Tag náutico superior */}
                <motion.div
                  initial={variant === 'home-7' ? {} : { opacity: 0, y: -15 }}
                  whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.3 }}
                  transition={{ duration: 0.6, delay: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.1 }}
                >
                  <span className="inline-flex items-center gap-2 text-[#9E7F41] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[10px] sm:text-xs font-mono font-semibold mb-4 sm:mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#9E7F41]" />
                    Experiencia & Adaptación
                  </span>
                </motion.div>

                {/* Título de la Sección 3 */}
                <motion.h2
                  initial={variant === 'home-7' ? {} : { opacity: 0, y: 30 }}
                  whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.3 }}
                  transition={{ duration: 0.7, delay: (variant === 'home-5' || variant === 'home-6') ? 0.1 : 0.18, type: 'spring', stiffness: 85, damping: 18 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-serif font-black tracking-tight text-[#0D2137] leading-[1.12] mb-5 sm:mb-6 break-words"
                >
                  Cursos y Navegación<br />
                  a tu Medida
                </motion.h2>

                {/* Separador artesanal náutico con ancla / símbolo náutico */}
                <motion.div
                  initial={variant === 'home-7' ? {} : { scaleX: 0, opacity: 0 }}
                  whileInView={variant === 'home-7' ? {} : { scaleX: 1, opacity: 1 }}
                  viewport={{ once: false, amount: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.3 }}
                  transition={{ duration: 0.65, delay: (variant === 'home-5' || variant === 'home-6') ? 0.12 : 0.28 }}
                  className="flex items-center gap-3 w-40 my-6 origin-left"
                >
                  <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#9E7F41] to-transparent" />
                  <span className="text-[#0D2137] text-xl font-bold">⚓</span>
                  <div className="h-[1.5px] flex-1 bg-gradient-to-l from-[#9E7F41] to-transparent" />
                </motion.div>

                {/* Texto de contenido exacto */}
                <div className="space-y-4 mb-8 text-left">
                  <motion.p
                    initial={variant === 'home-7' ? {} : { opacity: 0, x: 25 }}
                    whileInView={variant === 'home-7' ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.3 }}
                    transition={{ duration: 0.75, delay: (variant === 'home-5' || variant === 'home-6') ? 0.15 : 0.35 }}
                    className="text-lg sm:text-xl lg:text-2xl text-[#0D2137]/85 font-light leading-relaxed whitespace-pre-line border-l-2 border-[#9E7F41] pl-5 py-1"
                  >
                    {`Veleros pequeños o grandes,
días de calma o de acción,
aguas tranquilas o mar abierta.
Tú eliges cómo quieres navegar.`}
                  </motion.p>
                </div>

                {/* Botón "LEER MÁS" centrado en móvil y con respiro inferior completo para sombras y resplandor */}
                <motion.div
                  initial={variant === 'home-7' ? {} : { opacity: 0, y: 20 }}
                  whileInView={variant === 'home-7' ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: (variant === 'home-5' || variant === 'home-6') ? 0.05 : 0.3 }}
                  transition={{ duration: 0.6, delay: (variant === 'home-5' || variant === 'home-6') ? 0.2 : 0.55 }}
                  className="w-full flex justify-center lg:justify-start pt-2 pb-6"
                >
                  <GlowButton
                    onClick={() => setIsModalOpen(true)}
                    color="coral"
                    size="md"
                    className="!text-[#0D2137] !border-[#0D2137]/30 hover:!border-[#9E7F41] !bg-[#EFE7DC] hover:!bg-[#E6DECE] shadow-md hover:shadow-lg transition-all cursor-pointer mx-auto lg:mx-0"
                  >
                    LEER MÁS
                  </GlowButton>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ===================== MODAL "LEER MÁS" DE LA SECCIÓN 3 ===================== */}
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
                    Navegación a Tu Medida
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#FAF8F5', opacity: 0.85, lineHeight: 1.6 }}>
                    <p>
                      Creemos firmemente que no hay una única manera de vivir el mar. Para algunas personas, navegar es sinónimo de adrenalina, regatas y superación personal contra el viento y las olas.
                    </p>
                    <p>
                      Para otras, es la paz de fondear en una cala tranquila al atardecer, compartir una travesía en buena compañía o desconectar del ritmo acelerado de la vida diaria.
                    </p>
                    <p>
                      Por eso diseñamos programas flexibles y adaptados a tus objetivos y ritmos: cursos intensivos de fin de semana, prácticas continuadas a lo largo del año, salidas recreativas y entrenamientos de competición. Tú marcas el rumbo, nosotros ponemos el viento a tu favor.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ===================== ESTILOS PARA HOME-7 BURBUJAS INVERTIDAS ===================== */}
      <style jsx>{`
        /* Animación fluida de deriva orgánica continua en reposo (claramente perceptible) */
        .svg-bubble-s3-1 {
          animation: svgFloatS3_1 14s infinite ease-in-out;
          transform-origin: 18% 15%;
        }
        .svg-bubble-s3-2 {
          animation: svgFloatS3_2 16s infinite ease-in-out;
          transform-origin: 75% 25%;
        }
        .svg-bubble-s3-3 {
          animation: svgFloatS3_3 13s infinite ease-in-out;
          transform-origin: 35% 93%;
        }
        .svg-bubble-s3-4 {
          animation: svgFloatS3_4 15s infinite ease-in-out;
          transform-origin: 80% 80%;
        }

        /* Movimientos acuáticos visibles y elegantes en reposo (±18-24px) */
        @keyframes svgFloatS3_1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-18px, 20px) scale(1.04); }
          50% { transform: translate(20px, -18px) scale(0.96); }
          75% { transform: translate(16px, 14px) scale(1.03); }
        }

        @keyframes svgFloatS3_2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.03); }
          50% { transform: translate(-18px, 18px) scale(0.97); }
          75% { transform: translate(-20px, -14px) scale(1.04); }
        }

        @keyframes svgFloatS3_3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(18px, -20px) scale(1.04); }
          50% { transform: translate(-18px, 18px) scale(0.96); }
          75% { transform: translate(-15px, -14px) scale(1.02); }
        }

        @keyframes svgFloatS3_4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-20px, -18px) scale(1.03); }
          50% { transform: translate(20px, 18px) scale(0.97); }
          75% { transform: translate(-14px, 20px) scale(1.04); }
        }

        @media (prefers-reduced-motion: reduce) {
          .svg-bubble-s3-1, .svg-bubble-s3-2, .svg-bubble-s3-3, .svg-bubble-s3-4 {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
