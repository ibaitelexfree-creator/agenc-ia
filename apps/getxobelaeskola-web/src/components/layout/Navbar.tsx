'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
    X, ChevronDown, Anchor, Wind, Sailboat, Users, 
    GraduationCap, Phone, School, Compass, Sparkles,
    ShoppingBag, BookOpen, Heart, Briefcase, Clock, MapPin
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { apiUrl } from '@/lib/api';
import dynamic from 'next/dynamic';
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { springPopup } from '@/lib/animations/variants';

const ThemeToggle = dynamic(() => import('@/components/shared/ThemeToggle'), { ssr: false });

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

// Localized labels to ensure reliability across locales
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
    trabaja_con_nosotras: { es: 'Trabaja con nosotras', eu: 'Lan egin gurekin', en: 'Work with us', fr: 'Travaillez avec nous' },
    horario_contacto_localizacion: { es: 'Horario, Contacto y Localización', eu: 'Ordutegia, Kontaktua eta Kokapena', en: 'Hours, Contact & Location', fr: 'Horaires, Contact & Localisation' },
    logout: { es: 'Cerrar Sesión', eu: 'Saioa itxi', en: 'Logout', fr: 'Déconnexion' },
    login: { es: 'Acceso', eu: 'Saioa hasi', en: 'Login', fr: 'Connexion' },
    admin_panel: { es: 'Panel de Control', eu: 'Kudeaketa panela', en: 'Admin Panel', fr: 'Panneau de gestion' },
    dashboard: { es: 'Mi Área', eu: 'Nire Eremua', en: 'My Area', fr: 'Mon Espace' },
    language_selector: { es: 'Cambiar Idioma', eu: 'Hizkuntza aldatu', en: 'Change Language', fr: 'Changer de langue' }
};

export default function Navbar({ locale: propLocale }: { locale?: string }) {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const locale = propLocale || (params.locale as string) || 'es';

    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const getLabel = (key: string) => {
        return localizedLabels[key]?.[locale] || key;
    };

    useEffect(() => {
        const supabase = createClient();
        (async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const res = await fetch(apiUrl(`/api/profile?user_id=${authUser.id}`));
                    if (res.ok) {
                        const profile = await res.json();
                        setUser({ ...authUser, ...profile } as AuthUser);
                    } else {
                        setUser(authUser as unknown as AuthUser);
                    }
                }
            } catch {
                // Silently handle auth errors
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setIsMenuOpen(false);
        router.push(`/${locale}`);
    };

    const handleLanguageSwitch = (langCode: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(es|eu|en|fr)/, '');
        router.push(`/${langCode}${pathWithoutLocale || '/'}`);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    // Restructured navigation tree according to requirements
    const navItems: NavItem[] = [
        {
            href: '',
            label: 'home',
            icon: <Compass className="w-3.5 h-3.5" />,
        },
        {
            href: 'club/conocenos',
            label: 'club',
            icon: <Anchor className="w-3.5 h-3.5" />,
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
            icon: <GraduationCap className="w-3.5 h-3.5" />,
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
            icon: <BookOpen className="w-3.5 h-3.5" />,
            dropdown: [
                { href: 'blog/noticias', label: 'noticias_y_eventos', icon: <BookOpen className="w-4 h-4" /> },
                { href: 'blog/aprendizaje', label: 'aprendizaje', icon: <GraduationCap className="w-4 h-4" /> },
            ],
        },
        {
            href: 'contacto/localizacion',
            label: 'contacto',
            icon: <Phone className="w-3.5 h-3.5" />,
            dropdown: [
                { href: 'contacto/voluntaria', label: 'hazte_voluntaria', icon: <Heart className="w-4 h-4" /> },
                { href: 'contacto/trabaja-con-nosotras', label: 'trabaja_con_nosotras', icon: <Briefcase className="w-4 h-4" /> },
                { href: 'contacto/localizacion', label: 'horario_contacto_localizacion', icon: <Clock className="w-4 h-4" /> },
            ],
        },
        {
            href: 'tienda',
            label: 'tienda',
            icon: <ShoppingBag className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[9999] px-4 md:px-12 py-4 md:py-8 flex justify-between items-center bg-[#010409]/90 backdrop-blur-2xl border-b border-white/5 transition-all duration-500 hover:bg-[#010409]/95 min-h-[70px]">
                {/* Logo Section */}
                <Link
                    href={`/${locale}`}
                    prefetch={false}
                    className="flex items-center gap-4 group transition-premium relative z-[110]"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 transition-premium group-hover:scale-110">
                        <Image
                            src="/images/LogoGetxoBelaEskola.webp"
                            alt="Getxo Bela Eskola"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-lg md:text-2xl tracking-tight text-white leading-none uppercase">
                            GETXO <span className="italic font-light text-accent">BELA</span>
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold mt-1.5 transition-premium group-hover:text-white/70">Escuela Náutica</span>
                    </div>
                </Link>

                {/* Desktop Menu - Custom Framer Motion dropdowns */}
                <div className="hidden xl:flex gap-8 items-center text-[10px] uppercase tracking-[0.4em] font-black h-full">
                    {navItems.map((item) => (
                        <div 
                            key={item.label} 
                            className="relative h-full flex items-center"
                            onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={`/${locale}/${item.href}`}
                                prefetch={false}
                                className="relative py-4 text-white/40 hover:text-white transition-premium group/nav flex items-center gap-1.5"
                            >
                                {item.icon}
                                {getLabel(item.label)}
                                {item.dropdown && (
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180 text-accent' : ''}`} />
                                )}
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-premium group-hover/nav:w-full" />
                            </Link>

                            {/* Dropdown Panel with AnimatePresence */}
                            <AnimatePresence>
                                {item.dropdown && activeDropdown === item.label && (
                                    <motion.div 
                                        variants={springPopup}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[10000]"
                                    >
                                        <div className="w-64 py-3 bg-[#010409] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                                            {/* Simple Arrow */}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#010409] border-l border-t border-white/10 rotate-45" />

                                            {item.dropdown.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={`/${locale}/${sub.href}`}
                                                    prefetch={false}
                                                    className="flex items-center gap-3 px-6 py-4 text-[10px] uppercase tracking-[0.25em] font-bold text-white/75 hover:text-white hover:bg-white/5 transition-all duration-200 group/sub"
                                                >
                                                    <span className="text-accent/60 group-hover/sub:text-accent transition-colors">{sub.icon}</span>
                                                    {getLabel(sub.label)}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex gap-4 items-center relative z-[110]">
                    <div className="hidden xl:block">
                        <ThemeToggle />
                    </div>
                    <div className="hidden xl:flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5 transition-premium hover:border-white/20">
                        {['es', 'eu', 'en', 'fr'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageSwitch(lang)}
                                className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black transition-premium ${locale === lang ? 'bg-accent text-nautical-black shadow-xl shadow-accent/20 scale-105' : 'text-white/40 hover:text-white'}`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="hidden xl:block w-32 h-10 bg-white/5 animate-pulse rounded-full" />
                    ) : user ? (
                        <div className="hidden xl:flex gap-8 items-center">
                            {user.status_socio === 'activo' && (
                                <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-brass-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-premium hover:border-brass-gold/60 group/member">
                                    <Sparkles className="w-3.5 h-3.5 text-brass-gold transition-premium group-hover:rotate-45" />
                                    <span className="text-brass-gold text-[9px] font-black uppercase tracking-[0.3em]">
                                        MEMBER
                                    </span>
                                </div>
                            )}
                            <Link
                                href={user.rol === 'admin' || user.rol === 'instructor' ? `/${locale}/staff` : `/${locale}/student/dashboard`}
                                prefetch={false}
                                className="text-[10px] uppercase tracking-[0.3em] font-black text-accent border border-accent/20 px-6 py-3 rounded-full hover:bg-accent hover:text-nautical-black shadow-lg shadow-accent/5 transition-premium"
                            >
                                {user.rol === 'admin' || user.rol === 'instructor' ? getLabel('admin_panel') : getLabel('dashboard')}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 hover:text-red-500 transition-premium border-b border-transparent hover:border-red-500/30 pb-1"
                            >
                                {getLabel('logout')}
                            </button>
                        </div>
                    ) : (
                        <Link href={`/${locale}/auth/login`} prefetch={false} className="hidden xl:block text-[10px] uppercase tracking-[0.4em] font-black border border-white/20 px-8 py-3 rounded-full bg-white/5 hover:bg-white hover:text-nautical-black transition-premium">
                            {getLabel('login')}
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                            setMobileExpanded(null);
                        }}
                        className="xl:hidden flex-shrink-0 w-14 h-14 flex items-center justify-center bg-accent text-nautical-black rounded-full shadow-2xl relative z-[10000] transition-premium hover:scale-110 active:scale-95 shadow-accent/30"
                    >
                        {isMenuOpen ? <X size={24} strokeWidth={3} /> : (
                            <div className="flex flex-col gap-1 w-6">
                                <span className="block w-full h-0.5 bg-nautical-black rounded-full" />
                                <span className="block w-3/4 h-0.5 bg-nautical-black rounded-full ml-auto" />
                                <span className="block w-full h-0.5 bg-nautical-black rounded-full" />
                            </div>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[90] bg-nautical-deep transition-all duration-700 xl:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-maps opacity-5 pointer-events-none" />
                <div className="flex flex-col h-full pt-32 pb-12 px-8 overflow-y-auto">
                    <div className="flex flex-col gap-4 mb-12">
                        {navItems.map((item, idx) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/${locale}/${item.href}`}
                                        prefetch={false}
                                        className="group flex items-center gap-4 flex-1"
                                        style={{ transitionDelay: `${idx * 80}ms` }}
                                        onClick={() => { if (!item.dropdown) setIsMenuOpen(false); }}
                                    >
                                        <span className="text-accent/60">{item.icon}</span>
                                        <span className={`text-3xl font-display italic transition-all duration-500 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                                            {getLabel(item.label)}
                                        </span>
                                    </Link>

                                    {item.dropdown && (
                                        <button
                                            onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                            className="p-3 text-white/40 hover:text-accent transition-colors"
                                        >
                                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === item.label ? 'rotate-180 text-accent' : ''}`} />
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {item.dropdown && mobileExpanded === item.label && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                                            className="ml-10 mt-2 mb-4 flex flex-col gap-1 border-l-2 border-accent/20 pl-6 overflow-hidden"
                                        >
                                            {item.dropdown.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={`/${locale}/${sub.href}`}
                                                    prefetch={false}
                                                    className="flex items-center gap-3 py-3 text-lg text-white/50 hover:text-white transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <span className="text-accent/50">{sub.icon}</span>
                                                    {getLabel(sub.label)}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Language & Auth */}
                    <div className={`space-y-10 transition-all duration-700 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {user ? (
                            <div className="flex flex-col gap-4">
                                <Link
                                    href={user.rol === 'admin' || user.rol === 'instructor' ? `/${locale}/staff` : `/${locale}/student/dashboard`}
                                    prefetch={false}
                                    className="w-full text-center py-6 bg-accent text-nautical-black font-display italic text-2xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {user.rol === 'admin' || user.rol === 'instructor' ? getLabel('admin_panel') : getLabel('dashboard')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-center py-4 text-white/40 uppercase text-[10px] tracking-[0.4em] font-black"
                                >
                                    {getLabel('logout')}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={`/${locale}/auth/login`}
                                prefetch={false}
                                className="w-full block text-center py-6 border border-white/20 text-white font-display italic text-2xl bg-white/5"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {getLabel('login')}
                            </Link>
                        )}

                        <div className="flex flex-col gap-4 pb-12">
                            <div className="flex items-center justify-between ml-4 mr-4 mb-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">Theme</span>
                                <ThemeToggle />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 ml-4">{getLabel('language_selector')}</span>
                            <div className="grid grid-cols-4 gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
                                {['es', 'eu', 'en', 'fr'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageSwitch(lang)}
                                        className={`py-4 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${locale === lang ? 'bg-white text-nautical-black shadow-xl' : 'text-white/40'}`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
