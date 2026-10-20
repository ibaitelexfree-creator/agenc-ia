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
    Check, 
    PartyPopper, 
    Warehouse, 
    Sailboat,
    Users,
    Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SociasPageVariant2() {
    const [isManifestoExpanded, setIsManifestoExpanded] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<'anual' | 'mensual'>('anual');

    const cards = [
        {
            id: 'basica',
            title: 'Socia Básica',
            tagline: 'Ideal para conocer gente y salir con regularidad',
            anualPrice: '630 €',
            anualPeriod: '/ año',
            mensualPrice: 'No disponible',
            semestreTag: 'Opción 6 meses: 340 €',
            features: [
                'Hasta 30 salidas al año (4-5 horas por salida)',
                'Crucero J80 o vela ligera de la escuela',
                'Acceso a grupo de WhatsApp de tripulaciones',
                'Navega acompañada o por libre según nivel',
                'Sin cuotas mensuales de mantenimiento'
            ],
            obligatorio: 'Licencia Federación (~64€/año)',
            ctaText: 'Elegir Socia Básica',
            ctaLink: '/contacto/localizacion',
            isSpecialLink: false,
            highlight: false,
            badge: 'Más Popular'
        },
        {
            id: 'entrenamientos',
            title: 'Socia Entrenamientos',
            tagline: 'Entrena y tecnifica tu navegación con instructor (Sept-Jun)',
            anualPrice: '1.000 €',
            anualPeriod: '/ año (Sept – Jun)',
            mensualPrice: '110 €',
            mensualPeriod: '/ mes (mín. 3 meses)',
            semestreTag: 'Para probar con preferencia de plaza',
            features: [
                '3 entrenamientos técnicos al mes (4h cada sesión)',
                'Entrenador dedicado para corrección de maniobra',
                'Navegación orientada a progresión y técnica',
                'Reserva tu plaza con mínimo de 3 meses',
                '¡Haz clic para ver toda la sección de equipos!'
            ],
            obligatorio: 'Licencia Federación (~64€/año)',
            ctaText: 'Ver Equipos de Entrenamiento ↗',
            ctaLink: '/servicios/equipos',
            isSpecialLink: true,
            highlight: true,
            badge: 'Ir a Equipos ↗'
        },
        {
            id: 'premium-plus',
            title: 'Socia Premium+ (Pack Completo)',
            tagline: 'Tecnificación + Salidas ilimitadas: La experiencia total',
            anualPrice: '1.200 €',
            anualPeriod: '/ año (10 meses)',
            mensualPrice: 'Pago único anual',
            semestreTag: 'Septiembre a Junio (Julio/Ago opcionales)',
            features: [
                'Participación en entrenamientos tecnificación adultas',
                'Salidas ILIMITADAS durante todo el año',
                'Crucero J80 y vela ligera a tu disposición',
                'La combinación definitiva de formación y disfrute libre',
                'Integración directa en regatas y ambiente de club'
            ],
            obligatorio: 'Licencia Federación (~64€/año)',
            ctaText: 'Quiero el Pack Completo',
            ctaLink: '/contacto/localizacion',
            isSpecialLink: false,
            highlight: false,
            badge: 'Recomendado'
        },
        {
            id: 'premium',
            title: 'Socia Premium',
            tagline: 'Navegación libre ilimitada a lo largo de todo el año',
            anualPrice: '1.000 €',
            anualPeriod: '/ año',
            mensualPrice: '110 €',
            mensualPeriod: '/ mes',
            semestreTag: 'Libertad absoluta en el agua',
            features: [
                'Salidas ilimitadas durante todo el año',
                'Disponibilidad de flota J80 y vela ligera',
                'Coordinación en grupo de WhatsApp',
                'Autonomía y flexibilidad horaria máxima',
                'Acceso continuo a vestuarios e instalaciones'
            ],
            obligatorio: 'Licencia Federación (~64€/año)',
            ctaText: 'Elegir Socia Premium',
            ctaLink: '/contacto/localizacion',
            isSpecialLink: false,
            highlight: false,
            badge: 'Ilimitado'
        },
        {
            id: 'windsurf',
            title: 'Socia Windsurf',
            tagline: 'Especializada para amantes del viento y tablas',
            anualPrice: '600 €',
            anualPeriod: '/ año',
            mensualPrice: 'No disponible',
            semestreTag: 'Uso del material del club',
            features: [
                '30 salidas al año con aparejo de windsurf',
                'Tablas y velas adaptadas a tu nivel',
                'Salida directa desde la rampa del puerto',
                'Ambiente deportivo y seguimiento del viento'
            ],
            obligatorio: 'Licencia Federación (~64€/año)',
            ctaText: 'Elegir Socia Windsurf',
            ctaLink: '/contacto/localizacion',
            isSpecialLink: false,
            highlight: false,
            badge: 'Windsurf'
        }
    ];

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            
            {/* Barra selectora de variantes */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-300 backdrop-blur-sm sticky top-16 z-30">
                <span className="font-bold">PROPUESTA 2:</span> Tarjetas de Precios Visuales e Interactivas · 
                <Link href="/servicios/socias1" className="underline ml-2 hover:text-white font-medium">← Ver Propuesta 1 (Matriz)</Link>
                <Link href="/servicios/socias3" className="underline ml-3 hover:text-white font-medium">Ver Propuesta 3 (Pestañas por Perfil) →</Link>
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
                            Una comunidad cercana donde las personas son lo primero. Hacemos la vela accesible a todos los bolsillos, con navegación y entrenamientos a precio inmejorable.
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
                                href="#planes"
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

            {/* SECCIÓN PRICING CARDS */}
            <section id="planes" className="py-14 md:py-24 relative w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    
                    <div className="max-w-3xl mx-auto text-center mb-8 space-y-3">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            Tarifas Socias
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                            Encuentra tu modalidad en el club
                        </h2>
                        <p className="text-xs sm:text-sm text-foreground/60">
                            Precios transparentes y sin sorpresas. Selecciona la periodicidad preferida.
                        </p>

                        {/* Toggle Anual / Mensual */}
                        <div className="pt-3 inline-flex items-center p-1 rounded-full bg-sea-foam/5 border border-sea-foam/15">
                            <button
                                onClick={() => setBillingPeriod('anual')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                    billingPeriod === 'anual'
                                        ? 'bg-accent text-nautical-black shadow-md'
                                        : 'text-sea-foam/70 hover:text-white'
                                }`}
                            >
                                Cuota Anual (Ahorro)
                            </button>
                            <button
                                onClick={() => setBillingPeriod('mensual')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                    billingPeriod === 'mensual'
                                        ? 'bg-accent text-nautical-black shadow-md'
                                        : 'text-sea-foam/70 hover:text-white'
                                }`}
                            >
                                Cuota Mensual
                            </button>
                        </div>
                    </div>

                    {/* Grid de Tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
                        {cards.map((card) => {
                            const isSpecial = card.isSpecialLink;

                            const cardBody = (
                                <div className={`relative h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                                    isSpecial
                                        ? 'bg-gradient-to-b from-amber-500/[0.12] to-nautical-deep/90 border-amber-400/60 shadow-xl shadow-amber-500/10 hover:border-amber-300 hover:scale-[1.01]'
                                        : card.id === 'premium-plus'
                                        ? 'bg-gradient-to-b from-sea-foam/[0.08] to-nautical-deep/80 border-accent/40 shadow-lg'
                                        : 'bg-nautical-deep/70 border-sea-foam/15 hover:border-sea-foam/30'
                                }`}>
                                    <div>
                                        {/* Header de la tarjeta */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                                                isSpecial
                                                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                                                    : 'bg-sea-foam/10 border-sea-foam/20 text-sea-foam/80'
                                            }`}>
                                                {card.badge}
                                            </span>
                                            <span className="text-[11px] text-foreground/50 font-medium">
                                                Obligatorio Federación
                                            </span>
                                        </div>

                                        <h3 className={`text-xl sm:text-2xl font-display uppercase tracking-tight ${isSpecial ? 'text-amber-300' : 'text-sea-foam'}`}>
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-foreground/70 mt-1 min-h-[32px]">
                                            {card.tagline}
                                        </p>

                                        {/* Precio */}
                                        <div className="my-6 pt-4 border-t border-sea-foam/10">
                                            {billingPeriod === 'anual' ? (
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-3xl sm:text-4xl font-display font-bold ${isSpecial ? 'text-amber-300' : 'text-accent'}`}>
                                                            {card.anualPrice}
                                                        </span>
                                                        <span className="text-xs text-foreground/60">{card.anualPeriod}</span>
                                                    </div>
                                                    {card.semestreTag && (
                                                        <p className="text-xs text-amber-300/80 font-medium mt-1">
                                                            ↳ {card.semestreTag}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-3xl sm:text-4xl font-display font-bold ${isSpecial ? 'text-amber-300' : 'text-accent'}`}>
                                                            {card.mensualPrice}
                                                        </span>
                                                        {card.mensualPeriod && <span className="text-xs text-foreground/60">{card.mensualPeriod}</span>}
                                                    </div>
                                                    <p className="text-xs text-foreground/60 mt-1">
                                                        Anual equivalente: {card.anualPrice}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lista de características */}
                                        <ul className="space-y-3 text-xs sm:text-sm text-foreground/80 my-6">
                                            {card.features.map((feat, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isSpecial ? 'text-amber-300' : 'text-accent'}`} />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Footer / Botón */}
                                    <div className="pt-4 border-t border-sea-foam/10 mt-auto">
                                        {isSpecial ? (
                                            <div className="w-full py-3 px-4 rounded-xl bg-amber-400 text-nautical-black font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 group-hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20">
                                                <span>Ver Equipos de Entrenamiento</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <Link
                                                href={card.ctaLink}
                                                className="w-full block py-3 px-4 rounded-xl bg-sea-foam/10 hover:bg-accent hover:text-nautical-black text-sea-foam font-bold text-xs uppercase tracking-wider text-center transition-colors border border-sea-foam/20"
                                            >
                                                {card.ctaText}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );

                            if (isSpecial) {
                                return (
                                    <Link key={card.id} href={card.ctaLink} className="block group">
                                        {cardBody}
                                    </Link>
                                );
                            }

                            return <div key={card.id}>{cardBody}</div>;
                        })}
                    </div>

                    {/* Nota aclaratoria sobre Federación */}
                    <div className="mt-10 p-5 rounded-xl bg-sea-foam/[0.02] border border-sea-foam/10 text-xs sm:text-sm text-foreground/70 flex items-start gap-4 max-w-4xl mx-auto">
                        <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-sea-foam block mb-1">
                                Seguro federativo obligatorio (FVV):
                            </span>
                            Para navegar como socia o en entrenamientos es indispensable federarse en la Federación Vasca de Vela. Esto otorga seguro complementario a la escuela y permite participar en regatas federadas. Suele ser aproximadamente 64 € anuales.
                        </div>
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
