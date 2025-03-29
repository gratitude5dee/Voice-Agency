
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioData } from '@/hooks/useAudioData';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioAnalyzerProps {
  isListening: boolean;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ isListening }) => {
  const barsRef = useRef<THREE.Group>(null);
  const [localAudioData, setLocalAudioData] = useState<Uint8Array>(new Uint8Array(128).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  const { setAudioData } = useAudioData();
  const isMobile = useIsMobile();
  
  // Set up audio analyzer
  useEffect(() => {
    if (isListening) {
      const setupAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          sourceRef.current = source;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          setLocalAudioData(dataArray);
          
          const updateData = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              // Convert the Uint8Array to a new Uint8Array to avoid the type error
              const newDataArray = new Uint8Array(Array.from(dataArray));
              setLocalAudioData(newDataArray);
              setAudioData(newDataArray); // Share with particle system
              requestRef.current = requestAnimationFrame(updateData);
            }
          };
          
          updateData();
        } catch (err) {
          console.error("Error accessing microphone:", err);
        }
      };
      
      setupAudio();
    } else {
      // Clean up resources
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Reset audio data to zeros when not listening
      const emptyData = new Uint8Array(128).fill(0);
      setLocalAudioData(emptyData);
      setAudioData(emptyData);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, setAudioData]);
  
  // Animate the 3D bars based on audio data with vertical motion
  useFrame(({ clock }) => {
    if (!barsRef.current) return;
    
    const bars = barsRef.current.children;
    const length = Math.min(bars.length, localAudioData.length);
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < length; i++) {
      const bar = bars[i] as THREE.Mesh;
      if (bar.scale) {
        // Calculate position along the horizontal line for even spacing
        const step = (i / (length - 1)) * 2 - 1; // Range from -1 to 1
        
        if (isListening) {
          // Calculate audio intensity (normalized to 0-1 range)
          const audioIntensity = (localAudioData[i] || 0) / 255;
          
          // Vertical scaling based on audio intensity
          const targetHeight = 0.1 + audioIntensity * 5;
          bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.3);
          
          // Position along a horizontal line with slight curve
          const xPos = step * (isMobile ? 3 : 5);
          // Add a wave effect horizontally
          const waveX = Math.sin(time * 0.5 + i * 0.1) * 0.1;
          // Set position with slight horizontal wave
          bar.position.x = xPos + waveX;
          
          // Slight variance in z-position for depth
          const zPos = Math.sin(i * 0.3) * 0.5;
          bar.position.z = zPos;
          
          // Vertical position starts at base point and rises with audio
          const yOffset = -1 + audioIntensity * 0.5;
          const waveY = Math.sin(time * 2 + i * 0.2) * 0.1 * audioIntensity;
          bar.position.y = yOffset + waveY;
          
          // Update bar material with color changes based on audio intensity and height
          if (bar.material) {
            const material = bar.material as THREE.MeshStandardMaterial;
            const hue = 0.7 + audioIntensity * 0.3; // Shift from purple toward blue/pink
            const saturation = 0.5 + audioIntensity * 0.5;
            const brightness = 0.5 + audioIntensity * 0.5;
            const color = new THREE.Color().setHSL(hue, saturation, brightness);
            material.color.lerp(color, 0.3);
            material.emissive.lerp(color.multiplyScalar(0.5), 0.3);
            
            // Make bars more shiny based on audio intensity
            material.metalness = 0.5 + audioIntensity * 0.5;
            material.roughness = Math.max(0.1, 0.5 - audioIntensity * 0.4);
          }
        } else {
          // Idle animation - gentle waves along the base
          const waveHeight = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
          bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, waveHeight, 0.1);
          
          // Position along a horizontal line
          const xPos = step * (isMobile ? 3 : 5);
          bar.position.x = xPos;
          
          // Slight variance in z-position for depth
          const zPos = Math.sin(i * 0.3) * 0.5;
          bar.position.z = zPos;
          
          // Vertical position with gentle wave motion
          const yOffset = -1;
          const waveY = Math.sin(time * 1.5 + i * 0.1) * 0.15;
          bar.position.y = yOffset + waveY;
          
          // Update bar material with subtle color changes
          if (bar.material) {
            const material = bar.material as THREE.MeshStandardMaterial;
            const hue = 0.7 + Math.sin(time * 0.2 + i * 0.05) * 0.05;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
            material.color.lerp(color, 0.05);
            material.emissive.lerp(color.multiplyScalar(0.3), 0.05);
          }
        }
      }
    }
  });
  
  // Increased bar count for more detailed visualization
  const barCount = isMobile ? 40 : 64;
  
  return (
    <group ref={barsRef} position={[0, 0, 0]}>
      {[...Array(barCount)].map((_, i) => {
        // Calculate position along a horizontal line
        const step = (i / (barCount - 1)) * 2 - 1; // Range from -1 to 1
        const xPos = step * (isMobile ? 3 : 5);
        
        return (
          <mesh key={i} position={[xPos, -1, 0]}>
            <boxGeometry args={[isMobile ? 0.06 : 0.08, 0.05, isMobile ? 0.06 : 0.08]} />
            <meshStandardMaterial 
              color="#9B87F5" 
              emissive="#3F2D8C"
              emissiveIntensity={0.5}
              metalness={0.6} 
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default AudioAnalyzer;
