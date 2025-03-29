
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioData } from '@/hooks/useAudioData';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticleSystemProps {
  isListening: boolean;
  mousePosition: [number, number];
}

// Fragment and vertex shaders for custom particle rendering
const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    // Create a soft circular particle with smooth edges
    float r = 0.0, delta = 0.0, alpha = 1.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    
    // Make the particles glow with a soft gradient falloff
    if (r > 1.0) {
      discard;
    }
    
    // Apply a softer glow effect with increased falloff for more transparency
    alpha = 0.6 * (1.0 - smoothstep(0.5, 1.0, r));
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const ParticleSystem: React.FC<ParticleSystemProps> = ({ isListening, mousePosition }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { audioData } = useAudioData();
  const isMobile = useIsMobile();
  
  // Generate particles
  const [particles] = useState(() => {
    // Reduce particle count
    const count = isMobile ? 800 : 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Initialize particles with wider distribution and random orbital shells
    const maxRadius = isMobile ? 6 : 8; // Place particles further back
    
    for (let i = 0; i < count; i++) {
      // Create multiple orbital shells with various radiuses
      // Use pow distribution to create more interesting patterns
      const shellFactor = Math.random();
      const radius = maxRadius * Math.pow(shellFactor, 0.4); // More particles toward edges
      
      // Add slight randomness to initial positions for more organic feel
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 5; // Push particles further back
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Darker colors with more subtle tones
      const hue = 0.6 + Math.random() * 0.3; 
      const sat = 0.5 + Math.random() * 0.3; // Less saturation
      const light = 0.2 + Math.random() * 0.3; // Darker overall
      
      // Create the color object from HSL values
      const color = new THREE.Color().setHSL(hue, sat, light);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // More varied sizes with greater variance - REDUCED TO 25% OF ORIGINAL SIZE
      sizes[i] = Math.random() * (isMobile ? 0.2 : 0.25) + (isMobile ? 0.05 : 0.075);
    }
    
    return { positions, colors, sizes, count };
  });
  
  // Update particles animation with improved color transitions and movement
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    // Use a smaller scale for more contained animations
    const baseScale = isMobile ? 0.95 : 1.05;
    const scale = isListening ? baseScale * 1.1 : baseScale;
    
    // Maximum allowed distance from center to keep particles in view
    const maxAllowedDistance = isMobile ? 7 : 9;
    
    // Get average audio intensity for global effects
    let globalAudioIntensity = 0;
    if (isListening && audioData && audioData.length > 0) {
      const sum = Array.from(audioData).reduce((acc, val) => acc + val, 0);
      globalAudioIntensity = Math.min(sum / (audioData.length * 255), 1);
    }
    
    // Mouse influence factors - how strongly the mouse affects particles
    const mouseInfluence = 0.8; // Strength of mouse influence
    const mouseAttraction = 1.2; // How much particles are drawn to mouse
    const [mouseX, mouseY] = mousePosition;
    
    // Calculate 3D position from 2D mouse (project onto a sphere)
    const mouseInfluenceRadius = 4;
    const mouseZ = Math.sqrt(Math.max(0, mouseInfluenceRadius**2 - mouseX**2 - mouseY**2));
    const mouse3D = new THREE.Vector3(mouseX * mouseInfluenceRadius, mouseY * mouseInfluenceRadius, -mouseZ);
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get original position
      const x = particles.positions[i3];
      const y = particles.positions[i3 + 1];
      const z = particles.positions[i3 + 2];
      
      // Calculate normalized distance from center
      const distance = Math.sqrt(x*x + y*y + z*z);
      const normalizedDist = distance / maxAllowedDistance;
      
      // Audio reactivity per particle
      let audioIntensity = 0;
      if (isListening && audioData && i < audioData.length) {
        const audioIndex = Math.floor(i % audioData.length);
        // Cap the audio intensity to prevent extreme expansion
        audioIntensity = Math.min(audioData[audioIndex] / 255, 0.9);
      }
      
      // Smooth color transitions - even when idle
      // Each particle gets its own unique color cycle based on its index and time
      const particleColorCycle = (time * 0.05) + (i * 0.0003);
      
      // Base idle color transition - gentle shifts through spectrum
      const idleHue = (0.6 + Math.sin(particleColorCycle) * 0.2) % 1; // Slowly cycle colors
      const idleSat = 0.5 + Math.sin(time * 0.2 + i * 0.01) * 0.1; // Lower saturation
      const idleLight = 0.3 + Math.sin(time * 0.3 + i * 0.02) * 0.1; // Darker brightness
      
      // Audio reactive color - more vibrant and responsive 
      let finalHue, finalSat, finalLight;
      
      if (isListening && audioIntensity > 0.1) {
        // Enhance color vibrancy with audio, but keep it darker
        finalHue = (idleHue + audioIntensity * 0.3) % 1; // Shift hue based on audio
        finalSat = Math.min(0.7, idleSat + audioIntensity * 0.3); // Less saturated than before
        finalLight = Math.min(0.5, idleLight + audioIntensity * 0.4); // Keep darker even with audio
      } else {
        finalHue = idleHue;
        finalSat = idleSat;
        finalLight = idleLight;
      }
      
      // Update color
      const color = new THREE.Color().setHSL(finalHue, finalSat, finalLight);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // More diverse movement patterns
      // Use unique orbital paths that vary with audio
      const orbitSpeed = 0.1 + (i % 5) * 0.01 + (audioIntensity * 0.3);
      const orbitRadius = distance * (1 + (audioIntensity * 0.5));
      const orbitPhase = (time * orbitSpeed) + (i * 0.01);
      
      // Create orbital motion around the particle's basic path
      const orbitX = Math.sin(orbitPhase * 1.1) * 0.3;
      const orbitY = Math.cos(orbitPhase * 0.9) * 0.3;
      const orbitZ = Math.sin(orbitPhase * 1.3) * 0.3;
      
      // Wave effects that propagate through the entire field
      const waveX = Math.sin(time * 0.7 + y * 0.5) * 0.3;
      const waveY = Math.cos(time * 0.8 + z * 0.5) * 0.3;
      const waveZ = Math.sin(time * 0.9 + x * 0.5) * 0.3;
      
      // Breathing effect - slower and more natural
      const breathe = (Math.sin(time * 0.4) * 0.2 + 0.9);
      
      // Audio-reactive displacement - expand the particle field with sound
      const audioDisplacement = isListening ? (audioIntensity * 1.2) : 0;
      const globalDisplacement = isListening ? (globalAudioIntensity * 0.6) : 0;
      
      // Calculate expansion factor
      const expansionFactor = scale * breathe * (1 + globalDisplacement);
      
      // Create mouse attraction/repulsion effect
      // Influence decreases with distance from mouse
      const particlePosition = new THREE.Vector3(x, y, z);
      const distToMouse = particlePosition.distanceTo(mouse3D);
      
      // Mouse influence decreases with distance
      const falloff = Math.max(0, 1 - distToMouse / (isMobile ? 5 : 8));
      const mouseStrength = mouseInfluence * falloff;
      
      // Mouse direction vector (from particle to mouse)
      const mouseDirection = new THREE.Vector3();
      mouseDirection.subVectors(mouse3D, particlePosition).normalize();
      
      // Mouse attraction effect (subtle pull toward cursor)
      const mouseAttractionX = mouseDirection.x * mouseAttraction * mouseStrength;
      const mouseAttractionY = mouseDirection.y * mouseAttraction * mouseStrength;
      const mouseAttractionZ = mouseDirection.z * mouseAttraction * mouseStrength * 0.5; // Less Z influence
      
      // Calculate new position with all effects combined
      let newX = x * expansionFactor + waveX + orbitX * (1 + audioDisplacement) + mouseAttractionX;
      let newY = y * expansionFactor + waveY + orbitY * (1 + audioDisplacement) + mouseAttractionY;
      let newZ = z * expansionFactor + waveZ + orbitZ * (1 + audioDisplacement) + mouseAttractionZ;
      
      // Apply a slight repulsion force to prevent particles clumping
      const centerDist = Math.sqrt(newX*newX + newY*newY + newZ*newZ);
      if (centerDist < 1.8) { // If too close to center
        const repulsionFactor = 1.8 / Math.max(0.1, centerDist);
        newX *= repulsionFactor;
        newY *= repulsionFactor;
        newZ *= repulsionFactor;
      }
      
      // Check if the new position exceeds the maximum allowed distance
      const newDistance = Math.sqrt(newX*newX + newY*newY + newZ*newZ);
      if (newDistance > maxAllowedDistance) {
        // Scale back the position to the maximum allowed distance
        const scaleFactor = maxAllowedDistance / newDistance;
        newX *= scaleFactor;
        newY *= scaleFactor;
        newZ *= scaleFactor;
      }
      
      // Update position
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = newZ;
      
      // Update size based on audio and mouse proximity - REDUCED TO 25% OF ORIGINAL EFFECT
      const baseSize = particles.sizes[i];
      const pulseFactor = 1 + Math.sin(time * 2 + i * 0.1) * 0.1; // Gentle pulse effect
      
      // Make particles near mouse cursor slightly larger
      const mouseProximityEffect = 1 + (mouseStrength * 0.5);
      sizes[i] = baseSize * pulseFactor * mouseProximityEffect * (1 + audioIntensity * 0.45); // Reduced from 1.8 to 0.45
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  // Create custom shader material for enhanced visual effects
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        // Add any uniforms here if needed
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
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
