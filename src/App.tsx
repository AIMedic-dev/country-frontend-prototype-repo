import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatContainer from './components/chat/chat-container';
import { AuthProvider, ProtectedRoute } from './components/context/auth-context';
import LoginWrapper from './components/login/LoginWrapper';
import RegisterPatient from './components/country-login/views/registerpatient';
import Analytics from './components/analitycs/analitycs';
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* login sin proteger */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* ruta para pacientes activos o corporativos */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requireVascularAccess={false}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* home corporativo, exige vascularAccess */}
        <Route
          path="/"
          element={
            <ProtectedRoute /* default = true */>
              <ChatContainer/>
            </ProtectedRoute>
          }
        />

        {/* formulario de paciente (no requiere token porque vienes desde login) */}
        <Route path="/registerPatient" element={<RegisterPatient navigate={() => {}} />} />

        {/* catch-all */}
        <Route path="*" element={<LoginWrapper />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
