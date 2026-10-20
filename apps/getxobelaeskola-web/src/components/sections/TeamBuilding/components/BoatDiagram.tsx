'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { J80_POINTS, BoatPointConfig } from '../data/teamBuildingData';
import { popIn } from '../../../../lib/corporateMotion';

export default function BoatDiagram() {
  const t = useTranslations('team_building.diagram');
  const [activePoint, setActivePoint] = useState<BoatPointConfig | null>(null);

  return (
    <section className="bg-[#F7F8FA] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-y border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#005F8A] mb-4 block">
          {t('eyebrow')}
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#0A1628] max-w-2xl mx-auto mb-16 leading-tight">
          {t('title')}
        </h2>

        {/* Sailboat Graphic Container with Floating Text Overlay Cards */}
        <div className="relative max-w-5xl mx-auto min-h-[580px] md:min-h-[640px] bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-4 md:p-8 flex flex-col justify-center items-center">
          
          {/* Custom vector J80 Sailboat SVG Background */}
          <motion.svg
            animate={{
              y: [0, -7, 0, 6, 0],
              rotate: [0, 0.6, 0, -0.6, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            viewBox="0 0 800 500"
            className="w-full h-full text-slate-300 pointer-events-none opacity-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Water Line */}
            <path d="M 50,420 Q 200,418 400,420 T 750,420" stroke="var(--horizon)" strokeWidth="3" />
            
            {/* Hull & Keel */}
            <path d="M 160,390 L 680,390 L 640,410 L 190,410 Z" fill="#F7F8FA" stroke="#0A1628" strokeWidth="3" />
            <path d="M 400,410 L 415,450 L 450,450 L 440,410 Z" fill="#0A1628" stroke="#0A1628" strokeWidth="2" />
            
            {/* Mast & Rigging */}
            <line x1="430" y1="390" x2="430" y2="80" stroke="#0A1628" strokeWidth="4" />
            <line x1="430" y1="80" x2="670" y2="390" stroke="#7F8C8D" strokeWidth="1.5" /> {/* Forestay */}
            <line x1="430" y1="80" x2="165" y2="390" stroke="#7F8C8D" strokeWidth="1.5" /> {/* Backstay */}
            <line x1="430" y1="230" x2="190" y2="390" stroke="#0A1628" strokeWidth="3.5" /> {/* Boom */}

            {/* Mainsail */}
            <path d="M 430,95 L 430,375 Q 310,380 200,378 Q 330,220 430,95 Z" fill="#005F8A" fillOpacity="0.08" stroke="#0A1628" strokeWidth="2.5" />
            
            {/* Jib / Genoa */}
            <path d="M 445,110 L 635,375 Q 530,370 445,370 Z" fill="#B8D4E8" fillOpacity="0.15" stroke="#005F8A" strokeWidth="2" />

            {/* Rudder / Tiller */}
            <path d="M 175,390 L 170,430 L 155,425 Z" fill="#7F8C8D" />
            <line x1="170" y1="390" x2="200" y2="380" stroke="#0A1628" strokeWidth="3" />
          </motion.svg>

          {/* Desktop & Tablet Floating Overlay Cards directly on top of the image */}
          {/* Desktop & Tablet Floating Overlay Cards directly on top of the image */}
          <div className="hidden md:block">
            {/* 1. Proa (Bow) - Top Left Cloud Overlay */}
            <motion.div 
              animate={{ y: [0, -5, 0, 5, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[30%] left-[3%] w-[245px] z-30 text-left"
            >
              <div 
                className="bg-white/95 backdrop-blur-md border border-sky-100/90 p-4 shadow-[0_12px_32px_rgba(0,95,138,0.12)] hover:shadow-[0_18px_40px_rgba(0,95,138,0.22)] transition-all duration-300 relative group"
                style={{ borderRadius: '30px 22px 28px 18px' }}
              >
                {/* Cloud Puffs */}
                <div className="absolute -top-3 left-6 w-7 h-7 bg-white/95 rounded-full border-t border-l border-sky-100/80 pointer-events-none" />
                <div className="absolute -top-2.5 left-12 w-5.5 h-5.5 bg-white/95 rounded-full border-t border-sky-100/80 pointer-events-none" />
                <div className="absolute -bottom-2 right-8 w-5.5 h-5.5 bg-white/95 rounded-full border-b border-r border-sky-100/80 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center shadow-sm">
                      1
                    </span>
                    <h3 className="text-[#0A1628] font-bold text-[13.5px]">
                      {t('proa.label')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[11.5px] leading-relaxed mb-2">
                    {t('proa.description')}
                  </p>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                    {t('proa.skill')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 2. Timón (Helm) - Bottom Right Cloud Overlay */}
            <motion.div 
              animate={{ y: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[46%] right-[3%] w-[245px] z-30 text-left"
            >
              <div 
                className="bg-white/95 backdrop-blur-md border border-sky-100/90 p-4 shadow-[0_12px_32px_rgba(0,95,138,0.12)] hover:shadow-[0_18px_40px_rgba(0,95,138,0.22)] transition-all duration-300 relative group"
                style={{ borderRadius: '22px 30px 18px 28px' }}
              >
                {/* Cloud Puffs */}
                <div className="absolute -top-3 right-8 w-7 h-7 bg-white/95 rounded-full border-t border-r border-sky-100/80 pointer-events-none" />
                <div className="absolute -top-2.5 right-14 w-5.5 h-5.5 bg-white/95 rounded-full border-t border-sky-100/80 pointer-events-none" />
                <div className="absolute -bottom-2 left-6 w-5.5 h-5.5 bg-white/95 rounded-full border-b border-l border-sky-100/80 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center shadow-sm">
                      2
                    </span>
                    <h3 className="text-[#0A1628] font-bold text-[13.5px]">
                      {t('timon.label')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[11.5px] leading-relaxed mb-2">
                    {t('timon.description')}
                  </p>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                    {t('timon.skill')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 3. Vela Mayor (Mainsail) - Top Center Cloud Overlay */}
            <motion.div 
              animate={{ y: [0, -6, 0, 4, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[6%] left-[21%] w-[245px] z-30 text-left"
            >
              <div 
                className="bg-white/95 backdrop-blur-md border border-sky-100/90 p-4 shadow-[0_12px_32px_rgba(0,95,138,0.12)] hover:shadow-[0_18px_40px_rgba(0,95,138,0.22)] transition-all duration-300 relative group"
                style={{ borderRadius: '28px 18px 30px 22px' }}
              >
                {/* Cloud Puffs */}
                <div className="absolute -top-3 left-10 w-8 h-8 bg-white/95 rounded-full border-t border-l border-sky-100/80 pointer-events-none" />
                <div className="absolute -top-2.5 left-18 w-5.5 h-5.5 bg-white/95 rounded-full border-t border-sky-100/80 pointer-events-none" />
                <div className="absolute -bottom-2 right-10 w-5.5 h-5.5 bg-white/95 rounded-full border-b border-r border-sky-100/80 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center shadow-sm">
                      3
                    </span>
                    <h3 className="text-[#0A1628] font-bold text-[13.5px]">
                      {t('vela_mayor.label')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[11.5px] leading-relaxed mb-2">
                    {t('vela_mayor.description')}
                  </p>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                    {t('vela_mayor.skill')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 4. Winches (Winches) - Bottom Center Cloud Overlay */}
            <motion.div 
              animate={{ y: [0, 4, 0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[4%] left-[47%] w-[245px] z-30 text-left"
            >
              <div 
                className="bg-white/95 backdrop-blur-md border border-sky-100/90 p-4 shadow-[0_12px_32px_rgba(0,95,138,0.12)] hover:shadow-[0_18px_40px_rgba(0,95,138,0.22)] transition-all duration-300 relative group"
                style={{ borderRadius: '18px 28px 22px 30px' }}
              >
                {/* Cloud Puffs */}
                <div className="absolute -top-3 left-8 w-7 h-7 bg-white/95 rounded-full border-t border-l border-sky-100/80 pointer-events-none" />
                <div className="absolute -top-2.5 left-14 w-5.5 h-5.5 bg-white/95 rounded-full border-t border-sky-100/80 pointer-events-none" />
                <div className="absolute -bottom-2 left-6 w-5.5 h-5.5 bg-white/95 rounded-full border-b border-l border-sky-100/80 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5.5 h-5.5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center shadow-sm">
                      4
                    </span>
                    <h3 className="text-[#0A1628] font-bold text-[13.5px]">
                      {t('winch.label')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[11.5px] leading-relaxed mb-2">
                    {t('winch.description')}
                  </p>
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                    {t('winch.skill')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Hotspot Pulse Dots */}
            {J80_POINTS.map((point, idx) => (
              <div
                key={point.id}
                style={{ left: point.position.x, top: point.position.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <div className="w-4 h-4 rounded-full bg-[#005F8A] animate-ping opacity-75" />
              </div>
            ))}
          </div>

          {/* Mobile Overlay Cards Grid */}
          <div className="block md:hidden z-30 w-full grid grid-cols-1 gap-3.5 mt-4 text-left">
            {J80_POINTS.map((point, idx) => (
              <div
                key={point.id}
                className="bg-white/95 backdrop-blur-sm border border-sky-100 p-4 shadow-md relative"
                style={{ borderRadius: idx % 2 === 0 ? '24px 18px 22px 16px' : '18px 24px 16px 22px' }}
              >
                <div className="absolute -top-2 left-5 w-5 h-5 bg-white/95 rounded-full border-t border-l border-sky-100 pointer-events-none" />
                <div className="flex items-center gap-2 mb-1 relative z-10">
                  <span className="w-5 h-5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-xs">
                    {t(`${point.key}.label`)}
                  </h3>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed mb-2 relative z-10">
                  {t(`${point.key}.description`)}
                </p>
                <span className="text-[9px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block relative z-10">
                  {t(`${point.key}.skill`)}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
