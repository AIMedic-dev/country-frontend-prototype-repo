import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSidebar } from '../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow/ChatWindow';
import { useChatList } from '../hooks/useChatList';
import { useChat } from '../hooks/useChat';
import { useSendMessage } from '../hooks/useSendMessage';
import { useWebSocket } from '../hooks/useWebSocket';
import { chatService } from '../services/chat.service';
import type { Message } from '../types/chat.types';
import styles from './ChatView.module.css';

interface ChatViewProps {
  userId: string;
  chatId: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ userId, chatId }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  
  // Cache local de mensajes
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const prevChatIdRef = useRef(chatId);

  const {
    chats,
    isLoading: isLoadingList,
    createNewChat,
    deleteChat
  } = useChatList(userId);

  const {
    messages,
    isLoading: isLoadingChat,
    refetch
  } = useChat(chatId);

  const { sendMessage, isSending } = useSendMessage(chatId);

  const {
    streamingResponse,
    isStreaming,
    isConnected
  } = useWebSocket();

  // Sincronizar cache local con mensajes de DB al cargar o cambiar chat
  useEffect(() => {
    if (chatId !== prevChatIdRef.current) {
      // Cambió de chat -> hacer refetch
      prevChatIdRef.current = chatId;
      refetch();
    }
    
    // Actualizar cache local con mensajes de la DB
    setLocalMessages(messages);
  }, [messages, chatId]);

  // Cuando termina el streaming, agregar mensaje al cache local
  useEffect(() => {
    if (!isStreaming && pendingUserMessage && streamingResponse) {
      // Crear mensaje completo con la respuesta del streaming
      const newMessage: Message = {
        content: pendingUserMessage,
        answer: streamingResponse,
        timestamp: new Date().toISOString(),
      };

      // Agregar al cache local inmediatamente
      setLocalMessages(prev => [...prev, newMessage]);
      
      // Limpiar estados
      setPendingUserMessage(null);
      
    }
  }, [isStreaming, pendingUserMessage, streamingResponse]);

  // Mensajes a mostrar: cache local + mensaje pendiente si existe
  const displayMessages: Message[] = React.useMemo(() => {
    if (pendingUserMessage) {
      // Verificar si ya existe en el cache
      const lastMessage = localMessages[localMessages.length - 1];
      const isDuplicate =
        lastMessage &&
        lastMessage.content.trim() === pendingUserMessage.trim();

      if (isDuplicate) {
        return localMessages;
      }

      // Crear mensaje temporal
      const tempMessage: Message = {
        content: pendingUserMessage,
        answer: '',
        timestamp: new Date().toISOString(),
      };
      return [...localMessages, tempMessage];
    }
    return localMessages;
  }, [localMessages, pendingUserMessage]);

  // Refetch cuando el usuario navega o vuelve a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch]);

  const handleChatSelect = (selectedChatId: string) => {
    navigate(`/chat/${selectedChatId}`);
  };

  const handleNewChat = async () => {
    const newChat = await createNewChat(userId);
    if (newChat) {
      navigate(`/chat/${newChat.id}`);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    await deleteChat(chatIdToDelete);

    if (chatIdToDelete === chatId && chats.length > 1) {
      const nextChat = chats.find((c) => c.id !== chatIdToDelete);
      if (nextChat) {
        navigate(`/chat/${nextChat.id}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('¿Estás seguro de limpiar todos los mensajes?')) {
      try {
        await chatService.clearMessages(chatId);
        setLocalMessages([]); // Limpiar cache local también
        refetch();
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        setPendingUserMessage(content);
        await sendMessage(content);
      } catch (error) {
        console.error('Error sending message:', error);
        setPendingUserMessage(null);
      }
    },
    [sendMessage]
  );

  return (
    <div className={styles.chatView}>
      {!isConnected && (
        <div className={styles.connectionStatus}>
          <span className={styles.statusDot} />
          Reconectando...
        </div>
      )}

      <ChatSidebar
        chats={chats}
        activeChat={chatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isLoading={isLoadingList}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ChatWindow
        messages={displayMessages}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isLoading={isLoadingChat}
        isSending={isSending}
        streamingResponse={streamingResponse}
        isStreaming={isStreaming}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};