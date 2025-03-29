
import React, { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAgentProps {
  isOpen: boolean;
  onToggle: () => void;
  isListening?: boolean;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ isOpen, onToggle, isListening }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [agentId, setAgentId] = useState<string>('TJSzYuSKas1pB1x0u2AW');
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs voice agent");
      toast.success("Connected to voice assistant");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs voice agent");
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
    // Cleanup function
    return () => {
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
    <div className="flex items-center justify-center gap-2">
      <Button 
        onClick={onToggle}
        size="lg"
        className={`primary-button flex items-center space-x-2 px-8 py-6 text-base ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-galaxy-accent hover:bg-galaxy-accent/80'
        }`}
      >
        {isOpen ? (
          <>
            <MicOff size={20} />
            <span>Stop Assistant</span>
          </>
        ) : (
          <>
            <Mic size={20} />
            <span>Start Assistant</span>
          </>
        )}
      </Button>
      
      {conversation.status === 'connected' && (
        <Button onClick={toggleMute} variant="outline" className="border-galaxy-accent/20">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
      )}

      {conversation.isSpeaking && (
        <div className="text-sm text-galaxy-accent ml-2 animate-pulse">
          Speaking...
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
