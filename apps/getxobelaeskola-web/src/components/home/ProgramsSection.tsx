'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import AmbientOrb from '@/components/ui/AmbientOrb';

interface ProgramsSectionProps {
    locale: string;
    badge: string;
    title: string;
    learn_more: string;
    programs: {
        title: string;
        price: string;
        desc: string;
        image: string;
        link: string;
    }[];
}

function ProgramCard({ locale, prog, learn_more }: { locale: string; prog: any; learn_more: string }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 20 });
    const springY = useSpring(y, { stiffness: 150, damping: 20 });

    // Rotación sutil de hasta 6 grados
    const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

    // Scroll parallax para la imagen interior
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'end start']
    });
    const yImage = useTransform(scrollYProgress, [0, 1], [-45, 45]);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
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
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            className="w-full h-[600px] rounded-[1.5rem] overflow-hidden shadow-2xl"
        >
            <Link
                ref={cardRef}
                href={`/${locale}${prog.link}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group block w-full h-full relative border border-white/5 hover:border-accent/40 transition-colors duration-700 bg-white/[0.01] overflow-hidden"
            >
                {/* Contenedor de la imagen con parallax vertical */}
                <motion.div 
                    style={{ y: yImage, transformStyle: 'preserve-3d' }} 
                    className="absolute -inset-y-16 inset-x-0 w-full h-[calc(100%+128px)] pointer-events-none"
                >
                    <Image
                        src={prog.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-nautical-black via-nautical-black/40 to-transparent pointer-events-none" />

                <div style={{ transform: 'translateZ(30px)' }} className="absolute inset-0 p-12 flex flex-col justify-end text-left pointer-events-none">
                    <span className="text-brass-gold font-display text-2xl mb-4 block leading-none">
                        {prog.price}
                    </span>
                    <h3 className="text-4xl font-display text-white mb-6 italic leading-tight group-hover:text-accent transition-colors text-balance">
                        {prog.title}
                    </h3>
                    <p className="text-white/80 font-light text-base leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                        {prog.desc}
                    </p>
                    <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-black text-accent mt-4">
                        <span className="border-b-2 border-accent pb-1 group-hover:border-accent transition-all duration-500">
                            {learn_more}
                        </span>
                        <span className="translate-x-0 group-hover:translate-x-3 transition-transform duration-500">→</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function ProgramsSection({ locale, badge, title, learn_more, programs }: ProgramsSectionProps) {
    return (
        <section className="py-64 bg-nautical-black relative overflow-hidden">
            {/* Orbes de luz ambientales en fondos */}
            <AmbientOrb color="accent" size="w-[600px] h-[600px]" className="-left-96 top-1/4 opacity-20" />
            <AmbientOrb color="brass" size="w-[500px] h-[500px]" className="-right-64 bottom-1/4 opacity-15" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <header className="mb-32">
                    <span className="text-accent uppercase tracking-[0.6em] text-sm font-bold mb-8 block">
                        {badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-7xl lg:text-9xl font-display text-white mb-12 italic leading-none">
                        {title}
                    </h2>
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-brass-gold to-transparent mx-auto" />
                </header>

                <StaggeredEntrance type="slide" staggerDelay={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((prog, i) => (
                        <ProgramCard key={i} locale={locale} prog={prog} learn_more={learn_more} />
                    ))}
                </StaggeredEntrance>
            </div>
        </section>
    );
}

