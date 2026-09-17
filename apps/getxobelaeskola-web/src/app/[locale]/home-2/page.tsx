import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 2 (Franja Ondulada Sincronizada) | Getxo Bela Eskola',
    description: 'Prototipo con franja ondulada beige con ondulación paralela continua al unísono.',
  }
}

export default function Home2Page() {
  return <HomePrototypeLayout variant="home-2" waveVariant="animated-sync" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
