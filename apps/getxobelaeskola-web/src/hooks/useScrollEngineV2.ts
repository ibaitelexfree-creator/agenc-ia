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
  const prowValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const compassValues = [0, 0, 90, 90, 180, 180, 270, 270, 360, 360, 450, 450, 540, 540]

  const canvasX = useTransform(scrollYProgress, () => '0vw')

  // 8 Section Keyframe Map with rest plateaus to guarantee 100% full-section framing
  const yScrollPoints = [
    0.00, 0.05, // Section 0 (0vh)
    0.14, 0.19, // Section 1 (-100vh)
    0.28, 0.33, // Section 2 (-200vh)
    0.42, 0.47, // Section 3 (-300vh)
    0.56, 0.61, // Section 4 (-400vh)
    0.70, 0.75, // Section 5 (-500vh)
    0.84, 0.89, // Section 6 (-600vh)
    0.98, 1.00  // Section 7 (-700vh)
  ]
  const rawCanvasY = useTransform(
    scrollYProgress,
    yScrollPoints,
    [
      0, 0,
      -100, -100,
      -200, -200,
      -300, -300,
      -400, -400,
      -500, -500,
      -600, -600,
      -700, -700
    ]
  )
  const canvasY = useTransform(rawCanvasY, (v) => {
    return `${v}dvh`
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
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Snap targets matching the center of each rest plateau (0vh, -100vh, -200vh, etc.)
    const SECTION_PROGRESS = [0.025, 0.165, 0.305, 0.445, 0.585, 0.725, 0.865, 0.99]

    let cachedMaxScroll: number | null = null
    const getMaxScroll = () => {
      if (cachedMaxScroll !== null) return cachedMaxScroll
      
      const c = containerRef.current
      cachedMaxScroll = c
        ? c.offsetHeight - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight
      return cachedMaxScroll
    }
    
    const handleResizeForScroll = () => {
      cachedMaxScroll = null
    }
    window.addEventListener('resize', handleResizeForScroll, { passive: true })

    // Instant snap — used for Tab navigation only.
    // We lock isAnimating, jump the scroll position, then re-assert after 200ms
    // to absorb any delayed browser scroll-into-view reflow.
    const snapToSection = (index: number) => {
      const maxScroll = getMaxScroll()
      if (maxScroll <= 0) return
      const targetY = SECTION_PROGRESS[index] * maxScroll
      currentIndexRef.current = index
      isAnimatingRef.current = true

      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
      wheelTimeoutRef.current = setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })
        isAnimatingRef.current = false
      }, 200)
    }

    // Animated scroll — used for wheel/touch/arrow keys.
    const animateScroll = (targetY: number) => {
      const startY = window.scrollY
      const diff = targetY - startY
      const startTime = performance.now()
      const duration = 750

      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

      const step = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        window.scrollTo(0, startY + diff * ease(t))
        if (t < 1) {
          animationRef.current = requestAnimationFrame(step)
        } else {
          if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
          wheelTimeoutRef.current = setTimeout(() => {
            isAnimatingRef.current = false
            isWheelScrollingRef.current = false
          }, 200)
        }
      }

      isAnimatingRef.current = true
      isWheelScrollingRef.current = true
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = requestAnimationFrame(step)
    }

    // --- Tab interception ---
    // Strategy: Tab moves ONE section at a time (±1), always fully framing the
    // target section. The getFocusableInSection helper looks inside the section
    // DOM node directly (no offsetParent filter) so off-screen sections work too.
    //
    // If the active element is NOT inside the canvas, we let the browser handle Tab
    // normally until focus enters the canvas, then we take over.

    // Lazy getter — canvas is rendered after hydration, so we can't capture it at mount
    const getCanvas = () => document.querySelector('.canvas-container')

    const getCanvasChildren = (): HTMLElement[] => {
      const canvas = getCanvas()
      return canvas ? Array.from(canvas.children) as HTMLElement[] : []
    }

    const getActiveSectionIndex = (): number => {
      const canvas = getCanvas()
      if (!canvas) return -1
      const active = document.activeElement as HTMLElement
      const section = active?.closest('.canvas-container > *')
      if (!section) return -1
      return Array.from(canvas.children).indexOf(section as HTMLElement)
    }

    const getFocusableInSection = (sectionEl: HTMLElement, reverse = false): HTMLElement | null => {
      const candidates = Array.from(
        sectionEl.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), details > summary'
        )
      ).filter((el) => {
        // Only exclude elements explicitly hidden in CSS — NOT by offsetParent,
        // because sections are off-screen (translateY) and offsetParent is null for them.
        const s = window.getComputedStyle(el)
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'
      })
      if (!candidates.length) return null
      return reverse ? candidates[candidates.length - 1] : candidates[0]
    }

    const getFocusableOutsideCanvas = (): HTMLElement[] => {
      const canvas = getCanvas()
      return Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), details > summary'
        )
      ).filter((el) => {
        if (canvas && canvas.contains(el)) return false
        if (el.offsetParent === null && el.tagName !== 'BODY') return false
        const s = window.getComputedStyle(el)
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'
      })
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const canvas = getCanvas()
      if (!canvas) return

      const activeSectionIdx = getActiveSectionIndex()
      const canvasChildren = getCanvasChildren()

      // Active element is NOT inside canvas — let browser handle until it enters canvas
      if (activeSectionIdx === -1) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const dir = e.shiftKey ? -1 : 1
      const active = document.activeElement as HTMLElement
      const currentSection = canvasChildren[activeSectionIdx]

      // Check if there are more focusable elements within the SAME section in the Tab direction
      const focusablesInSection = Array.from(
        currentSection.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), details > summary'
        )
      ).filter((el) => {
        const s = window.getComputedStyle(el)
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'
      })

      const activeIdxInSection = focusablesInSection.indexOf(active)
      const nextInSection = focusablesInSection[activeIdxInSection + dir]

      if (nextInSection) {
        // Still within the same section — just move focus, no section change needed
        nextInSection.focus({ preventScroll: true })
        return
      }

      // Need to cross into the next/prev section
      const targetSectionIdx = activeSectionIdx + dir

      if (targetSectionIdx < 0) {
        // Going before the first section — focus last element outside canvas
        const outside = getFocusableOutsideCanvas()
        if (outside.length) outside[outside.length - 1].focus({ preventScroll: true })
        return
      }

      if (targetSectionIdx >= canvasChildren.length) {
        // Going past the last section — focus first element outside canvas
        const outside = getFocusableOutsideCanvas()
        if (outside.length) outside[0].focus({ preventScroll: true })
        return
      }

      // Snap to the target section (clamped to SECTION_PROGRESS bounds)
      const clampedIdx = Math.min(targetSectionIdx, SECTION_PROGRESS.length - 1)
      const maxScroll = getMaxScroll()
      if (maxScroll > 0) {
        currentIndexRef.current = clampedIdx
        isAnimatingRef.current = true
        const targetY = SECTION_PROGRESS[clampedIdx] * maxScroll
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })
        // Re-assert position after 200ms to neutralise any browser scroll reflow
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
        wheelTimeoutRef.current = setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })
          isAnimatingRef.current = false
        }, 200)
      }

      // Focus first (or last, if going backwards) focusable element in target section
      const targetSection = canvasChildren[targetSectionIdx]
      const targetEl = getFocusableInSection(targetSection, dir === -1)
      if (targetEl) targetEl.focus({ preventScroll: true })
    }

    // --- Wheel handler ---
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      const maxScroll = getMaxScroll()
      const scrollY = window.scrollY
      const dir = e.deltaY > 0 ? 1 : -1

      if (isAnimatingRef.current || isWheelScrollingRef.current) {
        e.preventDefault()
        return
      }

      if (scrollY >= maxScroll - 5) {
        if (dir === 1) return
        if (scrollY > maxScroll + 5 && dir === -1) return
      }

      // Allow smooth transition to maxScroll / normal page flow when scrolling down from last section
      if (currentIndexRef.current === SECTION_PROGRESS.length - 1 && dir === 1) {
        if (scrollY >= maxScroll - 10) return
        animateScroll(maxScroll)
        return
      }

      if (Math.abs(e.deltaY) < 8) return

      e.preventDefault()

      const targetIdx = Math.min(Math.max(currentIndexRef.current + dir, 0), SECTION_PROGRESS.length - 1)
      if (targetIdx !== currentIndexRef.current) {
        currentIndexRef.current = targetIdx
        animateScroll(SECTION_PROGRESS[targetIdx] * maxScroll)
      }
    }

    // --- Touch handlers ---
    let touchStartY = 0
    let touchStartTime = 0
    let touchLockTimeout: ReturnType<typeof setTimeout> | null = null

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = performance.now()
      if (!isAnimatingRef.current) {
        touchTriggeredRef.current = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const maxScroll = getMaxScroll()
      const scrollY = window.scrollY

      if (isAnimatingRef.current || touchTriggeredRef.current) {
        if (e.cancelable) e.preventDefault()
        return
      }

      const deltaY = touchStartY - e.touches[0].clientY
      const deltaTime = performance.now() - touchStartTime

      if (scrollY >= maxScroll - 5) {
        if (deltaY > 0) return
        if (scrollY > maxScroll + 5 && deltaY < 0) return
      }

      // Responsive threshold for touch gesture detection (35px minimum distance & dynamic gesture lock)
      if (Math.abs(deltaY) > 35 && deltaTime > 30) {
        touchTriggeredRef.current = true
        if (e.cancelable) e.preventDefault()
        const dir = deltaY > 0 ? 1 : -1
        const targetIdx = Math.min(Math.max(currentIndexRef.current + dir, 0), SECTION_PROGRESS.length - 1)
        if (targetIdx !== currentIndexRef.current) {
          currentIndexRef.current = targetIdx
          animateScroll(SECTION_PROGRESS[targetIdx] * maxScroll)
        }
      }
    }

    const handleTouchEnd = () => {
      if (touchLockTimeout) clearTimeout(touchLockTimeout)
      touchLockTimeout = setTimeout(() => {
        touchTriggeredRef.current = false
      }, 750)
    }

    // --- Arrow/Page key handler ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) return

      const maxScroll = getMaxScroll()
      const scrollY = window.scrollY
      const isDown = ['ArrowDown', 'PageDown', ' '].includes(e.key)

      if (scrollY >= maxScroll - 5) {
        if (isDown) return
        if (scrollY > maxScroll + 5 && !isDown) return
      }

      e.preventDefault()
      if (isAnimatingRef.current) return

      const dir = isDown ? 1 : -1
      const targetIdx = Math.min(Math.max(currentIndexRef.current + dir, 0), SECTION_PROGRESS.length - 1)
      if (targetIdx !== currentIndexRef.current) {
        currentIndexRef.current = targetIdx
        animateScroll(SECTION_PROGRESS[targetIdx] * maxScroll)
      }
    }

    // --- Scroll sync (keeps currentIndexRef in sync during free scroll) ---
    const handleScrollSync = () => {
      if (isAnimatingRef.current) return
      const maxScroll = getMaxScroll()
      if (maxScroll <= 0) return

      const progress = window.scrollY / maxScroll
      let closestIdx = 0
      let minDiff = Infinity
      for (let i = 0; i < SECTION_PROGRESS.length; i++) {
        const d = Math.abs(SECTION_PROGRESS[i] - progress)
        if (d < minDiff) { minDiff = d; closestIdx = i }
      }
      currentIndexRef.current = closestIdx
    }

    window.addEventListener('keydown', handleTab, { capture: true, passive: false })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScrollSync, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleTab, { capture: true })
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScrollSync)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
      window.removeEventListener('resize', handleResizeForScroll)
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
