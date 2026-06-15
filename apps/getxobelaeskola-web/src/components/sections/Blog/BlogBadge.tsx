'use client';

import { motion } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";
import { useLocale } from "next-intl";

const labels = {
  es: "FIJADO",
  eu: "FINKATUA",
  en: "PINNED",
  fr: "ÉPINGLÉ"
};

export default function BlogBadge() {
  const { magicEnabled } = useMagicMotion();
  const locale = useLocale() as 'es' | 'eu' | 'en' | 'fr';
  const label = labels[locale] || labels.es;

  return (
    <motion.span
      className="blog-badge"
      animate={magicEnabled ? { backgroundPositionX: ["0%", "200%"] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "var(--gbe-navy-900)",
        borderRadius: "var(--gbe-radius-pill)",
        background: "linear-gradient(90deg, var(--gbe-white) 0%, var(--gbe-gold-soft) 50%, var(--gbe-white) 100%)",
        backgroundSize: "200% 100%",
      }}
    >
      {label}
    </motion.span>
  );
}
