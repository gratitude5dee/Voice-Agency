
import * as THREE from 'three';

// Animation utilities for idle state - vertical wave patterns
export const animateIdleBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  position: number
) => {
  // Gentle vertical wave pattern
  const wave = Math.sin(position * 4 + time * 1.5) * 0.3 + 0.7;
  const secondaryWave = Math.cos(position * 8 + time * 0.8) * 0.15;
  const combinedWave = wave + secondaryWave;
  
  // Scale the bar vertically based on the wave pattern
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, combinedWave, 0.1);
  
  // Add some gentle horizontal movement
  const xOffset = Math.sin(time * 0.5 + i * 0.1) * 0.05;
  bar.position.x = position + xOffset;
  
  // Gentle vertical motion
  const yOffset = Math.sin(time * 0.8 + i * 0.2) * 0.1;
  bar.position.y = -1 + yOffset;
  
  // Subtle depth variation
  const zOffset = Math.sin(i * 0.3) * 0.2;
  bar.position.z = zOffset;
  
  // Update bar material
  if (bar.material) {
    const material = bar.material as THREE.MeshStandardMaterial;
    const hue = 0.7 + (i / length) * 0.1 + Math.sin(time * 0.1) * 0.05;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
    material.color.lerp(color, 0.05);
    material.emissive.lerp(color.multiplyScalar(0.3), 0.05);
  }
};

// Animation utilities for audio-reactive state - vertical movements
export const animateAudioReactiveBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  position: number,
  audioIntensity: number
) => {
  // Enhanced vertical reactivity
  const targetHeight = Math.max(0.1, audioIntensity * 5); // More vertical scaling
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.3);
  
  // Horizontal position with subtle wave
  const xOffset = Math.sin(time * 0.5 + i * 0.1) * 0.1 * audioIntensity;
  bar.position.x = position + xOffset;
  
  // Vertical position reacts to audio
  const yBase = -1 + audioIntensity * 0.5;
  const yOffset = Math.sin(time * 2 + i * 0.2) * 0.1 * audioIntensity;
  bar.position.y = yBase + yOffset;
  
  // Depth variation
  const zOffset = Math.sin(i * 0.3) * (0.2 + audioIntensity * 0.3);
  bar.position.z = zOffset;
  
  // Update bar material with dramatic color changes based on audio intensity and height
  if (bar.material) {
    const material = bar.material as THREE.MeshStandardMaterial;
    // Color changes from purple to blue/pink based on height
    const hue = 0.7 + audioIntensity * 0.3;
    const saturation = 0.5 + audioIntensity * 0.5;
    const brightness = 0.5 + audioIntensity * 0.5;
    const color = new THREE.Color().setHSL(hue, saturation, brightness);
    material.color.lerp(color, 0.3);
    material.emissive.lerp(color.multiplyScalar(0.5), 0.3);
    
    // Make bars more shiny based on audio intensity
    material.metalness = 0.5 + audioIntensity * 0.5;
    material.roughness = Math.max(0.1, 0.5 - audioIntensity * 0.4);
  }
};
