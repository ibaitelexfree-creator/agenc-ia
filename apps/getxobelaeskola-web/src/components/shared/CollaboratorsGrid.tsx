'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search, X, Sparkles } from 'lucide-react';
import collaboratorsData from '@/data/collaborators.json';

interface Collaborator {
    id: string;
    name: string;
    originalFile?: string;
    svgFile: string;
}

export default function CollaboratorsGrid() {
    const [searchQuery, setSearchQuery] = useState('');
    const trackRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number | null>(null);
    const currentOffsetRef = useRef<number>(0);
    const targetOffsetRef = useRef<number>(0);
    const isHoveredRef = useRef<boolean>(false);

    // Filter collaborators by search query
    const filteredCollaborators = useMemo(() => {
        if (!searchQuery.trim()) return collaboratorsData as Collaborator[];
        const query = searchQuery.toLowerCase().trim();
        return (collaboratorsData as Collaborator[]).filter(collab =>
            collab.name.toLowerCase().includes(query) ||
            collab.id.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const isSearching = searchQuery.trim().length > 0;

    // Triple array buffer for seamless infinite loop
    const displayList = useMemo(() => {
        if (isSearching || filteredCollaborators.length === 0) {
            return filteredCollaborators;
        }
        return [...filteredCollaborators, ...filteredCollaborators, ...filteredCollaborators];
    }, [filteredCollaborators, isSearching]);

    // Continuous GPU-accelerated spring-lerp transform loop
    const singleSetWidthRef = useRef<number>(0);

    useEffect(() => {
        if (!trackRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            if (trackRef.current) {
                singleSetWidthRef.current = trackRef.current.scrollWidth / 3;
            }
        });
        resizeObserver.observe(trackRef.current);
        
        return () => resizeObserver.disconnect();
    }, [filteredCollaborators]);

    useEffect(() => {
        if (isSearching || filteredCollaborators.length === 0) {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (trackRef.current) trackRef.current.style.transform = 'none';
            return;
        }

        let lastTime: number | null = null;
        const speed = 32; // base pixels per second for auto movement

        const step = (time: number) => {
            if (lastTime !== null && trackRef.current) {
                const delta = Math.min((time - lastTime) / 1000, 0.1);

                // Auto-advance target offset when not hovered
                if (!isHoveredRef.current) {
                    targetOffsetRef.current += speed * delta;
                }

                // Smooth spring-lerp interpolation to target position
                const diff = targetOffsetRef.current - currentOffsetRef.current;
                currentOffsetRef.current += diff * Math.min(delta * 7.5, 0.25);

                // Seamless infinite loop wrap
                const singleSetWidth = singleSetWidthRef.current;
                if (singleSetWidth > 50) {
                    if (targetOffsetRef.current >= singleSetWidth) {
                        targetOffsetRef.current -= singleSetWidth;
                        currentOffsetRef.current -= singleSetWidth;
                    } else if (targetOffsetRef.current < 0) {
                        targetOffsetRef.current += singleSetWidth;
                        currentOffsetRef.current += singleSetWidth;
                    }
                }

                trackRef.current.style.transform = `translate3d(-${currentOffsetRef.current}px, 0, 0)`;
            }
            lastTime = time;
            animFrameRef.current = requestAnimationFrame(step);
        };

        animFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [isSearching, filteredCollaborators]);

    // Manual navigation buttons (Smooth spring transition to target offset)
    const handleScrollLeft = useCallback(() => {
        targetOffsetRef.current -= 340;
    }, []);

    const handleScrollRight = useCallback(() => {
        targetOffsetRef.current += 340;
    }, []);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-6xl mb-12 relative px-2 sm:px-4">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full border-b border-sea-foam/10 pb-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-nowrap whitespace-nowrap shrink-0 w-full md:w-auto">
                    <span className="text-[11px] min-[360px]:text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] font-black text-sea-foam/80 flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent animate-pulse shrink-0" />
                        Colaboradores
                    </span>
                    <span className="px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0">
                        {filteredCollaborators.length}
                    </span>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-sm md:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sea-foam/40 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar colaborador..."
                        className="w-full pl-9 pr-8 py-1.5 text-xs bg-sea-foam/5 border border-sea-foam/15 rounded-xl text-sea-foam placeholder:text-sea-foam/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/40 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sea-foam/40 hover:text-accent transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Carousel Section with Side Navigation Arrows */}
            <div className="flex items-center gap-3 sm:gap-4 w-full">
                {/* Left Arrow Button */}
                {!isSearching && (
                    <button
                        onClick={handleScrollLeft}
                        className="flex-shrink-0 p-3 sm:p-3.5 rounded-full bg-accent text-nautical-deep font-bold hover:bg-buoy-orange hover:text-white border-2 border-white/20 shadow-lg shadow-accent/20 hover:shadow-buoy-orange/30 hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                        aria-label="Desplazar a la izquierda"
                        title="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                )}

                {/* Carousel Container Wrapper with edge gradient masks */}
                <div
                    className="relative flex-1 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-6 border border-white/20 shadow-2xl shadow-black/20"
                    onMouseEnter={() => { isHoveredRef.current = true; }}
                    onMouseLeave={() => { isHoveredRef.current = false; }}
                >
                    {/* Left & Right Edge Fade Gradients */}
                    {!isSearching && (
                        <>
                            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        </>
                    )}

                    {/* Empty Search State */}
                    {filteredCollaborators.length === 0 ? (
                        <div className="py-12 text-center text-neutral-500 text-xs sm:text-sm font-medium">
                            No se encontraron colaboradores que coincidan con &quot;<span className="text-accent font-semibold">{searchQuery}</span>&quot;
                        </div>
                    ) : (
                        /* Marquee Track Container */
                        <div className="overflow-hidden w-full">
                            <div
                                ref={trackRef}
                                className={`flex gap-4 sm:gap-6 items-center w-max py-2 px-4 ${
                                    isSearching ? 'flex-wrap justify-center !w-full max-h-[350px] overflow-y-auto' : ''
                                }`}
                            >
                                {displayList.map((collab, index) => (
                                    <div
                                        key={`${collab.id}-${index}`}
                                        className="flex-shrink-0 group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white hover:bg-sea-foam/5 border border-neutral-100 hover:border-accent/40 shadow-sm hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 w-36 sm:w-44 select-none cursor-pointer"
                                        title={collab.name}
                                    >
                                        <div className="relative w-full h-16 sm:h-20 flex items-center justify-center">
                                            <Image
                                                src={collab.svgFile}
                                                alt={collab.name}
                                                width={160}
                                                height={80}
                                                className="object-contain max-h-full w-auto transition-all duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <span className="text-[10px] text-neutral-400 group-hover:text-nautical-deep font-semibold tracking-tight mt-2 truncate max-w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {collab.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Arrow Button */}
                {!isSearching && (
                    <button
                        onClick={handleScrollRight}
                        className="flex-shrink-0 p-3 sm:p-3.5 rounded-full bg-accent text-nautical-deep font-bold hover:bg-buoy-orange hover:text-white border-2 border-white/20 shadow-lg shadow-accent/20 hover:shadow-buoy-orange/30 hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                        aria-label="Desplazar a la derecha"
                        title="Siguiente"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                )}
            </div>
        </div>
    );
}






