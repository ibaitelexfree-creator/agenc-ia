'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import AmbientOrb from '@/components/ui/AmbientOrb';

interface Feature {
    icon: string;
    title: string;
    desc: string;
}

interface FeaturesSectionProps {
    features: Feature[];
}

function TiltCard({ children }: { children: React.ReactNode }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 20 });
    const springY = useSpring(y, { stiffness: 150, damping: 20 });

    // Rango de rotación de -10 a 10 grados en cada eje
    const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        // Normalizar posición del ratón entre -0.5 y 0.5
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        x.set(mouseX / width);
        y.set(mouseY / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            className="flex flex-col items-center text-center p-12 rounded-[2rem] relative overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] cursor-pointer transition-all duration-500 hover:border-accent/30 group shadow-2xl"
        >
            {/* Brillo en hover de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="w-full flex flex-col items-center">
                {children}
            </div>
        </motion.div>
    );
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
    return (
        <section className="py-32 bg-nautical-black relative overflow-hidden">
            {/* Orbe ambiental flotante de fondo */}
            <AmbientOrb color="accent" size="w-[500px] h-[500px]" className="-left-64 top-12 opacity-30" />
            <AmbientOrb color="brass" size="w-[400px] h-[400px]" className="-right-48 bottom-12 opacity-25" />

            <div className="container mx-auto px-6 relative z-10">
                <StaggeredEntrance type="slide" staggerDelay={0.15} className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, i) => (
                        <TiltCard key={i}>
                            {/* Icono flotante infinitamente */}
                            <motion.div 
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    duration: 4,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                }}
                                className="relative w-40 h-40 mb-8"
                            >
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    fill
                                    sizes="160px"
                                    className="object-contain filter drop-shadow-[0_15px_30px_rgba(255,77,0,0.15)]"
                                />
                                <div className="absolute inset-0 bg-accent/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </motion.div>
                            
                            <h3 className="text-2xl font-display italic text-white mb-4 group-hover:text-accent transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-foreground/50 font-light leading-relaxed max-w-xs group-hover:text-foreground/85 transition-colors duration-300">
                                {feature.desc}
                            </p>
                        </TiltCard>
                    ))}
                </StaggeredEntrance>
            </div>
        </section>
    );
}

