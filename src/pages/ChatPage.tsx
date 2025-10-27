import { useParams, Navigate } from 'react-router-dom';
import { ChatView } from '@/modules/chat/views/ChatView';
import { useAuthContext } from '@/modules/auth/context/AuthContext'; // ✨ AGREGAR
import { Spinner } from '@/shared/components'; // ✨ AGREGAR

export const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user, isLoading } = useAuthContext(); // ✨ USAR AUTH

  // Mostrar loader mientras carga auth
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

  // Redirigir si no hay usuario (no debería pasar por ProtectedRoute)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Validar que existe chatId
  if (!chatId) {
    return <Navigate to="/" replace />;
  }

  return <ChatView userId={user.id} chatId={chatId} />;
};