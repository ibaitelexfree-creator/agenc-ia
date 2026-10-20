import React from 'react';
import { Metadata } from 'next';

type SupportedLocale = 'es' | 'eu' | 'en' | 'fr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> | { locale: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale as SupportedLocale) || 'es';

  const titles: Record<SupportedLocale, string> = {
    es: 'Declaración de Accesibilidad | Getxo Bela Eskola',
    eu: 'Irisgarritasun Adierazpena | Getxo Bela Eskola',
    en: 'Accessibility Statement | Getxo Bela Eskola',
    fr: 'Déclaration d\'Accessibilité | Getxo Bela Eskola',
  };

  const descriptions: Record<SupportedLocale, string> = {
    es: 'Declaración de accesibilidad del sitio web de Getxo Bela Eskola de conformidad con el RD 1112/2018.',
    eu: 'Getxo Bela Eskolaren webgunearen irisgarritasun adierazpena, 1112/2018 Errege Dekretuaren arabera.',
    en: 'Accessibility statement of Getxo Bela Eskola website in accordance with Royal Decree 1112/2018.',
    fr: 'Déclaration d\'accessibilité du site web Getxo Bela Eskola conformément au décret royal 1112/2018.',
  };

  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
  };
}

const contentByLocale = {
  es: {
    title: 'Declaración de Accesibilidad',
    intro1: 'La entidad ',
    entity: 'Club Deportivo Pakea Munduari Itzulia',
    intro2: ' se ha comprometido a hacer accesible su sitio web de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público.',
    appliesTo: 'La presente declaración de accesibilidad se aplica al sitio web ',
    complianceTitle: 'Situación de cumplimiento',
    complianceText1: 'Este sitio web es ',
    complianceStatus: 'parcialmente conforme',
    complianceText2: ' con el RD 1112/2018 debido a las excepciones y a la falta de conformidad de los aspectos que se indican a continuación.',
    nonAccessibleTitle: 'Contenido no accesible',
    nonAccessibleIntro: 'El contenido que se recoge a continuación no es accesible por lo siguiente:',
    section1Title: '1. Falta de conformidad con el RD 1112/2018',
    issues: [
      'Existen logotipos e imágenes con texto alternativo incorrecto o confuso e imágenes complejas sin descripción textual [requisito número 9.1.1.1 Contenido no textual, de UNE-EN 301549:2022].',
      'Existen listas creadas de forma incorrecta (sin etiqueta de lista), tablas con celdas etiquetadas incorrectamente y etiquetas invisibles en elementos de formularios [requisito número 9.1.3.1 Información y relaciones, de UNE-EN 301549:2022].',
      'Existen tablas no adaptadas a tamaños de pantalla pequeños y campos de formulario que no se visualizan correctamente en tamaños de pantalla pequeños [requisito número 9.1.4.10 Reajuste de texto, de UNE-EN 301549:2022].',
      'Existe texto que al cambiar los espacios y alturas de línea no se visualiza correctamente [requisito número 9.1.4.12 Espaciado de texto, de UNE-EN 301549:2022].',
      'Existen elementos que no son accesibles por teclado, como por ejemplo enlaces a redes sociales, el editor de textos para comentarios, elementos para ordenar resultados de búsqueda, la paginación de los resultados de búsqueda o las flechas de calendario [requisito número 9.2.1.1 Teclado, de UNE-EN 301549:2022].',
      'Hay elementos que no reciben el foco y por tanto no se puede interactuar con ellos mediante el teclado [requisito número 9.2.4.3 Orden del foco, de UNE-EN 301549:2022].',
      'Hay enlaces en los que no se identifica correctamente su función (tienen una descripción inadecuada, un texto demasiado genérico, un title inadecuado…) [requisito número 9.2.4.4 Propósito de los enlaces, de UNE-EN 301549:2022].',
      'Hay encabezados con texto repetido y/o poco descriptivo [requisito número 9.2.4.6 Encabezados y etiquetas, de UNE-EN 301549:2022].',
      'Existen imágenes, infografías, textos de enlaces o botones, texto de titulares y contenido que no están traducidos a otros idiomas [requisito número 9.3.1.2 Idioma de las partes, de UNE-EN 301549:2022].',
      'En alguna página se está usando el mismo icono para diferentes propósitos, lo cual genera confusión [requisito número 9.3.2.4 Identificación coherente, de UNE-EN 301549:2022].',
      'Existen mensajes de error poco descriptivos, o mensajes de error que no están agrupados en un único mensaje así como falta de sugerencias en formulario para rellenar los campos correctamente [requisito número 9.3.3.1 Identificación de errores, de UNE-EN 301549:2022].',
      'Existen formularios con campos obligatorios donde no se informa al usuario de ello, así como campos donde falta un ejemplo textual del formato del campo [requisito número 9.3.3.2 Etiquetas e instrucciones, de UNE-EN 301549:2022].',
      'Existen campos de formularios donde se informa del error cuando se introduce un valor incorrecto pero no se informa de una sugerencia para su corrección [requisito número 9.3.3.3 Sugerencias ante errores, de UNE-EN 301549:2022].',
      'Existen páginas con errores de sintaxis y por tanto algún producto de apoyo puede no interpretar correctamente el contenido (IDs de página duplicados, etiquetas sin cerrar, construcción incorrecta de etiquetas…) [requisito número 9.4.1.1 Procesamiento, de UNE-EN 301549:2022].',
      'Existen páginas en las que los productos de apoyo no van a poder obtener información, interactuar y estar al corriente del estado de los controles de interfaz de usuario que no podrán ser leídos por lectores de pantalla en el momento en el que aparecen [requisito número 9.4.1.2 Nombre, función, valor de UNE-EN 301549:2022].',
      'Podrían existir fallos puntuales de edición en alguna página web.'
    ],
    section2Title: '2. Carga desproporcionada',
    section2Text: 'No aplica.',
    section3Title: '3. El contenido no entra dentro del ámbito de la legislación aplicable',
    section3Text: 'Podrían existir archivos ofimáticos en PDF u otros formatos publicados antes del 20 de septiembre de 2018 que no cumplan en su totalidad todos los requisitos de accesibilidad. Aunque se ha procurado que la mayoría de ellos sí lo cumplan.',
    prepTitle: 'Preparación de la presente declaración de accesibilidad',
    prepDate: 'La presente declaración fue preparada el 29/07/2026.',
    prepMethod: 'El método empleado para preparar la declaración ha sido una autoevaluación llevada a cabo por la propia entidad.',
    prepReview: 'Última revisión de la declaración: 29/07/2026.',
    contactTitle: 'Observaciones y datos de contacto',
    contactIntro: 'Puede realizar comunicaciones sobre requisitos de accesibilidad (artículo 10.2.a) del RD 1112/2018) como por ejemplo:',
    contactList: [
      'Informar sobre cualquier posible incumplimiento por parte de este sitio web.',
      'Transmitir otras dificultades de acceso al contenido.',
      'Formular cualquier otra consulta o sugerencia de mejora relativa a la accesibilidad del sitio web.'
    ],
    contactThrough: 'Puede hacerlo a través de nuestra página de ',
    contactLink: 'contacto',
    complaintIntro: 'Puede presentar una queja relativa al cumplimiento de los requisitos del RD 1112/2018 o una Solicitud de Información accesible relativa a:',
    complaintList: [
      'Contenidos que están excluidos del ámbito de aplicación del RD 1112/2018 según lo establecido por el artículo 3, apartado 4.',
      'Contenidos que están exentos del cumplimiento de los requisitos de accesibilidad por imponer una carga desproporcionada.'
    ],
    complaintOutro: 'En la Solicitud de información accesible, se debe concretar, con toda claridad, los hechos, razones y petición que permitan constatar que se trata de una solicitud razonable y legítima.',
    optionalTitle: 'Contenido opcional',
    optionalP1: 'Este sitio web aplica los requisitos de la Norma UNE-EN 301549:2022 considerando las excepciones del RD 1112/2018.',
    optionalP2: 'La última revisión de la accesibilidad se ha realizado el 29/07/2026.',
    optionalP3: 'El sitio web está optimizado para los navegadores actuales (las últimas versiones vigentes de FireFox, Safari, Opera, Edge y Google Chrome). La resolución web mínima recomendada es de 1280×1024.',
    optionalP4: 'El sitio web está diseñado para su visualización Responsive, con lo que se visualiza de forma óptima en dispositivos tablet y móviles. En estos dispositivos está optimizado para su visualización en las últimas versiones vigentes de Chrome for mobile, Firefox for mobile, Safari mobile, y navegadores nativos.'
  },
  eu: {
    title: 'Irisgarritasun Adierazpena',
    intro1: '',
    entity: 'Club Deportivo Pakea Munduari Itzulia',
    intro2: ' erakundeak bere webgunea eskuragarri egiteko konpromisoa hartu du, sektore publikoko webguneen eta gailu mugikorretarako aplikazioen irisgarritasunari buruzko irailaren 7ko 1112/2018 Errege Dekretuarekin bat etorriz.',
    appliesTo: 'Irisgarritasun-adierazpen hau webgune honi aplikatzen zaio: ',
    complianceTitle: 'Betetze egoera',
    complianceText1: 'Webgune hau ',
    complianceStatus: 'partzialki ados dago',
    complianceText2: ' 1112/2018 EDarekin, jarraian adierazten diren salbuespenen eta adostasun ezaren ondorioz.',
    nonAccessibleTitle: 'Eskuraezina den edukia',
    nonAccessibleIntro: 'Jarraian jasotzen den edukia ez da irisgarria honako arrazoiengatik:',
    section1Title: '1. 1112/2018 EDarekiko adostasun falta',
    issues: [
      'Ordezko testu okerra edo nahasgarria duten logotipoak eta irudiak daude, bai eta testu bidezko deskribapenik gabeko irudi konplexuak ere [UNE-EN 301549:2022 arauko 9.1.1.1 Testuzkoa ez den edukia baldintza].',
      'Gaizki sortutako zerrendak daude (zerrenda-etiketarik gabe), oker etiketatutako gelaxkak dituzten taulak eta inprimaki-elementuetan etiketa ikusezinak daude [UNE-EN 301549:2022 arauko 9.1.3.1 Informazioa eta harremanak baldintza].',
      'Pantaila txikietara egokitu gabeko taulak daude, bai eta pantaila txikietan behar bezala bistaratzen ez diren inprimaki-eremuak ere [UNE-EN 301549:2022 arauko 9.1.4.10 Testua birdoitzea baldintza].',
      'Tarteak eta lerro-altuerak aldatzean behar bezala ikusten ez den testua dago [UNE-EN 301549:2022 arauko 9.1.4.12 Testu-tartea baldintza].',
      'Teklatu bidez eskuragarri ez dauden elementuak daude, hala nola sare sozialetarako estekak, iruzkinetarako testu-editorea, bilaketa-emaitzak ordenatzeko elementuak, bilaketa-emaitzen orrialdekatzea edo egutegi-geziak [UNE-EN 301549:2022 arauko 9.2.1.1 Teklatua baldintza].',
      'Fokua jasotzen ez duten elementuak daude, eta, beraz, ezin da haiekin elkar eragin teklatuaren bidez [UNE-EN 301549:2022 arauko 9.2.4.3 Foku-ordena baldintza].',
      'Esteka batzuetan haien funtzioa ez da behar bezala identifikatzen (deskribapen desegokia dute, testu orokorregia, title desegokia…) [UNE-EN 301549:2022 arauko 9.2.4.4 Esteken helburua baldintza].',
      'Testu errepikatua edota deskribapen eskasa duten goiburuak daude [UNE-EN 301549:2022 arauko 9.2.4.6 Goiburuak eta etiketak baldintza].',
      'Beste hizkuntza batzuetara itzuli gabe dauden irudiak, infografiak, esteka edo botoien testuak, titularren testuak eta edukiak daude [UNE-EN 301549:2022 arauko 9.3.1.2 Zatien hizkuntza baldintza].',
      'Orriren batean ikono bera erabiltzen ari da hainbat helburutarako, eta horrek nahasmena sortzen du [UNE-EN 301549:2022 arauko 9.3.2.4 Identifikazio koherentea baldintza].',
      'Deskribapen gutxiko errore-mezuak daude, edo mezu bakarrean taldekatuta ez dauden errore-mezuak, bai eta eremuak behar bezala betetzeko inprimakietan iradokizunik eza ere [UNE-EN 301549:2022 arauko 9.3.3.1 Erroreak identifikatzea baldintza].',
      'Bete beharreko eremuak dituzten inprimakiak daude, erabiltzaileari horren berri eman gabe, bai eta eremuaren formatuaren testu-adibiderik ez duten eremuak ere [UNE-EN 301549:2022 arauko 9.3.3.2 Etiketak eta argibideak baldintza].',
      'Balio oker bat sartzean errorearen berri ematen duten inprimaki-eremuak daude, baina hura zuzentzeko iradokizunik ematen ez dutenak [UNE-EN 301549:2022 arauko 9.3.3.3 Erroreen aurreko iradokizunak baldintza].',
      'Sintaxi-akatsak dituzten orriak daude, eta, beraz, laguntza-produkturen batek agian ez du edukia behar bezala interpretatuko (orri-ID bikoiztuak, itxi gabeko etiketak, etiketen eraikuntza okerra...) [UNE-EN 301549:2022 arauko 9.4.1.1 Prozesamendua baldintza].',
      'Laguntza-produktuek informazioa lortu, elkarreragin eta erabiltzaile-interfazearen kontrolen egoeraren jakinaren gainean egon ezin izango duten orriak daude, pantaila-irakurleek agertzen diren unean irakurri ezin izango dituztenak [UNE-EN 301549:2022 arauko 9.4.1.2 Izena, funtzioa, balioa baldintza].',
      'Noizbehinkako edizio-akatsetak egon litezke webguneren batean.'
    ],
    section2Title: '2. Neurrigabeko karga',
    section2Text: 'Ez da aplikagarria.',
    section3Title: '3. Edukia ez da sartzen aplikatu beharreko legeriaren eremuan',
    section3Text: '2018ko irailaren 20a baino lehen argitaratutako PDF edo bestelako formatuetako ofimatika-fitxategiak egon litezke, irisgarritasun-baldintza guztiak osorik betetzen ez dituztenak. Dena dela, gehienek bete ditzaten ahalegindu da.',
    prepTitle: 'Irisgarritasun-adierazpen hau prestatzea',
    prepDate: 'Adierazpen hau 2026/07/29an prestatu zen.',
    prepMethod: 'Adierazpena prestatzeko erabilitako metodoa erakundeak berak egindako autoebaluazioa izan da.',
    prepReview: 'Adierazpenaren azken berrikuspena: 2026/07/29.',
    contactTitle: 'Oharrak eta harremanetarako datuak',
    contactIntro: 'Irisgarritasun-baldintzei buruzko jakinarazpenak egin ditzakezu (1112/2018 EDren 10.2.a artikulua), adibidez:',
    contactList: [
      'Webgune honek izan dezakeen edozein ez-betetzeari buruz informatzea.',
      'Edukia eskuratzeko beste zailtasun batzuk helaraztea.',
      'Webgunearen irisgarritasunari buruzko beste edozein kontsulta edo hobekuntza-iradokizun egitea.'
    ],
    contactThrough: 'Gure harremanetarako orriaren bidez egin dezakezu: ',
    contactLink: 'harremanetarako orria',
    complaintIntro: '1112/2018 EDren baldintzak betetzeari buruzko kexa bat edo honako hauei buruzko informazio eskuragarriaren eskaera bat aurkez dezakezu:',
    complaintList: [
      '1112/2018 EDren aplikazio-eremutik kanpo dauden edukiak, 3. artikuluko 4. atalean ezarritakoaren arabera.',
      'Neurrigabeko karga bat ezartzeagatik irisgarritasun-baldintzak betetzetik salbuetsita dauden edukiak.'
    ],
    complaintOutro: 'Informazio irisgarriaren eskaeran, argi eta garbi zehaztu behar dira eskaera zentzuzkoa eta bidezkoa dela egiaztatzeko aukera ematen duten gertaerak, arrazoiak eta eskaera.',
    optionalTitle: 'Aukerako edukia',
    optionalP1: 'Webgune honek UNE-EN 301549:2022 Arauaren baldintzak aplikatzen ditu, 1112/2018 EDren salbuespenak kontuan hartuta.',
    optionalP2: 'Irisgarritasunaren azken berrikuspena 2026/07/29an egin da.',
    optionalP3: 'Webgunea egungo nabigatzaileentzat optimizatuta dago (FireFox, Safari, Opera, Edge eta Google Chrome-ren azken bertsio indarrekoak). Gomendatutako gutxieneko bereizmena 1280×1024 da.',
    optionalP4: 'Webgunea Responsive bistaratzera bideratuta dago, eta horri esker tablet eta mugikorretan modu ezin hobean ikusten da. Gailu hauetan Chrome for mobile, Firefox for mobile, Safari mobile eta nabigatzaile natiboen azken bertsioetarako optimizatuta dago.'
  },
  en: {
    title: 'Accessibility Statement',
    intro1: 'The entity ',
    entity: 'Club Deportivo Pakea Munduari Itzulia',
    intro2: ' has committed to making its website accessible in accordance with Royal Decree 1112/2018, of September 7, on the accessibility of public sector websites and mobile applications.',
    appliesTo: 'This accessibility statement applies to the website ',
    complianceTitle: 'Compliance Status',
    complianceText1: 'This website is ',
    complianceStatus: 'partially compliant',
    complianceText2: ' with RD 1112/2018 due to the exceptions and non-compliances listed below.',
    nonAccessibleTitle: 'Non-accessible Content',
    nonAccessibleIntro: 'The content listed below is not accessible for the following reasons:',
    section1Title: '1. Non-compliance with RD 1112/2018',
    issues: [
      'There are logos and images with incorrect or confusing alternative text, and complex images without text descriptions [requirement 9.1.1.1 Non-text Content, UNE-EN 301549:2022].',
      'There are incorrectly structured lists (without list tags), tables with mislabeled cells, and invisible labels on form elements [requirement 9.1.3.1 Info and Relationships, UNE-EN 301549:2022].',
      'There are tables not adapted to small screen sizes and form fields that do not display correctly on small screens [requirement 9.1.4.10 Reflow, UNE-EN 301549:2022].',
      'There is text that does not display properly when line height and letter/word spacing are adjusted [requirement 9.1.4.12 Text Spacing, UNE-EN 301549:2022].',
      'There are elements not accessible via keyboard, such as social network links, comment text editor, search result sorting elements, pagination, or calendar arrows [requirement 9.2.1.1 Keyboard, UNE-EN 301549:2022].',
      'There are elements that do not receive focus, preventing keyboard interaction [requirement 9.2.4.3 Focus Order, UNE-EN 301549:2022].',
      'There are links whose purpose is not properly identified (inadequate description, overly generic text, improper title attribute...) [requirement 9.2.4.4 Link Purpose, UNE-EN 301549:2022].',
      'There are headings with repeated or insufficiently descriptive text [requirement 9.2.4.6 Headings and Labels, UNE-EN 301549:2022].',
      'There are images, infographics, link/button texts, heading text, and contents not yet translated into other languages [requirement 9.3.1.2 Language of Parts, UNE-EN 301549:2022].',
      'The same icon is used on some pages for different purposes, causing potential confusion [requirement 9.3.2.4 Consistent Identification, UNE-EN 301549:2022].',
      'There are insufficiently descriptive error messages or errors not grouped together, as well as missing form suggestions for field completion [requirement 9.3.3.1 Error Identification, UNE-EN 301549:2022].',
      'There are forms with required fields where users are not properly informed, and fields lacking format examples [requirement 9.3.3.2 Labels or Instructions, UNE-EN 301549:2022].',
      'There are form fields where errors are noted upon invalid input but no suggestion for correction is provided [requirement 9.3.3.3 Error Suggestion, UNE-EN 301549:2022].',
      'There are pages with syntax errors where assistive technologies might fail to parse the content properly (duplicate IDs, unclosed tags, malformed markup...) [requirement 9.4.1.1 Parsing, UNE-EN 301549:2022].',
      'There are pages where assistive technologies cannot reliably determine name, role, or state changes of UI components in real time [requirement 9.4.1.2 Name, Role, Value, UNE-EN 301549:2022].',
      'Minor and occasional editing oversights may exist on certain pages.'
    ],
    section2Title: '2. Disproportionate Burden',
    section2Text: 'Not applicable.',
    section3Title: '3. Content Outside the Scope of Applicable Legislation',
    section3Text: 'There may be office file formats (such as PDF) published before September 20, 2018 that do not fully meet all accessibility requirements, although efforts have been made to ensure most comply.',
    prepTitle: 'Preparation of this Accessibility Statement',
    prepDate: 'This statement was prepared on July 29, 2026.',
    prepMethod: 'The method used to prepare the statement was a self-assessment carried out by the organization itself.',
    prepReview: 'Last review of the statement: July 29, 2026.',
    contactTitle: 'Feedback and Contact Information',
    contactIntro: 'You can submit communications regarding accessibility requirements (Article 10.2.a of RD 1112/2018), such as:',
    contactList: [
      'Reporting any potential non-compliance by this website.',
      'Transmitting other difficulties in accessing content.',
      'Making any other query or suggestion for improvement regarding website accessibility.'
    ],
    contactThrough: 'You can reach us through our ',
    contactLink: 'contact page',
    complaintIntro: 'You may lodge a complaint regarding compliance with RD 1112/2018 requirements or request accessible information concerning:',
    complaintList: [
      'Content excluded from the scope of application of RD 1112/2018 pursuant to Article 3(4).',
      'Content exempted from compliance with accessibility requirements due to disproportionate burden.'
    ],
    complaintOutro: 'In the request for accessible information, the facts, reasons, and requests must be stated clearly to confirm that it is a reasonable and legitimate request.',
    optionalTitle: 'Optional Content',
    optionalP1: 'This website applies the requirements of standard UNE-EN 301549:2022 considering the exceptions of RD 1112/2018.',
    optionalP2: 'The last accessibility audit was conducted on July 29, 2026.',
    optionalP3: 'The website is optimized for modern web browsers (latest versions of Firefox, Safari, Opera, Edge, and Google Chrome). The recommended minimum screen resolution is 1280×1024.',
    optionalP4: 'The website is designed with a Responsive layout, ensuring optimal presentation on desktop, tablet, and mobile devices (Chrome for mobile, Firefox for mobile, Safari mobile, and native browsers).'
  },
  fr: {
    title: 'Déclaration d\'Accessibilité',
    intro1: 'L\'entité ',
    entity: 'Club Deportivo Pakea Munduari Itzulia',
    intro2: ' s\'est engagée à rendre son site web accessible conformément au décret royal 1112/2018, du 7 septembre, relatif à l\'accessibilité des sites internet et des applications mobiles du secteur public.',
    appliesTo: 'Cette déclaration d\'accessibilité s\'applique au site web ',
    complianceTitle: 'État de conformité',
    complianceText1: 'Ce site web est ',
    complianceStatus: 'partiellement conforme',
    complianceText2: ' avec le décret royal 1112/2018 en raison des exceptions et non-conformités énumérées ci-après.',
    nonAccessibleTitle: 'Contenu non accessible',
    nonAccessibleIntro: 'Le contenu mentionné ci-dessous n\'est pas accessible pour les raisons suivantes :',
    section1Title: '1. Non-conformité avec le RD 1112/2018',
    issues: [
      'Il existe des logos et des images avec un texte alternatif incorrect ou confus, ainsi que des images complexes dépourvues de description textuelle [exigence 9.1.1.1 Contenu non textuel, UNE-EN 301549:2022].',
      'Il existe des listes mal balisées (sans balises de liste), des tableaux avec des cellules mal étiquetées et des étiquettes invisibles sur les éléments de formulaire [exigence 9.1.3.1 Information et relations, UNE-EN 301549:2022].',
      'Il existe des tableaux non adaptés aux petits écrans et des champs de formulaire qui ne s\'affichent pas correctement sur les écrans de taille réduite [exigence 9.1.4.10 Réajustement du texte, UNE-EN 301549:2022].',
      'Certains textes ne s\'affichent pas correctement lorsque l\'interlignage et l\'espacement des caractères sont modifiés [exigence 9.1.4.12 Espacement du texte, UNE-EN 301549:2022].',
      'Certains éléments ne sont pas accessibles au clavier, tels que les liens vers les réseaux sociaux, l\'éditeur de commentaires, le tri des résultats de recherche, la pagination ou les flèches du calendrier [exigence 9.2.1.1 Clavier, UNE-EN 301549:2022].',
      'Certains éléments ne reçoivent pas le focus et empêchent l\'interaction au clavier [exigence 9.2.4.3 Ordre du focus, UNE-EN 301549:2022].',
      'Certains liens n\'identifient pas clairement leur fonction (description vague, intitulé trop générique, attribut title inadéquat...) [exigence 9.2.4.4 Fonction du lien, UNE-EN 301549:2022].',
      'Il existe des en-têtes contenant du texte répétitif ou insuffisamment explicite [exigence 9.2.4.6 En-têtes et étiquettes, UNE-EN 301549:2022].',
      'Il existe des images, infographies, textes de liens ou boutons, titres et contenus non encore traduits dans les autres langues [exigence 9.3.1.2 Langue des parties, UNE-EN 301549:2022].',
      'Sur certaines pages, une même icône est employée pour différents usages, créant ainsi une ambiguïté [exigence 9.3.2.4 Identification cohérente, UNE-EN 301549:2022].',
      'Il existe des messages d\'erreur peu détaillés ou dispersés, ainsi qu\'une absence de suggestions de saisie sur certains formulaires [exigence 9.3.3.1 Identification des erreurs, UNE-EN 301549:2022].',
      'Certains formulaires comportent des champs obligatoires sans avertissement explicite ou sans indication d\'exemple de format [exigence 9.3.3.2 Étiquettes ou instructions, UNE-EN 301549:2022].',
      'Certains champs signalent une saisie erronée sans proposer de conseil de correction adapté [exigence 9.3.3.3 Suggestions d\'erreurs, UNE-EN 301549:2022].',
      'Certaines pages présentent des erreurs de syntaxe risquant d\'entraver l\'interprétation par les technologies d\'assistance (identifiants dupliqués, balises non fermées...) [exigence 9.4.1.1 Analyse syntaxique, UNE-EN 301549:2022].',
      'Certaines pages ne transmettent pas de manière exhaustive l\'état, le rôle ou le nom des composants d\'interface aux lecteurs d\'écran lors de leur affichage [exigence 9.4.1.2 Nom, rôle et valeur, UNE-EN 301549:2022].',
      'Des imperfections ponctuelles d\'édition peuvent exister sur certaines pages web.'
    ],
    section2Title: '2. Charge disproportionnée',
    section2Text: 'Non applicable.',
    section3Title: '3. Contenu ne relevant pas de la législation applicable',
    section3Text: 'Des fichiers bureautiques au format PDF ou autres publiés avant le 20 septembre 2018 peuvent ne pas répondre pleinement à l\'ensemble des critères d\'accessibilité, bien que des efforts réguliers soient menés pour en optimiser la conformité.',
    prepTitle: 'Préparation de la présente déclaration d\'accessibilité',
    prepDate: 'La présente déclaration a été rédigée le 29/07/2026.',
    prepMethod: 'La méthode employée pour établir cette déclaration repose sur une auto-évaluation menée directement par l\'organisme.',
    prepReview: 'Dernière révision de la déclaration : 29/07/2026.',
    contactTitle: 'Observations et coordonnées',
    contactIntro: 'Vous pouvez formuler des communications relatives aux exigences d\'accessibilité (article 10.2.a du RD 1112/2018), par exemple :',
    contactList: [
      'Signaler tout manquement ou non-conformité sur ce site web.',
      'Transmettre toute difficulté d\'accès aux contenus.',
      'Poser toute question ou soumettre une suggestion d\'amélioration concernant l\'accessibilité du site.'
    ],
    contactThrough: 'Vous pouvez nous contacter directement via notre page de ',
    contactLink: 'contact',
    complaintIntro: 'Vous pouvez formuler une réclamation relative au respect des exigences du RD 1112/2018 ou une demande d\'information accessible concernant :',
    complaintList: [
      'Les contenus exclus du champ d\'application du RD 1112/2018 en vertu de l\'article 3, paragraphe 4.',
      'Les contenus exemptés des exigences d\'accessibilité en raison d\'une charge disproportionnée.'
    ],
    complaintOutro: 'Dans la demande d\'information accessible, les faits, motifs et requêtes doivent être exposés de manière claire afin d\'en attester le caractère légitime et motivé.',
    optionalTitle: 'Contenu optionnel',
    optionalP1: 'Ce site web applique les exigences de la norme UNE-EN 301549:2022 en tenant compte des exceptions prévues par le RD 1112/2018.',
    optionalP2: 'Le dernier examen d\'accessibilité a été réalisé le 29/07/2026.',
    optionalP3: 'Le site web est optimisé pour les navigateurs récents (dernières versions stables de FireFox, Safari, Opera, Edge et Google Chrome). La résolution d\'écran minimale recommandée est de 1280×1024.',
    optionalP4: 'Le site web est développé selon les normes Responsive, garantissant un affichage optimal sur tablettes et smartphones (Chrome mobile, Firefox mobile, Safari mobile et navigateurs intégrés).'
  }
};

export default async function DeclaracionAccesibilidadPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const resolvedParams = await params;
  const locale = ((resolvedParams?.locale as SupportedLocale) in contentByLocale)
    ? (resolvedParams.locale as SupportedLocale)
    : 'es';

  const t = contentByLocale[locale];

  return (
    <main className="min-h-screen bg-white text-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200 shadow-xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-black mb-10 pb-4 border-b border-gray-300">
          {t.title}
        </h1>
        
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-black">
          <p>
            {t.intro1}
            <strong className="text-red-600 font-bold">{t.entity}</strong>
            {t.intro2}
          </p>

          <p>
            {t.appliesTo}
            <a href="https://getxobelaeskola.cloud/" className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
              https://getxobelaeskola.cloud/
            </a>
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">
            {t.complianceTitle}
          </h2>
          <p>
            {t.complianceText1}
            <strong className="text-black font-bold">{t.complianceStatus}</strong>
            {t.complianceText2}
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">
            {t.nonAccessibleTitle}
          </h2>
          <p>{t.nonAccessibleIntro}</p>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              {t.section1Title}
            </h3>
            <ul className="list-disc pl-5 space-y-3 text-black">
              {t.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-red-600 mt-8 mb-4">
              {t.section2Title}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>{t.section2Text}</li>
            </ul>

            <h3 className="text-xl font-bold text-red-600 mt-8 mb-4">
              {t.section3Title}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-black">
              <li>{t.section3Text}</li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">
            {t.prepTitle}
          </h2>
          <p>{t.prepDate}</p>
          <p>{t.prepMethod}</p>
          <p>{t.prepReview}</p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">
            {t.contactTitle}
          </h2>
          <p>{t.contactIntro}</p>
          <ul className="list-disc pl-5 space-y-2 text-black">
            {t.contactList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p>
            {t.contactThrough}
            <a href={`/${locale}/contacto`} className="text-red-600 hover:text-red-800 font-bold underline transition-colors">
              {t.contactLink}
            </a>.
          </p>

          <p className="mt-6">
            {t.complaintIntro}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-black">
            {t.complaintList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p>
            {t.complaintOutro}
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-black mt-12 mb-4">
            {t.optionalTitle}
          </h2>
          <p>{t.optionalP1}</p>
          <p>{t.optionalP2}</p>
          <p>{t.optionalP3}</p>
          <p>{t.optionalP4}</p>
        </div>
      </div>
    </main>
  );
}
