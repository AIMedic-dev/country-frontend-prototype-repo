import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import URL from '../../lib/url-dictionary';

import {
  removeToken,
  getTokenFromCookie,
  decodeToken,
  saveTokenToCookie,
} from '../../lib/cookies-managment';
import type { TokenPayload } from '../../types/general-types';

import type { AuthContextType } from '../../types/general-types';

// Crear el contexto con un valor por defecto más completo
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estados para manejar la autenticación
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasVascularAccess, setHasVascularAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para validar y configurar el token
  const validateAndSetToken = (tokenValue: string): boolean => {
    try {
      const decodedToken = decodeToken(tokenValue);

      if (!decodedToken) {
        console.error('Token no válido');
        return false;
      }

      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        console.error('Token expirado');
        removeToken();
        return false;
      }

      // Verificar acceso a "accesos vasculares"
      const hasAccess = decodedToken.projects.includes('country');

      if (!hasAccess) {
        console.error('Sin acceso al proyecto "country"');
        return false;
      }

      // Configurar estados
      setToken(tokenValue);
      setUser(decodedToken);
      setIsAuthenticated(true);
      setHasVascularAccess(hasAccess);

      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  };

  // Función de login
  const login = (newToken: string): boolean => {
    const isValid = validateAndSetToken(newToken);

    if (isValid) {
      saveTokenToCookie(newToken);
      return true;
    } else {
      logout();
      return false;
    }
  };

  // Función de logout
  const logout = () => {
    console.log('Ejecutando logout...');
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setHasVascularAccess(false);
    // Usar window.location.replace para navegar sin historial
    window.location.replace(URL.login);
  };

  // Efecto para inicializar la autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        const existingToken = getTokenFromCookie();

        if (!existingToken) {
          // No hay token, redirigir al login
          window.location.replace(URL.login);
        } else {
          // Validar token existente
          const isValid = validateAndSetToken(existingToken);

          if (!isValid) {
            // Token inválido, redirigir al login
            window.location.replace(URL.login);
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        window.location.replace(URL.login);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Valor del contexto
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    hasVascularAccess,
    isLoading,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

// Componente de ruta protegida
interface ProtectedRouteProps {
  children: ReactNode;
  requireVascularAccess?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireVascularAccess = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasVascularAccess, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // O tu componente de loading
  }

  if (!isAuthenticated) {
    return <div>Redirigiendo al login...</div>;
  }

  if (requireVascularAccess && !hasVascularAccess) {
    return <div>Sin acceso al proyecto de accesos vasculares</div>;
  }

  return <>{children}</>;
};

// Hook para verificación periódica del token
export const useTokenValidation = () => {
  const { logout, token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decodedToken.exp - currentTime;

        // Si queda menos de 5 minutos, advertir al usuario
        if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
          console.warn('Token expirará pronto');
          // Aquí podrías mostrar una notificación al usuario
        }

        // Si ya expiró, hacer logout
        if (timeUntilExpiry <= 0) {
          console.error('Token expirado');
          logout();
        }
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [token, logout]);
};
