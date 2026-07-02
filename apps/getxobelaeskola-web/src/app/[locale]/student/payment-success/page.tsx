'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const type = searchParams.get('type'); // course, rental, membership
    const [mounted, setMounted] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const t = useTranslations('payment_success_page');

    useEffect(() => {
        setMounted(true);
        if (!sessionId) {
            setLoading(false);
            return;
        }

        let attempts = 0;
        const maxAttempts = 5; // 10 seconds total (5 * 2s)
        let intervalId: any = null;

        const checkStatus = async () => {
            try {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                let data = null;

                if (type === 'rental') {
                    const res = await supabase
                        .from('reservas_alquiler')
                        .select('*, servicios_alquiler(*)')
                        .eq('stripe_session_id', sessionId)
                        .maybeSingle();
                    data = res.data;
                } else if (type === 'course') {
                    const res = await supabase
                        .from('inscripciones')
                        .select('*, cursos(*)')
                        .eq('stripe_session_id', sessionId)
                        .maybeSingle();
                    data = res.data;
                } else if (type === 'membership') {
                    const res = await supabase
                        .from('subscriptions')
                        .select('*')
                        .eq('stripe_session_id', sessionId)
                        .maybeSingle();
                    data = res.data;
                }

                if (data) {
                    setDetails(data);
                    setLoading(false);
                    if (intervalId) clearInterval(intervalId);
                    return true;
                }
            } catch (err) {
                console.error('Error fetching success details:', err);
            }
            return false;
        };

        // Initial check
        checkStatus().then((found) => {
            if (found) return;

            // Poll every 2 seconds if not found immediately
            intervalId = setInterval(async () => {
                attempts++;
                const foundInPoll = await checkStatus();
                if (foundInPoll || attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    setLoading(false);
                    if (!foundInPoll) {
                        setShowWarning(true);
                    }
                }
            }, 2000);
        });

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [sessionId, type]);

    if (!mounted) return null;

    const isMembership = type === 'membership';
    const isRental = type === 'rental';

    return (
        <main className="min-h-screen bg-nautical-deep flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brass-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sea-foam/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {/* Main Card */}
                <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-2xl">

                    {/* Top Accent Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-brass-gold via-black/5 to-sea-foam" />

                    <div className="p-8 md:p-12 text-center">
                        {/* Status Icon */}
                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 rounded-full bg-brass-gold/10 flex items-center justify-center text-5xl border border-brass-gold/20 shadow-[0_0_50px_rgba(184,134,11,0.1)] animate-pulse">
                                ⚓
                            </div>
                            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl border-4 border-nautical-black ${showWarning ? 'bg-amber-500' : 'bg-sea-foam'}`}>
                                {showWarning ? '⌛' : '✓'}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-display italic text-sea-foam mb-6 tracking-tight">
                            {showWarning 
                                ? t('title_warning') 
                                : (isMembership ? t('title_membership') : isRental ? t('title_rental') : t('title_course'))}
                        </h1>

                        <p className="text-lg text-sea-foam/60 font-light max-w-md mx-auto mb-12 leading-relaxed">
                            {showWarning
                                ? t('desc_warning')
                                : (isMembership
                                    ? t('desc_membership')
                                    : isRental
                                        ? t('desc_rental')
                                        : t('desc_course'))}
                        </p>

                        {/* Order Confirmation Mockup */}
                        <div className="bg-black/[0.02] border border-black/5 rounded-xl p-6 mb-12 text-left space-y-4 max-w-sm mx-auto relative overflow-hidden group transition-all hover:border-brass-gold/20">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brass-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-sea-foam/40 font-bold">
                                <span>{loading ? t('label_verifying') : t('label_transaction')}</span>
                                <span>#{sessionId?.slice(-8).toUpperCase() || 'PAGO-OK'}</span>
                            </div>

                            <div className="h-px bg-black/10 w-full" />

                            <div className="space-y-1">
                                <p className="text-2xs uppercase tracking-tighter text-brass-gold font-black">{t('label_status')}</p>
                                <p className="text-sea-foam text-sm font-medium flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : (details ? 'bg-sea-foam shadow-[0_0_8px_#4fd1c5]' : 'bg-amber-500 animate-pulse')}`} />
                                    {loading ? t('status_checking') : (details ? t('status_completed') : t('status_syncing'))}
                                </p>
                            </div>

                            {details?.servicios_alquiler && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <p className="text-2xs uppercase tracking-tighter text-brass-gold font-black">{t('label_service')}</p>
                                    <p className="text-sea-foam text-sm font-medium">{details.servicios_alquiler.nombre_es}</p>
                                    <p className="text-sea-foam/40 text-[10px] italic">
                                        {details.fecha_reserva} - {details.hora_inicio.slice(0, 5)}
                                    </p>
                                </div>
                            )}

                            {details?.cursos && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <p className="text-2xs uppercase tracking-tighter text-brass-gold font-black">{t('label_course')}</p>
                                    <p className="text-sea-foam text-sm font-medium">{details.cursos.nombre_es}</p>
                                    {details.metadata?.start_date && (
                                        <p className="text-sea-foam/40 text-[10px] italic">
                                            {t('label_starts')} {new Date(details.metadata.start_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-2xs uppercase tracking-tighter text-brass-gold font-black">{t('label_reference')}</p>
                                <p className="text-sea-foam text-sm font-medium">Getxo Bela Eskola</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href="/"
                                className="w-full py-5 bg-brass-gold text-nautical-black font-black uppercase tracking-[0.2em] text-[11px] rounded-sm hover:bg-white transition-all shadow-[0_10px_30px_rgba(184,134,11,0.2)] hover:-translate-y-1 active:scale-95 duration-300"
                            >
                                {t('btn_home')}
                            </Link>
                            <Link
                                href="/student/dashboard"
                                className="w-full py-5 border border-black/10 text-sea-foam font-bold uppercase tracking-[0.2em] text-[11px] rounded-sm hover:bg-black/5 transition-all hover:border-black/30 hover:-translate-y-1 active:scale-95 duration-300"
                            >
                                {t('btn_dashboard')}
                            </Link>

                            {/* Hidden Dev link to Supabase */}
                            {details && (
                                <a
                                    href={`https://supabase.com/dashboard/project/ibaitelexfree-creator/editor/default/${isRental ? 'reservas_alquiler' : isCourse ? 'inscripciones' : 'subscriptions'}?filter=id%3Deq%3D${details.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="col-span-1 sm:col-span-2 text-[9px] uppercase tracking-widest text-sea-foam/20 hover:text-sea-foam/50 mt-4 text-center block"
                                >
                                    {t('admin_supabase')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center mt-12 text-sea-foam/30 text-xs italic font-serif">
                    {t('quote')}
                </p>
            </div>
        </main>
    );
}

export default function PaymentSuccessPage() {
    const t = useTranslations('payment_success_page');
    return (
        <Suspense fallback={<div className="min-h-screen bg-nautical-deep flex items-center justify-center text-sea-foam">{t('loading_confirm')}</div>}>
            <SuccessContent />
        </Suspense>
    );
}
