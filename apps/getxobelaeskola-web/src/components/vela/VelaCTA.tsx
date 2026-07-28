"use client";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function VelaCTA() {
  const t = useTranslations("que_es_la_vela");
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Decorative divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#E8E8ED] mb-12 sm:mb-20 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#86868B] text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-6 font-sans"
        >
          {t("cta_eyebrow")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#1D1D1F] leading-tight mb-4 sm:mb-6 font-bold"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
          }}
        >
          {t("cta_title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#86868B] text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-lg mx-auto font-sans"
        >
          {t("cta_subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Link
            href={`/${locale}/courses`}
            className="w-full sm:w-auto inline-block bg-[#0071E3] text-white font-medium text-xs sm:text-sm font-sans
                       px-6 sm:px-8 py-3 rounded-full hover:bg-[#0077ED] 
                       transition-all duration-200 shadow-[0_4px_16px_rgba(0,113,227,0.3)]
                       hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] hover:scale-[1.02] text-center"
          >
            {t("cta_button_start")}
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="w-full sm:w-auto inline-block bg-transparent text-[#0071E3] font-medium text-xs sm:text-sm font-sans
                       px-6 sm:px-8 py-3 rounded-full border border-[#0071E3]/30
                       hover:border-[#0071E3] hover:bg-[#E8F2FF]
                       transition-all duration-200 text-center"
          >
            {t("cta_button_all")}
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
