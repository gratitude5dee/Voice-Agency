
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioData } from '@/hooks/useAudioData';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticleSystemProps {
  isListening: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ isListening }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { audioData } = useAudioData();
  const isMobile = useIsMobile();
  
  // Generate particles
  const [particles] = useState(() => {
    // Reduce particle count
    const count = isMobile ? 1000 : 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Initialize particles in a circular pattern (like the waveform)
    const radius = isMobile ? 1.5 : 2;
    
    for (let i = 0; i < count; i++) {
      // Position particles in a circle initially
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const y = 0;
      const z = Math.cos(angle) * radius;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors (purple to pink gradient)
      const hue = 0.75 + Math.random() * 0.1; // Purple to pink range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Varied sizes - smaller on mobile
      sizes[i] = Math.random() * (isMobile ? 0.4 : 0.5) + (isMobile ? 0.3 : 0.5);
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Update particles to follow waveform
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Base radius of the circular path
    const baseRadius = isMobile ? 1.5 : 2;
    
    // For each particle
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Map each particle to a position along the waveform circle
      const particleIndex = i % 64; // Map to one of the 64 audio bars
      const angle = (particleIndex / 64) * Math.PI * 2;
      
      // Get audio intensity for this position if listening
      let audioIntensity = 0;
      if (isListening && audioData && audioData.length > 0) {
        const audioIndex = Math.floor(particleIndex % audioData.length);
        audioIntensity = Math.min((audioData[audioIndex] || 0) / 255, 0.8);
      }
      
      // Calculate height based on audio or idle animation
      let height;
      if (isListening && audioData) {
        // Audio-reactive height
        height = audioIntensity * 2;
      } else {
        // Idle animation - gentle wave pattern
        height = Math.sin(angle * 8 + time * 3) * 0.4 + 0.3;
      }
      
      // Add some randomization within the waveform area
      const randomOffset = 0.15;
      const randomX = (Math.random() - 0.5) * randomOffset;
      const randomY = (Math.random() - 0.5) * randomOffset;
      const randomZ = (Math.random() - 0.5) * randomOffset;
      
      // Calculate final position along the waveform
      const radius = baseRadius + (Math.random() - 0.5) * 0.2;
      const x = Math.sin(angle) * radius + randomX;
      const y = height + randomY; // Height based on audio or animation
      const z = Math.cos(angle) * radius + randomZ;
      
      // Apply position with smooth lerping
      positions[i3] = THREE.MathUtils.lerp(positions[i3], x, 0.05);
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], y, 0.05);
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], z, 0.05);
      
      // Update size based on audio
      const baseSize = particles.sizes[i];
      sizes[i] = baseSize * (1 + (audioIntensity * 1.2));
      
      // Update color based on height/audio intensity
      const hue = 0.75 + (height * 0.1); // Shift hue based on height
      const saturation = 0.7 + (audioIntensity * 0.3);
      const lightness = 0.5 + (audioIntensity * 0.3);
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i3] = THREE.MathUtils.lerp(colors[i3], color.r, 0.1);
      colors[i3 + 1] = THREE.MathUtils.lerp(colors[i3 + 1], color.g, 0.1);
      colors[i3 + 2] = THREE.MathUtils.lerp(colors[i3 + 2], color.b, 0.1);
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
  }, [isMobile]);
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={particleMaterial} />
    </points>
  );
};

export default ParticleSystem;
