import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'Home 8 (Variante C - Ventanas Orgánicas) | Getxo Bela Eskola',
    description: 'Prototipo Home-7 experimental con ventanas y burbujas orgánicas ascendentes que revelan el vídeo del mar a través de la superficie beige.',
  }
}

export default function Home8Page({ params: { locale } }: { params: { locale: string } }) {
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

