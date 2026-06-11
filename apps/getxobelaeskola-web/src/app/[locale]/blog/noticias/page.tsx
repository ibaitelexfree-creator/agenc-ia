'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Search, BookOpen, ChevronLeft } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    image: string;
    tags: string[];
}

export default function NoticiasPage({ params: { locale } }: { params: { locale: string } }) {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    const posts: BlogPost[] = [
        {
            id: '1',
            title: isEu ? 'Nola irakurri itsas karta bat 5 urratsetan' : isEn ? 'How to read a nautical chart in 5 steps' : isFr ? 'Comment lire une carte marine en 5 étapes' : 'Cómo leer una carta náutica en 5 pasos',
            excerpt: isEu ? 'Itsas kartak ulertzeko gida erraza, koordenatuak, sakonerak eta itsas ikurrak barne.' : isEn ? 'Easy guide to understanding marine charts, including coordinates, soundings and symbols.' : isFr ? 'Guide simple pour comprendre les cartes marines, y compris les coordonnées.' : 'Guía práctica para entender las cartas marinas, interpretar las sondas de profundidad y trazar tu rumbo con seguridad.',
            content: isEu 
                ? 'Itsas kartak itsasoan zehar nabigatzeko ezinbesteko tresnak dira. Pauso hauetan ikasiko duzu koordenatuak identifikatzen, sakonera neurtzen duten sondak irakurtzen, ikurrak eta itsasargien argi-karakteristikak ezagutzen, eta segurtasunez portura iristeko bideak marrazten.'
                : isEn
                ? 'Nautical charts are the primary map used by mariners. In this step-by-step tutorial, you will learn how to read latitude and longitude coordinates, interpret depth soundings, decode chart symbols (such as wrecks, rocks, and light characteristics), and safely plot a path to port.'
                : isFr
                ? 'Les cartes marines sont les cartes primaires utilisées par les marins. Dans ce tutoriel, vous apprendrez à lire les coordonnées, à interpréter les sondes de profondeur, à décoder les symboles de carte et à tracer un itinéraire sûr vers le port.'
                : 'Las cartas náuticas son el mapa de carreteras del marino. En esta guía práctica te enseñamos a interpretar la escala de latitudes y longitudes, a leer los números de sonda que indican el relieve submarino, a reconocer la simbología oficial de faros, boyas e instalaciones portuarias, y a trazar rumbos verdaderos corregidos con la declinación magnética para una travesía 100% segura.',
            date: '2026-05-28',
            author: 'Urko Santillán',
            image: '/images/home-hero-sailing-action.webp',
            tags: isEu ? ['Ikaskuntza', 'Nabigazioa'] : isEn ? ['Learning', 'Navigation'] : ['Formación', 'Navegación']
        },
        {
            id: '2',
            title: isEu ? 'Estropada taktikak: Irteerak haize indartsuarekin dominatu' : isEn ? 'Regatta tactics: Dominate starts in strong wind' : isFr ? 'Tactique de régate: Dominer les départs par vent fort' : 'Tácticas de regata: Domina las salidas con viento fuerte',
            excerpt: isEu ? 'J80 ontzian nabigatzeko aholkuak haize gogorra denean eta taktikak irteeran lekua irabazteko.' : isEn ? 'Tips for J80 sailing in heavy weather and smart tactics to secure your spot at the starting line.' : isFr ? 'Conseils pour naviguer en J80 par gros temps et tactiques pour assurer votre place au départ.' : 'Aprende a gestionar la presión de la flota en la línea de salida y a configurar el trimado de tus velas con vientos duros.',
            content: isEu
                ? 'Haize indartsuarekin estropada baten irteera kontrolatzea funtsezkoa da. Zure J80 ontziaren bela-trimatzea doitzen ikasiko dugu, baita taldekide bakoitzaren pisua banatzen ere, irteerako momentuan abiadura maximoa lortzeko.'
                : isEn
                ? 'Sailing in strong winds demands perfect coordination and tactics, especially during the crucial starting sequence. This article explains how to tune your sails on a J80 class boat, manage boat speed before the gun, and use weight distribution to keep the hull flat.'
                : isFr
                ? 'La voile par vent fort exige une coordination parfaite. Cet article explique comment régler vos voiles sur un J80, gérer la vitesse du bateau avant le départ et optimiser le rappel de l\'équipage.'
                : 'La línea de salida es donde se ganan y pierden la mayoría de las regatas, especialmente cuando el anemómetro sube de los 20 nudos. En este artículo detallamos la técnica para mantener el barco en stand-by (parado con control), la forma óptima de cazar velas para arrancar en el último segundo y cómo distribuir el peso de la tripulación en la banda para mantener el barco plano.',
            date: '2026-06-02',
            author: 'Ana de Lara',
            image: '/images/course-detail-header-sailing.webp',
            tags: isEu ? ['Lehiaketa', 'Taktika'] : isEn ? ['Racing', 'Tactics'] : ['Regatas', 'Competición']
        },
        {
            id: '3',
            title: isEu ? 'Getxoko Abrako ainguratzeko txokorik onenak' : isEn ? 'The best anchorage spots in the Abra of Getxo' : isFr ? 'Les meilleurs mouillages de l\'Abra de Getxo' : 'Los mejores rincones para fondear en el Abra de Getxo',
            excerpt: isEu ? 'Babes handiena duten kala eta hondartza hurbilak ezagutu, ainguratze seguru baterako gomendioekin.' : isEn ? 'Discover the most protected coves and beaches near Getxo with tips for a safe and quiet anchoring.' : isFr ? 'Découvrez les criques les plus protégées près de Getxo avec des conseils pour un mouillage sûr.' : 'Explora los fondeaderos más pintorescos y protegidos de nuestra costa, con consejos sobre tenedero y vientos predominantes.',
            content: isEu
                ? 'Getxoko Abra inguruan kala zoragarriak eta hondartza babestuak daude ainguratzeko. Marea-taulak egiaztatzea gomendatzen da, baita hondar-motak aztertzea ere aingura ondo finka dadin.'
                : isEn
                ? 'The Abra of Getxo has wonderful protected coves and beautiful beaches where you can anchor safely. This guide covers the best spots like Arrigunaga, Ereaga or the old harbor bay, highlighting wind protections and holding ground quality.'
                : isFr
                ? 'Découvrez les meilleurs mouillages de l\'Abra de Getxo. Ce guide couvre les coins les plus abrités comme Ereaga ou Arrigunaga, avec des conseils sur les vents et la tenue des fonds.'
                : 'Fondease en el Abra de Getxo es una experiencia maravillosa si sabes dónde hacerlo. Te revelamos las mejores coordenadas al resguardo del viento de componente Norte y Noroeste, los detalles sobre el fondo de arena para asegurar el agarre del ancla (tenedero), y las precauciones necesarias según la carrera de marea de ese día.',
            date: '2026-06-05',
            author: 'Angharad Arambalza',
            image: '/images/course-raquero-students.webp',
            tags: isEu ? ['Ainguraketa', 'Getxo'] : isEn ? ['Anchoring', 'Getxo'] : ['Rutas', 'Getxo']
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Dynamic headers based on locale
    const pageTitle = isEu ? 'Berriak eta Ekitaldiak' : isEn ? 'News & Events' : isFr ? 'Actualités & Événements' : 'Noticias y Eventos';
    const pageSubtitle = isEu ? 'Getxo Bela Eskolako azken albisteak eta itsas ikaskuntzak' : isEn ? 'Latest news and sailing lessons from Getxo Bela Eskola' : isFr ? 'Dernières nouvelles de Getxo Bela Eskola' : 'Mantente al día con las últimas novedades de la escuela, crónicas de regatas y consejos técnicos de navegación.';

    if (selectedPost) {
        return (
            <main className="min-h-screen bg-[#F7FAFC] pt-28 pb-20 selection:bg-accent selection:text-[#1A1A1A]">
                <div className="container mx-auto px-6 max-w-4xl">
                    <button 
                        onClick={() => setSelectedPost(null)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-black text-accent hover:text-[#1A1A1A] transition-colors mb-8"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{isEu ? 'Itzuli' : isEn ? 'Back' : 'Volver al listado'}</span>
                    </button>

                    <article className="glass-card p-6 md:p-12 rounded-3xl border-black/10 bg-white">
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8">
                            <Image 
                                src={selectedPost.image} 
                                alt={selectedPost.title} 
                                fill 
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-6">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                {new Date(selectedPost.date).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-accent" />
                                {selectedPost.author}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-display text-[#1A1A1A] mb-6 tracking-tight leading-tight">
                            {selectedPost.title}
                        </h1>

                        <p className="text-lg md:text-xl text-[#1A1A1A]/70 italic leading-relaxed border-l-2 border-accent pl-4 mb-8">
                            {selectedPost.excerpt}
                        </p>

                        <div className="prose max-w-none text-[#1A1A1A]/80 text-base md:text-lg leading-loose space-y-6">
                            <p>{selectedPost.content}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-12 pt-6 border-t border-black/10">
                            {selectedPost.tags.map(tag => (
                                <span key={tag} className="bg-black/[0.04] text-[#1A1A1A]/60 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-black/5">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7FAFC] pt-28 pb-20 selection:bg-accent selection:text-[#1A1A1A]">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <header className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-accent uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">
                        Getxo Bela Eskola · Blog
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display text-[#1A1A1A] tracking-tight mb-6 leading-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-[#1A1A1A]/60 text-sm md:text-base leading-relaxed">
                        {pageSubtitle}
                    </p>
                </header>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-16 relative">
                    <div className="flex items-center bg-white border border-black/10 rounded-full px-5 py-3 shadow-md focus-within:border-accent/40 transition-all">
                        <Search className="w-5 h-5 text-[#1A1A1A]/30 mr-3" />
                        <input 
                            type="text" 
                            placeholder={isEu ? 'Bilatu artikuluak...' : isEn ? 'Search posts...' : 'Buscar artículos...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-[#1A1A1A] w-full focus:ring-0 placeholder:text-[#1A1A1A]/30"
                        />
                    </div>
                </div>

                {/* Posts List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <article 
                            key={post.id} 
                            onClick={() => setSelectedPost(post)}
                            className="flex flex-col bg-white border border-black/10 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-nautical-deep">
                                <Image 
                                    src={post.image} 
                                    alt={post.title} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[8px] uppercase tracking-wider text-accent font-black">
                                    <BookOpen className="w-2.5 h-2.5" />
                                    <span>{isEu ? 'Koadernoa' : isEn ? 'Logbook' : 'Bitácora'}</span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-grow gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-accent" />
                                            {new Date(post.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3 text-accent" />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-display text-[#1A1A1A] leading-snug group-hover:text-accent transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-[#1A1A1A]/60 text-xs leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-accent font-black pt-4 border-t border-black/5">
                                    <span>{isEu ? 'Irakurri gehiago' : isEn ? 'Read post' : 'Leer publicación'}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <p className="text-center text-[#1A1A1A]/40 py-12 text-sm">
                        {isEu ? 'Ez da artikulurik aurkitu.' : isEn ? 'No posts found.' : 'No se encontraron artículos.'}
                    </p>
                )}
            </div>
        </main>
    );
}
