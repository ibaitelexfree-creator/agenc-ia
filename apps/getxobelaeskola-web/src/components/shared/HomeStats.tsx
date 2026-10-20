'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface AnimatedCounterProps {
    from: number;
    to: number;
    duration?: number; // en ms
    suffix?: string;
}

function AnimatedCounter({ from, to, duration = 1500, suffix = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(from);
    const elementRef = useRef<HTMLSpanElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let startTime: number | null = null;

                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing: easeOutQuad
                        const easeProgress = progress * (2 - progress);
                        const currentValue = Math.floor(from + (to - from) * easeProgress);
                        
                        setCount(currentValue);

                        if (progress < 1) {
                            animationRef.current = requestAnimationFrame(step);
                        }
                    };

                    animationRef.current = requestAnimationFrame(step);
                } else {
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                        animationRef.current = null;
                    }
                    setCount(from);
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '-50px 0px' 
            }
        );

        observer.observe(currentElement);

        return () => {
            observer.unobserve(currentElement);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [from, to, duration]);

    return <span ref={elementRef}>{count}{suffix}</span>;
}

function StatItem({ to, suffix, label }: { to: number; suffix: string; label: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pt-6 first:pt-0 md:pt-0 md:px-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none"
        >
            <span
                className="text-5xl md:text-6xl font-display font-bold mb-3 transition-colors duration-300"
                style={{
                    color: isHovered ? '#000000' : 'var(--accent, #E8593C)',
                }}
            >
                <AnimatedCounter from={0} to={to} suffix={suffix} />
            </span>
            <span
                className="text-[11px] uppercase tracking-[0.25em] font-black transition-colors duration-300"
                style={{
                    color: '#000000',
                }}
            >
                {label}
            </span>
        </div>
    );
}

export default function HomeStats() {
    const pathname = usePathname();
    const t = useTranslations('home.stats');

    // Mapear rutas con locales
    const cleanPath = pathname.replace(/\/$/, '');
    const isHome = cleanPath === '' || cleanPath === '/es' || cleanPath === '/eu' || cleanPath === '/en' || cleanPath === '/fr';

    if (!isHome) return null;

    return (
        <section className="py-2 relative overflow-hidden bg-nautical-deep border-b border-sea-foam/5 selection:bg-accent selection:text-nautical-black">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 blur-[90px] rounded-full pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto glass-card p-4 md:p-6 border-sea-foam/10 bg-sea-foam/[0.01] rounded-2xl shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/95">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-sea-foam/10">
                        {/* Stat 1: 15+ Años de Pasión */}
                        <StatItem to={15} suffix="+" label={t('pasion')} />

                        {/* Stat 2: 7K+ Alumnos Formados */}
                        <StatItem to={7} suffix="K+" label={t('alumnos')} />

                        {/* Stat 3: 30+ Barcos en Flota */}
                        <StatItem to={30} suffix="+" label={t('flota')} />
                    </div>
                </div>
            </div>
        </section>
    );
}
