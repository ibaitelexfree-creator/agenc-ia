'use client';

import Link from 'next/link';
import NauticalImage from '@/components/ui/NauticalImage';
import { useTranslations } from 'next-intl';
import { Anchor, Users, Clock, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRentalPricingInfo } from '@/lib/rentalPricing';

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
    isSocio?: boolean;
    onBook: (serviceId: string, optionIndex?: number) => void;
}

export default function RentalCard({ service, locale, index, isSocio = false, onBook }: RentalCardProps) {
    const t = useTranslations('rental_page');
    const tData = useTranslations('rentals_data');
    const hasTranslation = tData.has(service.slug);
    const name = hasTranslation
        ? tData(service.slug)
        : (locale === 'es' ? service.nombre_es : (locale === 'eu' ? service.nombre_eu : service.nombre_es)) || service.nombre_es;

    const isWindsurfMooring = service.slug.includes('atraque-windsurf') || service.slug.includes('windsurf-board-mooring') || (service.nombre_es || '').toLowerCase().includes('windsurf board mooring') || ((service.nombre_es || '').toLowerCase().includes('atraque') && (service.nombre_es || '').toLowerCase().includes('windsurf'));

    // Determine image source with fallbacks
    const getImgSrc = () => {
        const n = (service.nombre_es || '').toLowerCase();
        const slug = (service.slug || '').toLowerCase();
        const dbImg = service.imagen_url;


        // ✅ Priority 1: Use DB image if it's valid and specific (not a placeholder)
        const hasValidDbImage = dbImg
            && dbImg.startsWith('/images/')
            && !dbImg.includes('placeholder')
            && !dbImg.includes('rental-category')
            && !dbImg.includes('home-hero');

        if (hasValidDbImage) {
            return dbImg;
        }

        // ✅ Priority 2: Fallback — pattern matching only when DB image is missing/invalid
        let src = dbImg;

        const isDinghyVoucher = slug.includes('dinghy-sailing-voucher') || slug.includes('bono-vela-ligera') || n.includes('dinghy sailing voucher') || n.includes('bono vela ligera');

        if (isDinghyVoucher) {
            src = '/images/dinghy-sailing-voucher.jpg';
        } else if (slug.includes('bigsub') || n.includes('bigsub') || n.includes('bigsup')) {
            src = '/images/rental-bigsub.jpg';
        } else if (isWindsurfMooring) {
            src = '/images/experiences/windsurf-board-mooring.jpg';
        } else if (slug.includes('transeunte-gt8m') || slug.includes('transient-mooring-gt8m') || slug.includes('transient-mooring-8m-plus') || n.includes('transient mooring (> 8m)') || n.includes('transeúnte (> 8m)') || n.includes('transeunte (> 8m)') || n.includes('> 8m') || n.includes('>8m')) {
            src = '/images/transient-mooring-gt8m.jpg';
        } else if (slug.includes('transeunte-8m') || slug.includes('transient-mooring-8m') || n.includes('transient mooring (< 8m)') || n.includes('transeúnte (< 8m)') || n.includes('transeunte (< 8m)')) {
            src = '/images/transient-mooring-8m.jpg';
        } else if (slug.includes('atraque-piragua') || slug.includes('canoe-mooring') || n.includes('canoe mooring') || n.includes('atraque piragua') || n.includes('atraque de piragua')) {
            src = '/images/canoe-mooring.jpg';
        } else if (n.includes('j80') || slug.includes('j80')) {
            src = '/images/J80.jpg';
        } else if (n.includes('420') || slug.includes('420')) {
            src = '/images/420.jpg';
        } else if (slug.includes('omega') || n.includes('omega')) {
            if (service.precio_base === 140 || n.includes('without skipper') || slug.includes('without-skipper') || n.includes('sin patrón') || n.includes('sin patron')) {
                src = '/images/alquiler-raquero-without-skipper.jpg';
            } else {
                src = '/images/alquiler-raquero-omega.jpg';
            }
        } else if (n.includes('raquero') || slug.includes('raquero')) {
            src = '/images/alquiler-raquero.jpg';
        } else if (n.includes('optimist') || slug.includes('optimist')) {
            src = '/images/rental-optimist.webp';
        } else if (n.includes('laser') || slug.includes('laser')) {
            src = '/images/alquiler-laser.webp';
        } else if (slug.includes('kayak') || slug.includes('piragua') || n.includes('kayak (1') || n.includes('kayak (1 person)')) {
            src = '/images/kayak-1-person.webp';
        } else if (slug.includes('tarpon') || slug.includes('tarpoon') || n.includes('tarpon') || n.includes('tarpoon')) {
            src = '/images/tarpoon-patron.jpg';
        } else if (slug.includes('paddlesurf') || service.categoria === 'paddlesurf' || n.includes('paddle')) {
            src = '/images/paddle-surf.webp';
        } else if (slug.includes('windsurf') || (service.categoria === 'windsurf' && !isWindsurfMooring)) {
            src = '/images/alquiler-windsurf-pro.jpg';
        }

        if (!src || src.includes('placeholder') || src.includes('rental-category')) {
            if (isWindsurfMooring) src = '/images/experiences/windsurf-board-mooring.jpg';
            else if (service.categoria === 'windsurf' || slug.includes('windsurf')) src = '/images/alquiler-windsurf-pro.jpg';
            else if (service.categoria === 'paddlesurf' || service.categoria === 'kayak' || service.categoria === 'piragua') src = '/images/paddle-surf.webp';
            else src = '/images/J80.jpg';
        }
        return src;
    };

    // Determine capacity based on service type
    const getCapacity = () => {
        const s = service.slug.toLowerCase();
        if (s.includes('j80')) return '6';
        if (s.includes('raquero')) return '8';
        if (s.includes('kayak-2') || s.includes('piragua-2')) return '2';
        if (s.includes('kayak-1') || s.includes('piragua-1') || s.includes('optimist') || s.includes('laser') || s.includes('windsurf')) return '1';
        return '1-4';
    };

    const imgSrc = getImgSrc();
    const isWindsurfVoucher = service.slug === 'bono-windsurf' || (service.nombre_es || '').toLowerCase().includes('bono de windsurf') || (service.nombre_es || '').toLowerCase().includes('windsurf voucher');
    const isWindsurfRental = (service.slug.includes('windsurf') || service.categoria === 'windsurf') && !isWindsurfMooring && !isWindsurfVoucher;
    const isCanoeMooring = service.slug.includes('atraque-piragua') || service.slug.includes('canoe-mooring') || (service.nombre_es || '').toLowerCase().includes('canoe mooring') || (service.nombre_es || '').toLowerCase().includes('atraque piragua');
    const isTransientGt8m = service.slug.includes('gt8m') || service.slug.includes('8m-plus') || service.slug.includes('transeunte-gt8m') || (service.nombre_es || '').toLowerCase().includes('> 8m') || (service.nombre_es || '').toLowerCase().includes('>8m') || (service.nombre_es || '').toLowerCase().includes('transient mooring (> 8m)');
    const isTransientLt8m = service.slug.includes('transeunte-8m') || service.slug.includes('transient-mooring-8m') || (service.nombre_es || '').toLowerCase().includes('< 8m') || (service.nombre_es || '').toLowerCase().includes('<8m') || (service.nombre_es || '').toLowerCase().includes('transient mooring (< 8m)');
    const isBigsub = service.slug.includes('bigsub') || (service.nombre_es || '').toLowerCase().includes('bigsub') || (service.nombre_es || '').toLowerCase().includes('bigsup');
    const isJ80SinPatron = (service.slug.includes('j80') || (service.nombre_es || '').toLowerCase().includes('j80')) && (service.slug.includes('sin-patron') || (service.nombre_es || '').toLowerCase().includes('sin patr'));
    const isTarpoon = service.slug === 'alquiler-tarpon-patron' || service.slug === 'tarpon' || service.slug === 'tarpoon';

    const pricingInfo = getRentalPricingInfo(service, isSocio);

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`group relative glass-card overflow-hidden h-full flex flex-col cursor-pointer ${
                pricingInfo.hasSocioDiscount ? 'border-accent/40 shadow-[0_0_20px_rgba(255,77,0,0.1)]' : ''
            }`}
        >
            {/* Image Header with Responsive Aspect Ratio */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                <NauticalImage
                    src={imgSrc}
                    category={service.categoria as any}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 saturate-[1.35] brightness-[1.14] contrast-[1.12] ${
                        isBigsub
                            ? 'object-[center_60%]'
                            : isTransientLt8m
                                ? 'object-center'
                                : isTransientGt8m
                                    ? 'object-[52%_85%]'
                                    : isCanoeMooring
                                        ? 'object-[45%_42%]'
                                        : (service.slug.includes('raquero') || service.nombre_es.toLowerCase().includes('raquero'))
                                            ? 'object-[center_65%]'
                                            : (service.slug.includes('j80') || service.nombre_es.toLowerCase().includes('j80'))
                                                ? (service.precio_base >= 250 || (service.nombre_es || '').toLowerCase().includes('con patr'))
                                                    ? 'object-[50%_center]'
                                                    : 'object-[35%_center] scale-[1.44] origin-[35%_center]'
                                                : isTarpoon
                                                    ? 'object-[center_55%]'
                                                : isWindsurfMooring
                                                    ? 'object-[center_85%]'
                                                    : isWindsurfVoucher
                                                        ? 'object-[center_47.5%]'
                                                        : isWindsurfRental
                                                            ? 'object-[center_65%]'
                                                        : (service.nombre_es.toLowerCase().includes('420') || service.slug.includes('420'))
                                                            ? 'object-center'
                                                            : (service.nombre_es.toLowerCase().includes('optimist') || service.slug.includes('optimist'))
                                                                ? 'object-top'
                                                                : (service.nombre_es.toLowerCase().includes('laser') || service.slug.includes('laser'))
                                                                    ? 'object-[center_65%] !saturate-[1.5] !brightness-[1.16] !contrast-[1.12]'
                                                                    : 'object-center'
                    }`}
                />

                {/* Global warm-natural overlay for all images */}
                                {/* Sky blue enhancement overlay (+20% vibrant blue sky) */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-sky-300/10 to-transparent mix-blend-overlay pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-300/5 via-transparent to-amber-500/5 mix-blend-overlay pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-nautical-deep via-transparent to-transparent z-10" />

                {/* Member Badge Overlay */}
                {pricingInfo.hasSocioDiscount && (
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-accent text-nautical-black font-black text-[9px] uppercase tracking-wider rounded-sm shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{t('card.member_badge')}</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-3 min-[480px]:p-4 sm:p-6 md:p-8 landscape:p-4 flex flex-col flex-1 relative z-20">
                <div className="mb-1.5 min-[480px]:mb-2 sm:mb-6 landscape:mb-3">
                    <div className="flex justify-between items-start mb-1 min-[480px]:mb-1.5 sm:mb-3 landscape:mb-1.5">
                        <h3 className="text-xs min-[480px]:text-sm sm:text-xl md:text-2xl landscape:text-base font-display text-sea-foam italic leading-tight group-hover:text-accent transition-colors duration-500 line-clamp-2">
                            {name}
                        </h3>
                    </div>

                    {/* Specs & Pricing Row */}
                    <div className="grid grid-cols-3 gap-2 py-2 sm:py-3 border-y border-sea-foam/10 mb-2 sm:mb-4">
                        {/* 1. Tripulación Mínima */}
                        <div className="flex flex-col gap-0.5 sm:gap-1">
                            <span className="text-[7px] min-[480px]:text-[8px] uppercase tracking-wider min-[480px]:tracking-widest text-sea-foam/40 whitespace-pre-line leading-tight">
                                {t('crew_label')}
                            </span>
                            <div className="flex items-center gap-1 text-sea-foam/70">
                                <Users className="w-2.5 h-2.5 min-[480px]:w-3 min-[480px]:h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                                <span className="text-[10px] min-[480px]:text-xs font-bold font-mono">
                                    {pricingInfo.tripulacion_minima}
                                </span>
                            </div>
                            {pricingInfo.tripulacion_subtexto && (
                                <span className="text-[8px] min-[480px]:text-[9px] text-accent/90 font-medium leading-tight mt-0.5">
                                    {pricingInfo.tripulacion_subtexto.includes('2,5h') || pricingInfo.tripulacion_subtexto.includes('2.5h')
                                        ? t('card.included_trips', { trips: 4, hours: t('card.hours_fraction', { hours: '2,5' }) })
                                        : pricingInfo.tripulacion_subtexto.includes('4h')
                                            ? t('card.included_trips', { trips: 4, hours: t('card.hours_short', { hours: 4 }) })
                                            : pricingInfo.tripulacion_subtexto}
                                </span>
                            )}
                        </div>

                        {/* 2. Columna Central: Matrícula o Fianza */}
                        <div className="flex flex-col gap-0.5 sm:gap-1 border-x border-sea-foam/10 px-2 justify-center">
                            {pricingInfo.hasMatricula ? (
                                <>
                                    <span className="text-[7px] min-[480px]:text-[8px] uppercase tracking-wider min-[480px]:tracking-widest text-sea-foam/40">
                                        {t('card.registration')}
                                    </span>
                                    <div className="flex items-center gap-1 text-sea-foam/70">
                                        <FileText className="w-2.5 h-2.5 min-[480px]:w-3 min-[480px]:h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                                        <span className="text-[10px] min-[480px]:text-xs font-mono font-medium">
                                            {pricingInfo.matricula} €
                                        </span>
                                    </div>
                                </>
                            ) : pricingInfo.hasFianza ? (
                                <>
                                    <span className="text-[7px] min-[480px]:text-[8px] uppercase tracking-wider min-[480px]:tracking-widest text-sea-foam/40">
                                        {t('card.deposit')}
                                    </span>
                                    <div className="flex items-center gap-1 text-sea-foam/70">
                                        <ShieldCheck className="w-2.5 h-2.5 min-[480px]:w-3 min-[480px]:h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                                        <span className="text-[10px] min-[480px]:text-xs font-mono font-medium">
                                            {pricingInfo.fianza} €
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-[11px] text-sea-foam/20 font-mono">—</span>
                                </div>
                            )}
                        </div>

                        {/* 3. Columna Derecha: Precios */}
                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-1 justify-center">
                            {pricingInfo.hasSocioDiscount && (
                                <span className="text-[7px] min-[480px]:text-[8px] uppercase tracking-wider min-[480px]:tracking-widest text-accent font-bold">
                                    {t('card.member_rate')}
                                </span>
                            )}
                            <div className="flex flex-col gap-0.5 text-sea-foam/90 leading-tight">
                                {pricingInfo.precios_lineas.map((line, idx) => {
                                    // Localizar formato de horas y términos de cada línea de precio
                                    let formattedLine = line
                                        .replace(/(\d+)\s*h\b/g, (_, h) => t('card.hours_short', { hours: h }))
                                        .replace(/\/ mes\b/g, `/ ${t('card.month')}`)
                                        .replace(/\bpax\b/g, t('card.person'))
                                        .replace(/\btotal\b/g, t('card.total'))
                                        .replace(/\bAnual\b/g, t('card.annual'))
                                        .replace(/\bMensual\b/g, t('card.monthly'));

                                    return (
                                        <span
                                            key={idx}
                                            className="font-display italic font-bold tracking-tight whitespace-nowrap text-[11px] min-[480px]:text-xs sm:text-sm text-sea-foam"
                                        >
                                            {formattedLine}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detalle o notas adicionales */}
                    {(pricingInfo.hasSocioDiscount || pricingInfo.detalle_adicional) && (
                        <div className="text-[9px] min-[480px]:text-[10px] leading-relaxed mb-2">
                            {pricingInfo.hasSocioDiscount && pricingInfo.socio_nota && (
                                <p className="text-accent/90 font-medium">
                                    ⭐ {pricingInfo.socio_nota.includes('45 €')
                                        ? t('card.full_boat_with_members', { price: 100, singlePrice: 45 })
                                        : pricingInfo.socio_nota.includes('40 €')
                                            ? t('card.full_boat_with_members', { price: 80, singlePrice: 40 })
                                            : pricingInfo.socio_precio
                                                ? t('card.full_boat_no_deposit', { price: pricingInfo.socio_precio })
                                                : pricingInfo.socio_nota}
                                </p>
                            )}
                            {pricingInfo.detalle_adicional && !pricingInfo.hasSocioDiscount && (
                                <p className="text-sea-foam/50 italic">
                                    {pricingInfo.detalle_adicional.includes('45 €')
                                        ? t('card.single_day_with_members', { price: 45 })
                                        : pricingInfo.detalle_adicional.includes('40 €')
                                            ? t('card.single_day_with_members', { price: 40 })
                                            : pricingInfo.detalle_adicional.includes('Mínimo 4 personas')
                                                ? t('card.min_people', { count: 4 })
                                                : pricingInfo.detalle_adicional.includes('Sin patrón: 180 € / 4h')
                                                    ? t('card.without_skipper', {
                                                        price1: `180 € / ${t('card.hours_short', { hours: 4 })}`,
                                                        price2: `250 € / ${t('card.hours_short', { hours: 4 })}`
                                                    })
                                                    : pricingInfo.detalle_adicional.includes('Sin patrón: 140 € / 4h')
                                                        ? t('card.without_skipper', {
                                                            price1: `140 € / ${t('card.hours_short', { hours: 4 })}`,
                                                            price2: `200 € / ${t('card.hours_short', { hours: 4 })}`
                                                        })
                                                        : pricingInfo.detalle_adicional}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-1 min-[480px]:pt-1.5 sm:pt-4">
                    <button
                        onClick={() => onBook(service.id)}
                        className="group/btn relative w-full overflow-hidden bg-sea-foam/[0.02] border border-sea-foam/10 p-1.5 min-[480px]:p-2.5 sm:p-5 rounded-sm hover:border-accent transition-all duration-500 flex items-center justify-between"
                    >
                        <span className="text-[8px] min-[480px]:text-[9px] sm:text-[10px] uppercase tracking-[0.15em] min-[480px]:tracking-[0.3em] sm:tracking-[0.4em] font-black text-sea-foam/60 group-hover/btn:text-accent group-hover/btn:translate-x-1.5 transition-all">
                            {t('booking.book_now')}
                        </span>
                        <ArrowRight className="w-3 h-3 min-[480px]:w-3.5 min-[480px]:h-3.5 sm:w-4 sm:h-4 text-sea-foam/30 group-hover/btn:text-accent group-hover/btn:-translate-x-1.5 transition-all" />

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
