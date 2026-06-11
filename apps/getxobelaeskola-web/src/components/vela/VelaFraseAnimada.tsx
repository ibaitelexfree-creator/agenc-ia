"use client";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const SENTENCES: Record<string, string> = {
  es: "La vela combina técnica, calma, aventura, escucha y una conexión profunda con la mar.",
  en: "Sailing combines technique, calm, adventure, listening and a deep connection with the sea.",
  eu: "Belak teknika, lasaitasuna, abentura, entzumena eta itsasoarekin konexio sakona uztartzen ditu.",
  fr: "La voile combine technique, calme, aventure, écoute et une connexion profonde avec la mer."
};

// Sub-roots to highlight in blue for each language
const HIGHLIGHTS: Record<string, string[]> = {
  es: ["vela", "técnica", "calma", "aventura", "escucha", "conexión", "mar"],
  en: ["sailing", "technique", "calm", "adventure", "listening", "connection", "sea"],
  eu: ["belak", "teknika", "lasaitasun", "abentur", "entzumen", "konexio", "itsaso"],
  fr: ["voile", "technique", "calme", "aventure", "écoute", "connexion", "mer"]
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const wordVariants = {
  hidden: { color: "#D1D1D6" },
  visible: (highlight: boolean) => ({
    color: highlight ? "#0071E3" : "#1D1D1F",
    transition: { duration: 0.4, ease: "easeOut" },
  }),
} as any;

export default function VelaFraseAnimada() {
  const params = useParams();
  const t = useTranslations("que_es_la_vela");
  
  const locale = (params?.locale as string) || "es";
  const sentence = SENTENCES[locale] || SENTENCES.es;
  const highlights = HIGHLIGHTS[locale] || HIGHLIGHTS.es;

  const words = sentence.split(" ").map((word) => {
    // Normalize word to check if it matches highlight roots (remove punctuation, lowercase)
    const normalized = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const shouldHighlight = highlights.some((h) => normalized.includes(h));
    return { text: word, highlight: shouldHighlight };
  });

  return (
    <section className="bg-[#F5F5F7] py-32 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-12 font-sans"
        >
          {t("essencia_eyebrow")}
        </motion.p>

        {/* Animated phrase */}
        <motion.p
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          className="leading-tight font-bold"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={word.highlight}
              variants={wordVariants}
              style={{ display: "inline-block", marginRight: "0.35em" }}
            >
              {word.text}
            </motion.span>
          ))}
        </motion.p>

        {/* Bottom divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#E8E8ED] mt-16 origin-left"
        />

      </div>
    </section>
  );
}
