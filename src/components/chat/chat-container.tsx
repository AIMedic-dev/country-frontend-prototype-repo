import ChatUI from './chat-ui';
import { useAuth } from '../context/auth-context';
import AuthLoading from '../ui/auth-loading';

const ChatContainer = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading type="login" />;
  }

  if (!isAuthenticated) {
    return <AuthLoading type="logout" />;
  }

  return <ChatUI />;
};

export default ChatContainer;
