import crypto from 'crypto';

/**
 * Custom Deterministic JSON Serializer (JCS / RFC 8785 Compatible Subset)
 *
 * Guarantees:
 * 1. Strict object key sorting by UTF-16 code units.
 * 2. Deterministic finite number formatting matching ECMAScript specification.
 * 3. Negative zero (-0) normalized strictly to '0'.
 * 4. Explicit fail-fast rejection of NaN, +Infinity, -Infinity.
 * 5. Explicit fail-fast rejection of undefined, function, symbol, and BigInt in objects and arrays.
 * 6. Explicit fail-fast rejection of lone surrogates in strings.
 * 7. Elimination of insignificant whitespace.
 */

function validateStringNoLoneSurrogates(str) {
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF) {
            // High surrogate: must be followed by low surrogate
            if (i + 1 >= str.length) {
                throw new URIError('Lone high surrogate detected in string');
            }
            const nextCode = str.charCodeAt(i + 1);
            if (nextCode < 0xDC00 || nextCode > 0xDFFF) {
                throw new URIError('Lone high surrogate detected in string');
            }
            i++; // Skip low surrogate
        } else if (code >= 0xDC00 && code <= 0xDFFF) {
            // Unpaired low surrogate
            throw new URIError('Lone low surrogate detected in string');
        }
    }
}

export function canonicalizeJson(data) {
    if (data === null) {
        return 'null';
    }

    if (typeof data === 'boolean') {
        return data ? 'true' : 'false';
    }

    if (typeof data === 'number') {
        if (!Number.isFinite(data)) {
            throw new TypeError('Non-finite numbers are not supported');
        }
        if (Object.is(data, -0)) {
            return '0';
        }
        return JSON.stringify(data);
    }

    if (typeof data === 'string') {
        validateStringNoLoneSurrogates(data);
        return JSON.stringify(data);
    }

    if (typeof data === 'bigint') {
        throw new TypeError('Unsupported property value: bigint');
    }

    if (typeof data === 'symbol') {
        throw new TypeError('Unsupported property value: symbol');
    }

    if (typeof data === 'function') {
        throw new TypeError('Unsupported property value: function');
    }

    if (Array.isArray(data)) {
        // Detect sparse arrays
        const len = data.length;
        const parts = [];
        for (let i = 0; i < len; i++) {
            if (!(i in data)) {
                throw new TypeError('Unsupported or sparse array element: hole');
            }
            const item = data[i];
            if (item === undefined || typeof item === 'symbol' || typeof item === 'function') {
                throw new TypeError(`Unsupported or sparse array element: ${typeof item}`);
            }
            parts.push(canonicalizeJson(item));
        }
        return '[' + parts.join(',') + ']';
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        const parts = [];
        for (const k of keys) {
            validateStringNoLoneSurrogates(k);
            const val = data[k];
            if (val === undefined || typeof val === 'symbol' || typeof val === 'function' || typeof val === 'bigint') {
                throw new TypeError(`Unsupported property value: ${typeof val}`);
            }
            parts.push(JSON.stringify(k) + ':' + canonicalizeJson(val));
        }
        return '{' + parts.join(',') + '}';
    }

    throw new TypeError(`Unsupported type: ${typeof data}`);
}

export function computePayloadHash(canonicalJsonStr) {
    return crypto.createHash('sha256').update(canonicalJsonStr, 'utf8').digest('hex');
}
