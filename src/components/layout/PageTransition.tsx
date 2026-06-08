'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitions } from '@/lib/animations/variants';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={pageTransitions}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-grow flex flex-col"
        >
            {children}
        </motion.div>
    );
}
