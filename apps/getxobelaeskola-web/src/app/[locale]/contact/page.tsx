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
        <main className="min-h-screen pt-48 pb-24 px-6 relative bg-nautical-black selection:bg-accent selection:text-nautical-black">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">

                    {/* Info Column */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <header className="mb-20">
                            <span className="text-accent uppercase tracking-[0.6em] text-sm font-bold mb-6 block">
                                {t('header_badge')}
                            </span>
                            <h1 className="text-4xl md:text-[8rem] font-display text-black leading-[0.9] mb-12 cursor-default">
                                {t('header_title')} <br />
                                <span className="italic font-light text-black">{t('header_highlight')}</span>
                            </h1>
                            <div className="w-24 h-px bg-accent/40" />
                        </header>

                        <div className="space-y-16">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.4em] text-accent font-bold">{t('location_label')}</p>
                                <p className="text-3xl font-display italic leading-tight whitespace-pre-line text-black/80">{t('location_val')}</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.4em] text-accent font-bold">{t('contact_label')}</p>
                                <div className="space-y-2">
                                    <a href="mailto:info@getxobelaeskola.com" className="text-3xl font-display italic text-black/80 hover:text-accent transition-colors duration-0 tracking-wide block">
                                        info@getxobelaeskola.com
                                    </a>
                                    <a href="tel:+34944916632" className="text-3xl font-display italic text-black/80 hover:text-accent transition-colors duration-0 tracking-wider block">
                                        (+34) 944 916 632
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.4em] text-accent font-bold">{t('hours_label')}</p>
                                <p className="text-3xl font-display italic leading-tight whitespace-pre-line text-black/80 tracking-wide">{t('hours_val')}</p>
                            </div>
                        </div>

                        {/* Social Links or Extra Decor */}
                        <div className="mt-24 pt-24 border-t border-foreground/10 flex gap-12 text-xs uppercase tracking-[0.3em] font-light">
                            <a href="https://www.instagram.com/pakeabelaeskola/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-accent transition-colors">Instagram</a>
                            <a href="https://www.facebook.com/Pakea.bela.eskola/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-accent transition-colors">Facebook</a>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="relative group lg:sticky lg:top-48">
                        <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-brass-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="relative glass-panel p-12 md:p-16 border-foreground/10 bg-foreground/[0.02] animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <ContactForm />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
