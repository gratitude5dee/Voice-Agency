
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeWaveformProps {
  isListening: boolean;
}

// Audio analyzer component that updates the visualization
const AudioAnalyzer = ({ isListening }: { isListening: boolean }) => {
  const barsRef = useRef<THREE.Group>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  
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
          setAudioData(dataArray);
          
          const updateData = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              // Convert the Uint8Array to a new Uint8Array to avoid the type error
              setAudioData(new Uint8Array(Array.from(dataArray)));
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
      setAudioData(new Uint8Array(128).fill(0));
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
  }, [isListening]);
  
  // Animate the 3D bars based on audio data
  useFrame(({ clock }) => {
    if (!barsRef.current) return;
    
    const bars = barsRef.current.children;
    const length = Math.min(bars.length, audioData.length);
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < length; i++) {
      const bar = bars[i] as THREE.Mesh;
      if (bar.scale) {
        // Calculate position in the circle to create a wave effect
        const angle = (i / 64) * Math.PI * 2;
        
        if (isListening) {
          // Enhanced audio reactivity with more dramatic scaling
          const targetHeight = Math.max(0.05, (audioData[i] || 0) / 255 * 5);
          bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.3);
          
          // Add horizontal movement based on audio intensity
          const freqIntensity = audioData[i] / 255;
          const radiusModulation = 3 + freqIntensity * 0.5;
          const x = Math.sin(angle) * radiusModulation;
          const z = Math.cos(angle) * radiusModulation;
          
          bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.1);
          bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.1);
          
          // Add vertical bounce based on audio
          const yOffset = Math.sin(time * 2 + i * 0.2) * 0.1 * freqIntensity;
          bar.position.y = yOffset;
          
          // Add color changes based on audio intensity
          if (bar.material) {
            const material = bar.material as THREE.MeshStandardMaterial;
            const hue = (i / length) * 0.2 + time * 0.1;
            const saturation = 0.5 + freqIntensity * 0.5;
            const color = new THREE.Color().setHSL(hue, saturation, 0.6);
            material.color.lerp(color, 0.1);
            material.emissive.lerp(color.multiplyScalar(0.3), 0.1);
          }
        } else {
          // Enhanced idle animation with more complex wave patterns
          const wave = Math.sin(angle * 4 + time * 2) * 0.3 + 0.7;
          const secondaryWave = Math.cos(angle * 2 + time * 1.5) * 0.2;
          const combinedWave = wave + secondaryWave;
          
          bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, combinedWave, 0.05);
          
          // Breathing effect for the circle radius
          const breathingRadius = 3 + Math.sin(time * 0.5) * 0.3;
          const x = Math.sin(angle) * breathingRadius;
          const z = Math.cos(angle) * breathingRadius;
          
          bar.position.x = THREE.MathUtils.lerp(bar.position.x, x, 0.05);
          bar.position.z = THREE.MathUtils.lerp(bar.position.z, z, 0.05);
          
          // Gently move bars up and down in a wave pattern
          const yOffset = Math.sin(angle * 3 + time) * 0.2;
          bar.position.y = yOffset;
          
          // Subtle color cycling when idle
          if (bar.material) {
            const material = bar.material as THREE.MeshStandardMaterial;
            const hue = (i / length) * 0.1 + time * 0.05;
            const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
            material.color.lerp(color, 0.01);
            material.emissive.lerp(color.multiplyScalar(0.2), 0.01);
          }
        }
      }
    }
  });
  
  return (
    <group ref={barsRef} position={[0, -1.5, 0]}>
      {[...Array(64)].map((_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const radius = 3;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.15, 0.05, 0.15]} />
            <meshStandardMaterial 
              color="#9B87F5" 
              emissive="#3F2D8C"
              emissiveIntensity={0.3}
              metalness={0.5} 
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const ThreeWaveform: React.FC<ThreeWaveformProps> = ({ isListening }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 7], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
        <pointLight position={[5, 0, 5]} intensity={0.6} color="#9B87F5" />
        <AudioAnalyzer isListening={isListening} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
        <gridHelper args={[20, 20]} position={[0, -2, 0]} rotation={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
