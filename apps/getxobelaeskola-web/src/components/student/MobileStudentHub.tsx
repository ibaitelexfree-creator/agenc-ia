'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Sailboat, GraduationCap, User, Trophy, Calendar, ChevronRight, Anchor, Compass, Book } from 'lucide-react';
import DailyNauticalQuote from '@/components/student/DailyNauticalQuote';
import StaggeredEntrance from '@/components/shared/StaggeredEntrance';
import { Profile, Inscripcion, Rental, AcademyStats } from '@/types/student';

interface MobileStudentHubProps {
    profile: Profile | null | undefined;
    upcomingInscripciones: Inscripcion[];
    upcomingRentals: Rental[];
    academyStats?: Partial<AcademyStats>;
    locale: string;
    t: any;
}

export default function MobileStudentHub({
    profile,
    upcomingInscripciones,
    upcomingRentals,
    academyStats,
    locale,
    t
}: MobileStudentHubProps) {
    const router = useRouter();
    const userName = profile?.nombre?.split(' ')[0] || 'Navegante';
    const hasBookings = upcomingInscripciones.length > 0 || upcomingRentals.length > 0;

    const quickActions = [
        {
            label: t.academy_widget?.title || 'Campus Virtual',
            icon: <BookOpen className="w-6 h-6 text-blue-400" />,
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            href: `/${locale}/student/courses`
        },
        {
            label: t.rentals_section?.title.split(' ')[1] || 'Alquileres',
            icon: <Sailboat className="w-6 h-6 text-emerald-400" />,
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            href: `/${locale}/student/rentals`
        },
        {
            label: t.mobile_hub?.digital_academy || 'Academia Digital',
            icon: <Compass className="w-6 h-6 text-cyan-400" />,
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            href: `/${locale}/academy`
        },
        {
            label: t.mobile_hub?.club || 'Club',
            icon: <Anchor className="w-6 h-6 text-brass-gold" />,
            bg: 'bg-brass-gold/10',
            border: 'border-brass-gold/20',
            href: `/${locale}/student/membership`
        },
    ];

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    };

    const getMilesLabel = () => {
        if (locale === 'en') return 'Miles';
        if (locale === 'eu') return 'Miliak';
        if (locale === 'fr') return 'Milles';
        return 'Millas';
    };

    return (
        <StaggeredEntrance className="flex flex-col gap-8 pb-24" type="recombine">
            {/* Header Greeting */}
            <header className="px-6 pt-8 relative z-[100]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-black/40 text-xs uppercase tracking-widest font-bold">{t.welcome?.split(',')[0]},</span>
                        <h1 className="text-3xl font-display text-black">
                            {userName} <span className="animate-wave inline-block origin-bottom-right">👋</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => router.push(`/${locale}/student/profile`)}
                        className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent active:scale-95 transition-transform"
                    >
                        <User className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>
            </header>

            {/* Academy Quick Stats */}
            {academyStats && (
                <section className="px-6">
                    <div className="bg-black/5 border border-black/10 rounded-2xl p-6 flex justify-between items-center overflow-hidden relative">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full pointer-events-none" />

                        <div className="grid grid-cols-3 gap-8 w-full relative z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{getMilesLabel()}</span>
                                <span className="text-2xl font-display text-black">{academyStats.totalMiles || 0}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{t.academy_widget?.stats_levels || 'Niveles'}</span>
                                <span className="text-2xl font-display text-black">{academyStats.academyLevels || 0}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{t.academy_widget?.stats_certs || 'Certif.'}</span>
                                <span className="text-2xl font-display text-black">{academyStats.academyCerts || 0}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Quick Actions Grid */}
            <section className="px-6 grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        prefetch={false}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border backdrop-blur-sm transition-transform active:scale-95 ${action.bg} ${action.border}`}
                    >
                        <div className="p-3 rounded-full bg-black/5 shadow-inner">
                            {action.icon}
                        </div>
                        <span className="text-sm font-bold text-black tracking-wide">{action.label}</span>
                    </Link>
                ))}
            </section>

            {/* Daily Nautical Quote */}
            <section className="px-6">
                <DailyNauticalQuote locale={locale} />
            </section>

            {/* Upcoming Bookings Slider */}
            {hasBookings && (
                <section className="pl-6">
                    <div className="flex items-center justify-between pr-6 mb-4">
                        <h2 className="text-xs uppercase tracking-widest text-black/60 font-bold">{t.mobile_hub?.upcoming_event || 'Próximo Evento'}</h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-8 pr-6 snap-x snap-mandatory scrollbar-hide">
                        {upcomingInscripciones.map((ins: Inscripcion, i: number) => {
                            const date = ins.ediciones_curso?.fecha_inicio || ins.metadata?.start_date;
                            const name = (locale === 'eu' ? ins.cursos?.nombre_eu : ins.cursos?.nombre_es) || 'Curso de Vela';
                            return (
                                <div key={`course-${i}`} className="min-w-[85%] sm:min-w-[300px] snap-center bg-nautical-black border border-black/10 rounded-2xl p-5 relative overflow-hidden h-32 flex flex-col justify-between group">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />

                                    <div className="flex justify-between items-start z-10">
                                        <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                                            {t.mobile_hub?.course || 'Curso'}
                                        </span>
                                        <span className="text-black font-mono text-xs">{formatDate(date)}</span>
                                    </div>

                                    <div className="z-10">
                                        <h3 className="text-lg font-display text-black italic truncate">{name}</h3>
                                        <p className="text-black/40 text-xs">Arriluze Kaia, Getxo</p>
                                    </div>
                                </div>
                            );
                        })}

                        {upcomingRentals.map((rent: Rental, i: number) => {
                            const date = rent.fecha_reserva;
                            return (
                                <div key={`rental-${i}`} className="min-w-[85%] sm:min-w-[300px] snap-center bg-nautical-black border border-black/10 rounded-2xl p-5 relative overflow-hidden h-32 flex flex-col justify-between">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />

                                    <div className="flex justify-between items-start z-10">
                                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                                            {t.mobile_hub?.rental || 'Alquiler'}
                                        </span>
                                        <span className="text-black font-mono text-xs">{formatDate(date)}</span>
                                    </div>

                                    <div className="z-10">
                                        <h3 className="text-lg font-display text-black italic">{t.mobile_hub?.free_sailing || 'Travesía Libre'}</h3>
                                        <p className="text-black/40 text-xs">J80 - Getxo</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Daily Challenge Teaser */}
            <section className="px-6">
                <Link
                    href={`/${locale}/student/daily-challenge`}
                    prefetch={false}
                    className="block bg-gradient-to-r from-accent/20 to-transparent border border-accent/20 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-accent text-nautical-black flex items-center justify-center">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-black font-bold text-lg">{t.mobile_hub?.daily_challenge_teaser || 'Reto Diario'}</h3>
                            <p className="text-accent text-xs uppercase tracking-wider font-bold">{t.mobile_hub?.earn_xp || 'Gana +50 XP hoy'}</p>
                        </div>
                        <ChevronRight className="ml-auto text-black/40" />
                    </div>
                </Link>
            </section>
        </StaggeredEntrance>
    );
}
