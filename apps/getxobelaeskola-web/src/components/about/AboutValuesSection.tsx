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
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                    className="group relative h-[600px] p-12 sm:p-16 md:p-14 lg:p-20 flex flex-col justify-end overflow-hidden border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-sea-foam/10 cursor-pointer touch-manipulation transition-all duration-700 active:bg-accent/10"
                >
                    {/* Background image with subtle scroll scale */}
                    <motion.div 
                        initial={{ scale: 1.15 }}
                        whileInView={{ scale: 1.0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0 z-0 opacity-70 group-hover:opacity-90 group-active:opacity-90 transition-all duration-[1.5s] ease-out"
                    >
                        <Image
                            src={item.bg}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-nautical-black via-nautical-black/80 to-transparent z-1" />

                    <motion.div 
                        initial={{ y: 20, opacity: 0.8 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
                        className="relative z-10 transition-transform duration-700 group-hover:-translate-y-8 group-active:-translate-y-8"
                    >
                        <span className="text-5xl mb-12 block opacity-90 group-hover:opacity-100 group-active:opacity-100 group-hover:scale-125 group-active:scale-125 transition-all duration-700 origin-left inline-block grayscale group-hover:grayscale-0 group-active:grayscale-0">
                            {item.icon}
                        </span>
                        <h3 className="text-3xl font-display text-sea-foam mb-8 group-hover:text-accent group-active:text-accent transition-colors duration-700">
                            {item.title}
                        </h3>
                        <p className="text-foreground/80 font-light text-sm leading-relaxed max-w-xs group-hover:text-foreground/95 group-active:text-foreground/95 transition-colors duration-700">
                            {item.desc}
                        </p>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
