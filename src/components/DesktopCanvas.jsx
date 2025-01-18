'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useCallback } from 'react';

// Dynamically load DesktopPC to improve bundle performance
const DesktopPC = dynamic(() => import('./DesktopPC'), { ssr: false });

const DesktopCanvas = ({ setLoading }) => {
  const [cameraPosition, setCameraPosition] = useState([20, 3, 5]);

  // Function to handle child data
  const getChildData = useCallback((data) => {
    if (!data) {
      setLoading(false);
    } else {
      console.log('loading...');
    }
  }, [setLoading]);

  // Function to update camera position based on screen size
  const updateCameraPosition = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 600 && screenWidth <= 768) {
      setCameraPosition([27, 3, 5]);
    } else if (screenWidth >= 300 && screenWidth < 600) {
      setCameraPosition([24, 3, 5]);
    } else {
      setCameraPosition([20, 3, 5]);
    }
  }, []);

  useEffect(() => {
    // Initial camera position setup
    updateCameraPosition();

    // Add resize listener
    const handleResize = () => {
      updateCameraPosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCameraPosition]);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraPosition, fov: 20 }}
    >
      <ambientLight />
      <DesktopPC dataFunction={getChildData} />
    </Canvas>
  );
};

export default DesktopCanvas;
