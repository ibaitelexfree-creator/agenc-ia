'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Anchor, Users, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export interface FlotaModalData {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  vessels: string[];
  schedule: string;
  focus: string;
  age: string;
  fullContent: {
    intro: string;
    boatsText: string;
    methodText: string;
    groupValueText: string;
    idealForText: string;
    extraQuestion?: {
      q: string;
      a: string;
    };
  };
}

interface FlotaModalProps {
  data: FlotaModalData | null;
  onClose: () => void;
}

export default function FlotaModal({ data, onClose }: FlotaModalProps) {
  useEffect(() => {
    if (data) {
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
  }, [data, onClose]);

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
          {/* Backdrop con desenfoque; clic fuera cierra */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-gray-900 z-10 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {/* Botón X de cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar detalles"
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera */}
            <div className="border-b border-gray-100 pb-5 mb-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#0f4080] font-bold block mb-1">
                {data.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-950">
                {data.title}
              </h3>
              <p className="text-sm font-sans text-gray-600 mt-1">
                {data.shortDesc}
              </p>

              {/* Pills info */}
              <div className="flex flex-wrap gap-2.5 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#0f4080]" />
                  {data.schedule}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold">
                  <Anchor className="w-3.5 h-3.5 text-amber-700" />
                  {data.age}
                </span>
              </div>
            </div>

            {/* Contenido Completo del Modal */}
            <div className="space-y-4 text-sm sm:text-base font-sans text-gray-700 leading-relaxed">
              <p>{data.fullContent.intro}</p>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 my-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f4080] flex items-center gap-2">
                  <Anchor className="w-4 h-4" /> Flota y Embarcaciones
                </h4>
                <p className="text-xs sm:text-sm text-gray-700">{data.fullContent.boatsText}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.vessels.map(v => (
                    <span key={v} className="px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-[11px] font-semibold text-gray-800">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <p>{data.fullContent.methodText}</p>
              <p>{data.fullContent.groupValueText}</p>
              <p className="font-medium text-gray-900">{data.fullContent.idealForText}</p>

              {data.fullContent.extraQuestion && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    {data.fullContent.extraQuestion.q}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-900 leading-normal">
                    {data.fullContent.extraQuestion.a}
                  </p>
                </div>
              )}
            </div>

            {/* Botón de cierre abajo */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#0f4080] hover:bg-[#0c3366] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
