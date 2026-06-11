export interface BeneficioData {
  id: string;
  emoji: string;
  headline: string;
  body: string;
  delay: number;
}

export interface PerfilData {
  id: string;
  emoji: string;
  title: string;
  description: string;
  requisitos: string[];
  chips: string[];
}

export interface TrabajaTranslations {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  cyclingRoles: string[];
  buscamosPrefix: string;
  intro: string;
  ctaHero: string;
  benefitsEyebrow: string;
  profilesEyebrow: string;
  profilesTitle: string;
  formEyebrow: string;
  formTitle: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formAttachmentLabel: string;
  formAttachmentRequired: string;
  formSubmit: string;
  formSending: string;
  formPrivacy: string;
  successTitle: string;
  successBody: string;
  ctaCierrePhraseParts: string[];
  ctaCierreBtn: string;
  fileTypeError: string;
  fileSizeError: string;
  dragzoneIdleText: string;
  dragzoneIdleSub: string;
  dragzoneOverText: string;
  dragzoneSailingText: string;
  dragzoneSuccessText: string;
  dragzoneBrowseBtn: string;
  dragzoneHint: string;
  validationAttachFile: string;
}

export const trabajaTranslations: Record<string, TrabajaTranslations> = {
  es: {
    eyebrow: "ÚNETE AL EQUIPO",
    titleMain: "Trabaja con",
    titleAccent: "nosotras.",
    cyclingRoles: [
      "instructora titulada",
      "técnica de mantenimiento",
      "coordinadora de tierra",
      "persona con ganas de mar"
    ],
    buscamosPrefix: "Buscamos: ",
    intro: "Únete a una asociación sin ánimo de lucro donde cada día es diferente, divertido y enriquecedor. Tu energía y tus ideas importan aquí.",
    ctaHero: "Ver ofertas ↓",
    benefitsEyebrow: "POR QUÉ UNIRTE",
    profilesEyebrow: "PERFILES QUE BUSCAMOS",
    profilesTitle: "¿Eres una de ellas?",
    formEyebrow: "ENVÍA TU CANDIDATURA",
    formTitle: "Cuéntanos quién eres.",
    formName: "Nombre completo",
    formEmail: "Email",
    formMessage: "Tu experiencia en navegación y qué buscas",
    formAttachmentLabel: "Adjunta tu CV",
    formAttachmentRequired: "*obligatorio",
    formSubmit: "Enviar candidatura →",
    formSending: "Enviando candidatura…",
    formPrivacy: "Tus datos se usan exclusivamente para valorar tu candidatura.",
    successTitle: "¡Candidatura enviada!",
    successBody: "Hemos recibido tu CV y nos pondremos en contacto contigo lo antes posible. ¡Mucho ánimo y buen viento!",
    ctaCierrePhraseParts: [
      "Si quieres trabajar en un lugar donde",
      "cada día es diferente, divertido",
      "y enriquecedor…",
      "únete a nosotras."
    ],
    ctaCierreBtn: "Contactar →",
    fileTypeError: "Solo se aceptan archivos PDF o Word (.doc/.docx)",
    fileSizeError: "El archivo supera 5MB.",
    dragzoneIdleText: "Arrastra tu CV aquí",
    dragzoneIdleSub: "o haz click para buscar",
    dragzoneOverText: "¡Suéltalo aquí!",
    dragzoneSailingText: "Navegando tu candidatura…",
    dragzoneSuccessText: "CV adjuntado",
    dragzoneBrowseBtn: "o haz click para buscar archivo",
    dragzoneHint: "PDF o Word · Máx. 5MB",
    validationAttachFile: "Por favor adjunta tu CV."
  },
  eu: {
    eyebrow: "BATU LAN-TALDERA",
    titleMain: "Lan egin gurekin",
    titleAccent: "batera.",
    cyclingRoles: [
      "monitore titulatua",
      "mantenu teknikaria",
      "lurreko koordinatzailea",
      "itsasorako gogoa duen pertsona"
    ],
    buscamosPrefix: "Bila gaude: ",
    intro: "Batu zaitez irabazi-asmorik gabeko elkarte batera, non egun bakoitza desberdina, dibertigarria eta aberasgarria den. Zure energiak eta ideiek garrantzia dute hemen.",
    ctaHero: "Ikusi eskaintzak ↓",
    benefitsEyebrow: "ZERGATIK BATU",
    profilesEyebrow: "BILATZEN DITUGUN PERFILAK",
    profilesTitle: "Haietako bat al zara?",
    formEyebrow: "BIDALI ZURE HAUTAGAIKETA",
    formTitle: "Kontaguzu nor zaren.",
    formName: "Izen-abizenak",
    formEmail: "Posta elektronikoa",
    formMessage: "Zure nabigazio esperientzia eta zer bilatzen duzun",
    formAttachmentLabel: "Erantsi zure CVa",
    formAttachmentRequired: "*derrigorrezkoa",
    formSubmit: "Hautagaitza bidali →",
    formSending: "Hautagaitza bidaltzen…",
    formPrivacy: "Zure datuak zure hautagaitza baloratzeko soilik erabiliko dira.",
    successTitle: "Hautagaitza bidali da!",
    successBody: "Zure CVa jaso dugu eta ahalik eta lasterren jarriko gara zurekin harremanetan. Zorte on eta haize ona!",
    ctaCierrePhraseParts: [
      "Egun bakoitza desberdina, dibertigarria",
      "eta aberasgarria den leku batean",
      "lan egin nahi baduzu…",
      "batu zaitez gurekin."
    ],
    ctaCierreBtn: "Harremanetan jarri →",
    fileTypeError: "PDF edo Word (.doc/.docx) fitxategiak soilik onartzen dira",
    fileSizeError: "Fitxategiak 5MB gainditzen ditu.",
    dragzoneIdleText: "Arrastatu zure CVa hona",
    dragzoneIdleSub: "edo egin klik bilatzeko",
    dragzoneOverText: "Utzi hemen!",
    dragzoneSailingText: "Zure hautagaitza nabigatzen…",
    dragzoneSuccessText: "CVa erantsita",
    dragzoneBrowseBtn: "edo egin klik fitxategia bilatzeko",
    dragzoneHint: "PDF edo Word · Gehienez 5MB",
    validationAttachFile: "Mesedez erantsi zure CVa."
  },
  en: {
    eyebrow: "JOIN THE TEAM",
    titleMain: "Work with",
    titleAccent: "us.",
    cyclingRoles: [
      "certified instructor",
      "maintenance technician",
      "land coordinator",
      "someone eager for the sea"
    ],
    buscamosPrefix: "We look for: ",
    intro: "Join a non-profit association where every day is different, fun, and enriching. Your energy and ideas matter here.",
    ctaHero: "See openings ↓",
    benefitsEyebrow: "WHY JOIN US",
    profilesEyebrow: "PROFILES WE LOOK FOR",
    profilesTitle: "Are you one of them?",
    formEyebrow: "SUBMIT YOUR APPLICATION",
    formTitle: "Tell us who you are.",
    formName: "Full name",
    formEmail: "Email",
    formMessage: "Your sailing experience and what you seek",
    formAttachmentLabel: "Attach your CV",
    formAttachmentRequired: "*required",
    formSubmit: "Send application →",
    formSending: "Sending application…",
    formPrivacy: "Your data is used exclusively to assess your application.",
    successTitle: "Application submitted!",
    successBody: "We have received your CV and will contact you as soon as possible. Best of luck and fair winds!",
    ctaCierrePhraseParts: [
      "If you want to work in a place where",
      "every day is different, fun,",
      "and rewarding…",
      "join us."
    ],
    ctaCierreBtn: "Contact us →",
    fileTypeError: "Only PDF or Word (.doc/.docx) files are accepted",
    fileSizeError: "File exceeds 5MB limit.",
    dragzoneIdleText: "Drag your CV here",
    dragzoneIdleSub: "or click to browse",
    dragzoneOverText: "Drop it here!",
    dragzoneSailingText: "Sailing your application…",
    dragzoneSuccessText: "CV attached",
    dragzoneBrowseBtn: "or click to browse file",
    dragzoneHint: "PDF or Word · Max 5MB",
    validationAttachFile: "Please attach your CV."
  },
  fr: {
    eyebrow: "REJOINDRE L'ÉQUIPE",
    titleMain: "Travaillez avec",
    titleAccent: "nous.",
    cyclingRoles: [
      "monitrice diplômée",
      "technicienne de maintenance",
      "coordinatrice de terre",
      "passionnée de la mer"
    ],
    buscamosPrefix: "Nous cherchons: ",
    intro: "Rejoignez une association à but non lucratif où chaque jour est différent, amusant et enrichissant. Votre énergie et vos idées comptent ici.",
    ctaHero: "Voir les offres ↓",
    benefitsEyebrow: "POURQUOI NOUS REJOINDRE",
    profilesEyebrow: "PROFILS RECHERCHÉS",
    profilesTitle: "Êtes-vous l'une d'entre elles?",
    formEyebrow: "ENVOYEZ VOTRE CANDIDATURE",
    formTitle: "Dites-nous qui vous êtes.",
    formName: "Nom complet",
    formEmail: "Email",
    formMessage: "Votre expérience en voile et vos motivations",
    formAttachmentLabel: "Joindre votre CV",
    formAttachmentRequired: "*obligatoire",
    formSubmit: "Envoyer la candidature →",
    formSending: "Envoi de la candidature…",
    formPrivacy: "Vos données sont utilisées exclusivement pour évaluer votre candidature.",
    successTitle: "Candidature envoyée !",
    successBody: "Nous avons bien reçu votre CV et nous vous contacterons dans les plus brefs délais. Bon vent !",
    ctaCierrePhraseParts: [
      "Si vous voulez travailler dans un endroit",
      "où chaque jour est différent, amusant",
      "et enrichissant…",
      "rejoignez-nous."
    ],
    ctaCierreBtn: "Nous contacter →",
    fileTypeError: "Seuls les fichiers PDF ou Word (.doc/.docx) sont acceptés",
    fileSizeError: "Le fichier dépasse 5 Mo.",
    dragzoneIdleText: "Glissez votre CV ici",
    dragzoneIdleSub: "ou cliquez pour chercher",
    dragzoneOverText: "Déposez-le ici !",
    dragzoneSailingText: "Navigation de votre candidature…",
    dragzoneSuccessText: "CV joint",
    dragzoneBrowseBtn: "ou cliquez pour chercher un fichier",
    dragzoneHint: "PDF ou Word · Max 5 Mo",
    validationAttachFile: "Veuillez joindre votre CV."
  }
};

export const trabajaBeneficios: Record<string, BeneficioData[]> = {
  es: [
    {
      id: "mar",
      emoji: "🌊",
      headline: "La mar como oficina.",
      body: "Cada jornada empieza mirando el Abra de Getxo. El entorno marino no es el telón de fondo — es el trabajo.",
      delay: 0.0
    },
    {
      id: "material",
      emoji: "⛵",
      headline: "Material gratis para ti.",
      body: "Las personas del equipo tienen acceso libre a embarcaciones, equipos y actividades de la escuela. Navega cuando quieras.",
      delay: 0.1
    },
    {
      id: "equipo",
      emoji: "🤝",
      headline: "Equipo cercano y real.",
      body: "Ambiente de trabajo sin jerarquías rígidas. La colaboración y la buena energía hacen que cada día sea distinto.",
      delay: 0.2
    }
  ],
  eu: [
    {
      id: "mar",
      emoji: "🌊",
      headline: "Itsasoa bulego gisa.",
      body: "Egun bakoitza Getxoko Abra begiratuz hasten da. Itsas ingurunea ez da atzealdea — lana bera da.",
      delay: 0.0
    },
    {
      id: "material",
      emoji: "⛵",
      headline: "Doako materiala zuretzat.",
      body: "Lan-taldeko kideek doako sarbidea dute eskolako ontzi, ekipo eta jardueretara. Nabigatu nahi duzunean.",
      delay: 0.1
    },
    {
      id: "equipo",
      emoji: "🤝",
      headline: "Talde hurbil eta erreala.",
      body: "Lan-giroa hierarkia zurrunik gabe. Elkarlanak eta energia onak egun bakoitza desberdina izatea ahalbidetzen dute.",
      delay: 0.2
    }
  ],
  en: [
    {
      id: "mar",
      emoji: "🌊",
      headline: "The sea as your office.",
      body: "Each day starts looking at the Abra of Getxo. The marine environment is not just a backdrop — it is the job.",
      delay: 0.0
    },
    {
      id: "material",
      emoji: "⛵",
      headline: "Free gear for you.",
      body: "Team members have free access to the school's boats, gear, and activities. Sail whenever you want.",
      delay: 0.1
    },
    {
      id: "equipo",
      emoji: "🤝",
      headline: "Close and real team.",
      body: "Work environment without rigid hierarchies. Collaboration and good energy make every single day unique.",
      delay: 0.2
    }
  ],
  fr: [
    {
      id: "mar",
      emoji: "🌊",
      headline: "La mer comme bureau.",
      body: "Chaque journée commence en regardant l'Abra de Getxo. L'environnement marin n'est pas un décor — c'est le travail.",
      delay: 0.0
    },
    {
      id: "material",
      emoji: "⛵",
      headline: "Matériel gratuit pour vous.",
      body: "Les membres de l'équipe ont un accès libre aux bateaux, équipements et activités de l'école. Naviguez quand vous voulez.",
      delay: 0.1
    },
    {
      id: "equipo",
      emoji: "🤝",
      headline: "Une équipe proche et réelle.",
      body: "Ambiance de travail sans hiérarchies rigides. La collaboration et la bonne énergie rendent chaque journée unique.",
      delay: 0.2
    }
  ]
};

export const trabajaPerfiles: Record<string, PerfilData[]> = {
  es: [
    {
      id: "instructora",
      emoji: "⚓",
      title: "Instructora Titulada",
      description: "Buscamos personas con titulación náutica reconocida y experiencia real en vela. Capaces de transmitir pasión y técnica con calma y pedagogía.",
      requisitos: [
        "Titulación náutica válida",
        "Experiencia en vela",
        "Capacidad pedagógica"
      ],
      chips: ["Optimist", "Laser", "J80", "Windsurf"]
    },
    {
      id: "tecnica",
      emoji: "🔧",
      title: "Técnica de Mantenimiento",
      description: "Mantenimiento de embarcaciones, instalaciones y equipos de la escuela. Trabajo presencial en Getxo, con horario flexible y ambiente inmejorable.",
      requisitos: [
        "Conocimientos técnicos náuticos",
        "Polivalencia y autonomía",
        "Trabajo en equipo"
      ],
      chips: ["Mantenimiento", "Reparación", "Logística"]
    },
    {
      id: "coordinadora",
      emoji: "📋",
      title: "Coordinadora de Tierra",
      description: "Organización de cursos, eventos y actividades de grupo. Coordinación entre instructoras, alumnado y familias. Comunicación y gestión administrativa.",
      requisitos: [
        "Habilidades organizativas",
        "Comunicación excelente",
        "Afinidad con el deporte"
      ],
      chips: ["Organización", "Comunicación", "Eventos", "Admin"]
    }
  ],
  eu: [
    {
      id: "instructora",
      emoji: "⚓",
      title: "Monitore Titulatua",
      description: "Nautikako titulu homologatua eta belan esperientzia erreal eta frogagarria duten pertsonak bilatzen ditugu. Pasioa eta teknika lasaitasunez eta pedagogiaz transmititzeko gai direnak.",
      requisitos: [
        "Nautikako titulu balioduna",
        "Esperientzia belan",
        "Pedagogiarako gaitasuna"
      ],
      chips: ["Optimist", "Laser", "J80", "Windsurf"]
    },
    {
      id: "tecnica",
      emoji: "🔧",
      title: "Mantenu Teknikaria",
      description: "Eskolako ontzi, instalazio eta ekipoen mantentze-lanak. Aurrez aurreko lana Getxon, ordutegi malguarekin eta lan-giro ezinhobearekin.",
      requisitos: [
        "Ezagutza tekniko nautikoak",
        "Aldakortasuna eta autonomia",
        "Talde-lana"
      ],
      chips: ["Mantenimendua", "Konponketak", "Logistika"]
    },
    {
      id: "coordinadora",
      emoji: "📋",
      title: "Lurreko Koordinatzailea",
      description: "Ikastaro, ekitaldi eta talde-jardueren antolakuntza. Monitoreen, ikasleen eta familien arteko koordinazioa. Komunikazioa eta kudeaketa administratiboa.",
      requisitos: [
        "Antolakuntzarako gaitasuna",
        "Komunikazio bikaina",
        "Kirolarekiko zaletasuna"
      ],
      chips: ["Antolakuntza", "Komunikazioa", "Ekitaldiak", "Admin"]
    }
  ],
  en: [
    {
      id: "instructora",
      emoji: "⚓",
      title: "Certified Sailing Instructor",
      description: "We are looking for individuals with recognized nautical certifications and real sailing experience. Capable of transmitting passion and technique with calm and pedagogy.",
      requisitos: [
        "Valid sailing certification",
        "Sailing experience",
        "Pedagogical skills"
      ],
      chips: ["Optimist", "Laser", "J80", "Windsurf"]
    },
    {
      id: "tecnica",
      emoji: "🔧",
      title: "Maintenance Technician",
      description: "Maintenance of boats, facilities, and school gear. On-site work in Getxo, with flexible scheduling and an unbeatable working environment.",
      requisitos: [
        "Nautical technical knowledge",
        "Versatility and autonomy",
        "Teamwork skills"
      ],
      chips: ["Maintenance", "Repairs", "Logistics"]
    },
    {
      id: "coordinadora",
      emoji: "📋",
      title: "Land Coordinator",
      description: "Organization of courses, events, and group activities. Coordination between instructors, students, and families. Communication and administrative management.",
      requisitos: [
        "Organizational skills",
        "Excellent communication",
        "Affinity for sports"
      ],
      chips: ["Organization", "Communication", "Events", "Admin"]
    }
  ],
  fr: [
    {
      id: "instructora",
      emoji: "⚓",
      title: "Monitrice de Voile Diplômée",
      description: "Nous recherchons des personnes titulaires d'un diplôme nautique reconnu et disposant d'une réelle expérience de la voile. Capables de transmettre passion et technique avec calme et pédagogie.",
      requisitos: [
        "Diplôme nautique valide",
        "Expérience en voile",
        "Sens de la pédagogie"
      ],
      chips: ["Optimist", "Laser", "J80", "Windsurf"]
    },
    {
      id: "tecnica",
      emoji: "🔧",
      title: "Technicienne de Maintenance",
      description: "Entretien des bateaux, des installations et des équipements de l'école. Travail sur place à Getxo, avec des horaires flexibles et une ambiance imbattable.",
      requisitos: [
        "Connaissances techniques nautiques",
        "Polyvalence et autonomie",
        "Travail en équipe"
      ],
      chips: ["Maintenance", "Réparations", "Logistique"]
    },
    {
      id: "coordinadora",
      emoji: "📋",
      title: "Coordinatrice de Terre",
      description: "Organisation des cours, des événements et des activités de groupe. Coordination entre les monitrices, les élèves et les familles. Communication et gestion administrative.",
      requisitos: [
        "Compétences organisationnelles",
        "Excellente communication",
        "Affinité avec le sport"
      ],
      chips: ["Organisation", "Communication", "Événements", "Admin"]
    }
  ]
};
