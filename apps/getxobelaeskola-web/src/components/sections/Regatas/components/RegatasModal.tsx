'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Anchor, Users, Compass } from 'lucide-react';

interface RegatasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegatasModal({ isOpen, onClose }: RegatasModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop con desenfoque suave y clic fuera para cerrar */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-[#060E18]/80 cursor-pointer"
          />

          {/* Modal Container con Framer Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-gradient-to-b from-[#0D1F2D] via-[#091522] to-[#060E18] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-white z-10 scrollbar-thin scrollbar-thumb-white/20"
          >
            {/* Botón de cerrar X flotante */}
            <button
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Encabezado */}
            <div className="mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#E63900] mb-2">
                <Trophy className="w-4 h-4" />
                <span>Manifiesto de Competición Pedagógica</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Regatas en Getxo Bela Eskola
              </h3>
              <p className="text-sm font-sans text-white/50 mt-1">
                La competición como herramienta de aprendizaje y disfrute compartido.
              </p>
            </div>

            {/* Contenido en párrafos refinados */}
            <div className="space-y-4 text-sm sm:text-base font-sans leading-relaxed text-white/85">
              <p>
                En Getxo Bela Eskola entendemos la <strong className="text-white font-semibold underline decoration-[#E63900]/50 underline-offset-4">competición como una herramienta más de aprendizaje, no como una meta obligatoria</strong>. Las regatas nos permiten trabajar la toma de decisiones, la lectura de la mar, el trabajo en equipo y la confianza en una misma.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex gap-3 items-start my-2">
                <Anchor className="w-5 h-5 text-[#2BE0C0] shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">
                  Contamos con grupos de tecnificación en <strong className="text-white">Optimist, Laser/ILCA y 420</strong>, donde quienes tienen interés en participar en regatas pueden hacerlo contando con el apoyo de la escuela. <strong className="text-[#2BE0C0]">Ponemos a su disposición las embarcaciones y facilitamos las inscripciones</strong>, acompañando a quienes quieren dar ese paso, sin que la competición sea una exigencia ni un objetivo para todo el alumnado. No buscamos que todo el mundo compita, sino ofrecer esa posibilidad a quien realmente lo desea.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex gap-3 items-start my-2">
                <Compass className="w-5 h-5 text-[#E63900] shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">
                  En el caso de los <strong className="text-white">J80</strong>, son las propias socias, tanto del grupo de entrenamiento como del resto del club, quienes organizan y participan habitualmente en regatas de crucero, compartiendo la experiencia de navegar y competir en equipo.
                </p>
              </div>

              <p>
                Participamos en regatas locales, autonómicas y estatales que se celebran por la zona, siempre desde la misma mirada: <strong className="text-white font-semibold">competir para crecer, compartir y aprender</strong>. Celebramos los avances y entendemos el error como parte del deporte y del aprendizaje.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm italic text-white/70">
                  Para muchas personas, las regatas son una forma diferente de vivir la mar: más intensa, más técnica y, sobre todo, más compartida. Para otras, una oportunidad de conocer nuevos retos. En ambos casos, el espíritu es el mismo: <strong className="text-white font-semibold not-italic">navegar juntas.</strong>
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-[#E63900] hover:bg-[#ff4d12] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#E63900]/20"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
