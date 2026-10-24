'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HoverVideoOrImage from '@/components/shared/HoverVideoOrImage';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';

interface AboutTeamSectionProps {
    title: string;
    summary: string;
    expandButtonText: string;
    collapseButtonText: string;
    expandedContent: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
    };
}

export default function AboutTeamSection({
    title,
    summary,
    expandButtonText,
    collapseButtonText,
    expandedContent
}: AboutTeamSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden flex items-center min-h-0 sm:min-h-[75vh] w-full border-t border-sea-foam/10">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                <StaggeredEntrance className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Visual Media Column (Left on desktop to alternate rhythm with Story section) */}
                    <div className="lg:col-span-6 order-2 lg:order-1">
                        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] max-w-md sm:max-w-lg mx-auto lg:max-w-none group border border-sea-foam/20 shadow-2xl overflow-hidden rounded-lg sm:rounded-none">
                            <HoverVideoOrImage
                                src="/images/socias-angharad-wa0084.webp"
                                alt={expandedContent.title || title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                                containerClassName="w-full h-full relative"
                                imageClassName="object-cover object-center w-full h-full"
                            />
                            {/* Decorative Badge */}
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-nautical-deep/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 border border-sea-foam/15 shadow-2xl z-20">
                                <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-accent font-bold whitespace-nowrap">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Column (Right on desktop) */}
                    <div className="lg:col-span-6 space-y-4 sm:space-y-6 relative order-1 lg:order-2">
                        <div className="space-y-2 md:space-y-3">
                            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block">
                                Getxo Bela Eskola
                            </span>
                            <h2 className="text-[clamp(1.5rem,3.2vw,2.75rem)] font-display leading-tight tracking-tight text-sea-foam font-bold uppercase">
                                {title}
                            </h2>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <p className="text-foreground/85 font-light text-sm sm:text-base md:text-lg leading-relaxed">
                                {summary}
                            </p>
                        </div>

                        {/* Collapsible expanded section */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    key="expanded-team-info"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 pb-2 space-y-3 border-l-2 border-accent/40 pl-4 sm:pl-5 my-2">
                                        <p className="text-foreground/80 font-light text-sm sm:text-base leading-relaxed">
                                            {expandedContent.p1}
                                        </p>
                                        <p className="text-foreground/80 font-light text-sm sm:text-base leading-relaxed">
                                            {expandedContent.p2}
                                        </p>
                                        <p className="text-foreground/90 font-medium text-sm sm:text-base leading-relaxed text-sea-foam">
                                            {expandedContent.p3}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Toggle button matching the nautical button styling */}
                        <div className="pt-2 sm:pt-4">
                            <button
                                type="button"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                aria-expanded={isExpanded}
                                className="inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg active:scale-95 text-white hover:scale-105"
                                style={{
                                    backgroundColor: 'var(--gbe-navy-900, #002B49)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(242, 169, 59, 0.4)',
                                    padding: '0.875rem 2.25rem',
                                    fontSize: '0.875rem',
                                    borderRadius: '50px',
                                    letterSpacing: '0.12em',
                                    boxShadow: '0 4px 15px rgba(0, 43, 73, 0.3)',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--gbe-navy-800, #0A436D)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--gbe-navy-900, #002B49)';
                                }}
                            >
                                <span>{isExpanded ? collapseButtonText : expandButtonText}</span>
                                <motion.span
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="inline-block text-accent text-xs"
                                >
                                    ▼
                                </motion.span>
                            </button>
                        </div>
                    </div>
                </StaggeredEntrance>
            </div>
        </section>
    );
}
