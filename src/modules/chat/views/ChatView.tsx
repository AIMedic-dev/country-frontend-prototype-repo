import React, { useCallback, useState, useEffect } from 'react';
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

  // ✅ 1. PRIMERO: Declarar todos los hooks
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
    await refetch();
  });

  // WebSocket para streaming
  const {
    streamingResponse,
    isStreaming,
    isConnected
  } = useWebSocket();

  // ✅ 2. DESPUÉS: useEffect (UN SOLO useEffect, no duplicado)
  useEffect(() => {
    // Cuando el streaming termina y hay un mensaje pendiente
    if (!isStreaming && pendingUserMessage && messages.length > 0) {
      // Verificar si el último mensaje ya tiene la pregunta
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.content === pendingUserMessage) {
        // Limpiar después de un pequeño delay para transición suave
        const timer = setTimeout(() => {
          setPendingUserMessage(null);
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [isStreaming, pendingUserMessage, messages]);

  // ✅ 3. DESPUÉS: useMemo para displayMessages
  const displayMessages: Message[] = React.useMemo(() => {
    if (pendingUserMessage) {
      // Verificar si el último mensaje ya es este
      const lastMessage = messages[messages.length - 1];
      const isDuplicate =
        lastMessage &&
        lastMessage.content.trim() === pendingUserMessage.trim();

      // Si ya existe en la DB, no mostrar el temporal
      if (isDuplicate) {
        return messages;
      }

      // Crear mensaje temporal solo si no está duplicado
      const tempMessage: Message = {
        content: pendingUserMessage,
        answer: '',
        timestamp: new Date().toISOString(),
      };
      return [...messages, tempMessage];
    }
    return messages;
  }, [messages, pendingUserMessage]);

  // ✅ 4. Handlers
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

  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        // 1. Mostrar mensaje del usuario inmediatamente
        setPendingUserMessage(content);

        // 2. Enviar mensaje al backend
        await sendMessage(content);

        // El useEffect limpiará pendingUserMessage cuando termine el streaming
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