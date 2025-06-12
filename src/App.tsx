import ChatContainer from './components/chat/chat-container';
import { AuthProvider } from './components/context/auth-context';

function App() {
  return (
    <AuthProvider>
      <ChatContainer />
    </AuthProvider>
  );
}

export default App;
