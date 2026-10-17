import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Política de Privacidad | Getxo Bela Eskola';
    let description = 'Política de privacidad y protección de datos personales de Getxo Bela Eskola.';

    if (isEu) {
        title = 'Pribatutasun Politika | Getxo Bela Eskola';
        description = 'Getxo Bela Eskolako pribatutasun politika eta datuen babesa.';
    } else if (isEn) {
        title = 'Privacy Policy | Getxo Bela Eskola';
        description = 'Privacy policy and personal data protection framework at Getxo Bela Eskola.';
    } else if (isFr) {
        title = 'Politique de Confidentialité | Getxo Bela Eskola';
        description = 'Politique de confidentialité et protection des données personnelles de Getxo Bela Eskola.';
    }

    return { title, description };
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'legal' });

    return (
        <main className="min-h-screen bg-white text-black pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-8 md:mb-10">
                    <span className="text-red-600 uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.5em] text-xs sm:text-sm md:text-base font-bold mb-3 block break-words">
                        Getxo Bela Eskola
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-black mb-6 italic leading-tight break-words">
                        {t('privacy_title')}
                    </h1>
                    <div className="w-24 h-px bg-red-600/40" />
                </header>

                <div className="space-y-6 sm:space-y-8 text-base md:text-lg leading-relaxed text-black">
                    <p className="text-gray-800 italic leading-relaxed">
                        {t('privacy_intro')}
                    </p>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">
                            {t('privacy_sec1_title')}
                        </h2>
                        <p className="text-black">
                            {t('privacy_sec1_p1')}{' '}
                            <strong>{t('privacy_sec1_company')}</strong> (
                            {locale === 'eu' ? 'izen komertziala: ' :
                             locale === 'en' ? 'trade name: ' :
                             locale === 'fr' ? 'nom commercial : ' :
                             'nombre comercial: '}
                            <strong>{t('privacy_sec1_trade_name')}</strong>), CIF{' '}
                            <strong>{t('privacy_sec1_cif')}</strong>,{' '}
                            {t('privacy_sec1_address')}. {t('privacy_sec1_contact_phone')}{' '}
                            <a href="tel:+34944916632" className="text-red-600 font-bold hover:underline">
                                94 491 66 32
                            </a>{' '}
                            {t('privacy_sec1_contact_email')}{' '}
                            <a href="mailto:info@getxobelaeskola.com" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
                                info@getxobelaeskola.com
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">
                            {t('privacy_sec2_title')}
                        </h2>
                        <p className="text-black">
                            {t('privacy_sec2_desc')}
                        </p>
                        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 mt-2 text-black">
                            <li>{t('privacy_sec2_item1')}</li>
                            <li>{t('privacy_sec2_item2')}</li>
                            <li>{t('privacy_sec2_item3')}</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">
                            {t('privacy_sec3_title')}
                        </h2>
                        <p className="text-black">
                            {t('privacy_sec3_desc')}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">
                            {t('privacy_sec4_title')}
                        </h2>
                        <p className="text-black">
                            {t('privacy_sec4_p1')}{' '}
                            {t('privacy_sec4_p2')}{' '}
                            <a href="mailto:info@getxobelaeskola.com" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
                                info@getxobelaeskola.com
                            </a>{' '}
                            {t('privacy_sec4_p3')}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
