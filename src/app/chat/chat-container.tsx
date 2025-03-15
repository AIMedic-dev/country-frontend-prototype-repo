'use client';
import ChatPresentation from './chat-presentation';
import { useState } from 'react';
import { Message } from '@/resources/types/types';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '@/services/graphql-request';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      message: 'Hola, soy Hope, tu asistente virtual. ¿En qué puedo ayudarte?',
      isBot: true,
    },
  ]);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [waitingResponseBot, setWaitingResponseBot] = useState(false);

  const send = async (message: string) => {
    setMessages((prev: Message[]) => [...prev, { message, isBot: false }]);

    setWaitingResponseBot(true);

    try {
      const response = await sendMessage({
        variables: {
          content: message,
        },
      });

      if (response) {
        console.log('Response:', response);
        const botMessage = response.data['Chat'].answer;
        setMessages(prev => [...prev, { message: botMessage, isBot: true }]);
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
