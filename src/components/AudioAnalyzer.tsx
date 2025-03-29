
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animateIdleBar, animateAudioReactiveBar } from '@/utils/waveformAnimations';

interface AudioAnalyzerProps {
  isListening: boolean;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ isListening }) => {
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
          // Calculate audio intensity (normalized to 0-1 range)
          const audioIntensity = (audioData[i] || 0) / 255;
          animateAudioReactiveBar(bar, i, length, time, angle, audioIntensity);
        } else {
          animateIdleBar(bar, i, length, time, angle);
        }
      }
    }
  });
  
  // Circle diameter (reduced from 3 to 2)
  const circleRadius = 2;
  
  return (
    <group ref={barsRef} position={[0, -1.5, 0]}>
      {[...Array(64)].map((_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const radius = circleRadius;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.15, 0.05, 0.15]} />
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
