import { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/private/',
                '/api/',
                '/admin/',
                '/staff/',
                '/**/student/dashboard/',
                '/**/academy/module/'
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
