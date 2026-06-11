"use client";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function HighlightText({ text, highlight }: { text: string; highlight: string | null }) {
  if (!highlight) return <>{text}</>;
  
  // Clean split based on highlight text
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;

  return (
    <>
      {parts[0]}
      <span className="text-[#0071E3] font-medium">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  );
}

export default function VelaTextoNarrativo() {
  const t = useTranslations("que_es_la_vela");

  const paragraphs = [
    {
      id: "p1",
      text: t("history_p1"),
      highlight: t.has("history_p1_highlight") ? t("history_p1_highlight") : null,
    },
    {
      id: "p2",
      text: t("history_p2"),
      highlight: null,
    },
    {
      id: "p3",
      text: t("history_p3"),
      highlight: t.has("history_p3_highlight") ? t("history_p3_highlight") : null,
    },
    {
      id: "p4",
      text: t("history_p4"),
      highlight: null,
    },
  ];

  return (
    <section className="bg-[#F5F5F7] py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Layout: two columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          
          {/* Left column — sticky label */}
          <div className="md:sticky md:top-32 md:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans">
                {t("history_eyebrow")}
              </p>
              {/* Decorative vertical gradient line */}
              <div className="w-px h-24 bg-gradient-to-b from-[#0071E3] to-transparent hidden md:block" />
            </motion.div>
          </div>

          {/* Right column — paragraphs */}
          <div className="flex flex-col gap-12">
            {paragraphs.map((para, i) => (
              <motion.div
                key={para.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="text-[#1D1D1F] leading-relaxed font-sans text-[1.15rem]">
                  <HighlightText text={para.text} highlight={para.highlight} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
