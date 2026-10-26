import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteUrl } from '../lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();
    const locales = ['es', 'eu', 'en', 'fr'];
    const staticPaths = ['', '/courses', '/academy', '/rental', '/about', '/contact'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Static Paths
    locales.forEach((locale) => {
        staticPaths.forEach((path) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: path === '' ? 'daily' : 'weekly',
                priority: path === '' ? 1.0 : 0.8,
            });
        });
    });

    try {
        const supabase = createAdminClient();

        // Dynamic Course Paths (Publicly accessible and active courses)
        const { data: courses, error: coursesError } = await supabase
            .from('cursos')
            .select('slug, updated_at')
            .eq('activo', true)
            .eq('visible', true);

        if (coursesError) {
            console.error('Error fetching courses for sitemap:', coursesError);
        } else if (courses) {
            locales.forEach((locale) => {
                courses.forEach((course: any) => {
                    sitemapEntries.push({
                        url: `${baseUrl}/${locale}/courses/${course.slug}`,
                        lastModified: course.updated_at ? new Date(course.updated_at) : new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    });
                });
            });
        }
    } catch (e) {
        console.error('Sitemap dynamic paths error:', e);
    }

    return sitemapEntries;
}
