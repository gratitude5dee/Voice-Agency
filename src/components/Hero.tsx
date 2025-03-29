
import { useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
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
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-galaxy-purple/30 border border-galaxy-accent/20 animate-fade-in">
              <Sparkles size={16} className="text-galaxy-accent mr-2" />
              <span className="text-sm font-medium">Voice AI</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
              <span className="text-galaxy-accent">Awaken Ambience</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in [animation-delay:400ms]">
              Talk to the future. Real-time voice AI that responds naturally.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start animate-fade-in [animation-delay:600ms] relative z-20">
              <VoiceAgent 
                isOpen={isActive} 
                onToggle={toggleAssistant}
                isListening={isActive}
              />
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
