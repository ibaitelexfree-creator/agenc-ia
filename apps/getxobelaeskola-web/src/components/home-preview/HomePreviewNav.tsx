'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomePreviewNav({ current }: { current: string }) {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const locale = ['es', 'eu', 'en', 'fr'].includes(segments[0]) ? segments[0] : 'es';

    const links = [
        { id: 'home', label: 'Home (Actual)', href: `/${locale}` },
        { id: 'home-8', label: 'Home 8 (Prototipo)', href: `/${locale}/home-8` },
        { id: 'home-1', label: 'Home 1 (Versión Anterior)', href: `/${locale}/home-1` }
    ];

    return (
        <aside aria-label="Selector de prototipos" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-nautical-deep/90 backdrop-blur-md border border-brass-gold/30 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-brass-gold/80 pl-2 hidden sm:inline">
                PROVISIONAL
            </span>
            <div className="h-3 w-px bg-sea-foam/20 hidden sm:block" />
            <nav className="flex items-center gap-1">
                {links.map((link) => {
                    const isActive = current === link.id;
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                isActive
                                    ? 'bg-accent text-nautical-black font-bold shadow-md shadow-accent/20'
                                    : 'text-sea-foam/70 hover:text-sea-foam hover:bg-sea-foam/10'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
