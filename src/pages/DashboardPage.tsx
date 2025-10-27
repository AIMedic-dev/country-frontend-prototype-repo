import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useChatList } from '@/modules/chat/hooks/useChatList';
import { useAuthContext } from '@/modules/auth/context/AuthContext'; // ✨ AGREGAR
import { Spinner } from '@/shared/components';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthContext(); // ✨ USAR AUTH
  const { chats, isLoading: chatsLoading, createNewChat } = useChatList(user?.id || '');

  const isLoading = authLoading || chatsLoading;

  // Redirigir si no hay usuario (no debería pasar por ProtectedRoute)
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay chats, navegar al primero
  useEffect(() => {
    if (!isLoading && chats.length > 0) {
      navigate(`/chat/${chats[0].id}`, { replace: true });
    }
  }, [chats, isLoading, navigate]);

  // Si no hay chats, crear uno nuevo
  useEffect(() => {
    if (!isLoading && chats.length === 0 && user) {
      createNewChat(user.id).then((newChat) => {
        if (newChat) {
          navigate(`/chat/${newChat.id}`, { replace: true });
        }
      });
    }
  }, [chats.length, isLoading, createNewChat, user, navigate]);

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

  return null;
};