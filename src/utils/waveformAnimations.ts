
import * as THREE from 'three';

// Animation utilities for idle state
export const animateIdleBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  angle: number
) => {
  // Enhanced idle animation with more extreme wave patterns
  const wave = Math.sin(angle * 8 + time * 3) * 0.6 + 0.7;
  const secondaryWave = Math.cos(angle * 4 + time * 2) * 0.4;
  const combinedWave = wave + secondaryWave;
  
  // Scale the bar based on the wave pattern
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, combinedWave, 0.1);
  
  // More dramatic breathing effect for the circle radius
  const breathingRadius = 2 + Math.sin(time * 0.8) * 0.8;
  const x = Math.sin(angle) * breathingRadius;
  const z = Math.cos(angle) * breathingRadius;
  
  // Update bar position
  bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.1);
  bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.1);
  
  // More extreme movement in idle state
  const yOffset = Math.sin(angle * 5 + time * 1.5) * 0.4;
  bar.position.y = yOffset;
  
  // Update bar material
  if (bar.material) {
    const material = bar.material as THREE.MeshStandardMaterial;
    const hue = (i / length) * 0.3 + time * 0.1;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
    material.color.lerp(color, 0.05);
    material.emissive.lerp(color.multiplyScalar(0.3), 0.05);
  }
};

// Animation utilities for audio-reactive state
export const animateAudioReactiveBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  angle: number,
  audioIntensity: number
) => {
  // Super enhanced audio reactivity with more dramatic scaling (10x more drastic)
  const targetHeight = Math.max(0.1, audioIntensity * 15);
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.5);
  
  // Greatly enhanced horizontal movement based on audio intensity
  const freqIntensity = audioIntensity;
  const radiusModulation = 2 + freqIntensity * 2.5;
  const x = Math.sin(angle) * radiusModulation;
  const z = Math.cos(angle) * radiusModulation;
  
  bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.25);
  bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.25);
  
  // Enhanced vertical bounce based on audio
  const yOffset = Math.sin(time * 3 + i * 0.3) * 0.5 * freqIntensity;
  bar.position.y = yOffset;
  
  // Update bar material with dramatic color changes based on audio intensity
  if (bar.material) {
    const material = bar.material as THREE.MeshStandardMaterial;
    const hue = (i / length) * 0.5 + time * 0.2;
    const saturation = 0.5 + freqIntensity * 0.5;
    const brightness = 0.5 + freqIntensity * 0.5;
    const color = new THREE.Color().setHSL(hue, saturation, brightness);
    material.color.lerp(color, 0.3);
    material.emissive.lerp(color.multiplyScalar(0.5), 0.3);
    
    // Make bars more shiny based on audio intensity
    material.metalness = 0.5 + freqIntensity * 0.5;
    material.roughness = Math.max(0.1, 0.5 - freqIntensity * 0.4);
  }
};
