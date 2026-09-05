'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useScrollLock } from '@/hooks/useScrollLock'

export function Section3Adapts() {
  const t = useTranslations('s3_adapts_new')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPhone, setIsPhone] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  useScrollLock(modalRef, isModalOpen)

  useEffect(() => {
    setMounted(true)
    const checkSize = () => {
      setIsPhone(window.innerWidth < 768)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Cerrar el modal automáticamente al hacer scroll en la página principal
  useEffect(() => {
    if (!isModalOpen) return;
    const initialScrollY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 10) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isModalOpen]);

  return (
    <section
      className="section-3-adapts"
      style={{
        gridArea: 's3',
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <style jsx global>{`
        @media (orientation: landscape) {
          .section-3-adapts h2 {
            font-size: clamp(1.9rem, 4.75vw, 3.8rem) !important;
          }
          .section-3-adapts p {
            font-size: clamp(1.045rem, 1.9vw, 1.33rem) !important;
          }
          .section-3-adapts button {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: isPhone 
            ? '2rem 1.5rem' 
            : '2rem clamp(2rem, 6vw, 5rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Background image & filter */}
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
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }} className="pointer-events-none select-none">
          <Image
            src="/images/ai/section2-calm-bay.webp"
            alt="Fondo vela"
            fill
            quality={70}
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.25 }}
          />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '800px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 800,
              color: 'var(--gbe-navy-900)',
              lineHeight: 1.1,
              marginBottom: '2rem',
              fontFamily: 'var(--gbe-font-display)',
              textTransform: 'uppercase',
            }}
            dangerouslySetInnerHTML={{ __html: t('title') }}
          />
          
          <p
            style={{
              color: 'var(--gbe-text)',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              lineHeight: 1.6,
              fontWeight: 400,
              marginBottom: '3rem',
            }}
            dangerouslySetInnerHTML={{ __html: t('subtitle') }}
          />

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: 'var(--gbe-navy-900)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '50px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'transform 0.2s, background-color 0.2s',
              boxShadow: '0 4px 15px rgba(11, 61, 99, 0.2)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {t('leer_mas')}
          </button>
        </div>
      </div>

      {/* Modal (Portaled) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                backgroundColor: 'rgba(11, 61, 99, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: isPhone ? '2rem 1.5rem' : '3rem 4rem',
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  position: 'relative',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: 'var(--gbe-navy-900)',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                >
                  ✕
                </button>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gbe-navy-900)', marginBottom: '1.5rem' }}>
                  {t('modal.title')}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--gbe-text)', lineHeight: 1.6 }}>
                  <p>{t('modal.intro1')}</p>
                  <p>{t('modal.intro2')}</p>

                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--gbe-navy-700)', marginBottom: '0.5rem' }}>{t('modal.experience_title')}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li>{t('modal.experience_1')}</li>
                      <li>{t('modal.experience_2')}</li>
                    </ul>
                    <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>{t('modal.experience_3')}</p>
                  </div>

                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--gbe-navy-700)', marginBottom: '0.5rem' }}>{t('modal.scenario_title')}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li>{t('modal.scenario_1')}</li>
                      <li>{t('modal.scenario_2')}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--gbe-navy-700)', marginBottom: '0.5rem' }}>{t('modal.who_title')}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li>{t('modal.who_1')}</li>
                      <li>{t('modal.who_2')}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--gbe-navy-700)', marginBottom: '0.5rem' }}>{t('modal.modern_title')}</h4>
                    <p>{t('modal.modern_1')}</p>
                    <p>{t('modal.modern_2')}</p>
                    <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>{t('modal.modern_3')}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
