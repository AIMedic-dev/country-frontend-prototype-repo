'use client';
import {
  Message,
  ChatContext as ChatContextType,
} from '@/resources/types/types';
import { useContext, createContext } from 'react';
import { ReactNode, useState } from 'react';

const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {},
  waitingResponseBot: false,
  setWaitingResponseBot: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      message: 'Hola, soy Hope, tu asistente virtual. ¿En qué puedo ayudarte?',
      isBot: true,
    },
  ]);
  const [waitingResponseBot, setWaitingResponseBot] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        waitingResponseBot,
        setWaitingResponseBot,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
