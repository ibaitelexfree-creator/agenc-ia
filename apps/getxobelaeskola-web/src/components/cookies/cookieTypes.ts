export const COOKIE_CONSENT_KEY = 'gbe_cookie_consent_v1';
export const CURRENT_CONSENT_VERSION = 1;

export interface CookiePreferences {
    essential: boolean; // Always true
    analytics: boolean; // Opt-in
    performance: boolean; // Opt-in
}

export interface ConsentRecord {
    version: number;
    timestamp: number;
    decision: 'all' | 'rejected' | 'custom';
    preferences: CookiePreferences;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: false,
    performance: false,
};

export const ACCEPT_ALL_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: true,
    performance: true,
};

export const REJECT_ALL_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: false,
    performance: false,
};

export function getStoredConsent(): ConsentRecord | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!raw) return null;
        const parsed: ConsentRecord = JSON.parse(raw);
        if (parsed && parsed.version === CURRENT_CONSENT_VERSION && parsed.preferences) {
            return parsed;
        }
    } catch {
        return null;
    }
    return null;
}

export function saveStoredConsent(decision: 'all' | 'rejected' | 'custom', prefs: CookiePreferences): ConsentRecord {
    const record: ConsentRecord = {
        version: CURRENT_CONSENT_VERSION,
        timestamp: Date.now(),
        decision,
        preferences: {
            essential: true,
            analytics: Boolean(prefs.analytics),
            performance: Boolean(prefs.performance),
        },
    };
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
        } catch {
            // Ignore storage errors
        }
    }
    return record;
}
