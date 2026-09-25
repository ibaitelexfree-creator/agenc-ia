'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { GlowButton } from '@/components/ui/GlowButton'
import { useScrollLock } from '@/hooks/useScrollLock'

interface Section2CurvedProps {
  variant: 'home-1' | 'home-2' | 'home-3' | 'home-4' | 'home-5' | 'home-6' | 'home-7' | 'home-8'
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
    if (variant === 'home-1' || variant === 'home-2') return

    const basePositions = [
      { xPct: 0.20, yPct: 0.11, radius: 55 },
      { xPct: 0.79, yPct: 0.79, radius: 70 },
      { xPct: 0.35, yPct: 0.78, radius: 50 },
      { xPct: 0.74, yPct: 0.23, radius: 65 },
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

      // Si el cursor no está sobre la zona beige donde están las burbujas, no repeler
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        targetOffsets = [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ]
        return
      }

      const mouseX = clientX - rect.left
      const mouseY = clientY - rect.top

      const repelDist = 135 // Distancia de influencia de repulsión precisa

      targetOffsets = basePositions.map((bubble) => {
        const bubbleX = rect.width * bubble.xPct
        const bubbleY = rect.height * bubble.yPct
        const dx = bubbleX - mouseX
        const dy = bubbleY - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < repelDist && dist > 0) {
          // Fuerza de empuje suave y natural
          const force = (1 - dist / repelDist) * 60
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
  const desktopBeigeWidth = useTransform(enterProgress, [0, 1], ['28%', '56%'])
  const beigeWidth = isMobile ? '84%' : desktopBeigeWidth

  // En Móvil: TODA la pieza sólida beige (rectángulo + curva ya anclada) se desplaza unida desde fuera hacia la derecha
  // S2 sale de izquierda hacia derecha (de -100% a 0)
  const mobileSlideX = useTransform(enterProgress, [0, 1], ['-100%', '0%'])

  // Opacidad del texto para que sea siempre visible y fluido en móvil y desktop
  const textOpacity = useTransform(enterProgress, [0, 0.4], [0.9, 1])
  const textTranslateY = useTransform(enterProgress, [0, 0.4], [10, 0])

  // Desplazamiento lateral para Home 1 (Slide-in) en Desktop
  const slideX = useTransform(enterProgress, [0, 1], [-80, 0])
  const blurFilter = useTransform(enterProgress, [0, 1], ['blur(8px)', 'blur(0px)'])

  // Despliegue vertical para Home 2 (Unfold / scaleY)
  const unfoldScaleY = useTransform(enterProgress, [0, 1], [0.55, 1])
  const unfoldOpacity = useTransform(enterProgress, [0, 0.5], [0.4, 1])

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden bg-[#F6F2EC] text-[#0D2137] ${variant === 'home-5' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} -mt-[1px] flex flex-col justify-stretch items-stretch`}>
      {/* Estructura Desktop Split & Mobile Stacked */}
      <div className={`relative w-full h-full flex-1 ${variant === 'home-5' ? 'min-h-[75vh] lg:min-h-[88vh]' : 'min-h-[85vh] lg:min-h-screen'} flex flex-col lg:flex-row items-stretch`}>
        
        {/* ===================== VÍDEO DE FONDO ===================== */}
        {variant !== 'home-1' && variant !== 'home-2' ? (
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

        {/* ===================== ZONA IZQUIERDA: BEIGE + CURVA VERTICAL ===================== */}
        <motion.div
          style={{
            ...(variant !== 'home-7' ? { width: beigeWidth } : {}),
            x: isMobile ? mobileSlideX : (variant === 'home-1' ? slideX : 0),
            ...(variant === 'home-1' ? { filter: blurFilter } : {}),
            ...(variant === 'home-2' ? { scaleY: unfoldScaleY, opacity: unfoldOpacity, transformOrigin: 'top center' } : {})
          }}
          className={`relative z-10 w-[84%] sm:w-[86%] lg:w-[56%] h-full min-h-[85vh] lg:min-h-screen self-stretch flex items-stretch`}
        >
          {/* Bloque beige con contenido y máscaras de burbujas */}
          <div
            className={`relative z-10 w-full h-full min-h-[85vh] lg:min-h-screen self-stretch flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:pl-16 lg:pr-24 ${variant === 'home-5' ? 'py-12 sm:py-16 lg:py-20' : 'py-16 sm:py-24 lg:py-28'} overflow-hidden ${variant !== 'home-1' && variant !== 'home-2' ? 'home-bubble-masked-zone' : 'bg-[#F6F2EC]'}`}
          >
            {/* Capa beige con máscara SVG que perfora las ventanas hacia el vídeo de fondo */}
            {variant !== 'home-1' && variant !== 'home-2' && (
              <div
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  WebkitTransform: 'translate3d(0,0,0)',
                  transform: 'translateZ(0)'
                }}
              >
                <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                  <defs>
                    <mask id="s2-bubble-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                      <rect x="0" y="0" width="100%" height="100%" fill="white" />
                      
                      {/* Burbuja 1: cx 20%, cy 11% (1% abajo desde 10%) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[0].x}px, ${bubbleOffsets[0].y}px, 0)` }}>
                        <g className="svg-bubble-1">
                          <ellipse
                            cx="20%" cy="11%"
                            rx={isMobile ? "28" : "55"}
                            ry={isMobile ? "24" : "48"}
                            fill="black"
                            className="bubble-entrance-1"
                            style={{ transformOrigin: '20% 11%' }}
                          />
                        </g>
                      </g>

                      {/* Burbuja 2: cx 79% (4% derecha), cy 79% (6% arriba) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[1].x}px, ${bubbleOffsets[1].y}px, 0)` }}>
                        <g className="svg-bubble-2">
                          <ellipse
                            cx="79%" cy="79%"
                            rx={isMobile ? "35" : "70"}
                            ry={isMobile ? "30" : "60"}
                            fill="black"
                            className="bubble-entrance-2"
                            style={{ transformOrigin: '79% 79%' }}
                          />
                        </g>
                      </g>

                      {/* Burbuja 3: cx 35% (o 20% en <400px), cy 78% (7% más arriba desde 85%) */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[2].x}px, ${bubbleOffsets[2].y}px, 0)` }}>
                        <g className="svg-bubble-3">
                          <ellipse
                            cx={isNarrowMobile ? "20%" : "35%"}
                            cy="78%"
                            rx={isMobile ? "26" : "50"}
                            ry={isMobile ? "23" : "46"}
                            fill="black"
                            className="bubble-entrance-3"
                            style={{ transformOrigin: isNarrowMobile ? '20% 78%' : '35% 78%' }}
                          />
                        </g>
                      </g>

                      {/* Burbuja 4: cx 74% (81% en <400px, 2% a la derecha), cy 23% */}
                      <g style={{ transform: `translate3d(${bubbleOffsets[3].x}px, ${bubbleOffsets[3].y}px, 0)` }}>
                        <g className="svg-bubble-4">
                          <ellipse
                            cx={isNarrowMobile ? "81%" : "74%"}
                            cy="23%"
                            rx={isMobile ? "34" : "69"}
                            ry={isMobile ? "30" : "60"}
                            fill="black"
                            className="bubble-entrance-4"
                            style={{ transformOrigin: isNarrowMobile ? '81% 23%' : '74% 23%' }}
                          />
                        </g>
                      </g>
                    </mask>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="#F6F2EC" mask="url(#s2-bubble-mask)" />
                </svg>
              </div>
            )}

            {/* ===================== CONTENIDO EDITORIAL CON ANIMACIONES DIFERENCIADAS ===================== */}
            {/* Zona invisible responsiva que encapsula todo el contenido con suficiente holgura inferior para halos y sombras */}
            <div className="s2-curved-content relative z-20 w-full max-w-full flex flex-col justify-center overflow-x-hidden overflow-y-visible pb-8 sm:pb-10">
              <motion.div
                style={isMobile ? { opacity: textOpacity, y: textTranslateY } : {}}
                className="max-w-xl mx-auto lg:mx-0 w-full pb-4"
              >
                
                {/* Tag náutico superior */}
                <motion.div
                  initial={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 0, y: -15 }}
                  whileInView={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[#9E7F41] uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.35em] text-[9px] xs:text-[10px] sm:text-xs font-mono font-semibold mb-2 sm:mb-6">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9E7F41]" />
                    {_t('title_line1') ? `${_t('title_line1')} ${_t('title_line2')}` : 'Identidad & Comunidad'}
                  </span>
                </motion.div>

                {/* Título de sección h2 náutico */}
                <motion.div
                  initial={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 0, y: 25 }}
                  whileInView={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <h2 className="s2-curved-title text-lg xs:text-xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif tracking-tight text-[#0D2137] leading-[1.12] mb-3 sm:mb-6 break-words">
                    {_t('value1_prefix') ? _t('value1_prefix') : 'Más que una escuela, '}
                    <span className="italic font-light text-[#9E7F41]">{_t('value1_highlight') ? _t('value1_highlight') : 'una forma de vivir el mar.'}</span>
                  </h2>
                </motion.div>

              {/* Divisor dorado sutil */}
              <motion.div
                initial={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { scaleX: 0 }}
                whileInView={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { scaleX: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="s2-curved-divider w-16 sm:w-24 h-[1.5px] bg-[#9E7F41] mb-4 sm:mb-8 origin-left"
              />

              {/* Texto de contenido exacto */}
              <div className="s2-curved-text-container space-y-3 sm:space-y-4 mb-4 sm:mb-8 text-left">
                <motion.p
                  initial={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 0, x: -20 }}
                  whileInView={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="s2-curved-p text-xs xs:text-sm sm:text-xl lg:text-2xl text-[#0D2137]/85 font-light leading-snug sm:leading-relaxed whitespace-pre-line border-l-2 border-[#9E7F41] pl-3 sm:pl-5 py-0.5 sm:py-1"
                >
                  {_t('modal_p1') ? _t('modal_p1') : `No importa tu edad ni tu experiencia previa.
Navegar es aprender a escuchar el viento,
sentir el mar y disfrutar en equipo.`}
                </motion.p>
              </div>

              {/* Botón "LEER MÁS" idéntico a la identidad centrado en móvil y desktop con respiro inferior completo para sombras y resplandor */}
              <motion.div
                initial={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 0, y: 20 }}
                whileInView={(variant === 'home-3' || variant === 'home-4' || variant === 'home-5' || variant === 'home-7' || variant === 'home-8') ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="s2-curved-cta w-full flex justify-center pt-1 sm:pt-2 pb-3 sm:pb-6"
              >
                <GlowButton
                  onClick={() => setIsModalOpen(true)}
                  color="coral"
                  size="md"
                  className="!text-[#0D2137] !border-[#0D2137]/30 hover:!border-[#9E7F41] !bg-[#EFE7DC] hover:!bg-[#E6DECE] shadow-md hover:shadow-lg transition-all cursor-pointer mx-auto !py-1.5 !px-4 sm:!py-2 sm:!px-6 text-xs sm:text-base"
                >
                  LEER MÁS
                </GlowButton>
              </motion.div>
            </motion.div>
          </div>
        </div>

          {/* ===================== CURVA VERTICAL ORGÁNICA ===================== */}
          {/* Anclada directamente al borde derecho del bloque beige: coincide exactamente en altura (top 0 a bottom 0) */}
          <div
            className={`absolute left-[calc(100%-2px)] top-0 bottom-0 z-20 pointer-events-none ${variant === 'home-6' ? 'w-[16vw] max-w-[280px]' : 'w-[14vw] sm:w-[12vw] lg:w-[9vw] max-w-[150px]'}`}
          >
            {(variant === 'home-5' || variant === 'home-1' || variant === 'home-2' || variant === 'home-3' || variant === 'home-4' || variant === 'home-6' || variant === 'home-7' || variant === 'home-8') && (
              /* Curva S náutica suave, elegante y minimalista */
              <svg
                className="h-full w-full fill-[#F6F2EC]"
                viewBox="0 0 100 800"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L0,800 C30,730 80,630 35,460 C-5,310 75,150 0,0 Z" />
              </svg>
            )}
          </div>
        </motion.div>

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
        .bubble-entrance-1 {
          animation: bubbleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards;
        }
        .bubble-entrance-2 {
          animation: bubbleIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.28s backwards;
        }
        .bubble-entrance-3 {
          animation: bubbleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.38s backwards;
        }
        .bubble-entrance-4 {
          animation: bubbleIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.22s backwards;
        }

        @keyframes bubbleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .svg-bubble-1 {
          animation: svgFloat1 13s infinite ease-in-out;
          transform-origin: 20% 11%;
        }
        .svg-bubble-2 {
          animation: svgFloat2 15s infinite ease-in-out;
          transform-origin: 79% 79%;
        }
        .svg-bubble-3 {
          animation: svgFloat3 12s infinite ease-in-out;
          transform-origin: 35% 78%;
        }
        .svg-bubble-4 {
          animation: svgFloat4 14s infinite ease-in-out;
          transform-origin: 74% 23%;
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
