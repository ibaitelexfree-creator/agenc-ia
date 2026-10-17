export interface BlogPost {
  id: string;
  slug?: string;
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
    slug: "como-leer-una-carta-nautica-en-5-pasos",
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
    slug: "tacticas-de-regata-domina-las-salidas-con-viento-fuerte",
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
    slug: "los-mejores-rincones-para-fondear-en-el-abra-de-getxo",
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
  {
    id: "4",
    slug: "getxo-bela-eskola-impulsa-una-nueva-temporada-para-acercar-la-vela-a-todas-las-edades",
    category: "noticias-eventos",
    pinned: false,
    image: "https://xbledhifomblirxurtyv.supabase.co/storage/v1/object/public/blog-images/posts/4c94cd15-c6c8-4061-b8fa-f2b86bf87a99.jpg",
    author: "Getxo Bela Eskola",
    titleEs: "Getxo Bela Eskola impulsa una nueva temporada para acercar la vela a todas las edades",
    titleEu: "Getxo Bela Eskolak bela adin guztietara hurbiltzeko denboraldi berria bultzatzen du",
    titleEn: "Getxo Bela Eskola launches a new season to bring sailing to all ages",
    titleFr: "Getxo Bela Eskola lance une nouvelle saison pour ouvrir la voile à tous les âges",
    dateEs: "29 jul 2026",
    dateEu: "2026-07-29",
    dateEn: "Jul 29, 2026",
    dateFr: "29 juil 2026",
  },
];
