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
    
    // Initialize particles in a better distributed sphere
    const maxRadius = isMobile ? 3.5 : 4.5; // Slightly larger radius for better spread
    
    for (let i = 0; i < count; i++) {
      // Distributed along spherical shells for better circle-like patterns
      const shellIndex = Math.floor(Math.random() * 3); // Create 3 shells
      const radius = (maxRadius * 0.7) + (shellIndex * 0.8); // Multiple shells with different radii
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
      
      // Varied sizes - smaller on mobile
      sizes[i] = Math.random() * (isMobile ? 0.4 : 0.5) + (isMobile ? 0.3 : 0.5);
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Store original positions for circular path calculation
  const originalPositions = useMemo(() => {
    return new Float32Array(particles.positions);
  }, [particles.positions]);
  
  // Update particles animation with circular path movement
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Maximum allowed distance from center to keep particles in view
    const maxAllowedDistance = isMobile ? 4 : 5;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get original position as the base for the circular path
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];
      
      // Calculate original distance from center for normalization
      const origDistance = Math.sqrt(origX*origX + origY*origY + origZ*origZ);
      
      // Audio reactivity - more controlled
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        const audioIndex = Math.floor(i % audioData.length);
        audioIntensity = Math.min(audioData[audioIndex] / 255, 0.7); // Cap intensity
      }
      
      // Create circular path motion
      // Use original position to create a rotation around its circular path
      const rotationSpeed = 0.3 + (i % 5) * 0.02; // Varied speeds for different particles
      const rotationAmount = time * rotationSpeed;
      
      // Apply rotation to maintain circular path
      const cosR = Math.cos(rotationAmount);
      const sinR = Math.sin(rotationAmount);
      
      // Rotate around Y axis to maintain circular path in XZ plane
      let newX = origX * cosR + origZ * sinR;
      let newZ = -origX * sinR + origZ * cosR;
      let newY = origY;
      
      // Add gentle wave effect for Y dimension
      const waveFrequency = 1.5 + (i % 7) * 0.1;
      const waveY = Math.sin(time * waveFrequency + i * 0.05) * (0.2 + audioIntensity * 0.3);
      newY += waveY;
      
      // If listening, add a small audio-reactive pulse that follows the circular path
      if (isListening) {
        const pulseAmount = 0.3 * audioIntensity;
        // Scale outward but keep the circular path
        const normalizedX = newX / origDistance;
        const normalizedY = newY / origDistance;
        const normalizedZ = newZ / origDistance;
        
        // Apply the pulse along the circular path
        newX += normalizedX * pulseAmount;
        newY += normalizedY * pulseAmount;
        newZ += normalizedZ * pulseAmount;
      }
      
      // Ensure the particles don't exceed the maximum allowed distance
      const newDistance = Math.sqrt(newX*newX + newY*newY + newZ*newZ);
      if (newDistance > maxAllowedDistance) {
        const scaleFactor = maxAllowedDistance / newDistance;
        newX *= scaleFactor;
        newY *= scaleFactor;
        newZ *= scaleFactor;
      }
      
      // Update position
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = newZ;
      
      // Update size based on audio intensity
      const baseSize = particles.sizes[i];
      sizes[i] = baseSize * (1 + audioIntensity * 1.2);
      
      // Update color based on audio and position in the circular path
      if (isListening && audioIntensity > 0.1) {
        // Shift color based on audio intensity and position
        const angle = Math.atan2(newZ, newX); // Get angle in the circular path
        const normalizedAngle = (angle + Math.PI) / (2 * Math.PI); // Normalize to 0-1
        
        // Create color variation based on position in the circle and audio
        const hue = 0.75 + normalizedAngle * 0.1 + audioIntensity * 0.15;
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
