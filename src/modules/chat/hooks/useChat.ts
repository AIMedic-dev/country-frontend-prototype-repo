import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { Chat, Message } from '@/shared/types/common.types';

interface UseChatReturn {
  chat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para manejar un chat específico
 */
export const useChat = (chatId: string): UseChatReturn => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar chat y sus mensajes
  const fetchChat = useCallback(async () => {
    if (!chatId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getChatById(chatId);
      setChat(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching chat:', err);
      setError('Error al cargar el chat');
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return {
    chat,
    messages,
    isLoading,
    error,
    refetch: fetchChat,
  };
};