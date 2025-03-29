
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
  useFrame(() => {
    if (!barsRef.current) return;
    
    const bars = barsRef.current.children;
    const length = Math.min(bars.length, audioData.length);
    
    for (let i = 0; i < length; i++) {
      const bar = bars[i] as THREE.Mesh;
      if (bar.scale) {
        const targetHeight = isListening 
          ? Math.max(0.05, (audioData[i] || 0) / 255 * 3)
          : Math.max(0.05, Math.sin((Date.now() / 1000 + i * 0.1) % Math.PI) * 0.5 + 0.5);
        
        bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight, 0.2);
      }
    }
  });
  
  return (
    <group ref={barsRef}>
      {[...Array(64)].map((_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const radius = 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.1, 0.05, 0.1]} />
            <meshStandardMaterial color="#9B87F5" />
          </mesh>
        );
      })}
    </group>
  );
};

const ThreeWaveform: React.FC<ThreeWaveformProps> = ({ isListening }) => {
  return (
    <div className="w-full h-60 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 3, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AudioAnalyzer isListening={isListening} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        <gridHelper args={[10, 10]} position={[0, -0.5, 0]} rotation={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default ThreeWaveform;
