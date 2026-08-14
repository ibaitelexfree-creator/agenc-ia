'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import { hoverLift } from '@/lib/animations/variants';
import { motion } from 'framer-motion';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    image: string;
    slug: string;
}

interface LatestBlogPostsProps {
    locale: string;
    posts?: BlogPost[];
}

export default function LatestBlogPosts({ locale, posts }: LatestBlogPostsProps) {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    const defaultPosts: BlogPost[] = [
        {
            id: '1',
            title: isEu ? 'Nola irakurri itsas karta bat 5 urratsetan' : isEn ? 'How to read a nautical chart in 5 steps' : isFr ? 'Comment lire une carte marine en 5 étapes' : 'Cómo leer una carta náutica en 5 pasos',
            excerpt: isEu ? 'Itsas kartak ulertzeko gida erraza, koordenatuak, sakonerak eta itsas ikurrak barne.' : isEn ? 'Easy guide to understanding marine charts, including coordinates, soundings and symbols.' : isFr ? 'Guide simple pour comprendre les cartes marines, y compris les coordonnées y symboles.' : 'Guía práctica para entender las cartas marinas, interpretar las sondas de profundidad y trazar tu rumbo con seguridad.',
            date: '2026-05-28',
            author: 'Urko Santillán',
            image: '/images/home-hero-sailing-action.webp',
            slug: 'como-leer-carta-nautica'
        },
        {
            id: '2',
            title: isEu ? 'Estropada taktikak: Irteerak haize indartsuarekin dominatu' : isEn ? 'Regatta tactics: Dominate starts in strong wind' : isFr ? 'Tactique de régate: Dominer les départs par vent fort' : 'Tácticas de regata: Domina las salidas con viento fuerte',
            excerpt: isEu ? 'J80 ontzian nabigatzeko aholkuak haize gogorra denean eta taktikak irteeran lekua irabazteko.' : isEn ? 'Tips for J80 sailing in heavy weather and smart tactics to secure your spot at the starting line.' : isFr ? 'Conseils pour naviguer en J80 par gros temps et tactiques pour assurer votre place au départ.' : 'Aprende a gestionar la presión de la flota en la línea de salida y a configurar el trimado de tus velas con vientos duros.',
            date: '2026-06-02',
            author: 'Ana de Lara',
            image: '/images/course-detail-header-sailing.webp',
            slug: 'tacticas-regata-salida-viento'
        },
        {
            id: '3',
            title: isEu ? 'Getxoko Abrako ainguratzeko txokorik onenak' : isEn ? 'The best anchorage spots in the Abra of Getxo' : isFr ? 'Les meilleurs mouillages de l\'Abra de Getxo' : 'Los mejores rincones para fondear en el Abra de Getxo',
            excerpt: isEu ? 'Babes handiena duten kala eta hondartza hurbilak ezagutu, ainguratze seguru baterako gomendioekin.' : isEn ? 'Discover the most protected coves and beaches near Getxo with tips for a safe and quiet anchoring.' : isFr ? 'Découvrez les criques les plus protégées près de Getxo avec des conseils pour un mouillage sûr.' : 'Explora los fondeaderos más pintorescos y protegidos de nuestra costa, con consejos sobre tenedero y vientos predominantes.',
            date: '2026-06-05',
            author: 'Angharad Arambalza',
            image: '/images/course-raquero-students.webp',
            slug: 'mejores-fondeaderos-abra-getxo'
        }
    ];

    const displayPosts = posts && posts.length > 0 ? posts.slice(0, 3) : defaultPosts;

    const sectionTitle = isEu ? 'Gure Bitakora' : isEn ? 'Our Logbook' : isFr ? 'Notre Journal de Bord' : 'Nuestra Bitácora';
    const sectionSubtitle = isEu ? 'Azken Albisteak eta Ikaskuntzak' : isEn ? 'Latest News & Sailing Tips' : isFr ? 'Actualités & Conseils de Voile' : 'Últimas Novedades y Consejos';
    const viewAllLabel = isEu ? 'Ikusi artikulu guztiak' : isEn ? 'View all posts' : isFr ? 'Voir tous les articles' : 'Ver todos los artículos';

    return (
        <section className="py-32 relative bg-nautical-black overflow-hidden border-t border-sea-foam/10">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="text-accent uppercase tracking-[0.6em] text-xs font-black mb-4 block">
                            {sectionTitle}
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-sea-foam tracking-tight leading-none">
                            {sectionSubtitle.split(' & ').map((part, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span className="italic font-light text-brass-gold/90"> & </span>}
                                    {part}
                                </React.Fragment>
                            ))}
                        </h2>
                    </div>
                    <Link
                        href={`/${locale}/blog/noticias`}
                        className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-sea-foam/40 hover:text-accent hover:scale-105 transition-premium group flex-shrink-0"
                    >
                        <span>{viewAllLabel}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Staggered Grid */}
                <StaggeredEntrance type="slide" staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayPosts.map((post) => (
                        <motion.article
                            key={post.id}
                            {...hoverLift}
                            className="flex flex-col bg-sea-foam/[0.01] border border-sea-foam/10 rounded-2xl overflow-hidden backdrop-blur-sm group/card cursor-pointer shadow-lg hover:shadow-black/10"
                        >
                            <Link href={`/${locale}/blog/noticias`} className="flex flex-col h-full">
                                <div className="relative aspect-square overflow-hidden bg-nautical-deep">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-nautical-black/80 via-transparent to-transparent" />
                                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-sea-foam/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-accent font-bold">
                                        <BookOpen className="w-3 h-3" />
                                        <span>Bitácora</span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow justify-between gap-6">
                                    <div className="space-y-4">
                                        {/* Meta */}
                                        <div className="flex items-center gap-6 text-[9px] uppercase tracking-widest text-sea-foam/30 font-bold">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author}
                                            </span>
                                        </div>
                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-display text-sea-foam group-hover/card:text-accent transition-colors leading-snug">
                                            {post.title}
                                        </h3>
                                        {/* Excerpt */}
                                        <p className="text-sea-foam/50 text-sm font-light leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-accent font-black group-hover/card:text-sea-foam transition-colors pt-4 border-t border-sea-foam/10">
                                        <span>Leer publicación</span>
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover/card:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </StaggeredEntrance>
            </div>
        </section>
    );
}
