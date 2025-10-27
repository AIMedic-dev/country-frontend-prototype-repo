import { Navigate } from 'react-router-dom';
import { StatisticsView } from '@/modules/statistics/views/StatisticsView';
import { useAuthContext } from '@/modules/auth/context/AuthContext';
import { Spinner } from '@/shared/components';

export const StatisticsPage = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Solo empleados pueden ver estadísticas
  if (!user || user.rol !== 'empleado') {
    return <Navigate to="/" replace />;
  }

  return <StatisticsView />;
};