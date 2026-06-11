"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Modo = "calma" | "accion";

export default function VelaSelectorExperiencia() {
  const [modo, setModo] = useState<Modo>("calma");
  const t = useTranslations("que_es_la_vela");
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  // Safely parse raw tags from next-intl, fallback to static defaults if not defined
  let calmaTags: string[] = [];
  let accionTags: string[] = [];
  try {
    calmaTags = t.raw("calma_tags") || [];
    accionTags = t.raw("accion_tags") || [];
  } catch (e) {
    // Fallback static list in case raw reading has issues
    calmaTags = ["Aguas protegidas", "Sin presión", "Meditativo", "Después del trabajo"];
    accionTags = ["Mar abierto", "Viento fuerte", "Adrenalina", "Desafío"];
  }

  const MODOS = {
    calma: {
      label: t("selector_calma"),
      emoji: "🌊",
      bg: "#F5F5F7",
      textColor: "#1D1D1F",
      accentColor: "#0071E3",
      subtextColor: "#86868B",
      titulo: t("calma_title"),
      descripcion: t("calma_desc"),
      tags: calmaTags,
      cta: t("calma_cta"),
    },
    accion: {
      label: t("selector_accion"),
      emoji: "💨",
      bg: "#0071E3",
      textColor: "#FFFFFF",
      accentColor: "#FFFFFF",
      subtextColor: "rgba(255,255,255,0.7)",
      titulo: t("accion_title"),
      descripcion: t("accion_desc"),
      tags: accionTags,
      cta: t("accion_cta"),
    },
  };

  const data = MODOS[modo];

  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans">
            {t("selector_eyebrow")}
          </p>
          <h2
            className="text-[#1D1D1F] leading-tight font-bold"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {t("selector_title")}
          </h2>
        </motion.div>

        {/* Toggle Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-[#F5F5F7] rounded-full p-1 border border-[#E8E8ED]">
            {(["calma", "accion"] as Modo[]).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className="relative px-8 py-3 rounded-full text-sm font-medium transition-colors duration-200 outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: modo === m ? "#FFFFFF" : "#86868B",
                  zIndex: 1,
                }}
              >
                {modo === m && (
                  <motion.div
                    layoutId="toggle-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: m === "accion" ? "#0071E3" : "#1D1D1F" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 font-sans">
                  {MODOS[m].emoji} {MODOS[m].label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Animated Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={modo}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-12 md:p-16 border border-[#E8E8ED]"
            style={{ backgroundColor: data.bg }}
          >
            {/* Big Emoji */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="text-6xl mb-8"
            >
              {data.emoji}
            </motion.div>

            {/* Title */}
            <h3
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-dm-serif)", color: data.textColor }}
            >
              {data.titulo}
            </h3>

            {/* Description */}
            <p
              className="text-lg leading-relaxed mb-10 max-w-lg font-sans"
              style={{ color: data.subtextColor }}
            >
              {data.descripcion}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border font-sans"
                  style={{
                    color: data.textColor,
                    borderColor:
                      modo === "accion" ? "rgba(255,255,255,0.3)" : "#E8E8ED",
                    backgroundColor:
                      modo === "accion" ? "rgba(255,255,255,0.1)" : "#FFFFFF",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Link */}
            <Link
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 font-medium text-sm font-sans"
              style={{
                color: data.accentColor,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              {data.cta}
            </Link>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
