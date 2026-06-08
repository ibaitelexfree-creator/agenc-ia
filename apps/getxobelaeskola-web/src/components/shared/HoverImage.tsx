'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

interface HoverImageProps extends Omit<ImageProps, 'className'> {
    className?: string;
    imageClassName?: string;
    containerClassName?: string;
}

export default function HoverImage({ 
    className = '', 
    imageClassName = '', 
    containerClassName = '', 
    ...props 
}: HoverImageProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`overflow-hidden relative ${containerClassName}`}
        >
            <Image
                {...props}
                className={`transition-all duration-[1.2s] ease-out ${imageClassName}`}
            />
        </motion.div>
    );
}
