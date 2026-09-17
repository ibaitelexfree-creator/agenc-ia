'use client'

import React from 'react'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { Section2Curved } from '@/components/home-prototypes/Section2Curved'
import { Section3Curved } from '@/components/home-prototypes/Section3Curved'
import { Section1To2WaveBand, WaveBandVariant } from '@/components/home-prototypes/Section1To2WaveBand'
import dynamic from 'next/dynamic'

const Section3Path = dynamic(() => import('@/components/sections/Section3Path').then(mod => mod.Section3Path), { ssr: true })
const Section4Why = dynamic(() => import('@/components/sections/Section4Why').then(mod => mod.Section4Why), { ssr: true })
const ReviewsSection = dynamic(() => import('@/components/sections/Reviews/ReviewsSection'), { ssr: true })
const BlogSection = dynamic(() => import('@/components/sections/Blog/BlogSection'), { ssr: true })

interface HomePrototypeLayoutProps {
  variant?: 'home-1' | 'home-2' | 'home-3' | 'home-4' | 'home-5' | 'home-6' | 'home-7' | 'home-8'
  waveVariant?: WaveBandVariant
}

export function HomePrototypeLayout({ 
  variant = 'home-8',
  waveVariant
}: HomePrototypeLayoutProps) {
  // Mapeo automático de variante de ola si se accede por ruta de prototipo
  const resolvedWaveVariant: WaveBandVariant | undefined = waveVariant || (
    variant === 'home-2' ? 'animated-sync' :
    variant === 'home-3' ? 'animated-organic' :
    variant === 'home-4' ? 'static-gentle' :
    variant === 'home-5' ? 'floating-overlay' :
    undefined
  )

  return (
    <div className="w-full min-h-screen bg-[#0D2137] text-white flex flex-col relative overflow-x-hidden">

      {/* Sección 1: Hero original idéntico */}
      <section className="relative w-full">
        <Section1Hero />
      </section>

      {/* Franja beige ondulada divisoria entre Sección 1 y Sección 2 */}
      {resolvedWaveVariant && (
        <Section1To2WaveBand variant={resolvedWaveVariant} />
      )}

      {/* Sección 2: Rediseño curvo con vídeo y zona beige */}
      <section className="relative w-full">
        <Section2Curved variant={variant === 'home-2' || variant === 'home-3' || variant === 'home-4' ? 'home-8' : variant} />
      </section>

      {/* Sección 3: Inversión con vídeo a la izquierda y zona beige a la derecha */}
      <section className="relative w-full">
        <Section3Curved variant={variant} />
      </section>

      {/* Sección 4: Descubre tu camino (Cursos / árbol de formación intacto) */}
      <section className="relative w-full bg-[#0D2137]">
        <Section3Path />
      </section>

      {/* Sección 5: Nuestra Promesa / Por qué navegar con nosotros (Flip cards intactas) */}
      <section className="relative w-full bg-[#0D2137]">
        <Section4Why />
      </section>

      {/* Sección Blog: Noticias y Eventos intacta */}
      <section className="relative w-full bg-[#0D2137]">
        <BlogSection />
      </section>

      {/* Sección Reseñas intacta */}
      <section className="relative w-full bg-[#0D2137]">
        <ReviewsSection />
      </section>
    </div>
  )
}
