
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
    
    // Initialize particles in a vertical curtain distribution
    const width = isMobile ? 6 : 10;
    const height = isMobile ? 5 : 7;
    const depth = isMobile ? 2 : 3;
    
    for (let i = 0; i < count; i++) {
      // Position particles in a vertical curtain formation
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height; 
      const z = (Math.random() - 0.5) * depth;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors (purple to blue gradient)
      const hue = 0.7 + Math.random() * 0.1; // Purple to blue range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Varied sizes - smaller on mobile
      sizes[i] = Math.random() * (isMobile ? 0.4 : 0.5) + (isMobile ? 0.3 : 0.5);
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Update particles animation with vertical wave patterns
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Boundaries for particle containment
    const maxWidth = isMobile ? 3.5 : 5.5;
    const maxHeight = isMobile ? 4 : 6;
    const maxDepth = isMobile ? 2.5 : 3.5;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get original position
      const x = particles.positions[i3];
      const y = particles.positions[i3 + 1];
      const z = particles.positions[i3 + 2];
      
      // Audio reactivity
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        const audioIndex = Math.floor(i % audioData.length);
        audioIntensity = Math.min(audioData[audioIndex] / 255, 0.8);
      }
      
      // Create vertical wave patterns
      const waveX = Math.sin(time * 0.5 + y * 0.5) * 0.3;
      const waveY = Math.cos(time * 0.3 + x * 0.5) * 0.2;
      const waveZ = Math.sin(time * 0.4 + y * 0.3) * 0.2;
      
      // Breathing effect
      const breathe = (Math.sin(time * 0.5) * 0.3 + 0.7);
      
      // Apply wave movement with audio reactivity
      let newX = x + waveX * (1 + audioIntensity * 0.5);
      let newY = y + waveY * (1 + audioIntensity * 0.8); // Increased vertical reactivity
      let newZ = z + waveZ * (1 + audioIntensity * 0.3);
      
      // Add rising effect when audio is active
      if (isListening && audioIntensity > 0.2) {
        newY += audioIntensity * 0.2;
      }
      
      // Constrain particles within boundaries with wrap-around effect
      if (Math.abs(newX) > maxWidth) {
        newX = Math.sign(newX) * maxWidth * 0.9;
      }
      
      // For Y-axis, particles that rise too high wrap around to the bottom
      if (newY > maxHeight) {
        newY = -maxHeight * 0.9;
      }
      if (newY < -maxHeight) {
        newY = -maxHeight * 0.9 + Math.random() * 0.5; // Add some variation when wrapping
      }
      
      if (Math.abs(newZ) > maxDepth) {
        newZ = Math.sign(newZ) * maxDepth * 0.9;
      }
      
      // Update position
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = newZ;
      
      // Update size based on audio
      const baseSize = particles.sizes[i];
      sizes[i] = baseSize * (1 + audioIntensity * 1.5) * breathe;
      
      // Update color based on audio and vertical position
      if (isListening && audioIntensity > 0.1) {
        // Shift color based on audio intensity and vertical position
        const hue = 0.7 + audioIntensity * 0.2 + (newY / maxHeight) * 0.1; // Gradient based on height
        const saturation = 0.8 + audioIntensity * 0.2;
        const lightness = 0.6 + audioIntensity * 0.3;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      } else {
        // Subtle color shift based on position when idle
        const hue = 0.7 + (y / maxHeight) * 0.1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = THREE.MathUtils.lerp(colors[i3], color.r, 0.03);
        colors[i3 + 1] = THREE.MathUtils.lerp(colors[i3 + 1], color.g, 0.03);
        colors[i3 + 2] = THREE.MathUtils.lerp(colors[i3 + 2], color.b, 0.03);
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
