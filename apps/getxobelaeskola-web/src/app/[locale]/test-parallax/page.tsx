// src/app/[locale]/test-parallax/page.tsx
'use client'

import { ParallaxHoverCard } from '@/components/ui/ParallaxHoverCard'
import { PivotParallaxCard } from '@/components/ui/PivotParallaxCard'
import { MultiLayerParallaxCard } from '@/components/ui/MultiLayerParallaxCard'
import { PortholeParallaxCard } from '@/components/ui/PortholeParallaxCard'
import { ZoomRotateCard } from '@/components/ui/ZoomRotateCard'
import { BoatParallaxCard } from '@/components/ui/BoatParallaxCard'
import { BoatPivotParallaxCard } from '@/components/ui/BoatPivotParallaxCard'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { LiquidButton as LiquidButtonReal } from '@/components/ui/liquid-button-real'
import { FullScreenWaves } from '@/components/ui/FullScreenWaves'
import Link from 'next/link'

export default function TestParallaxPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center py-16 px-4 text-slate-900">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="text-cyan-600 font-bold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/50">
          Efectos Visuales 3D
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 bg-clip-text text-transparent">
          Tarjetas Holográficas Interactivas
        </h1>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
          Cinco versiones del efecto de profundidad 3D. Pasa el ratón sobre cada una para ver la diferencia de comportamiento.
        </p>
      </div>

      <div className="flex flex-wrap gap-12 items-center justify-center max-w-7xl w-full">
        {/* Versión 1: Inclinación interactiva básica */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 1: Inclinación Dinámica</span>
          <ParallaxHoverCard
            backgroundImage="/images/home/paralax-2/fondo.jpeg"
            characterImage="/images/home/paralax-2/sin-fondo.png?v=3"
            title="Navega sin Límites"
            subtitle="Tarjeta con inclinación responsiva"
            badge="TILT COMPLETO"
          />
        </div>

        {/* Versión 2: Fondo pivotante a 30 grados */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 2: Fondo Levemente Pivotante (30°)</span>
          <PivotParallaxCard
            backgroundImage="/images/home/paralax-2/fondo.jpeg"
            characterImage="/images/home/paralax-2/sin-fondo.png?v=3"
            title="Siente la Libertad"
            subtitle="El fondo pivota, la silueta sale"
            badge="PIVOT 30°"
          />
        </div>

        {/* Versión 3: Parallax por capas independiente */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 3: Parallax Multicapa</span>
          <MultiLayerParallaxCard
            backgroundImage="/images/home/paralax-2/fondo.jpeg"
            characterImage="/images/home/paralax-2/sin-fondo.png?v=3"
            title="Aventuras en el Mar"
            subtitle="Las capas se desplazan de forma independiente"
            badge="MULTICAPA"
          />
        </div>

        {/* Versión 4: Ventana de barco (Ojo de buey) con parallax */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 4: Ojo de Buey Náutico</span>
          <PortholeParallaxCard
            backgroundImage="/images/home/paralax-2/fondo.jpeg"
            characterImage="/images/home/paralax-2/sin-fondo.png?v=3"
            title="Puerto de Getxo"
            subtitle="Parallax en ojo de buey circular"
            badge="BARCO 3D"
          />
        </div>

        {/* Versión 5: Zoom & Rotate con velero_arriba */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 5: Zoom & Rotación</span>
          <ZoomRotateCard
            backgroundImage="/images/home/paralax-2/velero_arriba.jpeg"
            title="Velero desde las Alturas"
            subtitle="Efecto de zoom rotatorio"
            badge="ZOOM & ROTATE"
          />
        </div>

        {/* Versión 6: Parallax Multicapa Personalizado */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 6: Mar de Sombras (Oleaje 3D)</span>
          <BoatParallaxCard
            backgroundImage="/images/home/paralax-2/Black_image_to_sea_2K_202607081817.jpeg"
            boatImage="/images/home/paralax-2/boat_cutout_2K.png?v=4"
            title="Mar y Barca"
            subtitle="Navegando con oleaje 3D"
            badge="MAR DE SOMBRAS"
          />
        </div>

        {/* Versión 7: Fondo Pivotante (30°) */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500 font-bold font-mono mb-2">Versión 7: Fondo Pivotante (30°)</span>
          <BoatPivotParallaxCard
            backgroundImage="/images/home/paralax-2/นำสีดำออกให้เหลือแค่น้ำทะเล_2K_202607100100.jpeg"
            boatImage="/images/home/paralax-2/ปรับภาพสีคนบนเรือ_cutout_2K.png?v=2"
            title="Mar y Barca"
            subtitle="Fondo pivotante con mar real"
            badge="PIVOT 30°"
          />
        </div>
      </div>

      {/* Bonus Showcase: Liquid Button Section */}
      <div className="mt-20 flex flex-col items-center border-t border-slate-100 pt-16 w-full max-w-4xl text-center">
        <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 bg-clip-text text-transparent">
          Botonera Interactiva Extra
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-8 max-w-lg">
          Dos versiones del botón de agua: la Versión A con oleaje rápido y vórtice por cursor de deformación directa, y la Versión B fotorrealista basada en filtros de turbulencia refractiva y atracción magnética a distancia.
        </p>
        
        <div className="flex flex-wrap gap-16 justify-center items-center mt-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold font-mono mb-4">Versión A: Ola & Vórtice Directo (Cian)</span>
            <LiquidButton text="Reservar Plaza" />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold font-mono mb-4">Versión B: Atracción Magnética Real (Cian)</span>
            <LiquidButtonReal>
              Reservar Plaza
            </LiquidButtonReal>
          </div>
        </div>

        {/* Garnet Logo Color Showcase */}
        <div className="mt-12 w-full border-t border-slate-100/50 pt-10">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Versiones en Granate Corporativo del Logo
          </h3>
          <div className="flex flex-wrap gap-16 justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold font-mono mb-4">Versión A (Granate): Reservar Plaza</span>
              <LiquidButton text="Reservar Plaza" waterColor="#fda4af" waterColorDeep="#be0040" />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold font-mono mb-4">Versión B (Granate): Reservar Plaza</span>
              <LiquidButtonReal waterColor="#fda4af" waterColorDeep="#be0040">
                Reservar Plaza
              </LiquidButtonReal>
            </div>
          </div>
        </div>

        {/* Interactive Garnet Liquid Banner (Franja) above the newsletter */}
        <div className="mt-16 w-full max-w-5xl px-4 pointer-events-auto">
          <LiquidButtonReal 
            waterColor="#fda4af" 
            waterColorDeep="#be0040"
            className="w-full h-auto min-h-[150px] rounded-2xl md:rounded-3xl border border-rose-300/20 shadow-[0_12px_40px_rgba(190,0,64,0.25)] px-8 md:px-12 py-8 lg:py-10 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-8 cursor-pointer select-none"
          >
            <div className="flex flex-col lg:text-left text-center">
              <h4 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">
                ¡Únete a nuestra escuela de vela!
              </h4>
              <p className="text-[11px] md:text-xs text-rose-100/90 mt-1 font-semibold max-w-lg leading-relaxed">
                Descubre nuestros cursos y actividades en el Puerto Deportivo de Getxo. Reserva tu plaza hoy mismo.
              </p>
            </div>
            <span className="bg-white text-rose-700 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition shadow-lg shrink-0">
              Ver Cursos
            </span>
          </LiquidButtonReal>
        </div>
      </div>

      <div className="mt-16 flex gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition font-medium"
        >
          Volver al Inicio
        </Link>
      </div>

      {/* Full-width liquid waves separating content from footer newsletter */}
      <FullScreenWaves />
    </main>
  )
}
