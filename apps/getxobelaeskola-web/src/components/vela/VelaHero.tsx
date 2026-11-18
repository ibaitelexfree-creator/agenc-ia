"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useScrollLock } from "@/hooks/useScrollLock";

function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const letters = text.split("");
  return (
    <span className={className} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export default function VelaHero() {
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

  const line1 = t("hero_line1");
  const line2 = t("hero_line2");

  // In ES: "la vela", in EU: "bela", in EN: "sailing", in FR: "la voile"
  // Keep the article (e.g. "la") black (#1D1D1F) and color the noun ("vela"/"bela"/"sailing"/"voile") in blue (#0071E3)
  const renderLine2 = () => {
    const words = line2.split(" ");
    if (words.length > 1) {
      const article = words.slice(0, -1).join(" ");
      const noun = words[words.length - 1];
      return (
        <>
          <span className="text-[#1D1D1F]">{article}</span>{" "}
          <span className="text-[#0071E3]">{noun}</span>
        </>
      );
    }
    return <span className="text-[#0071E3]">{line2}</span>;
  };

  return (
    <section className="min-h-screen bg-white flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
      
      {/* Decorative radial gradient in the background (almost invisible) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8F2FF 0%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-6 font-sans text-center"
        >
          {t("hero_eyebrow")}
        </motion.p>

        {/* H1 Line 1 */}
        <h1
          className="font-bold leading-none mb-0 text-[#1D1D1F] overflow-hidden text-center"
          style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
        >
          <AnimatedText text={line1} delay={0.2} />
        </h1>

        {/* Animated divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#1D1D1F] my-4 mx-auto origin-center"
          style={{ width: "clamp(180px, 30vw, 400px)" }}
        />

        {/* H1 Line 2 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 14, delay: 0.8 }}
            className="font-bold leading-none text-[#1D1D1F] text-center"
            style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
          >
            {renderLine2()}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          className="mt-8 text-[#86868B] max-w-2xl mx-auto leading-relaxed font-sans text-center"
          style={{ fontSize: "1.2rem" }}
        >
          {t("hero_subtitle")}
        </motion.p>

        {/* Botón LEER MÁS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="mt-10"
        >
          <GlowButton
            onClick={() => setIsModalOpen(true)}
            color="coral"
            size="md"
            className="!text-[#0D2137] !border-[#0D2137]/30 hover:!border-[#9E7F41] !bg-[#EFE7DC] hover:!bg-[#E6DECE] shadow-md hover:shadow-lg transition-all cursor-pointer mx-auto !py-2.5 !px-8 text-xs sm:text-sm uppercase font-semibold tracking-wider"
          >
            {t("leer_mas") || "LEER MÁS"}
          </GlowButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-px h-12 bg-[#86868B]/40 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ===================== MODAL PORTAL POP-UP ===================== */}
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
