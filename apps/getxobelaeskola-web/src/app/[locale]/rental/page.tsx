import React from 'react';
import { createClient } from '@/lib/supabase/server';
import RentalClient from '@/components/rental/RentalClient';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { getSeoAlternates, siteUrl } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'rental_page' });

    const title = `${t('title_prefix')} ${t('title_highlight')} | Getxo Bela Eskola`;
    const description = t('description');

    return {
        title,
        description,
        alternates: getSeoAlternates('rental', locale),
        openGraph: {
            title,
            description,
            url: `${siteUrl}/${locale}/rental`,
            images: [
                {
                    url: '/images/home-hero-sailing-action.webp',
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/images/home-hero-sailing-action.webp'],
        }
    };
}

export function generateStaticParams() {
    return ['es', 'eu', 'en', 'fr'].map(locale => ({ locale }));
}

interface Service {
    id: string;
    slug: string;
    nombre: string;
    nombre_es?: string;
    nombre_eu?: string;
    nombre_en?: string;
    descripcion: string;
    descripcion_es?: string;
    descripcion_eu?: string;
    descripcion_en?: string;
    imagen_url: string;
    precio_base: number;
    precio_hora?: number;
    activo: boolean;
    categoria?: string;
    opciones?: any[];
}

export default async function RentalPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'rental_page' });
    const tData = await getTranslations({ locale, namespace: 'rentals_data' });
    const supabase = createClient();
    let services: Service[] = [];
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getxobelaeskola.cloud';

    try {
        const { data, error } = await supabase
            .from('servicios_alquiler')
            .select('*')
            .eq('activo', true)
            .order('precio_base', { ascending: true });

        if (error) {
            console.error('Error fetching rental services:', error);
        } else {
            const priorityOrder = [
                // 1. Vela ligera y Veleros / Barcos a vela (prioridad máxima para escuela de vela)
                // 'alquiler-j80' retirado en favor de las tarjetas específicas sin patrón y con patrón
                'alquiler-j80-sin-patron',
                'alquiler-j80-patron',
                // 'alquiler-raquero' y 'alquiler-raquero-omega' retirados en favor de sin patrón y con patrón
                'alquiler-omega-sin-patron',
                'alquiler-omega-patron',
                'alquiler-laser',
                // 'alquiler-laser-pro' duplicado retirado para dejar solo una tarjeta Laser
                // 'alquiler-420' (Doble) retirado para dejar solo '420'
                'alquiler-420-pro',
                // 'alquiler-optimist' retirado
                'bono-vela-ligera',
                'bono-windsurf',
                'alquiler-tarpon-patron',
                // 2. Atraques (solo los 4 indicados)
                'atraque-windsurf',
                'atraque-velero',
                'atraque-piragua',
                'atraque-piragua-doble',
                // 3. Windsurf (vela sobre tabla)
                'alquiler-windsurf',
                'alquiler-windsurf-pro',
                // 4. Otros / Eventos / Paddle Surf
                'alquiler-paddlesurf',
                'alquiler-bigsub-group',
                'cumple-bigsub',
                'alquiler-espacio-eventos',
                'socia-premium',
                // 5. Piraguas (kayaks y piragua doble de alquiler retirados)
                'alquiler-piragua-1'
            ];

            // Type assertion here because Supabase response might not perfectly match our strict interface
            let fetchedList = (((data as unknown as Service[]) || [])
                .filter(s => !['alquiler-j80', 'alquiler-raquero', 'alquiler-raquero-omega', 'alquiler-laser-pro', 'alquiler-420', 'alquiler-optimist', 'alquiler-kayak-1', 'alquiler-kayak-2', 'alquiler-piragua-2', 'atraque-transeunte-8m', 'atraque-transeunte-12m'].includes(s.slug)));

            // Si bono-windsurf no está todavía en la base de datos de servicios_alquiler, lo aseguramos
            if (!fetchedList.some(s => s.slug === 'bono-windsurf')) {
                fetchedList.push({
                    id: 'bono-windsurf',
                    slug: 'bono-windsurf',
                    nombre: 'Bono de Windsurf',
                    nombre_es: 'Bono de Windsurf',
                    nombre_eu: 'Windsurf Bonua',
                    descripcion: 'Bono de Windsurf: 4 salidas de 2,5 horas',
                    imagen_url: '/images/alquiler-windsurf-pro.jpg',
                    precio_base: 110,
                    activo: true,
                    categoria: 'bonos'
                } as Service);
            }

            // Asegurar que atraque-piragua-doble esté en la lista
            if (!fetchedList.some(s => s.slug === 'atraque-piragua-doble')) {
                fetchedList.push({
                    id: 'atraque-piragua-doble',
                    slug: 'atraque-piragua-doble',
                    nombre: 'Atraque Piragua Doble',
                    nombre_es: 'Atraque Piragua Doble',
                    nombre_eu: 'Piragua Bikoitzeko Atrakatzea',
                    descripcion: 'Atraque y guarda de piragua doble: 30 €/mes (anual) o 40 € meses sueltos. Matrícula 560 €',
                    imagen_url: '/images/canoe-mooring.jpg',
                    precio_base: 30,
                    activo: true,
                    categoria: 'atraques'
                } as Service);
            }

            // Actualizar precio_base del atraque windsurf a 30
            fetchedList = fetchedList.map(s => {
                if (s.slug === 'atraque-windsurf') {
                    return { ...s, precio_base: 30 };
                }
                return s;
            });

            services = fetchedList.sort((a, b) => {
                const indexA = priorityOrder.indexOf(a.slug);
                const indexB = priorityOrder.indexOf(b.slug);

                const posA = indexA === -1 ? 999 : indexA;
                const posB = indexB === -1 ? 999 : indexB;

                return posA - posB;
            });
        }

        if (!services || services.length === 0) {
            services = [
                { id: '9-sin', slug: 'alquiler-j80-sin-patron', nombre: 'J-80 sin patrón', nombre_es: 'J-80 sin patrón', nombre_eu: 'J-80 patroi gabe', descripcion: 'Alquiler velero J80 sin patrón', imagen_url: '/images/alquiler-j80-sin-patron.jpg', precio_base: 180, activo: true, categoria: 'veleros' },
                { id: '9-con', slug: 'alquiler-j80-patron', nombre: 'J-80 con patrón', nombre_es: 'J-80 con patrón', nombre_eu: 'J-80 patroiarekin', descripcion: 'Alquiler velero J80 con patrón', imagen_url: '/images/J80.jpg', precio_base: 250, activo: true, categoria: 'veleros' },
                { id: '10-sin', slug: 'alquiler-omega-sin-patron', nombre: 'Omega/Raquero sin patrón', nombre_es: 'Omega/Raquero sin patrón', nombre_eu: 'Omega/Raquero patron gabe', descripcion: 'Alquiler Omega/Raquero sin patrón', imagen_url: '/images/alquiler-raquero.jpg', precio_base: 140, activo: true, categoria: 'veleros' },
                { id: '10-con', slug: 'alquiler-omega-patron', nombre: 'Omega/Raquero con patrón', nombre_es: 'Omega/Raquero con patrón', nombre_eu: 'Omega/Raquero patroiarekin', descripcion: 'Alquiler Omega/Raquero con patrón', imagen_url: '/images/alquiler-raquero.jpg', precio_base: 200, activo: true, categoria: 'veleros' },
                { id: '11', slug: 'alquiler-420-pro', nombre: '420', nombre_es: '420', nombre_eu: '420', descripcion: 'Embarcación de vela ligera tipo 420', imagen_url: '/images/420.jpg', precio_base: 45, activo: true, categoria: 'veleros' },
                { id: 'bono-vl', slug: 'bono-vela-ligera', nombre: 'Bono Vela Ligera, crucero y/o windsurf', nombre_es: 'Bono Vela Ligera, crucero y/o windsurf', nombre_eu: 'Bela Arina, gurutzontzia eta/edo windsurf bonua', descripcion: 'Bono de 4 salidas', imagen_url: '/images/dinghy-sailing-voucher.jpg', precio_base: 150, activo: true, categoria: 'bonos' },
                { id: 'bono-ws', slug: 'bono-windsurf', nombre: 'Bono de Windsurf', nombre_es: 'Bono de Windsurf', nombre_eu: 'Windsurf Bonua', descripcion: 'Bono de 4 salidas de 2,5 horas', imagen_url: '/images/alquiler-windsurf-pro.jpg', precio_base: 110, activo: true, categoria: 'bonos' },
                { id: '18', slug: 'atraque-velero', nombre: 'Atraque Velero', nombre_es: 'Atraque Velero', nombre_eu: 'Belontzi Atrakatzea', descripcion: 'Atraque mensual para velero: 50 €/mes. Matrícula 50 €', imagen_url: '/images/atraque-velero.webp', precio_base: 50, activo: true, categoria: 'atraques' },
                { id: 'at-ws', slug: 'atraque-windsurf', nombre: 'Atraque Windsurf', nombre_es: 'Atraque Windsurf', nombre_eu: 'Windsurf Atrakatzea', descripcion: 'Atraque para windsurf: 30 €/mes. Matrícula 50 €', imagen_url: '/images/experiences/windsurf-board-mooring.jpg', precio_base: 30, activo: true, categoria: 'atraques' },
                { id: 'at-pi', slug: 'atraque-piragua', nombre: 'Atraque Piragua Individual', nombre_es: 'Atraque Piragua Individual', nombre_eu: 'Piragua Bakarkako Atrakatzea', descripcion: 'Atraque piragua individual: Anual 25 €/mes · Mensual 35 €. Matrícula 50 €', imagen_url: '/images/canoe-mooring.jpg', precio_base: 25, activo: true, categoria: 'atraques' },
                { id: 'at-pd', slug: 'atraque-piragua-doble', nombre: 'Atraque Piragua Doble', nombre_es: 'Atraque Piragua Doble', nombre_eu: 'Piragua Bikoitzeko Atrakatzea', descripcion: 'Atraque piragua doble: Anual 30 €/mes · Mensual 40 €. Matrícula 50 €', imagen_url: '/images/canoe-mooring.jpg', precio_base: 30, activo: true, categoria: 'atraques' },
                { id: '6', slug: 'alquiler-windsurf', nombre: 'Windsurf', nombre_es: 'Windsurf', nombre_eu: 'Windsurf', descripcion: 'Equipo de Windsurf', imagen_url: '/images/courses/PerfeccionamientoVela.webp', precio_base: 30, activo: true, categoria: 'windsurf' },
                { id: '3', slug: 'alquiler-paddlesurf', nombre: 'Paddle Surf', nombre_es: 'Paddle Surf', nombre_eu: 'Paddle Surf', descripcion: 'Tabla de Stand Up Paddle', imagen_url: '/images/paddle-surf.webp', precio_base: 15, activo: true, categoria: 'paddlesurf' },
                { id: '4', slug: 'alquiler-piragua-1', nombre: 'Piragua', nombre_es: 'Piragua', nombre_eu: 'Piragua', descripcion: 'Alquiler de piragua', imagen_url: '/images/kayak-1-person.webp', precio_base: 15, activo: true, categoria: 'piragua' }
            ];
        }
    } catch (err) {
        console.error('Network error fetching services:', err);
    }

    // Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': `${t('title_prefix')} ${t('title_highlight')}`,
        'description': t('description'),
        'numberOfItems': services.length,
        'itemListElement': services.map((service, index) => {
            const hasTranslation = tData.has(service.slug);
            const serviceName = hasTranslation
                ? tData(service.slug)
                : (locale === 'es' ? service.nombre_es : (locale === 'eu' ? service.nombre_eu : service.nombre_es)) || service.nombre;
            return {
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Product',
                    'name': serviceName,
                    'description': locale === 'eu' ? (service.descripcion_eu || service.descripcion) : service.descripcion,
                    'image': `${siteUrl}${service.imagen_url || '/images/home-hero-sailing-action.webp'}`,
                    'offers': {
                        '@type': 'Offer',
                        'price': service.precio_base || service.precio_hora,
                        'priceCurrency': 'EUR',
                        'availability': 'https://schema.org/InStock',
                        'url': `${siteUrl}/${locale}/rental`
                    }
                }
            };
        })
    };

    return (
        <main className="min-h-[100dvh] w-full bg-nautical-black text-sea-foam selection:bg-accent selection:text-nautical-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Cinematic Header Section */}
            <section className="rental-header-section relative pt-[clamp(7.5rem,14vh,11rem)] pb-2 sm:pb-4 overflow-hidden w-full">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-brass-gold/5 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <RentalClient
                        services={(services as any[]) || []}
                        locale={locale}
                        headerData={{
                            eyebrow: t('header_eyebrow'),
                            titlePrefix: t('title_prefix'),
                            titleHighlight: t('title_highlight'),
                            description: t('description')
                        }}
                    />

                    {/* Bottom Note / Disclosure */}
                    <div className="w-full max-w-7xl mx-auto mt-8 sm:mt-16 md:mt-20 landscape:mt-8 pb-12 sm:pb-20">
                        <div className="relative group p-4 sm:p-8 md:p-12 landscape:p-6 border border-sea-foam/10 bg-sea-foam/[0.02] backdrop-blur-sm overflow-hidden rounded-2xl sm:rounded-3xl">
                            <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-700" />
                            <p className="text-sea-foam/60 font-light italic text-xs sm:text-base md:text-lg leading-relaxed max-w-4xl">
                                {t('footer_note')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Background Grid Signature */}
            <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none z-0" />
        </main>
    );
}
