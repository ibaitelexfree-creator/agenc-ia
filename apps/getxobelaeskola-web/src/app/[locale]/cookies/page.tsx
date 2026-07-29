import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const title = isEu ? 'Cookie Politika' : 'Política de Cookies';
    const description = isEu
        ? 'Getxo Bela Eskolako cookieen erabilera eta informazioa.'
        : 'Información sobre el uso de cookies en el sitio web de Getxo Bela Eskola.';

    return { title, description };
}

export default async function CookiesPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'legal' });

    return (
        <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative bg-nautical-black">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="container mx-auto max-w-4xl w-full">
                <header className="mb-6 sm:mb-8">
                    <span className="text-accent uppercase tracking-[0.4em] sm:tracking-[0.6em] text-xs sm:text-sm font-bold mb-2 sm:mb-3 block">
                        Getxo Bela Eskola
                    </span>
                    <div className="inline-block bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg mb-4">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-black italic leading-tight">
                            {t('cookies_title')}
                        </h1>
                    </div>
                    <div className="w-24 h-px bg-accent/40 mt-2" />
                </header>

                <div className="prose prose-invert prose-brass max-w-none">
                    <section className="bg-white/5 p-4 sm:p-6 rounded-md border border-white/10 mb-6">
                        <p className="text-foreground/70 leading-relaxed italic text-sm sm:text-base">
                            Esta página describe el uso de cookies en el sitio web de Getxo Getxo Bela Eskola. Al navegar por nuestra web, aceptas el uso de cookies para mejorar tu experiencia de usuario.
                        </p>
                    </section>

                    <div className="space-y-4 sm:space-y-6 text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
                        <div className="bg-white/5 p-4 sm:p-5 rounded-md border border-white/5">
                            <h2 className="text-lg sm:text-xl font-display text-white mb-2 font-semibold">1. ¿Qué son las cookies?</h2>
                            <p className="text-foreground/70">
                                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu ordenador o dispositivo móvil cuando los visitas. Se utilizan para que el sitio web funcione o funcione de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 sm:p-5 rounded-md border border-white/5">
                            <h2 className="text-lg sm:text-xl font-display text-white mb-2 font-semibold">2. ¿Cómo las utilizamos?</h2>
                            <p className="text-foreground/70">
                                Utilizamos cookies técnicas para recordar tu sesión y preferencias de idioma. También podemos utilizar cookies analíticas de terceros (como Google Analytics) para entender cómo interactúan los usuarios con nuestra web y mejorar nuestros servicios.
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 sm:p-5 rounded-md border border-white/5">
                            <h2 className="text-lg sm:text-xl font-display text-white mb-2 font-semibold">3. Tipos de Cookies</h2>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                                <li><strong>Cookies Técnicas:</strong> Esenciales para el funcionamiento del sitio y plataformas de membresía.</li>
                                <li><strong>Cookies de Sesión:</strong> Se eliminan al cerrar el navegador.</li>
                                <li><strong>Cookies de Terceros:</strong> Utilizadas para analítica y seguimiento de marketing (Facebook Pixel, Google Ads).</li>
                            </ul>
                        </div>

                        <div className="bg-white/5 p-4 sm:p-5 rounded-md border border-white/5">
                            <h2 className="text-lg sm:text-xl font-display text-white mb-2 font-semibold">4. Control de Cookies</h2>
                            <p className="text-foreground/70">
                                Puedes controlar y/o eliminar las cookies como desees. Para más detalles, consulta aboutcookies.org. Puedes eliminar todas las cookies que ya están en tu ordenador y puedes configurar la mayoría de los navegadores para que no se instalen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
