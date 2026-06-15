'use client';

import { motion } from "framer-motion";
import { staggerItem, cardHover, floatLoop } from "@/lib/motion-variants";
import { useMagicMotion } from "@/lib/useMagicMotion";
import StarRating from "./StarRating";
import { Review } from "./reviews.data";
import styles from "./Reviews.module.css";
import { useLocale } from "next-intl";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { magicEnabled } = useMagicMotion();
  const locale = useLocale();

  const text = locale === 'eu' ? review.textEu : locale === 'en' ? review.textEn : locale === 'fr' ? review.textFr : review.textEs;
  const timeAgo = locale === 'eu' ? review.timeAgoEu : locale === 'en' ? review.timeAgoEn : locale === 'fr' ? review.timeAgoFr : review.timeAgoEs;

  // Initials fallback if no image/avatar
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      className={styles.card}
      variants={staggerItem}
      {...cardHover}
    >
      <div className={styles.cardHeader}>
        <StarRating rating={review.rating} />
        {review.source === "google" && (
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" className={styles.googleIcon}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        )}
      </div>

      <p className={styles.cardText}>"{text}"</p>

      <div className={styles.cardFooter}>
        <motion.div
          className={styles.avatarWrapper}
          animate={magicEnabled ? { y: [0, -6, 0] } : undefined}
          transition={magicEnabled ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
        >
          {review.avatarUrl ? (
            <img
              src={review.avatarUrl}
              alt={review.name}
              width="40"
              height="40"
              className={styles.avatar}
              onError={(e) => {
                // Remove image on error to trigger fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className={styles.avatarFallback}>{initials}</div>
        </motion.div>
        <div>
          <p className={styles.cardName}>{review.name}</p>
          <p className={styles.cardTime}>{timeAgo}</p>
        </div>
      </div>
    </motion.article>
  );
}
