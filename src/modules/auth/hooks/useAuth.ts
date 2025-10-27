import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { AuthState, AuthContextState } from '../types/hooks-type';
import type { AuthResponse } from '../types/types'; 

interface UseAuthReturn extends AuthState {
  user: AuthContextState['user'];
  isAuthenticated: boolean;
  login: (codigo: string) => Promise<AuthResponse | null>;
  logout: () => void;
  clearMessages: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    error: null,
    success: null,
  });

  const [user, setUser] = useState<AuthContextState['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (storedUser && token) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    };

    checkAuth();
  }, []);

  /**
   * Login con código
   */
  const login = useCallback(async (codigo: string): Promise<AuthResponse | null> => {
    try {
      setAuthState({ isLoading: true, error: null, success: null });

      const response = await authService.login(codigo);

      setUser(response.user);
      setIsAuthenticated(true);
      setAuthState({
        isLoading: false,
        error: null,
        success: 'Inicio de sesión exitoso',
      });

      return response;
    } catch (error: any) {
      setAuthState({
        isLoading: false,
        error: error.message || 'Error al iniciar sesión',
        success: null,
      });
      return null;
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthState({
      isLoading: false,
      error: null,
      success: null,
    });
  }, []);

  /**
   * Limpiar mensajes de error/success
   */
  const clearMessages = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    success: authState.success,
    login,
    logout,
    clearMessages,
  };
};