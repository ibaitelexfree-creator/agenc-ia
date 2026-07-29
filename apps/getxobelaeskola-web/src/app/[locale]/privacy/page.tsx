import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const title = isEu ? 'Pribatutasun Politika' : 'Política de Privacidad';
    const description = isEu
        ? 'Getxo Bela Eskolako pribatutasun politika eta datuen babesa.'
        : 'Política de privacidad y protección de datos de Getxo Bela Eskola.';

    return { title, description };
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'legal' });

    return (
        <main className="min-h-screen bg-white text-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-8 md:mb-10">
                    <span className="text-red-600 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-xs sm:text-sm font-bold mb-3 block">
                        Getxo Getxo Bela Eskola
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-black mb-6 italic">
                        {t('privacy_title')}
                    </h1>
                    <div className="w-24 h-px bg-red-600/40" />
                </header>

                <div className="space-y-6 sm:space-y-8 text-base md:text-lg leading-relaxed text-black">
                    <p className="text-gray-800 italic leading-relaxed">
                        En Getxo Getxo Bela Eskola nos tomamos muy en serio la privacidad de tus datos. Cumplimos estrictamente con el Reglamento General de Protección de Datos (RGPD).
                    </p>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">1. Responsable del Tratamiento</h2>
                        <p className="text-black">
                            El responsable del tratamiento de tus datos es Getxo Bela Eskola, con dirección en Muelle Arriluzea s/n, 48990 Getxo. Puedes contactar con nosotros en <a href="mailto:info@getxobelaeskola.com" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">info@getxobelaeskola.com</a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">2. Finalidad de los Datos</h2>
                        <p className="text-black">
                            Los datos proporcionados a través de formularios de contacto o registro se utilizan para:
                        </p>
                        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 mt-2 text-black">
                            <li>Gestionar tu inscripción en cursos y alquileres.</li>
                            <li>Mantenerte informado sobre novedades de la escuela (si has aceptado la newsletter).</li>
                            <li>Cumplir con las obligaciones legales de registro de navegantes.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">3. Conservación</h2>
                        <p className="text-black">
                            Conservaremos tus datos mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-2">4. Tus Derechos</h2>
                        <p className="text-black">
                            Tienes derecho a acceder, rectificar o suprimir tus datos Personales. Para ejercer estos derechos, envía un correo a <a href="mailto:info@getxobelaeskola.com" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">info@getxobelaeskola.com</a> adjuntando copia de tu DNI.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
