'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';

interface StatsSectionProps {
    pasionLabel: string;
    alumnosLabel: string;
    flotaLabel: string;
    clasesLabel: string;
    flotaValue?: string;
}

function parseValue(valueStr: string) {
    const num = parseInt(valueStr.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = valueStr.replace(/[0-9]/g, '');
    return { num, suffix };
}

function AnimatedCounter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const { num, suffix } = parseValue(value);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 25, mass: 1 });
    const rounded = useTransform(springValue, (latest) => Math.round(latest));
    const inView = useInView(ref, { once: true, amount: 0.2 });

    useEffect(() => {
        if (inView) {
            motionValue.set(num);
        }
    }, [inView, num, motionValue]);

    return (
        <span ref={ref} className="inline-block">
            <motion.span>{rounded}</motion.span>
            <span>{suffix}</span>
        </span>
    );
}

export default function StatsSection({ pasionLabel, alumnosLabel, flotaLabel, clasesLabel, flotaValue = '12' }: StatsSectionProps) {
    const stats = [
        { label: pasionLabel, value: '30+' },
        { label: alumnosLabel, value: '5K+' },
        { label: flotaLabel, value: flotaValue },
        { label: clasesLabel, value: '100%' }
    ];

    return (
        <section className="relative py-32 bg-nautical-black overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-10 bg-waves" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-nautical-black via-transparent to-nautical-black" aria-hidden="true" />

            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <StaggeredEntrance type="slide" staggerDelay={0.12} className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <h3 className="text-5xl lg:text-7xl font-display text-white mb-4 group-hover:text-accent transition-colors duration-500">
                                <AnimatedCounter value={stat.value} />
                            </h3>
                            <div className="w-12 h-px bg-brass-gold mx-auto mb-4 group-hover:scale-x-150 transition-transform duration-500 origin-center" />
                            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">
                                {stat.label}
                            </h4>
                        </div>
                    ))}
                </StaggeredEntrance>
            </div>
        </section>
    );
}

