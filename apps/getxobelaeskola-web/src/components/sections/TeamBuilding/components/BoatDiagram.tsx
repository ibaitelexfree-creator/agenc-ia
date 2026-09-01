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
          <div className="hidden md:block">
            {/* 1. Proa (Bow) - Top Left Overlay */}
            <div className="absolute top-[32%] left-[4%] w-60 z-30 text-left">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#005F8A] text-white text-xs font-bold font-serif flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-sm">
                    {t('proa.label')}
                  </h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-2">
                  {t('proa.description')}
                </p>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                  {t('proa.skill')}
                </span>
              </div>
            </div>

            {/* 2. Timón (Helm) - Bottom Right Overlay */}
            <div className="absolute top-[48%] right-[4%] w-60 z-30 text-left">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#005F8A] text-white text-xs font-bold font-serif flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-sm">
                    {t('timon.label')}
                  </h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-2">
                  {t('timon.description')}
                </p>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                  {t('timon.skill')}
                </span>
              </div>
            </div>

            {/* 3. Vela Mayor (Mainsail) - Top Right/Center Overlay */}
            <div className="absolute top-[8%] left-[22%] w-64 z-30 text-left">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#005F8A] text-white text-xs font-bold font-serif flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-sm">
                    {t('vela_mayor.label')}
                  </h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-2">
                  {t('vela_mayor.description')}
                </p>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                  {t('vela_mayor.skill')}
                </span>
              </div>
            </div>

            {/* 4. Winches (Winches) - Bottom Center/Right Overlay */}
            <div className="absolute bottom-[6%] left-[48%] w-64 z-30 text-left">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#005F8A] text-white text-xs font-bold font-serif flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-sm">
                    {t('winch.label')}
                  </h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-2">
                  {t('winch.description')}
                </p>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                  {t('winch.skill')}
                </span>
              </div>
            </div>

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

          {/* Mobile Overlay Cards Grid (Directly inside graphic container on small screens) */}
          <div className="block md:hidden z-30 w-full grid grid-cols-1 gap-3 mt-4 text-left">
            {J80_POINTS.map((point, idx) => (
              <div
                key={point.id}
                className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3.5 shadow-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#005F8A] text-white text-[11px] font-bold font-serif flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-[#0A1628] font-bold text-xs">
                    {t(`${point.key}.label`)}
                  </h3>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed mb-2">
                  {t(`${point.key}.description`)}
                </p>
                <span className="text-[9px] font-semibold px-2 py-0.5 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
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
