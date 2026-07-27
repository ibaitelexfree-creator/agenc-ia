'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ValueItem {
    title: string;
    desc: string;
    icon: string;
    bg: string;
}

interface AboutValuesSectionProps {
    items: ValueItem[];
}

export default function AboutValuesSection({ items }: AboutValuesSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-sea-foam/10">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                    className="group relative min-h-[380px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[600px] p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-end overflow-hidden border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-sea-foam/10 cursor-pointer select-none touch-manipulation transition-all duration-500"
                >
                    {/* Background image with subtle scroll scale & active/hover state on all devices */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                            src={item.bg}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover saturate-[0.6] brightness-95 md:saturate-[0.45] md:brightness-90 group-hover:saturate-100 group-active:saturate-100 group-hover:brightness-105 group-active:brightness-105 group-hover:scale-105 group-active:scale-105 transition-all duration-700 ease-out transform-gpu"
                        />
                    </div>
                    {/* Gradient Overlay optimized for high contrast & image visibility on all phones */}
                    <div className="absolute inset-0 bg-gradient-to-t from-nautical-black/95 via-nautical-black/40 to-transparent z-1 opacity-80 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative z-10 transition-transform duration-700 ease-out translate-y-0 group-hover:-translate-y-4 group-active:-translate-y-4 sm:group-hover:-translate-y-6">
                        <span className="text-4xl sm:text-5xl mb-4 sm:mb-8 block opacity-90 group-hover:opacity-100 group-active:opacity-100 scale-100 group-hover:scale-110 group-active:scale-110 transition-all duration-700 origin-left inline-block">
                            {item.icon}
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-sea-foam mb-3 sm:mb-6 group-hover:text-accent group-active:text-accent transition-colors duration-700">
                            {item.title}
                        </h3>
                        <p className="text-sea-foam/90 md:text-sea-foam/80 font-light text-xs sm:text-sm leading-relaxed max-w-xs group-hover:text-sea-foam group-active:text-sea-foam transition-colors duration-700">
                            {item.desc}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
