import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { GET } from './route';
import { getPublicOrigin } from '../../../../lib/security/origin-resolver';
import { NextRequest } from 'next/server';

const mockExchangeCodeForSession = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

const mockCookieStore = {
  get: vi.fn(),
};
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => mockCookieStore),
}));

describe('Auth Callback getPublicOrigin() Security Tests', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
  });

  afterAll(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  });

  it('Production: enforces Canonical Origin https://getxobelaeskola.com by default', () => {
    const req = new NextRequest('http://getxobelaeskola.com/api/auth/callback?code=123');
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });

  it('Production: rejects Origin Header Spoofing (Origin: https://evil.com)', () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=123', {
      headers: {
        origin: 'https://evil.com',
      },
    });
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });

  it('Production: rejects Host Header Spoofing (Host: evil.com)', () => {
    const req = new NextRequest('https://evil.com/api/auth/callback?code=123', {
      headers: {
        host: 'evil.com',
      },
    });
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });

  it('Production: rejects X-Forwarded-Host Spoofing (X-Forwarded-Host: attacker.com)', () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=123', {
      headers: {
        'x-forwarded-host': 'attacker.com',
        'x-forwarded-proto': 'https',
      },
    });
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });

  it('Production: rejects Insecure Protocol Downgrade (X-Forwarded-Proto: http)', () => {
    const req = new NextRequest('http://getxobelaeskola.com/api/auth/callback?code=123', {
      headers: {
        'x-forwarded-proto': 'http',
      },
    });
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });

  it('Development: allows localhost:3000 when NODE_ENV is development', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    const req = new NextRequest('http://localhost:3000/api/auth/callback?code=123', {
      headers: {
        host: 'localhost:3000',
      },
    });
    expect(getPublicOrigin(req)).toBe('http://localhost:3000');
  });

  it('Development: allows 127.0.0.1:3000 when NODE_ENV is development', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    const req = new NextRequest('http://127.0.0.1:3000/api/auth/callback?code=123', {
      headers: {
        host: '127.0.0.1:3000',
      },
    });
    expect(getPublicOrigin(req)).toBe('http://127.0.0.1:3000');
  });

  it('Development: rejects external hosts even in development mode', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    const req = new NextRequest('https://evil.com/api/auth/callback?code=123', {
      headers: {
        host: 'evil.com',
      },
    });
    expect(getPublicOrigin(req)).toBe('https://getxobelaeskola.com');
  });
});

describe('Auth Callback GET Route Security & Open Redirect Tests', () => {
  beforeEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    vi.clearAllMocks();
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    mockCookieStore.get.mockReturnValue(undefined);
  });

  it('redirects to safe relative path next=/dashboard with canonical origin', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=/dashboard');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/dashboard');
  });

  it('falls back to default "/" if next is root protocol relative "//evil.com"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=//evil.com');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('falls back to default "/" if next is protocol relative with path "//evil.com/dashboard"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=//evil.com/dashboard');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('falls back to default "/" if next is absolute external URL "https://evil.com"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=https://evil.com');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('falls back to default "/" if next is "javascript:alert(1)"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=javascript:alert(1)');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('falls back to default "/" if next uses backslash evasion "/\\evil.com"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=/\\evil.com');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('falls back to default "/" if next uses urlencoded backslash "/%5cevil.com"', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=/%5cevil.com');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('preserves query params in safe internal path next=/dashboard?booking=123', async () => {
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code&next=/dashboard?booking=123');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/dashboard?booking=123');
  });

  it('sanitizes unsafe sb-redirect-to cookie', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'https://evil.com' });
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/');
  });

  it('accepts safe sb-redirect-to cookie', async () => {
    mockCookieStore.get.mockReturnValue({ value: '/eu/profile' });
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=valid-code');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/eu/profile');
  });

  it('redirects to error page on auth exchange failure using canonical origin', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: new Error('Invalid code') });
    const req = new NextRequest('https://getxobelaeskola.com/api/auth/callback?code=bad-code', {
      headers: {
        host: 'evil.com',
        origin: 'https://evil.com',
      },
    });
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://getxobelaeskola.com/es/auth/login?error=auth_callback_error');
  });
});
