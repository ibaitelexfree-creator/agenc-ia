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
            image: "/images/course-detail-header-sailing.webp",
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
            image: "/images/chubasquero-atardecer.jpg",
            description: "Chaqueta impermeable ligera, diseñada especialmente para regatas. Costuras selladas y puños elásticos.",
            rating: 5
        },
        {
            id: '6',
            name: "06. Bolsa Estanca Getxo Bela (20L)",
            price: 25,
            category: "Accesorios",
            image: "/images/courses/PerfeccionamientoVela.webp",
            description: "Petate estanco de alta resistencia para proteger tu ropa, móvil y cámaras de salpicaduras y caídas al agua.",
            rating: 5
        },
        {
            id: '7',
            name: "07. Guantes de Navegación Pro",
            price: 29,
            category: "Accesorios",
            image: "/images/sudadera-regata-j80.jpg",
            description: "Guantes ergonómicos antideslizantes para cabo y maniobras de vela. Refuerzo en palmas y dedos.",
            rating: 5
        },
        {
            id: '8',
            name: "08. Chaleco Salvavidas Deportivo",
            price: 75,
            category: "Ropa Técnica",
            image: "/images/course-detail-header-sailing.webp",
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
        <main className="min-h-screen bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            {/* Header */}
            <section className="relative pt-48 pb-24 overflow-hidden bg-nautical-deep">
                <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <header className="max-w-4xl mx-auto space-y-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-widest uppercase mb-4 animate-fade-in-up">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Tienda Oficial • 10 Productos
                        </span>
                        <h1 className="text-5xl md:text-8xl font-display text-sea-foam leading-none uppercase">
                            Equipamiento y <br />
                            <span className="italic font-light text-brass-gold/90">regalos náuticos</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-foreground/50 font-light text-lg leading-relaxed mt-8">
                            Viste los colores de la escuela o regala navegación con nuestra selection de merchandising y bonos multisesión listos para canjear.
                        </p>
                    </header>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <StaggeredEntrance type="slide" staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                {...hoverLift}
                                className="group relative bg-sea-foam/[0.02] border border-sea-foam/10 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col h-full shadow-lg"
                            >
                                {/* Image Box with CTA Overlay */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-nautical-deep">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                    />
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500" />

                                    {/* Number Badge */}
                                    <div className="absolute top-4 right-4 bg-accent text-nautical-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-md z-10">
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
                                            className="px-8 py-4 bg-accent text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:scale-105 active:scale-95 shadow-xl shadow-accent/20 transition-all pointer-events-auto flex items-center gap-2"
                                        >
                                            Comprar Ahora
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>

                                    {/* Category Accent */}
                                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-accent font-black">
                                        {product.category}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-8 flex flex-col flex-grow justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline border-b border-sea-foam/10 pb-4 gap-2">
                                            <span className="text-[9px] uppercase tracking-widest text-sea-foam/40 font-black">Getxo Bela • Item {index + 1}</span>
                                            <span className="text-xl font-display text-accent italic">
                                                {product.price}<span className="text-sea-foam text-xs ml-0.5">€</span>
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-display text-sea-foam group-hover:text-accent transition-colors duration-500">
                                            {product.name}
                                        </h3>
                                        <p className="text-sea-foam/60 text-sm font-light leading-relaxed line-clamp-3">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Stars & Details */}
                                    <div className="flex items-center justify-between pt-4 border-t border-sea-foam/10 text-sea-foam/40 text-[9px] uppercase tracking-wider font-bold">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-3 h-3 ${i < product.rating ? 'text-brass-gold fill-brass-gold' : 'text-sea-foam/10'}`} 
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
