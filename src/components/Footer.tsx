
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-galaxy-accent/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-galaxy-blue/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-galaxy-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Awaken Ambience</span>
            </a>
            <p className="text-gray-400 mb-6">
              The next generation voice assistant with cosmic intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-galaxy-purple/30 flex items-center justify-center transition-colors hover:bg-galaxy-accent/20">
                <Twitter className="w-5 h-5 text-gray-300" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-galaxy-purple/30 flex items-center justify-center transition-colors hover:bg-galaxy-accent/20">
                <Github className="w-5 h-5 text-gray-300" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-galaxy-purple/30 flex items-center justify-center transition-colors hover:bg-galaxy-accent/20">
                <Linkedin className="w-5 h-5 text-gray-300" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-galaxy-accent transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-galaxy-accent transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Beta Program</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors">Press</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-galaxy-accent/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; {year} Awaken Ambience. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-galaxy-accent transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
