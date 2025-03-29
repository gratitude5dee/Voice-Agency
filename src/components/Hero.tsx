
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import AudioWaveform from './AudioWaveform';
import VoiceAgent from './VoiceAgent';

const Hero = () => {
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (!starsContainerRef.current) return;
    
    const container = starsContainerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3;
      
      star.classList.add('star');
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * containerWidth}px`;
      star.style.top = `${Math.random() * containerHeight}px`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      const opacity = Math.random() * 0.8 + 0.2;
      star.style.opacity = opacity.toString();
      
      container.appendChild(star);
    }
    
    for (let i = 0; i < 6; i++) {
      const constellation = document.createElement('div');
      constellation.classList.add('constellation');
      
      const width = Math.random() * 150 + 50;
      const height = Math.random() * 1 + 0.5;
      const top = Math.random() * containerHeight;
      const left = Math.random() * containerWidth;
      const rotation = Math.random() * 180;
      
      constellation.style.width = `${width}px`;
      constellation.style.height = `${height}px`;
      constellation.style.top = `${top}px`;
      constellation.style.left = `${left}px`;
      constellation.style.setProperty('--rotation', `${rotation}deg`);
      
      container.appendChild(constellation);
    }
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  const toggleAssistant = () => {
    setIsActive(prev => !prev);
  };
  
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div ref={starsContainerRef} className="stars-container"></div>
      
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-galaxy-accent/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 -right-96 w-[40rem] h-[40rem] bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-galaxy-purple/30 border border-galaxy-accent/20 animate-fade-in">
              <Sparkles size={16} className="text-galaxy-accent mr-2" />
              <span className="text-sm font-medium">Live voice assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
              You're Live Now With <span className="text-galaxy-accent">Awaken Ambience</span> Voice Assistant
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in [animation-delay:400ms]">
              Experience real-time voice interaction with ElevenLabs AI. This demo shows how our assistant processes audio input and responds naturally to your voice.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 animate-fade-in [animation-delay:600ms] relative z-20">
              <VoiceAgent 
                isOpen={isActive} 
                onToggle={toggleAssistant}
                isListening={isActive}
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex flex-col justify-center items-center animate-fade-in [animation-delay:800ms]">
            {isActive && (
              <div className="w-full max-w-md mb-8 glass-card rounded-2xl p-4 border border-galaxy-accent/30 shadow-[0_0_30px_rgba(155,135,245,0.2)]">
                <h3 className="text-lg font-medium mb-2 text-center">Awaken Ambience Voice Interaction</h3>
                <div className="space-y-6">
                  <AudioWaveform isListening={isActive} onToggle={toggleAssistant} />
                </div>
              </div>
            )}
            
            <div className="relative w-64 h-64 mx-auto rounded-full glass-card border border-galaxy-accent/30 p-2 shadow-[0_0_50px_rgba(155,135,245,0.3)] animate-float">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-galaxy-purple to-galaxy-dark flex items-center justify-center overflow-hidden">
                <div className="relative w-24 h-24 rounded-full bg-galaxy-accent/20 flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full bg-galaxy-accent/20 animate-pulse-slow"></div>
                  <div className="absolute w-full h-full rounded-full bg-galaxy-accent/10 animate-pulse-slow [animation-delay:1s]"></div>
                  <div className="z-10 w-14 h-14 rounded-full bg-galaxy-accent flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="absolute w-full h-full rounded-full border border-galaxy-accent/20 opacity-0 animate-ping [animation-duration:3s]"></div>
                <div className="absolute w-full h-full rounded-full border border-galaxy-accent/20 opacity-0 animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
