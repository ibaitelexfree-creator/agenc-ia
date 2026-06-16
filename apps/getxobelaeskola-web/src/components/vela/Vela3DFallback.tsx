// src/components/vela/Vela3DFallback.tsx
'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const VelaHero = dynamic(() => import('./VelaHero'), { ssr: false });
const VelaFraseAnimada = dynamic(() => import('./VelaFraseAnimada'), { ssr: false });
const VelaFilosofia = dynamic(() => import('./VelaFilosofia'), { ssr: false });
const VelaTextoNarrativo = dynamic(() => import('./VelaTextoNarrativo'), { ssr: false });

export default function Vela3DFallback() {
  const t = useTranslations('que_es_la_vela');

  return (
    <div className="bg-white">
      {/* Mensaje sutil de aviso */}
      <div className="bg-[#F5F5F7] text-[#86868B] text-center text-xs py-3 px-4 border-b border-[#E8E8ED]"
           style={{ fontFamily: 'var(--font-inter)' }}>
        {t('fallback_message')}
      </div>

      {/* Flujo estático tradicional */}
      <VelaHero />
      <VelaFraseAnimada />
      <VelaFilosofia />
      <VelaTextoNarrativo />
    </div>
  );
}

/**
 * Utilidad: detecta si WebGL está soportado por el navegador
 */
export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
