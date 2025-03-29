import * as THREE from 'three';

// Animation utilities for idle state - more contained
export const animateIdleBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  angle: number
) => {
  // More constrained idle animation with predominantly vertical movement
  const wave = Math.sin(angle * 8 + time * 3) * 0.4 + 0.7;
  const secondaryWave = Math.cos(angle * 4 + time * 2) * 0.3;
  const combinedWave = wave + secondaryWave;
  
  // Scale the bar vertically based on the wave pattern
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, combinedWave, 0.1);
  
  // Less dramatic breathing effect for the circle radius
  const breathingRadius = 2 + Math.sin(time * 0.8) * 0.4;
  const x = Math.sin(angle) * breathingRadius;
  const z = Math.cos(angle) * breathingRadius;
  
  // Update bar position with gentler lateral movement
  bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.1);
  bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.1);
  
  // More vertical movement in idle state
  const yOffset = Math.sin(angle * 5 + time * 1.5) * 0.3;
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

// Animation utilities for audio-reactive state - more vertical, less lateral
export const animateAudioReactiveBar = (
  bar: THREE.Mesh,
  i: number, 
  length: number, 
  time: number, 
  angle: number,
  audioIntensity: number
) => {
  // Enhanced vertical reactivity with limited horizontal movement
  const targetHeight = Math.max(0.1, audioIntensity * 10); // More vertical scaling
  bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.5);
  
  // Much more contained horizontal movement - keep a tighter circle
  const radiusModulation = 2 + audioIntensity * 0.5; // Reduced lateral expansion
  const x = Math.sin(angle) * radiusModulation;
  const z = Math.cos(angle) * radiusModulation;
  
  // Slower position updates to reduce jerky movements
  bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.15);
  bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.15);
  
  // Enhanced vertical bounce based on audio
  const yOffset = Math.sin(time * 3 + i * 0.3) * 0.5 * audioIntensity;
  bar.position.y = yOffset;
  
  // Update bar material with dramatic color changes based on audio intensity
  if (bar.material) {
    const material = bar.material as THREE.MeshStandardMaterial;
    const hue = (i / length) * 0.5 + time * 0.2;
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
