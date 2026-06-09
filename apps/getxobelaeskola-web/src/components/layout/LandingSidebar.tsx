'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
    X, ChevronDown, Anchor, Wind, Sailboat, Users, 
    GraduationCap, Phone, School, Compass, Sparkles,
    ShoppingBag, BookOpen, Heart, Briefcase, Clock, MapPin
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { apiUrl } from '@/lib/api'
import { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'

const ThemeToggle = dynamic(() => import('@/components/shared/ThemeToggle'), { ssr: false })

interface NavDropdownItem {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

interface NavItem {
    href: string;
    label: string;
    icon?: React.ReactNode;
    dropdown?: NavDropdownItem[];
}

interface AuthUser extends User {
    rol?: string;
    status_socio?: string;
    [key: string]: unknown;
}

const localizedLabels: Record<string, Record<string, string>> = {
    home: { es: 'Inicio', eu: 'Hasiera', en: 'Home', fr: 'Accueil' },
    club: { es: 'Club', eu: 'Kluba', en: 'Club', fr: 'Club' },
    conocenos: { es: 'Conócenos', eu: 'Ezagutu gaitzazu', en: 'About us', fr: 'Qui sommes-nous' },
    club_de_socias: { es: 'Club de socias', eu: 'Bazkideen kluba', en: 'Members club', fr: 'Club des membres' },
    regatas: { es: 'Regatas', eu: 'Estropadak', en: 'Regattas', fr: 'Régates' },
    que_es_la_vela: { es: 'Qué es la vela', eu: 'Zer da bela', en: 'What is sailing', fr: 'Qu\'est-ce que la voile' },
    servicios: { es: 'Servicios', eu: 'Zerbitzuak', en: 'Services', fr: 'Services' },
    cursos: { es: 'Cursos', eu: 'Ikastaroak', en: 'Courses', fr: 'Cours' },
    equipos_de_entrenamiento: { es: 'Equipos de entrenamiento', eu: 'Entrenamendu taldeak', en: 'Training teams', fr: 'Équipes d\'entraînement' },
    udalekuak: { es: 'Udalekuak', eu: 'Udalekuak', en: 'Summer camps', fr: 'Camps d\'été' },
    centros_escolares_y_asociaciones: { es: 'Centros escolares y asociaciones', eu: 'Ikastetxeak eta elkarteak', en: 'Schools & associations', fr: 'Écoles & associations' },
    alquileres: { es: 'Alquileres', eu: 'Alokairuak', en: 'Rentals', fr: 'Locations' },
    team_building: { es: 'Team building', eu: 'Team building', en: 'Team building', fr: 'Team building' },
    celebra_aqui_tu_dia: { es: 'Celebra aquí tu día', eu: 'Ospatu hemen zure eguna', en: 'Celebrate your day here', fr: 'Célébrez votre journée ici' },
    guarda_tu_material_deportivo: { es: 'Guarda tu material deportivo', eu: 'Gorde zure kirol materiala', en: 'Store your sports gear', fr: 'Stockez votre matériel sportif' },
    tienda: { es: 'Tienda', eu: 'Denda', en: 'Shop', fr: 'Boutique' },
    blog: { es: 'Blog', eu: 'Bloga', en: 'Blog', fr: 'Blog' },
    noticias_y_eventos: { es: 'Noticias y eventos', eu: 'Albisteak eta gertaerak', en: 'News & events', fr: 'Actualités & événements' },
    aprendizaje: { es: 'Aprendizaje', eu: 'Ikaskuntza', en: 'Learning', fr: 'Apprentissage' },
    contacto: { es: 'Contacto', eu: 'Kontaktua', en: 'Contact', fr: 'Contact' },
    hazte_voluntaria: { es: 'Hazte voluntaria', eu: 'Egin zaitez boluntario', en: 'Become a volunteer', fr: 'Devenir bénévole' },
    trabaja_con_nosotras: { es: 'Trabaja con nosotras', eu: 'Lan egin gurekin', en: 'Work with us', fr: 'Trabaillez avec nous' },
    horario_contacto_localizacion: { es: 'Horario, Contacto y Localización', eu: 'Ordutegia, Kontaktua eta Kokapena', en: 'Hours, Contact & Location', fr: 'Horaires, Contact & Localisation' },
    logout: { es: 'Cerrar Sesión', eu: 'Saioa itxi', en: 'Logout', fr: 'Déconnexion' },
    login: { es: 'Acceso', eu: 'Saioa hasi', en: 'Login', fr: 'Connexion' },
    admin_panel: { es: 'Panel de Control', eu: 'Kudeaketa panela', en: 'Admin Panel', fr: 'Panneau de gestion' },
    dashboard: { es: 'Mi Área', eu: 'Nire Eremua', en: 'My Area', fr: 'Mon Espace' },
    language_selector: { es: 'Cambiar Idioma', eu: 'Hizkuntza aldatu', en: 'Change Language', fr: 'Changer de langue' }
}

export function LandingSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const getLabel = (key: string) => {
    return localizedLabels[key]?.[locale] || key
  }

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const res = await fetch(apiUrl(`/api/profile?user_id=${authUser.id}`))
          if (res.ok) {
            const profile = await res.json()
            setUser({ ...authUser, ...profile } as AuthUser)
          } else {
            setUser(authUser as unknown as AuthUser)
          }
        }
      } catch {
        // Silently ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
    router.push(`/${locale}`)
  }

  const handleLanguageSwitch = (langCode: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(es|eu|en|fr)/, '')
    router.push(`/${langCode}${pathWithoutLocale || '/'}`)
    setIsOpen(false)
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

  const navItems: NavItem[] = [
    {
        href: '',
        label: 'home',
        icon: <Compass className="w-4 h-4" />,
    },
    {
        href: 'club/conocenos',
        label: 'club',
        icon: <Anchor className="w-4 h-4" />,
        dropdown: [
            { href: 'club/conocenos', label: 'conocenos', icon: <Users className="w-4 h-4" /> },
            { href: 'club/socias', label: 'club_de_socias', icon: <Sparkles className="w-4 h-4" /> },
            { href: 'club/regatas', label: 'regatas', icon: <Sailboat className="w-4 h-4" /> },
            { href: 'club/que-es-la-vela', label: 'que_es_la_vela', icon: <Wind className="w-4 h-4" /> },
        ],
    },
    {
        href: 'servicios/cursos',
        label: 'servicios',
        icon: <GraduationCap className="w-4 h-4" />,
        dropdown: [
            { href: 'servicios/cursos', label: 'cursos', icon: <GraduationCap className="w-4 h-4" /> },
            { href: 'servicios/socias', label: 'club_de_socias', icon: <Sparkles className="w-4 h-4" /> },
            { href: 'servicios/equipos', label: 'equipos_de_entrenamiento', icon: <Users className="w-4 h-4" /> },
            { href: 'servicios/udalekuak', label: 'udalekuak', icon: <School className="w-4 h-4" /> },
            { href: 'servicios/centros-escolares', label: 'centros_escolares_y_asociaciones', icon: <Anchor className="w-4 h-4" /> },
            { href: 'servicios/alquileres', label: 'alquileres', icon: <Sailboat className="w-4 h-4" /> },
            { href: 'servicios/team-building', label: 'team_building', icon: <Compass className="w-4 h-4" /> },
            { href: 'servicios/cumpleanos', label: 'celebra_aqui_tu_dia', icon: <Sparkles className="w-4 h-4" /> },
            { href: 'servicios/material', label: 'guarda_tu_material_deportivo', icon: <Anchor className="w-4 h-4" /> },
            { href: 'servicios/tienda', label: 'tienda', icon: <ShoppingBag className="w-4 h-4" /> },
        ],
    },
    {
        href: 'blog/noticias',
        label: 'blog',
        icon: <BookOpen className="w-4 h-4" />,
        dropdown: [
            { href: 'blog/noticias', label: 'noticias_y_eventos', icon: <BookOpen className="w-4 h-4" /> },
            { href: 'blog/aprendizaje', label: 'aprendizaje', icon: <GraduationCap className="w-4 h-4" /> },
        ],
    },
    {
        href: 'contacto/localizacion',
        label: 'contacto',
        icon: <Phone className="w-4 h-4" />,
        dropdown: [
            { href: 'contacto/voluntaria', label: 'hazte_voluntaria', icon: <Heart className="w-4 h-4" /> },
            { href: 'contacto/trabaja-con-nosotras', label: 'trabaja_con_nosotras', icon: <Briefcase className="w-4 h-4" /> },
            { href: 'contacto/localizacion', label: 'horario_contacto_localizacion', icon: <Clock className="w-4 h-4" /> },
        ],
    },
    {
        href: 'tienda',
        label: 'tienda',
        icon: <ShoppingBag className="w-4 h-4" />,
    },
  ]

  const toggleExpand = (label: string) => {
    if (expandedItem === label) {
      setExpandedItem(null)
    } else {
      setExpandedItem(label)
    }
  }

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
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(13, 33, 55, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #4AAFE8',
          boxShadow: '0 0 15px rgba(74, 175, 232, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4.5px',
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
              initial={{ x: '-100%', borderTopRightRadius: '120px', borderBottomRightRadius: '120px' }}
              animate={{ x: 0, borderTopRightRadius: '45px', borderBottomRightRadius: '45px' }}
              exit={{ x: '-100%', borderTopRightRadius: '120px', borderBottomRightRadius: '120px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '340px',
                maxWidth: '85vw',
                backgroundColor: 'rgba(13, 33, 55, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '2px solid rgba(74, 175, 232, 0.5)',
                boxShadow: '0 0 35px rgba(74, 175, 232, 0.3)',
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
                  width: '45px',
                  height: '2.5px',
                  backgroundColor: '#4AAFE8',
                  margin: '8px auto 0',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px #4AAFE8'
                }} />
              </div>

              {/* Navigation Items (Accordion Style) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                {navItems.map((item) => {
                  const hasDropdown = !!item.dropdown;
                  const isExpanded = expandedItem === item.label;

                  return (
                    <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
                      {hasDropdown ? (
                        <motion.button
                          onClick={() => toggleExpand(item.label)}
                          whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(74, 175, 232, 0.12)' }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'between',
                            width: '100%',
                            padding: '12px 18px',
                            borderRadius: '25px',
                            border: '1px solid transparent',
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            textTransform: 'uppercase',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexGrow: 1 }}>
                            <span style={{ color: '#4AAFE8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                            {getLabel(item.label)}
                          </div>
                          <ChevronDown 
                            className="w-4 h-4 text-[#4AAFE8] transition-transform duration-300"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </motion.button>
                      ) : (
                        <Link href={`/${locale}/${item.href}`} style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                          <motion.div
                            whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(74, 175, 232, 0.12)' }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '12px 18px',
                              borderRadius: '25px',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                            }}
                          >
                            <span style={{ color: '#4AAFE8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                            {getLabel(item.label)}
                          </motion.div>
                        </Link>
                      )}

                      {/* Dropdown content */}
                      <AnimatePresence initial={false}>
                        {hasDropdown && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{
                              overflow: 'hidden',
                              paddingLeft: '24px',
                              marginTop: '4px',
                              borderLeft: '2px solid rgba(74, 175, 232, 0.3)',
                              marginLeft: '26px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            {item.dropdown!.map((sub) => (
                              <Link
                                key={sub.href}
                                href={`/${locale}/${sub.href}`}
                                style={{ textDecoration: 'none' }}
                                onClick={() => setIsOpen(false)}
                              >
                                <motion.div
                                  whileHover={{ x: 4, color: '#4AAFE8' }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '15px',
                                    color: 'rgba(255,255,255,0.75)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em',
                                  }}
                                >
                                  <span style={{ color: 'rgba(74, 175, 232, 0.6)', display: 'flex', alignItems: 'center' }}>{sub.icon}</span>
                                  {getLabel(sub.label)}
                                </motion.div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {/* Separador */}
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0 12px 1.5rem' }} />

              {/* Controles de Idioma, Tema y Usuario */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Theme & Language */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TEMA</span>
                  <ThemeToggle />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '2px' }}>
                    {getLabel('language_selector')}
                  </span>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '4px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(74, 175, 232, 0.25)',
                    borderRadius: '20px',
                    padding: '4px',
                  }}>
                    {['es', 'eu', 'en', 'fr'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSwitch(lang)}
                        style={{
                          padding: '8px 0',
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: locale === lang ? '#4AAFE8' : 'transparent',
                          color: locale === lang ? '#0D2137' : 'rgba(255,255,255,0.5)',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s',
                        }}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth Session Info */}
                <div style={{ marginTop: '0.5rem' }}>
                  {loading ? (
                    <div style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', animate: 'pulse' }} />
                  ) : user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {user.status_socio === 'activo' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(197, 160, 89, 0.3)',
                          boxShadow: '0 0 15px rgba(197, 160, 89, 0.1)',
                          color: '#c5a059',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          letterSpacing: '0.15em',
                        }}>
                          <Sparkles className="w-3.5 h-3.5" />
                          MEMBER
                        </div>
                      )}
                      
                      <Link 
                        href={user.rol === 'admin' || user.rol === 'instructor' ? `/${locale}/staff` : `/${locale}/student/dashboard`}
                        style={{ textDecoration: 'none' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, backgroundColor: '#4AAFE8', color: '#0D2137' }}
                          style={{
                            textAlign: 'center',
                            padding: '12px',
                            borderRadius: '25px',
                            border: '1.5px solid #4AAFE8',
                            color: '#4AAFE8',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                          }}
                        >
                          {user.rol === 'admin' || user.rol === 'instructor' ? getLabel('admin_panel') : getLabel('dashboard')}
                        </motion.div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          padding: '8px 0',
                          textTransform: 'uppercase',
                          fontFamily: 'inherit',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                      >
                        {getLabel('logout')}
                      </button>
                    </div>
                  ) : (
                    <Link href={`/${locale}/auth/login`} style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ scale: 1.02, backgroundColor: 'white', color: '#0D2137', border: '1.5px solid white' }}
                        style={{
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: '25px',
                          border: '1.5px solid rgba(255,255,255,0.25)',
                          color: 'white',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s',
                        }}
                      >
                        {getLabel('login')}
                      </motion.div>
                    </Link>
                  )}
                </div>

                {/* Footer del Sidebar */}
                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>
                  Getxo Bela Eskola &copy; {new Date().getFullYear()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
