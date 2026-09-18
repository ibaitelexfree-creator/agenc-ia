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

interface BlogSectionProps {
  layoutVariant?: 'default' | 'ticker-marquee' | 'horizontal-feed' | 'interactive-strip' | 'compact' | 'ultra-compact'
}

export default function BlogSection({ layoutVariant = 'default' }: BlogSectionProps = {}) {
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const titleText = titles[locale] || titles.es;
  const subtitleText = subtitles[locale] || subtitles.es;
  const ctaLabel = ctaLabels[locale] || ctaLabels.es;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setIsMobile(window.innerWidth < 586 && isPortrait);
    };
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
        setActiveIndex((prev) => (prev + 1) % blogPosts.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
      }
    }
    touchStartX.current = null;
  };

  const TITLE_WORDS = titleText.split(" ");

  // =========================================================================
  // OPCIÓN 1 (Home 11): Ticker Náutico con Movimiento Permanente Continuo (Marquee)
  // Muy baja altura, desplazamiento constante infinito de noticias
  // =========================================================================
  if (layoutVariant === 'ticker-marquee') {
    const tickerItems = [...blogPosts, ...blogPosts, ...blogPosts];
    return (
      <section 
        className="w-full bg-[#091827] text-white py-4 overflow-hidden border-t border-b border-white/10"
        aria-labelledby="blog-marquee-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A7EC8] animate-pulse" />
            <h2 id="blog-marquee-heading" className="font-display font-bold text-base sm:text-lg text-white tracking-wide">
              {titleText}
            </h2>
            <span className="hidden sm:inline text-xs text-white/50">| {subtitleText}</span>
          </div>
          <a 
            href={`/${locale}/blog/noticias`}
            className="text-xs font-semibold text-[#0A7EC8] hover:text-white transition-colors flex items-center gap-1"
          >
            {ctaLabel} →
          </a>
        </div>

        {/* Cinta infinita con movimiento permanente constante */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <motion.div
            className="flex gap-4 shrink-0 py-1"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 26,
            }}
            whileHover={{ animationPlayState: 'paused' }}
          >
            {tickerItems.map((post, idx) => {
              const title = locale === 'eu' ? post.titleEu : locale === 'en' ? post.titleEn : locale === 'fr' ? post.titleFr : post.titleEs;
              return (
                <a
                  key={`${post.id}-${idx}`}
                  href={`/${locale}/blog/noticias`}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3.5 py-2 shrink-0 transition-all hover:border-[#0A7EC8]/50 max-w-[340px]"
                >
                  <img
                    src={post.image}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/ai/section4-community.webp" }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-bold text-[#0A7EC8] tracking-wider">
                      {post.category}
                    </span>
                    <p className="text-xs font-medium text-white/90 truncate leading-snug">
                      {title}
                    </p>
                  </div>
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // OPCIÓN 2 (Home 12): Feed Horizontal Compacto con Carrusel Suave
  // Altura muy reducida, formato card flotante panorámico
  // =========================================================================
  if (layoutVariant === 'horizontal-feed' || layoutVariant === 'compact') {
    return (
      <section 
        className="w-full bg-white py-5 sm:py-7 border-t border-slate-100"
        aria-labelledby="blog-feed-heading"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 id="blog-feed-heading" className="font-display font-semibold text-lg sm:text-2xl text-[#0D2137]">
                {titleText}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {subtitleText}
              </p>
            </div>
            <a 
              href={`/${locale}/blog/noticias`}
              className="text-xs sm:text-sm font-semibold text-[#0A7EC8] hover:text-[#0D2137] whitespace-nowrap transition-colors"
            >
              {ctaLabel} →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {blogPosts.slice(0, 3).map((post) => {
              const title = locale === 'eu' ? post.titleEu : locale === 'en' ? post.titleEn : locale === 'fr' ? post.titleFr : post.titleEs;
              return (
                <a
                  key={post.id}
                  href={`/${locale}/blog/noticias`}
                  className="group flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative w-full aspect-[21/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/ai/section4-community.webp" }}
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[9.5px] uppercase font-bold text-[#0A7EC8] tracking-wider block mb-1">
                      {post.category}
                    </span>
                    <h3 className="font-display font-semibold text-xs sm:text-sm text-[#0D2137] group-hover:text-[#0A7EC8] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // OPCIÓN 3 (Home 13): Strip Interactivo Ultra-Bajo (Perfil Horizontal Línea)
  // La opción más compacta de todas: tarjetas horizontales 1 fila de 60px
  // =========================================================================
  if (layoutVariant === 'interactive-strip' || layoutVariant === 'ultra-compact') {
    return (
      <section 
        className="w-full bg-[#0D2137] py-4 border-t border-white/10"
        aria-labelledby="blog-strip-heading"
      >
        <div className="max-w-[1360px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <h2 id="blog-strip-heading" className="font-display font-bold text-base text-white">
                {titleText}
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">— {subtitleText}</span>
            </div>
            <a 
              href={`/${locale}/blog/noticias`}
              className="text-xs font-semibold text-[#0A7EC8] hover:text-white transition-colors self-start md:self-auto"
            >
              {ctaLabel} →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {blogPosts.slice(0, 3).map((post) => {
              const title = locale === 'eu' ? post.titleEu : locale === 'en' ? post.titleEn : locale === 'fr' ? post.titleFr : post.titleEs;
              return (
                <a
                  key={post.id}
                  href={`/${locale}/blog/noticias`}
                  className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 transition-all hover:border-[#0A7EC8]/60"
                >
                  <img
                    src={post.image}
                    alt={title}
                    className="w-14 h-12 rounded object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/ai/section4-community.webp" }}
                  />
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-[9px] uppercase font-bold text-[#0A7EC8]">
                      {post.category}
                    </span>
                    <h3 className="font-display font-medium text-xs text-white/95 group-hover:text-[#0A7EC8] transition-colors truncate">
                      {title}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

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
