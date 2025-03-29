
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioData } from '@/hooks/useAudioData';
import { MeshDistortMaterial } from '@react-three/drei';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssistantObjectProps {
  isListening: boolean;
}

const AssistantObject: React.FC<AssistantObjectProps> = ({ isListening }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { audioData } = useAudioData();
  const isMobile = useIsMobile();
  
  // Calculate size based on device
  const size = isMobile ? 0.8 : 1.2;
  
  // Animation loop
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();
    
    if (isListening && audioData) {
      // Calculate average audio intensity from mid-range frequencies for more stable morphing
      const midStart = Math.floor(audioData.length * 0.25);
      const midEnd = Math.floor(audioData.length * 0.75);
      let sum = 0;
      let count = 0;
      
      for (let i = midStart; i < midEnd; i++) {
        sum += audioData[i] || 0;
        count++;
      }
      
      const avgIntensity = count > 0 ? (sum / count) / 255 : 0;
      
      // Breathing animation + audio reactivity
      meshRef.current.scale.set(
        size * (1 + avgIntensity * 0.2),
        size * (1 + avgIntensity * 0.3),
        size * (1 + avgIntensity * 0.2)
      );
      
      // Subtle rotation based on audio
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      meshRef.current.rotation.y = time * 0.2 + Math.sin(time * 0.5) * avgIntensity * 0.5;
      
      // Position bobbing based on audio
      meshRef.current.position.y = Math.sin(time) * 0.1 + avgIntensity * 0.2;
    } else {
      // Gentle idle animation when not listening
      const breathFactor = Math.sin(time * 0.5) * 0.05 + 1;
      meshRef.current.scale.set(
        size * breathFactor,
        size * breathFactor,
        size * breathFactor
      );
      
      // Slow rotation when idle
      meshRef.current.rotation.y = time * 0.1;
      
      // Gentle floating motion
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#9B87F5"
        emissive="#3F2D8C"
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
        distort={isListening ? 0.4 : 0.2} // More distortion when listening
        speed={isListening ? 4 : 2} // Faster distortion when listening
      />
    </mesh>
  );
};

export default AssistantObject;
