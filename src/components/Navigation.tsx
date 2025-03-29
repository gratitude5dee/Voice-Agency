
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { RainbowButton } from './ui/rainbow-button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-galaxy-dark/80 backdrop-blur-lg shadow-md' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center space-x-2 group">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-galaxy-purple transition-all duration-300 group-hover:bg-galaxy-accent">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-full bg-galaxy-accent/30 transform scale-0 group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
          </div>
          <span className="text-xl font-semibold text-white">Awaken Ambience</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          <a href="#waitlist">
            <RainbowButton>Join Waitlist</RainbowButton>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? 
            <X className="w-6 h-6 text-white" /> : 
            <Menu className="w-6 h-6 text-white" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-galaxy-purple/90 backdrop-blur-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-60 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 flex flex-col space-y-4">
          <a 
            href="#features" 
            className="py-2 text-white hover:text-galaxy-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="py-2 text-white hover:text-galaxy-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </a>
          <a 
            href="#waitlist" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <RainbowButton className="w-full">Join Waitlist</RainbowButton>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
