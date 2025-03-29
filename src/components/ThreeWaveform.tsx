
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AudioAnalyzer from './AudioAnalyzer';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreeWaveformProps {
  isListening: boolean;
}

const ThreeWaveform: React.FC<ThreeWaveformProps> = ({ isListening }) => {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition([x, y]);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setMousePosition([x, y]);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  // Adjust camera position to view the single cluster properly
  const cameraPosition: [number, number, number] = isMobile ? [0, 2, 12] : [0, 2, 16];
  const fov = isMobile ? 70 : 60;
  
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: cameraPosition, fov: fov }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[5, 0, 5]} intensity={0.8} color="#9B87F5" />
        <AudioAnalyzer isListening={isListening} />
        <ParticleSystem isListening={isListening} mousePosition={mousePosition} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 3} 
        />
        <gridHelper 
          args={[isMobile ? 60 : 80]} 
          position={[0, -2, 0]} 
          rotation={[0, 0, 0]}
          material={new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })}
        />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
