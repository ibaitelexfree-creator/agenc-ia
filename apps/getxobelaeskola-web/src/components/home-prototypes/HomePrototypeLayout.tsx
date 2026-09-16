'use client'

import React from 'react'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { Section2Curved } from '@/components/home-prototypes/Section2Curved'
import { Section3Curved } from '@/components/home-prototypes/Section3Curved'
import dynamic from 'next/dynamic'
import HomePreviewNav from '@/components/home-preview/HomePreviewNav'

const Section3Path = dynamic(() => import('@/components/sections/Section3Path').then(mod => mod.Section3Path), { ssr: true })
const Section4Why = dynamic(() => import('@/components/sections/Section4Why').then(mod => mod.Section4Why), { ssr: true })
const ReviewsSection = dynamic(() => import('@/components/sections/Reviews/ReviewsSection'), { ssr: true })
const BlogSection = dynamic(() => import('@/components/sections/Blog/BlogSection'), { ssr: true })

interface HomePrototypeLayoutProps {
  variant: 'home-1' | 'home-2' | 'home-3' | 'home-5' | 'home-6' | 'home-7' | 'home-8'
}

export function HomePrototypeLayout({ variant }: HomePrototypeLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-[#0D2137] text-white flex flex-col relative overflow-x-hidden">
      {/* Selector de prototipos fijado arriba */}
      <HomePreviewNav current={variant} />

      {/* Sección 1: Hero original idéntico */}
      <section className="relative w-full">
        <Section1Hero />
      </section>

      {/* Sección 2: Rediseño curvo con vídeo y zona beige */}
      <section className="relative w-full">
        <Section2Curved variant={variant} />
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
