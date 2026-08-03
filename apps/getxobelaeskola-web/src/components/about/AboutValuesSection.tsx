'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ValueItem {
    title: string;
    desc: string;
    icon: string;
    bg: string;
    objectPosition?: string;
}

interface AboutValuesSectionProps {
    items: ValueItem[];
}

export default function AboutValuesSection({ items }: AboutValuesSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                    className="group relative flex flex-col bg-nautical-black/80 border border-sea-foam/15 overflow-hidden rounded-xl shadow-2xl cursor-pointer touch-manipulation transition-all duration-500 hover:border-accent/40"
                >
                    {/* Top Image Showcase Container - Completely Free from Text Overlap */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-nautical-dark/50">
                        <motion.div 
                            initial={{ scale: 1.15 }}
                            whileInView={{ scale: 1.0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute inset-0 z-0 opacity-90 group-hover:opacity-100 group-active:opacity-100 transition-all duration-700 ease-out"
                        >
                            <Image
                                src={item.bg}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                style={{ objectPosition: item.objectPosition || 'center' }}
                                className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 saturate-[1.18] contrast-[1.05] group-hover:scale-110 transition-all duration-700"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-nautical-black/60 pointer-events-none z-1" />
                    </div>

                    {/* Bottom Text Panel - Situated distinctly below the image */}
                    <div className="p-6 sm:p-8 lg:p-8 flex flex-col justify-between flex-grow relative z-10 bg-nautical-black/95 border-t border-sea-foam/10">
                        <div>
                            <span className="text-3xl sm:text-4xl mb-3 block opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 origin-left inline-block grayscale group-hover:grayscale-0">
                                {item.icon}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-display text-sea-foam mb-3 group-hover:text-accent transition-colors duration-500 font-bold">
                                {item.title}
                            </h3>
                            <p className="text-foreground/80 font-light text-xs sm:text-sm leading-relaxed group-hover:text-foreground/95 transition-colors duration-500">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
