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

        // If it's a native HTML element, convert it dynamically to a motion component
        // so that layout classes (e.g. col-span, grid position) remain on the main layout element.
        if (typeof child.type === 'string') {
            const MotionComponent = (motion as any)[child.type] || motion(child.type as any);
            return (
                <MotionComponent
                    {...child.props}
                    key={child.key ?? index}
                    variants={item}
                    custom={index}
                />
            );
        }

        // For custom React components, we wrap them in a motion.div
        // but we extract layout/positioning/sizing classes to prevent layout breaks.
        const childClass = (child.props as any)?.className || '';
        const classes = childClass.split(/\s+/);
        const layoutClasses = classes.filter((cls: string) => {
            const isResponsive = /^(sm:|md:|lg:|xl:|2xl:)/.test(cls);
            const baseClass = isResponsive ? cls.split(':')[1] : cls;
            return (
                /^col-/.test(baseClass) ||
                /^row-/.test(baseClass) ||
                /^self-/.test(baseClass) ||
                /^flex-/.test(baseClass) ||
                baseClass === 'flex' ||
                baseClass === 'grid' ||
                baseClass === 'hidden' ||
                baseClass === 'block' ||
                baseClass === 'inline' ||
                baseClass === 'shrink' ||
                baseClass === 'grow' ||
                baseClass === 'shrink-0' ||
                baseClass === 'grow-0' ||
                baseClass === 'relative' ||
                baseClass === 'absolute' ||
                baseClass === 'fixed' ||
                baseClass === 'sticky' ||
                /^w-/.test(baseClass) ||
                /^h-/.test(baseClass) ||
                /^min-w-/.test(baseClass) ||
                /^max-w-/.test(baseClass) ||
                /^min-h-/.test(baseClass) ||
                /^max-h-/.test(baseClass)
            );
        }).join(' ');

        return (
            <motion.div
                key={child.key ?? index}
                variants={item}
                custom={index}
                className={layoutClasses || undefined}
            >
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
            viewport={inView ? { once: false, amount: 0.001 } : undefined}
            className={className}
        >
            {animatedChildren}
        </motion.div>
    );
}
