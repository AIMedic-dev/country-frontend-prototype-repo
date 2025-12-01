import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth/context/AuthContext';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { ChatPage } from '@/pages/ChatPage';
import Login from '@/modules/auth/views/login-page';
import { StatisticsPage } from '@/pages/StatisticsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>

      <AuthProvider>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta de analytics (solo empleados) */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRole="empleado">
                <StatisticsPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto - redirigir a dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};