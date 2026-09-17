import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 3 (Franja Ondulada Orgánica Marina) | Getxo Bela Eskola',
    description: 'Prototipo con franja ondulada beige con olas orgánicas rítmicas arriba y abajo.',
  }
}

export default function Home3Page() {
  return <HomePrototypeLayout variant="home-3" waveVariant="animated-organic" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
