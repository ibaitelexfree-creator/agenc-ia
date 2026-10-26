/**
 * Resolves the canonical base URL according to environment priority:
 * 1. Explicit NEXT_PUBLIC_APP_URL
 * 2. Vercel Production deployment (VERCEL_ENV === 'production') -> https://www.getxobelaeskola.com
 * 3. Vercel Preview or local development without explicit URL -> https://getxobelaeskola.cloud
 * 4. Fallback default
 */
export function getSiteUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    }

    if (process.env.VERCEL_ENV === 'production') {
        return 'https://www.getxobelaeskola.com';
    }

    // Vercel preview (VERCEL_ENV === 'preview') or development
    return 'https://getxobelaeskola.cloud';
}

export const siteUrl = getSiteUrl();

/**
 * Generates SEO canonical and localized alternate URLs for a given page path.
 * 
 * @param path The relative path of the page (e.g. 'about', 'courses', or '' for home)
 * @param locale The current active language locale (e.g. 'es', 'eu', etc.)
 */
export function getSeoAlternates(path: string, locale: string) {
    const base = getSiteUrl();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const suffix = cleanPath ? `/${cleanPath}/` : '/';
    
    return {
        canonical: `${base}/${locale}${suffix}`,
        languages: {
            'es-ES': `${base}/es${suffix}`,
            'eu-ES': `${base}/eu${suffix}`,
            'en-US': `${base}/en${suffix}`,
            'fr-FR': `${base}/fr${suffix}`,
        }
    };
}

