'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface EnConstruccionContentProps {
  locale: string;
  badge: string;
  title: string;
  apology: string;
  question: string;
  prompt: string;
  emailBtn: string;
  whatsappBtn: string;
  contactBtn: string;
  backHome: string;
}

export function EnConstruccionContent({
  locale,
  badge,
  title,
  apology,
  question,
  prompt,
  emailBtn,
  whatsappBtn,
  contactBtn,
  backHome,
}: EnConstruccionContentProps) {
  const whatsappUrl = 'https://wa.me/34634405624?text=' + encodeURIComponent('¡Hola! Me gustaría recibir información sobre los programas y cursos de Getxo Bela Eskola.');
  const emailUrl = 'mailto:info@getxobelaeskola.com?subject=' + encodeURIComponent('Consulta sobre Programa - Getxo Bela Eskola') + '&body=' + encodeURIComponent('¡Hola!\n\nMe gustaría recibir información sobre este programa.\n\nNombre:\nTeléfono:\n\n¡Gracias!');
  const contactFormUrl = `/${locale}/contact`;

  return (
    <main className="min-h-screen bg-nautical-black text-white relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-28">
      {/* Luces y ambientación de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="bg-mesh pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 text-center flex flex-col items-center">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>🚧 {badge} 🚧</span>
        </motion.div>

        {/* DIBUJO ANIMADO DIVERTIDO EN MEDIO: Cangrejo marinero con casco de obra y llave inglesa pidiendo disculpas */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative my-4 flex items-center justify-center"
        >
          {/* Círculo con resplandor */}
          <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/20 via-sky-500/10 to-transparent blur-2xl" />

          {/* Animación flotante / balanceo divertido */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <svg
              width="240"
              height="200"
              viewBox="0 0 240 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
            >
              {/* Barricada / cinta de obra en el suelo */}
              <g opacity="0.9">
                <rect x="25" y="172" width="190" height="12" rx="3" fill="#F59E0B" />
                <path d="M40 172 L55 184 H45 L30 172 Z" fill="#1E293B" />
                <path d="M70 172 L85 184 H75 L60 172 Z" fill="#1E293B" />
                <path d="M100 172 L115 184 H105 L90 172 Z" fill="#1E293B" />
                <path d="M130 172 L145 184 H135 L120 172 Z" fill="#1E293B" />
                <path d="M160 172 L175 184 H165 L150 172 Z" fill="#1E293B" />
                <path d="M190 172 L205 184 H195 L180 172 Z" fill="#1E293B" />
                {/* Patas de la barricada */}
                <rect x="42" y="184" width="8" height="12" rx="1" fill="#64748B" />
                <rect x="190" y="184" width="8" height="12" rx="1" fill="#64748B" />
              </g>

              {/* Patitas del cangrejo */}
              <g stroke="#E8593C" strokeWidth="4" strokeLinecap="round">
                <path d="M80 135 Q60 145 62 165" />
                <path d="M88 140 Q75 155 78 170" />
                <path d="M96 145 Q88 160 92 172" />
                <path d="M160 135 Q180 145 178 165" />
                <path d="M152 140 Q165 155 162 170" />
                <path d="M144 145 Q152 160 148 172" />
              </g>

              {/* Cuerpo del cangrejo */}
              <ellipse cx="120" cy="132" rx="46" ry="32" fill="#E8593C" />
              {/* Detalle panza */}
              <ellipse cx="120" cy="136" rx="34" ry="22" fill="#F87171" opacity="0.6" />

              {/* Ojos con expresión apenada / disculpa graciosa */}
              {/* Ojo izquierdo */}
              <circle cx="102" cy="94" r="14" fill="white" stroke="#E8593C" strokeWidth="3" />
              <circle cx="104" cy="95" r="6" fill="#0F172A" />
              <circle cx="106" cy="93" r="2.5" fill="white" />
              {/* Ceja izquierda en ángulo de disculpa */}
              <path d="M90 80 Q102 85 112 88" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Ojo derecho */}
              <circle cx="138" cy="94" r="14" fill="white" stroke="#E8593C" strokeWidth="3" />
              <circle cx="136" cy="95" r="6" fill="#0F172A" />
              <circle cx="138" cy="93" r="2.5" fill="white" />
              {/* Ceja derecha en ángulo de disculpa */}
              <path d="M150 80 Q138 85 128 88" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Gota de sudor cómica de disculpa */}
              <motion.g
                animate={{ y: [0, 4, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M156 86 C156 82 162 76 162 76 C162 76 168 82 168 86 C168 89.3 165.3 92 162 92 C158.7 92 156 89.3 156 86 Z" fill="#38BDF8" />
              </motion.g>

              {/* Boca de "Ups, lo siento!" tímida y simpática */}
              <path d="M110 142 Q120 148 130 142" stroke="#450A0A" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Rubor en las mejillas */}
              <ellipse cx="92" cy="135" rx="7" ry="4" fill="#F43F5E" opacity="0.4" />
              <ellipse cx="148" cy="135" rx="7" ry="4" fill="#F43F5E" opacity="0.4" />

              {/* Pinza Izquierda saludando tímidamente / pidiendo perdón (gesto de manos juntas/reverencia) */}
              <motion.g
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '76px 125px' }}
              >
                <path d="M80 128 C65 115 50 110 40 98" stroke="#E8593C" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M38 98 C30 90 26 78 35 72 C42 66 48 76 46 84 C48 76 58 78 58 86 C58 96 46 102 38 98 Z" fill="#E8593C" />
              </motion.g>

              {/* Pinza Derecha sosteniendo una llave inglesa de obra náutica */}
              <motion.g
                animate={{ rotate: [4, -4, 4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '164px 125px' }}
              >
                <path d="M160 128 C175 115 190 110 200 98" stroke="#E8593C" strokeWidth="7" strokeLinecap="round" fill="none" />
                {/* Pinza */}
                <path d="M202 98 C210 90 214 78 205 72 C198 66 192 76 194 84 C192 76 182 78 182 86 C182 96 194 102 202 98 Z" fill="#E8593C" />
                {/* Llave inglesa cromada en la pinza */}
                <g transform="translate(196, 50) rotate(25)">
                  <rect x="0" y="14" width="7" height="34" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
                  <path d="M-3 14 C-3 6 10 6 10 14 L7 16 C5 12 2 12 0 16 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
                  <circle cx="3.5" cy="44" r="3" fill="#64748B" />
                </g>
              </motion.g>

              {/* CASCO DE OBRA AMARILLO SOBRE LA CABEZA */}
              <motion.g
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Ala del casco */}
                <path d="M92 76 C105 72 135 72 148 76 L154 78 C156 79 152 82 146 81 L94 81 C88 82 84 79 86 78 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
                {/* Cúpula del casco de construcción */}
                <path d="M94 76 C94 48 146 48 146 76 Z" fill="#FACC15" />
                {/* Nervio central del casco */}
                <path d="M117 50 C117 48 123 48 123 50 L123 75 L117 75 Z" fill="#EAB308" />
                {/* Brillo del casco */}
                <path d="M102 62 C104 56 112 53 118 53" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                {/* Pequeña ancla marinera en el frontal del casco */}
                <path d="M120 62 L120 71 M116 68 Q120 74 124 68 M118 64 H122" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </motion.g>
            </svg>
          </motion.div>
        </motion.div>

        {/* Título y Mensaje de Disculpas */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-display italic font-bold text-white mb-4 leading-tight tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg text-white/80 font-light max-w-xl mx-auto mb-4 leading-relaxed"
        >
          {apology}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-sm sm:text-base text-amber-300/90 font-medium max-w-lg mx-auto mb-8"
        >
          {question} {prompt}
        </motion.p>

        {/* Tres Botones de Contacto (Email, WhatsApp, Formulario) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10"
        >
          {/* Email */}
          <a
            href={emailUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span className="text-slate-900">{emailBtn}</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#25D366]/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-950">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-slate-950">{whatsappBtn}</span>
          </a>

          {/* Formulario de Contacto */}
          <Link
            href={contactFormUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-400/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-950">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-slate-950">{contactBtn}</span>
          </Link>
        </motion.div>

        {/* Botón Volver al Inicio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>{backHome}</span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
