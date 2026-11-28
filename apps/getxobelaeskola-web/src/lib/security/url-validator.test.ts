import { describe, it, expect } from 'vitest';
import { sanitizeReturnTo } from './url-validator';

describe('sanitizeReturnTo', () => {
    it('allows valid relative internal paths', () => {
        expect(sanitizeReturnTo('/es/reservas')).toBe('/es/reservas');
        expect(sanitizeReturnTo('/es/auth/login')).toBe('/es/auth/login');
        expect(sanitizeReturnTo('/en/student/dashboard')).toBe('/en/student/dashboard');
    });

    it('preserves query parameters and hash fragments', () => {
        expect(sanitizeReturnTo('/es/courses/iniciacion?book=true&coupon=SUMMER#reviews'))
            .toBe('/es/courses/iniciacion?book=true&coupon=SUMMER#reviews');
    });

    it('rejects protocol-relative URLs (//evil.com)', () => {
        expect(sanitizeReturnTo('//evil.com')).toBeNull();
        expect(sanitizeReturnTo('//evil.com/path')).toBeNull();
        expect(sanitizeReturnTo('///evil.com')).toBeNull();
    });

    it('rejects absolute URLs with http and https', () => {
        expect(sanitizeReturnTo('https://evil.com')).toBeNull();
        expect(sanitizeReturnTo('http://evil.com')).toBeNull();
        expect(sanitizeReturnTo('https://getxobelaeskola.com/phishing')).toBeNull();
    });

    it('rejects dangerous protocols (javascript, data, vbscript)', () => {
        expect(sanitizeReturnTo('javascript:alert(1)')).toBeNull();
        expect(sanitizeReturnTo('javascript:void(0)')).toBeNull();
        expect(sanitizeReturnTo('data:text/html,<script>alert(1)</script>')).toBeNull();
        expect(sanitizeReturnTo('vbscript:msgbox(1)')).toBeNull();
    });

    it('rejects backslashes and evasion techniques', () => {
        expect(sanitizeReturnTo('/\\evil.com')).toBeNull();
        expect(sanitizeReturnTo('\\evil.com')).toBeNull();
        expect(sanitizeReturnTo('/%5cevil.com')).toBeNull();
        expect(sanitizeReturnTo('/path\\subpath')).toBeNull();
    });

    it('rejects empty, null, and non-string inputs', () => {
        expect(sanitizeReturnTo('')).toBeNull();
        expect(sanitizeReturnTo('   ')).toBeNull();
        expect(sanitizeReturnTo(null)).toBeNull();
        expect(sanitizeReturnTo(undefined)).toBeNull();
    });
});
