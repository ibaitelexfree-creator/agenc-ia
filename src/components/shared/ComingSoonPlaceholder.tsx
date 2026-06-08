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
        <main className="min-h-screen bg-nautical-black text-white flex flex-col justify-center items-center px-6 relative selection:bg-accent selection:text-nautical-black overflow-hidden py-32">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brass-gold/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="text-center max-w-2xl relative z-10 space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-accent/20 bg-accent/5 mb-4 text-accent shadow-[0_0_50px_rgba(21,79,163,0.15)]">
                    <Sailboat className="w-10 h-10" />
                </div>
                <span className="text-accent uppercase tracking-[0.6em] text-xs font-black block">Getxo Bela Eskola</span>
                <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-white leading-none">
                    {title} <br />
                    <span className="italic font-light text-brass-gold/90 font-sans lowercase">en desarrollo</span>
                </h1>
                <p className="text-white/50 text-lg font-light leading-relaxed max-w-lg mx-auto">
                    {description}
                </p>
                <div className="pt-8">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-3 border border-white/20 bg-white/5 px-8 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-black text-white hover:bg-white hover:text-nautical-black transition-premium shadow-lg shadow-black/30 group"
                    >
                        {backLabel}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
            
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none z-0" />
        </main>
    );
}
