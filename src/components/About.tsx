
import React from 'react';
import { Database, Mic } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Technology</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl transition-all duration-300 hover:shadow-lg">
              <div className="feature-icon-wrapper mx-auto">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Voice AI</h3>
              <p className="text-gray-300">
                Our voice assistant is powered by Eleven Labs' advanced voice AI technology,
                providing natural, responsive conversations through their cutting-edge API.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl transition-all duration-300 hover:shadow-lg">
              <div className="feature-icon-wrapper mx-auto">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Database</h3>
              <p className="text-gray-300">
                We securely store waitlist registrations and user preferences with Supabase,
                a robust and scalable database platform built on PostgreSQL.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-10">
            Awaken Ambience combines these powerful technologies to create a seamless,
            intelligent voice assistant experience that responds naturally to your needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
