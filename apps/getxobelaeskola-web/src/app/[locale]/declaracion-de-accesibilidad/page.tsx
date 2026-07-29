import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    let title = 'Declaración de Accesibilidad | Getxo Bela Eskola';
    let description = 'Declaración de accesibilidad web de Getxo Bela Eskola de conformidad con la normativa del Kit Digital y el RD 1112/2018.';

    if (isEu) {
        title = 'Irisgarritasun Adierazpena | Getxo Bela Eskola';
        description = 'Getxo Bela Eskolako web irisgarritasun adierazpena Digital Kit-aren eta RD 1112/2018 araudiaren arabera.';
    } else if (isEn) {
        title = 'Accessibility Statement | Getxo Bela Eskola';
        description = 'Accessibility statement for Getxo Bela Eskola website according to Kit Digital requirements and RD 1112/2018.';
    } else if (isFr) {
        title = 'Déclaration d\'Accessibilité | Getxo Bela Eskola';
        description = 'Déclaration d\'accessibilité du site web de Getxo Bela Eskola conformément au Kit Digital et au RD 1112/2018.';
    }

    return { title, description };
}

export default async function DeclaracionAccesibilidadPage({ params: { locale } }: { params: { locale: string } }) {
    const isEu = locale === 'eu';

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 md:px-8 relative bg-white text-black">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div className="container mx-auto max-w-4xl">
                <header className="mb-8 md:mb-12">
                    <span className="text-accent uppercase tracking-[0.3em] sm:tracking-[0.6em] text-xs sm:text-sm font-bold mb-3 sm:mb-4 block">
                        Getxo Bela Eskola
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-black mb-6 italic font-bold">
                        {isEu ? 'Irisgarritasun Adierazpena' : 'Declaración de Accesibilidad'}
                    </h1>
                    <div className="w-24 h-px bg-accent/40 mb-8" />
                </header>

                <div className="space-y-8 md:space-y-10 text-black/90 font-normal leading-relaxed text-sm sm:text-base md:text-lg">
                    <section className="bg-slate-50 p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm">
                        <p className="text-black leading-relaxed">
                            {isEu
                                ? 'Getxo Bela Eskola (getxobelaeskola.com) bere webgunea irisgarri egiteko konpromisoa hartu du, 1112/2018 Errege Dekretuaren arabera, sektore publikoko webguneen eta gailu mugikorretarako aplikazioen irisgarritasunari buruzkoa, eta Kit Digitalaren baldintzak betez.'
                                : 'Getxo Bela Eskola (getxobelaeskola.com) se ha comprometido a hacer accesible su sitio web de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público, así como con los requerimientos del programa Kit Digital.'}
                        </p>
                    </section>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-black font-bold mb-3 sm:mb-4">
                            {isEu ? '1. Betetze egoera' : '1. Situación de cumplimiento'}
                        </h2>
                        <p className="text-black/90">
                            {isEu
                                ? 'Webgune hau WCAG 2.1 AA mailarekin partially compliant (partzialki ados) dago, jarraian zerrendatzen diren desbideratzeen ondorioz.'
                                : 'Este sitio web es parcialmente conforme con el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG 2.1) debido a las excepciones y a la falta de conformidad de los aspectos detallados a continuación.'}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-black font-bold mb-3 sm:mb-4">
                            {isEu ? '2. Irisgarria ez den edukia' : '2. Contenido no accesible'}
                        </h2>
                        <p className="text-black/90">
                            {isEu
                                ? 'Beheko edukiak ez daude irisgarri arrazoi hauengatik:'
                                : 'El contenido que se recoge a continuación puede no ser totalmente accesible por los siguientes motivos:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-black/90">
                            <li>
                                {isEu
                                    ? 'Errege Dekretuaren 1112/2018 araudiaren araberako salbuespen teknikoak edo hirugarrenen plataformetako osagai batzuk.'
                                    : 'Falta de conformidad con el RD 1112/2018 en algunos elementos de plataformas o widgets de terceros integrados.'}
                            </li>
                            <li>
                                {isEu
                                    ? 'Karga neurrigabea izatea irisgarritasuna lortzeko kode zaharren batzuetan.'
                                    : 'Carga desproporcionada en algunos documentos PDF o archivos descargables antiguos.'}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-black font-bold mb-3 sm:mb-4">
                            {isEu ? '3. Irisgarritasun tresna' : '3. Herramienta de Accesibilidad'}
                        </h2>
                        <p className="text-black/90">
                            {isEu
                                ? 'Webgune honek EqualWeb irisgarritasun-botoia integratuta dauka. Pantailaren beheko ezkerraldean dagoen ikono urdinaren bidez kontrastea, letra-tamaina, irakurlea eta bestelako laguntza-tresnak konfigura ditzakezu.'
                                : 'Este sitio web dispone del widget de accesibilidad EqualWeb integrado. A través del icono flotante accesible en la esquina inferior izquierda, los usuarios pueden adaptar el contraste, tamaño de tipografía, lectura asistida y otras funciones personalizadas.'}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-black font-bold mb-3 sm:mb-4">
                            {isEu ? '4. Komunikazioa eta harremanetarako datuak' : '4. Observaciones y datos de contacto'}
                        </h2>
                        <p className="text-black/90">
                            {isEu
                                ? 'Irisgarritasun-baldintzei buruzko komunikazioak egiteko (adibidez: jakinarazpenak, salaketak edo informazioa eskatzeko) bide honetatik egin dezakezu:'
                                : 'Puedes realizar comunicaciones sobre requisitos de accesibilidad (incidencias, informar de posibles incumplimientos o solicitar información) a través de:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-black/90">
                            <li>
                                <strong>Email:</strong> <a href="mailto:info@getxobelaeskola.com" className="text-accent hover:underline font-medium">info@getxobelaeskola.com</a>
                            </li>
                            <li>
                                <strong>{isEu ? 'Helbidea:' : 'Dirección:'}</strong> Muelle Arriluzea s/n, 48990 Getxo, Vizcaya
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-black font-bold mb-3 sm:mb-4">
                            {isEu ? '5. Adierazpen honen prestakuntza' : '5. Preparación de la presente declaración de accesibilidad'}
                        </h2>
                        <p className="text-black/90">
                            {isEu
                                ? 'Adierazpen hau 2026ko uztailaren 21ean prestatu zen. Ebaluazio-metodoa erakundeak berak egindako autoebaluazioa eta EqualWeb irisgarritasun-sistema erabiliz egin da.'
                                : 'La presente declaración fue preparada el 21 de julio de 2026. El método empleado para preparar la declaración ha sido una autoevaluación realizada por la propia entidad junto con las auditorías automáticas de la herramienta EqualWeb.'}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
