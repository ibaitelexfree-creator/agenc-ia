/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'xs': '320px',
            'vsm': '320px',
            'sm': '360px',
            'md': '768px',
            'tab-sm': '768px',
            'tab': '820px',
            'lg': '1024px',
            'tab-lg': '1024px',
            'xl': '1280px',
            'laptop': '1280px',
            'desktop': '1440px',
            '2xl': '1536px',
            'desktop-xl': '1920px',
        },
        extend: {
            fontSize: {
                '2xs': ['0.825rem', { lineHeight: '1.2rem' }], // +20% (era 0.6875rem / 11px -> ~13.2px)
                'xs': ['0.9rem', { lineHeight: '1.35rem' }], // +20% (era 0.75rem / 12px -> ~14.4px)
                'sm': ['1.05rem', { lineHeight: '1.5rem' }], // +20% (era 0.875rem / 14px -> ~16.8px)
                'base': ['1.15rem', { lineHeight: '1.725rem' }], // +15% (era 1rem / 16px -> ~18.4px)
                'lg': ['1.294rem', { lineHeight: '2.01rem' }], // +15% (era 1.125rem / 18px -> ~20.7px)
                'xl': ['1.375rem', { lineHeight: '1.925rem' }], // +10% (era 1.25rem -> ~22px)
                '2xl': ['1.65rem', { lineHeight: '2.2rem' }], // +10% (era 1.5rem -> ~26.4px)
                '3xl': ['2.0625rem', { lineHeight: '2.475rem' }], // +10% (era 1.875rem -> ~33px)
                '4xl': ['2.475rem', { lineHeight: '2.75rem' }], // +10% (era 2.25rem -> ~39.6px)
                '5xl': ['3.3rem', { lineHeight: '1' }], // +10% (era 3rem -> ~52.8px)
                '6xl': ['4.125rem', { lineHeight: '1' }], // +10% (era 3.75rem -> ~66px)
                '7xl': ['4.95rem', { lineHeight: '1' }], // +10% (era 4.5rem -> ~79.2px)
            },
            colors: {
                brand: {
                    blue: '#154FA3',
                    black: '#000000',
                    grey: '#F2F2F2',
                },
                nautical: {
                    black: 'var(--nautical-black)',
                    deep: 'var(--nautical-deep)',
                    blue: 'var(--nautical-blue)',
                },
                ocean: {
                    dark: '#0077B6',
                    medium: '#00B4D8',
                    light: '#ADE8F4',
                },
                'sea-foam': 'var(--sea-foam)',
                'buoy-orange': 'var(--buoy-orange)',
                'brass-gold': 'var(--brass-gold)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                },
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'rgba(255, 255, 255, 0.03)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
            },
            fontFamily: {
                display: ['var(--font-display)', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'bounce-slow': 'bounceSlow 3s infinite',
                'pulse-gentle': 'pulseGentle 4s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                bounceSlow: {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                },
                pulseGentle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                }
            },
        },
    },
    plugins: [],
}
