// src/components/sections/Section3Path.tsx
'use client'

import { useState } from 'react'
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

type Level = 'basic' | 'mid' | null
type Profile = 'youth' | 'adult' | null

export function Section3Path() {
  const t = useTranslations('s3')
  const [selectedLevel, setSelectedLevel] = useState<Level>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile>(null)

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

  return (
    <section
      style={{
        gridArea: 's3',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--foam)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RoutePath />
      <NauticalCompassRose />

      {/* Mapa náutico de fondo — muy sutil */}
      <Image
        src="/images/ai/section3-nautical-map.webp"
        alt=""
        fill
        quality={60}
        style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.07 }}
        aria-hidden
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '800px',
          padding: 'clamp(1.5rem, 4vh, 3rem) clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <SectionEyebrow text={t('eyebrow')} color="var(--ocean-bright)" />
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--ocean-deep)',
              marginBottom: '0.5rem',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* PASO 1: Seleccionar nivel */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {(['basic', 'mid'] as Level[]).map((level) => (
            <motion.button
              key={level}
              onClick={() => handleLevelClick(level)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                maxWidth: '220px',
                padding: '1rem 1.5rem',
                borderRadius: '14px',
                border: selectedLevel === level
                  ? '2px solid var(--ocean-bright)'
                  : '2px solid rgba(10, 126, 200, 0.2)',
                backgroundColor: selectedLevel === level ? 'var(--ocean-bright)' : 'white',
                color: selectedLevel === level ? 'white' : 'var(--ocean-deep)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: selectedLevel === level
                  ? '0 4px 20px rgba(10, 126, 200, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
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
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
              style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              {(['youth', 'adult'] as Profile[]).map((profile) => (
                <motion.button
                  key={profile}
                  onClick={() => handleProfileClick(profile)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '50px',
                    border: selectedProfile === profile
                      ? '2px solid var(--ocean-mid)'
                      : '2px solid rgba(0, 91, 154, 0.2)',
                    backgroundColor: selectedProfile === profile ? 'var(--ocean-mid)' : 'white',
                    color: selectedProfile === profile ? 'white' : 'var(--ocean-mid)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {courses.map((course, i) => (
                <motion.div
                  key={course.key}
                  initial={{ opacity: 0, y: 24, rotateY: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
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
      </div>

      {/* Criatura — estrella de mar esquina inferior izquierda */}
      <Starfish
        style={{ position: 'absolute', bottom: '5%', left: '3%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
