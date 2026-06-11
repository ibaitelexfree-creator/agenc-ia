'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TRANSFERENCIAS } from '../data/teamBuildingData';
import { revealLeft, revealRight, stagger } from '../../../../lib/corporateMotion';

export default function AprendizajeMap() {
  const t = useTranslations('team_building.aprendizaje');

  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#005F8A] mb-4 block">
            {t('eyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#0A1628] leading-tight max-w-2xl mx-auto">
            {t('title')}
          </h2>
        </div>

        {/* Transfer Grid / Interactive Connector Layout */}
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-6 md:gap-8 mb-24 max-w-3xl mx-auto"
        >
          {TRANSFERENCIAS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between w-full relative">
              
              {/* LEFT CARD (Sea Situation) */}
              <motion.div
                variants={revealLeft}
                className="w-[42%] bg-[#F7F8FA] border border-gray-150 rounded-2xl p-4 md:p-5 flex items-center gap-3 shadow-sm hover:border-[#005F8A]/40 transition-colors duration-300"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider mb-0.5">MAR</span>
                  <p className="text-xs md:text-sm font-semibold text-[#0A1628]">
                    {t(`${item.key}.mar`)}
                  </p>
                </div>
              </motion.div>

              {/* CONNECTING ANIMATED SVG LINE */}
              <div className="w-[16%] flex justify-center items-center h-full absolute left-[42%]">
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 20" fill="none">
                  <motion.path
                    d="M 10 10 L 90 10"
                    stroke="#B8D4E8"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                  />
                  <motion.circle
                    cx="90"
                    cy="10"
                    r="4"
                    fill="#005F8A"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.6 }}
                  />
                </svg>
              </div>

              {/* RIGHT CARD (Business Mirror) */}
              <motion.div
                variants={revealRight}
                className="w-[42%] bg-[#EBF5FB] border border-[#B8D4E8]/40 rounded-2xl p-4 md:p-5 flex items-center gap-3 shadow-sm hover:border-[#005F8A]/35 transition-colors duration-300"
              >
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#005F8A] block tracking-wider mb-0.5">TRABAJO</span>
                  <p className="text-xs md:text-sm font-semibold text-[#0A1628]">
                    {t(`${item.key}.trabajo`)}
                  </p>
                </div>
              </motion.div>

            </div>
          ))}
        </motion.div>

        {/* Closing Quote Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#0A1628] text-white p-8 md:p-12 text-center shadow-xl overflow-hidden"
        >
          {/* Top subtle wave texture */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-950/20 to-transparent pointer-events-none" />
          
          <span className="absolute top-2 left-6 text-[8rem] font-serif text-[#B8D4E8] opacity-10 pointer-events-none select-none">
            “
          </span>
          <p className="relative text-lg md:text-2xl font-serif text-[#B8D4E8] leading-relaxed max-w-3xl mx-auto z-10 mb-6 italic">
            "{t('quote')}"
          </p>
          <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest block">
            — Getxo Bela Eskola
          </span>
        </motion.div>

      </div>
    </section>
  );
}
