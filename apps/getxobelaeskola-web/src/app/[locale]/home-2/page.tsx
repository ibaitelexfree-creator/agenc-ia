import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 2 (Home Anterior sin Franja) | Getxo Bela Eskola',
    description: 'Versión Home previa con Secciones 2 y 3 sin franja divisoria superior.',
  }
}

export default function Home2Page() {
  return <HomePrototypeLayout variant="home-8" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
