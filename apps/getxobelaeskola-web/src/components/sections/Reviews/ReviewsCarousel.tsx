'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion-variants";
import ReviewCard from "./ReviewCard";
import { reviews } from "./reviews.data";
import styles from "./Reviews.module.css";

export default function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    if (!card) return;
    const distance = (card as HTMLElement).offsetWidth + 24; // width + gap
    track.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  return (
    <div className={styles.carouselWrapper}>
      <motion.button
        aria-label="Reseña anterior"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => scrollByCard(-1)}
        whileHover={{ scale: 1.1, backgroundColor: "var(--gbe-navy-900)" }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        ‹
      </motion.button>

      <motion.div
        ref={trackRef}
        className={styles.track}
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </motion.div>

      <motion.button
        aria-label="Reseña siguiente"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => scrollByCard(1)}
        whileHover={{ scale: 1.1, backgroundColor: "var(--gbe-navy-900)" }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        ›
      </motion.button>
    </div>
  );
}
