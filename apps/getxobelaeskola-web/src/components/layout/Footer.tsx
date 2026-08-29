import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Newsletter from '@/components/shared/Newsletter';
import HomeStats from '@/components/shared/HomeStats';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Clock, MapPin, Phone } from 'lucide-react';
import CollaboratorsGrid from '@/components/shared/CollaboratorsGrid';


const SalesianasLogo = () => (
    <a href="https://barakaldo.salesianas.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:scale-105 transition-all duration-300 select-none">
        <svg className="h-8 w-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="30" r="10" fill="#00A2C9" />
            <circle cx="68" cy="38" r="7" fill="#00A2C9" />
            <path d="M32,65 C32,50 48,45 54,55 C60,45 76,50 76,65 L76,80 C76,80 32,80 32,80 Z" fill="#00A2C9" />
            <path d="M48,58 C45,55 35,55 35,62 L35,80 L48,80 Z" fill="#99C020" />
            <path d="M50,75 A15,15 0 0 1 65,90" stroke="#99C020" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col text-left leading-none font-bold text-[#99C020]">
            <span className="text-[5px] text-neutral-400 font-semibold leading-none uppercase">Colegio Nuestra Señora de Begoña</span>
            <span className="text-[6px] text-amber-500 tracking-wider font-semibold">Barakaldo</span>
            <span className="text-[12px] font-black tracking-tight leading-none text-[#99C020]">Salesianas</span>
        </div>
    </a>
);

const AntonioTruebaLogo = () => (
    <a href="https://www.antoniotruebaipi.hezkuntza.net/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:scale-105 transition-all duration-300 select-none">
        <svg className="h-8 w-auto" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42,38 C42,43 38,46 33,46 C26,46 22,40 22,32 C22,22 26,16 34,16 C38,16 41,18 43,22 L43,13 L38,13 L38,8 L43,8 L43,3 L48,3 L48,8 L53,8 L53,13 L48,13 L48,38 C48,41 49,42 51,42 L53,42 L53,46 C49,47 45,46 42,38 Z M43,30 C43,26 40,22 35,22 C30,22 27,26 27,32 C27,38 30,42 35,42 C40,42 43,38 43,30 Z" fill="#1A1A1A" />
        </svg>
        <div className="flex flex-col text-left leading-none font-black text-neutral-800">
            <span className="text-[6px] uppercase tracking-wider">CPI</span>
            <span className="text-[9px] tracking-tight">Antonio Trueba</span>
            <span className="text-[7px] text-right font-bold">IPI</span>
        </div>
    </a>
);

const DecathlonLogo = () => (
    <a href="https://www.decathlon.es/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:scale-105 transition-all duration-300 select-none" aria-label="Decathlon">
        <svg className="h-7 w-auto rounded" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="110" height="32" fill="#0082C3" />
            <text x="55" y="21" fill="#FFFFFF" fontSize="10.5" fontWeight="900" fontStyle="italic" fontFamily="'Arial Black', 'Impact', sans-serif" textAnchor="middle" letterSpacing="0.04em">DECATHLON</text>
        </svg>
    </a>
);

const DeustukoIkastolaLogo = () => (
    <a href="https://www.deustukoikastola.eus/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:scale-105 transition-all duration-300 select-none">
        <svg className="h-8 w-auto" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25,12 C18,12 14,15 14,23 C14,31 19,34 25,34 C31,34 36,31 36,23 C36,15 32,12 25,12 Z" fill="#E30613" />
            <path d="M27,6 L25,12 C27,12 30,10 27,6 Z" fill="#E30613" />
            <path d="M28,18 C23,18 20,22 20,26 C24,26 28,23 28,18 Z" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left font-black text-[9px] text-neutral-800 leading-tight">
            <span>DEUSTUKO</span>
            <span className="text-neutral-500 font-bold">IKASTOLA</span>
        </div>
    </a>
);

const DownFundacionLogo = () => (
    <a href="https://www.downpv.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:scale-105 transition-all duration-300 select-none">
        <svg className="h-8 w-auto" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,8 C12,12 18,28 20,32" stroke="#7CBF22" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M20,8 C18,12 12,28 10,32" stroke="#7CBF22" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="12" y1="12" x2="18" y2="12" stroke="#7CBF22" strokeWidth="2" />
            <line x1="13" y1="17" x2="17" y2="17" stroke="#7CBF22" strokeWidth="2" />
            <line x1="14" y1="22" x2="16" y2="22" stroke="#7CBF22" strokeWidth="2" />
            <line x1="13" y1="27" x2="17" y2="27" stroke="#7CBF22" strokeWidth="2" />
            <circle cx="10" cy="8" r="2" fill="#7CBF22" />
            <circle cx="20" cy="8" r="2" fill="#7CBF22" />
            <circle cx="10" cy="32" r="2" fill="#7CBF22" />
            <circle cx="20" cy="32" r="2" fill="#7CBF22" />
        </svg>
        <div className="flex flex-col text-left text-neutral-800 leading-none">
            <span className="text-[6px] font-semibold text-neutral-500">Fundación</span>
            <span className="text-[7.5px] font-black uppercase text-neutral-800">SÍNDROME de</span>
            <span className="text-[11px] font-black text-neutral-900 leading-none uppercase">DOWN</span>
            <span className="text-[4.5px] text-neutral-400 font-semibold leading-none">y otras discapacidades intelectuales</span>
            <span className="text-[5.5px] font-black text-neutral-600 leading-none">País Vasco</span>
        </div>
    </a>
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
        <footer
            className="bg-nautical-deep border-t border-sea-foam/10 selection:bg-accent selection:text-nautical-black relative z-20"
        >
            <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />
            {!isSubscribed && <Newsletter locale={locale} />}
            <HomeStats />

            <div className="py-24 global-container flex flex-col items-center">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 mb-12 group">
                    <div className="flex flex-col items-center">
                        <span className="font-display text-3xl md:text-5xl text-sea-foam uppercase tracking-tight leading-none">
                            GETXO <span className="italic font-light text-accent">BELA</span>
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] text-sea-foam/30 font-black mt-3">Escuela Náutica Oficial</span>
                    </div>
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
                        <span className="text-sea-foam/60 font-medium">(+34) 944 916 632</span>
                        <span className="text-sea-foam/60 font-medium">info@getxobelaeskola.com</span>
                    </div>
                </div>



                <div className="w-24 h-px bg-gradient-to-r from-transparent via-sea-foam/10 to-transparent mb-12" />

                {/* Colaboradores Section */}
                <CollaboratorsGrid />

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

                <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-3 text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.3em] font-black text-sea-foam/20 mb-12 text-center max-w-full px-4">
                    <Link href={`/${locale}/privacy`} className="hover:text-accent transition-premium break-words">{t('privacy')}</Link>
                    <Link href={`/${locale}/cookies`} className="hover:text-accent transition-premium break-words">{t('cookies')}</Link>
                    <Link href={`/${locale}/declaracion-de-accesibilidad`} className="hover:text-accent transition-premium break-words">{t('accessibility')}</Link>
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
