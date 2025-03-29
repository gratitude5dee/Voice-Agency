
import React, { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAgentProps {
  isOpen: boolean;
  onToggle: () => void;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ isOpen, onToggle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [agentId, setAgentId] = useState<string>('');
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs voice agent");
      toast.success("Connected to voice assistant");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs voice agent");
      toast.info("Disconnected from voice assistant");
    },
    onMessage: (message) => {
      console.log("Message received:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast.error("Error with voice connection");
    }
  });

  useEffect(() => {
    // This would normally come from env variables in a production app
    // For demo purposes, we're hardcoding a value
    setAgentId('demo-agent-id');
    
    return () => {
      // Cleanup
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, []);

  useEffect(() => {
    const startConversationHandler = async () => {
      if (isOpen && agentId) {
        try {
          const conversationId = await conversation.startSession({
            agentId: agentId,
          });
          console.log("Conversation started:", conversationId);
        } catch (error) {
          console.error("Error starting conversation:", error);
          toast.error("Failed to start conversation");
          onToggle(); // Turn off if failed
        }
      } else if (!isOpen && conversation.status === 'connected') {
        await conversation.endSession();
      }
    };

    startConversationHandler();
  }, [isOpen, agentId, conversation, onToggle]);

  const toggleMute = async () => {
    try {
      if (isMuted) {
        await conversation.setVolume({ volume: 1.0 });
      } else {
        await conversation.setVolume({ volume: 0.0 });
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-full max-w-md text-center text-sm font-medium">
          {conversation.status === 'connected' ? (
            <span className="text-green-500 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Voice Assistant Active
            </span>
          ) : (
            <span className="text-gray-400">Voice Assistant Inactive</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onToggle}
          className={`flex items-center space-x-2 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-galaxy-accent hover:bg-galaxy-accent/80'
          }`}
        >
          {isOpen ? (
            <>
              <MicOff size={18} />
              <span>Stop Assistant</span>
            </>
          ) : (
            <>
              <Mic size={18} />
              <span>Start Assistant</span>
            </>
          )}
        </Button>
        
        {conversation.status === 'connected' && (
          <Button onClick={toggleMute} variant="outline" className="border-galaxy-accent/20">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        )}
      </div>

      {conversation.isSpeaking && (
        <div className="text-sm text-galaxy-accent animate-pulse">
          Assistant is speaking...
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
