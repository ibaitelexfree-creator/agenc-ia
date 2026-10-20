'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, Heart, Share2, Sparkles, ChevronRight } from 'lucide-react';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/animations/variants';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    rating: number;
}

export default function TiendaPage() {
    const products: Product[] = [
            {
            id: '1',
            name: "01. Sudadera Regata Oficial",
            price: 49,
            category: "Ropa Técnica",
            image: "/images/sudadera-regata-j80.jpg",
            description: "Sudadera térmica e impermeable de alta calidad bordada con el emblema de la escuela. Protección óptima en el mar.",
            rating: 5
        },
        {
            id: '2',
            name: "02. Gorra Getxo Bela Pro",
            price: 18,
            category: "Accesorios",
            image: "",
            description: "Gorra transpirable con sujeción antiviento para navegación. Ajustable y con protección solar UPF 50+.",
            rating: 4
        },
        {
            id: '3',
            name: "03. Bono Bautismo de Vela (2h)",
            price: 65,
            category: "Bonos Regalo",
            image: "/images/bono-bautismo-j80.jpg",
            description: "Regala una experiencia inolvidable. 2 horas de navegación tutorizada a bordo de un velero J80 para una persona.",
            rating: 5
        },
        {
            id: '4',
            name: "04. Bono Alquiler Kayak (10h)",
            price: 90,
            category: "Bonos Regalo",
            image: "/images/chubasquero-atardecer.jpg",
            description: "Tarjeta de abonado multisesión para alquiler de kayak individual. Válido durante toda la temporada.",
            rating: 4
        },
        {
            id: '5',
            name: "05. Chubasquero Cortavientos",
            price: 85,
            category: "Ropa Técnica",
            image: "",
            description: "Chaqueta impermeable ligera, diseñada especialmente para regatas. Costuras selladas y puños elásticos.",
            rating: 5
        },
        {
            id: '6',
            name: "06. Bolsa Estanca Getxo Bela (20L)",
            price: 25,
            category: "Accesorios",
            image: "",
            description: "Petate estanco de alta resistencia para proteger tu ropa, móvil y cámaras de salpicaduras y caídas al agua.",
            rating: 5
        },
        {
            id: '7',
            name: "07. Guantes de Navegación Pro",
            price: 29,
            category: "Accesorios",
            image: "/images/guantes-navegacion-pro.jpg",
            description: "Guantes ergonómicos antideslizantes para cabo y maniobras de vela. Refuerzo en palmas y dedos.",
            rating: 5
        },
        {
            id: '8',
            name: "08. Chaleco Salvavidas Deportivo",
            price: 75,
            category: "Ropa Técnica",
            image: "",
            description: "Chaleco de flotabilidad homologado 50N, diseño compacto para máxima libertad de movimiento al navegar.",
            rating: 5
        },
        {
            id: '9',
            name: "09. Licencia de Navegación (Teórico+Práctico)",
            price: 120,
            category: "Bonos Regalo",
            image: "/images/course-raquero-students.webp",
            description: "Bono de formación completa para obtener el Titulín en un solo día sin examen. Incluye material.",
            rating: 5
        },
        {
            id: '10',
            name: "10. Toalla Microfibra Getxo Bela",
            price: 22,
            category: "Accesorios",
            image: "/images/home-cta-join.webp",
            description: "Toalla náutica ultraligera y de secado superrápido con funda de transporte compacta.",
            rating: 4
        }
    ];

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* Header */}
            <section className="relative pt-16 min-[480px]:pt-20 sm:pt-40 md:pt-48 pb-6 min-[480px]:pb-8 sm:pb-24 overflow-hidden bg-nautical-deep w-full">
                <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-3 sm:px-6 relative z-10 text-center">
                    <header className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] sm:text-xs font-black tracking-widest uppercase mb-2 sm:mb-4 animate-fade-in-up">
                            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Tienda Oficial • 10 Productos
                        </span>
                        <h1 className="text-2xl min-[480px]:text-3xl sm:text-5xl md:text-8xl font-display text-sea-foam leading-none uppercase">
                            Equipamiento y <br />
                            <span className="italic font-light text-brass-gold/90">regalos náuticos</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-foreground/50 font-light text-xs sm:text-lg leading-relaxed mt-3 sm:mt-8">
                            Viste los colores de la escuela o regala navegación con nuestra selección de merchandising y bonos multisesión listos para canjear.
                        </p>
                    </header>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-8 sm:py-24 relative">
                <div className="container mx-auto px-3 sm:px-6">
                    <StaggeredEntrance type="slide" staggerDelay={0.12} className="grid grid-cols-1 landscape:max-h-[500px]:grid-cols-3 max-h-[500px]:grid-cols-2 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                {...hoverLift}
                                className="group relative bg-sea-foam/[0.02] border border-sea-foam/10 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col h-full shadow-lg scale-[0.93]"
                            >
                                {/* Image Box with CTA Overlay */}
                                <div className="relative aspect-[4/3] max-h-[110px] min-[480px]:max-h-[130px] sm:max-h-none overflow-hidden bg-black flex items-center justify-center">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-3 sm:p-6 text-center border-b border-sea-foam/10">
                                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-sea-foam/5 border border-sea-foam/10 flex items-center justify-center mb-1 sm:mb-2">
                                                <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-accent/60" />
                                            </div>
                                            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-sea-foam/30 font-black">
                                                Getxo Bela • Black Edition
                                            </span>
                                        </div>
                                    )}
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500" />

                                    {/* Number Badge */}
                                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-nautical-black font-mono font-black text-[9px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
                                        #{String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Action CTA Overlay - Hidden initially, fades in on hover */}
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none group-hover:pointer-events-auto bg-black/40 backdrop-blur-sm"
                                    >
                                        <button 
                                            onClick={() => alert(`Enlace de compra para ${product.name} en desarrollo.`)}
                                            className="px-4 py-2 sm:px-8 sm:py-4 bg-accent text-white text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black rounded-full hover:scale-105 active:scale-95 shadow-xl shadow-accent/20 transition-all pointer-events-auto flex items-center gap-1.5 sm:gap-2"
                                        >
                                            Comprar Ahora
                                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </motion.div>

                                    {/* Category Accent */}
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full text-[7px] sm:text-[9px] uppercase tracking-widest text-accent font-black">
                                        {product.category}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-2.5 min-[480px]:p-3.5 sm:p-8 flex flex-col flex-grow justify-between gap-3 sm:gap-6">
                                    <div className="space-y-1.5 sm:space-y-4">
                                        <div className="flex justify-between items-baseline border-b border-sea-foam/10 pb-1.5 sm:pb-4 gap-2">
                                            <span className="text-[7px] min-[480px]:text-[8px] sm:text-[9px] uppercase tracking-widest text-sea-foam/40 font-black">Getxo Bela • Item {index + 1}</span>
                                            <span className="text-base min-[480px]:text-lg sm:text-xl font-display text-accent italic">
                                                {product.price}<span className="text-sea-foam text-xs ml-0.5">€</span>
                                            </span>
                                        </div>
                                        <h3 className="text-xs min-[480px]:text-sm sm:text-2xl font-display text-sea-foam group-hover:text-accent transition-colors duration-500 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sea-foam/60 text-[10px] min-[480px]:text-xs sm:text-sm font-light leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Stars & Details */}
                                    <div className="flex items-center justify-between pt-1.5 sm:pt-4 border-t border-sea-foam/10 text-sea-foam/40 text-[7px] sm:text-[9px] uppercase tracking-wider font-bold">
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < product.rating ? 'text-brass-gold fill-brass-gold' : 'text-sea-foam/10'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span>Garantía Oficial</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </StaggeredEntrance>
                </div>
            </section>
        </main>
    );
}
