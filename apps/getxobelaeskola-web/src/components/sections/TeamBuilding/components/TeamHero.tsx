'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { revealUp, stagger } from '../../../../lib/corporateMotion';
import Image from 'next/image';

interface TeamHeroProps {
  onScrollToForm: () => void;
  onScrollToTimeline: () => void;
}

export default function TeamHero({ onScrollToForm, onScrollToTimeline }: TeamHeroProps) {
  const t = useTranslations('team_building.hero');

  const heroLines = [
    t('line1'),
    t('line2'),
    t('line3'),
    t('line4')
  ];

  const statPills = [
    t('pill1'),
    t('pill2'),
    t('pill3'),
    t('pill4')
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center bg-white pt-4 pb-12 md:pt-6 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Headings & Copy */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#005F8A] mb-6 block"
          >
            {t('eyebrow')}
          </motion.span>

          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="visible"
            className="mb-6"
          >
            {heroLines.map((line, i) => (
              <motion.span
                key={i}
                variants={revealUp}
                className="block text-4xl sm:text-6xl md:text-7xl font-serif text-[#0A1628] leading-[1.05] tracking-[-0.03em]"
              >
                {line}
              </motion.span>
            ))}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-600 max-w-xl mb-6 md:mb-8 leading-relaxed font-sans"
          >
            {t('description')}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 12px 40px rgba(201,168,76,0.35)"
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onScrollToForm}
              className="bg-[#C9A84C] text-[#0A1628] text-xs sm:text-sm md:text-base font-semibold tracking-wide rounded-full px-4 py-2.5 sm:px-8 sm:py-4 w-full sm:w-auto shadow-md transition-shadow duration-300"
            >
              {t('cta')}
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.5 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onScrollToTimeline}
              className="border-b border-[#0A1628] text-[#0A1628] hover:text-[#005F8A] hover:border-[#005F8A] font-semibold text-xs sm:text-sm md:text-base py-2 sm:py-4 px-2 sm:w-auto text-left self-start sm:self-center transition-colors duration-200"
            >
              {t('cta_sub')}
            </motion.button>
          </div>
        </div>

        {/* Right Column: Dynamic floating yacht image */}
        <div className="lg:col-span-6 relative flex justify-center w-full h-[380px] sm:h-[500px] lg:h-[580px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -10, 0, 8, 0],
              rotate: [0, 0.8, 0, -0.8, 0]
            }}
            transition={{ 
              opacity: { delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              scale: { delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.7 },
              rotate: { repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.7 }
            }}
            className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100"
          >
            <Image
              src="/images/team-building-j80-hero-20201129.jpg?v=4"
              alt="J80 sailboat under sail"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover sepia-[0.28] saturate-[1.18] contrast-[1.04] hue-rotate-[-8deg]"
            />
            {/* Rich Golden Hour Warmth overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-700/25 via-amber-500/15 to-orange-300/10 pointer-events-none mix-blend-soft-light" />
            <div className="absolute inset-0 bg-amber-500/10 pointer-events-none mix-blend-color-burn" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Stat pills container below */}
      <div className="max-w-7xl mx-auto w-full mt-8 md:mt-12">
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statPills.map((pill, idx) => (
            <motion.div
              key={idx}
              variants={revealUp}
              whileHover={{ y: -6, borderColor: "var(--horizon)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
              className="bg-white border border-gray-200 rounded-2xl p-5 text-center flex items-center justify-center font-semibold text-gray-700 hover:text-[#005F8A] text-sm md:text-base transition-all duration-300 shadow-sm"
              style={{ contentVisibility: 'auto' }}
            >
              {pill}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
