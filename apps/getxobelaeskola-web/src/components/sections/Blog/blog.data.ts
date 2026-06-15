export interface BlogPost {
  id: string;
  category: "noticias-eventos";
  pinned: boolean;
  image: string;
  author: string;
  titleEs: string;
  titleEu: string;
  titleEn: string;
  titleFr: string;
  dateEs: string;
  dateEu: string;
  dateEn: string;
  dateFr: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    category: "noticias-eventos",
    pinned: true,
    image: "/images/home-hero-sailing-action.webp",
    author: "Urko Santillán",
    titleEs: "Cómo leer una carta náutica en 5 pasos",
    titleEu: "Nola irakurri itsas karta bat 5 urratsetan",
    titleEn: "How to read a nautical chart in 5 steps",
    titleFr: "Comment lire une carte marine en 5 étapes",
    dateEs: "28 may 2026",
    dateEu: "2026-05-28",
    dateEn: "May 28, 2026",
    dateFr: "28 mai 2026",
  },
  {
    id: "2",
    category: "noticias-eventos",
    pinned: true,
    image: "/images/course-detail-header-sailing.webp",
    author: "Ana de Lara",
    titleEs: "Tácticas de regata: Domina las salidas con viento fuerte",
    titleEu: "Estropada taktikak: Irteerak haize indartsuarekin dominatu",
    titleEn: "Regatta tactics: Dominate starts in strong wind",
    titleFr: "Tactique de régate: Dominer les départs par vent fort",
    dateEs: "02 jun 2026",
    dateEu: "2026-06-02",
    dateEn: "Jun 2, 2026",
    dateFr: "02 juin 2026",
  },
  {
    id: "3",
    category: "noticias-eventos",
    pinned: true,
    image: "/images/course-raquero-students.webp",
    author: "Angharad Arambalza",
    titleEs: "Los mejores rincones para fondear en el Abra de Getxo",
    titleEu: "Getxoko Abrako ainguratzeko txokorik onenak",
    titleEn: "The best anchorage spots in the Abra of Getxo",
    titleFr: "Les meilleurs mouillages de l'Abra de Getxo",
    dateEs: "05 jun 2026",
    dateEu: "2026-06-05",
    dateEn: "Jun 5, 2026",
    dateFr: "05 juin 2026",
  },
];
