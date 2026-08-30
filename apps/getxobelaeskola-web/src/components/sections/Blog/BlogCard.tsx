'use client';

import { motion, useMotionValue, useTransform } from "framer-motion";
import { staggerItem, easeApple } from "@/lib/motion-variants";
import { useMagicMotion } from "@/lib/useMagicMotion";
import BlogBadge from "./BlogBadge";
import styles from "./Blog.module.css";
import { BlogPost } from "./blog.data";
import { useLocale } from "next-intl";

interface BlogCardProps {
  post: BlogPost;
}

const categories = {
  aprendizaje: {
    es: "Aprendizaje",
    eu: "Ikaskuntza",
    en: "Learning",
    fr: "Apprentissage"
  },
  "noticias-eventos": {
    es: "Noticias y Eventos",
    eu: "Berriak eta Ekitaldiak",
    en: "News and Events",
    fr: "Nouvelles et Événements"
  }
};

export default function BlogCard({ post }: BlogCardProps) {
  const { magicEnabled } = useMagicMotion();
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';

  const title = locale === 'eu' ? post.titleEu : locale === 'en' ? post.titleEn : locale === 'fr' ? post.titleFr : post.titleEs;
  const categoryLabel = categories[post.category]?.[locale] || categories[post.category]?.es;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!magicEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }
  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.a
      href={`/${locale}/blog/noticias`}
      className={styles.card}
      variants={staggerItem}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: magicEnabled ? rotateX : 0,
        rotateY: magicEnabled ? rotateY : 0,
        transformPerspective: 1000,
      }}
      whileHover={{ boxShadow: "var(--gbe-shadow-hover)" }}
    >
      <div className={styles.imageWrapper}>
        <motion.img
          src={post.image}
          alt={title}
          className={styles.image}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: easeApple as any }}
          onError={(e) => {
            // Fallback image if local webp isn't present
            (e.target as HTMLImageElement).src = "/images/ai/section4-community.webp";
          }}
        />
        {post.pinned && <div className={styles.badgeWrapper}><BlogBadge /></div>}
      </div>

      <div className={styles.cardBody}>
        <span className={styles.category}>
          {categoryLabel}
        </span>

        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
    </motion.a>
  );
}
