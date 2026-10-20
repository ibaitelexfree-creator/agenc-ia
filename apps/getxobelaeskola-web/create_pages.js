const fs = require('fs');
const path = require('path');

// ==========================================
// 1. VARIANTE 1: Matriz Comparativa Compacta
// ==========================================
const page1 = `'use client';

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
    Sailboat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SociasPageVariant1() {
    const [isManifestoExpanded, setIsManifestoExpanded] = useState(false);

    const tarifas = [
        {
            id: 'basica',
            tipo: 'Socia básica',
            badge: 'Popular',
            subtitulo: 'Salidas en crucero J80 o vela ligera organizadas con tripulaciones',
            precioAnual: '630 €',
            precioMensual: 'No hay',
            precioSemestral: '340 € / 6 meses (Ene-Jun o Jul-Ago)',
            uso: '30 salidas al año (4-5h c/u)',
            obligatorio: 'Federación (~64€/año)',
            link: null,
            destacado: false,
        },
        {
            id: 'entrenamientos',
            tipo: 'Socia entrenamientos (Sept – Jun)',
            badge: 'Ir a Equipos ↗',
            subtitulo: 'Entrena y tecnifica tu navegación en grupo con instructor',
            precioAnual: '1.000 €',
            precioMensual: '110 € / mes (para probar, preferencia continuos)',
            precioSemestral: 'Reserva plaza, mínimo 3 meses',
            uso: '3 entrenamientos al mes (4h por sesión)',
            obligatorio: 'Federación (~64€/año)',
            link: '/servicios/equipos',
            destacado: true,
        },
        {
            id: 'premium',
            tipo: 'Socia premium',
            badge: 'Libertad Total',
            subtitulo: 'Para quienes quieren navegar libremente sin límite de salidas',
            precioAnual: '1.000 €',
            precioMensual: '110 € / mes',
            precioSemestral: '—',
            uso: 'Salidas ilimitadas durante todo el año',
            obligatorio: 'Federación (~64€/año)',
            link: null,
            destacado: false,
        },
        {
            id: 'premium-plus',
            tipo: 'Socia premium+ (Pack Tecnificación)',
            badge: 'Todo Incluido',
            subtitulo: 'La fórmula más completa: entrenar y navegar sin límites',
            precioAnual: '1.200 €',
            precioMensual: '—',
            precioSemestral: '10 meses (Sept a Junio)',
            uso: 'Entrenamientos estructurados y salidas ilimitadas',
            obligatorio: 'Federación (~64€/año)',
            link: null,
            destacado: true,
        },
        {
            id: 'windsurf',
            tipo: 'Socia windsurf',
            badge: 'Especial Wind',
            subtitulo: 'Acceso y disfrute de los aparejos y tablas de windsurf',
            precioAnual: '600 €',
            precioMensual: 'No hay',
            precioSemestral: '—',
            uso: '30 salidas de navegación',
            obligatorio: 'Federación (~64€/año)',
            link: null,
            destacado: false,
        }
    ];

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            
            {/* Barra selectora de variantes */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-300 backdrop-blur-sm sticky top-16 z-30">
                <span className="font-bold">PROPUESTA 1:</span> Matriz Comparativa y Desglose Progresivo · 
                <Link href="/servicios/socias2" className="underline ml-2 hover:text-white font-medium">Ver Propuesta 2 (Tarjetas Pricing) →</Link>
                <Link href="/servicios/socias3" className="underline ml-3 hover:text-white font-medium">Ver Propuesta 3 (Pestañas por Perfil) →</Link>
            </div>

            {/* HERO & MANIFIESTO INTERACTIVO */}
            <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-nautical-deep w-full border-b border-sea-foam/10">
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

                        <div className="space-y-4 max-w-3xl mx-auto text-foreground/80 font-light text-sm sm:text-base md:text-lg leading-relaxed">
                            <p>
                                Ser parte de Getxo Bela Eskola es entrar en una comunidad que vive la mar desde la cercanía y el acompañamiento. Las personas son lo primero. Nos ayudamos entre todas.
                            </p>
                            <p className="text-foreground/70 text-xs sm:text-sm md:text-base">
                                Aunque la vela suele parecer un mundo elitista, aquí la hacemos accesible para todos los públicos y todos los bolsillos: ser socia permite navegar y entrenar a un precio inmejorable, demostrando que navegar nunca había sido tan accesible.
                            </p>
                        </div>

                        {/* Botones de acción del hero */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <button
                                onClick={() => setIsManifestoExpanded(!isManifestoExpanded)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sea-foam/5 border border-sea-foam/20 text-xs uppercase tracking-wider font-semibold text-sea-foam hover:bg-sea-foam/10 transition-colors"
                            >
                                {isManifestoExpanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 text-accent" />
                                        Cerrar filosofía
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 text-accent" />
                                        ▼ Leer más
                                    </>
                                )}
                            </button>

                            <a
                                href="#tarifas"
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

            {/* TABLA DE TARIFAS INTERACTIVA */}
            <section id="tarifas" className="py-14 md:py-24 relative w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    
                    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 space-y-3">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            Oferta y Precios
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                            Tarifas de Socias
                        </h2>
                        <p className="text-xs sm:text-sm text-foreground/60">
                            Precios claros y accesibles. Haz clic en la fila de entrenamientos para ver el equipo completo.
                        </p>
                    </div>

                    {/* Matriz interactiva de escritorio */}
                    <div className="hidden lg:block overflow-hidden rounded-2xl border border-sea-foam/20 bg-nautical-deep/60 backdrop-blur-md shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-sea-foam/15 bg-sea-foam/[0.03] text-xs font-black uppercase tracking-widest text-sea-foam/70">
                                    <th className="py-4 px-6">Tipo de socia</th>
                                    <th className="py-4 px-6 text-center">Precio anual</th>
                                    <th className="py-4 px-6 text-center">Precio mensual</th>
                                    <th className="py-4 px-6">Uso</th>
                                    <th className="py-4 px-6 text-center">Obligatorio</th>
                                    <th className="py-4 px-6 text-right">Información</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sea-foam/10 text-sm">
                                {tarifas.map((item) => {
                                    const isClickableLink = !!item.link;

                                    const rowContent = (
                                        <>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={\`font-display font-medium text-base \${isClickableLink ? 'text-amber-300 underline underline-offset-4 decoration-amber-400/50' : 'text-sea-foam'}\`}>
                                                        {item.tipo}
                                                    </span>
                                                    {item.badge && (
                                                        <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border \${
                                                            isClickableLink 
                                                                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300' 
                                                                : 'bg-sea-foam/10 border-sea-foam/20 text-sea-foam/70'
                                                        }\`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-foreground/60 mt-1 max-w-sm">
                                                    {item.subtitulo}
                                                </p>
                                                {item.precioSemestral !== '—' && (
                                                    <p className="text-[11px] text-amber-300/80 mt-1 font-medium">
                                                        ↳ {item.precioSemestral}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-5 px-6 text-center font-display text-lg text-sea-foam font-bold">
                                                {item.precioAnual}
                                            </td>

                                            <td className="py-5 px-6 text-center text-xs text-foreground/80">
                                                {item.precioMensual}
                                            </td>

                                            <td className="py-5 px-6 text-xs text-foreground/85">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                    <span>{item.uso}</span>
                                                </div>
                                            </td>

                                            <td className="py-5 px-6 text-center text-xs text-foreground/70">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sea-foam/5 border border-sea-foam/15">
                                                    <Shield className="w-3 h-3 text-accent" />
                                                    {item.obligatorio}
                                                </span>
                                            </td>

                                            <td className="py-5 px-6 text-right">
                                                {isClickableLink ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 px-3 py-1.5 rounded-full transition-colors group-hover:scale-105 transform">
                                                        Página Equipos <ExternalLink className="w-3.5 h-3.5" />
                                                    </span>
                                                ) : (
                                                    <Link 
                                                        href="/contacto/localizacion" 
                                                        className="inline-flex items-center gap-1 text-xs text-sea-foam/60 hover:text-accent font-semibold transition-colors"
                                                    >
                                                        Consultar <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                            </td>
                                        </>
                                    );

                                    if (isClickableLink) {
                                        return (
                                            <tr 
                                                key={item.id}
                                                onClick={() => window.location.href = item.link}
                                                className="cursor-pointer bg-amber-500/[0.04] hover:bg-amber-500/[0.12] transition-colors group border-l-4 border-amber-400"
                                                title="Haz clic para ver la página de equipos de entrenamiento"
                                            >
                                                {rowContent}
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr 
                                            key={item.id} 
                                            className="hover:bg-sea-foam/[0.04] transition-colors"
                                        >
                                            {rowContent}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Versión móvil en tarjetas limpias */}
                    <div className="lg:hidden space-y-4">
                        {tarifas.map((item) => {
                            const isClickableLink = !!item.link;

                            const cardContent = (
                                <div className={\`p-5 rounded-xl border backdrop-blur-md space-y-4 \${
                                    isClickableLink 
                                        ? 'bg-gradient-to-b from-amber-500/[0.08] to-transparent border-amber-400/50 hover:border-amber-300' 
                                        : 'bg-nautical-deep/60 border-sea-foam/15'
                                }\`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className={\`font-display text-base font-bold block \${isClickableLink ? 'text-amber-300' : 'text-sea-foam'}\`}>
                                                {item.tipo}
                                            </span>
                                            <p className="text-xs text-foreground/60 mt-0.5">
                                                {item.subtitulo}
                                            </p>
                                        </div>
                                        {item.badge && (
                                            <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 \${
                                                isClickableLink 
                                                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-300' 
                                                    : 'bg-sea-foam/10 border-sea-foam/20 text-sea-foam/70'
                                            }\`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-3 pt-2 border-t border-sea-foam/10">
                                        <div>
                                            <span className="text-xs text-foreground/60 block">Precio Anual</span>
                                            <span className="font-display text-2xl font-bold text-accent">
                                                {item.precioAnual}
                                            </span>
                                        </div>
                                        {item.precioMensual !== '—' && (
                                            <div className="border-l border-sea-foam/10 pl-3">
                                                <span className="text-xs text-foreground/60 block">Mensual</span>
                                                <span className="text-xs font-semibold text-sea-foam">
                                                    {item.precioMensual}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {item.precioSemestral !== '—' && (
                                        <p className="text-xs text-amber-300/90 font-medium">
                                            ↳ {item.precioSemestral}
                                        </p>
                                    )}

                                    <div className="space-y-1.5 text-xs text-foreground/80">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                                            <span>{item.uso}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/60">
                                            <Shield className="w-3.5 h-3.5 text-sea-foam/40 shrink-0" />
                                            <span>Obligatorio: {item.obligatorio}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {isClickableLink ? (
                                            <div className="flex items-center justify-between text-xs font-bold text-amber-300 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/30">
                                                <span>Ver página de equipos de entrenamiento</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <Link
                                                href="/contacto/localizacion"
                                                className="block text-center py-2 px-4 rounded-lg bg-sea-foam/5 border border-sea-foam/15 text-xs font-semibold text-sea-foam hover:bg-sea-foam/10 transition-colors"
                                            >
                                                Solicitar información
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );

                            if (isClickableLink) {
                                return (
                                    <Link key={item.id} href={item.link} className="block">
                                        {cardContent}
                                    </Link>
                                );
                            }

                            return <div key={item.id}>{cardContent}</div>;
                        })}
                    </div>

                    {/* Nota aclaratoria sobre Federación */}
                    <div className="mt-8 p-4 sm:p-6 rounded-xl bg-sea-foam/[0.02] border border-sea-foam/10 text-xs sm:text-sm text-foreground/70 flex items-start gap-4 max-w-4xl mx-auto">
                        <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-sea-foam block mb-1">
                                Federación y Seguro:
                            </span>
                            En todas las opciones es necesario federarse en la Federación Vasca de Vela, lo que permite contar con un seguro complementario al de la escuela y participar en regatas en caso de querer hacerlo. El coste de la licencia federativa suele ser aproximadamente 64 € anuales.
                        </div>
                    </div>

                </div>
            </section>

            {/* SECCIÓN DETALLES PROFUNDOS: OPCIONES DEL CLUB */}
            <section className="py-14 md:py-20 bg-sea-foam/[0.02] border-t border-b border-sea-foam/10 w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            Opciones del Club
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-sea-foam mt-1">
                            ¿Qué incluye cada modalidad?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tarjeta Socia Básica */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-nautical-deep/80 border border-sea-foam/15 flex flex-col justify-between space-y-4">
                            <div>
                                <span className="text-xs uppercase font-bold text-accent tracking-widest block">Modalidad 1</span>
                                <h3 className="text-xl font-display text-sea-foam uppercase mt-1">SOCIA BÁSICA</h3>
                                <div className="text-2xl font-display font-bold text-accent mt-2">630 € <span className="text-xs text-foreground/60 font-sans">/ año</span></div>
                                <div className="text-xs text-amber-300/80 font-medium mt-0.5">Opción medio año: 15 salidas por 350 €</div>

                                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/80">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span>Hasta <strong>30 salidas al año</strong> de 4-5 horas cada una (en crucero J80 o vela ligera).</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span><strong>Acceso a un grupo de WhatsApp</strong> donde se forman tripulaciones y se organizan salidas.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span>Posibilidad de navegar con otras personas o salir por tu cuenta, según nivel y condiciones.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                        <span>Ideal para conocer gente, aprender de otras navegantes y disfrutar de la navegación en grupo.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-sea-foam/10">
                                <Link
                                    href="/contacto/localizacion"
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-accent hover:underline"
                                >
                                    Solicitar plaza Socia Básica →
                                </Link>
                            </div>
                        </div>

                        {/* Tarjeta Pack Completo */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-nautical-deep/80 border border-amber-400/40 flex flex-col justify-between space-y-4">
                            <div>
                                <span className="text-xs uppercase font-bold text-amber-300 tracking-widest block">Modalidad Completa · Recomendada</span>
                                <h3 className="text-xl font-display text-sea-foam uppercase mt-1">PACK COMPLETO: TECNIFICACIÓN + SOCIA</h3>
                                <div className="text-2xl font-display font-bold text-amber-300 mt-2">1.200 € <span className="text-xs text-foreground/60 font-sans">/ año</span></div>
                                <div className="text-xs text-foreground/60 mt-0.5">10 meses al año (Septiembre a Junio · Julio y Agosto opcionales, no incluidos)</div>

                                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/80">
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                        <span><strong>Participación en los entrenamientos del equipo de tecnificación</strong> (entrenamiento para adultas): 3 días al mes, 4 horas cada día.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                        <span><strong>Salidas ilimitadas como socia</strong> (J80 o vela ligera).</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                        <span><strong>La opción más completa:</strong> entrenar de forma estructurada y, además, navegar libremente durante todo el año.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-sea-foam/10 flex items-center justify-between">
                                <Link
                                    href="/servicios/equipos"
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amber-300 hover:text-white transition-colors"
                                >
                                    Ver Equipos de Entrenamiento ↗
                                </Link>
                                <Link
                                    href="/contacto/localizacion"
                                    className="text-xs font-semibold text-sea-foam/70 hover:text-sea-foam"
                                >
                                    Apuntarme
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN SERVICIOS RELACIONADOS: ATRAQUES, GUARDERÍA Y CUMPLEAÑOS */}
            <section className="py-14 md:py-24 relative w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
                    <div className="text-center mb-10 space-y-2">
                        <span className="text-accent uppercase tracking-[0.3em] text-xs font-black">
                            SOCIAS, ATRAQUES Y CUMPLEAÑOS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-sea-foam">
                            Otros Servicios Náuticos del Club
                        </h2>
                        <p className="text-xs sm:text-sm text-foreground/60 max-w-xl mx-auto">
                            Todo lo que necesitas en el Puerto Deportivo de Getxo para ti, tu embarcación o tus celebraciones.
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
`;

// ==========================================
// 2. VARIANTE 2: Tarjetas Pricing Visuales Modernas
// ==========================================
const page2 = `'use client';

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
                                className={\`px-5 py-2 rounded-full text-xs font-bold transition-all \${
                                    billingPeriod === 'anual'
                                        ? 'bg-accent text-nautical-black shadow-md'
                                        : 'text-sea-foam/70 hover:text-white'
                                }\`}
                            >
                                Cuota Anual (Ahorro)
                            </button>
                            <button
                                onClick={() => setBillingPeriod('mensual')}
                                className={\`px-5 py-2 rounded-full text-xs font-bold transition-all \${
                                    billingPeriod === 'mensual'
                                        ? 'bg-accent text-nautical-black shadow-md'
                                        : 'text-sea-foam/70 hover:text-white'
                                }\`}
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
                                <div className={\`relative h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl border backdrop-blur-md transition-all duration-300 \${
                                    isSpecial
                                        ? 'bg-gradient-to-b from-amber-500/[0.12] to-nautical-deep/90 border-amber-400/60 shadow-xl shadow-amber-500/10 hover:border-amber-300 hover:scale-[1.01]'
                                        : card.id === 'premium-plus'
                                        ? 'bg-gradient-to-b from-sea-foam/[0.08] to-nautical-deep/80 border-accent/40 shadow-lg'
                                        : 'bg-nautical-deep/70 border-sea-foam/15 hover:border-sea-foam/30'
                                }\`}>
                                    <div>
                                        {/* Header de la tarjeta */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className={\`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border \${
                                                isSpecial
                                                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                                                    : 'bg-sea-foam/10 border-sea-foam/20 text-sea-foam/80'
                                            }\`}>
                                                {card.badge}
                                            </span>
                                            <span className="text-[11px] text-foreground/50 font-medium">
                                                Obligatorio Federación
                                            </span>
                                        </div>

                                        <h3 className={\`text-xl sm:text-2xl font-display uppercase tracking-tight \${isSpecial ? 'text-amber-300' : 'text-sea-foam'}\`}>
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
                                                        <span className={\`text-3xl sm:text-4xl font-display font-bold \${isSpecial ? 'text-amber-300' : 'text-accent'}\`}>
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
                                                        <span className={\`text-3xl sm:text-4xl font-display font-bold \${isSpecial ? 'text-amber-300' : 'text-accent'}\`}>
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
                                                    <Check className={\`w-4 h-4 shrink-0 mt-0.5 \${isSpecial ? 'text-amber-300' : 'text-accent'}\`} />
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
`;

// ==========================================
// 3. VARIANTE 3: Pestañas por Perfil de Navegante
// ==========================================
const page3 = `'use client';

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
                            className={\`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap \${
                                activeTab === 'comunidad'
                                    ? 'border-accent text-accent font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }\`}
                        >
                            <HeartHandshake className="w-4 h-4" />
                            1. Navegación Libre y Social
                        </button>

                        <button
                            onClick={() => setActiveTab('competicion')}
                            className={\`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap \${
                                activeTab === 'competicion'
                                    ? 'border-amber-400 text-amber-300 font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }\`}
                        >
                            <Trophy className="w-4 h-4" />
                            2. Entrenamientos y Tecnificación
                        </button>

                        <button
                            onClick={() => setActiveTab('windsurf')}
                            className={\`pb-4 px-6 font-display text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap \${
                                activeTab === 'windsurf'
                                    ? 'border-accent text-accent font-bold'
                                    : 'border-transparent text-sea-foam/60 hover:text-white'
                            }\`}
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
`;

fs.writeFileSync('src/app/[locale]/servicios/socias1/page.tsx', page1, 'utf8');
fs.writeFileSync('src/app/[locale]/servicios/socias2/page.tsx', page2, 'utf8');
fs.writeFileSync('src/app/[locale]/servicios/socias3/page.tsx', page3, 'utf8');
console.log('ALL THREE PAGES CREATED SUCCESSFULLY');