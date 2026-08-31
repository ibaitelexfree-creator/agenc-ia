// TeamCard.tsx
'use client'

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";
import { Team } from "../data/teams";
import React from "react";
import { useTranslations } from "next-intl";

interface TeamCardProps {
  team: Team;
  isActive: boolean;
  onToggle: () => void;
  entryDelay?: number;
}

// Design Tokens (Matching Section 3 and 4 premium styles)
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

export default function TeamCard({ team, isActive, onToggle, entryDelay = 0 }: TeamCardProps) {
  const { id: teamKey, emoji, accentColor, embarcaciones } = team;
  const t = useTranslations('equipos_entrenamiento.teams');
  
  const [isHovered, setIsHovered] = useState(false);

  const activeOpen = isActive || isHovered;

  const label = t(`${teamKey}.label`);
  const age = t(`${teamKey}.age`);
  const description = t(`${teamKey}.description`);
  const schedule = t(`${teamKey}.schedule`);
  const focus = t(`${teamKey}.focus`);
  const note = teamKey === 'adultas' ? t(`${teamKey}.note`) : undefined;

  const translatedEmbarcaciones = embarcaciones.map((e) => {
    if (e === 'Varios tipos') return t('jovenes.vessel_various');
    return e;
  });

  // Short descriptive values for Left Inside Page
  const shortQuotes: Record<string, string> = {
    infantil: "Confianza en el agua y aprendizaje a través del juego.",
    jovenes: "Navegación estable, amistad y responsabilidad compartida.",
    adultas: "Estrategia, trimado avanzado y tecnificación de regata.",
  };

  return (
    <motion.div
      className={styles['team-card-wrapper']}
      style={{
        perspective: '2000px',
        zIndex: activeOpen ? 50 : 10,
        aspectRatio: '1 / 1',
        width: '100%',
        height: 'auto',
      }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.7, delay: entryDelay, ease: [0.25, 1, 0.5, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
    >

      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: activeOpen ? -8 : 0,
          scale: activeOpen ? 1.02 : 1,
          boxShadow: activeOpen 
            ? '0 20px 40px rgba(10, 25, 45, 0.25)' 
            : '0 8px 24px rgba(10, 25, 45, 0.12)',
        }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* RIGHT INSIDE PAGE (Content revealed on the right side) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.paperWhite,
            backgroundImage: 'radial-gradient(rgba(18, 62, 99, 0.015) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            borderRadius: activeOpen ? '0 18px 18px 0' : '18px',
            borderLeft: activeOpen ? '2px solid rgba(10, 25, 45, 0.15)' : `1px solid ${COLORS.navyCover}`,
            padding: '1.1rem',
            borderRight: `1px solid ${COLORS.navyCover}`,
            borderTop: `1px solid ${COLORS.navyCover}`,
            borderBottom: `1px solid ${COLORS.navyCover}`,
            boxShadow: activeOpen 
              ? '8px 12px 28px rgba(10, 25, 45, 0.12), inset 12px 0 16px rgba(0,0,0,0.02)' 
              : 'none',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backfaceVisibility: 'hidden',
            transition: 'border-radius 0.4s ease, border-left 0.4s ease, box-shadow 0.4s ease',
            overflow: 'hidden',
          }}
        >
          {/* Inside page border outline */}
          <div
            style={{
              position: 'absolute',
              inset: '8px',
              border: '1px solid rgba(18, 62, 99, 0.08)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />

          {/* Header */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.15rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.62rem', color: accentColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: FONTS.sans }}>
              {age}
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: COLORS.textDarkNavy, fontFamily: FONTS.serif, letterSpacing: '-0.01em' }}>
              {label}
            </h4>
            <div style={{ width: '30px', height: '1.2px', backgroundColor: COLORS.goldFoil, margin: '0.15rem auto 0' }} />
          </div>

          {/* Description Body */}
          <div style={{ zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', padding: '0.1rem 0', textAlign: 'left' }}>
            <p style={{ fontSize: '0.74rem', color: COLORS.textDarkNavy, lineHeight: 1.45, fontFamily: FONTS.sans, opacity: 0.9 }}>
              {description}
            </p>

            {/* Metainfo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem', fontSize: '0.7rem', color: COLORS.textDarkNavy }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📅</span>
                <span style={{ fontWeight: 500 }}>{schedule}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎯</span>
                <span style={{ fontWeight: 500 }}>{focus}</span>
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
              {translatedEmbarcaciones.map((e) => (
                <span
                  key={e}
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '12px',
                    border: `1px solid ${accentColor}`,
                    color: COLORS.textDarkNavy,
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {e}
                </span>
              ))}
            </div>

            {/* Note */}
            {note && (
              <p style={{ fontSize: '0.68rem', color: 'rgba(27, 47, 69, 0.75)', fontStyle: 'italic', marginTop: '0.4rem' }}>
                {note}
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{ zIndex: 2, display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                fontSize: '0.65rem',
                color: 'rgba(27, 47, 69, 0.5)',
                fontFamily: FONTS.sans,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('close')}
            </button>
          </div>
        </div>

        {/* ROTATING COVER WRAPPER */}
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
          {/* Cover Front Face (Hardcover Navy Cover) */}
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
              padding: 'clamp(0.75rem, 3vh, 2.5rem) clamp(0.4rem, 1.5vw, 1.5rem)',
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

            {/* Embossed Sailing Icon / Emoji */}
            <div style={{ fontSize: '2.5rem', filter: 'grayscale(1) contrast(1.5) sepia(1) hue-rotate(15deg) saturate(1.8)' }}>
              {emoji}
            </div>

            {/* Title / Emblem */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: COLORS.goldFoil,
                  fontFamily: FONTS.serif,
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: FONTS.sans }}>
                {age}
              </span>
              <div style={{ width: '40px', height: '1px', backgroundColor: COLORS.goldFoil, margin: '0.3rem auto 0', opacity: 0.5 }} />
            </div>

            {/* Bookmark hint */}
            <div style={{ fontSize: '0.65rem', color: COLORS.goldFoil, opacity: 0.9, fontFamily: FONTS.sans, letterSpacing: '0.08em', fontWeight: 600 }}>
              {t('view_team').toUpperCase()} →
            </div>
          </div>

          {/* Cover Back Face (Left Inside Page) */}
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

            <span style={{ fontSize: '2rem', filter: 'grayscale(1) sepia(1) saturate(1.5)' }}>⚓</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: COLORS.textDarkNavy, fontFamily: FONTS.serif, marginTop: '1rem', textTransform: 'uppercase' }}>
              {label}
            </h4>
            <p style={{ fontSize: '0.72rem', color: COLORS.textDarkNavy, fontStyle: 'italic', fontFamily: FONTS.serif, marginTop: '0.4rem', maxWidth: '170px', opacity: 0.85, lineHeight: 1.45 }}>
              "{shortQuotes[teamKey] || "Navegar con pasión y valores."}"
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
