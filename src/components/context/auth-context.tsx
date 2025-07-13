import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
// import URL_MAP from '../../lib/url-dictionary';

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

  // useEffect(() => {
  //   const token = saveTokenToCookie(
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhY2llbnRlc0BhaW1lZGljLmNvbS5jbyIsInN1YiI6IjY4NDlmMTc1NDFlOTc4ZDEyODU0NzY4OCIsInByb2plY3RzIjpbImNvdW50cnkiXSwidXNlck5hbWUiOiJwYWNpZW50ZSIsInJvbGUiOiJwYWNpZW50ZSIsImlhdCI6MTc0OTY5NDI5OSwiZXhwIjoxNzUwMjk5MDk5fQ.J6hlwsA1MDi3kcBVDJIMnR5_fkS9dJuKEsZJfdKhwBA'
  //   );
  //   console.log('token', token);
  // }, []);

  // Función para validar y configurar el token
  // auth-context.tsx  (solo esta función cambia)
  const validateAndSetToken = (tokenValue: string): boolean => {
    try {
      const decoded = decodeToken(tokenValue) as TokenPayload | undefined;
      if (!decoded) return false;

      // 1. expiración
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        removeToken();
        return false;
      }

      // 2. permisos
      const projects = decoded.projects;               // string[] | undefined
      const hasAccess =
        !projects || projects.length === 0              // paciente (sin projects)
          ? true
          : projects.includes('country');               // corporativo válido

      if (!hasAccess) return false;

      // 3. setear estado
      setToken(tokenValue);
      setUser(decoded);
      setIsAuthenticated(true);
      setHasVascularAccess(projects?.includes('country') ?? true); // paciente = true
      return true;
    } catch (err) {
      console.error('Error validando token:', err);
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
    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
  };

  // Efecto para inicializar la autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        const existingToken = getTokenFromCookie();

        if (!existingToken) {
          // No hay token, redirigir al login solo si no estamos ya en /login
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
        } else {
          // Validar token existente
          const isValid = validateAndSetToken(existingToken);

          if (!isValid) {
            // Token inválido, redirigir al login solo si no estamos ya en /login
            if (window.location.pathname !== '/login') {
              window.location.replace('/login');
            }
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listener para login-success desde el microfrontend
    const handleLoginSuccess = (e: any) => {
      if (e.detail?.token) {
        login(e.detail.token);               // actualiza contexto


        const to = e.detail.redirectTo;
        if (to) window.location.replace(to);
      }
    };
    window.addEventListener('login-success', handleLoginSuccess);
    return () => window.removeEventListener('login-success', handleLoginSuccess);
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
