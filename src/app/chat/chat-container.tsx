'use client';
import ChatPresentation from './chat-presentation';
import { sendMessage } from '@/resources/functions';
import { useState } from 'react';
import { Message } from '@/resources/types/types';
const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      message:
        'Hola, soy Aimedic, tu asistente virtual. ¿En qué puedo ayudarte?',
      isBot: true,
    },
  ]);
  const [waitingResponseBot, setWaitingResponseBot] = useState(false);

  const send = async (message: string) => {
    setMessages(prev => [...prev, { message, isBot: false }]);

    setWaitingResponseBot(true);

    try {
      const response = await sendMessage(message);

      if (response) {
        setMessages(prev => [
          ...prev,
          { message: response.result, isBot: true },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            message: 'Error al enviar el mensaje, por favor intenta de nuevo',
            isBot: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setMessages(prev => [
        ...prev,
        { message: 'Error de conexión, intenta de nuevo.', isBot: true },
      ]);
    } finally {
      setWaitingResponseBot(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        message:
          'Hola, soy Aimedic, tu asistente virtual. ¿En qué puedo ayudarte?',
        isBot: true,
      },
    ]);
  };

  return (
    <ChatPresentation
      messages={messages}
      send={send}
      waitingResponseBot={waitingResponseBot}
      clearMessages={clearMessages}
    />
  );
};

export default ChatContainer;
