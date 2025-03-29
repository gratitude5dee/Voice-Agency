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
    // Reduce particle count on mobile devices
    const count = isMobile ? 1000 : 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Initialize particles in a smaller sphere
    const maxRadius = isMobile ? 3 : 4; // Smaller radius to keep particles in view
    
    for (let i = 0; i < count; i++) {
      // Random position in a sphere with controlled radius
      const radius = maxRadius * Math.pow(Math.random(), 1/3);
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
      
      // Random sizes - smaller on mobile
      sizes[i] = Math.random() * (isMobile ? 0.4 : 0.5) + (isMobile ? 0.3 : 0.5);
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Update particles animation with contained boundaries
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Use a smaller scale for more contained animations
    const baseScale = isMobile ? 0.9 : 1.0;
    const scale = isListening ? baseScale * 1.1 : baseScale;
    
    // Maximum allowed distance from center to keep particles in view
    const maxAllowedDistance = isMobile ? 4 : 5;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get original position
      const x = particles.positions[i3];
      const y = particles.positions[i3 + 1];
      const z = particles.positions[i3 + 2];
      
      // Calculate normalized distance from center
      const distance = Math.sqrt(x*x + y*y + z*z);
      const normalizedDist = distance / maxAllowedDistance;
      
      // Audio reactivity - more controlled
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        const audioIndex = Math.floor(i % audioData.length);
        // Cap the audio intensity to prevent extreme expansion
        audioIntensity = Math.min(audioData[audioIndex] / 255, 0.8);
      }
      
      // Reduced wave effect amplitude
      const waveX = Math.sin(time * 0.7 + x) * 0.2;
      const waveY = Math.cos(time * 0.8 + y) * 0.2;
      const waveZ = Math.sin(time * 0.9 + z) * 0.2;
      
      // Gentler breathing effect
      const breathe = (Math.sin(time * 0.5) * 0.3 + 0.5) * 0.3 + 0.7;
      
      // More contained audio-reactive displacement
      const audioDisplacement = isListening ? (audioIntensity * 1.2) : 0;
      
      // Apply all effects with constraints
      const finalScale = scale * breathe * (1 + audioDisplacement * 0.3);
      
      // Calculate new position
      let newX = x * finalScale + waveX * (1 + audioDisplacement * 0.5);
      let newY = y * finalScale + waveY * (1 + audioDisplacement * 0.5);
      let newZ = z * finalScale + waveZ * (1 + audioDisplacement * 0.5);
      
      // Check if the new position exceeds the maximum allowed distance
      const newDistance = Math.sqrt(newX*newX + newY*newY + newZ*newZ);
      if (newDistance > maxAllowedDistance) {
        // Scale back the position to the maximum allowed distance
        const scaleFactor = maxAllowedDistance / newDistance;
        newX *= scaleFactor;
        newY *= scaleFactor;
        newZ *= scaleFactor;
      }
      
      // Update position with contained boundaries
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = newZ;
      
      // Update size based on audio - more constrained
      const baseSize = particles.sizes[i];
      sizes[i] = baseSize * (1 + audioIntensity * 1.5);
      
      // Update color based on audio
      if (isListening && audioIntensity > 0.1) {
        // Shift color based on audio intensity
        const hue = 0.75 + audioIntensity * 0.2; // Shift from purple toward pink
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6 + audioIntensity * 0.3);
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
