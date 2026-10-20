'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiUrl } from '@/lib/api';
import GoogleAuthButton from './GoogleAuthButton';


export default function RegisterForm() {
    const t = useTranslations('auth_form');
    const tv = useTranslations('validation');

    const registerSchema = z.object({
        nombre: z.string().min(2, tv('name_short')),
        apellidos: z.string().min(2, tv('last_name_short')),
        email: z.string().email(tv('email_invalid')),
        password: z.string().min(6, tv('password_short')),
        subscribeNewsletter: z.boolean(),
    });

    type RegisterValues = z.infer<typeof registerSchema>;

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const router = useRouter();
    const supabase = createClient();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            subscribeNewsletter: true
        }
    });

    const emailValue = watch('email');

    const handleResendEmail = async () => {
        if (!emailValue) return;
        setResendStatus('loading');
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: emailValue,
        });
        if (error) {
            setResendStatus('error');
        } else {
            setResendStatus('success');
        }
    };

    const onSubmit = async (data: RegisterValues) => {
        setLoading(true);
        setError(null);

        const locale = window.location.pathname.split('/')[1] || 'es';
        // Detect if we are in a Capacitor environment
        const isCapacitor = window.location.protocol === 'capacitor:' || window.location.protocol === 'file:';
        const appUrl = isCapacitor
            ? (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://getxobelaeskola.cloud')
            : window.location.origin;

        const searchParams = new URLSearchParams(window.location.search);
        const returnTo = searchParams.get('returnTo');
        const nextPath = `/${locale}/auth/register-success` + (returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '');

        const { error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${appUrl}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
                data: {
                    nombre: data.nombre,
                    apellidos: data.apellidos,
                }
            }
        });

        if (authError) {
            const msg = authError.message.toLowerCase();
            if (msg.includes('email not confirmed') || (msg.includes('invalid') && msg.includes('address'))) {
                setError(t('email_not_confirmed'));
                setIsEmailNotConfirmed(true);
            } else if (msg.includes('rate limit')) {
                setError(t('rate_limit'));
                setIsEmailNotConfirmed(false);
            } else {
                setError(authError.message);
                setIsEmailNotConfirmed(false);
            }
            setLoading(false);
        } else {
            // Background newsletter subscription if checked
            if (data.subscribeNewsletter) {
                try {
                    const locale = window.location.pathname.split('/')[1] || 'es';
                    await fetch(apiUrl('/api/newsletter/subscribe'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: data.email, locale })
                    });
                } catch (err) {
                    console.error('Background newsletter sub error:', err);
                }
            }

            const locale = window.location.pathname.split('/')[1] || 'es';
            const searchParams = new URLSearchParams(window.location.search);
            const returnTo = searchParams.get('returnTo');
            router.push(`/${locale}/auth/login?registered=true${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="nombre" className="text-[13.5px] uppercase tracking-[0.2em] text-accent font-bold ml-1">{t('name')}</label>
                    <input
                        id="nombre"
                        {...register('nombre')}
                        autoComplete="given-name"
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-accent focus:bg-white/10 transition-all font-light text-white placeholder:text-white/40"
                        placeholder="Ana"
                    />
                    {errors.nombre && <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">{errors.nombre.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="apellidos" className="text-[13.5px] uppercase tracking-[0.2em] text-accent font-bold ml-1">{t('apellidos') || 'Apellidos'}</label>
                    <input
                        id="apellidos"
                        {...register('apellidos')}
                        autoComplete="family-name"
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-accent focus:bg-white/10 transition-all font-light text-white placeholder:text-white/40"
                        placeholder="López"
                    />
                    {errors.apellidos && <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">{errors.apellidos.message}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className="text-[13.5px] uppercase tracking-[0.2em] text-accent font-bold ml-1">{t('email')}</label>
                <input
                    id="email"
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-accent focus:bg-white/10 transition-all font-light text-white placeholder:text-white/40"
                    placeholder={t('email_placeholder')}
                />
                {errors.email && <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className="text-[13.5px] uppercase tracking-[0.2em] text-accent font-bold ml-1">{t('password')}</label>
                <input
                    id="password"
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-accent focus:bg-white/10 transition-all font-light text-white placeholder:text-white/40"
                    placeholder="••••••••"
                />
                {errors.password && <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">{errors.password.message}</p>}

                <div className="flex items-center space-x-2 mt-2 ml-1">
                    <input
                        type="checkbox"
                        id="show-password"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <label
                        htmlFor="show-password"
                        className="text-[10px] uppercase tracking-widest text-white/70 cursor-pointer hover:text-accent transition-colors"
                    >
                        {t('show_password')}
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
                <input
                    {...register('subscribeNewsletter')}
                    type="checkbox"
                    id="subscribeNewsletter"
                    className="w-4 h-4 accent-accent border-white/20 bg-transparent rounded-sm cursor-pointer"
                />
                <label htmlFor="subscribeNewsletter" className="text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer select-none">
                    {t('newsletter_checkbox')}
                </label>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-sm animate-fade-in space-y-3">
                    <p className="text-xs text-red-500 text-center font-medium leading-relaxed">
                        {error}
                        {isEmailNotConfirmed && (
                            <button
                                type="button"
                                onClick={handleResendEmail}
                                disabled={resendStatus === 'loading'}
                                className="ml-2 text-blue-400 underline hover:text-blue-300 transition-colors font-bold inline-block"
                            >
                                {resendStatus === 'loading' ? '...' : t('resend_email')}
                            </button>
                        )}
                    </p>
                    {resendStatus === 'success' && (
                        <p className="text-[10px] text-green-400 text-center uppercase tracking-widest animate-fade-in">
                            {t('resend_success')}
                        </p>
                    )}
                </div>
            )}

            <button
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-neutral-950 font-black uppercase tracking-widest text-xs mt-4 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)] transition-all active:scale-[0.98]"
            >
                {loading ? t('registering') : t('register_btn')}
            </button>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[13.5px] uppercase tracking-widest">
                    <span className="bg-[#0D2137] px-4 text-white/50 font-bold italic">{t('or_divider')}</span>
                </div>
            </div>

            <GoogleAuthButton />
        </form>
    );
}
