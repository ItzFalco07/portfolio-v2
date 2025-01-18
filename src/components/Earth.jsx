'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const DesktopPC = ({ dataFunction }) => {
  const { scene } = useGLTF('/planet/scene.gltf'); // Ensure path uses the public folder
  const modelRef = useRef(null);

  // Trigger dataFunction when the model is loaded
  useEffect(() => {
    if (scene) dataFunction(false); // Notify parent component
  }, [scene, dataFunction]);

  // Rotate the model continuously on each frame
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Adjust rotation speed here
    }
  });

  return (
    <mesh ref={modelRef}>
      {/* Hemisphere Light */}
      <hemisphereLight intensity={0.15} groundColor="black" />
      
      {/* Spot Light */}
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      {/* Point Light */}
      <pointLight intensity={10} position={[0, 2, 0]} />
      
      {/* Model */}
      <primitive object={scene} />
      
      {/* Optional OrbitControls */}
      {/* <OrbitControls enableDamping={true} dampingFactor={0.1} /> */}
    </mesh>
  );
};

export default DesktopPC;
