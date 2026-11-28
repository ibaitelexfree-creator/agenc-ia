/**
 * Validates and sanitizes a returnTo URL parameter to prevent Open Redirect attacks.
 *
 * Requirements:
 * 1. Must be a relative path starting with a single '/'
 * 2. Must NOT start with '//' (protocol-relative URL)
 * 3. Must NOT start with or contain schemes like 'http:', 'https:', 'javascript:', 'data:', etc.
 * 4. Must NOT contain backslashes '\' or encoded backslashes
 * 5. Must parse as a valid URL relative to base and retain same origin
 *
 * @param url The raw returnTo parameter
 * @param currentOrigin Optional base origin (e.g. window.location.origin)
 * @returns Sanitized relative path or null if invalid
 */
export function sanitizeReturnTo(url: string | null | undefined, currentOrigin?: string): string | null {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();
    if (!trimmed) {
        return null;
    }

    // Reject control characters, newlines, or tabs
    if (/[\x00-\x1F\x7F]/.test(trimmed)) {
        return null;
    }

    // Reject backslashes (both literal and encoded variants)
    if (trimmed.includes('\\') || /%5c/i.test(trimmed)) {
        return null;
    }

    // Must start with exactly one '/' and not '//'
    if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
        return null;
    }

    // Reject dangerous protocol schemes anywhere before query/hash or embedded
    if (/^(?:[a-z][a-z0-9+.-]*:)/i.test(trimmed)) {
        return null;
    }

    // Reject dangerous protocols like javascript: or data: even if encoded
    const decoded = decodeSafe(trimmed);
    if (!decoded || /^(?:[a-z][a-z0-9+.-]*:)/i.test(decoded) || decoded.startsWith('//') || decoded.includes('\\')) {
        return null;
    }

    if (/\b(?:javascript|data|vbscript):/i.test(decoded) || /\b(?:javascript|data|vbscript):/i.test(trimmed)) {
        return null;
    }

    // Verify using standard URL parser with dummy base
    try {
        const dummyBase = 'https://getxobelaeskola.local';
        const parsed = new URL(trimmed, dummyBase);

        // Ensure origin is strictly the dummy base origin
        if (parsed.origin !== dummyBase) {
            return null;
        }

        // If currentOrigin is provided, also check against it
        if (currentOrigin && typeof window !== 'undefined') {
            try {
                const originParsed = new URL(trimmed, currentOrigin);
                if (originParsed.origin !== new URL(currentOrigin).origin) {
                    return null;
                }
            } catch {
                return null;
            }
        }

        // Must still start with single '/'
        if (!parsed.pathname.startsWith('/') || parsed.pathname.startsWith('//')) {
            return null;
        }

        // Return relative path + search + hash preserved
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return null;
    }
}

function decodeSafe(str: string): string | null {
    try {
        return decodeURIComponent(str);
    } catch {
        return null;
    }
}
