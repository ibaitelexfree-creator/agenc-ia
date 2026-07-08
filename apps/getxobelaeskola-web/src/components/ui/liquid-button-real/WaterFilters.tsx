'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { DISPLACEMENT_SCALE_IDLE, DISPLACEMENT_SCALE_MAX } from './LiquidButton.constants';

interface WaterFiltersProps {
  influence: MotionValue<number>;
  filterId: string;
}

export function WaterFilters({ influence, filterId }: WaterFiltersProps) {
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    // Se actualiza el atributo `scale` de forma imperativa (ref + setAttribute)
    // en vez de intentar animarlo vía props de framer-motion: `scale` en
    // feDisplacementMap es un atributo de primitiva de filtro SVG, no está
    // garantizado en la lista de propiedades animables de Framer Motion.
    // Este enfoque es 100% fiable en cualquier versión.
    const unsubscribe = influence.on('change', (v) => {
      const scale = DISPLACEMENT_SCALE_IDLE + v * (DISPLACEMENT_SCALE_MAX - DISPLACEMENT_SCALE_IDLE);
      displacementRef.current?.setAttribute('scale', String(scale));
    });
    return unsubscribe;
  }, [influence]);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.045"
            numOctaves={2}
            seed={11}
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale={DISPLACEMENT_SCALE_IDLE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
