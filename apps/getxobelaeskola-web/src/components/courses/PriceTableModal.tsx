'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Wind, Compass, Users } from 'lucide-react';

interface PriceTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function PriceTableModal({ isOpen, onClose, locale }: PriceTableModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isEu = locale === 'eu';
  const isEn = locale === 'en';
  const isFr = locale === 'fr';

  const t = {
    title: isEu
      ? 'Prezioen Taula eta Modalitateak'
      : isEn
      ? 'Pricing Table & Modalities'
      : isFr
      ? 'Grille Tarifaire et Modalités'
      : 'Tabla de Precios y Modalidades',
    subtitle: isEu
      ? 'Getxo Bela Eskolako ikastaro eta entrenamenduen tarifa ofizialak'
      : isEn
      ? 'Official rates for courses and training sessions at Getxo Bela Eskola'
      : isFr
      ? 'Tarifs officiels des cours et entraînements à Getxo Bela Eskola'
      : 'Tarifas oficiales de cursos y entrenamientos en Getxo Bela Eskola',
    coursesTitle: isEu ? 'Helduentzako Ikastaroak' : isEn ? 'Adult Courses' : isFr ? 'Cours Adultes' : 'Cursos Adultos',
    shortCourses: isEu ? 'Ikastaro laburrak' : isEn ? 'Short Courses' : isFr ? 'Cours courts' : 'Cursos cortos',
    colCourse: isEu ? 'Ikastaroa' : isEn ? 'Course' : isFr ? 'Cours' : 'Curso',
    colPrice: isEu ? 'Prezioa' : isEn ? 'Price' : isFr ? 'Tarif' : 'Precio',
    colDuration: isEu ? 'Iraupena' : isEn ? 'Duration' : isFr ? 'Durée' : 'Duración',
    colOrg: isEu ? 'Antolaketa' : isEn ? 'Format' : isFr ? 'Organisation' : 'Organización',
    colMod: isEu ? 'Modalitatea' : isEn ? 'Modality' : isFr ? 'Modalité' : 'Modalidad',
    colRate: isEu ? 'Irteera bakoitzeko' : isEn ? 'Per session' : isFr ? 'Par séance' : 'Precio / salida',
    
    j80Name: isEu ? 'Hasiera J80' : 'Iniciación J80',
    j80Price: '180 €',
    
    konponduName: isEu ? 'Konpondu (mantenimendua)' : 'Konpondu (mantenimiento)',
    konponduPrice: '100 €',

    tecnificacionTitle: isEu ? 'Teknifikazioa (ikastaro jarraitua)' : 'Tecnificación (curso continuo)',
    tecnificacionSub: isEu ? 'Urtean zeharreko entrenamendu programa.' : 'Programa de entrenamiento durante el año.',
    anualName: isEu ? 'Urteko ikastaroa' : 'Curso anual',
    anualPrice: '100 € / mes',
    anualDur: isEu ? '10 hilabete (handigarria)' : '10 meses ampliable',
    anualOrg: isEu ? 'Hileko lehenengo 3 asteak' : '3 primeras semanas de cada mes',
    
    mesSueltoName: isEu ? 'Hilabete 1 solte' : '1 mes suelto',
    mesSueltoPrice: '110 €',
    mesSueltoDur: isEu ? 'Hilabete 1' : '1 mes',
    mesSueltoOrg: isEu ? 'Saio berdinak' : 'mismas sesiones',
    
    salidaName: isEu ? 'Irteera puntuala' : 'Salida puntual',
    salidaPrice: '45 €',
    salidaDur: isEu ? 'Egun 1' : '1 día',
    salidaOrg: isEu ? 'Saio soltea' : 'sesión suelta',

    windsurfTitle: 'Windsurf',
    windsurf4Name: isEu ? '4 saio solte (2,5h)' : '4 sesiones sueltas (2,5h)',
    windsurf4Price: '150 €',
    windsurf4Dur: '10 h',
    windsurf4Rate: '37,5 € / salida',

    windsurf1Name: isEu ? '1 saio solte (2,5h)' : '1 sesión suelta (2,5h)',
    windsurf1Price: '45 €',
    windsurf1Dur: '2,5 h',
    windsurf1Rate: '45 € / salida',

    windsurfCampusName: isEu ? 'Campusa (5 saio finko eta jarraitu 3h)' : 'Campus (5 sesiones fijas y continuas 3h)',
    windsurfCampusPrice: '250 €',
    windsurfCampusDur: '15 h',
    windsurfCampusRate: '50 € / salida (3h)',

    youthTitle: isEu ? 'Haur eta Gazteentzako Ikastaroak (5-21 urte)' : 'Cursos Infantiles (5-21 años)',
    youthDesc: isEu
      ? 'Txikigune larunbatetan, Udalekuak udan eta urte osoko entrenamendu egonkorrak teknikoki hazteko.'
      : 'Txikigune (sábados de navegación), Udalekuak (campamentos) y entrenamientos infantiles y continuos para jóvenes durante todo el año.',
    youthNote: isEu
      ? 'Ikusi fitxa bakoitza edo jarri gurekin harremanetan datak ezagutzeko.'
      : 'Consulta cada ficha o ponte en contacto con nosotros para conocer disponibilidad y fechas.'
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 md:p-8"
          style={{
            backgroundColor: 'rgba(0, 15, 30, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#F2A93B]/30 bg-[#08182B] text-[#F0F4F8] p-5 sm:p-7 md:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_45px_rgba(242,169,59,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Cerrar tabla de precios"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/10 hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:text-white text-white flex items-center justify-center transition-all duration-300 z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-white/10 pb-4 mb-6 pr-10">
              <span className="text-[#F2A93B] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold block mb-1">
                GETXO BELA ESKOLA · TARIFAS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display text-white italic font-normal tracking-tight">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-7">
              {/* BLOCK 1: CURSOS CORTOS ADULTOS */}
              <section>
                <div className="flex items-center gap-2 mb-2.5">
                  <Compass className="w-4 h-4 text-[#F2A93B]" />
                  <h3 className="text-sm sm:text-base font-display text-[#F2A93B] uppercase tracking-wider font-semibold">
                    {t.coursesTitle} · {t.shortCourses}
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.05] text-white/70 uppercase tracking-wider text-[10px] sm:text-xs">
                        <th className="py-2.5 px-3 sm:px-4 font-semibold">{t.colCourse}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-right">{t.colPrice}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-center">{t.colDuration}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold">{t.colOrg}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.j80Name}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.j80Price}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          12 h
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-white/70">
                          {isEu ? '3 egun' : '3 días'}
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.konponduName}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.konponduPrice}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          8 h
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-white/70">
                          {isEu ? '2 egun · 4h/egun' : '2 días · 4h/día'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* BLOCK 2: TECNIFICACIÓN (CURSO CONTINUO) */}
              <section>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[#F2A93B]" />
                  <h3 className="text-sm sm:text-base font-display text-[#F2A93B] uppercase tracking-wider font-semibold">
                    {t.tecnificacionTitle}
                  </h3>
                </div>
                <p className="text-xs text-white/60 mb-2.5 italic">
                  {t.tecnificacionSub}
                </p>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.05] text-white/70 uppercase tracking-wider text-[10px] sm:text-xs">
                        <th className="py-2.5 px-3 sm:px-4 font-semibold">{t.colMod}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-right">{t.colPrice}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-center">{t.colDuration}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold">{t.colOrg}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.anualName}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.anualPrice}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.anualDur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-white/70">
                          {t.anualOrg}
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.mesSueltoName}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.mesSueltoPrice}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.mesSueltoDur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-white/70">
                          {t.mesSueltoOrg}
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.salidaName}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.salidaPrice}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.salidaDur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-white/70">
                          {t.salidaOrg}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* BLOCK 3: WINDSURF */}
              <section>
                <div className="flex items-center gap-2 mb-2.5">
                  <Wind className="w-4 h-4 text-[#F2A93B]" />
                  <h3 className="text-sm sm:text-base font-display text-[#F2A93B] uppercase tracking-wider font-semibold">
                    {t.windsurfTitle}
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.05] text-white/70 uppercase tracking-wider text-[10px] sm:text-xs">
                        <th className="py-2.5 px-3 sm:px-4 font-semibold">{t.colCourse}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-right">{t.colPrice}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-center">{t.colDuration}</th>
                        <th className="py-2.5 px-3 sm:px-4 font-semibold text-right">{t.colRate}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.windsurf4Name}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.windsurf4Price}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.windsurf4Dur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-[#F2A93B] font-mono whitespace-nowrap font-semibold">
                          {t.windsurf4Rate}
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.windsurf1Name}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.windsurf1Price}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.windsurf1Dur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-[#F2A93B] font-mono whitespace-nowrap font-semibold">
                          {t.windsurf1Rate}
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-3 sm:px-4 font-medium text-white">
                          {t.windsurfCampusName}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-display text-base text-[#FF4D00] whitespace-nowrap font-bold">
                          {t.windsurfCampusPrice}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center text-white/90 whitespace-nowrap">
                          {t.windsurfCampusDur}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-[#F2A93B] font-mono whitespace-nowrap font-semibold">
                          {t.windsurfCampusRate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* BLOCK 4: JÓVENES E INFANTILES */}
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#F2A93B]" />
                  <h3 className="text-sm sm:text-base font-display text-[#F2A93B] uppercase tracking-wider font-semibold">
                    {t.youthTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-2">
                  {t.youthDesc}
                </p>
                <p className="text-[11px] sm:text-xs text-white/50 italic">
                  {t.youthNote}
                </p>
              </section>
            </div>

            {/* Modal Footer Note */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white/60">
              <span>* Material técnico, embarcaciones y chalecos incluidos en todas las formaciones.</span>
              <button
                onClick={onClose}
                className="text-[#FF4D00] hover:underline uppercase tracking-widest text-[10px] font-bold"
              >
                {isEu ? 'Itxi' : isEn ? 'Close' : isFr ? 'Fermer' : 'Cerrar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
