"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  const line1 = t("hero_line1");
  const line2 = t("hero_line2");

  // Determine signature layout (split 'la' and 'vela.')
  // In ES: "la vela.", in EU: "bela.", in EN: "sailing.", in FR: "la voile."
  // We can just pulse the last vowel/character of the article or the word itself. Let's make it general:
  // We pulse the letter before the last word, or a specific character like the "a" if it exists.
  // Let's implement a clean signature pulse for the "a" in "la" (Spanish) or "a" in "bela" (Basque) or "a" in "sailing" (English) or "a" in "la voile" (French).
  const renderLine2WithPulse = () => {
    // If the text contains the letter 'a', let's pulse the first 'a' we find. Otherwise, pulse the second letter.
    const chars = line2.split("");
    const pulseIndex = chars.indexOf("a") !== -1 ? chars.indexOf("a") : 1;

    return chars.map((char, idx) => {
      if (idx === pulseIndex) {
        return (
          <motion.span
            key={idx}
            animate={{ scaleY: [1, 1.05, 1], scaleX: [1, 0.97, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ display: "inline-block", transformOrigin: "bottom center" }}
            className="text-[#0071E3]"
          >
            {char}
          </motion.span>
        );
      }
      // Highlight "vela"/"sailing"/"bela"/"voile" in blue. If line2 contains spaces (like "la vela"), highlight the last word.
      const words = line2.split(" ");
      const isLastWord = words.length > 1 && idx >= line2.lastIndexOf(words[words.length - 1]);
      const isOnlyWord = words.length === 1;

      return (
        <span key={idx} className={(isLastWord || isOnlyWord) ? "text-[#0071E3]" : ""}>
          {char}
        </span>
      );
    });
  };

  return (
    <section className="min-h-screen bg-white flex flex-col justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      
      {/* Decorative radial gradient in the background (almost invisible) */}
      <motion.div
        className="absolute right-[-20%] top-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8F2FF 0%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-8 font-sans"
        >
          {t("hero_eyebrow")}
        </motion.p>

        {/* H1 Line 1 */}
        <h1
          className="font-bold leading-none mb-0 text-[#1D1D1F] overflow-hidden"
          style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
        >
          <AnimatedText text={line1} delay={0.2} />
        </h1>

        {/* Animated divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#1D1D1F] my-4 origin-left"
          style={{ width: "clamp(200px, 35vw, 480px)" }}
        />

        {/* H1 Line 2 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 14, delay: 0.8 }}
            className="font-bold leading-none text-[#1D1D1F]"
            style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
          >
            {renderLine2WithPulse()}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          className="mt-10 text-[#86868B] max-w-xl leading-relaxed font-sans"
          style={{ fontSize: "1.2rem" }}
        >
          {t("hero_subtitle")}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="mt-10"
        >
          <a
            href="#filosofia"
            className="inline-flex items-center gap-2 border border-[#0071E3] text-[#0071E3] 
                       px-8 py-3 rounded-full text-sm font-medium font-sans
                       hover:bg-[#0071E3] hover:text-white transition-all duration-300"
          >
            {t("hero_discover")}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </a>
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

    </section>
  );
}
