// src/components/vela/Vela3DCameraRig.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import { interpolateCamera } from './useBoatScroll';

export default function Vela3DCameraRig() {
  const { camera, size } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 12, 25));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const progress = useVelaScrollStore.getState().progress;
    const target = interpolateCamera(progress);

    // Adaptar la posición y FOV según el aspecto de pantalla (de 320px móvil a 1920px desktop)
    const aspect = size.width / Math.max(size.height, 1);
    let responsiveFov = target.fov;
    const responsivePos = target.position.clone();
    const responsiveLookAt = target.lookAt.clone();

    if (aspect < 1) {
      // En móvil portrait (aspect < 1), ampliar FOV sutilmente para mantener el barco encuadrado
      responsiveFov = Math.min(54, target.fov / Math.max(aspect * 0.95, 0.6));
    }

    // Lerp suave para movimiento fluido (factor 0.06)
    const lerpFactor = 0.06;

    currentPos.current.lerp(responsivePos, lerpFactor);
    currentLookAt.current.lerp(responsiveLookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Interpolar FOV (solo PerspectiveCamera)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, responsiveFov, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
