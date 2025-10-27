import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { Chat } from '@/shared/types/common.types';

interface UseChatListReturn {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createNewChat: (userId: string) => Promise<Chat | null>;
  deleteChat: (chatId: string) => Promise<void>;
}

/**
 * Hook para manejar la lista de chats de un usuario
 */
export const useChatList = (userId: string): UseChatListReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar chats del usuario
  const fetchChats = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getChatsByUser(userId);
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Error al cargar los chats');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Crear nuevo chat
  const createNewChat = async (userId: string): Promise<Chat | null> => {
    try {
      const newChat = await chatService.createChat({ userId });
      setChats((prev) => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Error al crear el chat');
      return null;
    }
  };

  // Eliminar chat
  const deleteChat = async (chatId: string): Promise<void> => {
    try {
      await chatService.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (err) {
      console.error('Error deleting chat:', err);
      setError('Error al eliminar el chat');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    isLoading,
    error,
    refetch: fetchChats,
    createNewChat,
    deleteChat,
  };
};