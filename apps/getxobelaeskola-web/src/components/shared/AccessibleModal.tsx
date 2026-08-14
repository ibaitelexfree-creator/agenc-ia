'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useTranslations } from 'next-intl';

interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    theme?: 'dark' | 'light';
}

/**
 * Modal accesible de alto nivel con Focus Trap, ARIA roles y cierre por teclado.
 * Renderizado vía Portal para evitar saltos de layout.
 */
export default function AccessibleModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-2xl',
    theme = 'dark'
}: AccessibleModalProps) {
    const t = useTranslations('nav');
    const modalRef = useFocusTrap(isOpen);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Cierre con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Bloquear scroll del body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const isLight = theme === 'light';

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-nautical-black/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Content */}
            <div
                ref={modalRef}
                className={`relative w-full ${maxWidth} ${isLight ? 'bg-white text-slate-900 border border-slate-200' : 'bg-nautical-deep border border-white/10'} rounded-2xl shadow-2xl overflow-hidden animate-premium-in`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-white/5'}`}>
                    <h2 id="modal-title" className={`text-xl font-display italic ${isLight ? 'text-slate-900 font-bold' : 'text-white'}`}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label={t('close')}
                        className={`p-2 rounded-full transition-all ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
