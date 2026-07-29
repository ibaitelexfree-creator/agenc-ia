'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import {
  LATERAL_PULL_SPRING,
  INFLUENCE_SPRING,
  MAX_LATERAL_PULL,
} from './LiquidButton.constants';

export function useMagneticField(
  targetRef: React.RefObject<HTMLButtonElement | null>,
  radius: number,
  disabled: boolean
) {
  const rawPullX = useRef(useMotionValue(0)).current;
  const rawPullY = useRef(useMotionValue(0)).current;
  const rawInfluence = useRef(useMotionValue(0)).current;

  const pullX = useSpring(rawPullX, LATERAL_PULL_SPRING);
  const pullY = useSpring(rawPullY, LATERAL_PULL_SPRING);
  const influence = useSpring(rawInfluence, INFLUENCE_SPRING);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;

    // Cache bounds
    const boundsRef = { left: 0, top: 0, width: 0, height: 0 };
    const updateBounds = () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      boundsRef.left = rect.left + window.scrollX;
      boundsRef.top = rect.top + window.scrollY;
      boundsRef.width = rect.width;
      boundsRef.height = rect.height;
    };

    const resizeObserver = new ResizeObserver(updateBounds);
    if (targetRef.current) resizeObserver.observe(targetRef.current);
    window.addEventListener('resize', updateBounds, { passive: true });
    updateBounds();

    function handlePointerMove(e: PointerEvent) {
      const el = targetRef.current;
      if (!el || !boundsRef.width) return;

      const cx = boundsRef.left + boundsRef.width / 2;
      const cy = boundsRef.top + boundsRef.height / 2;
      const dx = e.pageX - cx;
      const dy = e.pageY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance < radius) {
        const strength = 1 - distance / radius;
        rawInfluence.set(strength);
        rawPullX.set((dx / radius) * MAX_LATERAL_PULL * strength);
        rawPullY.set((dy / radius) * MAX_LATERAL_PULL * strength * 0.4);
      } else {
        rawInfluence.set(0);
        rawPullX.set(0);
        rawPullY.set(0);
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', updateBounds);
      resizeObserver.disconnect();
    };
  }, [targetRef, radius, disabled, rawInfluence, rawPullX, rawPullY]);

  return { pullX, pullY, influence };
}
