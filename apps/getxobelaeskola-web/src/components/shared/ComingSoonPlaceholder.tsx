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
        <main className="h-[100dvh] max-h-[100dvh] w-full bg-nautical-black text-sea-foam flex flex-col justify-center items-center px-4 py-4 sm:px-6 sm:py-8 relative selection:bg-accent selection:text-nautical-black overflow-hidden box-border">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[240px] h-[240px] sm:w-[450px] sm:h-[450px] bg-accent/5 blur-[70px] sm:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-brass-gold/5 blur-[60px] sm:blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="text-center max-w-xl sm:max-w-2xl relative z-10 space-y-2 sm:space-y-4 md:space-y-6 my-auto">
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full border border-accent/20 bg-accent/5 mt-2 sm:mt-4 mb-2 sm:mb-3 text-accent shadow-[0_0_40px_rgba(21,79,163,0.15)]">
                    <Sailboat className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                </div>
                <span className="text-accent uppercase tracking-[0.15em] sm:tracking-[0.3em] md:tracking-[0.5em] text-[9px] sm:text-xs font-black block">Getxo Bela Eskola</span>
                <h1 className="text-xl sm:text-3xl md:text-5xl font-display uppercase tracking-tight text-sea-foam leading-tight">
                    {title}{' '}
                    <span className="italic font-light text-brass-gold/90 font-sans lowercase text-base sm:text-2xl md:text-4xl block sm:inline mt-0.5 sm:mt-0">en desarrollo</span>
                </h1>
                <p className="text-sea-foam/70 text-xs sm:text-sm md:text-base font-light leading-snug sm:leading-relaxed max-w-sm sm:max-w-md md:max-w-lg mx-auto px-1 sm:px-0">
                    {description}
                </p>
                <div className="pt-2 sm:pt-4">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 sm:gap-3 border border-sea-foam/20 bg-sea-foam/5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] font-black text-sea-foam hover:bg-sea-foam hover:text-nautical-black transition-premium shadow-lg shadow-sea-foam/5 group"
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
