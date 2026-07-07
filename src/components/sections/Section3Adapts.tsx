// src/components/sections/Section3Adapts.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

type ExperienceType = 'calm' | 'action'
type EnvironmentType = 'inner' | 'outer'
type BoatType = 'small' | 'big'

// Design Tokens
const COLORS = {
  navyCover: '#0A1E36',     // Deep ocean blue cover
  goldFoil: '#C8A96A',      // Luxurious gold foil accent
  paperWhite: '#FCFAF7',    // Premium ivory paper
  textDarkNavy: '#1B2F45',  // Readable dark navy text
  overlayDark: 'rgba(10, 25, 45, 0.65)',
}

const FONTS = {
  serif: 'Cormorant Garamond, "Playfair Display", Georgia, serif',
  sans: 'Inter, Manrope, "DM Sans", sans-serif',
}

interface BookCardProps {
  title: string;
  subtitle?: string;
  coverTitle: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function BookCard({ title, subtitle, coverTitle, icon, isOpen, onToggle, children }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const activeOpen = isOpen || isHovered

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
      className="w-full aspect-square relative select-none"
      style={{
        perspective: '2000px',
        zIndex: activeOpen ? 50 : 10,
        cursor: 'pointer',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: activeOpen ? -12 : 0,
          scale: activeOpen ? 1.04 : 1,
          boxShadow: activeOpen 
            ? '0 30px 60px rgba(10, 25, 45, 0.4)' 
            : '0 10px 30px rgba(10, 25, 45, 0.15)',
        }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Right Inside Page (The Content page inside the book) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.paperWhite,
            backgroundImage: 'radial-gradient(rgba(18, 62, 99, 0.015) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            borderRadius: activeOpen ? '0 18px 18px 0' : '18px',
            borderLeft: activeOpen ? '2px solid rgba(10, 25, 45, 0.15)' : `1px solid ${COLORS.navyCover}`,
            padding: '1.5rem',
            borderRight: `1px solid ${COLORS.navyCover}`,
            borderTop: `1px solid ${COLORS.navyCover}`,
            borderBottom: `1px solid ${COLORS.navyCover}`,
            boxShadow: activeOpen 
              ? '10px 15px 35px rgba(10, 25, 45, 0.15), inset 15px 0 20px rgba(0,0,0,0.03)' 
              : 'none',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            backfaceVisibility: 'hidden',
            transition: 'border-radius 0.4s ease, border-left 0.4s ease, box-shadow 0.4s ease',
            overflow: 'hidden',
          }}
        >
          {/* Subtle inside page thin frame */}
          <div
            style={{
              position: 'absolute',
              inset: '8px',
              border: '1px solid rgba(18, 62, 99, 0.08)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />

          {/* Inside Page Header */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.65rem', color: COLORS.goldFoil, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: FONTS.sans }}>
              {subtitle || 'Getxo Bela Eskola'}
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: COLORS.textDarkNavy, fontFamily: FONTS.serif, letterSpacing: '-0.01em' }}>
              {title}
            </h4>
            <div style={{ width: '30px', height: '1.2px', backgroundColor: COLORS.goldFoil, marginTop: '0.2rem' }} />
          </div>

          {/* Inside Page Content */}
          <div style={{ zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.5rem 0' }}>
            {children}
          </div>

          {/* Inside Page Footer */}
          <div style={{ zIndex: 2, fontSize: '0.65rem', color: 'rgba(27, 47, 69, 0.5)', fontFamily: FONTS.sans, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {activeOpen ? '✦ Diario de a Bordo ✦' : 'Click para Abrir'}
          </div>
        </div>

        {/* Rotating cover wrapper */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            zIndex: 2,
          }}
          animate={{
            rotateY: activeOpen ? -180 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Cover Front Face (Hardcover Cover) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: COLORS.navyCover,
              backgroundImage: 'radial-gradient(rgba(200, 169, 106, 0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              borderRadius: '18px',
              padding: '2rem 1.5rem',
              border: `2px solid ${COLORS.goldFoil}`,
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
              overflow: 'hidden',
            }}
          >
            {/* Elegant Corner Ornaments in Gold */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '10px', height: '10px', borderTop: `1px solid ${COLORS.goldFoil}`, borderLeft: `1px solid ${COLORS.goldFoil}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', borderTop: `1px solid ${COLORS.goldFoil}`, borderRight: `1px solid ${COLORS.goldFoil}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '10px', height: '10px', borderBottom: `1px solid ${COLORS.goldFoil}`, borderLeft: `1px solid ${COLORS.goldFoil}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '10px', height: '10px', borderBottom: `1px solid ${COLORS.goldFoil}`, borderRight: `1px solid ${COLORS.goldFoil}`, opacity: 0.6 }} />

            {/* Embossed Sailing Icon */}
            <div style={{ color: COLORS.goldFoil, opacity: 0.85, marginTop: '1rem' }}>
              {icon}
            </div>

            {/* Title / Emblem */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: COLORS.goldFoil,
                  fontFamily: FONTS.serif,
                  letterSpacing: '0.02em',
                  lineHeight: 1.3,
                  textTransform: 'uppercase',
                }}
              >
                {coverTitle}
              </h3>
              <div style={{ width: '40px', height: '1px', backgroundColor: COLORS.goldFoil, margin: '0.25rem auto', opacity: 0.5 }} />
            </div>

            {/* Bookmark Ribbon Hint */}
            <div style={{ fontSize: '0.65rem', color: COLORS.goldFoil, opacity: 0.8, fontFamily: FONTS.sans, letterSpacing: '0.05em' }}>
              VER DETALLES →
            </div>
          </div>

          {/* Cover Back Face (Left Page of the Open Book) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: COLORS.paperWhite,
              backgroundImage: 'radial-gradient(rgba(18, 62, 99, 0.02) 1px, transparent 0)',
              backgroundSize: '16px 16px',
              borderRadius: '18px 0 0 18px',
              borderRight: `3px solid ${COLORS.goldFoil}`,
              padding: '2rem 1.5rem',
              borderTop: `2px solid ${COLORS.navyCover}`,
              borderBottom: `2px solid ${COLORS.navyCover}`,
              borderLeft: `2px solid ${COLORS.navyCover}`,
              boxShadow: '-10px 15px 35px rgba(10, 25, 45, 0.1)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '8px',
                border: '1px solid rgba(18, 62, 99, 0.08)',
                borderRadius: '12px',
                pointerEvents: 'none',
              }}
            />

            <span style={{ fontSize: '2.5rem', opacity: 0.7 }}>📖</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: COLORS.textDarkNavy, fontFamily: FONTS.serif, marginTop: '1rem' }}>
              Bitácora Getxo
            </h4>
            <p style={{ fontSize: '0.75rem', color: COLORS.textDarkNavy, fontStyle: 'italic', fontFamily: FONTS.serif, marginTop: '0.4rem', maxWidth: '160px', opacity: 0.8, lineHeight: 1.45 }}>
              "Vivir la mar desde la cercanía y los valores."
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function Section3Adapts() {
  const t = useTranslations('s3_adapts')
  const tIdentity = useTranslations('s2_identity')
  
  // States of the interactive configurator
  const [experience, setExperience] = useState<ExperienceType>('calm')
  const [environment, setEnvironment] = useState<EnvironmentType>('inner')
  const [boat, setBoat] = useState<BoatType>('small')
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  // Floating particles array
  const particles = Array.from({ length: 12 })

  // Get dynamic subtitle description based on options combination
  const getDynamicSubtitle = () => {
    const envKey = environment === 'inner' ? 'int' : 'ext'
    const key = `combo_${experience}_${envKey}_${boat}`
    try {
      return t(key)
    } catch {
      return t('subtitle_default')
    }
  }

  // Cover gold embossed Icons
  const Icons = {
    school: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
    experienceInfo: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.105-.347-.492-.546-.861-.485L5.75 3.75a.75.75 0 00-.5.686v13.5c0 .354.249.662.593.72l4.986.832c.164.027.332-.008.47-.099l4.57-2.999a.75.75 0 01.861 0l3.07 2.016A.75.75 0 0021 17.75V4.25a.75.75 0 00-.317-.613l-4.57-2.999a.75.75 0 00-.861 0l-3.772 2.86z" />
      </svg>
    ),
    experience: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    scenario: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3.75 12H5.25M18.75 12H20.25M17.657 6.343l-1.06 1.06M7.404 16.596l-1.06 1.06M17.657 17.657l-1.06-1.06M7.404 7.404l-1.06-1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
      </svg>
    ),
    boat: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
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
      {/* Dynamic Background Image with Blur */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} className="pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={experience}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, filter: 'blur(6px)', scale: 1.05 }}
          >
            <Image
              src={experience === 'calm' ? '/images/ai/section2-calm-bay.webp' : '/images/ai/section2-action-sea.webp'}
              alt="Fondo interactivo"
              fill
              quality={75}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Overlay for readability */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: COLORS.overlayDark, 
          zIndex: 2 
        }} 
        className="pointer-events-none"
      />

      {/* Gold Floating Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            backgroundColor: COLORS.goldFoil,
            filter: 'blur(0.5px)',
            opacity: Math.random() * 0.35 + 0.15,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, Math.random() * -80 - 40, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vh, 4rem) clamp(1.5rem, 6vw, 5rem)',
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '2.5rem', textAlign: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', color: COLORS.goldFoil, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: FONTS.sans }}>
            {tIdentity('eyebrow')}
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              marginTop: '0.4rem',
              marginBottom: '0.6rem',
              fontFamily: FONTS.serif,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {tIdentity('title_line1')} {tIdentity('title_line2')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', maxWidth: '800px', margin: '0 auto', fontFamily: FONTS.sans, fontWeight: 300, lineHeight: 1.5 }}>
            {getDynamicSubtitle()}
          </p>
        </motion.div>

        {/* Books Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Book 1: What is Getxo Bela Eskola? */}
          <BookCard
            coverTitle="La Escuela"
            subtitle="Quiénes Somos"
            title="Getxo Bela Eskola"
            icon={Icons.school}
            isOpen={activeCardIndex === 0}
            onToggle={() => setActiveCardIndex(activeCardIndex === 0 ? null : 0)}
          >
            <p style={{ fontSize: '0.82rem', color: COLORS.textDarkNavy, lineHeight: 1.6, fontFamily: FONTS.serif, fontStyle: 'italic', padding: '0 0.5rem' }}>
              {tIdentity('value1_prefix')} <strong>{tIdentity('value1_highlight')}</strong>
              <br /><br />
              Un lugar donde aprender a navegar, compartir y disfrutar de la mar.
            </p>
          </BookCard>

          {/* Book 2: The Experience Info */}
          <BookCard
            coverTitle="Vela Moderna"
            subtitle="El Concepto"
            title="La Experiencia"
            icon={Icons.experienceInfo}
            isOpen={activeCardIndex === 1}
            onToggle={() => setActiveCardIndex(activeCardIndex === 1 ? null : 1)}
          >
            <p style={{ fontSize: '0.82rem', color: COLORS.textDarkNavy, lineHeight: 1.6, fontFamily: FONTS.sans, opacity: 0.9 }}>
              {t('card4.body')}
            </p>
          </BookCard>

          {/* Book 3: Experience Toggle */}
          <BookCard
            coverTitle="Experiencia"
            subtitle="Configurador"
            title="Tu Aventura"
            icon={Icons.experience}
            isOpen={activeCardIndex === 2}
            onToggle={() => setActiveCardIndex(activeCardIndex === 2 ? null : 2)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', padding: '0 0.5rem' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setExperience('calm'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: experience === 'calm' ? COLORS.navyCover : 'transparent',
                  color: experience === 'calm' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                ☁️ Calma
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setExperience('action'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: experience === 'action' ? COLORS.navyCover : 'transparent',
                  color: experience === 'action' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                💨 Acción
              </button>
            </div>
          </BookCard>

          {/* Book 4: Scenario Toggle */}
          <BookCard
            coverTitle="Escenario"
            subtitle="Configurador"
            title="El Abra"
            icon={Icons.scenario}
            isOpen={activeCardIndex === 3}
            onToggle={() => setActiveCardIndex(activeCardIndex === 3 ? null : 3)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', padding: '0 0.5rem' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setEnvironment('inner'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: environment === 'inner' ? COLORS.navyCover : 'transparent',
                  color: environment === 'inner' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                🌊 Abra interior
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEnvironment('outer'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: environment === 'outer' ? COLORS.navyCover : 'transparent',
                  color: environment === 'outer' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                🌊🌊 Abra exterior
              </button>
            </div>
          </BookCard>

          {/* Book 5: Boat Toggle */}
          <BookCard
            coverTitle="Embarcación"
            subtitle="Configurador"
            title="La Flota"
            icon={Icons.boat}
            isOpen={activeCardIndex === 4}
            onToggle={() => setActiveCardIndex(activeCardIndex === 4 ? null : 4)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', padding: '0 0.5rem' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setBoat('small'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: boat === 'small' ? COLORS.navyCover : 'transparent',
                  color: boat === 'small' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                ⛵ Pequeño (J80)
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setBoat('big'); }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '30px',
                  border: `1.5px solid ${COLORS.navyCover}`,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: FONTS.sans,
                  cursor: 'pointer',
                  backgroundColor: boat === 'big' ? COLORS.navyCover : 'transparent',
                  color: boat === 'big' ? 'white' : COLORS.textDarkNavy,
                  transition: 'all 0.3s ease',
                }}
              >
                🚢 Crucero
              </button>
            </div>
          </BookCard>
        </div>
      </div>
    </section>
  )
}
