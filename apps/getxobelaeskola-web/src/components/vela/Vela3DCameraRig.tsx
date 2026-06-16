// src/components/vela/Vela3DCameraRig.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import { interpolateCamera } from './useBoatScroll';

export default function Vela3DCameraRig() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 12, 25));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const progress = useVelaScrollStore.getState().progress;
    const target = interpolateCamera(progress);

    // Lerp suave para que el movimiento de cámara sea fluido,
    // NO instantáneo. Factor 0.05 = muy suave, cinematográfico.
    const lerpFactor = 0.05;

    currentPos.current.lerp(target.position, lerpFactor);
    currentLookAt.current.lerp(target.lookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Interpolar FOV (solo PerspectiveCamera)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, target.fov, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null; // Este componente no renderiza nada, solo mueve la cámara
}
