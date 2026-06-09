'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Anchor, Compass, Sailboat, Users, BookOpen, Phone, ShoppingBag, X } from 'lucide-react'

export function LandingSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()

  const sections = [
    { label: { es: 'Inicio', eu: 'Hasiera', en: 'Home', fr: 'Accueil' }, progress: 0, icon: <Compass className="w-5 h-5" /> },
    { label: { es: 'La Escuela', eu: 'Eskola', en: 'The School', fr: 'L\'École' }, progress: 0.2, icon: <Sailboat className="w-5 h-5" /> },
    { label: { es: 'Cursos', eu: 'Ikastaroak', en: 'Courses', fr: 'Cours' }, progress: 0.4, icon: <Anchor className="w-5 h-5" /> },
    { label: { es: 'Por qué Getxo', eu: 'Zergatik Getxo', en: 'Why Getxo', fr: 'Pourquoi Getxo' }, progress: 0.6, icon: <Users className="w-5 h-5" /> },
    { label: { es: 'Matriculación', eu: 'Matrikulazioa', en: 'Enrollment', fr: 'Inscription' }, progress: 0.8, icon: <ShoppingBag className="w-5 h-5" /> },
  ]

  const externalLinks = [
    { label: { es: 'Club', eu: 'Kluba', en: 'Club', fr: 'Club' }, href: `/${locale}/club/conocenos`, icon: <Sailboat className="w-4 h-4" /> },
    { label: { es: 'Servicios', eu: 'Zerbitzuak', en: 'Services', fr: 'Services' }, href: `/${locale}/servicios/cursos`, icon: <Anchor className="w-4 h-4" /> },
    { label: { es: 'Blog', eu: 'Bloga', en: 'Blog', fr: 'Blog' }, href: `/${locale}/blog/noticias`, icon: <BookOpen className="w-4 h-4" /> },
    { label: { es: 'Contacto', eu: 'Kontaktua', en: 'Contact', fr: 'Contact' }, href: `/${locale}/contacto/localizacion`, icon: <Phone className="w-4 h-4" /> },
  ]

  const scrollToProgress = (progress: number) => {
    setIsOpen(false)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth',
    })
  }

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Botón flotante superior izquierdo */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 110,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(13, 33, 55, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #4AAFE8',
          boxShadow: '0 0 15px rgba(74, 175, 232, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          cursor: 'pointer',
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#4AAFE8]" strokeWidth={2.5} />
        ) : (
          <>
            <motion.span style={{ width: '18px', height: '2px', backgroundColor: '#4AAFE8', borderRadius: '2px' }} />
            <motion.span style={{ width: '14px', height: '2px', backgroundColor: '#4AAFE8', borderRadius: '2px', marginLeft: '-4px' }} />
            <motion.span style={{ width: '18px', height: '2px', backgroundColor: '#4AAFE8', borderRadius: '2px' }} />
          </>
        )}
      </motion.button>

      {/* Menú Lateral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000',
                zIndex: 108,
              }}
            />

            {/* Panel del Sidebar */}
            <motion.div
              initial={{ x: '-100%', borderTopRightRadius: '100px', borderBottomRightRadius: '100px' }}
              animate={{ x: 0, borderTopRightRadius: '40px', borderBottomRightRadius: '40px' }}
              exit={{ x: '-100%', borderTopRightRadius: '100px', borderBottomRightRadius: '100px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                backgroundColor: 'rgba(13, 33, 55, 0.94)',
                backdropFilter: 'blur(20px)',
                borderRight: '2px solid rgba(74, 175, 232, 0.5)',
                boxShadow: '0 0 35px rgba(74, 175, 232, 0.25)',
                zIndex: 109,
                display: 'flex',
                flexDirection: 'column',
                padding: '80px 24px 30px',
                overflowY: 'auto',
              }}
            >
              {/* Header del Sidebar */}
              <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'outfit, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'white',
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  GETXO <span style={{ color: '#4AAFE8', fontStyle: 'italic', fontWeight: 300 }}>BELA</span>
                </h2>
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: '#4AAFE8',
                  margin: '8px auto 0',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px #4AAFE8'
                }} />
              </div>

              {/* Enlaces de Secciones de la Landing Page */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
                <p style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(74, 175, 232, 0.6)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  paddingLeft: '12px'
                }}>Navegación</p>
                
                {sections.map((sec) => (
                  <motion.button
                    key={sec.progress}
                    onClick={() => scrollToProgress(sec.progress)}
                    whileHover={{ scale: 1.02, x: 6, backgroundColor: 'rgba(74, 175, 232, 0.15)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 18px',
                      borderRadius: '25px',
                      border: '1px solid transparent',
                      backgroundColor: 'transparent',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                  >
                    <span style={{ color: '#4AAFE8', display: 'flex', alignItems: 'center' }}>{sec.icon}</span>
                    {sec.label[locale as keyof typeof sec.label] || sec.label.es}
                  </motion.button>
                ))}
              </div>

              {/* Separador */}
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0 12px 1.5rem' }} />

              {/* Enlaces a otras Páginas Web */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: 'auto' }}>
                <p style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(74, 175, 232, 0.6)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  paddingLeft: '12px'
                }}>Secciones</p>

                {externalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255,255,255,0.03)', color: 'white' }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '20px',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                    >
                      <span style={{ color: 'rgba(74, 175, 232, 0.7)', display: 'flex', alignItems: 'center' }}>{link.icon}</span>
                      {link.label[locale as keyof typeof link.label] || link.label.es}
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Footer del Sidebar */}
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                Getxo Bela Eskola &copy; {new Date().getFullYear()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
