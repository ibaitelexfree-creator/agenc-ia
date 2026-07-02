import { getOptimizedExternalImage } from '@/lib/utils/image';

export interface MicroLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  likes: number;
}

export const microLessons: MicroLesson[] = [
  {
    id: '1',
    title: 'El Ojo del Viento',
    description: 'Entiende la zona donde las velas no portan y cómo evitarla.',
    category: 'Maniobra',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: getOptimizedExternalImage('https://images.unsplash.com/photo-1534447677768-be436bb09401', 800),
    duration: 120,
    likes: 1240,
  },
  {
    id: '2',
    title: 'Nudo de Bolina',
    description: 'El rey de los nudos: seguro, fuerte y fácil de deshacer.',
    category: 'Cabuyería',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: '/images/academy/cabuyeria.png',
    duration: 60,
    likes: 850,
  },
  {
    id: '3',
    title: 'Barlovento vs Sotavento',
    description: 'Aprende a diferenciar los lados del barco según el viento.',
    category: 'Teoría',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: getOptimizedExternalImage('https://images.unsplash.com/photo-1505080857763-eec772cd197d', 800),
    duration: 180,
    likes: 2100,
  },
  {
    id: '4',
    title: 'Prioridades de Paso',
    description: 'Reglas básicas para evitar abordajes en el mar.',
    category: 'Seguridad',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: '/images/academy/seguridad.png',
    duration: 150,
    likes: 1540,
  },
  {
    id: '5',
    title: 'Partes de la Vela',
    description: 'Puño de driza, amura y escota. ¿Cuál es cuál?',
    category: 'Partes',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: '/images/academy/partes.png',
    duration: 90,
    likes: 980,
  }
];
