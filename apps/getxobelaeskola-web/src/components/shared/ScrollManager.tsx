'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollManager() {
    const pathname = usePathname();

    useEffect(() => {
        // Prevent default browser scroll restoration so we can control it
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const handleScroll = () => {
            if (pathname) {
                sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
            }
        };

        const restoreScroll = () => {
            if (pathname) {
                if (pathname === '/' || pathname === '/es' || pathname === '/eu' || pathname === '/en') {
                    // Always scroll to top on home page
                    window.scrollTo({ top: 0, behavior: 'instant' });
                } else {
                    // Restore scroll for other pages
                    const savedScroll = sessionStorage.getItem(`scroll_${pathname}`);
                    if (savedScroll) {
                        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Use a timeout to allow layout to settle before restoring scroll
        const timer = setTimeout(restoreScroll, 150);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [pathname]);

    return null;
}
