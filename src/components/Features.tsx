import { Mic, Eye, Brain, Cloud, Search, Shield } from 'lucide-react';
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
            The First Assistant That Truly Sees Your World
          </h2>
          <p className="text-gray-300">
            Unlike traditional voice assistants that operate blindly, Awaken Ambience combines powerful voice capabilities with visual understanding. Share your screen or camera view to get assistance with what you're actually seeing in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Feature 1 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[0ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sees What You See</h3>
              <p className="text-gray-300">
                Stream your camera or share your screen to get contextual help with what you're looking at—from identifying objects to troubleshooting technical issues.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[200ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Remembers Everything</h3>
              <p className="text-gray-300">
                No more repeating yourself. Awaken Ambience maintains context throughout your interactions and remembers your preferences over time.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[400ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Speech</h3>
              <p className="text-gray-300">
                Speak normally without awkward trigger phrases. Ask follow-up questions naturally, just like talking to a person.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[600ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Information</h3>
              <p className="text-gray-300">
                From weather forecasts to breaking news, Awaken Ambience pulls live data from across the internet for accurate information.
              </p>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="feature-card opacity-0 translate-y-10 transition-all duration-700 delay-[800ms]">
            <div className="h-full glass-card rounded-2xl p-6 hover:shadow-[0_10px_40px_-15px_rgba(155,135,245,0.3)] transition-all duration-500">
              <div className="feature-icon-wrapper">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy Controls</h3>
              <p className="text-gray-300">
                Simply say "stop listening" or "stop watching" to instantly pause voice and visual monitoring. You control when it's active.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Demo Section */}
        <div className="mt-24 glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Experience The Difference</h3>
              <p className="text-gray-300 mb-8">
                Awaken Ambience combines voice intelligence with visual understanding for a truly helpful assistant experience.
              </p>
              
              {/* Example interactions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center flex-shrink-0 mt-1">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-gray-300">
                    "Awaken, I'm sharing my screen. Can you help me figure out why this spreadsheet formula isn't working?"
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-white">
                    "I can see you're trying to use a VLOOKUP function. The issue is in your table array parameter—you've selected columns B:D, but your lookup value is in column E. Try adjusting the formula to include column E in your range."
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center flex-shrink-0 mt-1">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-gray-300">
                    "Awaken, I'm at the grocery store. Which of these cereal options has the least sugar?"
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-galaxy-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card rounded-lg p-3 text-sm text-white">
                    "I can see three cereals in view. Based on the nutrition labels visible, the Multi-Grain Cheerios has the lowest sugar content at 6g per serving, compared to 12g in the Honey Nut Cheerios and 9g in the granola option."
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
                  <Eye className="w-7 h-7 text-white" />
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
        
        {/* Use Cases Section */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">
              How People Are Using Awaken Ambience
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Use Case 1 */}
            <div className="feature-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="h-full glass-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-galaxy-accent">For Visual Assistance</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Share your screen to get help troubleshooting technical issues</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Scan product labels while shopping for instant nutrition comparisons</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Show a confusing set of instructions to get step-by-step guidance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Get real-time translations of text you're looking at</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Use Case 2 */}
            <div className="feature-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="h-full glass-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-galaxy-accent">For Productivity</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Schedule meetings while showing your calendar screen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Add items to your shopping list while looking through your pantry</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Review documents together for instant feedback</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Use Case 3 */}
            <div className="feature-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="h-full glass-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-galaxy-accent">For Information</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Ask complex questions about what you're seeing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Get visual confirmation that Awaken understands your environment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Research topics through natural conversation with visual references</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Use Case 4 */}
            <div className="feature-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="h-full glass-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-galaxy-accent">For Home</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Show Awaken your smart home dashboard for intuitive control</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Get cooking assistance while showing your ingredients</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-galaxy-accent">•</span>
                    <span>Identify plants, objects, or issues around your home visually</span>
                  </li>
                </ul>
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

const Brain = (props: any) => (
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
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const Eye = (props: any) => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Shield = (props: any) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default Features;
