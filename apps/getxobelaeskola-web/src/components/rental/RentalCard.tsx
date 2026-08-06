'use client';

import Link from 'next/link';
import NauticalImage from '@/components/ui/NauticalImage';
import { useTranslations } from 'next-intl';
import { Anchor, Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RentalCardProps {
    service: {
        id: string;
        nombre_es: string;
        nombre_eu: string;
        categoria: string;
        slug: string;
        precio_base: number;
        opciones: { label: string; extra: number }[];
        imagen_url: string;
    };
    locale: string;
    index?: number;
    onBook: (serviceId: string, optionIndex?: number) => void;
}

export default function RentalCard({ service, locale, index, onBook }: RentalCardProps) {
    const t = useTranslations('rental_page');
    const tData = useTranslations('rentals_data');
    const hasTranslation = tData.has(service.slug);
    const name = hasTranslation
        ? tData(service.slug)
        : (locale === 'es' ? service.nombre_es : (locale === 'eu' ? service.nombre_eu : service.nombre_es)) || service.nombre_es;

    // Determine image source with fallbacks
    const getImgSrc = () => {
        const n = (service.nombre_es || '').toLowerCase();
        const slug = (service.slug || '').toLowerCase();
        let src = service.imagen_url;

        if (slug.includes('atraque-piragua') || slug.includes('canoe-mooring') || n.includes('canoe mooring') || n.includes('atraque piragua') || n.includes('atraque de piragua')) {
            src = '/images/canoe-mooring.jpg';
        } else if (n.includes('j80') || slug.includes('j80')) src = '/images/J80.jpg';
        else if (n.includes('raquero') || slug.includes('raquero')) src = '/images/alquiler-raquero.jpg';
        else if (n.includes('optimist') || slug.includes('optimist')) src = '/images/rental-optimist.webp';
        else if (n.includes('laser') || slug.includes('laser')) src = '/images/alquiler-laser.webp';
        else if (slug.includes('kayak-1') || slug.includes('piragua-1') || n.includes('kayak (1') || n.includes('kayak (1 person)')) src = '/images/kayak-1-person.webp';
        else if (slug.includes('paddlesurf') || service.categoria === 'paddlesurf' || n.includes('paddle')) src = '/images/paddle-surf.webp';

        if (!src || src.includes('placeholder') || src.includes('rental-category')) {
            if (service.categoria === 'windsurf' || n.includes('windsurf')) src = '/images/experiences/windsurf-mooring.jpg';
            else if (service.categoria === 'paddlesurf' || service.categoria === 'kayak' || service.categoria === 'piragua') src = '/images/paddle-surf.webp';
            else src = '/images/J80.jpg';
        }
        if (service.categoria === 'windsurf' || n.includes('windsurf')) {
            src = '/images/experiences/windsurf-mooring.jpg';
        }
        return src;
    };

    // Determine capacity based on service type
    const getCapacity = () => {
        const s = service.slug.toLowerCase();
        if (s.includes('j80')) return '6';
        if (s.includes('raquero')) return '8';
        if (s.includes('kayak-2') || s.includes('piragua-2')) return '2';
        if (s.includes('kayak-1') || s.includes('piragua-1') || s.includes('optimist') || s.includes('laser')) return '1';
        return '1-4';
    };

    const imgSrc = getImgSrc();
    const isCanoeMooring = service.slug.includes('atraque-piragua') || service.slug.includes('canoe-mooring') || (service.nombre_es || '').toLowerCase().includes('canoe mooring') || (service.nombre_es || '').toLowerCase().includes('atraque piragua');

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative glass-card overflow-hidden h-full flex flex-col cursor-pointer"
        >
            {/* Design Decor - Nautical Numbers */}
            <div className="absolute top-4 right-6 text-[120px] font-black text-sea-foam/[0.03] select-none pointer-events-none group-hover:text-accent/[0.05] transition-colors duration-1000 leading-none">
                {index !== undefined ? String(index).padStart(2, '0') : service.categoria.substring(0, 2).toUpperCase()}
            </div>

            {/* Image Header with Clip Path */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <NauticalImage
                    src={imgSrc}
                    category={service.categoria as any}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 ${
                        isCanoeMooring
                            ? 'object-[45%_42%] scale-[1.35] saturate-[1.85] brightness-[1.12] contrast-[1.22]'
                            : (service.slug.includes('raquero') || service.nombre_es.toLowerCase().includes('raquero'))
                                ? 'object-center saturate-[1.65] brightness-[1.12] contrast-[1.15] hue-rotate-[-12deg]'
                                : (service.slug.includes('j80') || service.nombre_es.toLowerCase().includes('j80'))
                                    ? 'object-[35%_center] saturate-[1.4] brightness-[1.08] contrast-[1.12] hue-rotate-[15deg]'
                                    : (service.categoria === 'windsurf' || service.nombre_es.toLowerCase().includes('windsurf'))
                                        ? 'object-[center_85%] contrast-[1.1]'
                                        : (service.nombre_es.toLowerCase().includes('optimist') 
                                            ? 'object-[center_0%] scale-110 translate-y-[35px]' 
                                            : (service.nombre_es.toLowerCase().includes('laser')
                                                ? 'object-center contrast-[1.1]'
                                                : 'object-center contrast-[1.1]'))
                    }`}
                />
                {isCanoeMooring && (
                    <>
                        {/* Vibrant Turquoise / Azure Sea Boost */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/35 via-sky-500/20 to-teal-400/25 mix-blend-color-dodge pointer-events-none z-10" />
                        {/* Warm Sunlit Glow Accent */}
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/15 via-transparent to-amber-600/20 mix-blend-overlay pointer-events-none z-10" />
                    </>
                )}
                {(service.slug.includes('raquero') || service.nombre_es.toLowerCase().includes('raquero')) && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/35 via-blue-500/25 to-sky-400/30 mix-blend-color-dodge pointer-events-none z-10" />
                )}
                {(service.slug.includes('j80') || service.nombre_es.toLowerCase().includes('j80')) && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/30 via-sky-500/20 to-blue-600/25 mix-blend-color-dodge pointer-events-none z-10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-nautical-deep via-transparent to-transparent z-10" />

                {/* Float Number & Category Badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-nautical-black/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-sea-foam/10">
                    {index !== undefined && (
                        <span className="text-xs font-mono font-bold text-accent">
                            #{index}
                        </span>
                    )}
                </div>

                {/* Float Category Label */}
                <div className="absolute bottom-6 left-8 z-20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-sea-foam/60 group-hover:text-sea-foam transition-colors">
                        {service.categoria}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-10 flex flex-col flex-1 relative z-20">
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-display text-sea-foam italic leading-tight group-hover:text-accent transition-colors duration-500">
                            {index !== undefined ? `${index}. ` : ''}{name}
                        </h3>
                    </div>

                    {/* Specs Row */}
                    <div className="flex gap-6 py-4 border-y border-sea-foam/10 mb-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] uppercase tracking-widest text-sea-foam/40">{t('crew_label')}</span>
                            <div className="flex items-center gap-1.5 text-sea-foam/70">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold font-mono">{getCapacity()}</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-sea-foam/10" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] uppercase tracking-widest text-sea-foam/40">Price/h</span>
                            <div className="flex items-center gap-1.5 text-sea-foam/70 text-lg">
                                <span className="font-display italic text-sea-foam">{service.precio_base}€</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-4">
                    <button
                        onClick={() => onBook(service.id)}
                        className="group/btn relative w-full overflow-hidden bg-sea-foam/[0.02] border border-sea-foam/10 p-5 rounded-sm hover:border-accent transition-all duration-500 flex items-center justify-between"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-sea-foam/60 group-hover/btn:text-accent group-hover/btn:translate-x-2 transition-all">
                            {t('booking.book_now')}
                        </span>
                        <ArrowRight className="w-4 h-4 text-sea-foam/30 group-hover/btn:text-accent group-hover/btn:-translate-x-2 transition-all" />

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-mesh opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
