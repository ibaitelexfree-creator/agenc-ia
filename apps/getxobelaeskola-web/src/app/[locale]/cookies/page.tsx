import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { CookieFooterTrigger } from '@/components/cookies/CookieFooterTrigger';
import { ShieldCheck, BarChart3, Clock, Settings, Info, ExternalLink } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Política de Cookies | Getxo Bela Eskola';
    let description = 'Información detallada, inventario y gestión del consentimiento de cookies en Getxo Bela Eskola.';

    if (isEu) {
        title = 'Cookie Politika | Getxo Bela Eskola';
        description = 'Getxo Bela Eskolako cookieen erabilera, inbentarioa eta baimenen kudeaketari buruzko informazioa.';
    } else if (isEn) {
        title = 'Cookie Policy | Getxo Bela Eskola';
        description = 'Detailed information, inventory, and consent management for cookies at Getxo Bela Eskola.';
    } else if (isFr) {
        title = 'Politique de Cookies | Getxo Bela Eskola';
        description = 'Informations détaillées, inventaire et gestion du consentement aux cookies chez Getxo Bela Eskola.';
    }

    return { title, description };
}

export default async function CookiesPage({ params: { locale } }: { params: { locale: string } }) {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    return (
        <main className="min-h-screen bg-white text-black pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl w-full">
                <header className="mb-8 md:mb-10">
                    <span className="text-red-600 uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.5em] text-xs sm:text-sm md:text-base font-bold mb-3 block break-words">
                        Getxo Bela Eskola · Legal
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-black mb-4 italic leading-tight break-words">
                        {isEu ? 'Cookie Politika eta Pribatutasun Bermea' :
                         isEn ? 'Cookie Policy & Privacy Framework' :
                         isFr ? 'Politique de Cookies et Confidentialité' :
                         'Política de Cookies y Garantía de Privacidad'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
                        <span>
                            {isEu ? 'Azken eguneratzea: 2026ko urria' :
                             isEn ? 'Last updated: October 2026' :
                             isFr ? 'Dernière mise à jour : Octobre 2026' :
                             'Última actualización: Octubre de 2026'}
                        </span>
                        <span>•</span>
                        <span>LSSI-CE (Art. 22.2) · RGPD (UE 2016/679)</span>
                    </div>
                    <div className="w-24 h-px bg-red-600/40" />
                </header>

                <div className="space-y-8 text-black text-sm sm:text-base leading-relaxed">
                    {/* Botón destacado para reabrir modal */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold text-red-700 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-red-600" />
                                {isEu ? 'Zure baimena kudeatu' :
                                 isEn ? 'Manage your consent' :
                                 isFr ? 'Gérer votre consentement' :
                                 'Gestiona tu consentimiento'}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-700">
                                {isEu ? 'Zure cookien aukerak edonoiz aldatu edo kendu ditzakezu hemen klik eginez.' :
                                 isEn ? 'You can change or withdraw your cookie preferences at any time.' :
                                 isFr ? 'Vous pouvez modifier ou retirer votre consentement à tout moment.' :
                                 'Puedes cambiar o revocar tus preferencias de cookies en cualquier momento.'}
                            </p>
                        </div>
                        <CookieFooterTrigger className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0" />
                    </div>

                    {/* 1. ¿Qué son las cookies? */}
                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black flex items-center gap-2">
                            <Info className="w-5 h-5 text-red-600" />
                            {isEu ? '1. Zer dira cookieak eta antzeko teknologiak?' :
                             isEn ? '1. What are cookies and similar technologies?' :
                             isFr ? '1. Que sont les cookies et technologies similaires ?' :
                             '1. ¿Qué son las cookies y tecnologías similares?'}
                        </h2>
                        <p className="text-gray-800 leading-relaxed">
                            {isEu ?
                             'Cookieak erabiltzailearen gailuan deskargatzen diren fitxategi txikiak dira, webguneak behar bezala funtziona dezan edo nabigazio-aukerak gogoratzeko. Halaber, tokiko biltegiratzea (localStorage) eta telemetria-neurketak erabil daitezke esperientzia hobetzeko.' :
                             isEn ?
                             'Cookies are small text files downloaded to your device to ensure websites function securely and properly, remember user choices, or measure traffic. We may also use localStorage or privacy-respecting client telemetry to optimize platform performance.' :
                             isFr ?
                             'Les cookies sont de petits fichiers stockés sur votre terminal permettant au site de fonctionner efficacement et de mémoriser vos préférences. Nous utilisons également le stockage local et la télémétrie pour mesurer les performances.' :
                             'Las cookies son pequeños archivos de texto que los sitios web descargan en tu navegador o dispositivo para garantizar un funcionamiento seguro, recordar tus sesiones e idioma, o medir el rendimiento de la plataforma. También se consideran tecnologías similares el almacenamiento local del navegador (localStorage) y las balizas o telemetría en cliente.'}
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                            {isEu ?
                             'Garrantzitsua: Webgunean nabigatze hutsak ez du baimena ematen. Cookie ez-beharrezkoak zure berariazko adostasuna eman ondoren soilik aktibatuko dira.' :
                             isEn ?
                             'Important: Mere navigation does not imply consent. Non-essential cookies and analytics scripts remain disabled until you affirmatively grant permission.' :
                             isFr ?
                             'Important : La simple navigation ne vaut pas acceptation. Les cookies non essentiels et scripts analytiques restent bloqués jusqu\'à votre accord explicite.' :
                             'Importante: La mera navegación por la web no supone la aceptación de cookies. Las cookies y scripts que no sean estrictamente necesarios permanecen totalmente inactivos hasta que otorgues tu consentimiento afirmativo en el aviso inicial.'}
                        </p>
                    </section>

                    {/* 2. Categorías de cookies */}
                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black">
                            {isEu ? '2. Erabilitako cookie motak' :
                             isEn ? '2. Cookie categories used on this platform' :
                             isFr ? '2. Catégories de cookies utilisées' :
                             '2. Categorías de cookies utilizadas en este sitio web'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-emerald-600 pl-4 py-1 bg-white p-4 rounded-r-xl border border-gray-100">
                                <h3 className="text-black font-semibold text-sm sm:text-base flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    {isEu ? 'Cookie Teknikoak eta Derrigorrezkoak (Salbuetsiak)' :
                                     isEn ? 'Technical & Strictly Necessary Cookies (Exempt)' :
                                     isFr ? 'Cookies Techniques et Strictement Nécessaires (Exemptés)' :
                                     'Cookies Técnicas y Estrictamente Necesarias (Exentas)'}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 mt-1">
                                    {isEu ?
                                     'Webgunearen oinarrizko komunikazioa eta segurtasuna ahalbidetzen dituzte (saioak, Supabase bidezko autentifikazioa eta hizkuntza hautaketa). LSSI-CE 22.2 artikuluaren arabera baimenetik salbuetsita daude.' :
                                     isEn ?
                                     'Essential for site security, user authentication with Supabase, CSRF protection, and language memory. Exempt from consent under Art. 22.2 LSSI-CE.' :
                                     isFr ?
                                     'Indispensables à la sécurité, à l\'authentification avec Supabase et à la langue. Exemptés de consentement selon l\'article 22.2 LSSI-CE.' :
                                     'Permiten la navegación segura, la autenticación de alumnos y profesores a través de Supabase, la gestión de sesiones seguras y el mantenimiento del idioma elegido. Están exentas de la obligación de consentimiento según el artículo 22.2 de la LSSI-CE.'}
                                </p>
                            </div>

                            <div className="border-l-4 border-blue-600 pl-4 py-1 bg-white p-4 rounded-r-xl border border-gray-100">
                                <h3 className="text-black font-semibold text-sm sm:text-base flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    {isEu ? 'Analisi eta Errendimendu Cookieak (Baimenaren menpe)' :
                                     isEn ? 'Analytics & Performance Telemetry (Subject to Consent)' :
                                     isFr ? 'Cookies d\'Analyse et de Performance (Soumis à Consentement)' :
                                     'Cookies y Telemetría de Análisis y Rendimiento (Sujetas a Consentimiento)'}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 mt-1">
                                    {isEu ?
                                     'Vercel Analytics eta Speed Insights bidez bisitarien trafikoa eta web orriaren abiadura (Core Web Vitals) aztertzen dituzte. Ez dute erabiltzaileen profil publizitariorik egiten eta soilik zure baimenarekin kargatzen dira.' :
                                     isEn ?
                                     'Provided by Vercel Web Analytics and Speed Insights to gauge aggregated traffic and loading metrics (Core Web Vitals). They do not track users across domains and only run if you consent.' :
                                     isFr ?
                                     'Fournis par Vercel Web Analytics et Speed Insights pour mesurer le trafic agrégé et les signaux web essentiels. Ils ne sont chargés qu\'après votre consentement.' :
                                     'Facilitadas por Vercel Web Analytics y Speed Insights. Permiten conocer de forma anónima y agregada el volumen de visitas, páginas más consultadas y métricas de velocidad (Core Web Vitals) para optimizar la experiencia de navegación. Únicamente se cargan tras tu consentimiento.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Inventario real verificado */}
                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black flex items-center gap-2">
                            <Clock className="w-5 h-5 text-red-600" />
                            {isEu ? '3. Egiaztatutako cookien inbentario xehatua' :
                             isEn ? '3. Verified Cookie & Storage Inventory' :
                             isFr ? '3. Inventaire vérifié des cookies et stockage' :
                             '3. Inventario detallado y verificado de cookies y almacenamiento'}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-700">
                            {isEu ?
                             'Hemen Getxo Bela Eskolak benetan erabiltzen dituen tresnak zerrendatzen dira. Ez dugu Google Ads, Facebook Pixel edo publizitate jarraitzailerik erabiltzen.' :
                             isEn ?
                             'Here is the verified list of cookies and storage keys actually present. We do not use Google Ads, Facebook Pixel, or third-party marketing trackers.' :
                             isFr ?
                             'Voici la liste vérifiée des cookies et clés de stockage actifs. Nous n\'utilisons aucun traceur publicitaire ou pixel tiers.' :
                             'A continuación se detallan las cookies y tecnologías que realmente se ejecutan en este sitio web. No se utiliza Google Ads, Facebook Pixel ni redes publicitarias invasivas.'}
                        </p>

                        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-100/70 text-black font-semibold">
                                        <th className="py-3 px-4">Identificador</th>
                                        <th className="py-3 px-4">Titular</th>
                                        <th className="py-3 px-4">Categoría</th>
                                        <th className="py-3 px-4">Finalidad</th>
                                        <th className="py-3 px-4">Duración</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-gray-800">
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">gbe_cookie_consent_v1</td>
                                        <td className="py-3 px-4">Propia</td>
                                        <td className="py-3 px-4 text-emerald-700 font-semibold">Técnica (Storage)</td>
                                        <td className="py-3 px-4">Guarda la elección de cookies del usuario y la fecha de consentimiento.</td>
                                        <td className="py-3 px-4">12 meses</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">sb-*-auth-token</td>
                                        <td className="py-3 px-4">Supabase Inc. / Propia</td>
                                        <td className="py-3 px-4 text-emerald-700 font-semibold">Técnica (Esencial)</td>
                                        <td className="py-3 px-4">Mantiene la sesión autenticada del alumno, instructor o administrador.</td>
                                        <td className="py-3 px-4">Persistente (Sesión activa)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">sb-redirect-to</td>
                                        <td className="py-3 px-4">Propia</td>
                                        <td className="py-3 px-4 text-emerald-700 font-semibold">Técnica</td>
                                        <td className="py-3 px-4">Guarda la ruta de retorno temporal tras completar inicio de sesión con Google.</td>
                                        <td className="py-3 px-4">5 minutos</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">NEXT_LOCALE</td>
                                        <td className="py-3 px-4">Propia</td>
                                        <td className="py-3 px-4 text-emerald-700 font-semibold">Técnica</td>
                                        <td className="py-3 px-4">Recuerda la preferencia de idioma del usuario (es, eu, en, fr).</td>
                                        <td className="py-3 px-4">Sesión / 1 año</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">@vercel/analytics</td>
                                        <td className="py-3 px-4">Vercel Inc. (EE.UU. / UE)</td>
                                        <td className="py-3 px-4 text-blue-700 font-semibold">Analítica (Consentimiento)</td>
                                        <td className="py-3 px-4">Telemetría de visitas sin recopilar identificadores personales invasivos. Solo se carga con autorización previa.</td>
                                        <td className="py-3 px-4">Sesión de navegación</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-xs font-semibold text-black">@vercel/speed-insights</td>
                                        <td className="py-3 px-4">Vercel Inc.</td>
                                        <td className="py-3 px-4 text-blue-700 font-semibold">Rendimiento (Consentimiento)</td>
                                        <td className="py-3 px-4">Supervisión de Core Web Vitals en cliente para optimizar la velocidad. Solo se carga con autorización previa.</td>
                                        <td className="py-3 px-4">Sesión de navegación</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. Proveedores y transferencias */}
                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black">
                            {isEu ? '4. Hirugarren hornitzaileak eta datu-lagapenak' :
                             isEn ? '4. Third-Party Providers & Data Processing' :
                             isFr ? '4. Fournisseurs tiers et transferts' :
                             '4. Proveedores externos y transferencias internacionales'}
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-800 text-xs sm:text-sm">
                            <li>
                                <strong className="text-black">Supabase Inc.:</strong> Proveedor de base de datos y autenticación de usuarios. Servidores alojados en la Unión Europea (Frankfurt / AWS eu-central-1).
                            </li>
                            <li>
                                <strong className="text-black">Vercel Inc.:</strong> Proveedor de alojamiento web perimetral, analítica y métricas de rendimiento. Cumple con el marco de privacidad de datos UE-EE.UU. (Data Privacy Framework).
                            </li>
                        </ul>
                    </section>

                    {/* 5. Cómo desactivar cookies en el navegador */}
                    <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black">
                            {isEu ? '5. Nabigatzailetik nola kontrolatu edo ezabatu cookieak' :
                             isEn ? '5. How to control or delete cookies from your browser' :
                             isFr ? '5. Comment gérer les cookies depuis votre navigateur' :
                             '5. Cómo controlar o eliminar cookies desde tu navegador'}
                        </h2>
                        <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                            {isEu ?
                             'Gure webguneko konfigurazio-panela erabiltzeaz gain, zure nabigatzailearen ezarpenetatik deskargatutako cookie guztiak ezabatu edo blokeatu ditzakezu:' :
                             isEn ?
                             'In addition to our on-site settings panel, you can block or remove cookies directly in your browser preferences:' :
                             isFr ?
                             'En plus de notre panneau de préférences, vous pouvez supprimer ou bloquer les cookies directement dans votre navigateur :' :
                             'Además de nuestro panel interactivo de preferencias, puedes configurar tu navegador para rechazar o eliminar cookies en cualquier momento:'}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 text-xs">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-medium border border-gray-300 shadow-sm transition-colors">
                                Chrome <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                            </a>
                            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-medium border border-gray-300 shadow-sm transition-colors">
                                Firefox <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                            </a>
                            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-medium border border-gray-300 shadow-sm transition-colors">
                                Safari <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                            </a>
                            <a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-medium border border-gray-300 shadow-sm transition-colors">
                                Edge <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
