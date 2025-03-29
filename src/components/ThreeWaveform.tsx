
import React from 'react';
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
  
  // Adjust camera position for vertical visualization
  const cameraPosition: [number, number, number] = isMobile ? [0, 0, 6] : [0, 0, 7];
  const fov = isMobile ? 70 : 60;
  
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: cameraPosition, fov: fov }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[5, 0, 5]} intensity={0.8} color="#9B87F5" />
        <AudioAnalyzer isListening={isListening} />
        <ParticleSystem isListening={isListening} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.3} // Slower rotation
          enablePan={false}
          maxPolarAngle={Math.PI * 0.65} // More limited vertical rotation
          minPolarAngle={Math.PI * 0.35}   // More limited vertical rotation
          maxAzimuthAngle={Math.PI * 0.2} // Limit horizontal rotation
          minAzimuthAngle={-Math.PI * 0.2} // Limit horizontal rotation
        />
        {/* Grid with adjusted position for vertical visualization */}
        <gridHelper 
          args={[isMobile ? 20 : 30, 30]} 
          position={[0, -3, 0]} 
          rotation={[0, 0, 0]}
          material={new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })}
        />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
