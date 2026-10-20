import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
    CookieConsentProvider,
    useCookieConsent,
} from './CookieConsentContext';
import {
    COOKIE_CONSENT_KEY,
    CURRENT_CONSENT_VERSION,
    getStoredConsent,
    saveStoredConsent,
} from './cookieTypes';
import { CookieBanner } from './CookieBanner';
import { NextIntlClientProvider } from 'next-intl';
import esMessages from '../../../messages/es.json';

function TestConsumer() {
    const { hasChosen, preferences, openModal, acceptAll, rejectAll, savePreferences } = useCookieConsent();
    return (
        <div>
            <div data-testid="has-chosen">{String(hasChosen)}</div>
            <div data-testid="pref-essential">{String(preferences.essential)}</div>
            <div data-testid="pref-analytics">{String(preferences.analytics)}</div>
            <div data-testid="pref-performance">{String(preferences.performance)}</div>
            <button onClick={acceptAll}>Accept All Btn</button>
            <button onClick={rejectAll}>Reject All Btn</button>
            <button onClick={() => savePreferences({ analytics: true, performance: false })}>Save Custom</button>
            <button onClick={openModal}>Open Modal</button>
        </div>
    );
}

function createMockStorage() {
    let store: Record<string, string> = {};
    return {
        getItem: (k: string) => store[k] || null,
        setItem: (k: string, v: string) => { store[k] = String(v); },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { store = {}; },
    };
}

describe('Cookie Consent Management Framework', () => {
    let mockStorage: any;

    beforeEach(() => {
        mockStorage = createMockStorage();
        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true,
            configurable: true,
        });
        vi.clearAllMocks();
    });

    it('1. Initial visit has no chosen consent and default preferences', () => {
        render(
            <CookieConsentProvider>
                <TestConsumer />
            </CookieConsentProvider>
        );

        expect(screen.getByTestId('has-chosen').textContent).toBe('false');
        expect(screen.getByTestId('pref-essential').textContent).toBe('true');
        expect(screen.getByTestId('pref-analytics').textContent).toBe('false');
        expect(screen.getByTestId('pref-performance').textContent).toBe('false');
    });

    it('2. Accept All enables analytics and performance and persists record', () => {
        render(
            <CookieConsentProvider>
                <TestConsumer />
            </CookieConsentProvider>
        );

        fireEvent.click(screen.getByText('Accept All Btn'));

        expect(screen.getByTestId('has-chosen').textContent).toBe('true');
        expect(screen.getByTestId('pref-essential').textContent).toBe('true');
        expect(screen.getByTestId('pref-analytics').textContent).toBe('true');
        expect(screen.getByTestId('pref-performance').textContent).toBe('true');

        const saved = getStoredConsent();
        expect(saved).not.toBeNull();
        expect(saved!.version).toBe(CURRENT_CONSENT_VERSION);
        expect(saved!.decision).toBe('all');
        expect(saved!.preferences.analytics).toBe(true);
        expect(saved!.preferences.performance).toBe(true);
    });

    it('3. Reject All disables non-essential categories with single click', () => {
        render(
            <CookieConsentProvider>
                <TestConsumer />
            </CookieConsentProvider>
        );

        fireEvent.click(screen.getByText('Reject All Btn'));

        expect(screen.getByTestId('has-chosen').textContent).toBe('true');
        expect(screen.getByTestId('pref-essential').textContent).toBe('true');
        expect(screen.getByTestId('pref-analytics').textContent).toBe('false');
        expect(screen.getByTestId('pref-performance').textContent).toBe('false');

        const saved = getStoredConsent();
        expect(saved).not.toBeNull();
        expect(saved!.version).toBe(CURRENT_CONSENT_VERSION);
        expect(saved!.decision).toBe('rejected');
        expect(saved!.preferences.analytics).toBe(false);
    });

    it('4. Custom preferences allow fine-grained consent selection', () => {
        render(
            <CookieConsentProvider>
                <TestConsumer />
            </CookieConsentProvider>
        );

        fireEvent.click(screen.getByText('Save Custom'));

        expect(screen.getByTestId('has-chosen').textContent).toBe('true');
        expect(screen.getByTestId('pref-analytics').textContent).toBe('true');
        expect(screen.getByTestId('pref-performance').textContent).toBe('false');

        const saved = getStoredConsent();
        expect(saved).not.toBeNull();
        expect(saved!.decision).toBe('custom');
        expect(saved!.preferences.analytics).toBe(true);
        expect(saved!.preferences.performance).toBe(false);
    });

    it('5. Persisted decision is restored on subsequent visits', async () => {
        saveStoredConsent('custom', { essential: true, analytics: true, performance: false });

        render(
            <CookieConsentProvider>
                <TestConsumer />
            </CookieConsentProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('has-chosen').textContent).toBe('true');
            expect(screen.getByTestId('pref-analytics').textContent).toBe('true');
            expect(screen.getByTestId('pref-performance').textContent).toBe('false');
        });
    });

    it('6. CookieBanner renders first-layer options and vanishes after decision', () => {
        render(
            <NextIntlClientProvider locale="es" messages={esMessages}>
                <CookieConsentProvider>
                    <CookieBanner locale="es" />
                </CookieConsentProvider>
            </NextIntlClientProvider>
        );

        expect(screen.getByRole('region', { name: /gestión de consentimiento/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /aceptar todas/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /rechazar no necesarias/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /configurar/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /rechazar no necesarias/i }));
        expect(screen.queryByRole('region', { name: /gestión de consentimiento/i })).not.toBeInTheDocument();
    });
});