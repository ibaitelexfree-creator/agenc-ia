import ContactForm from '@/components/shared/ContactForm';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { getSeoAlternates } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Contacto';
    let description = 'Contacta con nosotros. Estamos aquí para resolver tus dudas sobre navegación en Getxo.';

    if (isEu) {
        title = 'Kontaktua';
        description = 'Jarri gurekin harremanetan. Hemen gaude zure nabigazio galderak erantzuteko Getxon.';
    } else if (isEn) {
        title = 'Contact Us';
        description = 'Get in touch with us. We are here to answer your sailing questions in Getxo.';
    } else if (isFr) {
        title = 'Contactez-nous';
        description = 'Contactez-nous. Nous sommes là pour répondre à vos questions sur la navigation à Getxo.';
    }

    const fullTitle = `${title} | Getxo Bela Eskola`;

    return {
        title: fullTitle,
        description,
        alternates: getSeoAlternates('contact', locale),
        openGraph: {
            title: fullTitle,
            description,
            images: ['/images/home-hero-sailing-action.webp']
        }
    };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'contact_page' });

    return (
        <main className="min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-24 xl:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 relative bg-nautical-black selection:bg-accent selection:text-nautical-black">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-24 items-start">

                    {/* Info Column (Part 1) */}
                    <div className="order-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <header className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                            <span className="text-accent uppercase tracking-[0.3em] sm:tracking-[0.5em] lg:tracking-[0.6em] text-xs sm:text-sm font-bold mb-2 sm:mb-4 block">
                                {t('header_badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-display text-sea-foam leading-[0.95] mb-4 sm:mb-6 lg:mb-8 cursor-default break-words">
                                {t('header_title')} <br />
                                <span className="italic font-light text-accent">{t('header_highlight')}</span>
                            </h1>
                            <div className="w-16 sm:w-20 lg:w-24 h-px bg-accent/40" />
                        </header>

                        <div className="space-y-6 sm:space-y-8 md:space-y-10">
                            <div className="space-y-1.5 sm:space-y-2">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('location_label')}</p>
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display italic leading-tight whitespace-pre-line text-sea-foam/90">{t('location_val')}</p>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('contact_label')}</p>
                                <div className="space-y-1.5">
                                    <a href="mailto:info@getxobelaeskola.com" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display italic text-sea-foam/90 hover:text-accent transition-colors duration-200 tracking-wide block break-all">
                                        info@getxobelaeskola.com
                                    </a>
                                    <a href="tel:+34944916632" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display italic text-sea-foam/90 hover:text-accent transition-colors duration-200 tracking-wider block">
                                        (+34) 944 916 632
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('hours_label')}</p>
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display italic leading-tight whitespace-pre-line text-sea-foam/90 tracking-wide">{t('hours_val')}</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-10 border-t border-sea-foam/10 flex gap-6 sm:gap-12 text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light">
                            <a href="https://www.instagram.com/pakeabelaeskola/" target="_blank" rel="noopener noreferrer" className="text-sea-foam/60 hover:text-accent transition-colors">Instagram</a>
                            <a href="https://www.facebook.com/Pakea.bela.eskola/" target="_blank" rel="noopener noreferrer" className="text-sea-foam/60 hover:text-accent transition-colors">Facebook</a>
                        </div>
                    </div>

                    {/* Form Column & Interactive Card (Shifted higher up to align perfectly at the top) */}
                    <div className="order-2 relative group lg:sticky lg:top-24 xl:top-28 w-full">
                        <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-brass-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="relative glass-panel p-5 sm:p-7 md:p-10 lg:p-12 xl:p-14 border-sea-foam/10 bg-sea-foam/[0.02] animate-fade-in rounded-2xl shadow-2xl" style={{ animationDelay: '0.4s' }}>
                            <ContactForm />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
