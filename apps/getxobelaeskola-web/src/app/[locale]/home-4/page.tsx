import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 4 (Franja Ondulada Estática Suave) | Getxo Bela Eskola',
    description: 'Prototipo con franja ondulada beige con curvas suaves estáticas.',
  }
}

export default function Home4Page() {
  return <HomePrototypeLayout variant="home-4" waveVariant="static-gentle" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
