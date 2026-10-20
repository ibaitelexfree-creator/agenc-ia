// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\ChillOutSection.tsx
'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from '../CelebraTuDia.module.css';

export default function ChillOutSection() {
  const t = useTranslations('guarda_material.closing') as any; // Using existing closing translation keys if applicable, or we can use celebra_dia keys
  const celebraT = useTranslations('celebra_dia') as any;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [showCat, setShowCat] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
    layoutEffect: false
  } as any);

  // Grass parallax movement
  const bgY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0px', '0px'] : ['-40px', '40px']);

  // Music notes animation variants
  const noteVariants = (delay: number) => ({
    animate: {
      y: [0, -80, -120],
      x: [0, 15, -15, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeOut' as const,
        delay
      }
    }
  });

  return (
    <section ref={sectionRef} className={styles.chillOutSection}>
      {/* Parallax background grass texture */}
      <motion.div
        className={styles.chillOutBg}
        style={{ y: bgY }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <pattern id="grass" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 10,40 L 12,20 L 15,40" stroke="#52A440" strokeWidth="2" fill="none" />
            <path d="M 25,40 L 28,15 L 32,40" stroke="#52A440" strokeWidth="2.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grass)" />
        </svg>
      </motion.div>

      <div className={styles.chillOutContent}>
        {/* Toldo Awning swaying */}
        <motion.div
          className={styles.toldo}
          animate={prefersReducedMotion ? {} : {
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <svg viewBox="0 0 160 50" className="w-full h-auto">
            {/* Awning stripes red/white */}
            <path d="M0,0 L160,0 L160,30 C160,40 140,40 140,30 C140,40 120,40 120,30 C120,40 100,40 100,30 C100,40 80,40 80,30 C80,40 60,40 60,30 C60,40 40,40 40,30 C40,40 20,40 20,30 C20,40 0,40 0,30 Z" fill="#EF6351" />
            {/* White stripes overlay */}
            <path d="M20,0 L40,0 L40,30 C40,40 20,40 20,30 Z" fill="#FAFAFA" />
            <path d="M60,0 L80,0 L80,30 C80,40 60,40 60,30 Z" fill="#FAFAFA" />
            <path d="M100,0 L120,0 L120,30 C120,40 100,40 100,30 Z" fill="#FAFAFA" />
            <path d="M140,0 L160,0 L160,30 C160,40 140,40 140,30 Z" fill="#FAFAFA" />
            {/* Outline border */}
            <path d="M0,0 L160,0 L160,30 C160,40 140,40 140,30 C140,40 120,40 120,30 C120,40 100,40 100,30 C100,40 80,40 80,30 C80,40 60,40 60,30 C60,40 40,40 40,30 C40,40 20,40 20,30 C20,40 0,40 0,30 Z" fill="none" stroke="#0D2B45" strokeWidth="2" />
          </svg>
        </motion.div>

        <span className={styles.heroEyebrow} style={{ color: '#FFD166' }}>
          CHILL OUT
        </span>

        {/* Sofa / Chill Out Image */}
        <div className={styles.chillSceneIllust}>
          <Image
            src="/images/chill-out.png"
            alt="Chill Out Zone"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-2xl shadow-xl border-4 border-white/20"
          />

          {/* Floating musical notes */}
          {!prefersReducedMotion && (
            <>
              <motion.span className={styles.musicNote} style={{ left: '5%', top: '-5%' }} variants={noteVariants(0)} animate="animate">♩</motion.span>
              <motion.span className={styles.musicNote} style={{ left: '90%', top: '-10%' }} variants={noteVariants(1.2)} animate="animate">♪</motion.span>
              <motion.span className={styles.musicNote} style={{ left: '50%', top: '-15%' }} variants={noteVariants(2.4)} animate="animate">♫</motion.span>
            </>
          )}
        </div>

        <p className={styles.chillText}>
          {celebraT('cards.chill_desc')}
        </p>
      </div>
    </section>
  );
}
