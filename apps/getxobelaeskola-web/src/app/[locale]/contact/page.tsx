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
        <main className="w-full pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 relative bg-nautical-black selection:bg-accent selection:text-nautical-black overflow-x-clip min-h-screen">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 blur-[100px] sm:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="global-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-start">

                    {/* Info Column */}
                    <div className="animate-fade-in w-full" style={{ animationDelay: '0.2s' }}>
                        <header className="mb-10 sm:mb-14 lg:mb-16">
                            <span className="text-accent uppercase tracking-[0.4em] sm:tracking-[0.6em] text-xs sm:text-sm font-bold mb-4 sm:mb-6 block">
                                {t('header_badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-black leading-[0.95] mb-6 sm:mb-10 cursor-default">
                                {t('header_title')} <br />
                                <span className="italic font-light text-black">{t('header_highlight')}</span>
                            </h1>
                            <div className="w-16 sm:w-24 h-px bg-accent/40" />
                        </header>

                        <div className="space-y-8 sm:space-y-12 lg:space-y-14">
                            <div className="space-y-2 sm:space-y-4">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('location_label')}</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-display italic leading-tight whitespace-pre-line text-black/80">{t('location_val')}</p>
                            </div>

                            <div className="space-y-2 sm:space-y-4">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('contact_label')}</p>
                                <div className="space-y-2">
                                    <a href="mailto:info@getxobelaeskola.com" className="text-xl sm:text-2xl lg:text-3xl font-display italic text-black/80 hover:text-accent transition-colors duration-0 tracking-wide block break-all sm:break-normal">
                                        info@getxobelaeskola.com
                                    </a>
                                    <a href="tel:+34944916632" className="text-xl sm:text-2xl lg:text-3xl font-display italic text-black/80 hover:text-accent transition-colors duration-0 tracking-wider block">
                                        (+34) 944 916 632
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-4">
                                <p className="text-2xs sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent font-bold">{t('hours_label')}</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-display italic leading-tight whitespace-pre-line text-black/80 tracking-wide">{t('hours_val')}</p>
                            </div>
                        </div>

                        {/* Social Links or Extra Decor */}
                        <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-foreground/10 flex flex-wrap gap-6 sm:gap-12 text-xs uppercase tracking-[0.3em] font-light">
                            <a href="https://www.instagram.com/pakeabelaeskola/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-accent transition-colors">Instagram</a>
                            <a href="https://www.facebook.com/Pakea.bela.eskola/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-accent transition-colors">Facebook</a>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="relative group lg:sticky lg:top-36 w-full">
                        <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-brass-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="relative glass-panel p-6 sm:p-8 md:p-12 border-foreground/10 bg-foreground/[0.02] animate-fade-in rounded-2xl" style={{ animationDelay: '0.4s' }}>
                            <ContactForm />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
