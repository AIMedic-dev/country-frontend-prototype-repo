import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatContainer from './components/chat/chat-container';
import { AuthProvider } from './components/context/auth-context';
import LoginWrapper from './components/login/LoginWrapper';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="*" element={<ChatContainer />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
