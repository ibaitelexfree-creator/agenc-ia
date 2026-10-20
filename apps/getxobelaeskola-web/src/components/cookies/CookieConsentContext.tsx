'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    COOKIE_CONSENT_KEY,
    CURRENT_CONSENT_VERSION,
    ConsentRecord,
    CookiePreferences,
    DEFAULT_PREFERENCES,
    ACCEPT_ALL_PREFERENCES,
    REJECT_ALL_PREFERENCES,
    getStoredConsent,
    saveStoredConsent,
} from './cookieTypes';

interface CookieConsentContextType {
    hasChosen: boolean;
    isLoaded: boolean;
    preferences: CookiePreferences;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (custom: Partial<CookiePreferences>) => void;
    resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasChosen, setHasChosen] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cargar preferencia guardada en el cliente
    useEffect(() => {
        const stored = getStoredConsent();
        if (stored) {
            setPreferences(stored.preferences);
            setHasChosen(true);
        }
        setIsLoaded(true);
    }, []);

    const storeDecision = useCallback((decision: 'all' | 'rejected' | 'custom', prefs: CookiePreferences) => {
        const record = saveStoredConsent(decision, prefs);
        setPreferences(record.preferences);
        setHasChosen(true);
        setIsModalOpen(false);
    }, []);

    const acceptAll = useCallback(() => {
        storeDecision('all', ACCEPT_ALL_PREFERENCES);
    }, [storeDecision]);

    const rejectAll = useCallback(() => {
        storeDecision('rejected', REJECT_ALL_PREFERENCES);
    }, [storeDecision]);

    const savePreferences = useCallback(
        (custom: Partial<CookiePreferences>) => {
            const finalPrefs: CookiePreferences = {
                essential: true,
                analytics: Boolean(custom.analytics),
                performance: Boolean(custom.performance),
            };
            storeDecision('custom', finalPrefs);
        },
        [storeDecision]
    );

    const resetConsent = useCallback(() => {
        try {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
        } catch {
            // Noop
        }
        setPreferences(DEFAULT_PREFERENCES);
        setHasChosen(false);
        setIsModalOpen(true);
    }, []);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <CookieConsentContext.Provider
            value={{
                hasChosen,
                isLoaded,
                preferences,
                isModalOpen,
                openModal,
                closeModal,
                acceptAll,
                rejectAll,
                savePreferences,
                resetConsent,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
}
