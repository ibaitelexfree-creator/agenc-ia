import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const titles: Record<string, string> = {
        es: 'Aviso Legal | Getxo Bela Eskola',
        eu: 'Lege Oharra | Getxo Bela Eskola',
        en: 'Legal Notice | Getxo Bela Eskola',
        fr: 'Mentions Légales | Getxo Bela Eskola'
    };

    const descriptions: Record<string, string> = {
        es: 'Información legal y datos identificativos del titular de Getxo Bela Eskola (Asociación club deportivo vela Pakea munduari itzulia) conforme a la LSSI-CE.',
        eu: 'Getxo Bela Eskolaren titularraren legezko informazioa eta identifikazio-datuak (Asociación club deportivo vela Pakea munduari itzulia).',
        en: 'Legal notice and identification details of Getxo Bela Eskola owner in compliance with LSSI-CE.',
        fr: 'Mentions légales et informations d\'identification du propriétaire de Getxo Bela Eskola conformément à la LSSI-CE.'
    };

    return {
        title: titles[locale] || titles.es,
        description: descriptions[locale] || descriptions.es
    };
}

export default async function LegalNoticePage({ params: { locale } }: { params: { locale: string } }) {
    const isEu = locale === 'eu';
    const isEn = locale === 'en';
    const isFr = locale === 'fr';

    return (
        <main className="min-h-screen bg-white text-black pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-8 md:mb-10">
                    <span className="text-red-600 uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.5em] text-xs sm:text-sm md:text-base font-bold mb-3 block break-words">
                        Getxo Bela Eskola
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-black mb-6 italic leading-tight break-words">
                        {isEu ? 'Lege Oharra' : isEn ? 'Legal Notice' : isFr ? 'Mentions Légales' : 'Aviso Legal'}
                    </h1>
                    <div className="w-24 h-px bg-red-600/40" />
                </header>

                <div className="space-y-6 sm:space-y-8 text-base md:text-lg leading-relaxed text-black">
                    <p className="text-gray-800 leading-relaxed">
                        {isEu ? (
                            'Informazio Gizartearen Zerbitzuen eta Merkataritza Elektronikoaren uztailaren 11ko 34/2002 Legearen (LSSI-CE) 10. artikuluan ezarritako informazio-betebeharra betez, webgune honen titularraren identifikazio-datuak jarraian zehazten dira.'
                        ) : isEn ? (
                            'In compliance with article 10 of Law 34/2002 of July 11 on Information Society Services and Electronic Commerce (LSSI-CE), the identifying data of the owner of this website is detailed below.'
                        ) : isFr ? (
                            'Conformément à l\'article 10 de la loi 34/2002 du 11 juillet sur les services de la société de l\'information et le commerce électronique (LSSI-CE), les données d\'identification du propriétaire de ce site web sont présentées ci-dessous.'
                        ) : (
                            'En cumplimiento del deber de información estipulado en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan a continuación los datos identificativos del titular de este sitio web.'
                        )}
                    </p>

                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-4">
                            {isEu ? '1. Erakunde Titularraren Identifikazio Datuak' : isEn ? '1. Identifying Details of the Entity' : isFr ? '1. Données d\'identification de l\'entité' : '1. Datos Identificativos del Titular'}
                        </h2>
                        
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm sm:text-base">
                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'Sozietatearen izena' : isEn ? 'Corporate / Legal Name' : isFr ? 'Raison sociale' : 'Razón Social'}
                                </dt>
                                <dd className="text-black font-bold text-base mt-0.5">
                                    Asociación club deportivo vela Pakea munduari itzulia
                                </dd>
                            </div>

                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'Izen komertziala' : isEn ? 'Commercial Name' : isFr ? 'Nom commercial' : 'Nombre Comercial'}
                                </dt>
                                <dd className="text-black font-bold text-base mt-0.5">
                                    Getxo Bela Eskola
                                </dd>
                            </div>

                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'IFZ / CIF' : isEn ? 'Tax ID (CIF/NIF)' : isFr ? 'Numéro d\'identification fiscale (CIF)' : 'NIF / CIF'}
                                </dt>
                                <dd className="text-black font-bold text-base mt-0.5">
                                    G95526299
                                </dd>
                            </div>

                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'Egoitza soziala / Helbidea' : isEn ? 'Registered Office / Address' : isFr ? 'Siège social / Adresse' : 'Domicilio Social'}
                                </dt>
                                <dd className="text-black font-semibold text-base mt-0.5">
                                    Marqués de Arriluce e Ibarra Kalea, 3D, 48992 Getxo, Bizkaia (España)
                                </dd>
                            </div>

                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'Telefonoa' : isEn ? 'Phone' : isFr ? 'Téléphone' : 'Teléfono de Contacto'}
                                </dt>
                                <dd className="text-black font-semibold text-base mt-0.5">
                                    <a href="tel:+34944916632" className="text-red-600 hover:underline font-bold">94 491 66 32</a>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    WhatsApp
                                </dt>
                                <dd className="text-black font-semibold text-base mt-0.5">
                                    <a href="https://wa.me/34634405624" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-bold">634 405 624</a>
                                </dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    {isEu ? 'Helbide elektronikoa' : isEn ? 'Email Address' : isFr ? 'Courriel' : 'Correo Electrónico'}
                                </dt>
                                <dd className="text-black font-semibold text-base mt-0.5">
                                    <a href="mailto:info@getxobelaeskola.com" className="text-red-600 hover:underline font-bold">info@getxobelaeskola.com</a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-3">
                            {isEu ? '2. Webgunearen Xedea' : isEn ? '2. Purpose of the Website' : isFr ? '2. Objet du site' : '2. Objeto del Sitio Web'}
                        </h2>
                        <p className="text-black">
                            {isEu ? (
                                'Webgune honen helburua Getxo Bela Eskolak (Asociación club deportivo vela Pakea munduari itzulia) eskaintzen dituen bela-ikastaroak, nabigazio-esperientziak, prestakuntza nautikoa eta zerbitzuak ezagutaraztea eta kudeatzea da.'
                            ) : isEn ? (
                                'The purpose of this website is to provide information and manage sailing courses, nautical experiences, training and services offered by Getxo Bela Eskola (Asociación club deportivo vela Pakea munduari itzulia).'
                            ) : isFr ? (
                                'L\'objet de ce site web est de faire connaître et de gérer les cours de voile, les expériences nautiques, la formation et les services proposés par Getxo Bela Eskola (Asociación club deportivo vela Pakea munduari itzulia).'
                            ) : (
                                'El presente sitio web tiene por objeto dar a conocer y facilitar al público la información sobre los cursos de vela, actividades náuticas, experiencias, formación y servicios ofrecidos por Getxo Bela Eskola (Asociación club deportivo vela Pakea munduari itzulia).'
                            )}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-3">
                            {isEu ? '3. Jabetza Intelektuala eta Industriala' : isEn ? '3. Intellectual and Industrial Property' : isFr ? '3. Propriété intellectuelle' : '3. Propiedad Intelectual e Industrial'}
                        </h2>
                        <p className="text-black">
                            {isEu ? (
                                'Webgune honetako eduki guztiak (testuak, irudiak, diseinu grafikoak, iturburu-kodea, logotipoak, etab.) titularraren edo baimendutako hirugarrenen jabetzakoak dira, eta jabetza intelektual eta industrialaren legeek babestuta daude.'
                            ) : isEn ? (
                                'All contents on this website (texts, images, trademarks, logos, source code, etc.) are the property of the entity or authorized third parties and are protected by applicable intellectual and industrial property regulations.'
                            ) : isFr ? (
                                'Tous les contenus de ce site web (textes, images, marques, logos, code source, etc.) sont la propriété du titulaire ou de tiers autorisés et sont protégés par la législation applicable.'
                            ) : (
                                'Todos los contenidos de este sitio web (textos, imágenes, marcas, logotipos, códigos fuente, diseño gráfico y estructura de navegación) son titularidad de la Asociación club deportivo vela Pakea munduari itzulia o de terceros que han autorizado su uso, encontrándose protegidos por la legislación vigente en materia de propiedad intelectual e industrial.'
                            )}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-3">
                            {isEu ? '4. Erantzukizunaren Mugatzea' : isEn ? '4. Limitation of Liability' : isFr ? '4. Limitation de responsabilité' : '4. Exclusión de Responsabilidad'}
                        </h2>
                        <p className="text-black">
                            {isEu ? (
                                'Titularrak ez du bere gain hartzen webguneko edukien balizko akatsengatik edo etenengatik sor daitezkeen kalteen erantzukizuna, ezta kanpoko esteken bidez eskaintzen diren edukien gaineko erantzukizuna ere.'
                            ) : isEn ? (
                                'The owner does not accept liability for potential temporary interruptions, errors or external links included on the website for informational purposes.'
                            ) : isFr ? (
                                'Le propriétaire décline toute responsabilité pour les éventuelles erreurs ou interruptions temporaires du service ainsi que pour le contenu des liens externes.'
                            ) : (
                                'El titular no se hace responsable de los daños o perjuicios que pudieran derivarse de interferencias, omisiones, interrupciones, virus informáticos o desconexiones en el funcionamiento operativo de este sistema electrónico, ni del contenido o exactitud de los enlaces a terceros que puedan incluirse a título informativo.'
                            )}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-black mb-3">
                            {isEu ? '5. Legedi Aplikagarria eta Jurisdikzioa' : isEn ? '5. Applicable Law and Jurisdiction' : isFr ? '5. Droit applicable' : '5. Legislación Aplicable y Jurisdicción'}
                        </h2>
                        <p className="text-black">
                            {isEu ? (
                                'Erabiltzailearen eta titularraren arteko harremanak Espainiako indarreko araudiari lotuta egongo dira, eta edozein auzi Getxoko eta Bilboko epaitegi eta auzitegien esku utziko da.'
                            ) : isEn ? (
                                'Relations between the user and the owner will be governed by current Spanish legislation, submitting to the jurisdiction of the Courts and Tribunals of Bilbao/Getxo (Biscay).'
                            ) : isFr ? (
                                'Les relations entre l\'utilisateur et le propriétaire sont régies par la législation espagnole en vigueur, sous la juridiction des tribunaux compétents de Biscaye.'
                            ) : (
                                'Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española vigente, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados los Juzgados y Tribunales de Bilbao / Getxo (Bizkaia).'
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
