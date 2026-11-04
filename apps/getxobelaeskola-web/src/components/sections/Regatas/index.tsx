import WindCanvas from "./components/WindCanvas";
import HeroRegatas from "./components/HeroRegatas";
import RegatasFilosofia from "./components/RegatasFilosofia";
import styles from "./Regatas.module.css";
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';


export default function RegatasSection() {
  return (
    <div id="regatas-section" className={styles['equipos-root']}>
      {/* Canvas de viento + Hero con título gigante "REGATAS" y botón interactivo */}
      <div className={styles['equipos-hero-wrapper']}>
        <WindCanvas />
        <HeroRegatas />
      </div>

      {/* Filosofía y pilares de regata */}
      <RegatasFilosofia />

      {/* Conexión con Equipos de Entrenamiento */}
      <section className="w-full bg-gradient-to-b from-white to-[#F7FAFC] py-16 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#0f4080] block mb-3 font-bold">
            ¿QUIERES ENTRENAR Y MEJORAR TU NIVEL?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            Descubre nuestros Equipos de Entrenamiento
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Grupos continuos de Optimist, Laser, 420 y cruceros J80 para niñas, niños, jóvenes y adultas. Entrenamientos 3 domingos al mes durante todo el año.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/es/servicios/equipos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0f4080] hover:bg-[#0c3366] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#0f4080]/20 hover:shadow-[#0f4080]/35 transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              <span>Ver Equipos de Entrenamiento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
