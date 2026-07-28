// src/components/vela/Vela3DBoat.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useVelaScrollStore } from '@/stores/velaScrollStore';

const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
const MODEL_PATH = '/models/optimist-boat.glb';

export default function Vela3DBoat() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_CDN);
  const setIsModelLoaded = useVelaScrollStore((s) => s.setIsModelLoaded);

  useEffect(() => {
    if (scene) {
      // Centrar el modelo en el origen, basándose solo en mallas (meshes) reales para evitar distorsiones por nodos vacíos o cámaras
      const box = new THREE.Box3();
      let hasMeshes = false;

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          box.expandByObject(child);
          hasMeshes = true;
        }
      });

      // Si no encuentra meshes, usar el bounding box de la escena por defecto
      if (!hasMeshes) {
        box.setFromObject(scene);
      }

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Normalizar escala: queremos que el barco tenga ~4 unidades de largo
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 4;
      const scale = targetSize / (maxDim || 1);

      console.log('optimist-boat bounding box size:', size);
      console.log('optimist-boat scale factor:', scale);
      console.log('optimist-boat center:', center);

      scene.scale.setScalar(scale);
      scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      // Mejorar materiales para renderizado web y depurar
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            // Clonar el material para que sea independiente por cada malla y evitar efectos cruzados
            const mat = mesh.material instanceof THREE.Material ? mesh.material.clone() : mesh.material;
            mesh.material = mat;

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat) {
                console.log(`Mesh: ${mesh.name}, Material: ${mat.name}, Type: ${mat.type}`);
                
                const matName = mat.name.toLowerCase();
                
                // 1. Configuración general de inicio (mate por defecto)
                if ('metalness' in mat) (mat as any).metalness = 0.0;
                if ('roughness' in mat) (mat as any).roughness = 0.8;
                if ('envMapIntensity' in mat) (mat as any).envMapIntensity = 0.0;
                if ('clearcoat' in mat) (mat as any).clearcoat = 0.0;

                // 2. Reglas específicas por tipo de material
                if (matName.includes('set1combined') || matName.includes('material.001') || matName.includes('material.002')) {
                  // CASCO y partes blancas principales: blanco mate puro y sin mapas que metan sombras/brillos
                  if ('metalnessMap' in mat) (mat as any).metalnessMap = null;
                  if ('roughnessMap' in mat) (mat as any).roughnessMap = null;
                  if ('clearcoatMap' in mat) (mat as any).clearcoatMap = null;
                  if ('aoMap' in mat) (mat as any).aoMap = null;
                  if ('lightMap' in mat) (mat as any).lightMap = null;
                  
                  if ('color' in mat) (mat as any).color.setHex(0xffffff); // Blanco puro
                  if ('roughness' in mat) (mat as any).roughness = 1.0; // 100% mate
                  if ('metalness' in mat) (mat as any).metalness = 0.0;
                } 
                else if (matName.includes('sail')) {
                  // VELA: tela mate, mantiene su textura original
                  if ('roughness' in mat) (mat as any).roughness = 0.95;
                  if ('metalness' in mat) (mat as any).metalness = 0.0;
                }
                else if (matName.includes('roder') || matName.includes('wood') || matName.includes('rudder')) {
                  // TIMÓN / Madera: mate, mantiene su textura de madera
                  if ('roughness' in mat) (mat as any).roughness = 0.9;
                  if ('metalness' in mat) (mat as any).metalness = 0.0;
                }
                else if (matName.includes('metal') || matName.includes('neochrome')) {
                  // HERRAGES / Metal: brillo metálico realista para mástil, poleas, mosquetones
                  if ('metalness' in mat) (mat as any).metalness = 0.9;
                  if ('roughness' in mat) (mat as any).roughness = 0.15;
                  if ('envMapIntensity' in mat) (mat as any).envMapIntensity = 0.8; // Permite reflejos de entorno
                }

                // 3. Desactivar brillo especular clásico en Phong/Lambert
                if ('shininess' in mat) (mat as any).shininess = 0.0;
                if ('specular' in mat && (mat as any).specular?.setHex) {
                  (mat as any).specular.setHex(0x000000);
                }

                mat.needsUpdate = true;
              }
            });
          }
        }
      });
      setIsModelLoaded(true);
    }
  }, [scene, setIsModelLoaded]);



  // Sutil animación de "flotar" — el barco se mece como en el agua y cambia de tamaño con el scroll
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mecido suave: rotación en X (cabeceo) y Z (balanceo)
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.015;
    groupRef.current.rotation.z = Math.sin(time * 0.3 + 0.5) * 0.02;

    // Movimiento vertical suave (sube y baja como en el agua)
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.03;

    // Escala dinámicaตามขนาดหน้าจอ (320px ถึง 1920px) และ scroll progress:
    const screenWidth = state.size.width;
    // Factor de escala según ancho de pantalla: 320px (0.65x) -> 768px (0.85x) -> 1200px+ (1.0x) -> 1920px (1.1x)
    const responsiveScaleFactor = Math.min(1.1, Math.max(0.65, screenWidth / 1200));

    const progress = useVelaScrollStore.getState().progress;
    let baseScale = 0.95;
    if (progress < 0.15) {
      const t = progress / 0.15;
      baseScale = THREE.MathUtils.lerp(1.25, 0.95, t);
    } else if (progress >= 0.32 && progress <= 0.46) {
      const t = (progress - 0.32) / (0.46 - 0.32);
      baseScale = THREE.MathUtils.lerp(0.95, 1.25, t);
    } else if (progress > 0.46 && progress <= 0.56) {
      const t = (progress - 0.46) / (0.56 - 0.46);
      baseScale = THREE.MathUtils.lerp(1.25, 0.95, t);
    }

    const targetScale = baseScale * responsiveScaleFactor;

    // Aplicar escala suavizada
    const currentScale = groupRef.current.scale.x;
    const lerpedScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    groupRef.current.scale.setScalar(lerpedScale);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

// Precargar el modelo para que empiece a descargarse cuanto antes
useGLTF.preload(MODEL_PATH, DRACO_CDN);
