// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\InteractiveBigSUP.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '../CelebraTuDia.module.css';

interface InteractiveBigSUPProps {
  onBookClick: () => void;
}

export default function InteractiveBigSUP({ onBookClick }: InteractiveBigSUPProps) {
  const t = useTranslations('celebra_dia.bigsup') as any;
  const [seats, setSeats] = useState<boolean[]>(Array(8).fill(false));
  const prefersReducedMotion = useReducedMotion();

  const riderEmojis = ['👧', '👦', '🧑', '👨', '👩', '👴', '👵', '🐶'];

  // Web Audio API Water Splash Synthesis
  const playSplash = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate white/pink-ish noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;

      // Filter to simulate water splash frequency range (bandpass/lowpass)
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.5;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noiseNode.start();
      noiseNode.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Silently ignore audio context errors
    }
  };

  const handleSeatClick = (index: number) => {
    if (seats[index]) return;
    playSplash();
    const nextSeats = [...seats];
    nextSeats[index] = true;
    setSeats(nextSeats);
  };

  const resetSeats = () => {
    setSeats(Array(8).fill(false));
  };

  const isFull = seats.every(s => s);

  return (
    <section className={styles.bigSUPSection}>
      <h2 className={styles.bigSUPTitle}>{t('title')}</h2>
      <p className={styles.bigSUPDesc}>{t('desc')}</p>

      {/* Board container */}
      <motion.div
        className={styles.boardContainer}
        animate={isFull && !prefersReducedMotion ? {
          y: [0, 15, 0],
          scaleY: [1, 0.96, 1]
        } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Riders grid sitting on the board */}
        <div className={styles.seatsGrid}>
          {seats.map((isOccupied, idx) => (
            <div key={idx} className={styles.seat}>
              <AnimatePresence mode="wait">
                {isOccupied ? (
                  <motion.div
                    key="rider"
                    initial={{ scale: 0, y: -40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 10 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-4xl filter drop-shadow-md select-none">
                      {riderEmojis[idx]}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider text-sea-foam/50 mt-1">
                      OK
                    </span>
                  </motion.div>
                ) : (
                  <button
                    key="empty"
                    onClick={() => handleSeatClick(idx)}
                    className={styles.seatPlus}
                    aria-label={`Ocupar asiento ${idx + 1}`}
                  >
                    +
                  </button>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Big SUP Board SVG representation */}
        <svg viewBox="0 0 500 40" className={styles.supBoardSvg}>
          <path
            d="M 10,20 C 50,8 450,8 490,20 C 470,36 30,36 10,20 Z"
            fill="#EF6351"
            stroke="#0D2B45"
            strokeWidth="3.5"
          />
          {/* Rails/Details */}
          <path d="M 40,22 C 100,16 400,16 460,22" stroke="#FFD166" strokeWidth="2.5" fill="none" />
        </svg>

        {/* Waves below the SUP board */}
        <div className={styles.waterSplash} />
      </motion.div>

      {/* Success banner if all 8 riders are loaded */}
      {isFull && (
        <motion.div
          className={styles.successMessage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <p className={styles.successText}>{t('full')}</p>
          <div className="flex gap-4 justify-center">
            <button className={styles.successBtn} onClick={onBookClick}>
              {t('cta')}
            </button>
            <button
              className={`${styles.successBtn} bg-gray-500 hover:bg-gray-600`}
              onClick={resetSeats}
            >
              Reset
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
