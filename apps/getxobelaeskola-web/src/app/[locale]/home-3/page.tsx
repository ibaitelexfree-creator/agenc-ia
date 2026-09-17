import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 3 (Copia de Home 2 con Blobs +5% Arriba) | Getxo Bela Eskola',
    description: 'Home con franja ondulada orgánica marina de Home 2 y los 5 blobs de la Sección 1 elevados un 5% más arriba.',
  }
}

export default function Home3Page() {
  return <HomePrototypeLayout variant="home-3" waveVariant="animated-organic" blobsElevated={true} />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
