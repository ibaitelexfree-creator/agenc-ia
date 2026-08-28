// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\ScenaPanoramica.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from '../CelebraTuDia.module.css';

export default function ScenaPanoramica() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [girlFell, setGirlFell] = useState(false);
  const [dogBarked, setDogBarked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    layoutEffect: false
  } as any);

  // Parallax offsets
  const skyX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-30, 30]);
  const hillsX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-60, 60]);
  const seaX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-90, 90]);

  // Web Audio API Bark Sound
  const playBark = () => {
    if (dogBarked) return;
    setDogBarked(true);
    setTimeout(() => setDogBarked(false), 800);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First high pitch bark node
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);

      // Second double bark
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);
        gain2.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.12);
      }, 180);

    } catch (e) {
      // AudioContext fails silently if blocked or unsupported
    }
  };

  const handleGirlClick = () => {
    if (prefersReducedMotion) return;
    setGirlFell(true);
    setTimeout(() => {
      setGirlFell(false);
    }, 4000);
  };

  return (
    <section ref={containerRef} className={styles.panoramicScene} aria-label="Escena marítima interactiva">
      <div className={styles.panoramicSceneInner}>
        {/* 1. SKY LAYER (Parallax background) */}
        <motion.div className={`${styles.parallaxLayer} ${styles.skyBg}`} style={{ x: skyX }} />

        {/* 2. HILLS LAYER (Parallax mid) */}
        <motion.div className={styles.parallaxLayer} style={{ x: hillsX }}>
          <svg viewBox="0 0 1600 550" className={styles.svgIcon} preserveAspectRatio="xMidYMid slice">
            {/* Mountains of Getxo Abra */}
            <path d="M 0,420 Q 300,320 600,400 T 1200,380 T 1600,410 L 1600,550 L 0,550 Z" fill="#93C5FD" opacity="0.4" />
            <path d="M 0,440 Q 400,370 800,430 T 1600,420 L 1600,550 L 0,550 Z" fill="#60A5FA" opacity="0.3" />
          </svg>
        </motion.div>

        {/* 3. SEA LAYER (Parallax bottom & animated waves) */}
        <motion.div className={styles.parallaxLayer} style={{ x: seaX }}>
          <svg viewBox="0 0 1600 550" className={styles.svgIcon} preserveAspectRatio="xMidYMid slice">
            {/* Back Wave (dusk blue tint) */}
            <motion.path
              fill="#187EB8"
              opacity="0.7"
              animate={prefersReducedMotion ? {} : {
                d: [
                  "M 0,440 C 350,420 750,460 1150,430 C 1400,415 1500,445 1600,430 L 1600,550 L 0,550 Z",
                  "M 0,430 C 400,450 800,420 1200,450 C 1450,435 1520,420 1600,440 L 1600,550 L 0,550 Z",
                  "M 0,440 C 350,420 750,460 1150,430 C 1400,415 1500,445 1600,430 L 1600,550 L 0,550 Z"
                ]
              }}
              transition={prefersReducedMotion ? {} : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Main Sea Wave */}
            <motion.path
              fill="#1B8FCF"
              animate={prefersReducedMotion ? {} : {
                d: [
                  "M 0,450 C 400,430 800,470 1200,440 C 1400,425 1500,450 1600,440 L 1600,550 L 0,550 Z",
                  "M 0,460 C 350,480 750,430 1150,460 C 1350,445 1550,430 1600,450 L 1600,550 L 0,550 Z",
                  "M 0,445 C 450,425 850,460 1250,435 C 1450,420 1520,455 1600,435 L 1600,550 L 0,550 Z",
                  "M 0,450 C 400,430 800,470 1200,440 C 1400,425 1500,450 1600,440 L 1600,550 L 0,550 Z"
                ]
              }}
              transition={prefersReducedMotion ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Wave Crest Highlights / Foam */}
            <motion.path
              stroke="#BAE6FD"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              animate={prefersReducedMotion ? {} : {
                d: [
                  "M 0,452 C 400,432 800,472 1200,442 C 1400,427 1500,452 1600,442",
                  "M 0,462 C 350,482 750,432 1150,462 C 1350,447 1550,432 1600,452",
                  "M 0,447 C 450,427 850,467 1250,437 C 1450,422 1520,457 1600,437",
                  "M 0,452 C 400,432 800,472 1200,442 C 1400,427 1500,452 1600,442"
                ]
              }}
              transition={prefersReducedMotion ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        {/* 4. SCENE CHARACTERS & OBJECTS INLINE SVG CANVAS */}
        <svg viewBox="0 0 1600 550" className={`${styles.parallaxLayer} ${styles.parallaxLayerInteractive} ${styles.svgIcon}`} preserveAspectRatio="xMidYMid slice">
          
          {/* CHARACTER 3: Waving boat (J80 style) - translates across and bobs gracefully on sea water */}
          <motion.g
            animate={prefersReducedMotion ? {} : {
              x: [-200, 1800],
              y: [0, -5, 3, -2, 0],
              rotate: [-4, 3, -3, 2, -4]
            }}
            transition={prefersReducedMotion ? {} : {
              x: { duration: 24, repeat: Infinity, ease: 'linear' },
              y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            {/* Sailing Boat */}
            <g transform="translate(0, 395) scale(1.1)">
              {/* Hull submerged slightly into water line */}
              <path d="M 10,60 L 90,60 L 110,40 L 0,40 Z" fill="#FAFAFA" stroke="#0D2B45" strokeWidth="2.5" />
              <path d="M 20,40 L 40,10 L 40,40 Z" fill="#EF6351" stroke="#0D2B45" strokeWidth="2" /> {/* Sail */}
              <path d="M 43,40 L 75,2 L 43,2 Z" fill="#FFD166" stroke="#0D2B45" strokeWidth="2" /> {/* Big Sail */}
              <line x1="42" y1="0" x2="42" y2="40" stroke="#0D2B45" strokeWidth="3" /> {/* Mast */}
              {/* 3 People waving inside */}
              <circle cx="28" cy="35" r="5" fill="#EF6351" stroke="#0D2B45" strokeWidth="1.5" />
              <circle cx="48" cy="33" r="5" fill="#F5E6C8" stroke="#0D2B45" strokeWidth="1.5" />
              <circle cx="63" cy="35" r="5" fill="#6BBF59" stroke="#0D2B45" strokeWidth="1.5" />
            </g>
          </motion.g>

          {/* CHARACTER 1: Girl on Big SUP (falls/drips back on click) */}
          <g transform="translate(250, 431)">
            <motion.g
              animate={prefersReducedMotion ? {} : (girlFell ? {
                y: [0, 80, 80, -20, 0],
                rotate: [0, 90, 90, -10, 0],
                opacity: [1, 0, 0, 1, 1]
              } : {
                y: [0, -8, 0],
                rotate: [0, -2, 2, 0]
              })}
              transition={girlFell ? { duration: 3.5, times: [0, 0.25, 0.65, 0.85, 1], ease: 'easeInOut' } : {
                duration: 3.2, repeat: Infinity, ease: 'easeInOut'
              }}
              onClick={handleGirlClick}
              style={{ cursor: 'pointer' }}
            >
              {/* Big SUP Board */}
              <path d="M -50,15 C -20,10 20,10 50,15 L 45,25 L -45,25 Z" fill="#FFD166" stroke="#0D2B45" strokeWidth="2" />
              
              {/* Girl Figure */}
              <g transform="translate(0, -35)">
                <circle cx="0" cy="-20" r="10" fill="#EF6351" stroke="#0D2B45" strokeWidth="2" /> {/* Head */}
                <path d="M -8,-10 L 8,-10 L 12,15 L -12,15 Z" fill="#6BBF59" stroke="#0D2B45" strokeWidth="2" /> {/* Body */}
                <motion.line 
                  x1="-8" y1="-5" x2="-22" y2="-18" 
                  stroke="#0D2B45" strokeWidth="2" strokeLinecap="round"
                  animate={girlFell ? {} : { rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                /> {/* Arm Left */}
                <motion.line 
                  x1="8" y1="-5" x2="22" y2="-18" 
                  stroke="#0D2B45" strokeWidth="2" strokeLinecap="round"
                  animate={girlFell ? {} : { rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                /> {/* Arm Right */}
              </g>
            </motion.g>

            {/* Splash ring when she falls */}
            {girlFell && (
              <motion.ellipse
                cx="0" cy="18" rx="25" ry="8"
                stroke="#FAFAFA" strokeWidth="3" fill="none"
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.7 }}
              />
            )}
          </g>

          {/* CHARACTER 2: Boy falling in loop */}
          <g transform="translate(600, 420)">
            <motion.g
              animate={prefersReducedMotion ? {} : {
                y: [0, 20, 65, 65, 0],
                rotate: [0, 45, 180, 180, 0],
                opacity: [1, 1, 0, 0, 1]
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.35, 0.9, 1]
              }}
            >
              {/* Paddle board details */}
              <ellipse cx="0" cy="20" rx="35" ry="8" fill="#1B8FCF" stroke="#0D2B45" strokeWidth="2" />
              
              {/* Boy Tumbled figure */}
              <g transform="translate(0, -25)">
                <circle cx="0" cy="-15" r="9" fill="#0D2B45" stroke="#FAFAFA" strokeWidth="1.5" />
                <path d="M-6,-6 L6,-6 L10,12 L-10,12 Z" fill="#EF6351" stroke="#0D2B45" strokeWidth="2" />
                <line x1="-12" y1="5" x2="-20" y2="25" stroke="#0D2B45" strokeWidth="2" />
                <line x1="12" y1="5" x2="20" y2="25" stroke="#0D2B45" strokeWidth="2" />
              </g>
            </motion.g>
            {/* Splash rings */}
            <motion.ellipse
              cx="0" cy="22" rx="20" ry="6"
              stroke="#FAFAFA" strokeWidth="2.5" fill="none"
              animate={prefersReducedMotion ? {} : { scale: [0.5, 2.5], opacity: [1, 0] }}
              transition={prefersReducedMotion ? {} : { duration: 6, repeat: Infinity, times: [0.25, 0.45], ease: 'easeOut' }}
            />
          </g>

          {/* CHARACTER 5: Dog with Donut Floater */}
          <g transform="translate(950, 435)">
            <motion.g
              animate={prefersReducedMotion ? {} : {
                y: [0, -5, 0]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              onClick={playBark}
              style={{ cursor: 'pointer' }}
            >
              {/* Orange Donut Floater */}
              <ellipse cx="0" cy="18" rx="22" ry="9" fill="#EF6351" stroke="#0D2B45" strokeWidth="2.5" />
              <ellipse cx="0" cy="18" rx="10" ry="4" fill="#1B8FCF" />
              
              {/* Little Dog sitting in it */}
              <g transform="translate(0, 0)">
                {/* Dog head */}
                <motion.g
                  animate={prefersReducedMotion ? {} : { rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ellipse cx="0" cy="-12" rx="11" ry="8" fill="#F5E6C8" stroke="#0D2B45" strokeWidth="2" />
                  {/* Ears */}
                  <path d="M -10,-15 C -13,-5 -7,0 -7,-8 Z" fill="#0D2B45" />
                  <path d="M 10,-15 C 13,-5 7,0 7,-8 Z" fill="#0D2B45" />
                  {/* Nose */}
                  <circle cx="0" cy="-10" r="2" fill="#0D2B45" />
                </motion.g>
              </g>
            </motion.g>

            {/* Bark speech bubble */}
            {dogBarked && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                transform="translate(20, -35)"
              >
                <rect x="0" y="0" width="50" height="24" rx="8" fill="#FAFAFA" stroke="#0D2B45" strokeWidth="1.5" />
                <path d="M 5,23 L 0,30 L 12,23 Z" fill="#FAFAFA" stroke="#0D2B45" strokeWidth="1.5" />
                <rect x="0" y="0" width="50" height="24" rx="8" fill="#FAFAFA" />
                <text x="25" y="15" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0D2B45">GUAU!</text>
              </motion.g>
            )}
          </g>

          {/* CHARACTER 4: Adult in Chill Out zone */}
          <g transform="translate(1320, 331)">
            {/* Sofa Toldo canopy */}
            <path d="M -60,0 C -60,-40 60,-40 60,0 Z" fill="#EF6351" stroke="#0D2B45" strokeWidth="2" />
            <line x1="-60" y1="0" x2="-60" y2="90" stroke="#0D2B45" strokeWidth="3.5" />
            <line x1="60" y1="0" x2="60" y2="90" stroke="#0D2B45" strokeWidth="3.5" />
            
            {/* Sofa */}
            <path d="M -50,90 L 50,90 L 50,65 C 50,55 -50,55 -50,65 Z" fill="#F5E6C8" stroke="#0D2B45" strokeWidth="2" />
            
            {/* Sitting figure holding glass */}
            <g transform="translate(-10, 50)">
              <circle cx="0" cy="-22" r="8" fill="#FFD166" stroke="#0D2B45" strokeWidth="1.5" />
              <path d="M -7,-14 L 7,-14 L 10,12 L -10,12 Z" fill="#1B8FCF" stroke="#0D2B45" strokeWidth="1.5" />
              {/* Waving arm / arm holding glass */}
              <motion.line
                x1="6" y1="-8" x2="16" y2="-16"
                stroke="#0D2B45" strokeWidth="2.5" strokeLinecap="round"
                animate={prefersReducedMotion ? {} : { rotate: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Drink Glass */}
              <circle cx="17" cy="-19" r="3" fill="#6BBF59" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
}
