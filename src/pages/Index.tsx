
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import WaitlistForm from "../components/WaitlistForm";
import About from "../components/About";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Toaster } from "sonner";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "Awaken Ambience | Live Voice Assistant";
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        const targetElement = document.querySelector(href);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth'
        });
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors closeButton />
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <WaitlistForm />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
