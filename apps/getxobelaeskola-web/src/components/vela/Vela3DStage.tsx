// src/components/vela/Vela3DStage.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import Vela3DLoadingScreen from './Vela3DLoadingScreen';
import Vela3DOverlays from './Vela3DOverlays';
import { isWebGLSupported } from './Vela3DFallback';
import { OVERLAY_RANGES, getOverlayOpacity } from './useBoatScroll';

// Importación dinámica del Canvas 3D (NO SSR — Three.js requiere window/document)
const Vela3DScene = dynamic(() => import('./Vela3DScene'), {
  ssr: false,
  loading: () => null, // El loading screen se maneja aparte
});

// Importación dinámica del fallback
const Vela3DFallback = dynamic(() => import('./Vela3DFallback'), {
  ssr: false,
});

// Componente para el video de fondo de la Sección 2 (detrás del Canvas 3D)
function Section2Video() {
  const progress = useVelaScrollStore((s) => s.progress);
  const range = OVERLAY_RANGES.frase;
  const opacity = getOverlayOpacity(range, progress);
  const isVisible = opacity > 0.01;

  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef(1); // 1 = forward, -1 = backward
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isVisible) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let animFrameId: number;
    lastTimeRef.current = performance.now();

    const updateVideo = () => {
      const now = performance.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (directionRef.current === 1) {
        if (video.paused) {
          video.play().catch(() => {});
        }
        if (video.duration && video.currentTime >= video.duration - 0.15) {
          directionRef.current = -1;
          video.pause();
        }
      } else {
        let newTime = video.currentTime - delta;
        if (newTime <= 0.15) {
          newTime = 0.15;
          directionRef.current = 1;
          video.play().catch(() => {});
        }
        video.currentTime = newTime;
      }

      animFrameId = requestAnimationFrame(updateVideo);
    };

    animFrameId = requestAnimationFrame(updateVideo);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute top-20 bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ opacity, transition: 'none', zIndex: 0 }}
    >
      <video
        ref={videoRef}
        src="/videos/Quiero_que_empiece_acabe_optimized.mp4"
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

export default function Vela3DStage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [runwayHeight, setRunwayHeight] = useState(700);
  const setProgress = useVelaScrollStore((s) => s.setProgress);
  const setIsInRunway = useVelaScrollStore((s) => s.setIsInRunway);
  const t = useTranslations('que_es_la_vela');

  // Detectar soporte WebGL y preferencias de movimiento reducido
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    // Reducir la altura del runway en móviles para hacer el scroll más cómodo
    if (window.innerWidth < 768) {
      setRunwayHeight(500);
    }
  }, []);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Sincronizar scroll progress → Zustand store (→ R3F useFrame)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setProgress(value);
    setIsInRunway(true);
  });

  // Si no soporta WebGL o prefiere movimiento reducido, mostrar fallback
  if (!webGLSupported || prefersReducedMotion) {
    return <Vela3DFallback />;
  }

  return (
    <>
      {/* Pantalla de carga elegante */}
      <Vela3DLoadingScreen />

      {/* Skip Link para accesibilidad */}
      <a
        href="#post-3d"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0071E3]
                   focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
      >
        {t('skip_3d')}
      </a>

      {/* SCROLL RUNWAY — Este div tiene una altura enorme.
          Su único propósito es generar scroll.
          Todo el contenido visual está en el sticky stage dentro. */}
      <div
        ref={scrollContainerRef}
        style={{ height: `${runwayHeight}vh`, position: 'relative' }}
      >
        {/* STICKY STAGE — Permanece fijo en el viewport mientras scrolleamos el runway */}
        <div
          role="region"
          aria-label={t('aria_3d_region')}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Video de fondo para Sección 2 (detrás del Canvas 3D) */}
          <Section2Video />

          {/* Canvas 3D */}
          <Vela3DScene />

          {/* Overlays de contenido — encima del canvas */}
          <Vela3DOverlays />

          {/* Transición suave del final del stage al contenido post-3D */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to bottom, transparent, white)',
            }}
          />

          {/* Indicador de scroll progress (sutil, en el borde derecho) */}
          <ScrollProgressIndicator />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Indicador visual de progreso de scroll (barra vertical sutil)
// ═══════════════════════════════════════════════════════════════
function ScrollProgressIndicator() {
  const progress = useVelaScrollStore((s) => s.progress);

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      {/* Track */}
      <div className="w-[2px] h-24 bg-[#E8E8ED] rounded-full relative overflow-hidden">
        {/* Fill */}
        <div
          className="absolute top-0 left-0 w-full bg-[#0071E3] rounded-full transition-none"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
