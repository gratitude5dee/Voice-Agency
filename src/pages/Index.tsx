
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import WaitlistForm from "../components/WaitlistForm";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "Awaken Ambience | Live Voice Assistant";
    
    // Show toast message for microphone access and voice assistant
    toast.info(
      "This demo requires microphone access for voice interaction with AI assistant",
      {
        duration: 5000,
        position: "top-center",
      }
    );
    
    toast.success(
      "You're live with the Awaken Ambience Voice Assistant! Try speaking to it.",
      {
        duration: 7000,
        position: "top-center",
      }
    );
    
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
      <Toaster position="top-center" richColors />
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default Index;
