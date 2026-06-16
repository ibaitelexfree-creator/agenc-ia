// src/components/vela/Vela3DOverlays.tsx
'use client';

import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import { OVERLAY_RANGES, getOverlayOpacity } from './useBoatScroll';

// Componente base para un overlay: gestiona opacidad y visibilidad
function Overlay({
  id,
  className,
  children,
}: {
  id: keyof typeof OVERLAY_RANGES;
  className?: string;
  children: React.ReactNode;
}) {
  const progress = useVelaScrollStore((s) => s.progress);
  const range = OVERLAY_RANGES[id];
  const opacity = getOverlayOpacity(range, progress);

  // No renderizar si completamente invisible (optimización)
  if (opacity <= 0.01) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center pointer-events-none ${className || ''}`}
      style={{ opacity, transition: 'none' }} // Sin CSS transition, controlado por scroll
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: HERO (progress 0.04 → 0.18)
// ═══════════════════════════════════════════════════════════════
function HeroOverlay() {
  const t = useTranslations('que_es_la_vela');

  return (
    <Overlay id="hero" className="px-6 md:px-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="w-full md:max-w-[45%] text-center md:text-left">
          {/* Eyebrow */}
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 md:mb-8 font-sans">
            {t('hero_eyebrow')}
          </p>

          {/* H1 Línea 1 */}
          <h1 className="font-bold leading-none mb-0 text-[#1D1D1F]"
              style={{
                fontFamily: 'var(--font-dm-serif)',
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              }}>
            {t('hero_line1')}
          </h1>

          {/* Línea divisora */}
          <div className="h-px bg-[#1D1D1F] my-4 mx-auto md:mx-0"
               style={{ width: 'clamp(150px, 30vw, 400px)' }} />

          {/* H1 Línea 2 — con "vela" en azul */}
          <h1 className="font-bold leading-none text-[#0071E3]"
              style={{
                fontFamily: 'var(--font-dm-serif)',
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              }}>
            {t('hero_line2')}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 md:mt-10 text-[#86868B] max-w-xl leading-relaxed text-sm md:text-base font-sans">
            {t('hero_subtitle')}
          </p>

          {/* CTA */}
          <div className="mt-8 md:mt-10 pointer-events-auto">
            <a href="#post-3d"
               className="inline-flex items-center gap-2 border border-[#0071E3] text-[#0071E3]
                          px-6 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium
                          hover:bg-[#0071E3] hover:text-white transition-all duration-300 font-sans">
              {t('hero_discover')} →
            </a>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function FraseOverlay() {
  return null;
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: FILOSOFÍA (progress 0.33 → 0.52)
// ═══════════════════════════════════════════════════════════════
function FilosofiaOverlay() {
  const t = useTranslations('que_es_la_vela');
  const progress = useVelaScrollStore((s) => s.progress);

  const cards = [
    { id: 'carta',       title: t('cards.carta_title'),       text: t('cards.carta_text'),       triggerAt: 0.37 },
    { id: 'experiencia', title: t('cards.experiencia_title'), text: t('cards.experiencia_text'), triggerAt: 0.40 },
    { id: 'escenario',   title: t('cards.escenario_title'),   text: t('cards.escenario_text'),   triggerAt: 0.43 },
    { id: 'compania',    title: t('cards.compania_title'),     text: t('cards.compania_text'),     triggerAt: 0.46 },
  ];

  return (
    <Overlay id="filosofia" className="px-6 md:px-12 items-start py-8 md:py-16 overflow-y-auto pointer-events-auto">
      <div className="max-w-6xl mx-auto w-full">
        <div className="w-full md:max-w-[42%] pointer-events-auto">
          {/* Section Header */}
          <div className="mb-6 md:mb-8">
            <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-2 md:mb-4 font-sans">
              {t('philosophy_eyebrow')}
            </p>
            <h2 className="text-[#1D1D1F] leading-tight font-bold"
                style={{
                  fontFamily: 'var(--font-dm-serif)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                }}>
              {t('philosophy_title')}
            </h2>
            <p className="mt-2 text-[#86868B] text-xs md:text-sm leading-relaxed font-sans">
              {t('philosophy_subtitle')}
            </p>
          </div>

          {/* Cards en columna */}
          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              // Cada card tiene su propio fade-in basado en scroll progress
              const cardOpacity = progress >= card.triggerAt
                ? Math.min(1, (progress - card.triggerAt) / 0.02)
                : 0;
              const cardTranslateY = progress >= card.triggerAt
                ? Math.max(0, 20 * (1 - (progress - card.triggerAt) / 0.02))
                : 20;

              return (
                <div
                  key={card.id}
                  className="rounded-2xl p-4 md:p-6 border border-[#E8E8ED]"
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${cardTranslateY}px)`,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                  }}
                >
                  <h3 className="text-[#1D1D1F] text-sm md:text-base font-semibold mb-1 font-sans">
                    {card.title}
                  </h3>
                  <p className="text-[#86868B] text-[11px] md:text-xs leading-relaxed font-sans">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: TEXTO NARRATIVO (progress 0.53 → 0.72)
// ═══════════════════════════════════════════════════════════════
function NarrativaOverlay() {
  const t = useTranslations('que_es_la_vela');
  const progress = useVelaScrollStore((s) => s.progress);

  const paragraphs = [
    { id: 'p1', text: t('history_p1'), highlight: t.has('history_p1_highlight') ? t('history_p1_highlight') : null, triggerAt: 0.56 },
    { id: 'p2', text: t('history_p2'), highlight: null, triggerAt: 0.60 },
    { id: 'p3', text: t('history_p3'), highlight: t.has('history_p3_highlight') ? t('history_p3_highlight') : null, triggerAt: 0.64 },
    { id: 'p4', text: t('history_p4'), highlight: null, triggerAt: 0.67 },
  ];

  return (
    <Overlay id="narrativa" className="px-6 md:px-12 items-start py-8 md:py-16 overflow-y-auto pointer-events-auto">
      <div className="max-w-6xl mx-auto w-full flex justify-end">
        <div className="w-full md:max-w-[48%] pointer-events-auto bg-white/60 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
          {/* Eyebrow */}
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans">
            {t('history_eyebrow')}
          </p>

          {/* Gradient line decorativa */}
          <div className="w-full md:w-px h-0.5 md:h-16 bg-gradient-to-r md:bg-gradient-to-b from-[#0071E3] to-transparent mb-6 md:mb-8" />

          {/* Párrafos con stagger basado en scroll */}
          <div className="flex flex-col gap-5 md:gap-8">
            {paragraphs.map((para) => {
              const paraOpacity = progress >= para.triggerAt
                ? Math.min(1, (progress - para.triggerAt) / 0.025)
                : 0;
              const paraTranslateY = progress >= para.triggerAt
                ? Math.max(0, 25 * (1 - (progress - para.triggerAt) / 0.025))
                : 25;

              // Renderizar texto con highlight
              const renderText = () => {
                if (!para.highlight) return para.text;
                const parts = para.text.split(para.highlight);
                if (parts.length < 2) return para.text;
                return (
                  <>
                    {parts[0]}
                    <span className="text-[#0071E3] font-medium">{para.highlight}</span>
                    {parts.slice(1).join(para.highlight)}
                  </>
                );
              };

              return (
                <p
                  key={para.id}
                  className="text-[#1D1D1F] leading-relaxed text-xs md:text-[1.05rem]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    opacity: paraOpacity,
                    transform: `translateY(${paraTranslateY}px)`,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                  }}
                >
                  {renderText()}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: BEAUTY SHOT (progress 0.73 → 0.88)
// ═══════════════════════════════════════════════════════════════
function BeautyOverlay() {
  const t = useTranslations('que_es_la_vela');

  return (
    <Overlay id="beauty" className="items-end justify-center pb-20 md:pb-24 px-6">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full
                     border border-[#E8E8ED] text-[#86868B] text-[10px] md:text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-inter)',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {t('beauty_badge')}
        </motion.div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: CIERRE (progress 0.89 → 1.00)
// ═══════════════════════════════════════════════════════════════
function CierreOverlay() {
  const t = useTranslations('que_es_la_vela');
  const progress = useVelaScrollStore((s) => s.progress);

  // Normalizar el progreso de la sección Cierre (0.89 a 1.00)
  const tLocal = Math.max(0, Math.min(1, (progress - 0.89) / 0.11));

  // Dividir el texto en 3 líneas balanceadas
  const text = t('hero_subtitle');
  const words = text.split(' ');
  const third = Math.ceil(words.length / 3);
  const lines = [
    words.slice(0, third).join(' '),
    words.slice(third, third * 2).join(' '),
    words.slice(third * 2).join(' '),
  ];

  return (
    <Overlay id="cierre" className="justify-center px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center translate-y-20 md:translate-y-28">
        <h2 className="text-[#1D1D1F] leading-tight font-bold mb-6 flex flex-col items-center"
            style={{
              fontFamily: 'var(--font-dm-serif)',
              fontSize: 'clamp(1.5rem, 4.2vw, 3.2rem)',
            }}>
          {lines.map((lineText, idx) => {
            // Cada línea tiene su propio rango de aparición, retrasado para que el velero ya esté arriba (enclavado)
            // Línea 0: 0.40 -> 0.60
            // Línea 1: 0.60 -> 0.80
            // Línea 2: 0.80 -> 1.00
            const start = 0.40 + idx * 0.20;
            const end = start + 0.20;
            
            const lineProgress = Math.max(0, Math.min(1, (tLocal - start) / (end - start)));
            
            // Efecto de suavizado cúbico
            const smooth = lineProgress * lineProgress * (3 - 2 * lineProgress);
            
            const translateY = (1 - smooth) * 100; // Va de 100% (abajo) a 0%
            const opacity = smooth;

            return (
              <div key={idx} className="overflow-hidden py-1 w-full flex justify-center">
                <span
                  style={{
                    display: 'block',
                    transform: `translateY(${translateY}%)`,
                    opacity: opacity,
                    transition: 'none', // Sincronizado exactamente con el scroll
                  }}
                >
                  {lineText}
                </span>
              </div>
            );
          })}
        </h2>

        {/* Línea divisora de cierre */}
        <div 
          className="h-px bg-[#E8E8ED]"
          style={{ 
            width: `${Math.max(0, Math.min(1, (tLocal - 0.9) / 0.1)) * 100}%`,
            maxWidth: '200px',
            transition: 'none',
          }} 
        />
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function Vela3DOverlays() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <HeroOverlay />
      <FraseOverlay />
      <FilosofiaOverlay />
      <NarrativaOverlay />
      <BeautyOverlay />
      <CierreOverlay />
    </div>
  );
}
