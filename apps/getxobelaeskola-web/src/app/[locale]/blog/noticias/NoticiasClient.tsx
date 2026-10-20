'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Search, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { localizedArticles } from '@/components/sections/Blog/blog-articles.data';

interface BlogPost {
    id: string;
    slug?: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    image: string;
    tags: string[];
}

export default function NoticiasClient({
    locale,
    initialDbPosts,
    initialArticleSlug,
}: {
    locale: string;
    initialDbPosts: any[];
    initialArticleSlug?: string;
}) {
    const lang = (['es', 'eu', 'en', 'fr'].includes(locale) ? locale : 'es') as 'es' | 'eu' | 'en' | 'fr';
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    // Map DB posts to component format with complete 4-language support
    const posts: BlogPost[] = initialDbPosts.map((p) => {
        const slug = p.slug as string;
        const loc = slug && localizedArticles[slug] ? localizedArticles[slug][lang] : null;

        let title = p.titulo_es;
        let excerpt = p.contenido_es?.slice(0, 160) + '...';
        let content = p.contenido_es;
        let author = 'Getxo Bela Eskola';

        if (loc) {
            title = loc.title;
            excerpt = loc.excerpt;
            content = loc.content;
            author = loc.author;
        } else {
            if (isEu && p.titulo_eu) {
                title = p.titulo_eu;
                content = p.contenido_eu || p.contenido_es;
                excerpt = p.contenido_eu?.slice(0, 160) + '...' || excerpt;
            }
        }

        return {
            id: p.id,
            slug: p.slug,
            title,
            excerpt,
            content,
            date: p.created_at,
            author,
            image: p.image_url || '/images/home-hero-sailing-action.webp',
            tags: ['Bitácora']
        };
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
        if (initialArticleSlug) {
            return posts.find(p => p.slug === initialArticleSlug) || null;
        }
        return null;
    });

    useEffect(() => {
        if (initialArticleSlug) {
            const found = posts.find(p => p.slug === initialArticleSlug);
            if (found) setSelectedPost(found);
        }
    }, [initialArticleSlug]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageTitle = isEu ? 'Berriak eta Ekitaldiak' : isEn ? 'News & Events' : isFr ? 'Actualités & Événements' : 'Noticias y Eventos';
    const pageSubtitle = isEu ? 'Getxo Bela Eskolako azken albisteak eta itsas ikaskuntzak' : isEn ? 'Latest news and sailing lessons from Getxo Bela Eskola' : isFr ? 'Dernières nouvelles de Getxo Bela Eskola' : 'Mantente al día con las últimas novedades de la escuela, crónicas de regatas y consejos técnicos de navegación.';

    if (selectedPost) {
        return (
            <main className="min-h-[100dvh] w-full bg-[#F7FAFC] pt-32 pb-16 selection:bg-accent selection:text-[#1A1A1A]">
                <div className="container mx-auto px-6 max-w-4xl">
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-accent hover:text-[#1A1A1A] transition-colors mb-6 cursor-pointer"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{isEu ? 'Itzuli zerrendara' : isEn ? 'Back to list' : isFr ? 'Retour à la liste' : 'Volver al listado'}</span>
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
        <main className="min-h-[100dvh] w-full bg-[#F7FAFC] pt-28 pb-16 selection:bg-accent selection:text-[#1A1A1A]">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-6 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-accent block">
                        {isEu ? 'Getxo Bela Eskolako Aldizkaria' : isEn ? 'Journal' : isFr ? 'Journal & Actualités' : 'Bitácora & Noticias'}
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
                            </div>

                            <div className="p-3 flex flex-col justify-between flex-grow gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[7.5px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-2.5 h-2.5 text-accent" />
                                            {new Date(post.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
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
                                    <span>{isEu ? 'Irakurri gehiago' : isEn ? 'Read post' : isFr ? 'Lire l’article' : 'Leer publicación'}</span>
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
