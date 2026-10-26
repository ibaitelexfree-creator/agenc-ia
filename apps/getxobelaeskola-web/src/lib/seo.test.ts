import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSiteUrl, getSeoAlternates } from './seo';

describe('src/lib/seo.ts environment detection and alternates', () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('priority 1: uses NEXT_PUBLIC_APP_URL when explicitly set', () => {
        vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://custom.domain.com/');
        vi.stubEnv('VERCEL_ENV', 'production');
        expect(getSiteUrl()).toBe('https://custom.domain.com');
    });

    it('priority 2: uses https://www.getxobelaeskola.com on Vercel production without explicit URL', () => {
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        vi.stubEnv('VERCEL_ENV', 'production');
        expect(getSiteUrl()).toBe('https://www.getxobelaeskola.com');
    });

    it('priority 3: uses https://getxobelaeskola.cloud on Vercel preview or development without explicit URL', () => {
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        vi.stubEnv('VERCEL_ENV', 'preview');
        expect(getSiteUrl()).toBe('https://getxobelaeskola.cloud');

        vi.stubEnv('VERCEL_ENV', 'development');
        expect(getSiteUrl()).toBe('https://getxobelaeskola.cloud');
    });

    it('generates canonical and hreflang alternate URLs properly for production', () => {
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        vi.stubEnv('VERCEL_ENV', 'production');

        const alternatesHome = getSeoAlternates('', 'es');
        expect(alternatesHome.canonical).toBe('https://www.getxobelaeskola.com/es/');
        expect(alternatesHome.languages['es-ES']).toBe('https://www.getxobelaeskola.com/es/');
        expect(alternatesHome.languages['eu-ES']).toBe('https://www.getxobelaeskola.com/eu/');
        expect(alternatesHome.languages['en-US']).toBe('https://www.getxobelaeskola.com/en/');
        expect(alternatesHome.languages['fr-FR']).toBe('https://www.getxobelaeskola.com/fr/');

        const alternatesCourses = getSeoAlternates('courses/crucero-iniciacion', 'eu');
        expect(alternatesCourses.canonical).toBe('https://www.getxobelaeskola.com/eu/courses/crucero-iniciacion/');
        expect(alternatesCourses.languages['es-ES']).toBe('https://www.getxobelaeskola.com/es/courses/crucero-iniciacion/');
    });
});
