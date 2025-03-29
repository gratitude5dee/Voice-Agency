
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface AudioWaveformProps {
  isListening: boolean;
  onToggle: () => void;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isListening, onToggle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isListening]);

  const startListening = async () => {
    try {
      if (!navigator.mediaDevices) {
        throw new Error("Media devices not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Initialize audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Set up data array for visualization
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      // Start drawing
      draw();
      
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(err instanceof Error ? err.message : "Failed to access microphone");
      stopListening();
    }
  };

  const stopListening = () => {
    // Stop animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Disconnect and close audio components
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }

    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Get frequency data
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    canvasCtx.clearRect(0, 0, width, height);

    // Set styles
    canvasCtx.fillStyle = 'rgba(15, 10, 26, 0.2)';
    canvasCtx.fillRect(0, 0, width, height);

    // Calculate bar width
    const barWidth = (width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    // Draw bars for each frequency
    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * height * 0.8;
      
      // Create gradient
      const gradient = canvasCtx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, '#9B87F5');
      gradient.addColorStop(1, '#8B5CF6');
      
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }

    // Continue animation loop
    animationRef.current = requestAnimationFrame(draw);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-80 bg-galaxy-dark/30 rounded-xl backdrop-blur-sm overflow-hidden mb-4">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={300} 
          className="w-full h-full"
        />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm">
            <div className="bg-red-900/50 p-4 rounded-lg text-white max-w-md text-center">
              <p className="font-semibold mb-2">Microphone Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-galaxy-accent hover:bg-galaxy-accent/80'
        }`}
      >
        {isListening ? (
          <>
            <MicOff size={18} />
            <span>Stop Listening</span>
          </>
        ) : (
          <>
            <Mic size={18} />
            <span>Start Listening</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AudioWaveform;
