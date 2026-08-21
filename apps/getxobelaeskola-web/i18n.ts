import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['es', 'eu', 'en', 'fr'];

const messageImports: Record<string, () => Promise<any>> = {
    es: () => import('./messages/es.json'),
    eu: () => import('./messages/eu.json'),
    en: () => import('./messages/en.json'),
    fr: () => import('./messages/fr.json'),
};

export default getRequestConfig(async ({ locale }) => {
    const activeLocale = (locale && locales.includes(locale as any)) ? locale : 'es';
    const importFn = messageImports[activeLocale] || messageImports.es;
    const messages = (await importFn()).default;

    return {
        locale: activeLocale,
        messages
    };
});
