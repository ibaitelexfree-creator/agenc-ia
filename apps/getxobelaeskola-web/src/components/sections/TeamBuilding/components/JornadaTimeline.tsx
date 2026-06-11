'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useStickyScroll } from '../../../../hooks/useStickyScroll';
import { JORNADA } from '../data/teamBuildingData';

export default function JornadaTimeline() {
  const t = useTranslations('team_building.jornada');
  const shouldReduce = useReducedMotion();


  const { ref, scrollYProgress } = useStickyScroll(JORNADA.length);
  const x = useTransform(scrollYProgress, (progress) => `calc(-1 * (100% - 100vw + 10vw) * ${progress})`);



  // Reduced motion or Mobile view: render simple vertical timeline
  if (shouldReduce) {
    return (
      <section className="bg-white py-16 px-6 max-w-4xl mx-auto select-none">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-[#0A1628] mb-2">
            {t('title')}
          </h2>
          <span className="text-[#005F8A] font-semibold text-sm tracking-wider uppercase">
            {t('subtitle')}
          </span>
        </div>

        <div className="relative border-l border-gray-200 ml-4 pl-8 flex flex-col gap-10">
          {JORNADA.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Point Circle */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#005F8A] flex items-center justify-center text-xs font-bold text-[#005F8A]">
                {idx + 1}
              </div>
              <div className="bg-[#F7F8FA] rounded-2xl p-6 shadow-sm border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-[#005F8A] tracking-widest block mb-1">
                  {t(`${step.key}.fase`)} ({step.faseKey === 'land' ? t('land') : t('sea')})
                </span>
                <h4 className="text-xl font-bold text-[#0A1628] mb-2">
                  {t(`${step.key}.title`)}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {t(`${step.key}.desc`)}
                </p>
                <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full inline-block">
                  ⏱ {t(`${step.key}.duration`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop Sticky horizontal slider (400vh scroll height) */}
      <div className="hidden md:block">
        <section
          ref={ref}
          className="relative h-[400vh]"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-white select-none">
            
            {/* Header section over horizontal layout */}
            <div className="absolute top-12 left-12 z-20 text-left">
              <h2 className="text-4xl font-serif text-[#0A1628] mb-1">
                {t('title')}
              </h2>
              <span className="text-[#005F8A] text-sm font-semibold tracking-wider uppercase block">
                {t('subtitle')}
              </span>
            </div>

            {/* Top Scroll Progress Bar */}
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute top-0 left-0 w-full h-[6px] bg-[#005F8A] origin-left z-30"
            />

            {/* Slider cards wrapper */}
            <motion.div
              style={{
                display: 'flex',
                width: 'max-content',
                height: '100%',
                alignItems: 'center',
                paddingLeft: '10vw',
                x
              }}
            >
              {JORNADA.map((step, idx) => {
                const isSea = step.faseKey === 'sea';
                return (
                  <div
                    key={idx}
                    className="w-[80vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0 px-6 h-[55vh]"
                  >
                    <motion.div
                      whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.12)" }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-full h-full rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-lg border border-gray-200/50"
                      style={{
                        backgroundColor: step.color,
                        color: isSea ? '#0A1628' : '#374151'
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <span className={`text-[10px] uppercase font-bold tracking-[0.2em] px-3.5 py-1 rounded-full ${
                            isSea ? 'bg-[#005F8A] text-white' : 'bg-gray-200/70 text-gray-700'
                          }`}>
                            {t(`${step.key}.fase`)}
                          </span>
                          <span className="text-3xl font-serif opacity-30 text-[#005F8A]">
                            0{idx + 1}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif text-[#0A1628] mb-4">
                          {t(`${step.key}.title`)}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed font-sans">
                          {t(`${step.key}.desc`)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200/60 pt-6">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          ⏱ {t(`${step.key}.duration`)}
                        </span>
                        {step.optional && (
                          <span className="text-[10px] font-bold text-[#005F8A] border border-[#005F8A] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                            Opcional
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

          </div>
        </section>
      </div>

      {/* Mobile view (automatic fallback for smaller screens) */}
      <div className="block md:hidden bg-white py-16 px-6 select-none">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif text-[#0A1628] mb-1">
            {t('title')}
          </h2>
          <span className="text-[#005F8A] font-semibold text-xs tracking-wider uppercase block">
            {t('subtitle')}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {JORNADA.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 border border-gray-250 flex flex-col justify-between shadow-sm"
              style={{ backgroundColor: step.color }}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[9px] uppercase font-bold tracking-[0.18em] px-2.5 py-0.5 rounded-full ${
                    step.faseKey === 'sea' ? 'bg-[#005F8A] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {t(`${step.key}.fase`)}
                  </span>
                  <span className="text-xl font-serif opacity-30 text-[#005F8A]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0A1628] mb-2">
                  {t(`${step.key}.title`)}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t(`${step.key}.desc`)}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                <span className="text-xs font-semibold text-gray-500">
                  ⏱ {t(`${step.key}.duration`)}
                </span>
                {step.optional && (
                  <span className="text-[9px] font-bold text-[#005F8A] border border-[#005F8A] px-2 py-0.5 rounded-md uppercase">
                    Opcional
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
