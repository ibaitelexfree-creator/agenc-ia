// index.tsx — sección completa
'use client';

import WindCanvas          from "./components/WindCanvas";
import HeroEquipos         from "./components/HeroEquipos";
import FilosofiaMarquee    from "./components/FilosofiaMarquee";
import TeamCards           from "./components/TeamCards";
import CalendarView        from "./components/CalendarView";
import LogbookRequirements from "./components/LogbookRequirements";
import CTAFinal            from "./components/CTAFinal";
import styles              from "./EquiposEntrenamiento.module.css";

export default function EquiposEntrenamiento() {
  return (
    <div id="equipos-entrenamiento" className={styles['equipos-root']}>

      {/* Canvas de viento — cubre solo el hero */}
      <div className={styles['equipos-hero-wrapper']}>
        <WindCanvas />
        <HeroEquipos />
      </div>

      <FilosofiaMarquee />
      <TeamCards />
      <CalendarView />
      <LogbookRequirements />
      <CTAFinal />

    </div>
  );
}
