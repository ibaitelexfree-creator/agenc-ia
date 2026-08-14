import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cormorantGaramond, outfit, jetbrainsMono } from '@/app/fonts';
import '@/app/globals.css';
import '@/styles/tokens.css';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import FooterWrapper from '@/components/layout/FooterWrapper';
const ScrollUpButton = dynamic(() => import('@/components/shared/ScrollToTop'), { ssr: false });
const WhatsAppButton = dynamic(() => import('@/components/shared/WhatsAppButton'), { ssr: false });
import { FramerProvider } from '@/components/providers/FramerProvider';
import { Viewport } from 'next';
import { Suspense } from 'react';
const StatusToast = dynamic(() => import('@/components/shared/StatusToast'), { ssr: false });
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false });
const AccessibilityScript = dynamic(() => import('@/components/shared/AccessibilityScript'), { ssr: false });
const ScrollManager = dynamic(() => import('@/components/shared/ScrollManager'), { ssr: false });

export const viewport: Viewport = {
  themeColor: '#001B3A', // Nautical Black
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'eu' }, { locale: 'en' }, { locale: 'fr' }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });

  // Comprobar la sesión en el servidor para el Navbar y así evitar cargar el chunk de Supabase en el cliente
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let initialUser = null;
  
  if (authUser) {
      const { data: profile } = await supabase.from('profiles').select('rol, status_socio').eq('id', authUser.id).single();
      initialUser = profile ? { ...authUser, ...profile } : authUser;
  }

  return (
    <html lang={locale} className={`${cormorantGaramond.variable} ${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Europe/Madrid">
          <FramerProvider>
            <div className="min-h-screen flex flex-col relative w-full max-w-[1920px] min-w-[320px] mx-auto overflow-x-clip">
              <Navbar locale={locale} initialUser={initialUser} />
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <FooterWrapper>
                  <Footer locale={locale} />
                </FooterWrapper>
              </div>
              <ScrollUpButton />
              <WhatsAppButton />

              <Suspense fallback={null}>
                <StatusToast />
              </Suspense>
              <Analytics />
              <SpeedInsights />
              <AccessibilityScript />
              <ScrollManager />
            </FramerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  let title = 'Getxo Bela Eskola | Escuela de Navegación en Getxo';
  let description = 'Aprende a navegar en el Cantábrico. Cursos de vela ligera, cruceros J80, academia náutica online y alquiler de material en el Puerto Deportivo de Getxo.';

  if (isEu) {
    title = 'Getxo Bela Eskola | Nabigazio Akademia Getxon';
    description = 'Ikasi nabigatzen Kantauri itsasoan. Bela ikastaroak, J80 ontziak, online akademia eta material alokairua Getxoko Portu Kiroleruan.';
  } else if (isEn) {
    title = 'Getxo Getxo Bela Eskola | Sailing Lessons in Getxo';
    description = 'Learn to sail in the Bay of Biscay. Pro sailing courses, J80 yacht training, online academy, and boat rentals in Getxo Marina.';
  } else if (isFr) {
    title = 'Getxo Getxo Bela Eskola | École de Voile à Getxo';
    description = 'Apprenez la navigation en mer Cantabrique. Cours de voile, formation J80, académie en ligne et location de bateaux à Getxo.';
  }

  const ogLocale = isEu ? 'eu_ES' : isEn ? 'en_US' : isFr ? 'fr_FR' : 'es_ES';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getxobelaeskola.cloud';

  return {
    title: {
      default: title,
      template: `%s | Getxo Getxo Bela Eskola`
    },
    description,
    keywords: ['vela getxo', 'escuela náutica', 'bela eskola', 'alquiler barcos getxo', 'cursos vela', 'licencia navegación', 'J80 getxo', 'pakea bela'],
    authors: [{ name: 'Getxo Getxo Bela Eskola' }],
    creator: 'Getxo Getxo Bela Eskola',
    publisher: 'Getxo Getxo Bela Eskola',
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'Getxo Getxo Bela Eskola',
      images: [
        {
          url: '/images/home-hero-sailing-action.webp',
          width: 1200,
          height: 630,
          alt: 'Getxo Getxo Bela Eskola - Sailing Action'
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/home-hero-sailing-action.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
