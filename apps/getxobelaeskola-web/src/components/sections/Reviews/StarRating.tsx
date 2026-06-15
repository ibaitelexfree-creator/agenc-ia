import { motion } from "framer-motion";
import { staggerContainer, starPop } from "@/lib/motion-variants";

interface StarRatingProps {
  rating?: number;
}

export default function StarRating({ rating = 5 }: StarRatingProps) {
  return (
    <motion.div
      className="star-rating"
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      style={{ display: "flex", gap: 4 }}
    >
      {Array.from({ length: rating }).map((_, i) => (
        <motion.svg
          key={i}
          variants={starPop}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="var(--gbe-gold)"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.166L12 19.771l-7.334 3.388 1.4-8.166L.132 9.211l8.2-1.193z" />
        </motion.svg>
      ))}
    </motion.div>
  );
}
