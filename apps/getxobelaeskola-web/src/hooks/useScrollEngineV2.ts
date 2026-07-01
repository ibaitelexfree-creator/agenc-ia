'use client'

import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'

type ScrollEngineReturn = {
  containerRef: React.RefObject<HTMLDivElement>
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export function useScrollEngineV2(): ScrollEngineReturn {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
    layoutEffect: false
  } as any)

  const scrollPoints = [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.88, 0.96, 1.0]
  const prowValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // always pointing forward/down
  const compassValues = [0, 0, 90, 90, 180, 180, 270, 270, 360, 360, 450, 450, 540, 540]

  // Canvas X stays at 0vw
  const canvasX = useTransform(scrollYProgress, (v) => '0vw')

  // Canvas Y translates vertically
  const yScrollPoints = [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.88, 0.96, 1.0]
  const rawCanvasY = useTransform(scrollYProgress, yScrollPoints, [0, 0, -100, -100, -200, -200, -300, -300, -400, -400, -500, -500, -600, -600])
  const canvasY = useTransform(rawCanvasY, (v) => {
    let pxShift = 0
    if (v > -100) {
      const t = -v / 100
      pxShift = t * 30
    } else if (v > -200) {
      const t = -(v + 100) / 100
      pxShift = 30 - t * 30
    } else if (v > -300) {
      pxShift = 0
    } else if (v > -400) {
      pxShift = 0
    } else if (v > -500) {
      pxShift = 0
    } else if (v >= -600) {
      const t = -(v + 500) / 100
      pxShift = t * 32
    } else {
      pxShift = 32
    }

    if (Math.abs(pxShift) < 0.01) return `${v}vh`
    return `calc(${v}vh + ${pxShift}px)`
  })

  const rawProw = useTransform(scrollYProgress, scrollPoints, prowValues)
  const prowRotation = useSpring(rawProw, { stiffness: 20, damping: 10, mass: 1 })

  const rawCompass = useTransform(scrollYProgress, scrollPoints, compassValues)
  const compassAngle = useSpring(rawCompass, { stiffness: 15, damping: 8 })

  const currentSection = useTransform(scrollYProgress, (progress: number): number => {
    if (progress < 0.12) return 0
    if (progress < 0.28) return 1
    if (progress < 0.44) return 2
    if (progress < 0.60) return 3
    if (progress < 0.76) return 4
    if (progress < 0.92) return 5
    return 6
  })

  const isAnimatingRef = useRef(false)
  const isWheelScrollingRef = useRef(false)
  const touchTriggeredRef = useRef(false)
  const animationRef = useRef<number | null>(null)
  const currentIndexRef = useRef(0)
  const wheelTimeoutRef = useRef<any>(null)

  useEffect(() => {
    const SECTION_PROGRESS = [0, 0.20, 0.36, 0.52, 0.68, 0.84, 1.0]

    const animateScroll = (targetY: number) => {
      // Restore overflow first in case there is a pending animation
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''

      // Temporarily disable overflow on html and body to kill any ongoing inertial momentum
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      const startY = window.scrollY
      const difference = targetY - startY
      const startTime = performance.now()
      const duration = 1800 // Slower, highly elegant transition

      const easeInOutSine = (t: number) => {
        return -(Math.cos(Math.PI * t) - 1) / 2
      }

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = easeInOutSine(progress)
        
        window.scrollTo(0, startY + difference * ease)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step)
        } else {
          isAnimatingRef.current = false
          // Restore overflow styles to re-enable scrolling
          document.documentElement.style.overflow = ''
          document.body.style.overflow = ''

          // Keep gesture locked for an extra 400ms to fully absorb trackpad inertia
          if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current)
          wheelTimeoutRef.current = window.setTimeout(() => {
            isWheelScrollingRef.current = false
          }, 400)
        }
      }

      isAnimatingRef.current = true
      isWheelScrollingRef.current = true
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = requestAnimationFrame(step)
    }

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      const scrollContainer = containerRef.current
      const maxScroll = scrollContainer 
        ? scrollContainer.offsetHeight - window.innerHeight 
        : document.documentElement.scrollHeight - window.innerHeight
      const currentScrollY = window.scrollY
      const direction = e.deltaY > 0 ? 1 : -1

      // If actively animating, ALWAYS block default to prevent native scroll conflict
      if (isAnimatingRef.current) {
        e.preventDefault()
        return
      }

      // Bypass snapping and allow conventional scrolling when in/towards footer area
      if (currentScrollY >= maxScroll - 5) {
        if (direction === 1) return // scroll down naturally
        if (currentScrollY > maxScroll + 5 && direction === -1) return // scroll up naturally
      }

      // Always block default scroll action
      e.preventDefault()

      const isNewGesture = !isWheelScrollingRef.current
      isWheelScrollingRef.current = true

      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current)
      wheelTimeoutRef.current = window.setTimeout(() => {
        isWheelScrollingRef.current = false
      }, 400) // Match lock to absorb inertia

      // If we are at the CTA section (index 6) and scrolling up, and we have crossed back
      // into the snap zone, force the transition to Section 6 (index 5) even if it's the same gesture
      const forceTransition = (currentIndexRef.current === 6 && direction === -1 && currentScrollY <= maxScroll - 2)

      // Only transition on the start of a new gesture, unless we are forcing it from the footer area
      if (!isNewGesture && !forceTransition) {
        return
      }

      // Ignore low delta values
      if (Math.abs(e.deltaY) < 10) return

      const targetIndex = Math.min(Math.max(currentIndexRef.current + direction, 0), SECTION_PROGRESS.length - 1)

      if (targetIndex !== currentIndexRef.current) {
        currentIndexRef.current = targetIndex
        const targetScrollY = SECTION_PROGRESS[targetIndex] * maxScroll
        animateScroll(targetScrollY)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchTriggeredRef.current = false
    }

    let touchStartY = 0
    const handleTouchMove = (e: TouchEvent) => {
      const scrollContainer = containerRef.current
      const maxScroll = scrollContainer 
        ? scrollContainer.offsetHeight - window.innerHeight 
        : document.documentElement.scrollHeight - window.innerHeight
      const currentScrollY = window.scrollY

      if (isAnimatingRef.current) {
        if (e.cancelable) e.preventDefault()
        return
      }

      const touchEndY = e.touches[0].clientY
      const deltaY = touchStartY - touchEndY // positive = dragging up/scrolling down

      // Bypass snapping for mobile footer scroll
      if (currentScrollY >= maxScroll - 5) {
        if (deltaY > 0) return // natural scroll down
        if (currentScrollY > maxScroll + 5 && deltaY < 0) return // natural scroll up
      }

      // Always prevent default vertical scrolling in snapping zone
      if (e.cancelable) e.preventDefault()

      if (touchTriggeredRef.current) return

      // Touch drag threshold
      if (Math.abs(deltaY) > 50) {
        touchTriggeredRef.current = true // lock touch actions until finger is lifted
        const direction = deltaY > 0 ? 1 : -1
        const targetIndex = Math.min(Math.max(currentIndexRef.current + direction, 0), SECTION_PROGRESS.length - 1)

        if (targetIndex !== currentIndexRef.current) {
          currentIndexRef.current = targetIndex
          const targetScrollY = SECTION_PROGRESS[targetIndex] * maxScroll
          animateScroll(targetScrollY)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
        const scrollContainer = containerRef.current
        const maxScroll = scrollContainer 
          ? scrollContainer.offsetHeight - window.innerHeight 
          : document.documentElement.scrollHeight - window.innerHeight
        const currentScrollY = window.scrollY

        const isDownKey = ['ArrowDown', 'PageDown', ' '].includes(e.key)

        // Bypass for footer key scrolling
        if (currentScrollY >= maxScroll - 5) {
          if (isDownKey) return
          if (currentScrollY > maxScroll + 5 && !isDownKey) return
        }

        e.preventDefault()

        if (isAnimatingRef.current) {
          return
        }

        const direction = isDownKey ? 1 : -1
        const targetIndex = Math.min(Math.max(currentIndexRef.current + direction, 0), SECTION_PROGRESS.length - 1)

        if (targetIndex !== currentIndexRef.current) {
          currentIndexRef.current = targetIndex
          const targetScrollY = SECTION_PROGRESS[targetIndex] * maxScroll
          animateScroll(targetScrollY)
        }
      }
    }

    const handleScrollSync = () => {
      if (isAnimatingRef.current) return

      const scrollContainer = containerRef.current
      const maxScroll = scrollContainer 
        ? scrollContainer.offsetHeight - window.innerHeight 
        : document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return

      const currentScrollY = window.scrollY
      const progress = currentScrollY / maxScroll

      let closestIndex = 0
      let minDiff = Infinity
      for (let i = 0; i < SECTION_PROGRESS.length; i++) {
        const diff = Math.abs(SECTION_PROGRESS[i] - progress)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = i
        }
      }
      currentIndexRef.current = closestIndex
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('scroll', handleScrollSync, { passive: true })


    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScrollSync)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current)
    }
  }, [])

  return {
    containerRef,
    canvasX,
    canvasY,
    prowRotation,
    compassAngle,
    scrollYProgress,
    currentSection,
  }
}
