'use client';
// Force deploy trigger
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LegalConsentModal, { ActivityType } from '../shared/LegalConsentModal';
import { createClient } from '@/lib/supabase/client';
import { apiUrl } from '@/lib/api';



interface Edition {
    id: string;
    fecha_inicio: string;
    fecha_fin: string;
    plazas_totales: number;
    plazas_ocupadas: number;
}

interface BookingSelectorProps {
    editions: Edition[];
    coursePrice: number;
    courseId: string;
    activityType?: ActivityType;
    slug?: string;
}

export default function BookingSelector({ editions, coursePrice, courseId, activityType = 'course', slug }: BookingSelectorProps) {
    const t = useTranslations('booking');
    const tLegal = useTranslations('legal');
    const router = useRouter();
    const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
    const [customDate, setCustomDate] = useState<string>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

    // Auth state
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [childrenList, setChildrenList] = useState<any[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
    const [isMemberDiscountChecked, setIsMemberDiscountChecked] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        const hasBookParam = params.get('book') === 'true';
        const hasTryDiscount = params.get('tryMemberDiscount') === 'true';

        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                if (hasBookParam) {
                    setIsLegalModalOpen(true);
                }
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile(profile);
                
                let parsedChildren: any[] = [];
                if (profile && profile.avatar_url && profile.avatar_url.startsWith('children_json:')) {
                    try {
                        const parsed = JSON.parse(profile.avatar_url.replace('children_json:', ''));
                        if (Array.isArray(parsed)) {
                            setChildrenList(parsed);
                            parsedChildren = parsed;
                        }
                    } catch (e) {
                        console.error('Error parsing children list in BookingSelector:', e);
                    }
                }

                if (hasTryDiscount) {
                    // Check if there is ANY member in the account
                    const hasAnyMember = (profile?.status_socio === 'activo') || parsedChildren.some((c: any) => c.is_member);
                    if (hasAnyMember) {
                        setIsMemberDiscountChecked(true);
                    }
                }

                if (hasBookParam || hasTryDiscount) {
                    // Clean up URL parameters without reloading
                    const cleanUrl = window.location.pathname;
                    window.history.replaceState({}, '', cleanUrl);
                }
            }
        };
        checkUser();
    }, []);

    // Set default discount check only if the selected participant is a member
    useEffect(() => {
        if (selectedParticipant) {
            setIsMemberDiscountChecked(!!selectedParticipant.is_member);
        } else {
            setIsMemberDiscountChecked(profile?.status_socio === 'activo');
        }
    }, [selectedParticipant, profile]);

    const handleBookingClick = () => {
        if (!user) {
            const locale = window.location.pathname.split('/')[1] || 'es';
            const returnToUrl = `${window.location.pathname}?book=true`;
            router.push(`/${locale}/auth/login?returnTo=${encodeURIComponent(returnToUrl)}`);
            return;
        }
        setIsLegalModalOpen(true);
    };

    const handleLegalConfirm = async (legalData: { fullName: string; email: string; dni: string; registrationDetails?: any }) => {
        setIsLegalModalOpen(false);
        setLoading(true);

        try {
            const selectedEditionData = editions.find(e => e.id === selectedEdition);

            // Log consent
            const consentResponse = await fetch(apiUrl('/api/legal/consent'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: legalData.fullName,
                    email: legalData.email,
                    dni: legalData.dni,
                    legalText: "He leído y acepto expresamente las condiciones legales detalladas anteriormente. Entiendo que esta aceptación equivale a una firma digital vinculante.",
                    consentType: activityType,
                    referenceId: courseId
                })
            });

            if (!consentResponse.ok) {
                throw new Error('No se pudo registrar la firma legal. Inténtalo de nuevo.');
            }

            const isBoatCourse = 
                slug?.includes('j80') || 
                slug?.includes('licencia') || 
                slug?.includes('vela-ligera') || 
                slug?.includes('crucero') || 
                slug?.includes('raquero');

            // Original Checkout Logic
            const response = await fetch(apiUrl('/api/checkout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    editionId: selectedEdition,
                    courseId: courseId,
                    locale: window.location.pathname.split('/')[1] || 'es',
                    startDate: selectedEditionData?.fecha_inicio || (isBoatCourse ? undefined : customDate),
                    endDate: selectedEditionData?.fecha_fin || (isBoatCourse ? undefined : customDate),
                    // Pass legal data to checkout for metadata
                    legalName: legalData.fullName,
                    legalDni: legalData.dni,
                    legalEmail: legalData.email, // Send email explicitly for guest checkout association
                    isMember: isMemberDiscountChecked,
                    registrationDetails: {
                        ...legalData.registrationDetails,
                        ...(customDate && !isBoatCourse ? { fecha_seleccionada: customDate } : {})
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // If 401, it means the API requires auth but we might be in guest mode or unconfirmed
                    // If we just registered, we might need to rely on the passed legalEmail in the backend
                    // But for now, let's redirect to login if strict
                    window.location.href = `/${window.location.pathname.split('/')[1] || 'es'}/auth/login?msg=verify_email`;
                    return;
                }
                throw new Error(data.error || t('error_generic'));
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: unknown) {
            console.error('Booking Error:', error);
            // We use the query param to trigger the global StatusToast even on same page errors for consistency
            const errorMessage = (error as Error).message || t('payment_gateway_error');
            const params = new URLSearchParams(window.location.search);
            params.set('error', errorMessage);
            router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
            setLoading(false);
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        if (!user) {
            const locale = window.location.pathname.split('/')[1] || 'es';
            const returnToUrl = `${window.location.pathname}?book=true&tryMemberDiscount=true`;
            router.push(`/${locale}/auth/login?returnTo=${encodeURIComponent(returnToUrl)}`);
            return;
        }

        if (checked) {
            // Check if there is ANY member in the account (self or children)
            const hasAnyMember = (profile?.status_socio === 'activo') || childrenList.some(c => c.is_member);
            if (!hasAnyMember) {
                alert(t('membership_not_found'));
                setIsMemberDiscountChecked(false);
                return;
            }

            // Verify if the CURRENTLY selected participant is the member!
            if (selectedParticipant) {
                if (!selectedParticipant.is_member) {
                    alert(t('selected_not_member', { name: selectedParticipant.nombre }));
                    setIsMemberDiscountChecked(false);
                    return;
                }
            } else {
                if (profile?.status_socio !== 'activo') {
                    alert(t('parent_not_member'));
                    setIsMemberDiscountChecked(false);
                    return;
                }
            }
        }
        setIsMemberDiscountChecked(checked);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    if (!mounted) {
        return null;
    }

    const isBoatCourse = 
        slug?.includes('j80') || 
        slug?.includes('licencia') || 
        slug?.includes('vela-ligera') || 
        slug?.includes('crucero') || 
        slug?.includes('raquero');

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {coursePrice === 0 ? (
                    <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm">
                        <p className="text-sm text-accent font-display">
                            ⚡ {t('online_course_instant')}
                        </p>
                        <p className="text-2xs text-foreground/60 mt-1 font-light">
                            {t('no_dates_needed')}
                        </p>
                    </div>
                ) : (
                    <>
                        <label className="text-2xs uppercase tracking-widest text-accent font-bold pl-1">
                            {t('select_date')}
                        </label>

                        {isBoatCourse ? (
                            editions && editions.length > 0 ? (
                                <div className="grid gap-3">
                                    {editions.map((edition) => {
                                        const seatsLeft = edition.plazas_totales - edition.plazas_ocupadas;
                                        const isSelected = selectedEdition === edition.id;
                                        const isFull = seatsLeft <= 0;

                                        return (
                                            <button
                                                key={edition.id}
                                                disabled={isFull}
                                                onClick={() => setSelectedEdition(edition.id)}
                                                aria-label={`${t('select_date')} ${formatDate(edition.fecha_inicio)} ${t('to_date')} ${formatDate(edition.fecha_fin)}. ${isFull ? t('full') : `${seatsLeft} ${t('seats')}`}`}
                                                aria-pressed={isSelected}
                                                aria-disabled={isFull}
                                                className={`w-full p-4 border text-left transition-all duration-300 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-nautical-black ${isSelected
                                                    ? 'border-accent bg-accent/5'
                                                    : 'border-white/5 hover:border-white/20 bg-white/5'
                                                    } ${isFull ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <div>
                                                    <p className="text-base font-light text-sea-foam">
                                                        {t('from_date')} {formatDate(edition.fecha_inicio)}
                                                    </p>
                                                    <p className="text-2xs uppercase tracking-widest text-foreground/40 mt-1">
                                                        {t('to_date')} {formatDate(edition.fecha_fin)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xs uppercase tracking-widest font-bold ${isSelected ? 'text-accent' : 'text-foreground/40'}`}>
                                                        {isFull ? t('full') : `${seatsLeft} ${t('seats')}`}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-foreground/40 font-light italic">
                                    {t('no_dates_available')}
                                </p>
                            )
                        ) : (
                            <div className="space-y-2">
                                <input
                                    type="date"
                                    value={customDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="w-full bg-black/[0.02] border border-black/10 p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all focus:ring-2 focus:ring-accent rounded-sm"
                                />
                                <p className="text-[10px] text-foreground/40 uppercase tracking-widest pl-1 leading-relaxed">
                                    {t('flexible_date_notice') || 'Reserva flexible. Elegirás la hora exacta con la escuela.'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Participant selector & Member verification */}
            {user && (
                <div className="space-y-4 p-4 border border-white/10 bg-white/5 rounded-sm">
                    {childrenList.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-accent font-bold pl-1">
                                ¿Quién realizará el curso?
                            </label>
                            <select
                                onChange={(e) => {
                                    const val = e.target.value;
                                    let nextParticipant = null;
                                    if (val === 'self') {
                                        nextParticipant = null;
                                    } else {
                                        const child = childrenList.find(c => c.id === val);
                                        nextParticipant = child || null;
                                    }
                                    setSelectedParticipant(nextParticipant);

                                    // If member discount was checked, verify if the new participant is a member
                                    if (isMemberDiscountChecked) {
                                        if (nextParticipant) {
                                            if (!nextParticipant.is_member) {
                                                alert(t('selected_not_member', { name: nextParticipant.nombre }));
                                                setIsMemberDiscountChecked(false);
                                            }
                                        } else {
                                            if (profile?.status_socio !== 'activo') {
                                                alert(t('parent_not_member'));
                                                setIsMemberDiscountChecked(false);
                                            }
                                        }
                                    }
                                }}
                                className="w-full bg-nautical-deep border border-white/10 p-3 text-sea-foam focus:border-accent outline-none text-sm cursor-pointer hover:bg-white/5"
                            >
                                <option value="self">Para mí ({profile?.nombre} {profile?.apellidos})</option>
                                {childrenList.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        Para mi hijo/a: {c.nombre} {c.apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isMemberDiscountChecked}
                                onChange={(e) => handleCheckboxChange(e.target.checked)}
                                className="w-5 h-5 accent-accent mt-0.5"
                            />
                            <div>
                                <span className="text-sm font-bold text-sea-foam/95 block">
                                    {t('is_member')}
                                </span>
                            </div>
                        </label>
                    </div>

                    {isMemberDiscountChecked && (
                        <div className="text-[10px] text-accent font-bold uppercase tracking-wider pl-1">
                            {t('member_discount_applied')}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={handleBookingClick}
                disabled={loading}
                aria-label={loading ? t('processing') : `${t('book_for')} ${isMemberDiscountChecked ? Math.round(coursePrice / 2) : coursePrice} euros`}
                aria-busy={loading}
                aria-disabled={loading}
                className="w-full py-5 bg-accent text-nautical-black hover:text-black text-[13px] uppercase tracking-[0.25em] font-black hover:bg-white transition-all duration-500 disabled:opacity-30 disabled:grayscale focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-nautical-black shadow-lg hover:shadow-accent/20"
            >
                {loading ? t('processing') : `${t('book_for')} ${isMemberDiscountChecked ? Math.round(coursePrice / 2) : coursePrice}€`}
            </button>

            <LegalConsentModal
                isOpen={isLegalModalOpen}
                onClose={() => setIsLegalModalOpen(false)}
                onConfirm={handleLegalConfirm}
                activityType={activityType}
                initialData={user ? {
                    fullName: selectedParticipant 
                        ? `${selectedParticipant.nombre} ${selectedParticipant.apellidos}` 
                        : ((profile?.nombre || user.user_metadata?.nombre) 
                            ? `${profile?.nombre || user.user_metadata?.nombre} ${profile?.apellidos || user.user_metadata?.apellidos}` 
                            : (user.user_metadata?.full_name || undefined)),
                    email: user.email,
                    dni: selectedParticipant ? selectedParticipant.dni : profile?.dni,
                    nombre: selectedParticipant 
                        ? selectedParticipant.nombre 
                        : (profile?.nombre || user.user_metadata?.nombre || (user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : undefined)),
                    apellidos: selectedParticipant 
                        ? selectedParticipant.apellidos 
                        : (profile?.apellidos || user.user_metadata?.apellidos || (user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ').slice(1).join(' ') : undefined)),
                    telefono: profile?.telefono,
                    domicilio: profile?.domicilio,
                    localidad: profile?.localidad,
                    codigo_postal: profile?.codigo_postal,
                    fecha_nacimiento: selectedParticipant ? selectedParticipant.fecha_nacimiento : profile?.fecha_nacimiento,
                    parentNombre: profile?.nombre || user.user_metadata?.nombre || '',
                    parentApellidos: profile?.apellidos || user.user_metadata?.apellidos || '',
                    parentDni: profile?.dni || '',
                    parentTelefono: profile?.telefono || '',
                    parentEmail: user.email || ''
                } : undefined}
                legalText={tLegal('course_contract')}
            />
        </div>
    );
}
