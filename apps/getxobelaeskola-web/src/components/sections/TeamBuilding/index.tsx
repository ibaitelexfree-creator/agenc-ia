'use client';

import React, { useRef } from 'react';
import TeamHero from './components/TeamHero';
import SplitSection from './components/SplitSection';
import BoatDiagram from './components/BoatDiagram';
import JornadaTimeline from './components/JornadaTimeline';
import AprendizajeMap from './components/AprendizajeMap';
import DetallesCTA from './components/DetallesCTA';

export default function TeamBuilding() {
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const timelineSectionRef = useRef<HTMLDivElement>(null);

  const scrollToCTA = () => {
    ctaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTimeline = () => {
    timelineSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Phase 1: Hero */}
      <TeamHero onScrollToForm={scrollToCTA} onScrollToTimeline={scrollToTimeline} />
      
      {/* Phase 2: Earth/Sea Split Comparison */}
      <SplitSection />
      
      {/* Phase 3: J80 Boat interactive diagram */}
      <BoatDiagram />
      
      {/* Phase 4: Jornada Timeline Horizontal Slider */}
      <div ref={timelineSectionRef}>
        <JornadaTimeline />
      </div>
      
      {/* Phase 5: Ocean/Business Transfer Mapping */}
      <AprendizajeMap />
      
      {/* Phase 6: details grid and form */}
      <div ref={ctaSectionRef}>
        <DetallesCTA />
      </div>
    </div>
  );
}
