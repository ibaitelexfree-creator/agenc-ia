'use client';

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion-variants";
import ReviewCard from "./ReviewCard";
import { reviews } from "./reviews.data";
import styles from "./Reviews.module.css";

export default function ReviewsCarousel() {
  // Duplicamos las reseñas para crear el efecto de scroll infinito continuo
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className={styles.carouselWrapper}>
      <motion.div
        className={styles.track}
        variants={staggerContainer(0.12)}
        initial="visible"
        animate="visible"
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}
