import { useState } from 'react';
import { chatService } from '../services/chat.service';
import type { Message } from '@/shared/types/common.types';
import type { SendMessageRequest } from '../types/chat.types';

interface UseSendMessageReturn {
  sendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
}

/**
 * Hook para enviar mensajes a un chat
 */
export const useSendMessage = (
  chatId: string,
  onMessageSent?: (message: Message) => void | Promise<void>
): UseSendMessageReturn => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const request: SendMessageRequest = {
        content: content.trim(),
      };

      const response = await chatService.sendMessage(chatId, request);

      // Crear objeto Message compatible
      const newMessage: Message = {
        content: response.content,
        answer: response.answer,
        timestamp: response.timestamp,
      };

      // Notificar mensaje enviado
      if (onMessageSent) {
        await onMessageSent(newMessage);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    isSending,
    error,
  };
};
