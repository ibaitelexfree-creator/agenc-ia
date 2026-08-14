'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Removed manual scroll-to-top on mount to prevent massive layout reflows (433ms).
    // Next.js handles route transition scrolling natively.

    // 2. Show button on scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // 3. Listen for external hide/show events
    const [isExternallyHidden, setIsExternallyHidden] = useState(false);
    useEffect(() => {
        const hideScroll = () => setIsExternallyHidden(true);
        const showScroll = () => setIsExternallyHidden(false);

        window.addEventListener('hide-scroll-to-top', hideScroll);
        window.addEventListener('show-scroll-to-top', showScroll);
        return () => {
            window.removeEventListener('hide-scroll-to-top', hideScroll);
            window.removeEventListener('show-scroll-to-top', showScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#A91D22', // Rojo granate corporativo
                boxShadow: '0 4px 16px rgba(169, 29, 34, 0.3)',
                cursor: 'pointer',
                border: 'none',
                color: 'white',
            }}
            className={`transition-all duration-500 hover:scale-110 group ${isVisible && !isExternallyHidden ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-50 pointer-events-none'
                }`}
            aria-label="Volver al inicio de la página"
        >
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-25 group-hover:opacity-40" />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:-translate-y-0.5 transition-transform"
            >
                <path d="m18 15-6-6-6 6" />
            </svg>
        </button>
    );
}
