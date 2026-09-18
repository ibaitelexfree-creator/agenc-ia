'use client';

import { useLocale } from "next-intl";
import styles from "./Reviews.module.css";
import CountUp from "./CountUp";

const content = {
  es: {
    headline: "¡LA VELA NO DEJA A NADIE INDIFERENTE!",
    line1: "Tiene una magia especial.",
    line2: "Y cuando algo así se hace con pasión...",
    line3: "Los resultados hablan por sí mismos.",
    line4Pre: "Tenemos un ",
    line4Post: " de valoraciones positivas en Google.",
  },
  eu: {
    headline: "BELAK EZ DU INOR EPEL UTZIKO!",
    line1: "Magia berezia du.",
    line2: "Eta horrelako zerbait pasioz egiten denean...",
    line3: "Emaitzek beren kabuz hitz egiten dute.",
    line4Pre: "Gure balorazioen ",
    line4Post: " positiboak dira Googlen.",
  },
  en: {
    headline: "SAILING LEAVES NO ONE INDIFFERENT!",
    line1: "It has a special magic.",
    line2: "And when something like this is done with passion...",
    line3: "The results speak for themselves.",
    line4Pre: "We have a ",
    line4Post: " positive rating on Google.",
  },
  fr: {
    headline: "LA VOILE NE LAISSE PERSONNE INDIFFÉRENT !",
    line1: "Elle a une magie particulière.",
    line2: "Et quand on fait les choses avec passion...",
    line3: "Les résultats parlent d'eux-mêmes.",
    line4Pre: "Nous avons ",
    line4Post: " d'avis positifs sur Google.",
  }
};

interface ReviewsHeaderProps {
  layoutVariant?: 'default' | 'compact' | 'ultra-compact'
}

export default function ReviewsHeader({ layoutVariant = 'default' }: ReviewsHeaderProps = {}) {
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const activeContent = content[locale] || content.es;

  const isCompact = layoutVariant === 'compact' || layoutVariant === 'ultra-compact';
  const isUltra = layoutVariant === 'ultra-compact';

  return (
    <div 
      className={styles.headerGrid}
      style={isCompact ? {
        gap: isUltra ? 'clamp(12px, 2vw, 20px)' : 'clamp(16px, 2.5vw, 28px)',
      } : undefined}
    >
      <h2 
        className={styles.headline}
        style={isCompact ? {
          fontSize: isUltra ? 'clamp(17px, 2.3vw, 26px)' : 'clamp(18px, 2.6vw, 30px)',
          lineHeight: 1.15,
        } : undefined}
      >
        {activeContent.headline}
      </h2>
      <div 
        className={styles.headerLines}
        style={isCompact ? {
          fontSize: isUltra ? '12px' : '13px',
        } : undefined}
      >
        <p style={isCompact ? { marginBottom: '2px' } : undefined}>{activeContent.line1}</p>
        <p style={isCompact ? { marginBottom: '2px' } : undefined}>{activeContent.line2}</p>
        <p style={isCompact ? { marginBottom: '2px' } : undefined}>{activeContent.line3}</p>
        <p style={isCompact ? { marginBottom: '0' } : undefined}>
          {activeContent.line4Pre}
          <CountUp to={100} suffix="%" />
          {activeContent.line4Post}
        </p>
      </div>
    </div>
  );
}
