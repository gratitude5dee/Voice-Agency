
import { Mic, Power, Cloud, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });
    
    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      featureElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="features" className="py-24 relative overflow-hidden" ref={featuresRef}>
      {/* Background Elements */}
      <div className="absolute top-1/3 -right-64 w-96 h-96 bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 -left-32 w-64 h-64 bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cosmic Intelligence at Your Command
          </h2>
          <p className="text-gray-300">
            Awaken Ambience combines cutting-edge voice recognition with personalized memory and live data access for an unmatched assistant experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[0ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Awaken on Command</h3>
              <p className="text-gray-300">
                Simply speak the wake word to activate Awaken Ambience instantly, with customizable phrases that fit naturally into your vocabulary.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[200ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Power className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Stop Listening</h3>
              <p className="text-gray-300">
                Advanced privacy controls let you instantly pause voice monitoring with simple commands for complete control over your experience.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[400ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Store Memories</h3>
              <p className="text-gray-300">
                Intelligent context retention remembers your preferences, past interactions, and important information for truly personalized assistance.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[600ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Internet Search</h3>
              <p className="text-gray-300">
                Seamlessly connects to the web for real-time data, weather, news, and information without breaking your conversational flow.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Demo Section */}
        <div className="mt-24 glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Experience Natural Interaction</h3>
              <p className="text-gray-300 mb-8">
                Awaken Ambience understands natural language and context, creating a seamless conversation experience that feels intuitive and responsive.
              </p>
              
              {/* Example interactions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center flex-shrink-0 mt-1">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-gray-300">
                    "Awaken, what's the weather in Tokyo today and remind me about my meeting at 3pm."
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-white">
                    "In Tokyo, it's currently 72°F with clear skies. I've set a reminder for your meeting at 3:00 PM today."
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center flex-shrink-0 mt-1">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-gray-300">
                    "Stop listening until tomorrow morning."
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-white">
                    "I'll pause active listening until 8:00 AM tomorrow. You can still activate me with your wake word if needed."
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-feature-gradient relative overflow-hidden min-h-[400px]">
              {/* Audio waveform visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-end justify-center space-x-1 h-32 w-full max-w-md px-8">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 bg-white/70 rounded-full animate-pulse-slow" 
                      style={{
                        height: `${Math.sin(i * 0.4) * 50 + 20}%`,
                        animationDelay: `${i * 0.07}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-white/20 animate-pulse-slow"></div>
                <div className="absolute w-48 h-48 rounded-full border border-white/10 animate-pulse-slow [animation-delay:1s]"></div>
                <div className="absolute w-64 h-64 rounded-full border border-white/5 animate-pulse-slow [animation-delay:2s]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Sparkles = (props: any) => (
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export default Features;
