export interface LocalizedArticle {
    title: string;
    excerpt: string;
    content: string;
    author: string;
}

export const localizedArticles: Record<string, Record<'es' | 'eu' | 'en' | 'fr', LocalizedArticle>> = {
    'como-leer-una-carta-nautica-en-5-pasos': {
        es: {
            title: 'Cómo leer una carta náutica en 5 pasos',
            excerpt: 'Guía práctica para entender las cartas marinas, interpretar las sondas de profundidad y trazar tu rumbo con seguridad.',
            author: 'Urko Santillán',
            content: `# Cómo leer una carta náutica en 5 pasos

La carta náutica es el mapa de carreteras indispensable de todo navegante. Aunque hoy en día contemos con plotters electrónicos y GPS en los dispositivos de a bordo, la interpretación rigurosa de la cartografía náutica en papel (como las cartas del Instituto Hidrográfico de la Marina - IHM) sigue siendo obligatoria y el pilar fundamental de la seguridad en la mar.

Si sales a navegar desde el Abra de Getxo o estás preparando tu titulación náutica (PNB, PER o Patrón de Yate), dominar estos 5 pasos te permitirá planificar cualquier derrota con total tranquilidad.

---

### 1. Orientación y marco de coordenadas (Latitud y Longitud)
Las cartas náuticas están orientadas al **Norte geográfico (Norte verdadero)** en la parte superior. 
- En la escala vertical (márgenes izquierdo y derecho) se mide la **latitud** (Norte/Sur respecto al Ecuador). Además, recuerda una regla de oro de la navegación: **1 minuto de arco de latitud equivale exactamente a 1 milla náutica (1.852 metros)**.
- En la escala horizontal (márgenes superior e inferior) se mide la **longitud** (Este/Oeste respecto al Meridiano de Greenwich). **Nunca uses la escala de longitud para medir distancias**, ya que los meridianos convergen hacia los polos.

### 2. Sondas de profundidad y naturaleza del fondo
Los números que aparecen en las zonas de agua representan las **sondas** o profundidades en metros referidas al cero hidrográfico (la bajamar escorada o mínima bajamar astronómica esperable).
- Junto a las sondas, las líneas isobáticas o **veriles** unen puntos de igual profundidad (por ejemplo, el veril de los 5, 10 o 20 metros).
- Las cartas también indican la naturaleza del fondo mediante abreviaturas náuticas normalizadas: **A** (arena), **F** (fango), **P** (piedra), **C** (cascajo) o **Al** (algas). Esta información es crucial antes de fondear para evaluar el tenedero.

### 3. Simbología de peligros y obstáculos a la navegación
Identificar los obstáculos sumergidos y emergidos es vital para evitar varadas:
- **Rocas que velan:** Rocas que quedan al descubierto en bajamar y cubiertas en pleamar (representadas con un asterisco o cruz con puntos).
- **Rocas sumergidas peligrosas:** Con profundidad conocida o desconocida menor a 2 metros (cruz rodeada de puntos).
- **Naufragios y pecios:** Marcados como cascos de buques hundidos parcial o totalmente.
- **Zonas restringidas:** Líneas de cables submarinos, emisarios submarinos y zonas de fondeo prohibido.

### 4. Ayudas a la navegación: Faros, boyas y balizamiento IALA
En nuestras costas del Cantábrico y toda Europa rige la **Región A del Sistema de Balizamiento IALA**:
- **Boyas de babor:** Color rojo, marca de tope cilíndrica roja, luz roja.
- **Boyas de estribor:** Color verde, marca de tope cónica verde, luz verde. Al entrar a un puerto o ría (como al acceder al Abra de Getxo desde mar abierto), debes dejar las marcas rojas a tu babor y las verdes a tu estribor.
- **Faros y balizas luminosas:** Vienen descritos en la carta con su ritmo de luz, color, periodo y alcance óptico en millas (por ejemplo, *Fl(3) W 15s 23M* indica destellos triples de luz blanca cada 15 segundos con un alcance de 23 millas).

### 5. Trazar rumbos verdaderos y corregir la declinación magnética
Para trazar tu travesía (por ejemplo, desde el Puerto Deportivo de Getxo hacia Plentzia o Castro Urdiales):
1. Traza con regla náutica la línea recta que une tu punto de salida y tu destino: esta línea representa tu **Rumbo Verdadero (Rv)**.
2. Mide el ángulo con el transportador náutico tomando como referencia los meridianos de la carta.
3. Para gobernar el timón con el compás magnético del barco, corrige el rumbo aplicando la **declinación magnética (dm)** de la rosa de los vientos de la carta actualizada a la fecha actual y el posible **desvío de aguja (Δ)**:
   *Rumbo de Aguja (Ra) = Rumbo Verdadero (Rv) - (dm + Δ)*

Con estos 5 pasos y la práctica constante en nuestras salidas de navegación en Getxo Bela Eskola, leer una carta se convertirá en un hábito intuitivo y seguro.`
        },
        eu: {
            title: 'Nola irakurri itsas karta bat 5 urratsetan',
            excerpt: 'Itsas kartak ulertzeko gida erraza, koordenatuak, sakonerak eta itsas ikurrak barne.',
            author: 'Urko Santillán',
            content: `# Nola irakurri itsas karta bat 5 urratsetan

Itsas karta nabigatzaile ororen ezinbesteko errepide-mapa da. Gaur egun ontzietan GPS eta plotter elektroniko aurreratuak izan arren, paperezko kartografia nautikoaren interpretazio zorrotza (Espainiako Itsas Institutu Hidrografikoarenak - IHM bezala) nahitaezkoa da eta segurtasunaren zutabe nagusia izaten jarraitzen du.

Getxoko Abratik nabigatzera irteten bazara edo zure aisialdiko titulazio nautikoa prestatzen ari bazara (PNB, PER edo Yate Patroia), 5 urrats hauek menperatzeak edozein itsasbide lasaitasun osoz planifikatzeko aukera emango dizu.

---

### 1. Orientazioa eta koordenatuen markoa (Latitudea eta Longitudea)
Itsas kartak **Iparralde geografikoari (benetako iparrari)** begira daude orientatuta goiko aldean.
- Eskala bertikalean (ezkerreko eta eskuineko marjinetan) **latitudea** neurtzen da (Ekuatorearekiko Ipar/Hego). Gogoratu nabigazioaren urrezko araua: **latitude-arkuko minutu 1 zehazki itsas milia 1 da (1.852 metro)**.
- Eskala horizontalean (goiko eta beheko marjinetan) **longitudea** neurtzen da (Greenwich Meridianarekiko Ekialde/Mendebalde). **Inoiz ez erabili longitudearen eskala distantziak neurtzeko**, meridianoak poloetarantz hurbiltzen baitira.

### 2. Sakonerak (zundak) eta hondoaren izaera
Uretako eremuetan agertzen diren zenbakiek **zundak** edo sakonerak adierazten dituzte metrotan, zero hidrografikoari erreferentzia eginez (aurreikusten den itsasbehera astronomiko txikiena).
- Zundekin batera, lerro isobatikoek sakonera bereko puntuak lotzen dituzte (adibidez, 5, 10 edo 20 metroko lerroak).
- Kartetan hondoaren mota ere adierazten da laburdura nautiko estandarrekin: **A** (harea), **F** (lokatza), **P** (harria), **C** (hartxintxarra) edo **Al** (algak). Informazio hau funtsezkoa da ainguratu aurretik.

### 3. Nabigaziorako arriskuen eta oztopoen sinbologia
Urpeko eta azaleratutako oztopoak bereiztea ezinbestekoa da:
- **Agertzen diren harkaitzak:** Itsasbeheran agerian geratzen direnak eta itsasgoran estaltzen direnak (izarño edo gurutze batez adieraziak).
- **Urpeko harkaitz arriskutsuak:** 2 metro baino sakonera txikiagoa dutenak (puntu txikiz inguratutako gurutzea).
- **Hondoratutako ontziak (peziunak):** Kartan marka zehatzekin adierazita.
- **Eremu mugatuak:** Urpeko kableak, itsaspeko emisarioak eta ainguratzea debekatuta dagoen guneak.

### 4. Nabigaziorako laguntzak: Farolak, buiak eta IALA balizak
Bizkaiko kostaldean eta Europa osoan **IALA Balizamen Sistemaren A Eskualdea** aplikatzen da:
- **Baborko buiak:** Gorriak, tontor zilindriko gorriarekin.
- **Istriborreko buiak:** Berdeak, tontor koniko berdearekin. Portu edo itsasadar batera sartzean (adibidez, itsas zabaletik Getxoko Abrara sartzean), marka gorriak zure baborretik eta berdeak zure istriborretik utzi behar dituzu.
- **Farolak:** Kartan beren argi-erritmoa, kolorea, epea eta irismena adierazten dira.

### 5. Benetako norabideak marraztu eta deklinazio magnetikoa zuzendu
Zure bidaia marrazteko (adibidez, Getxoko Kirol Portutik Plentziarantz edo Castro Urdialeserantz):
1. Marraztu lerro zuzena abiapuntuaren eta helmugaren artean erregela nautikoarekin: lerro honek **Benetako Norabidea (Rv)** adierazten du.
2. Neurtu angelua garraiatzaile nautikoarekin kartako meridianoak oinarri hartuta.
3. Ontziaren iparrorratz magnetikoarekin gobernatzeko, zuzendu norabidea kartako haize-arrosaren **deklinazio magnetikoa (dm)** eta orratzaren desbideratzea (Δ) aplikatuz:
   *Orratz Norabidea (Ra) = Benetako Norabidea (Rv) - (dm + Δ)*

5 urrats hauekin eta Getxo Bela Eskolako praktika jarraituarekin, itsas karta bat irakurtzea ohitura intuitibo eta segurua bihurtuko da.`
        },
        en: {
            title: 'How to read a nautical chart in 5 steps',
            excerpt: 'Practical guide to understanding marine charts, interpreting depth soundings, and plotting your course safely.',
            author: 'Urko Santillán',
            content: `# How to read a nautical chart in 5 steps

A nautical chart is every sailor's indispensable roadmap. Even though modern vessels are equipped with GPS plotters and digital displays, a solid understanding of paper nautical charts remains compulsory and the cornerstone of maritime safety.

Whether you are casting off from the Abra of Getxo or working towards your skipper certification, mastering these 5 steps ensures you can plan any passage with complete confidence.

---

### 1. Orientation and Coordinates Frame (Latitude & Longitude)
Nautical charts are oriented with **True North** at the top.
- The vertical margins (left and right) display **latitude** (North/South of the Equator). Remember the golden rule of maritime navigation: **1 minute of latitude arc equals exactly 1 nautical mile (1,852 meters)**.
- The horizontal margins (top and bottom) display **longitude** (East/West of the Greenwich Meridian). **Never use the longitude scale to measure distances**, as meridians converge toward the poles.

### 2. Depth Soundings and Seabed Composition
The numbers across water areas represent **soundings** or depths in meters referenced to Chart Datum (Lowest Astronomical Tide).
- Alongside soundings, depth contour lines connect points of equal depth (e.g., 5m, 10m, or 20m isobaths).
- Charts also specify bottom characteristics with international abbreviations: **A** (sand), **F** (mud), **P** (rock), **C** (gravel), or **Al** (seaweed). This data is vital for assessing holding ground before dropping anchor.

### 3. Navigation Hazards and Obstacles
Recognizing submerged and exposed hazards prevents running aground:
- **Drying rocks:** Rocks uncovered at low water and covered at high water (marked with an asterisk or cross with dots).
- **Submerged dangerous rocks:** With known or unknown clearance under 2 meters.
- **Wrecks:** Marked as partially or completely submerged ship hulls.
- **Restricted areas:** Submarine cables, pipelines, and prohibited anchorage zones.

### 4. Aids to Navigation: Lighthouses, Buoys, and IALA System
Along the Basque coast and European Atlantic waters, **IALA Maritime Buoyage System - Region A** applies:
- **Port-hand marks:** Red color, cylindrical topmark, red flashing light.
- **Starboard-hand marks:** Green color, conical topmark, green light. When entering a harbor or estuary (such as entering the Abra of Getxo from open sea), keep red marks to port and green marks to starboard.
- **Lighthouses and sector lights:** Listed with light characteristics, rhythm, period, and visual range in nautical miles (e.g., *Fl(3) W 15s 23M*).

### 5. Plotting True Courses and Correcting Magnetic Variation
To plot your passage (e.g., from Getxo Marina toward Plentzia or Castro Urdiales):
1. Use a parallel ruler to draw a straight line from origin to destination: this represents your **True Course (TC)**.
2. Read the angle against the nearest meridian using a nautical protractor.
3. To steer by magnetic compass, correct the course for local **magnetic variation (Var)** and vessel **deviation (Dev)**:
   *Compass Heading (CH) = True Course (TC) - (Var + Dev)*

With these 5 steps and regular practice on our training sails at Getxo Bela Eskola, reading a nautical chart becomes second nature.`
        },
        fr: {
            title: 'Comment lire une carte marine en 5 étapes',
            excerpt: 'Guide pratique pour comprendre les cartes marines, interpréter les sondes et tracer votre route en toute sécurité.',
            author: 'Urko Santillán',
            content: `# Comment lire une carte marine en 5 étapes

La carte marine est la feuille de route indispensable de tout marin. Bien que nous disposions aujourd'hui de traceurs GPS à bord, l'interprétation rigoureuse de la cartographie marine papier reste obligatoire et demeure le pilier de la sécurité en mer.

Que vous partiez naviguer depuis l'Abra de Getxo ou que vous prépariez votre permis côtier ou hauturier, maîtriser ces 5 étapes vous permettra de planifier vos navigations avec sérénité.

---

### 1. Orientation et cadre de coordonnées (Latitude et Longitude)
Les cartes marines sont toujours orientées avec le **Nord vrai (Nord géographique)** vers le haut.
- Les bords verticaux (gauche et droite) mesurent la **latitude** (Nord/Sud par rapport à l'Équateur). Retenez la règle d'or: **1 minute d'arc de latitude correspond exactement à 1 mille marin (1 852 mètres)**.
- Les bords horizontaux (haut et bas) mesurent la **longitude** (Est/Ouest par rapport au méridien de Greenwich). **N'utilisez jamais l'échelle de longitude pour mesurer les distances**, car les méridiens convergent vers les pôles.

### 2. Sondes bathymétriques et nature des fonds
Les chiffres inscrits sur les zones d'eau représentent les **sondes** ou profondeurs en mètres par rapport au zéro hydrographique (la plus basse mer astronomique).
- Les courbes de niveau ou **isobathes** relient les points d'égale profondeur (5 m, 10 m, 20 m).
- La nature du fond est indiquée par des abréviations marines normalisées: **A** (sable), **F** (vase), **P** (roche), **C** (gravier) ou **Al** (algues). Ces indications sont cruciales pour évaluer la tenue du mouillage.

### 3. Symboles des dangers et obstacles à la navigation
Repérer les dangers évite les risques d'échouement:
- **Roches qui découvrent:** Visibles à marée basse et recouvertes à marée haute.
- **Roches submergées dangereuses:** Profondeur inférieure à 2 mètres.
- **Épaves:** Matérialisées par la coque d'un navire coulé.
- **Zones interdites:** Câbles sous-marins et zones de mouillage interdit.

### 4. Aides à la navigation: Phares, balises et système IALA
Sur la côte basque et dans toute l'Europe occidentale, c'est la **Zone A du système IALA** qui s'applique:
- **Marques de bâbord:** Rouges, voyant cylindrique, feu rouge.
- **Marques de tribord:** Vertes, voyant conique, feu vert. En entrant au port (par exemple depuis le large vers l'Abra de Getxo), laissez le rouge à bâbord et le vert à tribord.
- **Phares et feux:** Décrits avec leur rythme, couleur, période et portée en milles nautiques.

### 5. Tracer la route fond et corriger la déclinaison magnétique
Pour tracer votre route (par exemple du port de plaisance de Getxo vers Plentzia ou Castro Urdiales):
1. Tracez à la règle de navigation la ligne droite reliant votre départ et votre destination: c'est votre **Route Vraie (Rv)**.
2. Mesurez l'angle avec le rapporteur breton par rapport aux méridiens.
3. Pour barrer au compas magnétique, appliquez la **déclinaison magnétique (D)** et la déviation (d):
   *Cap Compas (Cc) = Route Vraie (Rv) - (D + d)*

Grâce à ces 5 étapes et à la pratique régulière lors des cours de Getxo Bela Eskola, la lecture de carte deviendra un réflexe naturel et sûr.`
        }
    },
    'tacticas-de-regata-domina-las-salidas-con-viento-fuerte': {
        es: {
            title: 'Tácticas de regata: Domina las salidas con viento fuerte',
            excerpt: 'Aprende a gestionar la presión de la flota en la línea de salida y a configurar el trimado de tus velas con vientos duros.',
            author: 'Ana de Lara',
            content: `# Tácticas de regata: Domina las salidas con viento fuerte

En la competición a vela, y de forma muy destacada en monotipos como el J80 o en vela ligera, se suele decir que el 70% del resultado de una manga se decide en los dos primeros minutos: en la línea de salida. Cuando el anemómetro supera los 20 nudos y las rachas barren el Abra de Getxo, la presión sobre el patrón y la tripulación se multiplica.

Con viento duro, un error de timing o un mal control de la velocidad no solo te condena a navegar desaventado en los socaires de la flota, sino que puede provocar una orzada involuntaria, un toque entre barcos o una rotura de material. A continuación te presentamos las claves tácticas y técnicas para dominar la línea con viento fuerte.

---

### 1. El análisis previo: Sesgo de línea y condiciones del campo
Antes de la secuencia de 5 minutos, navega por ambos extremos de la línea (barco de comité y boya de sotavento):
- **Identifica el extremo favorecido:** Pon el barco proa al viento en el centro de la línea y observa qué extremo queda más a barlovento. Sin embargo, con viento fuerte, no te obsesiones únicamente con el extremo más favorecido: el extremo congestionado suele generar "agujeros" de viento sucio y mayor riesgo de abordaje.
- **Localiza las rachas y el oleaje:** En el Abra exterior, el oleaje del Cantábrico frena los barcos si intentas ceñir excesivamente pinzado. Busca el carril con agua más plana y mejor presión de viento.

### 2. La técnica del "Stand-by": Control del barco sin arrancada descontrolada
Con 20-25 nudos no puedes quedarte totalmente parado aproado al viento porque perderás el gobierno del timón por falta de flujo de agua en la pala.
- Mantén el barco al través o descuartelar con las velas desfiladas (flameando) unos 45-60 segundos antes del top.
- Usa el génova o foque acuartelado puntualmente solo si necesitas abatir la proa con rapidez para caer y ganar aceleración.
- Conserva siempre tu **espacio de sotavento**: defiéndelo abriendo ligeramente el rumbo para impedir que otro barco te suba y te deje sin hueco para arrancar.

### 3. Trimado de supervivencia y aceleración previa al pistoletazo
Para acelerar con viento fuerte sin escorar en exceso:
- **Aplanamiento de la mayor:** Caza el pajarín y tensa el cunningham con fuerza para desplazar la bolsa hacia delante y reducir la profundidad del perfil vélico.
- **Carro de escota:** Lleva el carro de la mayor hacia sotavento para desaguar potencia en la parte superior de la vela (twist).
- **Coordinación de aceleración (-10 segundos):** A falta de 8-10 segundos, no caces la mayor de golpe; acelera primero con el foque cazado mientras el patrón arriba unos grados para ganar velocidad hidrodinámica (flujo en la orza y timón), y luego caza la mayor progresivamente mientras la tripulación saca el cuerpo a la banda.

### 4. Posición y distribución del peso de la tripulación en banda
El par de adrizamiento es el motor del barco con viento duro:
- Todo el equipo debe estar completamente colocado en la banda de barlovento antes de iniciar la aceleración.
- Con mar formada en el Abra, desplazar el peso ligeramente hacia popa ayuda a que la proa no clave en la ola al arrancar.
- Una tripulación firme en la banda permite mantener el barco plano (menos de 15º de escora), garantizando que la orza trabaje al 100% de sustentación y evitando la deriva lateral frente a los rivales.

### 5. Salir con carril libre: Prioriza velocidad sobre ángulo
En el instante del bocinazo de salida, el mayor error con viento duro es intentar ceñir rabioso inmediatamente. 
- Prioriza salir con **carril libre de viento limpio y máxima velocidad**.
- Con buena velocidad de casco, el flujo en la orza te permitirá ascender de manera natural sin riesgo de quedarte clavado en las olas.

Aplica estas pautas en los entrenamientos de regata y ligas de invierno de Getxo Bela Eskola para consolidar salidas limpias, potentes y en los puestos de cabeza.`
        },
        eu: {
            title: 'Estropada taktikak: Irteerak haize indartsuarekin dominatu',
            excerpt: 'J80 ontzian nabigatzeko aholkuak haize gogorra denean eta taktikak irteeran lekua irabazteko.',
            author: 'Ana de Lara',
            content: `# Estropada taktikak: Irteerak haize indartsuarekin dominatu

Bela lehiaketetan, eta batez ere J80 bezalako monotipoetan edo bela arinean, sarritan esaten da txanda baten emaitzaren % 70 lehen bi minutuetan erabakitzen dela: irteera-lerroan. Haize-neurgailuak 20 korapiloak gainditzen dituenean eta boladek Getxoko Abra astintzen dutenean, patroiaren eta eskifaiaren gaineko presioa biderkatu egiten da.

Haize gogorrarekin, denboraren kalkulu oker batek edo abiaduraren kontrol eskasak flotaren itzalpean geratzeaz gain, nahi gabeko biraketa, talkak edo materiala apurtzea eragin ditzake. Jarraian, haize indartsuarekin irteera lerroa menderatzeko gako taktiko eta teknikoak aurkezten dizkizugu.

---

### 1. Aurretiazko analisia: Lerroaren alde mesedegarria eta zelaiaren baldintzak
5 minutuko sekuentzia hasi aurretik, nabigatu lerroko bi muturretara (batzordearen ontzia eta sotabentoko buia):
- **Identifikatu mutur mesedegarriena:** Jarri ontzia haizearen kontra lerroaren erdian eta behatu zein mutur dagoen barlobentorago. Hala ere, haize bortitzarekin, ez zaitez mutur mesedegarrienarekin bakarrik itsutu: jendez gehiegi betetako muturrak haize zikineko eremuak eta talka-arrisku handia sortzen ditu.
- **Kokatu boladak eta olatuak:** Kanpoko Abran, Kantauriko olatuek ontziak geldiarazten dituzte gehiegi estutzen saiatzen bazara. Bilatu ur lauagoko eta haize-presio hobea duen eremua.

### 2. "Stand-by" teknika: Ontziaren kontrola gehiegizko abiadurarik gabe
20-25 korapilorekin ezin zara erabat geldirik geratu haizearen aurrean, lema-palako ur-fluxurik gabe ontziaren kontrola galduko baituzu.
- Mantendu ontzia zeharka oihalak aske utzita irteera-seinalea baino 45-60 segundo lehenago.
- Mantendu beti zure **sotabentoko espazioa**: defendatu norabidea apur bat irekiz, beste ontzi batek zure azpiko lekua kendu ez diezazun.

### 3. Oihalen doikuntza eta azelerazioa seinalea baino lehen
Haize gogorrarekin gehiegi okertu gabe azeleratzeko:
- **Bela nagusia lau mantendu:** Tentsatu pajarina eta cunningham-a gogor, poltsa aurrerantz eramateko eta oihalaren sakonera murrizteko.
- **Eskota-orga:** Eraman nagusiaren orga sotabentorantz goiko aldetik potentzia askatzeko (twist).
- **Azelerazioaren koordinazioa (-10 segundo):** 8-10 segundo falta direnean, ez ehizatu nagusia bat-batean; azeleratu lehenik fokarekin abiadura hidrodinamikoa hartzeko, eta gero ehizatu nagusia progresiboki eskifaiak pisua bandara ateratzen duen bitartean.

### 4. Eskifaiaren posizioa eta pisu-banaketa bandan
Tolesdura-pareak ontziaren errendimendua baldintzatzen du haize gogorrarekin:
- Talde osoak barlobentoko bandan kokatu behar du azeleratzen hasi aurretik.
- Abran itsaso eratua dagoenean, pisua poparantz pixka bat eramateak brankak olatua jo ez dezan laguntzen du.
- Ontzia laua mantentzeak (% 15 baino gutxiagoko eskora) ziurtatzen du orzak bere euste-ahalmen osoa garatzen duela, alboko jitoa ekidinez.

### 5. Irten bide librearekin: Abiadura lehenetsi angeluaren gainetik
Irteerako turuta jotzean, okerrik handiena haizearen aurka gehiegi estutzen saiatzea da.
- Lehenetsi **haize garbia eta abiadura maximoa** duen bidetik irtetea.
- Kroskoaren abiadura onarekin, orzaren fluxuak modu naturalean gorantz igotzeko aukera emango dizu olatuetan trabatuta geratu gabe.

Aplikatu gomendio hauek Getxo Bela Eskolako entrenamenduetan eta neguko ligetan irteera garbi eta indartsuak lortzeko.`
        },
        en: {
            title: 'Regatta tactics: Dominate starts in strong wind',
            excerpt: 'Master boat control at the starting line, preserve your leeward lane, and optimize sail trim in heavy weather.',
            author: 'Ana de Lara',
            content: `# Regatta tactics: Dominate starts in strong wind

In competitive sailing—especially in one-design fleets like the J80 or dinghy racing—it is often said that 70% of a race is decided during the starting sequence. When wind speeds climb over 20 knots across the Abra of Getxo, execution pressure increases exponentially.

In heavy air, a timing error or lack of boat control not only buries your boat in dirty air, but can also trigger a wipeout, contact with competitors, or gear failure. Below are the key tactical and technical rules to control the starting line in strong wind.

---

### 1. Pre-Start Line Bias and Racecourse Survey
Before the 5-minute preparatory signal, scout both ends of the line (committee boat and pin end):
- **Identify line bias:** Head directly into the wind mid-line and see which end points further upwind. However, in strong breezes, avoid dogmatic fixation on the heavily favored pin or boat: dense traffic creates dirty wind eddies and increases collision hazards.
- **Track gusts and wave chop:** In the outer Abra, Atlantic swells quickly stop a boat that is pinched too high. Choose the lane offering flatter water and cleaner breeze.

### 2. The "Stand-by" Technique: Controlled Hovering
With 20-25 knots you cannot sit dead in the water head-to-wind, as rudder stall occurs immediately without waterflow over the blade.
- Hold position on a beam reach with sails luffing freely 45–60 seconds prior to the gun.
- Back the jib momentarily only if you need to swing the bow down quickly to build boat speed.
- Defend your **leeward space**: preserve a tactical pocket to leeward so you can bear away and accelerate unimpeded at will.

### 3. Depowering Trim & Final Acceleration (-10 Seconds)
To accelerate hard without blowing over into severe heel:
- **Flatten the mainsail:** Tension the outhaul firmly and pull hard on the cunningham to draw draft forward and flatten the foil profile.
- **Traveler down:** Lower the mainsail traveler to dump excess power from the upper leech (twist).
- **Staged acceleration:** At 8-10 seconds to go, avoid sheeting the main block-to-block right away; trim the jib first as the helmsman bears off slightly to build foil lift on the keel and rudder, then trim the main progressively as the crew hikes out hard.

### 4. Crew Weight Distribution on the Rail
Righting moment is your vessel's horsepower in strong wind:
- The entire crew must be fully committed on the weather rail before accelerating.
- In choppy waters, moving crew weight slightly aft prevents the bow from digging into wave faces.
- Keeping the hull flat (under 15° of heel) ensures the keel works at maximum efficiency and halts leeway.

### 5. Clear Air Priority: Speed over Angle
At the gun, the most common mistake is attempting to pinch high immediately.
- Prioritize **clear air, an open lane, and maximum boat speed**.
- Once full speed is established, foil hydrodynamic lift will allow you to point naturally high without stalling.

Incorporate these techniques in Getxo Bela Eskola's winter regatta clinics to secure clean, fast, and competitive starts.`
        },
        fr: {
            title: 'Tactique de régate: Dominer les départs par vent fort',
            excerpt: 'Apprenez à gérer la flotte sur la ligne de départ et à régler vos voiles par brise soutenue.',
            author: 'Ana de Lara',
            content: `# Tactique de régate: Dominer les départs par vent fort

En régate à la voile, et tout particulièrement en monotype comme le J80 ou en dériveur, on considère que 70% d'une manche se joue sur la ligne de départ. Lorsque l'anémomètre franchit les 20 nœuds sur l'Abra de Getxo, la pression à bord monte d'un cran.

Par brise soutenue, une faute de timing ou un contrôle de vitesse approximatif vous condamne à subir les dévents de la flotte, ou pire, à risquer un départ au lof ou une avarie matérielle. Voici les clés techniques indispensables pour maîtriser la ligne de départ.

---

### 1. Analyse préalable de la ligne et du plan d'eau
Avant la procédure des 5 minutes, naviguez aux deux extrémités de la ligne (bateau comité et bouée sous le vent):
- **Identifier l'extrémité favorable:** Bout au vent au milieu de la ligne, repérez le côté le plus au vent. Par vent fort, méfiez-vous de l'extrémité la plus encombrée qui génère des poches de vent perturbé.
- **Observer le clapot:** Dans l'Abra extérieur, la houle de l'Atlantique freine immédiatement un bateau qui serre trop le vent. Cherchez les couloirs d'eau plus plate.

### 2. La technique d'attente ("Stand-by")
Par 20 à 25 nœuds, il est impossible de rester immobile face au vent sous peine de perdre tout écoulement d'eau sur le safran et de ne plus pouvoir manœuvrer.
- Restez au travers en laissant faseyer les voiles 45 à 60 secondes avant le départ.
- Conservez jalousement votre **espace sous le vent**: écartez-vous légèrement pour empêcher un concurrent de vous priver du couloir nécessaire à l'accélération.

### 3. Réglage de déventement et accélération (-10 secondes)
Pour accélérer sans gîte excessive:
- **Aplatir la grand-voile:** Étasquez la bordure et étarquez fort le cunningham pour avancer le creux et réduire la traînée.
- **Chariot d'écoute sous le vent:** Descendez le chariot pour vriller la chute et évacuer la surpuissance.
- **Accélération coordonnée:** À 8-10 secondes du signal, n'étarquez pas la grand-voile d'un coup. Bordez d'abord le foc en abattant légèrement pour lancer l'écoulement sur la quille, puis bordez la grand-voile au fur et à mesure que l'équipage fait rappel.

### 4. Rappel et assiette du bateau
Le couple de redressement est le moteur du voilier dans la brise:
- Tout l'équipage doit être installé au rappel au vent avant de border.
- Dans le clapot, reculer légèrement les poids empêche l'étrave d'enfourner.
- Un bateau naviguant à plat (moins de 15° de gîte) permet à la quille de générer 100% de sa portance antidérive.

### 5. Vitesse d'abord, cap ensuite
Au coup de canon, l'erreur classique est de chercher immédiatement à lofer:
- Privilégiez **un couloir de vent propre et une vitesse maximale**.
- Une fois la vitesse de carène acquise, la dérive remontera au vent naturellement sans s'arrêter dans la vague.

Mettez en pratique ces conseils lors des entraînements de Getxo Bela Eskola pour réussir des départs propres et aux avant-postes.`
        }
    },
    'los-mejores-rincones-para-fondear-en-el-abra-de-getxo': {
        es: {
            title: 'Los mejores rincones para fondear en el Abra de Getxo',
            excerpt: 'Explora los fondeaderos más pintorescos y protegidos de nuestra costa, con consejos sobre tenedero y vientos predominantes.',
            author: 'Angharad Arambalza',
            content: `# Los mejores rincones para fondear en el Abra de Getxo

El Abra de Getxo es una de las bahías más emblemáticas y fascinantes de la costa vasca para los amantes del mar. Su configuración natural, protegida por los grandes diques exteriores de Punta Lucero y Arriluze, ofrece un entorno idóneo tanto para la navegación a vela como para disfrutar de jornadas de fondeo en un marco histórico inigualable.

Sin embargo, fondear en el Cantábrico exige un conocimiento riguroso de la meteorología, las mareas (con carreras de marea que superan los 4 metros en mareas vivas) y la naturaleza del fondo marino (tenedero). A continuación, analizamos los mejores rincones, recomendaciones y precauciones para fondear con seguridad en el Abra.

---

### 1. El fondeadero bajo el Dique de Arriluze y Puerto Deportivo
Ubicado al resguardo del dique de Arriluze y la dársena exterior del Puerto Deportivo de Getxo, es uno de los puntos más resguardados frente al oleaje del Noroeste (NW), el viento dominante del Cantábrico.
- **Fondo y tenedero:** Fondo predominantemente de arena y fango fino (**A/F**), lo que proporciona un excelente agarre para anclas de tipo arado (Delta, Rocna o CQR).
- **Sonda:** Profundidades de entre 3 y 6 metros en bajamar.
- **Ventajas:** Aguas muy calmas en días de verano y fácil acceso en neumática auxiliar al puerto o a los pantalanes de la escuela náutica. 
- **Precaución:** Mantener respeto estricto con el canal balizado de entrada y salida de las embarcaciones de recreo y evitar aproximarse a la bocana de la dársena.

### 2. Zona de recreo diurno frente a la Playa de Ereaga y Puerto Viejo de Algorta
Frente a la elegante fachada de palacetes de Las Arenas y la hermosa playa de Ereaga, se abre una zona magnífica para fondear durante el día con vientos suaves del Sur o Este (componente terral).
- **Fondo y tenedero:** Arena dorada limpia. Es importante largar suficiente cadena: calcula un ratio mínimo de **4 a 5 veces la profundidad en pleamar** (considerando el ascenso de la marea durante la estancia).
- **Encanto paisajístico:** Vistas privilegiadas al tradicional Puerto Viejo de Algorta con sus casas encaladas de pescadores, el Puente Bizkaia (Patrimonio de la Humanidad) al fondo y las terrazas de Ereaga.
- **Precaución legal y técnica:** No traspasar nunca la línea de boyas amarillas de balizamiento de la zona de baño de la playa (prohibido por Costas y Capitanía Marítima). No es un fondeadero apto para pernoctar si se espera role a Norte o Noroeste, ya que la resaca entra directa hacia la playa.

### 3. Fondeo temporal en el Abra Interior: Bajo el faro de Arriluze
En la zona abrigada de Las Arenas, próxima al histórico Faro de Arriluze y el Real Club Marítimo del Abra:
- **Condiciones ideales:** Un enclave idóneo para una parada técnica o para almorzar a bordo al abrigo de vientos fuertes del Oeste que generan marejada en el exterior.
- **Maniobra del ancla:** Comprueba siempre que el ancla ha clavado dando marcha atrás avante despacio hasta que la cadena tense y el barco quede firme a la corriente y viento.
- **Atención a las corrientes de marea:** Recuerda que la desembocadura de la ría del Nervión genera corrientes de llenante y vaciante que pueden hacer bornear el barco hasta 180º al cambiar la marea. Deja siempre un radio de borneo suficiente respecto a otras embarcaciones fondeadas.

### 4. Consejos esenciales de seguridad para fondear en Getxo
1. **Consulta la tabla de mareas de Bilbao / Getxo:** Recuerda sumar la altura de la pleamar a la sonda mínima indicada en la carta náutica para verificar que no quedarás en seco en la bajamar ni te faltará cadena en la pleamar.
2. **Usa un orinque con boyarín:** Conviene orincar el ancla si fondeas cerca de zonas rocosas o antiguos restos para poder liberarla con facilidad si se engancha.
3. **Guardia de fondeo y alarma de GPS:** Conecta la alarma de fondeo en tu plotter o aplicación móvil náutica para advertir cualquier posible garreo del ancla si sube el viento térmico de la tarde.

Disfrutar de un atardecer fondeado en las aguas del Abra de Getxo tras una jornada de vela es una de las experiencias más gratificantes que ofrece nuestro litoral. ¡Nos vemos en el agua!`
        },
        eu: {
            title: 'Getxoko Abrako ainguratzeko txokorik onenak',
            excerpt: 'Babes handiena duten kala eta hondartza hurbilak ezagutu, ainguratze seguru baterako gomendioekin.',
            author: 'Angharad Arambalza',
            content: `# Getxoko Abrako ainguratzeko txokorik onenak

Getxoko Abra euskal kostaldeko badia enblematiko eta liluragarrienetako bat da itsasoaren zaleentzat. Bere ingurune naturalak, Punta Luzero eta Arriluzeko kanpoko dike handiek babestuta, leku ezin hobea eskaintzen du bai bela nabigaziorako, bai ingurune historiko paregabe batean ainguratze-egun batez gozatzeko.

Dena den, Kantauri itsasoan ainguratzeak meteorologiaren, mareen (marea bizietan 4 metrotik gorako marea-igoerak izaten dira) eta itsas hondoaren izaeraren ezagutza zorrotza eskatzen du. Jarraian, Getxoko Abran segurtasunez ainguratzeko txoko, gomendio eta neurririk onenak aztertuko ditugu.

---

### 1. Arriluzeko Dikearen eta Kirol Portuaren azpiko ainguralekua
Arriluzeko dikearen eta Getxoko Kirol Portuko kanpoko dortsaren babesean kokatuta, Ipar-mendebaldeko (NW) olatuen aurrean babes handiena duen guneetako bat da, Kantauriko haize nagusia baita.
- **Hondoa eta finkapena:** Harea eta fango mehea (**A/F**), eta horrek aingura mota desberdinetarako (Delta, Rocna edo CQR) euste bikaina eskaintzen du.
- **Zunda:** 3 eta 6 metro arteko sakonera itsasbeheran.
- **Abantailak:** Ur oso lasaiak udako egunetan eta ontzi osagarriarekin (txalupa pneumatikoa) portura edo bela eskolako pantalanaletara iristeko erraztasuna.
- **Neurria:** Errespetatu zorrotz kirol-ontzien sarrera eta irteerako kanal balizatua.

### 2. Eguneko ainguralekua Ereagako hondartzaren eta Algortako Portu Zaharraren aurrean
Areetako jauregien eta Ereagako hondartza ederraren aurrean, eremu bikaina irekitzen da egunez ainguratzeko Hegoaldeko edo Ekialdeko haize leunekin.
- **Hondoa eta ainguratzea:** Harea garbia. Garrantzitsua da kate nahikoa botatzea: kalkulatu gutxienez **itsasgorako sakoneraren 4 edo 5 aldiz** luzera.
- **Paisaiaren xarma:** Algortako Portu Zaharraren bista ederrak bere etxe zuriekin, Bizkaia Zubia (Gizateriaren Ondarea) atzealdean eta Ereagako terrazak.
- **Neurri legala eta teknikoa:** Inoiz ez zeharkatu hondartzako bainu-eremuko buia horien lerroa (Kostaldeen eta Itsas Kapitaintzaren araudia). Ez da egokia gaua pasatzeko haizea Iparraldera edo Ipar-mendebaldera aldatuko dela aurreikusten bada.

### 3. Aldi baterako ainguralekua Barruko Abran: Arriluzeko farolaren azpian
Areetako gune babestuan, Arriluzeko Faro historikoaren eta Abrako Itsas Klubaren ondoan:
- **Baldintza aproposak:** Ezin hobea geldialdi tekniko bat egiteko edo kanpoaldean itsaso zakarra eragiten duten Mendebaldeko haizeetatik babesteko.
- **Marearen korronteak:** Gogoratu Nerbioi itsasadarraren bokaleak marea-korronte handiak sortzen dituela, ontzia 180º arte birarazi dezaketenak marea aldatzean. Utzi beti biratze-erradio nahikoa gainerako ontziekiko.

### 4. Getxon ainguratzeko oinarrizko segurtasun-aholkuak
1. **Begiratu Bilbo / Getxoko mareen taula:** Gehitu itsasgoraren altuera itsas kartan agertzen den zundari, itsasbeheran hondoa jo ez dezazun eta itsasgoran katerik falta ez dakizun.
2. **Konektatu ainguraren GPS alarma:** Aktibatu zure mugikorreko edo plotter-eko aingura-alarma arratsaldeko itsas haizeak indarra hartzen badu abisua jasotzeko.

Bela-jardunaldi baten ondoren Getxoko Abrako uretan ainguratuta ilunabarraz gozatzea gure kostaldeak eskaintzen duen esperientzia ederrenetakoa da. Ur gainean ikusiko dugu elkar!`
        },
        en: {
            title: 'The best anchorage spots in the Abra of Getxo',
            excerpt: 'Discover sheltered anchorages and scenic bays along our coastline, with practical tips on sea bottoms and prevailing winds.',
            author: 'Angharad Arambalza',
            content: `# The best anchorage spots in the Abra of Getxo

The Abra of Getxo is one of the most iconic bays on the Basque coast for nautical enthusiasts. Sheltered by the outer breakwaters of Punta Lucero and Arriluze, it offers an ideal playground both for active sailing and for relaxing anchorages amidst historic maritime surroundings.

However, anchoring in the Cantabrian Sea requires respect for changing weather, large tidal ranges (tidal differences exceed 4 meters during spring tides), and bottom holding quality. Here is our guide to the finest spots and key safety practices for anchoring in the Abra.

---

### 1. Sheltered Anchorage under Arriluze Breakwater & Marina
Nestled behind Arriluze breakwater and the outer basin of Getxo Marina, this spot offers prime shelter against North-Westerly (NW) ocean swells.
- **Seabed and holding:** Primarily fine sand and compacted mud (**A/F**), providing excellent holding for modern plow anchors (Delta, Rocna, CQR).
- **Soundings:** 3 to 6 meters of depth at low tide.
- **Advantages:** Flat water during summer and easy dinghy access to marina pontoons.
- **Precaution:** Stay well clear of the marked navigation fairway for visiting vessels and cruise ship maneuvers.

### 2. Day Anchorage off Ereaga Beach & Algorta's Old Port (Puerto Viejo)
Facing the stately manors of Las Arenas and sandy Ereaga beach, this is a scenic day anchorage under gentle Southerly or Easterly thermal breezes.
- **Seabed & Scope:** Clean golden sand. Always veer out sufficient chain: maintain a minimum scope of **4 to 5 times depth at high tide**.
- **Scenery:** Unrivaled view of Puerto Viejo's white fishing houses, the UNESCO World Heritage Bizkaia Bridge in the distance, and lively shoreline cafes.
- **Rules & Safety:** Never cross inside the yellow bathing buoys line. Do not stay overnight if the wind is forecast to veer North or North-West.

### 3. Temporary Stopover in the Inner Abra: By Arriluze Lighthouse
Close to historic Arriluze lighthouse and the Real Club Marítimo del Abra:
- **Best conditions:** Ideal for a lunchtime pause sheltered from heavy Westerlies outside.
- **Current awareness:** The Nervión river mouth generates flood and ebb tidal currents. Allow a wide swinging radius to account for 180° swing when tides turn.

### 4. Golden Rules for Anchoring in Getxo
1. **Check local tide tables:** Add high water height to chart soundings to ensure you do not ground at low water nor come up short on anchor rode at high tide.
2. **Anchor tripping line:** Use an anchor buoy if near rocky transitions to retrieve your anchor easily if fouled.
3. **Anchor drag alarm:** Always activate GPS anchor watch on your nautical chartplotter.

Enjoying an evening anchorage across the calm waters of Getxo after a training sail is one of the Basque coast's finest pleasures.`
        },
        fr: {
            title: "Les meilleurs mouillages de l'Abra de Getxo",
            excerpt: "Explorez les mouillages les plus pittoresques et abrités de notre littoral, avec des conseils sur la tenue des fonds.",
            author: 'Angharad Arambalza',
            content: `# Les meilleurs mouillages de l'Abra de Getxo

L'Abra de Getxo est l'une des baies les plus remarquables de la côte basque pour les navigateurs. Protégée par les grandes digues de Punta Lucero et d'Arriluze, elle offre un cadre exceptionnel pour la voile et les escales au mouillage dans un décor maritime chargé d'histoire.

Toutefois, mouiller en mer Cantabrique exige une bonne maîtrise des marées (avec un marnage qui dépasse 4 mètres lors des grandes marées) et la connaissance des fonds. Voici les meilleurs mouillages et consignes pour jeter l'ancre en sécurité dans l'Abra.

---

### 1. Mouillage sous la digue d'Arriluze et le port de plaisance
À l'abri de la digue d'Arriluze et des bassins du port de plaisance de Getxo, ce secteur est le mieux protégé de la houle de Nord-Ouest (NW), dominante sur notre littoral.
- **Nature du fond:** Sable et vase fine (**A/F**), assurant une excellente tenue pour les ancres de type charrue (Delta, Rocna ou CQR).
- **Sonde:** 3 à 6 mètres de profondeur à basse mer.
- **Avantages:** Plan d'eau très calme en été et accès rapide en annexe aux pontons.
- **Précautions:** Respecter impérativement le chenal d'accès balisé du port.

### 2. Mouillage forain de jour devant la plage d'Ereaga et le Port Vieux d'Algorta
Face aux demeures historiques de Las Arenas et à la plage d'Ereaga, ce site est idéal pour une escale de jour par brise thermique légère de Sud ou d'Est.
- **Fond et longueur de chaîne:** Sable doré. Filer au minimum **4 à 5 fois la hauteur d'eau à marée haute**.
- **Panorama:** Vue imprenable sur les maisons blanches du Puerto Viejo, le pont suspendu de Biscaye (Patrimoine mondial de l'UNESCO) et les terrasses d'Ereaga.
- **Sécurité et réglementation:** Ne jamais franchir la ligne des bouées jaunes délimitant la zone de baignade. Mouillage déconseillé pour la nuit en cas de bascule du vent au secteur Nord.

### 3. Halte temporaire dans l'Abra intérieur: Sous le phare d'Arriluze
Près du phare historique d'Arriluze et du Real Club Marítimo del Abra:
- **Conditions idéales:** Parfait pour un déjeuner à bord abrité des coups de vent d'Ouest.
- **Courants de marée:** L'embouchure de l'estuaire du Nervión génère des courants de jusant et flot sensibles pouvant faire éviter le bateau de 180° au renversement de marée. Prévoyez un cercle d'évitage suffisant.

### 4. Conseils essentiels pour mouiller à Getxo
1. **Consulter l'annuaire des marées de Bilbao / Getxo:** Calculez précisément la hauteur d'eau pour ne pas talonner à marée basse ni manquer de chaîne à marée haute.
2. **Orinquer son ancre:** Utilisez un orin muni d'un flotteur si vous mouillez à proximité de fonds rocheux.
3. **Alarme de mouillage GPS:** Activez l'alarme de dérive sur votre traceur ou application marine.

Passer une fin de journée au mouillage sur l'Abra de Getxo après une belle navigation est l'une des expériences les plus mémorables de notre littoral.`
        }
    },
    'getxo-bela-eskola-impulsa-una-nueva-temporada-para-acercar-la-vela-a-todas-las-edades': {
        es: {
            title: 'Getxo Bela Eskola impulsa una nueva temporada para acercar la vela a todas las edades',
            excerpt: 'Cursos de vela, titulaciones náuticas y entrenamientos de regata para todas las edades desde el Muelle de Arriluze.',
            author: 'Getxo Bela Eskola',
            content: `# Getxo Bela Eskola impulsa una nueva temporada para acercar la vela a todas las edades

La navegación a vela continúa ganando protagonismo en la costa vizcaína y Getxo Bela Eskola afronta una nueva temporada reforzando su compromiso con la formación, el deporte y la divulgación del mundo náutico.

La escuela mantiene una amplia oferta de cursos dirigidos tanto a niños como a adultos, adaptados a diferentes niveles de experiencia. Desde quienes desean descubrir por primera vez la navegación hasta quienes buscan perfeccionar su técnica, todos encuentran un espacio para aprender disfrutando del mar.

Además de la formación práctica, Getxo Bela Eskola continúa ofreciendo titulaciones oficiales de recreo, alquiler de embarcaciones y entrenamientos para sus equipos de Optimist, Laser y 420, fomentando así la continuidad deportiva durante todo el año.

Las instalaciones del Muelle Arriluzea permiten un acceso privilegiado al Abra de Getxo, uno de los mejores escenarios del Cantábrico para iniciarse y perfeccionar la navegación a vela gracias a la variedad de condiciones de viento y mar que ofrece durante toda la temporada.

La escuela mantiene como objetivo principal acercar la cultura marítima a nuevas generaciones y seguir promoviendo valores como el trabajo en equipo, el respeto por el medio marino, la autonomía y la seguridad en la navegación.

Con esta propuesta, Getxo Bela Eskola continúa consolidándose como uno de los referentes de la enseñanza de la vela en Bizkaia, ofreciendo actividades durante prácticamente todo el año para personas de todas las edades.`
        },
        eu: {
            title: 'Getxo Bela Eskolak bela adin guztietara hurbiltzeko denboraldi berria bultzatzen du',
            excerpt: 'Bela ikastaroak, titulazio nautikoak eta estropada entrenamenduak adin guztientzat Arriluzeko kaitik.',
            author: 'Getxo Bela Eskola',
            content: `# Getxo Bela Eskolak bela adin guztietara hurbiltzeko denboraldi berria bultzatzen du

Bela nabigazioak gero eta presentzia handiagoa dauka Bizkaiko kostaldean, eta Getxo Bela Eskolak denboraldi berriari ekin dio itsas kulturaren, kirolaren eta prestakuntzaren aldeko apustua indartuz.

Eskolak haur zein helduentzako ikastaro ugari eskaintzen jarraitzen du, maila guztietara egokituta. Belan lehen urratsak eman nahi dituztenek zein beren teknika hobetu nahi dutenek aukera egokia aurkituko dute.

Prestakuntzaz gain, Getxo Bela Eskolak aisialdiko titulazio ofizialak, ontzien alokairua eta Optimist, Laser eta 420 taldeentzako entrenamenduak eskaintzen jarraitzen du, urte osoan zehar bela praktikatzeko aukera sustatuz.

Arriluzeko kaian kokatutako instalazioek Getxoko Abrara irteera zuzena eskaintzen dute. Kantauri itsasoko gune ezin hobea da bela ikasteko eta hobetzeko, haize eta itsaso baldintza askotarikoak baititu.

Eskolaren helburu nagusietako bat itsas kultura belaunaldi berriei hurbiltzea da, talde-lana, itsas ingurumenarekiko errespetua, autonomia eta nabigazio segurua bezalako balioak sustatuz.

Ekimen honen bidez, Getxo Bela Eskolak Bizkaiko bela irakaskuntzako erreferenteetako bat izaten jarraitzen du, urte osoan zehar adin guztietako pertsonentzako jarduerak eskainiz.`
        },
        en: {
            title: 'Getxo Bela Eskola launches a new season to bring sailing to all ages',
            excerpt: 'Sailing courses, official certifications, and regatta training for all ages from Arriluze Quay.',
            author: 'Getxo Bela Eskola',
            content: `# Getxo Bela Eskola launches a new season to bring sailing to all ages

Sailing continues to flourish along the Biscay coast, and Getxo Bela Eskola begins a new season reaffirming its dedication to marine education, sport, and maritime heritage.

The school provides an extensive curriculum of courses for children, teenagers, and adults alike, tailored to every level of experience. From complete beginners discovering the sea for the first time to experienced sailors refining high-performance trim, everyone finds their place on the water.

In addition to practical seamanship courses, Getxo Bela Eskola offers official recreational skipper certifications, boat rentals, and year-round regatta training programs for its Optimist, ILCA / Laser, and 420 fleets.

Operating from Arriluze Pier provides direct, unhindered access to the Abra of Getxo—one of the Bay of Biscay's premier sailing grounds thanks to its diverse wind patterns and protected waters.

The school's mission is to pass on maritime culture to future generations, fostering teamwork, marine stewardship, independence, and water safety.

Getxo Bela Eskola continues to be a leading benchmark for sailing education in the Basque Country, offering nautical programs all year round.`
        },
        fr: {
            title: 'Getxo Bela Eskola lance une nouvelle saison pour ouvrir la voile à tous les âges',
            excerpt: 'Stages de voile, permis plaisance et entraînements régate pour tous les âges depuis le quai d’Arriluze.',
            author: 'Getxo Bela Eskola',
            content: `# Getxo Bela Eskola lance une nouvelle saison pour ouvrir la voile à tous les âges

La pratique de la voile continue de gagner en dynamisme sur la côte basque et Getxo Bela Eskola ouvre une nouvelle saison en renforçant son engagement envers l'apprentissage nautique, le sport et la culture maritime.

L'école propose une offre complète de stages destinés aux enfants comme aux adultes, adaptés à tous les niveaux. Des débutants découvrant les sensations de la barre jusqu'aux marins confirmés perfectionnant leur technique de régate, chacun trouve un environnement privilégié pour progresser.

Au-delà des cours pratiques, Getxo Bela Eskola prépare aux permis bateaux officiels, propose la location de voiliers et anime les entraînements réguliers de ses équipes jeunes et adultes (Optimist, ILCA / Laser, 420).

Idéalement située sur le quai d'Arriluze, l'école bénéficie d'un accès immédiat à l'Abra de Getxo, l'un des meilleurs plans d'eau du golfe de Gascogne grâce à la variété des conditions de vent et de mer tout au long de l'année.

La transmission des valeurs marines — esprit d'équipe, respect de l'environnement littoral, autonomie et sécurité — demeure au cœur du projet pédagogique de l'école.

Getxo Bela Eskola s'affirme ainsi comme l'une des écoles de référence pour l'enseignement de la voile en Biscaye.`
        }
    }
};
