'use client';

import { useRef, useState, useEffect, useId, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useMagneticField } from './useMagneticField';
import { useWaterPhysics } from './useWaterPhysics';
import { WaterFilters } from './WaterFilters';
import {
  MAGNETIC_RADIUS_DEFAULT,
  SURFACE_TENSION_SPRING,
  PRESS_DIP_SPRING,
  RIPPLE_DURATION_MS,
  RIPPLE_MAX_RADIUS_PX,
  FILL_PRESS_DIP,
} from './LiquidButton.constants';
import type { LiquidButtonProps } from './LiquidButton.types';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function LiquidButton({
  children,
  onClick,
  waterColor = '#22d3ee',
  waterColorDeep = '#0e7490',
  intensity = 'normal',
  magneticRadius = MAGNETIC_RADIUS_DEFAULT,
  disabled = false,
  className = '',
}: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVisibleRef = useRef(true);
  const rawUid = useId().replace(/:/g, '');
  const filterId = `water-distortion-${rawUid}`;

  const [dimensions, setDimensions] = useState({ width: 220, height: 64 });
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  const rawPressDip = useMotionValue(0);
  const pressDip = useSpring(rawPressDip, PRESS_DIP_SPRING);

  // Detección de entorno — solo en cliente
  useEffect(() => {
    setIsTouch(!window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Tamaño real del botón (el texto/padding determinan el ancho, no es fijo)
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pausa el cálculo (no la posición) cuando el botón sale del viewport
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const magneticDisabled = isTouch || reducedMotion || disabled;
  const { pullX, pullY, influence } = useMagneticField(buttonRef, magneticRadius, magneticDisabled);

  const { frontPathD, backPathD } = useWaterPhysics({
    width: dimensions.width + 40, // Extended width for buffer
    height: dimensions.height,
    intensity,
    reducedMotion,
    isVisibleRef,
    influence,
    pullX,
    pressDip,
  });

  const groupTransform = useMotionTemplate`translateX(${pullX}px)`;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      rawPressDip.set(FILL_PRESS_DIP);

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, RIPPLE_DURATION_MS);
    },
    [disabled, rawPressDip]
  );

  const handlePointerUp = useCallback(() => {
    rawPressDip.set(0);
  }, [rawPressDip]);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={`relative isolate overflow-hidden rounded-full px-8 py-4 font-medium text-white border border-cyan-200/30 shadow-[0_8px_30px_rgba(34,211,238,0.25)] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      style={{ backgroundColor: waterColorDeep }}
      animate={{ scale: isHovering && !disabled ? 1.025 : 1 }}
      transition={{
        type: 'spring',
        stiffness: SURFACE_TENSION_SPRING.stiffness,
        damping: SURFACE_TENSION_SPRING.damping,
        mass: SURFACE_TENSION_SPRING.mass,
      }}
    >
      <WaterFilters influence={influence} filterId={filterId} />

      <motion.svg
        className="pointer-events-none absolute top-0 bottom-0 left-[-20px] w-[calc(100%+40px)] h-full"
        style={{ transform: groupTransform, filter: `url(#${filterId})` }}
        viewBox={`0 0 ${dimensions.width + 40} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={`grad-back-${rawUid}`}
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="0" y2={dimensions.height}
          >
            <stop offset="0%" stopColor={waterColor} stopOpacity="0.60" />
            <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient
            id={`grad-front-${rawUid}`}
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="0" y2={dimensions.height}
          >
            <stop offset="0%" stopColor={waterColor} stopOpacity="0.99" />
            <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.90" />
          </linearGradient>
        </defs>

        <motion.path style={{ d: backPathD }} fill={`url(#grad-back-${rawUid})`} />
        <motion.path style={{ d: frontPathD }} fill={`url(#grad-front-${rawUid})`} />
      </motion.svg>

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full border border-white/50"
          style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{
            width: RIPPLE_MAX_RADIUS_PX * 2,
            height: RIPPLE_MAX_RADIUS_PX * 2,
            opacity: 0,
          }}
          transition={{ duration: RIPPLE_DURATION_MS / 1000, ease: [0.19, 1, 0.22, 1] }}
        />
      ))}

      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
        {children}
      </span>
    </motion.button>
  );
}
