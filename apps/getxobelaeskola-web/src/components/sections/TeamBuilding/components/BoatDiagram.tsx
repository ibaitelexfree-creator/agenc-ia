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

        {/* Sailboat Graphic Container */}
        <div className="relative max-w-4xl mx-auto aspect-[16/10] bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 md:p-12 flex flex-col justify-center items-center">
          
          {/* Custom vector J80 Sailboat SVG */}
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full text-slate-300 pointer-events-none"
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
          </svg>

          {/* Interactive hotspot dots */}
          {J80_POINTS.map((point, idx) => {
            const isActive = activePoint?.id === point.id;
            return (
              <div
                key={point.id}
                style={{ left: point.position.x, top: point.position.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
              >
                {/* Pulse Glow Effect */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
                  className="absolute inset-0 rounded-full bg-[#005F8A] pointer-events-none"
                  style={{ width: '48px', height: '48px', margin: '-12px 0 0 -12px' }}
                />

                {/* Hotspot Trigger Button */}
                <motion.button
                  whileHover={{ scale: 1.25 }}
                  onClick={() => setActivePoint(isActive ? null : point)}
                  onMouseEnter={() => setActivePoint(point)}
                  onMouseLeave={() => setActivePoint(null)}
                  className={`w-8 h-8 rounded-full border-2 text-xs font-bold transition-colors duration-300 flex items-center justify-center cursor-pointer shadow-md ${
                    isActive
                      ? 'bg-[#005F8A] border-[#005F8A] text-white'
                      : 'bg-white border-[#0A1628] text-[#0A1628]'
                  }`}
                  aria-label={`Show info for ${t(`${point.key}.label`)}`}
                >
                  {idx + 1}
                </motion.button>

                {/* Interactive Tooltip Card (Desktop Hover) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      variants={popIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-none w-64 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl text-left z-40 hidden md:block"
                    >
                      <h4 className="text-[#0A1628] font-bold text-base mb-2 flex items-center gap-2">
                        <span className="text-xs text-[#005F8A] bg-[#EBF5FB] w-5 h-5 rounded-full flex items-center justify-center font-serif">
                          {idx + 1}
                        </span>
                        {t(`${point.key}.label`)}
                      </h4>
                      <p className="text-gray-500 text-xs leading-relaxed mb-3 font-sans">
                        {t(`${point.key}.description`)}
                      </p>
                      <span className="text-[10px] font-semibold px-3 py-1 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block tracking-wide">
                        {t(`${point.key}.skill`)}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mobile Info Panel (shows active hotspot description below diagram) */}
        <div className="mt-8 block md:hidden min-h-[140px] px-4">
          <AnimatePresence mode="wait">
            {activePoint ? (
              <motion.div
                key={activePoint.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md text-left max-w-md mx-auto"
              >
                <h4 className="text-[#0A1628] font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-xs text-white bg-[#005F8A] w-6 h-6 rounded-full flex items-center justify-center font-serif">
                    {J80_POINTS.findIndex(p => p.id === activePoint.id) + 1}
                  </span>
                  {t(`${activePoint.key}.label`)}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {t(`${activePoint.key}.description`)}
                </p>
                <span className="text-xs font-semibold px-3 py-1 bg-[#EBF5FB] text-[#005F8A] rounded-full inline-block">
                  {t(`${activePoint.key}.skill`)}
                </span>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic py-8 border border-dashed border-gray-300 rounded-2xl max-w-md mx-auto">
                Toca cualquier número del velero para ver sus funciones
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
