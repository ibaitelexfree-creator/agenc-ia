import { DM_Serif_Display, Inter } from "next/font/google";
import VelaHero from "@/components/vela/VelaHero";
import VelaFraseAnimada from "@/components/vela/VelaFraseAnimada";
import VelaFilosofia from "@/components/vela/VelaFilosofia";
import VelaTextoNarrativo from "@/components/vela/VelaTextoNarrativo";
import VelaSelectorExperiencia from "@/components/vela/VelaSelectorExperiencia";
import VelaCTA from "@/components/vela/VelaCTA";
import { Metadata } from "next";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  let title = "Qué es la Vela | GetxoBelaEskola";
  let description = "La vela combina técnica, calma y una conexión profunda con la mar. Descubre cómo cada persona puede encontrar su propio lugar en el agua.";

  if (isEu) {
    title = "Zer da Bela | GetxoBelaEskola";
    description = "Belak teknika, lasaitasuna eta itsasoarekin konexio sakona uztartzen ditu. Ezagutu nola aurki dezakeen pertsona bakoitzak bere lekua uretan.";
  } else if (isEn) {
    title = "What is Sailing | GetxoBelaEskola";
    description = "Sailing combines technique, calm, and a deep connection with the sea. Discover how everyone can find their own place on the water.";
  } else if (isFr) {
    title = "Qu'est-ce que la Voile | GetxoBelaEskola";
    description = "La voile allie technique, calme et connexion profonde avec la mer. Découvrez comment chacun peut trouver sa place sur l'eau.";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/images/home-hero-sailing-action.webp", width: 1200, height: 630 }],
    },
  };
}

export default function QueEsLaVelaPage() {
  return (
    <main className={`${dmSerif.variable} ${inter.variable} bg-white overflow-hidden`} style={{ fontFamily: "var(--font-inter)" }}>
      <VelaHero />
      <VelaFraseAnimada />
      <VelaFilosofia />
      <VelaTextoNarrativo />
      <VelaSelectorExperiencia />
      <VelaCTA />
    </main>
  );
}
