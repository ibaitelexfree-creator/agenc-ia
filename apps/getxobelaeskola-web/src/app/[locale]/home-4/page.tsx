import { Metadata } from 'next'
import { HomePrototypeLayout } from '@/components/home-prototypes/HomePrototypeLayout'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home 4 (Copia de Home 2 - Transición S2 a S3 Sincronizada) | Getxo Bela Eskola',
    description: 'Home con franja ondulada orgánica marina de Home 2 y la transición entre Sección 2 y Sección 3 perfectamente sincronizada como antes.',
  }
}

export default function Home4Page() {
  return <HomePrototypeLayout variant="home-4" waveVariant="animated-organic" />
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'eu' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}
