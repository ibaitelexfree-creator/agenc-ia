'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Anchor, Shield, Star, Award, ChevronRight, Users, Gift } from 'lucide-react';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import HoverImage from '@/components/shared/HoverImage';
import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/animations/variants';
import { useTranslations } from 'next-intl';

export default function ClubSociasPage() {
    const t = useTranslations('club_socias');
    
    const benefits = [
        {
            icon: <Anchor className="w-8 h-8 text-accent" />,
            title: t('benefits.b1_title'),
            desc: t('benefits.b1_desc')
        },
        {
            icon: <Users className="w-8 h-8 text-accent" />,
            title: t('benefits.b2_title'),
            desc: t('benefits.b2_desc')
        },
        {
            icon: <Shield className="w-8 h-8 text-accent" />,
            title: t('benefits.b3_title'),
            desc: t('benefits.b3_desc')
        },
        {
            icon: <Star className="w-8 h-8 text-accent" />,
            title: t('benefits.b4_title'),
            desc: t('benefits.b4_desc')
        },
        {
            icon: <Award className="w-8 h-8 text-accent" />,
            title: t('benefits.b5_title'),
            desc: t('benefits.b5_desc')
        },
        {
            icon: <Gift className="w-8 h-8 text-accent" />,
            title: t('benefits.b6_title'),
            desc: t('benefits.b6_desc')
        }
    ];

    return (
        <main className="min-h-screen bg-nautical-black text-white selection:bg-accent selection:text-nautical-black">
            {/* Cinematic Hero */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-nautical-deep">
                <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <header className="max-w-4xl mx-auto space-y-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brass-gold/10 border border-brass-gold/20 text-brass-gold text-xs font-black tracking-widest uppercase mb-4 animate-fade-in-up">
                            <Sparkles className="w-3.5 h-3.5" />
                            {t('title')}
                        </span>
                        <h1 className="text-5xl md:text-8xl font-display text-white leading-none uppercase">
                            Forma parte de <br />
                            <span className="italic font-light text-accent/90">nuestra tripulación</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-foreground/50 font-light text-xl leading-relaxed border-l-2 border-white/5 pl-8 md:pl-12 mt-12 text-left md:text-center">
                            {t('subtitle')} {t('description2')}
                        </p>
                    </header>
                </div>
            </section>

            {/* Split Image & Text Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <StaggeredEntrance type="slide" className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-6">
                            <div className="relative aspect-[4/3] group">
                                <div className="absolute -top-6 -right-6 w-full h-full border border-white/5 group-hover:-top-2 group-hover:-right-2 transition-all duration-700" />
                                <HoverImage
                                    src="/images/home-hero-sailing-action.webp"
                                    alt="Sailing action"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    containerClassName="h-full shadow-2xl"
                                    imageClassName="object-cover scale-110 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tight">
                                Mucho más que navegar, <br />
                                <span className="italic font-light text-accent">un estilo de vida compartido</span>
                            </h2>
                            <p className="text-foreground/60 font-light text-lg leading-relaxed">
                                {t('description1')}
                            </p>
                        </div>
                    </StaggeredEntrance>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-32 relative bg-black/10 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <header className="mb-24 text-center">
                        <span className="text-accent uppercase tracking-[0.5em] text-xs font-black mb-4 block">Beneficios Exclusivos</span>
                        <h2 className="text-3xl md:text-5xl font-display">Ventajas de ser miembro</h2>
                        <div className="w-24 h-px bg-accent/40 mx-auto mt-6" />
                    </header>

                    <StaggeredEntrance type="slide" staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                {...hoverLift}
                                className="bg-white/[0.01] border border-white/5 p-10 rounded-2xl flex flex-col gap-6 backdrop-blur-sm shadow-md cursor-pointer hover:border-accent/30 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-black/20">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-display text-white group-hover:text-accent">
                                    {benefit.title}
                                </h3>
                                <p className="text-white/40 text-sm font-light leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </motion.div>
                        ))}
                    </StaggeredEntrance>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-24 md:py-32 relative bg-nautical-deep overflow-hidden border-t border-white/5 text-center">
                <div className="absolute inset-0 bg-maps opacity-5 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 space-y-12">
                    <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight">
                        ¿Listo para unirte a la tripulación?
                    </h2>
                    <p className="text-white/50 text-lg font-light max-w-xl mx-auto leading-relaxed">
                        Ponte en contacto con nuestro equipo administrativo para solicitar tu alta de socia o realizar una prueba de navegación con nuestros instructores.
                    </p>
                    <div className="pt-6">
                        <Link
                            href="/contacto/localizacion"
                            className="inline-flex items-center gap-3 border border-accent bg-accent/5 px-10 py-5 rounded-full text-xs uppercase tracking-[0.3em] font-black text-accent hover:bg-accent hover:text-nautical-black transition-premium shadow-lg shadow-accent/15 group"
                        >
                            Solicitar Información
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
