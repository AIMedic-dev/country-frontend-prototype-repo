import React, { useCallback, useState } from 'react';
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
  
  // Estado temporal para mostrar el mensaje del usuario inmediatamente
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

  // Hooks existentes
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

  const { sendMessage, isSending } = useSendMessage(chatId, async () => {
    // 1. PRIMERO hacer refetch y esperar que termine
    await refetch();
    await new Promise(resolve => setTimeout(resolve, 500));
    // 2. DESPUÉS limpiar el mensaje pendiente
    setPendingUserMessage(null);
  });

  // WebSocket para streaming
  const { 
    streamingResponse, 
    isStreaming, 
    isConnected 
  } = useWebSocket(import.meta.env.VITE_WS_URL || 'http://localhost:3000');

  // Combinar mensajes reales con mensaje pendiente
  const displayMessages: Message[] = React.useMemo(() => {
    if (pendingUserMessage) {
      // Crear mensaje temporal
      const tempMessage: Message = {
        content: pendingUserMessage,
        answer: '', // Vacío porque aún no hay respuesta
        timestamp: new Date().toISOString(),
      };
      return [...messages, tempMessage];
    }
    return messages;
  }, [messages, pendingUserMessage]);

  // Handlers de navegación
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
        refetch();
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  // Handler para enviar mensajes (con mensaje inmediato)
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        // 1. Mostrar mensaje del usuario inmediatamente
        setPendingUserMessage(content);
        
        // 2. Enviar mensaje al backend
        await sendMessage(content);
        
        // El callback de useSendMessage limpiará pendingUserMessage y hará refetch
      } catch (error) {
        console.error('Error sending message:', error);
        // Limpiar mensaje pendiente si hay error
        setPendingUserMessage(null);
      }
    },
    [sendMessage]
  );

  return (
    <div className={styles.chatView}>
      {/* Indicador de conexión WebSocket */}
      {!isConnected && (
        <div className={styles.connectionStatus}>
          <span className={styles.statusDot} />
          Reconectando...
        </div>
      )}

      {/* Sidebar */}
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

      {/* Ventana de chat con streaming */}
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