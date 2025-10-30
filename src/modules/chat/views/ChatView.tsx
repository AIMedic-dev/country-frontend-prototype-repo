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
  // Índice del mensaje temporal que está recibiendo streaming
  const pendingIndexRef = useRef<number | null>(null);
  
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

  // Actualizar mensaje temporal con los chunks de streaming para que se vea en vivo
  useEffect(() => {
    if (pendingIndexRef.current !== null && typeof streamingResponse === 'string') {
      setLocalMessages(prev => {
        const next = [...prev];
        const idx = pendingIndexRef.current as number;
        if (next[idx]) {
          next[idx] = { ...next[idx], answer: streamingResponse };
        }
        return next;
      });
    }
  }, [streamingResponse]);

  // Al finalizar el streaming, limpiar estado pendiente
  useEffect(() => {
    if (!isStreaming && pendingIndexRef.current !== null) {
      pendingIndexRef.current = null;
    }
  }, [isStreaming]);

  // Mensajes a mostrar: cache local + mensaje pendiente si existe
  const displayMessages: Message[] = React.useMemo(() => {
    return localMessages;
  }, [localMessages]);

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
        // Agregar mensaje temporal al cache local y guardar su índice
        setLocalMessages(prev => {
          const temp: Message = {
            content,
            answer: '',
            timestamp: new Date().toISOString(),
          };
          const next = [...prev, temp];
          pendingIndexRef.current = next.length - 1;
          return next;
        });
        await sendMessage(content);
      } catch (error) {
        console.error('Error sending message:', error);
        pendingIndexRef.current = null;
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