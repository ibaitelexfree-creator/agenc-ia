'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Sparkles, 
    Anchor, 
    Shield, 
    ChevronDown, 
    ChevronUp, 
    ArrowRight, 
    ExternalLink, 
    CheckCircle2, 
    PartyPopper, 
    Warehouse, 
    Sailboat,
    Wind,
    Trophy,
    HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SociasPageVariant3() {
    const [isManifestoExpanded, setIsManifestoExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'comunidad' | 'competicion' | 'windsurf'>('comunidad');

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            
            {/* Barra selectora de variantes */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-300 backdrop-blur-sm sticky top-16 z-30">
                <span className="font-bold">PROPUESTA 3:</span> Enfoque por Perfiles y Objetivos (Tabs) · 
                <Link href="/servicios/socias1" className="underline ml-2 hover:text-white font-medium">← Ver Propuesta 1 (Matriz)</Link>
                <Link href="/servicios/socias2" className="underline ml-3 hover:text-white font-medium">Ver Propuesta 2 (Tarjetas Pricing) →</Link>
            </div>

            {/* HERO & MANIFIESTO INTERACTIVO */}
            <section className="relative pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-nautical-deep w-full border-b border-sea-foam/10">
                <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brass-gold/10 border border-brass-gold/25 text-brass-gold text-xs font-black tracking-widest uppercase animate-fade-in-up">
                            <Sparkles className="w-3.5 h-3.5" />
                            Comunidad Getxo Bela Eskola
                        </span>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight text-sea-foam leading-tight">
                            CLUB DE SOCI@S
                        </h1>

                        <p className="text-foreground/80 font-light text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            Ser parte de Getxo Bela Eskola es pertenecer a una comunidad que comparte la mar desde la cercanía, la calma y el compañerismo. Las personas son el corazón de la Eskola.
                        </p>

                        {/* Botones de acción del hero */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <button
                                onClick={() => setIsManifestoExpanded(!isManifestoExpanded)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sea-foam/5 border border-sea-foam/20 text-xs uppercase tracking-wider font-semibold text-sea-foam hover:bg-sea-foam/10 transition-colors"
                            >
                                {isManifestoExpanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 text-accent" />
                                        Cerrar manifiesto
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 text-accent" />
                                        ▼ Leer más
                                    </>
                                )}
                            </button>

                            <a
                                href="#perfiles"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-nautical-black text-xs uppercase tracking-wider font-black hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                            >
                                <Anchor className="w-4 h-4" />
                                ⚓ Hazte socia
                            </a>
                        </div>

                        {/* Desplegable del Manifiesto Completo */}
                        <AnimatePresence>
                            {isManifestoExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-black/40 border border-sea-foam/15 text-left text-xs sm:text-sm text-foreground/75 leading-relaxed space-y-4 shadow-xl backdrop-blur-md">
                                        <div className="flex items-center gap-3 border-b border-sea-foam/10 pb-3">
                                            <Sparkles className="w-5 h-5 text-accent shrink-0" />
                                            <h3 className="font-display uppercase tracking-wider text-sea-foam text-base sm:text-lg">
                                                CLUB DE SOCIAS · Nuestra Filosofía
                                            </h3>
                                        </div>
                                        <p>
                                            Ser parte de Getxo Bela Eskola es pertenecer a una comunidad que comparte la mar desde la cercanía, la calma y el compañerismo. Las personas son el corazón de la Eskola, y aquí la navegación se vive sin prisas y sin distancias.
                                        </p>
                                        <p>
                                            Aunque la vela suele verse como un mundo elitista, con precios inaccesibles para la mayoría, nuestro objetivo es justo el contrario: acercar la navegación a todos los públicos y a todos los bolsillos. Por eso ser socia permite disfrutar de embarcaciones, salidas y entrenamientos a un precio inmejorable, haciendo que navegar, por primera vez, deje de ser un lujo y se convierta en algo alcanzable y cotidiano.
                                        </p>
                                        <p>
                                            Las socias aprenden a su ritmo, sin presión y con acompañamiento real, y también forman parte de la vida interna del club: propuestas, ideas, mejoras y decisiones compartidas.
                                        </p>
                                        <p>
                                            Aquí no hablamos de clientas, sino de compañeras de travesía: personas diversas que se ayudan, se escuchan y encuentran en la Eskola un lugar donde sentirse parte de algo más grande.
                                        </p>
                                        <p>
                                            Un espacio para navegar en comunidad, a tu ritmo y sin prisas. Hacemos la vela accesible a todos los públicos y bolsillos, a un precio inmejorable, en un entorno cercano, cuidado y humano.
                                        </p>
                                        <p className="font-medium text-accent">
                                            El Club de Socias es una forma de dar continuidad a la navegación y de crear un vínculo estable con la escuela. No se trata solo de venir un día puntual, sino de tener un espacio propio donde seguir practicando, ganando autonomía y compartiendo la mar con otras personas. Aquí no se trata solo de alquilar una embarcación, sino de formar parte de una comunidad que aprende, evoluciona y disfruta junta. Navegamos acompañándonos, compartiendo conocimientos, dudas y experiencias, creciendo de manera progresiva y segura.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* SECCIÓN INTERACTIVA POR PERFILES */}
            <section id="perfiles" className="py-14 md:py-24 relative w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
                    
                    <div className="text-center mb-10 space-y-3">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            ¿Cuál es tu objetivo?
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                            Selecciona tu forma de navegar
                        </h2>
                    </div>

                    {/* Selector de Pestañas */}
                    <div className="flex justify-center border-b border-sea-foam/15 mb-10 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('comunidad')}
                            className={`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'comunidad'
                                    ? 'border-accent text-accent font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }`}
                        >
                            <HeartHandshake className="w-4 h-4" />
                            1. Navegación Libre y Social
                        </button>

                        <button
                            onClick={() => setActiveTab('competicion')}
                            className={`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'competicion'
                                    ? 'border-amber-400 text-amber-300 font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }`}
                        >
                            <Trophy className="w-4 h-4" />
                            2. Entrenamientos y Tecnificación
                        </button>

                        <button
                            onClick={() => setActiveTab('windsurf')}
                            className={`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'windsurf'
                                    ? 'border-accent text-accent font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }`}
                        >
                            <Wind className="w-4 h-4" />
                            3. Windsurf
                        </button>
                    </div>

                    {/* Contenido de las pestañas */}
                    <div>
                        {activeTab === 'comunidad' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                {/* Card Socia Básica */}
                                <div className="p-6 sm:p-8 rounded-2xl bg-nautical-deep/80 border border-sea-foam/15 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-accent uppercase tracking-widest">30 Salidas</span>
                                            <span className="text-xs text-sea-foam/60">Obligatorio Federación</span>
                                        </div>
                                        <h3 className="text-2xl font-display text-sea-foam">SOCIA BÁSICA</h3>
                                        <div className="text-3xl font-display font-bold text-accent">630 € <span className="text-xs font-sans text-foreground/60">/ año</span></div>
                                        <p className="text-xs text-amber-300 font-medium">↳ Opción medio año: 15 salidas por 340 € (Ene-Jun o Jul-Ago)</p>
                                        <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 pt-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> 30 salidas al año de 4-5 horas</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Crucero J80 o vela ligera</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> WhatsApp para formar tripulaciones</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Salidas con acompañamiento o por tu cuenta</li>
                                        </ul>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-sea-foam/10">
                                        <Link href="/contacto/localizacion" className="block text-center py-2.5 rounded-xl bg-accent text-nautical-black font-bold text-xs uppercase tracking-wider">
                                            Elegir Socia Básica
                                        </Link>
                                    </div>
                                </div>

                                {/* Card Socia Premium */}
                                <div className="p-6 sm:p-8 rounded-2xl bg-nautical-deep/80 border border-sea-foam/15 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-sea-foam/80 uppercase tracking-widest">Salidas Ilimitadas</span>
                                            <span className="text-xs text-sea-foam/60">Obligatorio Federación</span>
                                        </div>
                                        <h3 className="text-2xl font-display text-sea-foam">SOCIA PREMIUM</h3>
                                        <div className="text-3xl font-display font-bold text-sea-foam">1.000 € <span className="text-xs font-sans text-foreground/60">/ año o 110€/mes</span></div>
                                        <p className="text-xs text-foreground/60">Navega cuantas veces quieras todo el año</p>
                                        <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 pt-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Salidas ilimitadas en crucero J80 y vela ligera</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Máxima disponibilidad y flexibilidad horaria</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Sin límite de horas o reservas anuales</li>
                                        </ul>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-sea-foam/10">
                                        <Link href="/contacto/localizacion" className="block text-center py-2.5 rounded-xl bg-sea-foam/10 hover:bg-sea-foam/20 text-sea-foam font-bold text-xs uppercase tracking-wider border border-sea-foam/20">
                                            Elegir Socia Premium
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'competicion' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                {/* Card Entrenamientos con Link a Equipos */}
                                <Link 
                                    href="/servicios/equipos"
                                    className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-500/[0.12] to-nautical-deep/80 border-2 border-amber-400/60 hover:border-amber-300 transition-all flex flex-col justify-between shadow-xl"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                                                Haz clic: Ver equipos ↗
                                            </span>
                                            <span className="text-xs text-sea-foam/60">Sept – Jun</span>
                                        </div>
                                        <h3 className="text-2xl font-display text-amber-300">SOCIA ENTRENAMIENTOS</h3>
                                        <div className="text-3xl font-display font-bold text-sea-foam">1.000 € <span className="text-xs font-sans text-foreground/60">/ año</span></div>
                                        <p className="text-xs text-amber-300/80 font-medium">110 € / mes (para probar, preferencia continuos · mín. 3 meses)</p>
                                        <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 pt-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 3 entrenamientos al mes de 4 horas cada uno</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Reserva de plaza asegurada</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Instrucción técnica de maniobra y táctica</li>
                                        </ul>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-amber-400/20 flex items-center justify-between text-amber-300 text-xs font-bold uppercase">
                                        <span>Ir a la página de Equipos</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </Link>

                                {/* Card Premium+ Tecnificación */}
                                <div className="p-6 sm:p-8 rounded-2xl bg-nautical-deep/80 border border-accent/40 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-accent uppercase tracking-widest">Opción más completa</span>
                                            <span className="text-xs text-sea-foam/60">10 Meses</span>
                                        </div>
                                        <h3 className="text-2xl font-display text-sea-foam">SOCIA PREMIUM+</h3>
                                        <div className="text-3xl font-display font-bold text-accent">1.200 € <span className="text-xs font-sans text-foreground/60">/ año</span></div>
                                        <p className="text-xs text-foreground/60">Entrenamientos estructurados + Salidas ilimitadas</p>
                                        <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 pt-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Equipo tecnificación adultas: 3 días/mes (4h/día)</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Salidas ilimitadas durante todo el año</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> J80 o vela ligera</li>
                                        </ul>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-sea-foam/10">
                                        <Link href="/contacto/localizacion" className="block text-center py-2.5 rounded-xl bg-accent text-nautical-black font-bold text-xs uppercase tracking-wider">
                                            Elegir Socia Premium+
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'windsurf' && (
                            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-nautical-deep/80 border border-sea-foam/15 text-center space-y-4 animate-fade-in">
                                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto text-accent">
                                    <Wind className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-display text-sea-foam">SOCIA WINDSURF</h3>
                                <div className="text-4xl font-display font-bold text-accent">600 € <span className="text-xs font-sans text-foreground/60">/ año</span></div>
                                <p className="text-xs sm:text-sm text-foreground/70">
                                    Disfruta de 30 salidas de navegación al año con el material de windsurf de Getxo Bela Eskola.
                                </p>
                                <div className="p-3 rounded-lg bg-sea-foam/5 text-xs text-foreground/60">
                                    Requisito obligatorio: Licencia federativa en la Federación Vasca de Vela (~64€/año).
                                </div>
                                <div className="pt-4">
                                    <Link href="/contacto/localizacion" className="inline-block px-8 py-3 rounded-xl bg-accent text-nautical-black font-bold text-xs uppercase tracking-wider">
                                        Solicitar plaza Windsurf
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* SECCIÓN SERVICIOS RELACIONADOS: ATRAQUES, GUARDERÍA Y CUMPLEAÑOS */}
            <section className="py-14 md:py-24 bg-sea-foam/[0.02] border-t border-sea-foam/10 relative w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
                    <div className="text-center mb-10 space-y-2">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            SOCIAS, ATRAQUES Y CUMPLEAÑOS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                            Otros Servicios Náuticos del Club
                        </h2>
                        <p className="text-xs sm:text-sm text-foreground/60 max-w-xl mx-auto">
                            Descubre las instalaciones y actividades que ofrecemos en el Puerto Deportivo de Getxo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card Equipos */}
                        <Link 
                            href="/servicios/equipos"
                            className="group p-6 rounded-2xl bg-nautical-deep/60 border border-sea-foam/15 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                                    <Sailboat className="w-6 h-6" />
                                </div>
                                <h3 className="font-display text-lg text-sea-foam uppercase group-hover:text-amber-300 transition-colors">
                                    Equipos de Entrenamiento
                                </h3>
                                <p className="text-xs text-foreground/70 leading-relaxed">
                                    Grupos continuos para adultas, jóvenes e infantiles. Perfecciona maniobras, táctica y regatas en el Abra.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 mt-4 group-hover:translate-x-1 transition-transform">
                                Ver equipos y calendarios →
                            </span>
                        </Link>

                        {/* Card Guarda Material / Atraques */}
                        <Link 
                            href="/servicios/material"
                            className="group p-6 rounded-2xl bg-nautical-deep/60 border border-sea-foam/15 hover:border-accent transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                    <Warehouse className="w-6 h-6" />
                                </div>
                                <h3 className="font-display text-lg text-sea-foam uppercase group-hover:text-accent transition-colors">
                                    Guarda Material y Atraques
                                </h3>
                                <p className="text-xs text-foreground/70 leading-relaxed">
                                    Pañol seguro para tus tablas de windsurf, kayaks, paddle surf o atraques para veleros con acceso a vestuarios y rampa.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent mt-4 group-hover:translate-x-1 transition-transform">
                                Ver pañol y atraques →
                            </span>
                        </Link>

                        {/* Card Cumpleaños y Eventos */}
                        <Link 
                            href="/servicios/cumpleanos"
                            className="group p-6 rounded-2xl bg-nautical-deep/60 border border-sea-foam/15 hover:border-rose-400/60 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-rose-400/10 border border-rose-400/30 flex items-center justify-center text-rose-300">
                                    <PartyPopper className="w-6 h-6" />
                                </div>
                                <h3 className="font-display text-lg text-sea-foam uppercase group-hover:text-rose-300 transition-colors">
                                    Celebra Aquí Tu Día
                                </h3>
                                <p className="text-xs text-foreground/70 leading-relaxed">
                                    Cumpleaños, despedidas y eventos privados en la bahía de Getxo con veleros, Big SUP y zona chill out con catering.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 mt-4 group-hover:translate-x-1 transition-transform">
                                Descubrir eventos y cumpleaños →
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-14 md:py-24 bg-nautical-deep border-t border-sea-foam/10 text-center relative">
                <div className="container mx-auto px-4 max-w-xl space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                        ¿Hablamos y te vienes a navegar?
                    </h2>
                    <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        Si tienes dudas sobre qué modalidad encaja mejor contigo o quieres probar antes, escríbenos o ven a conocernos al puerto.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/contacto/localizacion"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-nautical-black text-xs uppercase tracking-widest font-black hover:bg-accent-hover transition-colors shadow-xl shadow-accent/20"
                        >
                            <Anchor className="w-4 h-4" />
                            Contactar con la Eskola
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
