"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SVG_CARTA = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 36 Q14 30 20 36 Q26 42 32 36 Q38 30 44 36 Q50 42 56 36" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M8 28 Q14 22 20 28 Q26 34 32 28 Q38 22 44 28 Q50 34 56 28" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M8 20 Q14 14 20 20 Q26 26 32 20 Q38 14 44 20 Q50 26 56 20" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2"/>
  </svg>
);

const SVG_EXPERIENCIA = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="28" r="10" stroke="#0071E3" strokeWidth="2.5"/>
    <line x1="12" y1="28" x2="15" y2="28" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="17" x2="17" y2="20" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="39" x2="17" y2="36" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="44" y1="28" x2="38" y2="28" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="41" y1="17" x2="37" y2="20" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="41" y1="39" x2="37" y2="36" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="48" y1="20" x2="44" y2="24" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SVG_ESCENARIO = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="5" stroke="#0071E3" strokeWidth="2.5"/>
    <line x1="28" y1="23" x2="28" y2="42" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 34 Q18 42 28 42 Q38 42 42 34" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <line x1="19" y1="29" x2="14" y2="34" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="37" y1="29" x2="42" y2="34" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SVG_COMPANIA = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="28" y1="8" x2="28" y2="42" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 10 L44 36 L28 36 Z" stroke="#0071E3" strokeWidth="2" fill="#E8F2FF" strokeLinejoin="round"/>
    <path d="M28 16 L16 36 L28 36 Z" stroke="#0071E3" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.5"/>
    <path d="M18 42 Q28 48 38 42" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function VelaFilosofia() {
  const t = useTranslations("que_es_la_vela");

  const cards = [
    { id: "carta", svg: SVG_CARTA, title: t("cards.carta_title"), text: t("cards.carta_text") },
    { id: "experiencia", svg: SVG_EXPERIENCIA, title: t("cards.experiencia_title"), text: t("cards.experiencia_text") },
    { id: "escenario", svg: SVG_ESCENARIO, title: t("cards.escenario_title"), text: t("cards.escenario_text") },
    { id: "compania", svg: SVG_COMPANIA, title: t("cards.compania_title"), text: t("cards.compania_text") },
  ];

  return (
    <section id="filosofia" className="bg-white py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans">
            {t("philosophy_eyebrow")}
          </p>
          <h2
            className="text-[#1D1D1F] leading-tight max-w-2xl font-bold"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            }}
          >
            {t("philosophy_title")}
          </h2>
          <p className="mt-4 text-[#86868B] max-w-lg text-base leading-relaxed font-sans">
            {t("philosophy_subtitle")}
          </p>
        </motion.div>

        {/* Grid 2x2 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                backgroundColor: "#E8F2FF",
              }}
              className="bg-white border border-[#E8E8ED] rounded-3xl p-10 cursor-default transition-colors duration-300"
            >
              {/* SVG Icon */}
              <motion.div
                whileHover={{ rotate: [-3, 3, 0] }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                {card.svg}
              </motion.div>

              {/* Title */}
              <h3 className="text-[#1D1D1F] text-xl font-semibold mb-3 leading-snug font-sans">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-[#86868B] text-sm leading-relaxed font-sans">
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
