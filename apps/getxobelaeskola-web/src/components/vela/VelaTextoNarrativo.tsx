"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useScrollLock } from "@/hooks/useScrollLock";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useScrollLock(modalRef, isModalOpen);

  // Auto-close modal when scrolling outer page
  useEffect(() => {
    if (!isModalOpen) return;
    const initialScrollY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 15) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isModalOpen]);

  const shortParagraphs = [
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
  ];

  const modalParagraphs = [
    t("modal_p1"),
    t("modal_p2"),
    t("modal_p3"),
    t("modal_p4"),
    t("modal_p5"),
    t("modal_p6"),
    t("modal_p7"),
    t("modal_p8"),
  ];

  return (
    <section className="bg-[#F5F5F7] py-20 sm:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4 font-sans text-center">
              {t("history_eyebrow")}
            </p>
            {/* Decorative vertical gradient line */}
            <div className="w-px h-16 bg-gradient-to-b from-[#0071E3] to-transparent mx-auto mb-2" />
          </motion.div>
        </div>

        {/* Short Text Story */}
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mb-10">
          {shortParagraphs.map((para, i) => (
            <motion.div
              key={para.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <p className="text-[#1D1D1F] leading-relaxed font-sans text-base sm:text-[1.12rem]">
                <HighlightText text={para.text} highlight={para.highlight} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Botón LEER MÁS idéntico a la Home */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center"
        >
          <GlowButton
            onClick={() => setIsModalOpen(true)}
            color="coral"
            size="md"
            className="!text-[#0D2137] !border-[#0D2137]/30 hover:!border-[#9E7F41] !bg-[#EFE7DC] hover:!bg-[#E6DECE] shadow-md hover:shadow-lg transition-all cursor-pointer mx-auto !py-2 !px-6 text-xs sm:text-sm uppercase font-semibold tracking-wider"
          >
            {t("leer_mas") || "LEER MÁS"}
          </GlowButton>
        </motion.div>

      </div>

      {/* ===================== MODAL PORTAL POP-UP (IDÉNTICO A HOME) ===================== */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 999999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 27, 58, 0.85)",
                backdropFilter: "blur(12px)",
                padding: "1rem",
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                style={{
                  backgroundColor: "#0D2137",
                  border: "1px solid rgba(158, 127, 65, 0.4)",
                  borderRadius: "1rem",
                  maxWidth: "46rem",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Cabecera del modal */}
                <div style={{ position: "sticky", top: 0, backgroundColor: "#0D2137", padding: "1.5rem", borderBottom: "1px solid rgba(158, 127, 65, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: "#9E7F41" }} />
                    <span style={{ fontSize: "0.875rem", fontFamily: "monospace", color: "#9E7F41", letterSpacing: "0.05em" }}>GETXO BELA ESKOLA</span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Cerrar modal"
                    style={{ background: "none", border: "none", color: "#FAF8F5", cursor: "pointer", padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido del modal */}
                <div style={{ padding: "2rem sm:3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.75rem", fontFamily: "serif", fontWeight: "bold", color: "#FAF8F5", lineHeight: 1.2 }}>
                    {t("modal_title") || "QUÉ ES LA VELA"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", color: "#FAF8F5", opacity: 0.9, lineHeight: 1.7, fontSize: "1rem" }}>
                    {modalParagraphs.map((parr, idx) => (
                      <p key={idx} className="font-light">
                        {parr}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
