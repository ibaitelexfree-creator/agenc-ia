// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\ClosingBalloons.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';
import styles from '../CelebraTuDia.module.css';

interface BalloonState {
  id: number;
  color: string;
  size: number;
  speed: number;
  left: number;
  delay: number;
  isPopped: boolean;
  popText: string;
}

export default function ClosingBalloons() {
  const t = useTranslations('celebra_dia.closing') as any;
  const prefersReducedMotion = useReducedMotion();

  const [date, setDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(10);
  const [balloons, setBalloons] = useState<BalloonState[]>([]);

  const balloonColors = ['#1B8FCF', '#FFD166', '#EF6351', '#6BBF59', '#38bdf8', '#fb923c'];
  const popPhrases = ['¡Ups!', '¡Weee!', '¡Otra ronda!', '¡PUM!', '🎉', '✨', '🎈'];

  // Helper to generate side positions (left: 2-25% or 75-96%)
  const getSideLeft = (index: number) => {
    const isLeftSide = index % 2 === 0;
    if (isLeftSide) {
      return 2 + Math.random() * 23; // 2% to 25% (lateral izquierdo)
    }
    return 75 + Math.random() * 21; // 75% to 96% (lateral derecho)
  };

  // Initialize 16 floating balloons primarily on lateral sides
  useEffect(() => {
    const list: BalloonState[] = Array(16).fill(null).map((_, i) => ({
      id: i,
      color: balloonColors[i % balloonColors.length],
      size: 0.85 + Math.random() * 0.45,
      speed: 6.5 + Math.random() * 5.5,
      left: getSideLeft(i),
      delay: (i * 0.7) % 7,
      isPopped: false,
      popText: popPhrases[i % popPhrases.length]
    }));
    setBalloons(list);
  }, []);

  // Pop action for balloons with celebration confetti
  const popBalloon = (id: number, event?: React.MouseEvent) => {
    if (prefersReducedMotion) return;

    // Trigger confetti from the click origin or balloon position
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 35,
        spread: 60,
        startVelocity: 25,
        origin: { x: originX, y: originY },
        colors: ['#1B8FCF', '#FFD166', '#EF6351', '#6BBF59', '#ffffff'],
        disableForReducedMotion: true
      });
    } else {
      confetti({
        particleCount: 30,
        spread: 50,
        startVelocity: 20,
        origin: { y: 0.6 },
        colors: ['#1B8FCF', '#FFD166', '#EF6351', '#6BBF59', '#ffffff'],
        disableForReducedMotion: true
      });
    }

    setBalloons(prev => prev.map(b => b.id === id ? { ...b, isPopped: true } : b));
    
    // Respawn balloon after 2.5s in the sides
    setTimeout(() => {
      setBalloons(prev => prev.map(b => b.id === id ? {
        ...b,
        isPopped: false,
        left: getSideLeft(id),
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
      } : b));
    }, 2500);
  };

  // Build WhatsApp share url
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventDate = date || 'Sin fecha definida';
    const textMessage = `Hola Getxo Bela Eskola! Queremos celebrar un día especial con vosotras. Fecha propuesta: ${eventDate}, Grupo: ${peopleCount} personas.`;
    const encoded = encodeURIComponent(textMessage);
    window.open(`https://wa.me/34634405624?text=${encoded}`, '_blank');
  };

  return (
    <section className={styles.closingSection}>
      {/* Floating balloons fields */}
      {!prefersReducedMotion && (
        <div className={styles.balloonsField}>
          <AnimatePresence>
            {balloons.map((b) => (
              !b.isPopped ? (
                <motion.div
                  key={`balloon-${b.id}`}
                  className={styles.balloon}
                  style={{
                    left: `${b.left}%`,
                    scale: b.size
                  }}
                  initial={{ y: '110vh' }}
                  animate={{
                    y: ['110vh', '-20vh'],
                    x: [0, 15, -15, 0]
                  }}
                  transition={{
                    y: { duration: b.speed, repeat: Infinity, ease: 'linear', delay: b.delay },
                    x: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  onClick={(e) => popBalloon(b.id, e)}
                >
                  {/* Balloon Body */}
                  <div
                    className={styles.balloonBody}
                    style={{
                      backgroundColor: b.color,
                      boxShadow: 'inset -3px -3px 0px rgba(0,0,0,0.15)'
                    }}
                  />
                  {/* Balloon String */}
                  <div className={styles.balloonString} />
                </motion.div>
              ) : null
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Main Closing Container */}
      <div className={styles.closingContent}>
        <p className={styles.closingPhrase}>{t('phrase')}</p>

        {/* Contact Form */}
        <form className={styles.contactForm} onSubmit={handleWhatsAppSubmit}>
          <h3 className={styles.formTitle}>{t('question')}</h3>

          {/* Date Picker */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('date')}</label>
            <input
              type="date"
              className={styles.formInput}
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Number of People slider */}
          <div className={styles.formGroup}>
            <div className="flex justify-between items-center">
              <label className={styles.formLabel}>{t('group')}</label>
              <span className={styles.sliderValue}>{peopleCount}</span>
            </div>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="4"
                max="40"
                value={peopleCount}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#EF6351]"
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
              />
              
              {/* Dynamic little stick figure representations */}
              <div className={styles.sliderPeopleIllust}>
                {[...Array(Math.min(peopleCount, 22))].map((_, i) => (
                  <motion.span
                    key={i}
                    className={styles.miniPerson}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                  >
                    👤
                  </motion.span>
                ))}
                {peopleCount > 22 && (
                  <span className="text-[11px] font-black text-sol ml-1">+</span>
                )}
              </div>
            </div>
          </div>

          {/* Submit/Book Whatsapp button */}
          <button type="submit" className={styles.submitBtn}>
            {t('btn')}
          </button>
        </form>
      </div>
    </section>
  );
}
