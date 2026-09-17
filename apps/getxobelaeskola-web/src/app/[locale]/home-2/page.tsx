import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 2 (Franja Ondulada Orgánica Marina - Ganador) | Getxo Bela Eskola',
    description: 'Home con franja ondulada beige con olas orgánicas rítmicas arriba y abajo.',
  }
}

export default function Home2Page() {
  return <HomePrototypeLayout variant="home-2" waveVariant="animated-organic" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
