
import React, { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, MicOff, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { RainbowButton } from './ui/rainbow-button';

interface VoiceAgentProps {
  isOpen: boolean;
  onToggle: () => void;
  isListening?: boolean;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ isOpen, onToggle, isListening }) => {
  const [agentId] = useState<string>('TJSzYuSKas1pB1x0u2AW');
  
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

  return (
    isOpen ? (
      <RainbowButton 
        onClick={onToggle}
        className="flex items-center space-x-2 px-8 py-6 text-white"
      >
        <MicOff size={20} className="mr-2" />
        <span>Stop Assistant</span>
      </RainbowButton>
    ) : (
      <RainbowButton 
        onClick={onToggle}
        className="flex items-center space-x-2 px-8 py-6 text-white"
      >
        <Zap size={20} className="mr-2 animate-pulse" />
        <span>Activate Voice AI</span>
      </RainbowButton>
    )
  );
};

export default VoiceAgent;
