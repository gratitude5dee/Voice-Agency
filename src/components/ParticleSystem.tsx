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
  
  // Generate particles with orbital paths
  const [particles] = useState(() => {
    // Reduce particle count on mobile devices
    const count = isMobile ? 1000 : 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Store original orbit parameters
    const orbits = new Float32Array(count * 4); // radius, speed, phase, height
    
    // Initialize particles in orbital shells
    const maxRadius = isMobile ? 3.5 : 4.5;
    const minRadius = maxRadius * 0.3; // Minimum radius to avoid center clumping
    
    for (let i = 0; i < count; i++) {
      // Create layered orbital shells
      const shellIndex = Math.floor(Math.random() * 5); // 5 different orbital shells
      const radius = minRadius + (maxRadius - minRadius) * (shellIndex / 4 + Math.random() * 0.2);
      const orbitSpeed = 0.1 + Math.random() * 0.2; // Varied speeds
      const phase = Math.random() * Math.PI * 2; // Random starting position
      const heightVariation = Math.random() * 2 - 1; // Vertical distribution
      
      // Store orbit parameters for use in animation
      orbits[i * 4] = radius;
      orbits[i * 4 + 1] = orbitSpeed;
      orbits[i * 4 + 2] = phase;
      orbits[i * 4 + 3] = heightVariation;
      
      // Initial positions based on orbital parameters
      const theta = phase;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = heightVariation * (radius * 0.2);
      
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
    
    return { positions, colors, sizes, orbits, count };
  });
  
  // Update particles animation to maintain orbital paths
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Maximum allowed distance from center to keep particles in view
    const maxAllowedDistance = isMobile ? 4.5 : 5.5;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      
      // Get original orbit parameters
      const radius = particles.orbits[i4];
      const orbitSpeed = particles.orbits[i4 + 1];
      const phase = particles.orbits[i4 + 2];
      const heightVariation = particles.orbits[i4 + 3];
      
      // Calculate audio reactivity
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        const audioIndex = Math.floor(i % audioData.length);
        audioIntensity = Math.min(audioData[audioIndex] / 255, 0.8);
      }
      
      // Orbital rotation with time
      const theta = phase + time * orbitSpeed;
      
      // Wave effect that modifies the orbital path but maintains the general shape
      const waveAmplitude = 0.15 * (1 + audioIntensity * 0.8);
      const waveFrequency = 3 + audioIntensity * 2;
      const radiusModulation = 1 + Math.sin(time * 0.5 + phase * 3) * 0.08;
      
      // Apply waves while maintaining orbital structure
      const modifiedRadius = radius * radiusModulation;
      const waveX = Math.sin(theta * waveFrequency) * waveAmplitude;
      const waveZ = Math.cos(theta * waveFrequency) * waveAmplitude;
      
      // Calculate orbital position with wave effects
      const x = modifiedRadius * Math.cos(theta) + waveX;
      const z = modifiedRadius * Math.sin(theta) + waveZ;
      
      // Vertical position with gentle wave and audio reactivity
      const heightWave = Math.sin(time * 0.7 + phase * 5) * 0.3;
      const audioVerticalEffect = isListening ? audioIntensity * 0.6 : 0;
      const y = heightVariation * (radius * 0.2) + heightWave + audioVerticalEffect;
      
      // Ensure the particle stays within boundaries
      const distanceFromCenter = Math.sqrt(x*x + z*z);
      if (distanceFromCenter > maxAllowedDistance) {
        const scaleFactor = maxAllowedDistance / distanceFromCenter;
        positions[i3] = x * scaleFactor;
        positions[i3 + 2] = z * scaleFactor;
      } else {
        positions[i3] = x;
        positions[i3 + 2] = z;
      }
      
      // Update Y position directly (vertical movement has more freedom)
      positions[i3 + 1] = Math.max(-maxAllowedDistance, Math.min(maxAllowedDistance, y));
      
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
