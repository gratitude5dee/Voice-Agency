
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AudioAnalyzer from './AudioAnalyzer';
import ParticleSystem from './ParticleSystem';
import AssistantObject from './AssistantObject';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreeWaveformProps {
  isListening: boolean;
}

const ThreeWaveform: React.FC<ThreeWaveformProps> = ({ isListening }) => {
  const isMobile = useIsMobile();
  
  // Adjust camera position for mobile
  const cameraPosition: [number, number, number] = isMobile ? [0, 2, 5] : [0, 2, 6];
  const fov = isMobile ? 70 : 60;
  
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: cameraPosition, fov: fov }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[5, 0, 5]} intensity={0.8} color="#9B87F5" />
        <AudioAnalyzer isListening={isListening} />
        <ParticleSystem isListening={isListening} />
        <AssistantObject isListening={isListening} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} // Slower rotation
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5} // Limit how far down we can look
          minPolarAngle={Math.PI / 3}   // Limit how far up we can look
        />
        {/* Grid with adjusted size for viewport containment */}
        <gridHelper 
          args={[isMobile ? 20 : 30, 30]} 
          position={[0, -2, 0]} 
          rotation={[0, 0, 0]}
          material={new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })}
        />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
