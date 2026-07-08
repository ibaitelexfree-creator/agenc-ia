// src/components/ui/ZoomRotateCard.tsx
'use client'

import Image from 'next/image'

interface ZoomRotateCardProps {
  backgroundImage: string
  title?: string
  subtitle?: string
  badge?: string
}

export function ZoomRotateCard({
  backgroundImage,
  title = 'Navegación Aérea',
  subtitle = 'Velero visto desde arriba',
  badge = 'ZOOM & ROTATE'
}: ZoomRotateCardProps) {
  return (
    <div className="flex items-center justify-center p-8">
      {/* 3D Container lifting up on hover */}
      <div 
        className="group relative w-[380px] h-[380px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/10 select-none cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.3)] hover:-translate-y-3 hover:scale-[1.03] transition-all duration-500 ease-out"
      >
        {/* Zooming and Rotating Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src={backgroundImage}
            alt="Sailboat from Above"
            fill
            priority
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.5] group-hover:rotate-[30deg]"
            sizes="380px"
          />
          {/* Subtle vignette/gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
        </div>

        {/* Text overlay - Slides up slightly on hover */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-1 z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {badge && (
            <span className="self-start text-[10px] tracking-widest text-cyan-500 font-bold bg-cyan-950/90 border border-cyan-800/50 px-2.5 py-0.5 rounded-full mb-1">
              {badge}
            </span>
          )}
          <h3 className="text-xl font-black text-white tracking-wide drop-shadow-md">
            {title}
          </h3>
          <p className="text-sm font-bold text-slate-300 drop-shadow-md">
            {subtitle}
          </p>
        </div>

        {/* Elegant border glare highlight */}
        <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none group-hover:border-white/20 transition-colors duration-500" />
      </div>
    </div>
  )
}
