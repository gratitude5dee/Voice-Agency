import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const { camera } = useThree();
  
  // Track particle density in the central area
  const [centralParticleCount, setCentralParticleCount] = useState(0);
  const centralAreaRef = useRef({
    left: -0.3,
    right: 0.3,
    top: 0.1,
    bottom: -0.25
  });
  
  // Generate particles
  const [particles] = useState(() => {
    // Reduce particle count
    const count = isMobile ? 800 : 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Define a single cluster radius
    const clusterRadius = isMobile ? 6 : 8;
    // Center position for the cluster
    const centerZ = -20; // Keep the cluster far from camera
    
    for (let i = 0; i < count; i++) {
      // Create a single concentrated cluster of particles
      // Gaussian-like distribution around center
      const radius = clusterRadius * Math.pow(Math.random(), 0.5);
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) + centerZ; // Center the cluster at centerZ
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Consistent color palette for the cluster
      const hue = 0.6 + Math.random() * 0.2; 
      const sat = 0.5 + Math.random() * 0.3;
      const light = 0.2 + Math.random() * 0.3;
      
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
  
  // Emit custom event when particle density changes
  useEffect(() => {
    // Define threshold for when to invert text colors
    const densityThreshold = isMobile ? 8 : 15; 
    
    // Create and dispatch the custom event
    const event = new CustomEvent('particleDensityChanged', {
      detail: { 
        shouldInvert: centralParticleCount > densityThreshold,
        count: centralParticleCount
      }
    });
    window.dispatchEvent(event);
  }, [centralParticleCount, isMobile]);
  
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
    
    // Maximum allowed distance from cluster center
    const maxAllowedDistance = isMobile ? 12 : 16; 
    const clusterCenterZ = -20; // Match the center Z from initialization
    const clusterCenter = new THREE.Vector3(0, 0, clusterCenterZ);
    
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
    const mouseInfluenceRadius = 12;
    const mouseZ = Math.sqrt(Math.max(0, mouseInfluenceRadius**2 - mouseX**2 - mouseY**2));
    const mouse3D = new THREE.Vector3(mouseX * mouseInfluenceRadius, mouseY * mouseInfluenceRadius, -mouseZ);
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // Get current position
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      const particlePosition = new THREE.Vector3(x, y, z);
      
      // Calculate distance from cluster center instead of origin
      const distanceFromCenter = particlePosition.distanceTo(clusterCenter);
      const normalizedDist = distanceFromCenter / maxAllowedDistance;
      
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
      
      // More cohesive movement patterns for a single cluster
      // Use more contained orbital paths that keep the cluster together
      const orbitSpeed = 0.1 + (i % 5) * 0.01 + (audioIntensity * 0.3);
      const orbitPhase = (time * orbitSpeed) + (i * 0.01);
      
      // Create smaller orbital motion around the particle's basic path
      const orbitX = Math.sin(orbitPhase * 1.1) * 0.2;
      const orbitY = Math.cos(orbitPhase * 0.9) * 0.2;
      const orbitZ = Math.sin(orbitPhase * 1.3) * 0.2;
      
      // Wave effects that propagate through the entire field
      const waveX = Math.sin(time * 0.7 + y * 0.5) * 0.2;
      const waveY = Math.cos(time * 0.8 + z * 0.5) * 0.2;
      const waveZ = Math.sin(time * 0.9 + x * 0.5) * 0.2;
      
      // Breathing effect - slower and more natural
      const breathe = (Math.sin(time * 0.4) * 0.2 + 0.9);
      
      // Audio-reactive displacement - expand the particle field with sound
      const audioDisplacement = isListening ? (audioIntensity * 1.2) : 0;
      const globalDisplacement = isListening ? (globalAudioIntensity * 0.6) : 0;
      
      // Calculate expansion factor
      const expansionFactor = scale * breathe * (1 + globalDisplacement);
      
      // Create mouse attraction/repulsion effect
      // Influence decreases with distance from mouse
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
      
      // Direction vector from particle to cluster center
      const toCenterDirection = new THREE.Vector3();
      toCenterDirection.subVectors(clusterCenter, particlePosition).normalize();
      
      // Gravitational pull to cluster center - stronger as particles get further away
      const gravitationalPull = Math.pow(normalizedDist, 2) * 0.05;
      const gravitationalX = toCenterDirection.x * gravitationalPull;
      const gravitationalY = toCenterDirection.y * gravitationalPull;
      const gravitationalZ = toCenterDirection.z * gravitationalPull;
      
      // Calculate new position with all effects combined
      // Apply effects relative to the cluster center
      const offsetX = particlePosition.x - clusterCenter.x;
      const offsetY = particlePosition.y - clusterCenter.y;
      const offsetZ = particlePosition.z - clusterCenter.z;
      
      let newX = clusterCenter.x + offsetX * expansionFactor + waveX + orbitX * (1 + audioDisplacement) + mouseAttractionX + gravitationalX;
      let newY = clusterCenter.y + offsetY * expansionFactor + waveY + orbitY * (1 + audioDisplacement) + mouseAttractionY + gravitationalY;
      let newZ = clusterCenter.z + offsetZ * expansionFactor + waveZ + orbitZ * (1 + audioDisplacement) + mouseAttractionZ + gravitationalZ;
      
      // Create new position vector to check distance from cluster center
      const newPosition = new THREE.Vector3(newX, newY, newZ);
      const newDistanceFromCenter = newPosition.distanceTo(clusterCenter);
      
      // Check if the new position exceeds the maximum allowed distance from cluster center
      if (newDistanceFromCenter > maxAllowedDistance) {
        // Scale back the position to the maximum allowed distance from cluster center
        const scaleFactor = maxAllowedDistance / newDistanceFromCenter;
        newX = clusterCenter.x + (newX - clusterCenter.x) * scaleFactor;
        newY = clusterCenter.y + (newY - clusterCenter.y) * scaleFactor;
        newZ = clusterCenter.z + (newZ - clusterCenter.z) * scaleFactor;
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
    
    // Count particles in the central area (where the title text is)
    let particlesInCentralArea = 0;
    const centralArea = centralAreaRef.current;
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      
      // After updating positions, check if this particle is in the central area
      // Project 3D position to screen space
      const particle = new THREE.Vector3(
        positions[i3], 
        positions[i3 + 1], 
        positions[i3 + 2]
      );
      particle.project(camera);
      
      // Check if particle is in the central area (where the title text is)
      if (particle.x > centralArea.left && 
          particle.x < centralArea.right && 
          particle.y > centralArea.bottom && 
          particle.y < centralArea.top &&
          particle.z < 1) { // Only count particles in front of camera
        particlesInCentralArea++;
      }
    }
    
    // Update central particle count state if it changed significantly
    if (Math.abs(particlesInCentralArea - centralParticleCount) > 3) {
      setCentralParticleCount(particlesInCentralArea);
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
