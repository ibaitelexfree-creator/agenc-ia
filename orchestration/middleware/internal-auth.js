import crypto from 'crypto';

/**
 * Internal Authentication Middleware
 *
 * Verifies internal service requests using a high-entropy pre-shared key (INTERNAL_SERVICE_PSK).
 *
 * Security features:
 * 1. Fails fast at startup if INTERNAL_SERVICE_PSK is missing or has < 32 characters of entropy.
 * 2. Uses crypto.timingSafeEqual on fixed-length SHA-256 digests to prevent timing attacks.
 * 3. Never logs or exposes secret material in logs or errors.
 * 4. Rejects invalid credentials with HTTP 401.
 */

export function validatePskAtStartup() {
    const psk = process.env.INTERNAL_SERVICE_PSK;
    if (!psk || typeof psk !== 'string') {
        throw new Error('FATAL: INTERNAL_SERVICE_PSK environment variable is missing.');
    }
    if (psk.length < 32) {
        throw new Error('FATAL: INTERNAL_SERVICE_PSK is too weak (must be at least 32 characters with high entropy).');
    }
    return psk;
}

export function createInternalAuthMiddleware() {
    return (req, res, next) => {
        const configuredPsk = process.env.INTERNAL_SERVICE_PSK;
        if (!configuredPsk) {
            return res.status(500).json({ error: 'Internal service authentication unconfigured' });
        }

        // Header check: x-internal-service-token or Authorization: Bearer <psk>
        let providedToken = req.headers['x-internal-service-token'];
        if (!providedToken && req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            if (authHeader.startsWith('Bearer ')) {
                providedToken = authHeader.slice(7).trim();
            }
        }

        if (!providedToken || typeof providedToken !== 'string') {
            return res.status(401).json({ error: 'Unauthorized: Missing internal service token' });
        }

        // Constant-time comparison using fixed-length SHA-256 hashes
        const expectedHash = crypto.createHash('sha256').update(configuredPsk, 'utf8').digest();
        const providedHash = crypto.createHash('sha256').update(providedToken, 'utf8').digest();

        if (!crypto.timingSafeEqual(expectedHash, providedHash)) {
            return res.status(401).json({ error: 'Unauthorized: Invalid internal service token' });
        }

        next();
    };
}
