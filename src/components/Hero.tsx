
import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const Hero = () => {
  const starsContainerRef = useRef<HTMLDivElement>(null);
  
  // Create random stars background effect
  useEffect(() => {
    if (!starsContainerRef.current) return;
    
    const container = starsContainerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3;
      
      star.classList.add('star');
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * containerWidth}px`;
      star.style.top = `${Math.random() * containerHeight}px`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      // Vary the star brightness
      const opacity = Math.random() * 0.8 + 0.2;
      star.style.opacity = opacity.toString();
      
      container.appendChild(star);
    }
    
    // Create constellations (connecting lines between stars)
    for (let i = 0; i < 6; i++) {
      const constellation = document.createElement('div');
      constellation.classList.add('constellation');
      
      // Random position and size
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
  
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.classList.add('ripple-effect');
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
    ripple.style.left = `${e.clientX - rect.left - ripple.offsetWidth / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - ripple.offsetHeight / 2}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div ref={starsContainerRef} className="stars-container"></div>
      
      {/* Gradient Orb Background Effects */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-galaxy-accent/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 -right-96 w-[40rem] h-[40rem] bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-galaxy-purple/30 border border-galaxy-accent/20 animate-fade-in">
              <Sparkles size={16} className="text-galaxy-accent mr-2" />
              <span className="text-sm font-medium">Reimagining voice assistance</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
              Your Personal <span className="text-galaxy-accent">Voice Assistant</span> with Cosmic Intelligence
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in [animation-delay:400ms]">
              Awaken Ambience brings a seamless voice experience with advanced memory capabilities, real-time data, and intuitive commands for a naturally intelligent assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in [animation-delay:600ms]">
              <a 
                href="#waitlist" 
                className="primary-button w-full sm:w-auto text-center"
                onMouseEnter={handleButtonHover}
              >
                Join the Waitlist
              </a>
              <a 
                href="#features" 
                className="secondary-button w-full sm:w-auto text-center"
              >
                Explore Features
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center animate-fade-in [animation-delay:800ms]">
            <div className="relative w-full max-w-md">
              {/* Main circular interface */}
              <div className="relative w-64 h-64 mx-auto rounded-full glass-card border border-galaxy-accent/30 p-2 shadow-[0_0_50px_rgba(155,135,245,0.3)] animate-float">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-galaxy-purple to-galaxy-dark flex items-center justify-center overflow-hidden">
                  {/* Central pulsing circle */}
                  <div className="relative w-24 h-24 rounded-full bg-galaxy-accent/20 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full bg-galaxy-accent/20 animate-pulse-slow"></div>
                    <div className="absolute w-full h-full rounded-full bg-galaxy-accent/10 animate-pulse-slow [animation-delay:1s]"></div>
                    <div className="z-10 w-14 h-14 rounded-full bg-galaxy-accent flex items-center justify-center shadow-lg">
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Sound wave circles */}
                  <div className="absolute w-full h-full rounded-full border border-galaxy-accent/20 opacity-0 animate-ping [animation-duration:3s]"></div>
                  <div className="absolute w-full h-full rounded-full border border-galaxy-accent/20 opacity-0 animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 right-16 w-20 h-20 rounded-xl glass-card p-4 flex items-center justify-center animate-float [animation-delay:1s]">
                <Cloud className="w-10 h-10 text-galaxy-accent" />
              </div>
              
              <div className="absolute top-1/2 -left-6 w-20 h-20 rounded-xl glass-card p-4 flex items-center justify-center animate-float [animation-delay:2s]">
                <Search className="w-10 h-10 text-galaxy-accent" />
              </div>
              
              <div className="absolute -bottom-4 right-20 w-20 h-20 rounded-xl glass-card p-4 flex items-center justify-center animate-float [animation-delay:1.5s]">
                <Power className="w-10 h-10 text-galaxy-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Adding these components inline since they're only used here
const Mic = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const Cloud = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const Search = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

const Power = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
    <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
    <path d="M12 2v4" />
    <path d="m2 2 20 20" />
  </svg>
);

export default Hero;
