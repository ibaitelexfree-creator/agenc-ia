'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { staggerContainer, wordContainer, wordItem } from "@/lib/motion-variants";
import BlogCard from "./BlogCard";
import { blogPosts } from "./blog.data";
import styles from "./Blog.module.css";
import MagneticCTA from "@/components/ui/MagneticCTA";
import SparkleBurst from "@/components/ui/SparkleBurst";
import { useLocale } from "next-intl";

const titles = {
  es: "Noticias y Eventos",
  eu: "Berriak eta Ekitaldiak",
  en: "News & Events",
  fr: "Actualités & Événements"
};

const subtitles = {
  es: "Mantente al día con las últimas novedades de la escuela, crónicas de regatas y consejos técnicos de navegación.",
  eu: "Getxo Bela Eskolako azken albisteak eta itsas ikaskuntzak",
  en: "Latest news and sailing lessons from Getxo Bela Eskola",
  fr: "Dernières nouvelles de Getxo Bela Eskola"
};

const ctaLabels = {
  es: "Ver todas las entradas",
  eu: "Ikusi sarrera guztiak",
  en: "View all posts",
  fr: "Voir tous les articles"
};

export default function BlogSection() {
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const titleText = titles[locale] || titles.es;
  const subtitleText = subtitles[locale] || subtitles.es;
  const ctaLabel = ctaLabels[locale] || ctaLabels.es;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide to next post every 4 seconds on mobile screens
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % blogPosts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swipe left -> Next
        setActiveIndex((prev) => (prev + 1) % blogPosts.length);
      } else {
        // Swipe right -> Prev
        setActiveIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
      }
    }
    touchStartX.current = null;
  };

  const TITLE_WORDS = titleText.split(" ");

  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <div className={styles.container}>
        <motion.h2
          id="blog-heading"
          className={styles.title}
          variants={wordContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
        >
          {TITLE_WORDS.map((word, i) => (
            <motion.span key={i} variants={wordItem} style={{ display: "inline-block", marginRight: "0.3em" }}>
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <p className={styles.subheading}>
          {subtitleText}
        </p>

        {isMobile ? (
          <div 
            className={styles.mobileCarousel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.mobileCardWrapper}>
              <BlogCard post={blogPosts[activeIndex]} />
            </div>

            {/* Pagination Dots */}
            <div className={styles.dotsWrapper}>
              {blogPosts.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            className={styles.grid}
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}

        <div className={styles.ctaWrapper}>
          <SparkleBurst trigger={
            <MagneticCTA href={`/${locale}/blog/noticias`}>
              {ctaLabel}
            </MagneticCTA>
          } />
        </div>
      </div>
    </section>
  );
}
