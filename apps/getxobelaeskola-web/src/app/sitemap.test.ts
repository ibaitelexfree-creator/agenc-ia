
import { describe, it, expect, vi, beforeEach } from 'vitest';
import sitemap from './sitemap';

// Mock Supabase admin client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();

const mockSupabase = {
  from: mockFrom,
};

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => mockSupabase,
}));

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default chain setup
    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      eq: mockEq, // For chained .eq()
      order: mockOrder, // If order is used
      then: (resolve: any) => resolve({ data: [], error: null }), // Mock promise resolution
    });
  });

    it('should generate production .com sitemap when VERCEL_ENV is production and no explicit URL is given', async () => {
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');

        const mockCourses = [
            { slug: 'crucero-iniciacion', updated_at: '2026-01-01T00:00:00Z' },
        ];

        mockFrom.mockImplementation((table: string) => {
            if (table === 'cursos') {
                return {
                    select: () => ({
                        eq: () => ({
                            eq: () => Promise.resolve({ data: mockCourses, error: null }),
                        }),
                    }),
                };
            }
            return { select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) }) };
        });

        const entries = await sitemap();

        // Must use production .com domain
        expect(entries.length).toBeGreaterThan(0);
        expect(entries.every(e => e.url.startsWith('https://www.getxobelaeskola.com'))).toBe(true);

        // Verify sample URLs across locales
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/es')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/eu')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/en')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/fr')).toBe(true);

        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/es/courses/crucero-iniciacion')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/eu/courses/crucero-iniciacion')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/en/courses/crucero-iniciacion')).toBe(true);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/fr/courses/crucero-iniciacion')).toBe(true);

        // Modules must NOT be included in the sitemap
        expect(entries.some(e => e.url.includes('/academy/module'))).toBe(false);
        expect(mockFrom).not.toHaveBeenCalledWith('modulos');
    });

    it('should fall back to .cloud domain for preview / development environment without explicit URL', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');

        const entries = await sitemap();
        expect(entries.every(e => e.url.startsWith('https://getxobelaeskola.cloud'))).toBe(true);
        expect(entries.some(e => e.url === 'https://getxobelaeskola.cloud/es')).toBe(true);
    });

    it('should prioritize NEXT_PUBLIC_APP_URL if explicitly configured', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://custom-preview.domain.com');

        const entries = await sitemap();
        expect(entries.every(e => e.url.startsWith('https://custom-preview.domain.com'))).toBe(true);
        expect(entries.some(e => e.url === 'https://custom-preview.domain.com/es')).toBe(true);
    });

    it('should handle errors gracefully', async () => {
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        mockFrom.mockReturnValue({
            select: () => ({
                eq: () => ({
                    eq: () => Promise.resolve({ data: null, error: 'DB Error' }),
                }),
            }),
        });

        const entries = await sitemap();

        // Should still return static paths even if DB fails
        expect(entries.length).toBeGreaterThan(0);
        expect(entries.some(e => e.url === 'https://www.getxobelaeskola.com/es/courses')).toBe(true);
    });
});
