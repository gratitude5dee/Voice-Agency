
import React, { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';
import { Mic, MicOff, Zap } from 'lucide-react';
import { toast } from 'sonner';

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
    <Button 
      onClick={onToggle}
      size="lg"
      className={`flex items-center space-x-2 px-8 py-6 text-base font-medium shadow-lg transition-all duration-300 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-galaxy-accent hover:bg-galaxy-accent/90'
      } rounded-full`}
    >
      {isOpen ? (
        <>
          <MicOff size={20} />
          <span>Stop Assistant</span>
        </>
      ) : (
        <>
          <Zap size={20} className="animate-pulse" />
          <span>Activate Voice AI</span>
        </>
      )}
    </Button>
  );
};

export default VoiceAgent;
