
import { Check, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Pricing = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });
    
    const pricingElements = pricingRef.current?.querySelectorAll('.pricing-card') || [];
    pricingElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      pricingElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="pricing" className="py-24 relative" ref={pricingRef}>
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Early Access Options
          </h2>
          <p className="text-gray-300">
            Be among the first to experience the future of voice assistance with our exclusive early access options.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Waitlist Option */}
          <div className="pricing-card opacity-0 transition-all duration-500">
            <div className="h-full glass-card rounded-2xl p-8 border border-gray-700/50 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Join Waitlist</h3>
                <p className="text-gray-400">Get notified when we launch</p>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold mb-2">Free</div>
                <p className="text-gray-400">Join thousands on our waitlist</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Email notifications about launch</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Early access to product videos</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Standard position in waitlist queue</span>
                </li>
              </ul>
              
              <a 
                href="#waitlist" 
                className="secondary-button text-center mt-auto"
              >
                Join Waitlist
              </a>
            </div>
          </div>
          
          {/* Skip the Line Option */}
          <div className="pricing-card opacity-0 transition-all duration-500 delay-200">
            <div className="h-full glass-card rounded-2xl p-8 border border-galaxy-accent/30 bg-gradient-to-b from-galaxy-purple/20 to-transparent flex flex-col relative overflow-hidden">
              {/* Premium badge */}
              <div className="absolute -right-10 top-7 bg-galaxy-accent text-white text-xs font-semibold px-10 py-1 transform rotate-45">
                Premium
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Skip the Waitlist</h3>
                <p className="text-gray-400">Immediate access when we launch</p>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold mb-2">$500</div>
                <p className="text-gray-400">One-time payment</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Guaranteed first access at launch</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Exclusive founders group membership</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Early beta testing opportunity</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Premium support and onboarding</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-galaxy-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>Lifetime 25% discount on upgrades</span>
                </li>
              </ul>
              
              <a 
                href="#waitlist" 
                className="primary-button text-center mt-auto group"
              >
                Skip the Waitlist
                <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
