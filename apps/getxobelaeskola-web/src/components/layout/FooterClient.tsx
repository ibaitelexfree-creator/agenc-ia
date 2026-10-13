'use client'

import React from 'react'
import Newsletter from '@/components/shared/Newsletter'
import HomeStats from '@/components/shared/HomeStats'
import { Clock, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import CollaboratorsGrid from '@/components/shared/CollaboratorsGrid'

export default function FooterClient({ locale }: { locale: string }) {
  return (
    <footer
      style={{ gridArea: 'footer', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'hidden' }}
      className="bg-nautical-deep border-t border-sea-foam/10 selection:bg-accent selection:text-nautical-black relative z-20 py-4 px-6"
    >
      <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
      <div className="w-full max-w-5xl mx-auto flex flex-col justify-around h-full py-4">
        <Newsletter locale={locale} />
        <HomeStats />

        <div className="container mx-auto px-6 flex flex-col items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-2 mb-4 group">
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl md:text-4xl text-sea-foam uppercase tracking-tight leading-none">
                GETXO <span className="italic font-light text-accent">BELA</span>
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-sea-foam/30 font-black mt-2">
                Escuela Náutica Oficial
              </span>
            </div>
          </div>

          {/* Horario, Contacto y Ubicación Column (+20% tamaño de fuente) */}
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-14 text-center md:text-left mb-8 text-[11px] sm:text-[12px] uppercase tracking-wider text-sea-foam/50 border-y border-sea-foam/10 py-6 w-full max-w-3xl">
            <div className="flex flex-col items-center md:items-start gap-2 flex-1">
              <div className="flex items-center gap-2 text-accent font-black text-[12px] sm:text-[13px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Horario</span>
              </div>
              <span className="text-sea-foam/75 font-semibold text-[11px] sm:text-[12px] leading-relaxed">Lunes a Domingo</span>
              <span className="text-sea-foam/75 font-semibold text-[11px] sm:text-[12px] leading-relaxed">09:00 — 20:00</span>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2 flex-1">
              <div className="flex items-center gap-2 text-accent font-black text-[12px] sm:text-[13px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Ubicación</span>
              </div>
              <span className="text-sea-foam/75 font-semibold text-[11px] sm:text-[12px] leading-relaxed">Muelle Arriluzea, s/n</span>
              <span className="text-sea-foam/75 font-semibold text-[11px] sm:text-[12px] leading-relaxed">48990 Getxo, Vizcaya</span>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2 flex-1">
              <div className="flex items-center gap-2 text-accent font-black text-[12px] sm:text-[13px]">
                <Phone className="w-3.5 h-3.5" />
                <span>Contacto</span>
              </div>
              <a href="tel:+34944916632" className="text-sea-foam/75 hover:text-white font-semibold text-[11px] sm:text-[12px] leading-relaxed transition-colors">(+34) 944 916 632</a>
              <a href="mailto:info@getxobelaeskola.com" className="text-sea-foam/75 hover:text-white font-semibold text-[11px] sm:text-[12px] leading-relaxed transition-colors lowercase tracking-normal">info@getxobelaeskola.com</a>
            </div>
          </div>

          <CollaboratorsGrid />

          {/* Legal Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-sea-foam/10 text-[9px] text-sea-foam/40">
            <div className="flex items-center gap-6">
              <Link href={`/${locale}/privacy`} className="hover:text-sea-foam transition-colors">
                Privacidad
              </Link>
              <Link href={`/${locale}/cookies`} className="hover:text-sea-foam transition-colors">
                Cookies
              </Link>
              <Link href={`/${locale}/declaracion-de-accesibilidad`} className="hover:text-sea-foam transition-colors">
                Accesibilidad
              </Link>
            </div>
            <div>© 2026 Getxo Bela Eskola · Experiencia Náutica Premium</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
