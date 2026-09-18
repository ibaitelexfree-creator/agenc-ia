'use client';

import { useLocale } from "next-intl";
import ReviewsHeader from "./ReviewsHeader";
import ReviewsCarousel from "./ReviewsCarousel";
import styles from "./Reviews.module.css";

const subtitles = {
  es: "Esto es lo que sienten quienes lo han vivido:",
  eu: "Hau da bizi izan dutenek sentitzen dutena:",
  en: "This is what those who have experienced it feel:",
  fr: "Voici ce que ressentent ceux qui l'ont vécu :"
};

interface ReviewsSectionProps {
  layoutVariant?: 'default' | 'compact' | 'ultra-compact'
}

export default function ReviewsSection({ layoutVariant = 'default' }: ReviewsSectionProps = {}) {
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const subtitle = subtitles[locale] || subtitles.es;

  const isCompact = layoutVariant === 'compact' || layoutVariant === 'ultra-compact';
  const isUltra = layoutVariant === 'ultra-compact';

  return (
    <section 
      className={styles.section} 
      aria-labelledby="reviews-heading"
      style={isCompact ? {
        minHeight: 'auto',
        height: 'auto',
        paddingTop: isUltra ? 'clamp(14px, 2.2vh, 22px)' : 'clamp(20px, 3.2vh, 30px)',
        paddingBottom: isUltra ? 'clamp(14px, 2.2vh, 22px)' : 'clamp(20px, 3.2vh, 30px)',
      } : undefined}
    >
      <div className={styles.container}>
        <ReviewsHeader layoutVariant={layoutVariant} />
        <p 
          className={styles.subheading} 
          id="reviews-heading"
          style={isCompact ? {
            margin: isUltra ? '6px 0 8px' : '10px 0 12px',
            fontSize: isUltra ? 'clamp(11px, 1.1vw, 13px)' : 'clamp(12px, 1.3vw, 15px)',
          } : undefined}
        >
          {subtitle}
        </p>
        <ReviewsCarousel />
      </div>
    </section>
  );
}
