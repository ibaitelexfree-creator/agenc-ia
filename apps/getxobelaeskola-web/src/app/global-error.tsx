'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error Boundary caught an error:', error);
    }, [error]);

    return (
        <html lang="es">
            <body className="min-h-screen bg-[#0d2137] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="text-5xl">⚠️</div>
                    <h1 className="text-3xl font-bold">Algo salió mal</h1>
                    <p className="text-white/70 text-sm">
                        Se ha producido un error inesperado en la aplicación.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-[#2EC4B6] text-[#0d2137] font-bold rounded hover:bg-white transition-colors"
                        >
                            Reintentar
                        </button>
                        <a
                            href="/es"
                            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded hover:bg-white/20 transition-colors"
                        >
                            Ir al inicio
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
