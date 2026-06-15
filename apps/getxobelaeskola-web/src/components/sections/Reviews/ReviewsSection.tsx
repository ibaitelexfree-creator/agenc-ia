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

export default function ReviewsSection() {
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const subtitle = subtitles[locale] || subtitles.es;

  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.container}>
        <ReviewsHeader />
        <p className={styles.subheading} id="reviews-heading">
          {subtitle}
        </p>
        <ReviewsCarousel />
      </div>
    </section>
  );
}
