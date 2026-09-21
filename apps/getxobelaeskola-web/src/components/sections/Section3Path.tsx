// src/components/sections/Section3Path.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CourseCard } from '@/components/ui/CourseCard'
import { Starfish } from '@/components/creatures/Starfish'
import { RoutePath } from '@/components/decorative/RoutePath'
import { NauticalCompassRose } from '@/components/decorative/NauticalCompassRose'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
 
// Estructura de datos del árbol de cursos
// href: URL de la sección correspondiente en getxobelaeskola.cloud/es/
const COURSE_TREE = {
  basic: {
    youth: [
      { key: 'txikigune', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'udalekuak', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'continuous_kids', href: 'https://getxobelaeskola.cloud/es/' },
    ],
    adult: [
      { key: 'cruiser_init', href: 'https://getxobelaeskola.cloud/es/', highlight: true },
    ],
  },
  mid: {
    youth: [
      { key: 'txikigune', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'udalekuak', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'continuous_kids', href: 'https://getxobelaeskola.cloud/es/' },
    ],
    adult: [
      { key: 'vl_init', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'vl_advanced', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'cruiser_perf', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'gennaker', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'tech_team', href: 'https://getxobelaeskola.cloud/es/', highlight: true },
    ],
  },
}
 
import { ParchmentWrapper, ParchmentEffectType } from '@/components/home-prototypes/ParchmentWrapper'
import { Section4To5BeigeExtension } from '@/components/home-prototypes/Section4To5BeigeExtension'

type Level = 'basic' | 'mid' | null
type Profile = 'youth' | 'adult' | null

export interface Section3PathProps {
  parchmentVariant?: ParchmentEffectType
}

export function Section3Path({ parchmentVariant = 'none' }: Section3PathProps = {}) {
  const t = useTranslations('s3')
  const [selectedLevel, setSelectedLevel] = useState<Level>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile>(null)
  const [isPhone, setIsPhone] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [isVisualCompact, setIsVisualCompact] = useState(false)

  useEffect(() => {
    const shouldBeCompact = selectedLevel === 'mid' && selectedProfile === 'adult'
    if (shouldBeCompact) {
      setIsVisualCompact(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisualCompact(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [selectedLevel, selectedProfile])

  useEffect(() => {
    const checkSize = () => {
      setIsPhone(window.innerWidth < 768)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    if (selectedLevel && !selectedProfile) {
      const timer = setTimeout(() => {
        setIsFlashing(true)
      }, 1500)
      return () => {
        clearTimeout(timer)
        setIsFlashing(false)
      }
    } else {
      setIsFlashing(false)
    }
  }, [selectedLevel, selectedProfile])
 
  const handleLevelClick = (level: Level) => {
    setSelectedLevel(level === selectedLevel ? null : level)
    setSelectedProfile(null)
  }
 
  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile === selectedProfile ? null : profile)
  }
 
  const courses = selectedLevel && selectedProfile
    ? COURSE_TREE[selectedLevel][selectedProfile]
    : []
 
  const pathProgress = selectedLevel ? (selectedProfile ? 1.0 : 0.5) : 0
  const hideHeader = selectedLevel === 'mid' && selectedProfile === 'adult'

  const isParchment = parchmentVariant !== 'none'
  const isHome12Or13 = parchmentVariant === 'home-12' || parchmentVariant === 'home-13' || parchmentVariant === 'home-10'
  const isExpanded = Boolean(selectedLevel)

  const contentTransition = 
    (parchmentVariant === 'home-12' || parchmentVariant === 'home-10')
      ? { type: 'spring' as const, stiffness: 45, damping: 20, mass: 1.8 }
      : parchmentVariant === 'home-13'
      ? { type: 'spring' as const, stiffness: 35, damping: 24, mass: 2.2 }
      : { type: 'spring' as const, stiffness: 90, damping: 18, mass: 1.2 }

  const isCompactPadding = isParchment
  const sectionMinHeight = isParchment ? 'auto' : '100dvh'

  // Reducción perfecta del espacio libre vertical (-75%)
  const sectionPaddingY = isParchment ? 'clamp(1rem, 2vh, 1.8rem)' : 'clamp(3rem, 7vh, 5.5rem)'

  // Blanco Cristalino Minimalista detrás del mapa en Home 10, 11, 12, 13
  const isPureWhite = parchmentVariant === 'home-10' || parchmentVariant === 'home-11' || parchmentVariant === 'home-12' || parchmentVariant === 'home-13'
  const sectionBgColor = isParchment 
    ? (isPureWhite ? '#FFFFFF' : '#F6F2EC')
    : 'var(--foam)'

  return (
    <section
      className="section-3-path"
      style={{
        gridArea: 's4',
        position: 'relative',
        width: '100%',
        minHeight: isExpanded ? 'auto' : sectionMinHeight,
        paddingTop: isParchment ? sectionPaddingY : undefined,
        paddingBottom: isParchment ? sectionPaddingY : undefined,
        backgroundColor: sectionBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: isParchment ? 'visible' : 'hidden',
        transition: 'padding 0.5s ease, background-color 0.4s ease'
      }}
    >
      {/* Velo/onda envolvente que extiende la zona beige de Sección 5 sobre la Sección 4 previa */}
      {parchmentVariant && <Section4To5BeigeExtension variant={parchmentVariant} />}

      {/* Rosa de los vientos y ruta: se ocultan en pergamino para dejar el fondo beige limpio */}
      {!isParchment && (
        <>
          <RoutePath progress={pathProgress} />
          <NauticalCompassRose />
        </>
      )}
 

 
      <ParchmentWrapper
        variant={parchmentVariant}
        isExpanded={isExpanded}
        _hasCourses={courses.length > 0}
      >
        {/* Contenido */}
        <motion.div
          layout
          animate={{
            y: (isPhone && isVisualCompact) ? 35 : 0
          }}
          transition={contentTransition}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: (parchmentVariant === 'home-12' || parchmentVariant === 'home-13' || parchmentVariant === 'home-10' || parchmentVariant === 'classic') ? '1100px' : parchmentVariant === 'home-11' ? '820px' : '800px',
            padding: isCompactPadding ? 'clamp(0.4rem, 1.2vh, 1rem) clamp(1rem, 3vw, 2.5rem)' : 'clamp(0.8rem, 2.5vh, 2rem) clamp(1rem, 3vw, 2.5rem)',
            margin: '0 auto',
          }}
        >
        {/* Header */}
        <motion.div
          style={{ marginBottom: '1.5rem', textAlign: 'center' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
              <SectionEyebrow text={t('eyebrow')} color="var(--ocean-bright)" />
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
                fontWeight: 700,
                color: 'var(--ocean-deep)',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                wordBreak: 'break-word',
              }}
            >
              {t('title')}
            </h2>
            <p
              style={{ 
                color: 'var(--text-secondary)', 
                fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                lineHeight: 1.4,
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        {/* PASO 1: Seleccionar nivel */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {(['basic', 'mid'] as Level[]).map((level) => (
            <motion.button
              key={level}
              onClick={() => handleLevelClick(level)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                mass: 1.2
              }}
              style={{
                flex: '1 1 auto',
                maxWidth: '240px',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: selectedLevel === level
                  ? '2px solid var(--ocean-bright)'
                  : '2px solid rgba(10, 126, 200, 0.2)',
                backgroundColor: selectedLevel === level ? 'var(--ocean-bright)' : 'white',
                color: selectedLevel === level ? 'white' : 'var(--ocean-deep)',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: selectedLevel === level
                  ? '0 4px 20px rgba(10, 126, 200, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                textAlign: 'center',
              }}
            >
              {level === 'basic' ? `⚓ ${t('level_basic')}` : `🌊 ${t('level_mid')}`}
            </motion.button>
          ))}
        </div>

        {/* PASO 2: Seleccionar perfil (aparece cuando hay nivel) */}
        <AnimatePresence>
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                mass: 1.2
              }}
              style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              {(['youth', 'adult'] as Profile[]).map((profile) => (
                <motion.button
                  key={profile}
                  onClick={() => handleProfileClick(profile)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={isFlashing ? {
                    backgroundColor: [
                      'rgba(255, 255, 255, 0)',
                      'rgba(255, 255, 255, 0.45)',
                      'rgba(255, 255, 255, 0)'
                    ],
                    boxShadow: [
                      '0 0 0px rgba(255, 255, 255, 0)',
                      '0 0 12px rgba(255, 255, 255, 0.9), 0 0 4px rgba(10, 126, 200, 0.3)',
                      '0 0 0px rgba(255, 255, 255, 0)'
                    ],
                    scale: [1, 1.025, 1]
                  } : {}}
                  transition={isFlashing ? {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '50px',
                    border: selectedProfile === profile
                      ? '2px solid rgba(0, 91, 154, 0.3)'
                      : '2px solid transparent',
                    backgroundColor: selectedProfile === profile ? 'white' : 'transparent',
                    color: selectedProfile === profile ? 'var(--ocean-deep)' : 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'border 0.2s ease, color 0.2s ease',
                  }}
                >
                  {profile === 'youth' ? `🧒 ${t('youth')}` : `🧑 ${t('adult')}`}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PASO 3: Lista de cursos (aparece cuando hay nivel + perfil) */}
        <AnimatePresence>
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 80,
                transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
              }}
              transition={{
                duration: 1.0,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: hideHeader ? 1.0 : 0
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.5rem',
                paddingLeft: isPhone ? '20px' : '0',
                width: '100%',
              }}
            >
              {courses.map((course, i) => (
                <motion.div
                  key={course.key}
                  initial={{ opacity: 0, y: 24, rotateY: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  transition={{
                    delay: hideHeader ? 1.0 + (i * 0.1) : i * 0.08,
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                  }}
                  style={{ perspective: '600px' }}
                >
                  <CourseCard
                    name={t(`course.${course.key}`)}
                    href={course.href}
                    highlight={'highlight' in course ? course.highlight as boolean : false}
                    ctaLabel={t('cta_course')}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </ParchmentWrapper>

      {/* Criatura — estrella de mar: eliminada en Home 12 y 13 */}
      {!isHome12Or13 && (
        <Starfish
          style={{ position: 'absolute', bottom: 'clamp(140px, 22vh, 190px)', left: '8%', zIndex: 5 }}
          enterDelay={1.0}
        />
      )}
    </section>
  )
}
