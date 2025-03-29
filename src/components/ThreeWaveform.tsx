
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AudioAnalyzer from './AudioAnalyzer';

interface ThreeWaveformProps {
  isListening: boolean;
}

const ThreeWaveform: React.FC<ThreeWaveformProps> = ({ isListening }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[5, 0, 5]} intensity={0.8} color="#9B87F5" />
        <AudioAnalyzer isListening={isListening} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} enablePan={false} />
        <gridHelper args={[20, 20]} position={[0, -2, 0]} rotation={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
