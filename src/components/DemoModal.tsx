
import React, { useState } from 'react';
import { X } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);

  const handleToggleMicrophone = () => {
    setIsListening(prev => !prev);
  };

  // When closing the modal, ensure mic is turned off
  const handleClose = () => {
    setIsListening(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl animate-fade-in">
        <div className="glass-card rounded-2xl overflow-hidden border border-galaxy-accent/30">
          <div className="flex justify-between items-center p-4 border-b border-galaxy-accent/20">
            <h3 className="text-xl font-semibold">Experience Voice Recognition</h3>
            <button 
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-galaxy-purple/50 hover:bg-galaxy-purple transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Awaken Ambience Voice Visualization</h4>
              <p className="text-gray-300">
                Speak into your microphone to see your voice visualized in real-time. This demonstrates how Awaken Ambience processes audio input.
              </p>
            </div>
            
            <AudioWaveform isListening={isListening} onToggle={handleToggleMicrophone} />
            
            <div className="mt-6 pt-4 border-t border-galaxy-accent/20">
              <p className="text-sm text-gray-400">
                Note: This is a demonstration of voice visualization only. In the full version, Awaken Ambience combines this audio processing with visual understanding to provide contextual assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
