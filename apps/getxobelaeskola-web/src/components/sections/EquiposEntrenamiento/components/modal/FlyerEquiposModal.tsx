'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Euro, MapPin, CheckCircle, Info, Sparkles, AlertCircle } from 'lucide-react';

interface FlyerEquiposModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlyerEquiposModal({ isOpen, onClose }: FlyerEquiposModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
          {/* Fondo con desenfoque suave al hacer click fuera se cierra */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-gray-900 z-10 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              aria-label="Cerrar folleto"
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#0f4080] font-bold block mb-2">
                GUÍA COMPLETA Y CONDICIONES
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-950">
                Equipos de Entrenamiento • Getxo Bela Eskola
              </h2>
              <p className="text-sm font-sans text-gray-600 mt-1">
                Optimist · Láser · 420 — Un espacio para crecer en el mar con humanidad, trabajo en equipo y autonomía.
              </p>
            </div>

            {/* Contenido en cuadrículas estructuradas */}
            <div className="space-y-8 font-sans text-sm sm:text-base leading-relaxed text-gray-700">
              
              {/* ¿A quién va dirigido? */}
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-[#0f4080]">01.</span> ¿A quién va dirigido?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-1">Equipo Optimist (8 a 13-14 años)</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                      Aprenden desde cero o perfeccionan su técnica en barcos individuales, en un entorno seguro y colaborativo.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                    <h4 className="font-bold text-gray-900 mb-1">Equipo Láser y 420 (a partir de 13-14 años)</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                      Embarcaciones más grandes, sensibles y rápidas, individual o en pareja, desarrollando mayor autonomía y habilidades avanzadas.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  * No es necesario tener conocimientos previos de vela. Se trata de un programa progresivo, educativo y no competitivo.
                </p>
              </div>

              {/* Duración y Precio */}
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-[#0f4080]">02.</span> Duración y Precio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold uppercase text-gray-500 block">Curso Anual</span>
                    <strong className="text-xl font-bold text-[#0f4080]">Octubre a Junio</strong>
                    <span className="text-xs text-gray-500 block mt-1">9 meses de entrenamiento</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold uppercase text-gray-500 block">Cuota mensual</span>
                    <strong className="text-xl font-bold text-[#0f4080]">100€ / mes</strong>
                    <span className="text-xs text-gray-500 block mt-1">Matrícula: 85€ al inscribirse</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold uppercase text-gray-500 block">Campamento Verano</span>
                    <strong className="text-xl font-bold text-green-700">50€ / semana</strong>
                    <span className="text-xs text-gray-500 block mt-1">(Precio normal: 130€/sem)</span>
                  </div>
                </div>
              </div>

              {/* Horario y Frecuencia */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0f4080]" /> Horario y Frecuencia
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>3 domingos al mes de 10:00 a 15:00</strong> (habitualmente los 3 primeros domingos del mes, salvo ajustes de calendario).
                </p>
                <p className="text-xs text-amber-800 mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Sujeto a condiciones meteorológicas. En caso de temporal o falta de viento, se imparten talleres, audiovisuales, seguridad y juegos formativos.
                </p>
              </div>

              {/* Qué aprenden */}
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-[#0f4080]">03.</span> ¿Qué aprenden?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Montar y desmontar su barco correctamente</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Navegar con seguridad, eficacia y fluidez</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Ajustar velas y trimado para mejorar rendimiento</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Maniobras, viradas y ejercicios de destreza</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Desvolcar embarcaciones con seguridad</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Física aplicada a la vela y lectura de viento</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Normativa de regata y preferencias de paso</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Convivir, ayudar y disfrutar navegando en equipo</div>
                </div>
              </div>

              {/* ¿Cómo inscribirse y Qué traer? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">📋 ¿Cómo inscribirse?</h4>
                  <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Contacta para confirmar plaza disponible.</li>
                    <li>Rellena el Formulario de Inscripción.</li>
                    <li>Envía el formulario firmado y comprobante de pago.</li>
                  </ol>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Kutxabank:</strong> ES43 2095 0000 7091 0910 0619<br />
                    <em>Concepto: Nombre + Equipo entrenamiento</em>
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">🎒 ¿Qué traer?</h4>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>• Neopreno y escarpines (si se tienen)</li>
                    <li>• Ropa cómoda y de recambio + chubasquero/cortavientos</li>
                    <li>• Botella de agua y almuerzo (hamaiketako)</li>
                    <li>• Crema solar y visera o gorra</li>
                    <li>• Toalla y material para la ducha</li>
                  </ul>
                </div>
              </div>

              {/* Ubicación y Botón final */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  <MapPin className="w-4 h-4 inline mr-1 text-[#0f4080]" />
                  Puerto Deportivo de Getxo, Pabellón Vela S/N (al final del puerto).
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0f4080] hover:bg-[#0c3366] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  Cerrar folleto
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
