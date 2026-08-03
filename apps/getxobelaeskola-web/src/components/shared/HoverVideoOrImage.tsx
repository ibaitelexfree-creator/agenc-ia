'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

interface HoverVideoOrImageProps extends Omit<ImageProps, 'className'> {
    videoSrc?: string;
    className?: string;
    imageClassName?: string;
    videoClassName?: string;
    containerClassName?: string;
}

export default function HoverVideoOrImage({
    videoSrc,
    className = '',
    imageClassName = '',
    videoClassName = '',
    containerClassName = '',
    ...props
}: HoverVideoOrImageProps) {
    const isFill = props.fill ?? (!props.width && !props.height);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.08 }}
            className={`overflow-hidden relative ${containerClassName}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Image
                fill={isFill}
                sizes={props.sizes || "(max-width: 768px) 100vw, 50vw"}
                {...props}
                className={`transition-all duration-[1.2s] ease-out ${imageClassName} ${isHovered && videoSrc ? 'opacity-0' : 'opacity-100'}`}
            />
            {videoSrc && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out pointer-events-none ${videoClassName} ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </motion.div>
    );
}
