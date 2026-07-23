// src/components/sections/Section3Adapts.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card3D } from '@/components/ui/Card3D'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { Windsurfer } from '@/components/creatures/Windsurfer'

type ExperienceType = 'calm' | 'action'
type EnvironmentType = 'inner' | 'outer'
type BoatType = 'small' | 'big'

interface AnimatedCounterProps {
    from: number;
    to: number;
    duration?: number; // en ms
    suffix?: string;
}

function AnimatedCounter({ from, to, duration = 1500, suffix = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(from);
    const elementRef = useRef<HTMLSpanElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let startTime: number | null = null;

                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing: easeOutQuad
                        const easeProgress = progress * (2 - progress);
                        const currentValue = Math.floor(from + (to - from) * easeProgress);
                        
                        setCount(currentValue);

                        if (progress < 1) {
                            animationRef.current = requestAnimationFrame(step);
                        }
                    };

                    animationRef.current = requestAnimationFrame(step);
                } else {
                    // Resetear al salir de vista
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                        animationRef.current = null;
                    }
                    setCount(from);
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '-30px 0px' 
            }
        );

        observer.observe(currentElement);

        return () => {
            observer.unobserve(currentElement);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [from, to, duration]);

    return <span ref={elementRef}>{count}{suffix}</span>;
}

export function Section3Adapts() {
  const t = useTranslations('s3_adapts')
  const tStats = useTranslations('home.stats')
  const params = useParams()
  const locale = (params?.locale as string) || 'es'

  // Estados del configurador reactivo
  const [experience, setExperience] = useState<ExperienceType>('calm')
  const [environment, setEnvironment] = useState<EnvironmentType>('inner')
  const [boat, setBoat] = useState<BoatType>('small')
  
  const [isPhone, setIsPhone] = useState(false)
  useEffect(() => {
    const checkSize = () => {
      setIsPhone(window.innerWidth < 768)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Obtener el subtítulo dinámico según la combinación
  const getDynamicSubtitle = () => {
    const envKey = environment === 'inner' ? 'int' : 'ext'
    const key = `combo_${experience}_${envKey}_${boat}`
    try {
      return t(key)
    } catch {
      return t('subtitle_default')
    }
  }

  return (
    <section
      style={{
        gridArea: 's3',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 62% Inferior: Panel del configurador interactivo original con fondo de imagen reactivo */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: isPhone 
            ? '6rem 1rem 1rem' 
            : 'clamp(2.5rem, 7vh, 4.5rem) clamp(1.5rem, 6vw, 5rem) clamp(1.5rem, 4vh, 3.5rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // align to top so top padding pushes content down
        }}
      >
        {/* Filtro de cristal blanco traslúcido para legibilidad */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.75)', 
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 1 
          }} 
          className="pointer-events-none"
        />

        {/* Imagen de fondo reactiva colocada sobre el filtro con buena opacidad */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }} className="pointer-events-none select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={experience}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={experience === 'calm' ? '/images/ai/section2-calm-bay.webp' : '/images/ai/section2-action-sea.webp'}
                alt="Fondo interactivo"
                fill
                quality={70}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Header con Subtítulo Dinámico */}
        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <SectionEyebrow text={t('eyebrow')} color="var(--gbe-navy-700)" hideLineOnMobile={true} />
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--gbe-navy-900)',
              lineHeight: 1.15,
              marginBottom: '0.6rem',
              fontFamily: 'var(--gbe-font-display)',
            }}
          >
            {t('title')}
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={getDynamicSubtitle()}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                color: 'var(--gbe-text-muted)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                lineHeight: 1.5,
                fontWeight: 300,
                minHeight: '2.5rem',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              {getDynamicSubtitle()}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Grid interactivo apilado */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.5rem', // closer between them
            marginBottom: '0.8rem',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Card 1: Tipo de experiencia */}
          <Card3D intensity={5}>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gbe-text-muted)' }}>
                {t('experience_label')}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setExperience('calm')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: experience === 'calm' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: experience === 'calm' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('calm_label')}
                </button>
                <button
                  onClick={() => setExperience('action')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: experience === 'action' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: experience === 'action' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('action_label')}
                </button>
              </div>
            </div>
          </Card3D>

          {/* Card 2: El escenario */}
          <Card3D intensity={5}>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gbe-text-muted)' }}>
                {t('setting_label')}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEnvironment('inner')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: environment === 'inner' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: environment === 'inner' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('inner_abra_label')}
                </button>
                <button
                  onClick={() => setEnvironment('outer')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: environment === 'outer' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: environment === 'outer' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('outer_abra_label')}
                </button>
              </div>
            </div>
          </Card3D>

          {/* Card 3: Con quién navegar */}
          <Card3D intensity={5}>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gbe-text-muted)' }}>
                {t('boat_label')}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setBoat('small')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: boat === 'small' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: boat === 'small' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('small_label')}
                </button>
                <button
                  onClick={() => setBoat('big')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: boat === 'big' ? 'var(--gbe-navy-900)' : 'var(--gbe-mist)',
                    color: boat === 'big' ? 'white' : 'var(--gbe-text)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('cruise_label')}
                </button>
              </div>
            </div>
          </Card3D>

          {/* Card 4: Vela Moderna */}
          <div 
            style={{ 
              transform: isPhone ? 'none' : 'translateY(24px)',
              width: isPhone ? '75%' : 'auto',
              margin: isPhone ? '0 auto' : '0'
            }}
          >
            <Card3D
              intensity={5}
              style={{
                backgroundColor: 'var(--gbe-mist)',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                color: 'var(--gbe-navy-900)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'var(--gbe-navy-900)',
                    color: 'var(--gbe-gold)',
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    marginBottom: '0.3rem',
                  }}
                >
                  {t('card4.badge')}
                </span>
                <p
                  style={{
                    fontSize: '0.70rem',
                    lineHeight: 1.4,
                    color: 'var(--gbe-text-muted)',
                  }}
                >
                  {t('card4.body')}
                </p>
              </div>
            </Card3D>
          </div>
        </div>

        {/* Enlace global para "Leer más" */}
        {!isPhone && (
          <div style={{ alignSelf: 'center', margin: '0.4rem 0 1rem 0', position: 'relative', zIndex: 3 }}>
            <Link
              href={`/${locale}/courses`}
              className="group relative inline-flex items-center gap-3 text-2xs uppercase tracking-[0.25em] font-bold text-nautical-blue"
              style={{ textDecoration: 'none' }}
            >
              <span className="w-8 h-px bg-nautical-blue group-hover:scale-x-150 transition-transform duration-500 origin-left" />
              {t('card4.badge')} →
            </Link>
          </div>
        )}
      </div>

      {/* Ola decorativa animada en la parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          overflow: 'hidden',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: '200%', height: '100%' }}
        >
          <WaveSVG3D opacity={0.35} experience={experience} />
          <WaveSVG3D opacity={0.35} experience={experience} />
        </motion.div>
      </div>

    </section>
  )
}

function WaveSVG3D({ opacity, experience }: { opacity: number; experience: ExperienceType }) {
  const speed = experience === 'calm' ? 8 : 4.5
  return (
    <motion.div
      style={{
        perspective: '200px',
        width: '50%',
        height: '100%',
        flexShrink: 0,
      }}
      animate={{ rotateX: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 80 C180 40 360 110 540 70 C720 30 900 110 1080 70 C1260 30 1380 90 1440 60 L1440 120 L0 120 Z"
          fill={`rgba(11, 61, 99, ${opacity})`}
          animate={{
            d: [
              "M0 80 C180 40 360 110 540 70 C720 30 900 110 1080 70 C1260 30 1380 90 1440 60 L1440 120 L0 120 Z",
              experience === 'calm'
                ? "M0 70 C200 90 400 50 580 75 C760 100 940 60 1120 75 C1280 90 1400 60 1440 70 L1440 120 L0 120 Z"
                : "M0 50 C200 110 400 30 580 90 C760 130 940 40 1120 95 C1280 115 1400 45 1440 80 L1440 120 L0 120 Z"
            ]
          }}
          transition={{ duration: speed, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 60 C180 20 360 100 540 60 C720 20 900 100 1080 60 C1260 20 1380 90 1440 60 L1440 120 L0 120 Z"
          fill={`rgba(44, 110, 155, ${opacity * 0.7})`}
          animate={{
            d: [
              "M0 60 C180 20 360 100 540 60 C720 20 900 100 1080 60 C1260 20 1380 90 1440 60 L1440 120 L0 120 Z",
              experience === 'calm'
                ? "M0 65 C220 90 440 40 620 60 C800 90 980 50 1160 65 C1320 80 1410 55 1440 60 L1440 120 L0 120 Z"
                : "M0 80 C220 120 440 20 620 85 C800 125 980 30 1160 85 C1320 105 1410 40 1440 70 L1440 120 L0 120 Z"
            ]
          }}
          transition={{ duration: speed * 1.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
    </motion.div>
  )
}
