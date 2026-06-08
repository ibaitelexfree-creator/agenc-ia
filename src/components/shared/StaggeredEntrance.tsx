'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StaggeredEntranceProps {
    children: React.ReactNode;
    delay?: number;
    staggerDelay?: number;
    className?: string;
    type?: 'fade' | 'slide' | 'recombine';
    inView?: boolean;
}

export default function StaggeredEntrance({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className = '',
    type = 'recombine',
    inView = true
}: StaggeredEntranceProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            }
        }
    };

    const item = {
        hidden: (custom: number) => {
            if (type === 'recombine') {
                // Alternating directions for "reassembly" feel
                const x = custom % 4 === 0 ? -30 : custom % 4 === 1 ? 30 : 0;
                const y = custom % 4 === 2 ? -20 : custom % 4 === 3 ? 20 : 10;
                return { opacity: 0, x, y, scale: 0.95 };
            }
            if (type === 'slide') {
                return { opacity: 0, y: 20 };
            }
            return { opacity: 0 };
        },
        show: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                damping: 20,
                stiffness: 100,
                duration: 0.8
            }
        }
    };

    // Wrap children to inject animation variants if they are not already motion elements
    const animatedChildren = React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
            <motion.div variants={item} custom={index}>
                {child}
            </motion.div>
        );
    });

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? undefined : "show"}
            whileInView={inView ? "show" : undefined}
            viewport={inView ? { once: true, amount: 0.15 } : undefined}
            className={className}
        >
            {animatedChildren}
        </motion.div>
    );
}
