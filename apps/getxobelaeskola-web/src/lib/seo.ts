const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.getxobelaeskola.cloud';
export const siteUrl = rawUrl.includes('getxobelaeskola.cloud') && !rawUrl.includes('www.getxobelaeskola.cloud')
    ? rawUrl.replace('getxobelaeskola.cloud', 'www.getxobelaeskola.cloud')
    : rawUrl;

/**
 * Generates SEO canonical and localized alternate URLs for a given page path.
 * 
 * @param path The relative path of the page (e.g. 'about', 'courses', or '' for home)
 * @param locale The current active language locale (e.g. 'es', 'eu', etc.)
 */
export function getSeoAlternates(path: string, locale: string) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const suffix = cleanPath ? `/${cleanPath}/` : '/';
    
    return {
        canonical: `${siteUrl}/${locale}${suffix}`,
        languages: {
            'es-ES': `${siteUrl}/es${suffix}`,
            'eu-ES': `${siteUrl}/eu${suffix}`,
            'en-US': `${siteUrl}/en${suffix}`,
            'fr-FR': `${siteUrl}/fr${suffix}`,
        }
    };
}
