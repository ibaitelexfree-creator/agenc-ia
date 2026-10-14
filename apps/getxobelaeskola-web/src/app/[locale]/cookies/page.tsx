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
        <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative bg-nautical-black text-white">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="container mx-auto max-w-4xl w-full">
                <header className="mb-8 sm:mb-12">
                    <span className="text-accent uppercase tracking-[0.4em] sm:tracking-[0.6em] text-xs sm:text-sm font-bold mb-2 sm:mb-3 block">
                        Getxo Bela Eskola · Legal
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-display text-white font-bold italic leading-tight mb-3">
                        {isEu ? 'Cookie Politika eta Pribatutasun Bermea' :
                         isEn ? 'Cookie Policy & Privacy Framework' :
                         isFr ? 'Politique de Cookies et Confidentialité' :
                         'Política de Cookies y Garantía de Privacidad'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                        <span>
                            {isEu ? 'Azken eguneratzea: 2026ko urria' :
                             isEn ? 'Last updated: October 2026' :
                             isFr ? 'Dernière mise à jour : Octobre 2026' :
                             'Última actualización: Octubre de 2026'}
                        </span>
                        <span>•</span>
                        <span>LSSI-CE (Art. 22.2) · RGPD (UE 2016/679)</span>
                    </div>
                    <div className="w-24 h-px bg-accent/40 mt-4" />
                </header>

                <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
                    {/* Botón destacado para reabrir modal */}
                    <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-bold text-accent flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                {isEu ? 'Zure baimena kudeatu' :
                                 isEn ? 'Manage your consent' :
                                 isFr ? 'Gérer votre consentement' :
                                 'Gestiona tu consentimiento'}
                            </h2>
                            <p className="text-xs sm:text-sm text-white/70">
                                {isEu ? 'Zure cookien aukerak edonoiz aldatu edo kendu ditzakezu hemen klik eginez.' :
                                 isEn ? 'You can change or withdraw your cookie preferences at any time.' :
                                 isFr ? 'Vous pouvez modifier ou retirer votre consentement à tout moment.' :
                                 'Puedes cambiar o revocar tus preferencias de cookies en cualquier momento.'}
                            </p>
                        </div>
                        <CookieFooterTrigger className="px-4 py-2.5 rounded-lg bg-accent text-[#001B3A] font-bold text-xs uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shrink-0" />
                    </div>

                    {/* 1. ¿Qué son las cookies? */}
                    <section className="bg-white/5 p-5 sm:p-6 rounded-xl border border-white/10 space-y-3">
                        <h2 className="text-lg sm:text-xl font-display text-white font-semibold flex items-center gap-2">
                            <Info className="w-5 h-5 text-accent" />
                            {isEu ? '1. Zer dira cookieak eta antzeko teknologiak?' :
                             isEn ? '1. What are cookies and similar technologies?' :
                             isFr ? '1. Que sont les cookies et technologies similaires ?' :
                             '1. ¿Qué son las cookies y tecnologías similares?'}
                        </h2>
                        <p className="text-white/75 leading-relaxed">
                            {isEu ?
                             'Cookieak erabiltzailearen gailuan deskargatzen diren fitxategi txikiak dira, webguneak behar bezala funtziona dezan edo nabigazio-aukerak gogoratzeko. Halaber, tokiko biltegiratzea (localStorage) eta telemetria-neurketak erabil daitezke esperientzia hobetzeko.' :
                             isEn ?
                             'Cookies are small text files downloaded to your device to ensure websites function securely and properly, remember user choices, or measure traffic. We may also use localStorage or privacy-respecting client telemetry to optimize platform performance.' :
                             isFr ?
                             'Les cookies sont de petits fichiers stockés sur votre terminal permettant au site de fonctionner efficacement et de mémoriser vos préférences. Nous utilisons également le stockage local et la télémétrie pour mesurer les performances.' :
                             'Las cookies son pequeños archivos de texto que los sitios web descargan en tu navegador o dispositivo para garantizar un funcionamiento seguro, recordar tus sesiones e idioma, o medir el rendimiento de la plataforma. También se consideran tecnologías similares el almacenamiento local del navegador (localStorage) y las balizas o telemetría en cliente.'}
                        </p>
                        <p className="text-white/75 leading-relaxed">
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
                    <section className="bg-white/5 p-5 sm:p-6 rounded-xl border border-white/10 space-y-4">
                        <h2 className="text-lg sm:text-xl font-display text-white font-semibold">
                            {isEu ? '2. Erabilitako cookie motak' :
                             isEn ? '2. Cookie categories used on this platform' :
                             isFr ? '2. Catégories de cookies utilisées' :
                             '2. Categorías de cookies utilizadas en este sitio web'}
                        </h2>
                        
                        <div className="space-y-3">
                            <div className="border-l-2 border-emerald-400 pl-4 py-1">
                                <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    {isEu ? 'Cookie Teknikoak eta Derrigorrezkoak (Salbuetsiak)' :
                                     isEn ? 'Technical & Strictly Necessary Cookies (Exempt)' :
                                     isFr ? 'Cookies Techniques et Strictement Nécessaires (Exemptés)' :
                                     'Cookies Técnicas y Estrictamente Necesarias (Exentas)'}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/70 mt-1">
                                    {isEu ?
                                     'Webgunearen oinarrizko komunikazioa eta segurtasuna ahalbidetzen dituzte (saioak, Supabase bidezko autentifikazioa eta hizkuntza hautaketa). LSSI-CE 22.2 artikuluaren arabera baimenetik salbuetsita daude.' :
                                     isEn ?
                                     'Essential for site security, user authentication with Supabase, CSRF protection, and language memory. Exempt from consent under Art. 22.2 LSSI-CE.' :
                                     isFr ?
                                     'Indispensables à la sécurité, à l\'authentification avec Supabase et à la langue. Exemptés de consentement selon l\'article 22.2 LSSI-CE.' :
                                     'Permiten la navegación segura, la autenticación de alumnos y profesores a través de Supabase, la gestión de sesiones seguras y el mantenimiento del idioma elegido. Están exentas de la obligación de consentimiento según el artículo 22.2 de la LSSI-CE.'}
                                </p>
                            </div>

                            <div className="border-l-2 border-accent pl-4 py-1">
                                <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-accent" />
                                    {isEu ? 'Analisi eta Errendimendu Cookieak (Baimenaren menpe)' :
                                     isEn ? 'Analytics & Performance Telemetry (Subject to Consent)' :
                                     isFr ? 'Cookies d\'Analyse et de Performance (Soumis à Consentement)' :
                                     'Cookies y Telemetría de Análisis y Rendimiento (Sujetas a Consentimiento)'}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/70 mt-1">
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
                    <section className="bg-white/5 p-5 sm:p-6 rounded-xl border border-white/10 space-y-4">
                        <h2 className="text-lg sm:text-xl font-display text-white font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" />
                            {isEu ? '3. Egiaztatutako cookien inbentario xehatua' :
                             isEn ? '3. Verified Cookie & Storage Inventory' :
                             isFr ? '3. Inventaire vérifié des cookies et stockage' :
                             '3. Inventario detallado y verificado de cookies y almacenamiento'}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/70">
                            {isEu ?
                             'Hemen Getxo Bela Eskolak benetan erabiltzen dituen tresnak zerrendatzen dira. Ez dugu Google Ads, Facebook Pixel edo publizitate jarraitzailerik erabiltzen.' :
                             isEn ?
                             'Here is the verified list of cookies and storage keys actually present. We do not use Google Ads, Facebook Pixel, or third-party marketing trackers.' :
                             isFr ?
                             'Voici la liste vérifiée des cookies et clés de stockage actifs. Nous n\'utilisons aucun traceur publicitaire ou pixel tiers.' :
                             'A continuación se detallan las cookies y tecnologías que realmente se ejecutan en este sitio web. No se utiliza Google Ads, Facebook Pixel ni redes publicitarias invasivas.'}
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/20 text-accent font-semibold">
                                        <th className="py-2.5 px-3">Identificador</th>
                                        <th className="py-2.5 px-3">Titular</th>
                                        <th className="py-2.5 px-3">Categoría</th>
                                        <th className="py-2.5 px-3">Finalidad</th>
                                        <th className="py-2.5 px-3">Duración</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 text-white/80">
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">gbe_cookie_consent_v1</td>
                                        <td className="py-2.5 px-3">Propia</td>
                                        <td className="py-2.5 px-3 text-emerald-400 font-medium">Técnica (Storage)</td>
                                        <td className="py-2.5 px-3">Guarda la elección de cookies del usuario y la fecha de consentimiento.</td>
                                        <td className="py-2.5 px-3">12 meses</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">sb-*-auth-token</td>
                                        <td className="py-2.5 px-3">Supabase Inc. / Propia</td>
                                        <td className="py-2.5 px-3 text-emerald-400 font-medium">Técnica (Esencial)</td>
                                        <td className="py-2.5 px-3">Mantiene la sesión autenticada del alumno, instructor o administrador.</td>
                                        <td className="py-2.5 px-3">Persistente (Sesión activa)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">sb-redirect-to</td>
                                        <td className="py-2.5 px-3">Propia</td>
                                        <td className="py-2.5 px-3 text-emerald-400 font-medium">Técnica</td>
                                        <td className="py-2.5 px-3">Guarda la ruta de retorno temporal tras completar inicio de sesión con Google.</td>
                                        <td className="py-2.5 px-3">5 minutos</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">NEXT_LOCALE</td>
                                        <td className="py-2.5 px-3">Propia</td>
                                        <td className="py-2.5 px-3 text-emerald-400 font-medium">Técnica</td>
                                        <td className="py-2.5 px-3">Recuerda la preferencia de idioma del usuario (es, eu, en, fr).</td>
                                        <td className="py-2.5 px-3">Sesión / 1 año</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">@vercel/analytics</td>
                                        <td className="py-2.5 px-3">Vercel Inc. (EE.UU. / UE)</td>
                                        <td className="py-2.5 px-3 text-accent font-medium">Analítica (Consentimiento)</td>
                                        <td className="py-2.5 px-3">Telemetría de visitas sin recopilar identificadores personales invasivos. Solo se carga con autorización previa.</td>
                                        <td className="py-2.5 px-3">Sesión de navegación</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-mono text-xs text-white">@vercel/speed-insights</td>
                                        <td className="py-2.5 px-3">Vercel Inc.</td>
                                        <td className="py-2.5 px-3 text-accent font-medium">Rendimiento (Consentimiento)</td>
                                        <td className="py-2.5 px-3">Supervisión de Core Web Vitals en cliente para optimizar la velocidad. Solo se carga con autorización previa.</td>
                                        <td className="py-2.5 px-3">Sesión de navegación</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. Proveedores y transferencias */}
                    <section className="bg-white/5 p-5 sm:p-6 rounded-xl border border-white/10 space-y-3">
                        <h2 className="text-lg sm:text-xl font-display text-white font-semibold">
                            {isEu ? '4. Hirugarren hornitzaileak eta datu-lagapenak' :
                             isEn ? '4. Third-Party Providers & Data Processing' :
                             isFr ? '4. Fournisseurs tiers et transferts' :
                             '4. Proveedores externos y transferencias internacionales'}
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/75 text-xs sm:text-sm">
                            <li>
                                <strong>Supabase Inc.:</strong> Proveedor de base de datos y autenticación de usuarios. Servidores alojados en la Unión Europea (Frankfurt / AWS eu-central-1).
                            </li>
                            <li>
                                <strong>Vercel Inc.:</strong> Proveedor de alojamiento web perimetral, analítica y métricas de rendimiento. Cumple con el marco de privacidad de datos UE-EE.UU. (Data Privacy Framework).
                            </li>
                        </ul>
                    </section>

                    {/* 5. Cómo desactivar cookies en el navegador */}
                    <section className="bg-white/5 p-5 sm:p-6 rounded-xl border border-white/10 space-y-3">
                        <h2 className="text-lg sm:text-xl font-display text-white font-semibold">
                            {isEu ? '5. Nabigatzailetik nola kontrolatu edo ezabatu cookieak' :
                             isEn ? '5. How to control or delete cookies from your browser' :
                             isFr ? '5. Comment gérer les cookies depuis votre navigateur' :
                             '5. Cómo controlar o eliminar cookies desde tu navegador'}
                        </h2>
                        <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                            {isEu ?
                             'Gure webguneko konfigurazio-panela erabiltzeaz gain, zure nabigatzailearen ezarpenetatik deskargatutako cookie guztiak ezabatu edo blokeatu ditzakezu:' :
                             isEn ?
                             'In addition to our on-site settings panel, you can block or remove cookies directly in your browser preferences:' :
                             isFr ?
                             'En plus de notre panneau de préférences, vous pouvez supprimer ou bloquer les cookies directement dans votre navigateur :' :
                             'Además de nuestro panel interactivo de preferencias, puedes configurar tu navegador para rechazar o eliminar cookies en cualquier momento:'}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 text-xs">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors">
                                Chrome <ExternalLink className="w-3 h-3" />
                            </a>
                            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors">
                                Firefox <ExternalLink className="w-3 h-3" />
                            </a>
                            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors">
                                Safari <ExternalLink className="w-3 h-3" />
                            </a>
                            <a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors">
                                Edge <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
