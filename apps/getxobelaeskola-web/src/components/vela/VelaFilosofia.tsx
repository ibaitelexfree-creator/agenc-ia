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
    <circle cx="21" cy="22" r="5" stroke="#0071E3" strokeWidth="2.5"/>
    <path d="M12 38 C12 32 16 30 21 30 C26 30 30 32 30 38" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="37" cy="24" r="4.5" stroke="#0071E3" strokeWidth="2" opacity="0.6"/>
    <path d="M30 38 C31 34 34 32 38 32 C42 32 45 34 45 38" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const SVG_EMBARCACION = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="28" y1="8" x2="28" y2="40" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 10 L44 34 L28 34 Z" stroke="#0071E3" strokeWidth="2" fill="#E8F2FF" strokeLinejoin="round"/>
    <path d="M28 16 L16 34 L28 34 Z" stroke="#0071E3" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.5"/>
    <path d="M16 40 Q28 47 40 40" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const SVG_AUTONOMIA = (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rueda de timón / progreso y dirección */}
    <circle cx="28" cy="28" r="10" stroke="#0071E3" strokeWidth="2.5"/>
    <circle cx="28" cy="28" r="3" fill="#0071E3"/>
    {/* Radios del timón / gobierno */}
    <line x1="28" y1="10" x2="28" y2="46" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="10" y1="28" x2="46" y2="28" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="15.5" y1="15.5" x2="40.5" y2="40.5" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="40.5" y1="15.5" x2="15.5" y2="40.5" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    {/* Aro exterior estilizado con flecha de avance */}
    <circle cx="28" cy="28" r="19" stroke="#0071E3" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.45"/>
    <path d="M28 5 L31 10 L25 10 Z" fill="#0071E3"/>
  </svg>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function VelaFilosofia() {
  const t = useTranslations("que_es_la_vela");

  const cards = [
    { id: "carta", svg: SVG_CARTA, title: t("cards.carta_title"), text: t("cards.carta_text") },
    { id: "experiencia", svg: SVG_EXPERIENCIA, title: t("cards.experiencia_title"), text: t("cards.experiencia_text") },
    { id: "escenario", svg: SVG_ESCENARIO, title: t("cards.escenario_title"), text: t("cards.escenario_text") },
    { id: "compania", svg: SVG_COMPANIA, title: t("cards.compania_title"), text: t("cards.compania_text") },
    { id: "embarcacion", svg: SVG_EMBARCACION, title: t("cards.embarcacion_title"), text: t("cards.embarcacion_text") },
    { id: "autonomia", svg: SVG_AUTONOMIA, title: t("cards.autonomia_title"), text: t("cards.autonomia_text") },
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
          className="mb-16 sm:mb-20 text-center flex flex-col items-center"
        >
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans text-center">
            {t("philosophy_eyebrow")}
          </p>
          <h2
            className="text-[#1D1D1F] leading-tight max-w-3xl font-bold text-center"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            }}
          >
            {t("philosophy_title")}
          </h2>
          <p className="mt-4 text-[#86868B] max-w-xl text-base leading-relaxed font-sans text-center">
            {t("philosophy_subtitle")}
          </p>
        </motion.div>

        {/* Grid 3x2 on desktop, 2 col on tablet, 1 col on mobile */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              className="bg-white border border-[#E8E8ED] rounded-3xl p-7 sm:p-8 cursor-default transition-colors duration-300 flex flex-col justify-between"
            >
              {/* SVG Icon */}
              <motion.div
                whileHover={{ rotate: [-3, 3, 0] }}
                transition={{ duration: 0.4 }}
                className="mb-6"
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
