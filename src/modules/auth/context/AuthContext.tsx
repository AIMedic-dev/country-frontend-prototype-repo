import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthResponse } from '../types/types';     

interface AuthContextValue {
  user: {
    id: string;
    nombre: string;
    rol: string;
    codigo: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  login: (codigo: string) => Promise<AuthResponse | null>;
  logout: () => void;
  clearMessages: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};