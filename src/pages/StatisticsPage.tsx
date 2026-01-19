import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { StatisticsView } from '@/modules/statistics/views/StatisticsView';
import { useAuthContext } from '@/modules/auth/context/AuthContext';
import { ChatSidebar } from '@/modules/chat/components/ChatSidebar/ChatSidebar';
import { useChatList } from '@/modules/chat/hooks/useChatList';
import { Spinner } from '@/shared/components';
import styles from './StatisticsPage.module.css';

export const StatisticsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { chats, isLoading: chatsLoading, createNewChat, deleteChat } = useChatList(user?.id || '');

  const isLoading = authLoading || chatsLoading;

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Solo empleados o admin pueden ver analytics
  if (!user || (user.rol !== 'empleado' && user.rol !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = async () => {
    const newChat = await createNewChat(user.id);
    if (newChat) {
      navigate(`/chat/${newChat.id}`);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
  };

  return (
    <div className={styles.analyticsPage}>
      <ChatSidebar
        chats={chats}
        activeChat={null}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isLoading={chatsLoading}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={styles.content}>
        <button
          className={styles.menuButton}
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <StatisticsView />
      </div>
    </div>
  );
};