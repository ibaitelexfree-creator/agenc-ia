// src/components/vela/Vela3DScene.tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, AdaptiveDpr, Preload, Sparkles } from '@react-three/drei';
import Vela3DBoat from './Vela3DBoat';
import Vela3DCameraRig from './Vela3DCameraRig';

export default function Vela3DScene() {
  const pixelRatio = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio, 1.5) // Limitar a 1.5x en móviles y pantallas de alta densidad
    : 1;

  const shadowMapSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 512 : 1024;

  return (
    <Canvas
      // Configuración del canvas
      camera={{
        position: [0, 12, 25],  // Posición inicial (keyframe 0)
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      // Performance: animar activamente
      frameloop="always"
      // Antialiasing para bordes suaves
      gl={{
        antialias: true,
        alpha: true,         // Fondo transparente
        powerPreference: 'high-performance',
        toneMapping: 3,      // ACESFilmicToneMapping (THREE.ACESFilmicToneMapping = 3)
        toneMappingExposure: 1.1,
        pixelRatio,
      }}
      // Sombras
      shadows
      // Estilo: ocupar todo el contenedor
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',  // No bloquear clicks en overlays
      }}
    >
      {/* Ajuste dinámico de resolución para móviles lentos */}
      <AdaptiveDpr pixelated />
      {/* Iluminación ambiental */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Luz direccional principal — simula el sol */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.2}
        color="#ffffff"      // Luz blanca pura
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Luz de relleno — desde la izquierda */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#ffffff"      // Luz blanca pura
      />

      {/* Rim light — detrás, para contornear la silueta */}
      <directionalLight
        position={[0, 3, -10]}
        intensity={0.4}
        color="#ffffff"      // Luz blanca pura
      />
      {/* Entorno HDRI para reflejos realistas en las superficies */}
      <Environment
        preset="city"          // Preset "city" da reflejos neutros y elegantes
        environmentIntensity={0.5}
      />

      {/* Sombra de contacto — "ancla" el barco al suelo virtual */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.25}
        scale={12}
        blur={2.5}
        far={8}
        color="#1D1D1F"
      />

      {/* Sutil efecto de "partículas de agua/luz" alrededor del barco */}
      <Sparkles
        count={40}
        scale={8}
        size={1.5}
        speed={0.3}
        opacity={0.15}
        color="#0071E3"  // Azul mar
      />

      {/* Camera Rig — controla la cámara basándose en scroll progress */}
      <Vela3DCameraRig />

      {/* El modelo del barco, dentro de Suspense para loading */}
      <Suspense fallback={null}>
        <Vela3DBoat />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
