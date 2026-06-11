'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CONTRASTS } from '../data/teamBuildingData';

export default function SplitSection() {
  const t = useTranslations('team_building.split');
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false
  } as any);

  // Scroll animations mapping
  const leftWidth = useTransform(scrollYProgress, [0, 0.8, 0.95], ["50%", "50%", "0%"]);
  const rightWidth = useTransform(scrollYProgress, [0, 0.8, 0.95], ["50%", "50%", "100%"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.8, 0.92], [1, 1, 0]);
  const rightScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const scrolledLineOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);

  // Determine active contrast index based on scroll progress:
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) {
        setActiveIndex(0);
      } else if (latest < 0.66) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
  }, [scrollYProgress]);



  if (shouldReduce) {
    return (
      <section className="bg-white py-16 px-4 max-w-7xl mx-auto flex flex-col gap-10">
        <h2 className="text-3xl font-serif text-[#0A1628] text-center mb-6">
          {t('scrolled_line')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONTRASTS.map((item, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-2">
                  {t(`${item.key}.office_label`)}
                </span>
                <p className="text-lg text-gray-500 italic">
                  "{t(`${item.key}.office_phrase`)}"
                </p>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <span className="text-xs uppercase tracking-wider text-[#005F8A] font-semibold block mb-2">
                  {t(`${item.key}.sea_label`)}
                </span>
                <p className="text-xl text-[#0A1628] font-medium">
                  "{t(`${item.key}.sea_phrase`)}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop scroll animation (sticky container) */}
      <div className="hidden md:block">
        <section
          ref={containerRef}
          className="relative"
          style={{ height: '300vh' }}
        >
          <div 
            className="w-full flex overflow-hidden"
            style={{ position: 'sticky', top: 0, height: '100vh' }}
          >
            
            {/* LEFT PANEL: Office (Tierra) */}
            <motion.div
              style={{ width: leftWidth, opacity: leftOpacity }}
              className="relative h-full bg-[#F7F8FA] flex flex-col justify-center px-12 lg:px-24 select-none border-r border-gray-200"
            >
              <div className="max-w-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 block mb-3">
                      {t(`contrast${activeIndex + 1}.office_label`)}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-serif text-gray-500 leading-snug">
                      "{t(`contrast${activeIndex + 1}.office_phrase`)}"
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* RIGHT PANEL: Sea (Océano) */}
            <motion.div
              style={{ width: rightWidth }}
              className="relative h-full bg-[#005F8A] flex flex-col justify-center overflow-hidden"
            >
              {/* Background marine image with zoom effect */}
              <motion.div style={{ scale: rightScale }} className="absolute inset-0 z-0">
                <Image
                  src="/images/home-hero-sailing-action.webp"
                  alt="Sea background Abra"
                  fill
                  className="object-cover opacity-35 brightness-75 select-none"
                />
              </motion.div>

              <div className="relative max-w-lg px-12 lg:px-24 z-10 select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8D4E8] block mb-3">
                      {t(`contrast${activeIndex + 1}.sea_label`)}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-serif text-white leading-tight">
                      "{t(`contrast${activeIndex + 1}.sea_phrase`)}"
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Injected scrolled sentence: "The office no longer exists. Only the team." */}
              <motion.div 
                style={{ opacity: scrolledLineOpacity }}
                className="absolute bottom-16 left-12 lg:left-24 z-20"
              >
                <p className="text-[#B8D4E8] text-sm md:text-base font-medium tracking-wide">
                  {t('scrolled_line')}
                </p>
              </motion.div>
            </motion.div>

          </div>
        </section>
      </div>

      {/* Mobile version: stacked vertical cards instead of sticky horizontal widths */}
      <div className="block md:hidden bg-white py-16 px-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#005F8A] mb-4 block text-center">
          {t('scrolled_line')}
        </span>
        <div className="flex flex-col gap-8">
          {CONTRASTS.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 border border-gray-150 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400 block mb-1">
                  {t(`${item.key}.office_label`)}
                </span>
                <p className="text-base text-gray-500 italic">
                  "{t(`${item.key}.office_phrase`)}"
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#005F8A] block mb-1">
                  {t(`${item.key}.sea_label`)}
                </span>
                <p className="text-lg text-[#0A1628] font-medium">
                  "{t(`${item.key}.sea_phrase`)}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
