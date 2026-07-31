'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const isSuccess = status === 'success';

    return (
        <main className="min-h-screen bg-nautical-black text-sea-foam pt-32 pb-16 px-6 flex flex-col items-center justify-center relative">
            <div className="bg-mesh" />
            <div className="max-w-md w-full bg-card border border-card-border p-8 rounded-sm text-center relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white/5 border border-white/10 text-3xl">
                    {isSuccess ? '⛵' : '⚠️'}
                </div>

                <h1 className="text-3xl font-display italic text-white">
                    {isSuccess ? 'Baja Confirmada' : 'Error al Procesar Solicitud'}
                </h1>

                <p className="text-sm text-white/60 font-light leading-relaxed">
                    {isSuccess ? (
                        <>
                            La dirección <strong className="text-accent">{email}</strong> ha sido eliminada correctamente de nuestra lista de correo de novedades.
                        </>
                    ) : (
                        'No hemos podido procesar tu solicitud de baja. Es posible que la dirección ya haya sido eliminada o que el enlace sea inválido.'
                    )}
                </p>

                <div className="pt-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-accent text-nautical-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-xs"
                    >
                        Volver a Inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}
