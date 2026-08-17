'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, User, Search, BookOpen, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

const defaultPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Cómo leer una carta náutica en 5 pasos',
        excerpt: 'Guía práctica para entender las cartas marinas, interpretar las sondas de profundidad y trazar tu rumbo con seguridad.',
        content: 'Las cartas náuticas son el mapa de carreteras del marino. En esta guía práctica te enseñamos a interpretar la escala de latitudes y longitudes, a leer los números de sonda que indican el relieve submarino, a reconocer la simbología oficial de faros, boyas e instalaciones portuarias, y a trazar rumbos verdaderos corregidos con la declinación magnética para una travesía 100% segura.',
        date: '2026-05-28',
        author: 'Urko Santillán',
        image: '/images/home-hero-sailing-action.webp',
        tags: ['Formación', 'Navegación']
    },
    {
        id: '2',
        title: 'Tácticas de regata: Domina las salidas con viento fuerte',
        excerpt: 'Aprende a gestionar la presión de la flota en la línea de salida y a configurar el trimado de tus velas con vientos duros.',
        content: 'La línea de salida es donde se ganan y pierden la mayoría de las regatas, especialmente cuando el anemómetro sube de los 20 nudos. En este artículo detallamos la técnica para mantener el barco en stand-by (parado con control), la forma óptima de cazar velas para arrancar en el último segundo y cómo distribuir el peso de la tripulación en la banda para mantener el barco plano.',
        date: '2026-06-02',
        author: 'Ana de Lara',
        image: '/images/course-detail-header-sailing.webp',
        tags: ['Regatas', 'Competición']
    },
    {
        id: '3',
        title: 'Los mejores rincones para fondear en el Abra de Getxo',
        excerpt: 'Explora los fondeaderos más pintorescos y protegidos de nuestra costa, con consejos sobre tenedero y vientos predominantes.',
        content: 'Fondease en el Abra de Getxo es una experiencia maravillosa si sabes dónde hacerlo. Te revelamos las mejores coordenadas al resguardo del viento de componente Norte y Noroeste, los detalles sobre el fondo de arena para asegurar el agarre del ancla (tenedero), y las precauciones necesarias según la carrera de marea de ese día.',
        date: '2026-06-05',
        author: 'Angharad Arambalza',
        image: '/images/course-raquero-students.webp',
        tags: ['Rutas', 'Getxo']
    }
];

export default function NoticiasClient({
    locale,
    initialDbPosts,
}: {
    locale: string;
    initialDbPosts: any[];
}) {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    // Map DB posts to component format, or fallback to default mock posts
    const posts: BlogPost[] = initialDbPosts.length > 0
        ? initialDbPosts.map((p) => ({
            id: p.id,
            title: isEu ? (p.titulo_eu || p.titulo_es) : p.titulo_es,
            excerpt: isEu ? (p.contenido_eu || p.contenido_es) : p.contenido_es,
            content: isEu ? (p.contenido_eu || p.contenido_es) : p.contenido_es,
            date: p.created_at,
            author: 'Getxo Bela Eskola',
            image: p.image_url || '/images/home-hero-sailing-action.webp',
            tags: ['Bitácora']
        }))
        : defaultPosts.map(p => ({
            ...p,
            title: isEu && p.id === '1' ? 'Nola irakurri itsas karta bat 5 urratsetan' : p.title
        }));

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageTitle = isEu ? 'Berriak eta Ekitaldiak' : isEn ? 'News & Events' : isFr ? 'Actualités & Événements' : 'Noticias y Eventos';
    const pageSubtitle = isEu ? 'Getxo Bela Eskolako azken albisteak eta itsas ikaskuntzak' : isEn ? 'Latest news and sailing lessons from Getxo Bela Eskola' : isFr ? 'Dernières nouvelles de Getxo Bela Eskola' : 'Mantente al día con las últimas novedades de la escuela, crónicas de regatas y consejos técnicos de navegación.';

    if (selectedPost) {
        return (
            <main className="min-h-screen bg-[#F7FAFC] pt-20 pb-12 selection:bg-accent selection:text-[#1A1A1A]">
                <div className="container mx-auto px-6 max-w-4xl">
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-accent hover:text-[#1A1A1A] transition-colors mb-6"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEu ? 'Itzuli' : isEn ? 'Back' : 'Volver al listado'}</span>
                    </button>

                    <article className="glass-card p-5 md:p-8 rounded-3xl border-black/10 bg-white">
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6">
                            <Image
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold mb-3">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                {new Date(selectedPost.date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-accent" />
                                {selectedPost.author}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-display text-[#1A1A1A] leading-tight mb-6">
                            {selectedPost.title}
                        </h1>

                        <div className="prose prose-sm md:prose-base max-w-none text-[#1A1A1A]/80 leading-relaxed font-light">
                            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                        </div>
                    </article>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7FAFC] pt-16 pb-10 selection:bg-accent selection:text-[#1A1A1A]">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-6 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-accent block">
                        {isEu ? 'Getxo Bela Eskolako Aldizkaria' : isEn ? 'Journal' : 'Bitácora & Noticias'}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display text-[#1A1A1A] leading-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-[#1A1A1A]/60 text-[11px] leading-relaxed max-w-lg mx-auto">
                        {pageSubtitle}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-sm mx-auto mb-6">
                    <div className="relative flex items-center bg-white border border-black/10 rounded-full px-3 py-1 shadow-sm focus-within:border-accent transition-colors">
                        <Search className="w-3 h-3 text-[#1A1A1A]/40 mr-2" />
                        <input
                            type="text"
                            placeholder={isEu ? 'Bilatu artikuluak...' : isEn ? 'Search posts...' : 'Buscar noticias o artículos...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-[11px] text-[#1A1A1A] w-full focus:ring-0 placeholder:text-[#1A1A1A]/30"
                        />
                    </div>
                </div>

                {/* Posts List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {filteredPosts.map((post) => (
                        <article
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden bg-nautical-deep">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[7px] uppercase tracking-wider text-accent font-black">
                                    <BookOpen className="w-2 h-2" />
                                    <span>{isEu ? 'Koadernoa' : isEn ? 'Logbook' : 'Bitácora'}</span>
                                </div>
                            </div>

                            <div className="p-3 flex flex-col justify-between flex-grow gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[7.5px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-2.5 h-2.5 text-accent" />
                                            {new Date(post.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-2.5 h-2.5 text-accent" />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-display text-[#1A1A1A] leading-snug group-hover:text-accent transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-[#1A1A1A]/60 text-[10px] leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-[7.5px] uppercase tracking-widest text-accent font-black pt-2.5 border-t border-black/5">
                                    <span>{isEu ? 'Irakurri gehiago' : isEn ? 'Read post' : 'Leer publicación'}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <p className="text-center text-[#1A1A1A]/40 py-8 text-xs">
                        {isEu ? 'Ez da artikulurik aurkitu.' : isEn ? 'No posts found.' : 'No se encontraron artículos.'}
                    </p>
                )}
            </div>
        </main>
    );
}
