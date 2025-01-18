'use client';

import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const DesktopPC = ({ dataFunction }) => {
  const { scene } = useGLTF('/desktop_pc/scene.gltf'); // Use absolute or public URL paths

  useEffect(() => {
    if (scene) {
      dataFunction(false); // Notify parent component when loaded
    }
  }, [scene, dataFunction]);

  return (
    <mesh>
      {/* Hemisphere Light */}
      <hemisphereLight intensity={0.15} groundColor="black" />
      
      {/* Spot Light */}
      <spotLight
        position={[0, -4, -2]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      
      {/* Point Light */}
      <pointLight intensity={10} position={[0, 2, 0]} />
      
      {/* GLTF Primitive */}
      <primitive
        object={scene}
        position={[0, -2, -2]}
        rotation={[-0.01, -0.2, -0.2]}
      />
    </mesh>
  );
};

export default DesktopPC;
