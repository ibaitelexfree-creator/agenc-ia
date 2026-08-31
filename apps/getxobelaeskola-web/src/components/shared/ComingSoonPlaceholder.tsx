'use client';

import React from 'react';
import Link from 'next/link';
import { Sailboat, ChevronRight } from 'lucide-react';

interface ComingSoonPlaceholderProps {
    title: string;
    description: string;
    backHref?: string;
    backLabel?: string;
}

export default function ComingSoonPlaceholder({ 
    title, 
    description, 
    backHref = "/", 
    backLabel = "Volver a Inicio" 
}: ComingSoonPlaceholderProps) {
    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam flex flex-col justify-center items-center px-4 sm:px-6 relative selection:bg-accent selection:text-nautical-black overflow-hidden py-16 sm:py-24 md:py-32">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-accent/5 blur-[80px] sm:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] bg-brass-gold/5 blur-[70px] sm:blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="text-center max-w-2xl relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-accent/20 bg-accent/5 mb-2 sm:mb-4 text-accent shadow-[0_0_50px_rgba(21,79,163,0.15)]">
                    <Sailboat className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </div>
                <span className="text-accent uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] text-[10px] sm:text-xs font-black block">Getxo Bela Eskola</span>
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-display uppercase tracking-tight text-sea-foam leading-tight sm:leading-none">
                    {title} <br className="hidden sm:inline" />
                    <span className="block sm:inline italic font-light text-brass-gold/90 font-sans lowercase text-lg sm:text-3xl md:text-5xl mt-1 sm:mt-0"> en desarrollo</span>
                </h1>
                <p className="text-sea-foam/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-md sm:max-w-lg mx-auto px-2 sm:px-0">
                    {description}
                </p>
                <div className="pt-4 sm:pt-6 md:pt-8">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 sm:gap-3 border border-sea-foam/20 bg-sea-foam/5 px-5 py-3 sm:px-8 sm:py-4 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] font-black text-sea-foam hover:bg-sea-foam hover:text-nautical-black transition-premium shadow-lg shadow-sea-foam/5 group"
                    >
                        {backLabel}
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
            
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none z-0" />
        </main>
    );
}
