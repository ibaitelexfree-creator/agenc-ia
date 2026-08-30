const fs = require('fs');

const data = {
  en: {
    s2_identity: {
      title_line1: "What is",
      title_line2: "Getxo Bela Eskola?",
      value1_prefix: "We are not a conventional school, but a ",
      value1_highlight: "close-knit community built on values.",
      value2: "A place to <gold>learn to sail</gold>, share, and <gold>enjoy</gold> the sea.",
      modal_p1: "We are not a conventional school, but a close community built around the sea and the values that accompany it.",
      modal_p2: "A place where learning to sail goes hand in hand with sharing, enjoying, and growing as a group. Here, sailing is not just experienced as a sport, but as an experience that connects people with each other and with the environment.",
      modal_p3: "We believe in natural, accessible, and pressure-free learning, where each person finds their rhythm and their way of experiencing sailing. From those taking their first steps to those looking to keep advancing, everyone has their space.",
      modal_p4: "Beyond the water, we are a meeting point where bonds and trust are generated, and a way of understanding the sea that invites you to return."
    },
    s3_adapts_new: {
      title: "SAILING<br/>ADAPTS TO YOU",
      subtitle: "Small or large sailboats,<br/>calm or action-packed days,<br/>sheltered waters or open sea.<br/>You choose how you want to sail.",
      modal: {
        title: "Sailing à la carte, according to how you want to experience the sea.",
        intro1: "Sailing is not a rigid sport. It is a way of experiencing the sea that adapts to you, your time, and what you feel like doing each day.",
        intro2: "Today we have very precise weather forecasts and clear wind patterns. In our courses, you learn not only to sail but to understand and anticipate conditions. Thus, you can choose with fairly high certainty when and how to go out.",
        experience_title: "You choose the type of experience",
        experience_1: "Calm: heading out after work, disconnecting on a small or shared sailboat, sailing unhurriedly.",
        experience_2: "Action: windy days, more intensity, dynamic maneuvers, and strong sensations.",
        experience_3: "Sailing allows you both.",
        scenario_title: "You choose the setting",
        scenario_1: "Inner Abra: protected and calm waters, ideal for learning or relaxing.",
        scenario_2: "Outer Abra: open sea, waves, and a more lively and exciting navigation.",
        who_title: "You choose who to sail with",
        who_1: "Small sailboats: solo or in groups of 2 to 6 people, with active participation.",
        who_2: "Large sailboats (cruisers): up to 8 people, although the ideal is between 2 and 6 for a dynamic experience.",
        modern_title: "A modern way to sail",
        modern_1: "In the past, great sailors were forged because they knew how they went out, but not how they would return.",
        modern_2: "Today we can foresee conditions with great precision.",
        modern_3: "Sailing remains authentic, but now it is also more conscious, accessible, and, above all, adaptable to each person."
      }
    }
  },
  fr: {
    s2_identity: {
      title_line1: "Qu'est-ce que",
      title_line2: "Getxo Bela Eskola ?",
      value1_prefix: "Nous ne sommes pas une école conventionnelle, mais une ",
      value1_highlight: "communauté proche et porteuse de valeurs.",
      value2: "Un lieu pour <gold>apprendre à naviguer</gold>, partager et <gold>profiter</gold> de la mer.",
      modal_p1: "Nous ne sommes pas une école conventionnelle, mais une communauté proche construite autour de la mer et des valeurs qui l'accompagnent.",
      modal_p2: "Un lieu où apprendre à naviguer va de pair avec partager, profiter et grandir en groupe. Ici, la voile ne se vit pas seulement comme un sport, mais comme une expérience qui relie les personnes entre elles et avec l'environnement.",
      modal_p3: "Nous croyons en un apprentissage naturel, accessible et sans pression, où chaque personne trouve son rythme et sa façon de vivre la navigation. De ceux qui font leurs premiers pas à ceux qui cherchent à continuer d'avancer, tout le monde a sa place.",
      modal_p4: "Au-delà de l'eau, nous sommes un point de rencontre où se créent des liens, de la confiance et une façon de comprendre la mer qui donne envie d'y revenir."
    },
    s3_adapts_new: {
      title: "LA VOILE<br/>S'ADAPTE À VOUS",
      subtitle: "Petits ou grands voiliers,<br/>jours de calme ou d'action,<br/>eaux tranquilles ou pleine mer.<br/>Vous choisissez comment naviguer.",
      modal: {
        title: "Navigation à la carte, selon la façon dont vous souhaitez vivre la mer.",
        intro1: "La voile n'est pas un sport rigide. C'est une façon de vivre la mer qui s'adapte à vous, à votre temps et à ce dont vous avez envie chaque jour.",
        intro2: "Aujourd'hui, nous disposons de prévisions météorologiques très précises et de modèles de vent clairs. Dans nos cours, vous apprenez non seulement à naviguer, mais aussi à comprendre et à anticiper les conditions. Ainsi, vous pouvez choisir avec une grande certitude quand et comment sortir.",
        experience_title: "Vous choisissez le type d'expérience",
        experience_1: "Calme : sortir après le travail, déconnecter sur un petit voilier ou en partage, naviguer sans hâte.",
        experience_2: "Action : jours de vent, plus d'intensité, manœuvres dynamiques et sensations fortes.",
        experience_3: "La voile vous permet les deux.",
        scenario_title: "Vous choisissez le décor",
        scenario_1: "Abra intérieur : eaux protégées et tranquilles, idéales pour apprendre ou se détendre.",
        scenario_2: "Abra extérieur : pleine mer, vagues et une navigation plus vivante et excitante.",
        who_title: "Vous choisissez avec qui naviguer",
        who_1: "Petits voiliers : en solitaire ou en groupes de 2 à 6 personnes, avec une participation active.",
        who_2: "Grands voiliers (croiseurs) : jusqu'à 8 personnes, bien que l'idéal soit entre 2 et 6 pour une expérience dynamique.",
        modern_title: "Une façon moderne de naviguer",
        modern_1: "Autrefois, de grands marins se forgeaient car ils savaient comment ils partaient, mais pas comment ils reviendraient.",
        modern_2: "Aujourd'hui, nous pouvons prévoir les conditions avec une grande précision.",
        modern_3: "La voile reste authentique, mais elle est maintenant aussi plus consciente, accessible et, surtout, adaptable à chaque personne."
      }
    }
  },
  eu: {
    s2_identity: {
      title_line1: "Zer da",
      title_line2: "Getxo Bela Eskola?",
      value1_prefix: "Ez gara eskola konbentzional bat, baizik eta ",
      value1_highlight: "balioak dituen komunitate hurbil bat.",
      value2: "Itsasoaz <gold>gozatzeko</gold>, partekatzeko eta <gold>nabigatzen ikasteko</gold> lekua.",
      modal_p1: "Ez gara eskola konbentzional bat, baizik eta itsasoaren eta horrekin datozen balioen inguruan eraikitako komunitate hurbil bat.",
      modal_p2: "Nabigatzen ikastea taldean partekatzearekin, gozatzearekin eta haztearekin batera doan lekua. Hemen, bela ez da kirol gisa soilik bizi, pertsonak elkarrekin eta ingurunearekin lotzen dituen esperientzia gisa baizik.",
      modal_p3: "Ikaskuntza natural, eskuragarri eta presiorik gabekoan sinesten dugu, non pertsona bakoitzak bere erritmoa eta nabigazioa bizitzeko modua aurkitzen dituen. Lehen urratsak ematen dituztenetatik hasi eta aurrera egiten jarraitu nahi dutenetaraino, guztiek dute beren lekua.",
      modal_p4: "Uretatik haratago, loturak, konfiantza eta itzultzera gonbidatzen duen itsasoa ulertzeko modu bat sortzen den topagunea gara."
    },
    s3_adapts_new: {
      title: "BELA ZURI<br/>EGOKITZEN ZAIO",
      subtitle: "Belaontzi txikiak edo handiak,<br/>lasaitasun edo ekintza egunak,<br/>ur lasaiak edo itsaso zabala.<br/>Zuk aukeratzen duzu nola nabigatu nahi duzun.",
      modal: {
        title: "Nahierarako nabigazioa, itsasoa nola bizi nahi duzun arabera.",
        intro1: "Bela ez da kirol zurruna. Itsasoa bizitzeko modu bat da, zuri, zure denborari eta egun bakoitzean nahi duzunari egokitzen zaiona.",
        intro2: "Gaur egun oso iragarpen meteorologiko zehatzak eta haize eredu argiak ditugu. Gure ikastaroetan ez duzu nabigatzen bakarrik ikasten, baldintzak ulertzen eta aurreikusten ere ikasten duzu. Horrela, nahiko ziurtasunez aukeratu dezakezu noiz eta nola atera.",
        experience_title: "Zuk aukeratzen duzu esperientzia mota",
        experience_1: "Lasaitasuna: lanaren ondoren irtetea, belaontzi txiki edo partekatu batean deskonektatzea, presarik gabe nabigatuz.",
        experience_2: "Ekintza: haize egunak, intentsitate handiagoa, maniobra dinamikoak eta sentsazio indartsuak.",
        experience_3: "Belak biak ahalbidetzen dizkizu.",
        scenario_title: "Zuk aukeratzen duzu eszenatokia",
        scenario_1: "Barruko Abra: ur babestu eta lasaiak, ikasteko edo erlaxatzeko ezin hobeak.",
        scenario_2: "Kanpoko Abra: itsaso zabala, olatuak eta nabigazio biziagoa eta zirraragarriagoa.",
        who_title: "Zuk aukeratzen duzu norekin nabigatu",
        who_1: "Belaontzi txikiak: bakarka edo 2 eta 6 pertsona bitarteko taldeetan, parte-hartze aktiboarekin.",
        who_2: "Belaontzi handiak (gurutzaontziak): 8 pertsona arte, nahiz eta ezin hobea 2 eta 6 artekoa izan esperientzia dinamiko bat izateko.",
        modern_title: "Nabigatzeko modu modernoa",
        modern_1: "Antzina marinel handiak sortzen ziren nola irteten ziren bazekitelako, baina ez nola itzuliko ziren.",
        modern_2: "Gaur egun baldintzak zehaztasun handiz aurreikus ditzakegu.",
        modern_3: "Belak benetakoa izaten jarraitzen du, baina orain kontzienteagoa, eskuragarriagoa eta, batez ere, pertsona bakoitzari moldagarriagoa da."
      }
    }
  },
  es: {
    s2_identity: {
      title_line1: "¿Qué es",
      title_line2: "Getxo Bela Eskola?",
      value1_prefix: "No somos una escuela convencional, sino una ",
      value1_highlight: "comunidad cercana y con valores.",
      value2: "Un lugar donde <gold>aprender a navegar</gold>, compartir y <gold>disfrutar</gold> de la mar.",
      modal_p1: "No somos una escuela convencional, sino una comunidad cercana construida alrededor de la mar y los valores que la acompañan.",
      modal_p2: "Un lugar donde aprender a navegar va de la mano de compartir, disfrutar y crecer en grupo. Aquí la vela no se vive solo como un deporte, sino como una experiencia que conecta a las personas entre sí y con el entorno.",
      modal_p3: "Creemos en un aprendizaje natural, accesible y sin presión, donde cada persona encuentra su ritmo y su manera de vivir la navegación. Desde quienes dan sus primeros pasos hasta quienes buscan seguir avanzando, todas tienen su espacio.",
      modal_p4: "Más allá del agua, somos un punto de encuentro donde se generan vínculos, confianza y una forma de entender la mar que invita a volver."
    },
    s3_adapts_new: {
      title: "LA VELA SE<br/>ADAPTA A TI",
      subtitle: "Veleros pequeños o grandes,<br/>días de calma o de acción,<br/>aguas tranquilas o mar abierta.<br/>Tú eliges cómo quieres navegar.",
      modal: {
        title: "Navegación a la carta, según cómo quieras vivir el mar.",
        intro1: "La vela no es un deporte rígido. Es una forma de vivir el mar que se adapta a ti, a tu tiempo y a lo que te apetece cada día.",
        intro2: "Hoy contamos con partes meteorológicos muy precisos y patrones de viento claros. En nuestros cursos aprendes no solo a navegar, sino a entender y anticipar las condiciones. Así, puedes elegir con bastante certeza cuándo y cómo salir.",
        experience_title: "Tú eliges el tipo de experiencia",
        experience_1: "Calma: salir después del trabajo, desconectar en un velero pequeño o compartido, navegando sin prisa.",
        experience_2: "Acción: días de viento, más intensidad, maniobras dinámicas y sensaciones fuertes.",
        experience_3: "La vela te permite ambas.",
        scenario_title: "Tú eliges el escenario",
        scenario_1: "Abra interior: aguas protegidas y tranquilas, ideales para aprender o relajarse.",
        scenario_2: "Abra exterior: mar abierto, olas y una navegación más viva y emocionante.",
        who_title: "Tú eliges con quién navegar",
        who_1: "Veleros pequeños: en solitario o en grupos de 2 a 6 personas, con participación activa.",
        who_2: "Veleros grandes (cruceros): hasta 8 personas, aunque lo ideal es entre 2 y 6 para una experiencia dinámica.",
        modern_title: "Una forma moderna de navegar",
        modern_1: "Antes se forjaban grandes marineros porque sabían cómo salían, pero no cómo volverían.",
        modern_2: "Hoy podemos prever las condiciones con mucha precisión.",
        modern_3: "La vela sigue siendo auténtica, pero ahora también es más consciente, accesible y, sobre todo, adaptable a cada persona."
      }
    }
  }
};

for (const lang of ['en', 'fr', 'eu', 'es']) {
  const filePath = `./messages/${lang}.json`;
  if (fs.existsSync(filePath)) {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // S2
    if (!fileData.s2_identity) fileData.s2_identity = {};
    Object.assign(fileData.s2_identity, data[lang].s2_identity);
    
    // S3
    if (!fileData.s3_adapts_new) fileData.s3_adapts_new = {};
    if (!fileData.s3_adapts_new.modal) fileData.s3_adapts_new.modal = {};
    Object.assign(fileData.s3_adapts_new.modal, data[lang].s3_adapts_new.modal);
    fileData.s3_adapts_new.title = data[lang].s3_adapts_new.title;
    fileData.s3_adapts_new.subtitle = data[lang].s3_adapts_new.subtitle;
    
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
