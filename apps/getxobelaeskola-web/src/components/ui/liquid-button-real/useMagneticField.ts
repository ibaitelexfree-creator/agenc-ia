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

    function handlePointerMove(e: PointerEvent) {
      const el = targetRef.current;
      if (!el) return;

      // Recalcular SIEMPRE el rect: nunca cachearlo. El scroll puede haber
      // movido el botón desde el último evento sin disparar un resize.
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
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
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [targetRef, radius, disabled, rawInfluence, rawPullX, rawPullY]);

  return { pullX, pullY, influence };
}
