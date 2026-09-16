'use client';

import { useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Table } from 'lucide-react';
import PriceTableModal from './PriceTableModal';

interface Category {
    id: string;
    nombre_es: string;
    nombre_eu: string;
    slug: string;
}

interface CourseFiltersProps {
    categories: Category[];
    locale: string;
}

export default function CourseFilters({ categories, locale }: CourseFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    const priceButtonLabel = isEu
        ? 'Prezioen Taula'
        : isEn
        ? 'Pricing Table'
        : isFr
        ? 'Grille Tarifaire'
        : 'Tabla de Precios';

    const handleCategoryChange = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) {
            params.set('category', id);
        } else {
            params.delete('category');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -260 : 260;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="relative mb-[clamp(1.5rem,3vw,3.5rem)] w-full space-y-3 sm:space-y-4">
                {/* Top Action Bar: Price Table Button (Top Right) */}
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        onClick={() => setIsPriceModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-brass-gold/30 bg-brass-gold/10 hover:bg-brass-gold hover:text-nautical-black text-brass-gold transition-all duration-300 shadow-[0_0_20px_rgba(242,169,59,0.15)] group"
                    >
                        <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brass-gold group-hover:text-nautical-black transition-colors" />
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                            {priceButtonLabel}
                        </span>
                        <span className="text-xs opacity-70 group-hover:opacity-100 font-serif italic ml-0.5">✦</span>
                    </button>
                </div>

                {/* Filter Navigation Bar */}
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                    {/* Scrollable Filter Category Buttons */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 flex overflow-x-auto pb-1 sm:pb-2 gap-2 sm:gap-3 md:gap-4 no-scrollbar scroll-smooth select-none"
                    >
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className={`whitespace-nowrap px-[clamp(1rem,1.8vw,2rem)] py-[clamp(0.4rem,0.8vw,0.75rem)] rounded-sm text-[clamp(0.6rem,0.75vw,0.75rem)] font-black uppercase tracking-[0.3em] transition-all duration-500 border flex-shrink-0 ${!activeCategory
                                ? 'bg-accent text-nautical-black border-accent shadow-[0_0_25px_rgba(255,77,0,0.25)]'
                                : 'bg-sea-foam/[0.02] text-sea-foam/50 border-sea-foam/10 hover:border-sea-foam/20 hover:text-sea-foam'
                                }`}
                        >
                            {locale === 'eu' ? 'Guztiak' : (locale === 'en' ? 'All' : 'Todos')}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`whitespace-nowrap px-[clamp(1rem,1.8vw,2rem)] py-[clamp(0.4rem,0.8vw,0.75rem)] rounded-sm text-[clamp(0.6rem,0.75vw,0.75rem)] font-black uppercase tracking-[0.3em] transition-all duration-500 border flex-shrink-0 ${activeCategory === cat.id
                                    ? 'bg-accent text-nautical-black border-accent shadow-[0_0_25px_rgba(255,77,0,0.25)]'
                                    : 'bg-sea-foam/[0.02] text-sea-foam/50 border-sea-foam/10 hover:border-sea-foam/20 hover:text-sea-foam'
                                    }`}
                            >
                                {locale === 'eu' ? cat.nombre_eu : cat.nombre_es}
                            </button>
                        ))}
                    </div>

                    {/* Interactive Left / Right Scroll Buttons */}
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-1">
                        <button
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sea-foam/20 bg-sea-foam/[0.03] hover:bg-accent hover:border-accent hover:text-nautical-black text-sea-foam flex items-center justify-center transition-all duration-300 shadow-sm"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sea-foam/20 bg-sea-foam/[0.03] hover:bg-accent hover:border-accent hover:text-nautical-black text-sea-foam flex items-center justify-center transition-all duration-300 shadow-sm"
                        >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Price Table Modal Popup */}
            <PriceTableModal
                isOpen={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
                locale={locale}
            />
        </>
    );
}

