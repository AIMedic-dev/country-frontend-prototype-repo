import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { Chat, Message } from '@/shared/types/common.types';

interface UseChatReturn {
  chat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isRefetching: boolean; // ✨ AGREGAR
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
  const [isRefetching, setIsRefetching] = useState(false); // ✨ AGREGAR
  const [error, setError] = useState<string | null>(null);

  // ✨ CAMBIAR: Agregar parámetro para diferenciar
  const fetchChat = useCallback(async (isInitialLoad = true) => {
    if (!chatId) return;

    try {
      // ✨ CAMBIAR: Solo mostrar spinner completo en carga inicial
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      
      setError(null);
      const data = await chatService.getChatById(chatId);
      setChat(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching chat:', err);
      setError('Error al cargar el chat');
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [chatId]);

  // ✨ Carga inicial
  useEffect(() => {
    fetchChat(true); // Carga inicial = spinner completo
  }, [fetchChat]);

  return {
    chat,
    messages,
    isLoading,
    isRefetching, // ✨ EXPORTAR
    error,
    refetch: () => fetchChat(false), // ✨ Refetch = sin spinner completo
  };
};