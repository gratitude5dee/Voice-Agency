
import { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import ThreeWaveform from './ThreeWaveform';
import VoiceAgent from './VoiceAgent';

const Hero = () => {
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  const toggleAssistant = () => {
    setIsActive(prev => !prev);
  };
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      <div ref={starsContainerRef} className="stars-container"></div>
      
      {/* Gradient background effects */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-galaxy-accent/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 -right-96 w-[40rem] h-[40rem] bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      {/* Background 3D scene covering the entire hero section */}
      <div className="absolute inset-0 z-0">
        <ThreeWaveform isListening={isActive} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 flex-1 flex items-center">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Text container with backdrop for better readability */}
            <div className="backdrop-blur-sm bg-galaxy-dark/40 p-6 rounded-2xl shadow-lg">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-galaxy-purple/50 border border-galaxy-accent/30 animate-fade-in">
                <Sparkles size={16} className="text-galaxy-accent mr-2" />
                <span className="text-sm font-medium">Live voice assistant</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms] text-white drop-shadow-md">
                You're Live Now With <span className="text-galaxy-accent">Awaken Ambience</span> Voice Assistant
              </h1>
              
              <p className="text-lg text-gray-100 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in [animation-delay:400ms] drop-shadow-sm">
                Experience real-time voice interaction with ElevenLabs AI. This demo shows how our assistant processes audio input and responds naturally to your voice.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start animate-fade-in [animation-delay:600ms] relative z-20">
                <VoiceAgent 
                  isOpen={isActive} 
                  onToggle={toggleAssistant}
                  isListening={isActive}
                />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center animate-fade-in [animation-delay:800ms]">
            {/* Purposely left empty - content now displayed in the background */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
