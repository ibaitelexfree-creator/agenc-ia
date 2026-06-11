export interface AreaData {
  id: string;
  emoji: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  color: string;
}

export interface ValorData {
  icon: string;
  titulo: string;
  texto: string;
}

export interface VoluntariadoTranslations {
  heroLabel: string;
  heroTitleWords: string[];
  heroSubtitle: string;
  areasTitle: string;
  valoresTitle: string;
  accordionIntro: string;
  accordionParagraphs: string[];
  accordionMore: string;
  accordionLess: string;
  ctaFrase: string;
  ctaButton: string;
  whatsappMessage: string;
}

export const voluntariadoTranslations: Record<string, VoluntariadoTranslations> = {
  es: {
    heroLabel: "VOLUNTARIADO",
    heroTitleWords: ["¿Tienes", "tiempo", "y", "ganas", "de", "aportar", "algo?"],
    heroSubtitle: "Te estamos esperando.",
    areasTitle: "¿En qué puedes involucrarte?",
    valoresTitle: "Ser voluntaria es también...",
    accordionIntro: "¿Tienes tiempo y ganas de aportar algo? Únete a nuestro equipo de voluntariado en eventos deportivos, regatas adaptadas y campañas de conservación medioambiental en la ría, y vive la experiencia de ayudar en la escuela de vela.",
    accordionParagraphs: [
      "Participar como voluntaria no solo significa colaborar, sino también formar parte de nuestra comunidad, aprender nuevas habilidades, disfrutar del mar y conocer a personas que comparten tus mismos intereses.",
      "En Getxo Bela Eskola encontrarás un ambiente cercano, divertido y muy positivo, donde cada aportación es valorada y cada momento cuenta.",
      "Ser voluntaria en nuestra asociación es también una oportunidad para crecer personalmente: mejorar tu coordinación, aprender sobre navegación, descubrir cómo funciona una escuela de vela y experimentar de primera mano la magia de la mar.",
      "Si tienes curiosidad, ganas de aprender y un poquito de tiempo para compartir, hazte voluntaria y súmate a esta aventura única en la mar. ¡Tu entusiasmo marcará la diferencia!"
    ],
    accordionMore: "Leer más sobre el voluntariado",
    accordionLess: "Cerrar",
    ctaFrase: "Somos una asociación sin ánimo de lucro. Tu colaboración nos permite seguir ofreciendo estas experiencias únicas.",
    ctaButton: "¡Quiero ser voluntaria! 🌊",
    whatsappMessage: "¡Hola! Me gustaría ser voluntaria en Getxo Bela Eskola"
  },
  eu: {
    heroLabel: "BOLUNTARIOTZA",
    heroTitleWords: ["Denbora", "eta", "laguntzeko", "gogoa", "al", "duzu?"],
    heroSubtitle: "Zure zain gaude.",
    areasTitle: "Zertan lagun dezakezu?",
    valoresTitle: "Boluntario izatea baita ere...",
    accordionIntro: "Denbora eta laguntzeko gogoa al duzu? Batu zaitez gure boluntariotza taldera kirol ekitaldietan, estropada egokituetan eta itsasadarra kontserbatzeko ingurumen-kanpainetan, eta bizi ezazu bela eskolan laguntzeko esperientzia.",
    accordionParagraphs: [
      "Boluntario gisa parte hartzeak lankidetzan aritzeaz gain, gure komunitateko kide izatea, trebetasun berriak ikastea, itsasoaz gozatzea eta zure interes berdinak dituzten pertsonak ezagutzea ere esan nahi du.",
      "Getxo Bela Eskolan giro hurbila, dibertigarria eta oso positiboa aurkituko duzu, non ekarpen bakoitza baloratzen den eta une bakoitzak garrantzia duen.",
      "Gure elkartean boluntario izatea hazkunde pertsonalerako aukera ere bada: koordinazioa hobetu, nabigazioari buruz ikasi, bela eskola batek barnean nola funtzionatzen duen ezagutu eta itsasoaren magia bertatik bertara bizi.",
      "Jakin-mina baduzu, ikasteko gogoa eta partekatzeko denbora pixka bat baduzu, egin zaitez boluntario eta batu itsasoko abentura paregabe honetara. Zure ilusioak diferentzia egingo du!"
    ],
    accordionMore: "Irakurri gehiago boluntariotzari buruz",
    accordionLess: "Itxi",
    ctaFrase: "Irabazi-asmorik gabeko elkartea gara. Zure laguntzari esker, esperientzia paregabe hauek eskaintzen jarrai gaitezke.",
    ctaButton: "Boluntario izan nahi dut! 🌊",
    whatsappMessage: "Kaixo! Getxo Bela Eskolan boluntario izatea gustatuko litzaidake"
  },
  en: {
    heroLabel: "VOLUNTEERING",
    heroTitleWords: ["Do", "you", "have", "time", "and", "want", "to", "contribute?"],
    heroSubtitle: "We are waiting for you.",
    areasTitle: "How can you get involved?",
    valoresTitle: "Being a volunteer is also about...",
    accordionIntro: "Do you have time and want to contribute? Join our volunteer team in sports events, adapted regattas, and environmental conservation campaigns in the estuary, and experience helping at the sailing school.",
    accordionParagraphs: [
      "Participating as a volunteer not only means collaborating, but also being part of our community, learning new skills, enjoying the sea, and meeting people who share your interests.",
      "At Getxo Bela Eskola you will find a close, fun, and very positive atmosphere, where every contribution is valued and every moment counts.",
      "Being a volunteer in our association is also an opportunity to grow personally: improve your coordination, learn about navigation, discover how a sailing school works from the inside, and experience the magic of the sea firsthand.",
      "If you have curiosity, a desire to learn, and a little time to share, become a volunteer and join this unique adventure at sea. Your enthusiasm will make a difference!"
    ],
    accordionMore: "Read more about volunteering",
    accordionLess: "Close",
    ctaFrase: "We are a non-profit association. Your collaboration allows us to continue offering these unique experiences.",
    ctaButton: "I want to volunteer! 🌊",
    whatsappMessage: "Hello! I would like to volunteer at Getxo Bela Eskola"
  },
  fr: {
    heroLabel: "BÉNÉVOLAT",
    heroTitleWords: ["Avez-vous", "du", "temps", "et", "l'envie", "de", "contribuer", "?"],
    heroSubtitle: "Nous vous attendons.",
    areasTitle: "Comment pouvez-vous vous impliquer ?",
    valoresTitle: "Être bénévole, c'est aussi...",
    accordionIntro: "Avez-vous du temps et l'envie de contribuer ? Rejoignez notre équipe de bénévoles lors d'événements sportifs, de régates adaptées et de campagnes de conservation de l'environnement dans l'estuaire, et vivez l'expérience d'aider à l'école de voile.",
    accordionParagraphs: [
      "Participer en tant que bénévole ne signifie pas seulement collaborer, mais aussi faire partie de notre communauté, acquérir de nouvelles compétences, profiter de la mer et rencontrer des personnes qui partagent vos intérêts.",
      "À Getxo Bela Eskola, vous trouverez une ambiance chaleureuse, amusante et très positive, où chaque contribution est valorisée et chaque moment compte.",
      "Être bénévole au sein de notre association est aussi une opportunité de grandir personnellement : améliorer sa coordination, apprendre la navigation, découvrir le fonctionnement d'une école de voile de l'intérieur et vivre la magie de la mer en direct.",
      "Si vous êtes curieux, avez envie d'apprendre et un peu de temps à partager, devenez bénévole et rejoignez cette aventure unique en mer. Votre enthousiasme fera la différence !"
    ],
    accordionMore: "En savoir plus sur le bénévolat",
    accordionLess: "Fermer",
    ctaFrase: "Nous sommes une association à but non lucratif. Votre collaboration nous permet de continuer à proposer ces expériences uniques.",
    ctaButton: "Je veux devenir bénévole ! 🌊",
    whatsappMessage: "Bonjour ! J'aimerais devenir bénévole à Getxo Bela Eskola"
  }
};

export const voluntariadoAreas: Record<string, AreaData[]> = {
  es: [
    {
      id: "actividades",
      emoji: "⛵",
      titulo: "Organización",
      subtitulo: "de actividades",
      descripcion: "Ayuda a coordinar y planificar las actividades del día a día en la escuela.",
      color: "#E8F4FD"
    },
    {
      id: "agua",
      emoji: "🌊",
      titulo: "En el agua",
      subtitulo: "con los monitores",
      descripcion: "Asiste a nuestros monitores durante las sesiones de vela. ¡El mejor puesto!",
      color: "#E8F4FD"
    },
    {
      id: "eventos",
      emoji: "🎉",
      titulo: "Eventos",
      subtitulo: "y regatas adaptadas",
      descripcion: "Colabora en eventos deportivos y regatas adaptadas para toda la comunidad.",
      color: "#F5F0E8"
    },
    {
      id: "medioambiente",
      emoji: "🌿",
      titulo: "Medio ambiente",
      subtitulo: "conservación de la ría",
      descripcion: "Forma parte de nuestras campañas de conservación medioambiental en la ría.",
      color: "#F5F0E8"
    }
  ],
  eu: [
    {
      id: "actividades",
      emoji: "⛵",
      titulo: "Antolakuntza",
      subtitulo: "jardueren kudeaketa",
      descripcion: "Eskolako eguneroko jarduerak koordinatzen eta planifikatzen laguntzen du.",
      color: "#E8F4FD"
    },
    {
      id: "agua",
      emoji: "🌊",
      titulo: "Uretan",
      subtitulo: "monitoreekin batera",
      descripcion: "Lagundu gure monitoreei bela saioetan. Lekurik onena eta zirraragarriena!",
      color: "#E8F4FD"
    },
    {
      id: "eventos",
      emoji: "🎉",
      titulo: "Ekitaldiak",
      subtitulo: "eta estropada egokituak",
      descripcion: "Kirol-ekitaldietan eta estropada egokituetan lagundu komunitate osoarentzat.",
      color: "#F5F0E8"
    },
    {
      id: "medioambiente",
      emoji: "🌿",
      titulo: "Ingurumena",
      subtitulo: "itsasadarra babestea",
      descripcion: "Parte hartu itsasadarra babesteko gure ingurumen-kanpainetan eta garbitasun ekintzetan.",
      color: "#F5F0E8"
    }
  ],
  en: [
    {
      id: "actividades",
      emoji: "⛵",
      titulo: "Organization",
      subtitulo: "of activities",
      descripcion: "Help coordinate and plan the daily activities at the school.",
      color: "#E8F4FD"
    },
    {
      id: "agua",
      emoji: "🌊",
      titulo: "On the water",
      subtitulo: "with instructors",
      descripcion: "Assist our instructors during sailing sessions. The best spot in the house!",
      color: "#E8F4FD"
    },
    {
      id: "eventos",
      emoji: "🎉",
      titulo: "Events",
      subtitulo: "and adapted regattas",
      descripcion: "Collaborate in sporting events and adapted regattas for the entire community.",
      color: "#F5F0E8"
    },
    {
      id: "medioambiente",
      emoji: "🌿",
      titulo: "Environment",
      subtitulo: "estuary conservation",
      descripcion: "Be part of our environmental conservation and cleanup campaigns in the estuary.",
      color: "#F5F0E8"
    }
  ],
  fr: [
    {
      id: "actividades",
      emoji: "⛵",
      titulo: "Organisation",
      subtitulo: "des activités",
      descripcion: "Aidez à coordonner et planifier les activités quotidiennes au sein de l'école.",
      color: "#E8F4FD"
    },
    {
      id: "agua",
      emoji: "🌊",
      titulo: "Sur l'eau",
      subtitulo: "avec les moniteurs",
      descripcion: "Assistez nos moniteurs pendant les sessions de voile. Le meilleur poste sur l'eau !",
      color: "#E8F4FD"
    },
    {
      id: "eventos",
      emoji: "🎉",
      titulo: "Événements",
      subtitulo: "et régates adaptées",
      descripcion: "Collaborez aux événements sportifs et régates adaptées pour toute la communauté.",
      color: "#F5F0E8"
    },
    {
      id: "medioambiente",
      emoji: "🌿",
      titulo: "Environnement",
      subtitulo: "conservation de l'estuaire",
      descripcion: "Participez à nos campagnes de conservation de l'environnement et de nettoyage de l'estuaire.",
      color: "#F5F0E8"
    }
  ]
};

export const voluntariadoValores: Record<string, ValorData[]> = {
  es: [
    {
      icon: "🧭",
      titulo: "Crece personalmente",
      texto: "Mejora tu coordinación y descubre nuevas habilidades que van más allá del mar."
    },
    {
      icon: "⚓",
      titulo: "Aprende navegación",
      texto: "Descubre cómo funciona una escuela de vela desde adentro."
    },
    {
      icon: "💛",
      titulo: "Ve la magia",
      texto: "Vivirás la satisfacción de ver cómo los demás disfrutan gracias a tu ayuda."
    },
    {
      icon: "🌱",
      titulo: "Vive la aventura",
      texto: "Compañerismo, buena energía y el mar como escenario permanente."
    }
  ],
  eu: [
    {
      icon: "🧭",
      titulo: "Haz zaitez pertsonalki",
      texto: "Hobetu zure koordinazioa eta itsasotik haratago doazen trebetasun berriak ezagutu."
    },
    {
      icon: "⚓",
      titulo: "Nabigazioa ikasi",
      texto: "Ezagutu bela eskola bat barrutik nola funtzionatzen duen."
    },
    {
      icon: "💛",
      titulo: "Ikusi magia",
      texto: "Zure laguntzari esker besteek nola gozatzen duten ikustearen asebetetzea biziko duzu."
    },
    {
      icon: "🌱",
      titulo: "Bizi abentura",
      texto: "Kidegoa, energia ona eta itsasoa etengabeko agertoki gisa."
    }
  ],
  en: [
    {
      icon: "🧭",
      titulo: "Grow personally",
      texto: "Improve your coordination and discover new skills that go beyond the sea."
    },
    {
      icon: "⚓",
      titulo: "Learn sailing",
      texto: "Discover how a sailing school operates from the inside."
    },
    {
      icon: "💛",
      titulo: "See the magic",
      texto: "Experience the satisfaction of seeing others enjoy thanks to your help."
    },
    {
      icon: "🌱",
      titulo: "Live the adventure",
      texto: "Companionship, good energy, and the sea as a permanent backdrop."
    }
  ],
  fr: [
    {
      icon: "🧭",
      titulo: "Grandir personnellement",
      texto: "Améliorez votre coordination et découvrez de nouvelles compétences qui vont au-delà de la mer."
    },
    {
      icon: "⚓",
      titulo: "Apprendre la voile",
      texto: "Découvrez comment fonctionne une école de voile de l'intérieur."
    },
    {
      icon: "💛",
      titulo: "Voir la magie",
      texto: "Vivez la satisfaction de voir les autres s'amuser grâce à votre aide."
    },
    {
      icon: "🌱",
      titulo: "Vivre l'aventure",
      texto: "Camaraderie, bonne énergie et la mer comme décor permanent."
    }
  ]
};
