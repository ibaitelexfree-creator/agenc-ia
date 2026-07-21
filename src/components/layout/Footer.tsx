import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Newsletter from '@/components/shared/Newsletter';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Clock, MapPin, Phone } from 'lucide-react';

const GetxoKirolakLogo = () => (
    <div className="flex items-center gap-2 text-sea-foam/40 hover:text-accent transition-all duration-300 cursor-pointer group/kirolak">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4.5h-2V7h2v6z" />
        </svg>
        <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] leading-none">GETXO</span>
            <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-sea-foam/20 group-hover/kirolak:text-accent/60 transition-all duration-300">KIROLAK</span>
        </div>
    </div>
);

// KitDigital logos are loaded as SVGs from the public folder

export default async function Footer({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'footer' });
    const supabase = createClient();

    // Check if we should hide the newsletter
    const { data: { user } } = await supabase.auth.getUser();
    let isSubscribed = false;

    if (user?.email) {
        const supabaseAdmin = createAdminClient();
        const { data: sub } = await supabaseAdmin
            .from('newsletter_subscriptions')
            .select('active')
            .eq('email', user.email)
            .eq('active', true)
            .maybeSingle();

        if (sub) isSubscribed = true;
    }

    return (
        <footer className="bg-nautical-deep border-t border-sea-foam/10 selection:bg-accent selection:text-nautical-black relative">
            <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
            {!isSubscribed && <Newsletter locale={locale} />}

            <div className="py-24 container mx-auto px-6 flex flex-col items-center">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 mb-12 group">
                    <div className="relative w-28 h-28 md:w-36 md:h-36 transition-premium group-hover:scale-105">
                        <Image
                            src="/images/LogoGetxoBelaEskola.webp"
                            alt="Getxo Bela Eskola"
                            fill
                            sizes="(max-width: 768px) 112px, 144px"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-display text-3xl md:text-5xl text-sea-foam uppercase tracking-tight leading-none">
                            GETXO <span className="italic font-light text-accent">BELA</span>
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] text-sea-foam/30 font-black mt-3">Escuela Náutica Oficial</span>
                    </div>
                </div>

                {/* Footer Navigation Links */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-sea-foam/50 mb-12">
                    {[
                        { href: '', label: 'Inicio' },
                        { href: 'club/conocenos', label: 'Club' },
                        { href: 'servicios/cursos', label: 'Servicios' },
                        { href: 'blog/noticias', label: 'Blog' },
                        { href: 'contacto/localizacion', label: 'Contacto' },
                        { href: 'tienda', label: 'Tienda' }
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={`/${locale}/${link.href}`}
                            className="hover:text-accent transition-premium relative group/f"
                        >
                            {link.label.toUpperCase()}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-premium group-hover/f:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Horario, Contacto y Ubicación Column */}
                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-center md:text-left mb-12 text-[10px] uppercase tracking-widest text-sea-foam/40 border-y border-sea-foam/10 py-8 w-full max-w-3xl">
                    <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                        <div className="flex items-center gap-2 text-accent font-black">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Horario</span>
                        </div>
                        <span className="text-sea-foam/60 font-medium">Lunes a Domingo</span>
                        <span className="text-sea-foam/60 font-medium">09:00 — 20:00</span>
                    </div>

                    <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                        <div className="flex items-center gap-2 text-accent font-black">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Ubicación</span>
                        </div>
                        <span className="text-sea-foam/60 font-medium">Muelle Arriluzea, s/n</span>
                        <span className="text-sea-foam/60 font-medium">48990 Getxo, Vizcaya</span>
                    </div>

                    <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                        <div className="flex items-center gap-2 text-accent font-black">
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contacto</span>
                        </div>
                        <span className="text-sea-foam/60 font-medium">+34 944 000 000</span>
                        <span className="text-sea-foam/60 font-medium">info@getxobelaeskola.com</span>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6 mb-12">
                    {[
                        { name: 'Facebook', href: 'https://www.facebook.com/Pakea.bela.eskola/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                        { name: 'Instagram', href: 'https://www.instagram.com/pakeabelaeskola/', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' }
                    ].map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full border border-sea-foam/10 bg-sea-foam/[0.02] flex items-center justify-center text-sea-foam/30 hover:text-accent hover:border-accent/40 hover:bg-accent/5 hover:scale-110 active:scale-95 transition-premium group"
                            aria-label={social.name}
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d={social.icon} />
                            </svg>
                        </a>
                    ))}
                </div>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-sea-foam/10 to-transparent mb-12" />

                {/* Sponsor Collaborators section */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12 border-t border-sea-foam/10 pt-8 w-full max-w-4xl px-6">
                    {/* NextGenerationEU Logo */}
                    <div className="h-8 md:h-10 w-auto flex items-center justify-center relative opacity-70 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-125 transition-all duration-500 ease-out cursor-pointer group">
                        <Image
                            src="/images/logo-nextgen.svg"
                            alt="Financiado por la Unión Europea - NextGenerationEU"
                            width={180}
                            height={40}
                            className="object-contain h-full w-auto transition-transform duration-500 ease-out"
                        />
                    </div>
                    
                    {/* Plan de Recuperación Logo */}
                    <div className="h-4.5 md:h-6 w-auto flex items-center justify-center relative opacity-70 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-125 transition-all duration-500 ease-out cursor-pointer group">
                        <Image
                            src="/images/logo-plan-recuperacion.svg"
                            alt="Plan de Recuperación, Transformación y Resiliencia"
                            width={140}
                            height={26}
                            className="object-contain h-full w-auto transition-transform duration-500 ease-out"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-sea-foam/20 mb-12">
                    <Link href={`/${locale}/privacy`} className="hover:text-accent transition-premium">{t('privacy')}</Link>
                    <Link href={`/${locale}/cookies`} className="hover:text-accent transition-premium">{t('cookies')}</Link>
                </div>

                <div className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-sea-foam/40 font-medium text-center max-w-xl leading-loose">
                    {t('copyright')}
                    <br />
                    <span className="mt-6 block text-sea-foam/20 hover:text-accent transition-premium cursor-default font-black tracking-[0.5em]">
                        {t('slogan')}
                    </span>
                </div>
            </div>
        </footer>
    );
}
