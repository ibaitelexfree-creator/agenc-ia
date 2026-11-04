'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Compass, ShieldCheck, Heart } from 'lucide-react';

const VALUES = [
  {
    icon: <Trophy className="w-6 h-6 text-[#E63900]" />,
    title: "Sin campeonas a cualquier precio",
    desc: "Acompañamos procesos formativos: entender el viento, navegar con calma y disfrutar del camino sin presiones añadidas."
  },
  {
    icon: <Compass className="w-6 h-6 text-[#2BE0C0]" />,
    title: "Embarcaciones a disposición",
    desc: "Facilitamos barcos y la gestión de inscripciones en Optimist, Laser/ILCA y 420 para que quien quiera competir tenga el respaldo de la escuela."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#0f4080]" />,
    title: "J80 en tripulación compartida",
    desc: "Nuestras socias organizan y navegan habitualmente en cruceros J80, participando en regatas de flota con espíritu de equipo."
  },
  {
    icon: <Heart className="w-6 h-6 text-[#E63900]" />,
    title: "El error como aprendizaje",
    desc: "Normalizamos el error como parte del mar y del deporte. Las tripulaciones se apoyan, aprenden juntas y celebran cada milla navegada."
  }
];

export default function RegatasFilosofia() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#E63900] block mb-2">
          VALORES Y ENFOQUE
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-950 tracking-tight">
          La mar como maestra, la regata como camino
        </h2>
        <div className="w-16 h-1 bg-[#E63900] mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {VALUES.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex gap-5 items-start"
          >
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm font-sans text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
