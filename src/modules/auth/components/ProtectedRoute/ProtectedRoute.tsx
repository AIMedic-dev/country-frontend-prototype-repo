import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import type { ReactNode } from 'react';

type UserRole = 'paciente' | 'empleado' | 'admin';

const VALID_ROLES: UserRole[] = ['paciente', 'empleado', 'admin'];

function isUserRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  // Mostrar loader mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = user?.rol;
    
    // Verificar que el rol del usuario sea válido y esté en los roles permitidos
    if (!userRole || !isUserRole(userRole) || !allowedRoles.includes(userRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">
            No tienes permisos para acceder a esta página
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
