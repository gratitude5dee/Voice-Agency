
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioData } from '@/hooks/useAudioData';

interface ParticleSystemProps {
  isListening: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ isListening }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { audioData } = useAudioData();
  
  // Generate particles
  const [particles] = useState(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Initialize particles in a sphere
    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const radius = 5 * Math.pow(Math.random(), 1/3);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors (purple to pink gradient)
      const hue = 0.75 + Math.random() * 0.1; // Purple to pink range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Update particles animation
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Scale based on whether we're listening and processing audio
    const scale = isListening ? 1.2 : 1.0;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get original position (stored in our initial positions array)
      const x = particles.positions[i3];
      const y = particles.positions[i3 + 1];
      const z = particles.positions[i3 + 2];
      
      // Calculate normalized distance from center
      const distance = Math.sqrt(x*x + y*y + z*z);
      const maxDistance = 5 * scale; // Max radius
      const normalizedDist = distance / maxDistance;
      
      // Audio reactivity
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        // Map particle index to audio data
        const audioIndex = Math.floor(i % audioData.length);
        audioIntensity = audioData[audioIndex] / 255;
      }
      
      // Wave effect
      const waveX = Math.sin(time * 0.7 + x) * 0.3;
      const waveY = Math.cos(time * 0.8 + y) * 0.3;
      const waveZ = Math.sin(time * 0.9 + z) * 0.3;
      
      // Breathing effect
      const breathe = (Math.sin(time * 0.5) * 0.5 + 0.5) * 0.3 + 0.7;
      
      // Audio-reactive displacement
      const audioDisplacement = isListening ? (audioIntensity * 2) : 0;
      
      // Apply all effects to get final position
      const finalScale = scale * breathe * (1 + audioDisplacement * 0.5);
      
      // Update position with all effects combined
      positions[i3] = x * finalScale + waveX * (1 + audioDisplacement);
      positions[i3 + 1] = y * finalScale + waveY * (1 + audioDisplacement);
      positions[i3 + 2] = z * finalScale + waveZ * (1 + audioDisplacement);
      
      // Update size based on audio
      const baseSize = particles.sizes[i];
      sizes[i] = baseSize * (1 + audioIntensity * 2);
      
      // Update color based on audio
      if (isListening && audioIntensity > 0.1) {
        // Shift color based on audio intensity
        const hue = 0.75 + audioIntensity * 0.25; // Shift from purple toward pink
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6 + audioIntensity * 0.4);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
  }, []);
  
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
