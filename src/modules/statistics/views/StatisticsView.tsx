import React, { useState } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TopicsChart } from '../components/TopicsChart/TopicsChart';
import { StatsCards } from '../components/StatsCards/StatsCards';
import { SummarySection } from '../components/SummarySection/SummarySection';
import { AnalyticsHeader } from '../components/AnalyticsHeader/AnalyticsHeader';
import { AnalyticsLoading } from '../components/AnalyticsLoading/AnalyticsLoading';
import { AnalyticsCacheConfig } from '@/modules/admin/components/AnalyticsCacheConfig/AnalyticsCacheConfig';
import { useAuthContext } from '@/modules/auth/context/AuthContext';
import { RefreshCw, Database } from 'lucide-react';
import styles from './StatisticsView.module.css';

export const StatisticsView: React.FC = () => {
  const [selectedUserCode, setSelectedUserCode] = useState<string>('all');
  const { user } = useAuthContext();
  const isAdmin = user?.rol === 'admin';
  
  // Cuando se selecciona un usuario específico, usar endpoint individual
  const { data, isLoading, error, refetch, refreshRealtime } = useStatistics({ 
    userCode: selectedUserCode === 'all' ? undefined : selectedUserCode,
    mode: 'cache', // Solo aplica para vista general
    useIndividualEndpoint: selectedUserCode !== 'all' // Usar endpoint individual cuando hay código
  });

  const handleRefreshRealtime = async () => {
    try {
      await refreshRealtime();
    } catch (err: any) {
      console.error('Error refreshing realtime:', err);
      // El error ya se mostrará en el UI a través del estado 'error' del hook
    }
  };

  if (isLoading && !data) {
    return <AnalyticsLoading />;
  }

  if (error && !data) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Error al cargar estadísticas</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={() => refetch()} className={styles.retryButton}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Verificar si hay datos para mostrar
  const hasData = data.stats.totalConversations > 0;

  const handleUserCodeChange = (userCode: string) => {
    setSelectedUserCode(userCode);
  };

  return (
    <div className={styles.container}>
      {/* Header con selector de pacientes */}
      <AnalyticsHeader 
        selectedPatient={selectedUserCode}
        onPatientChange={handleUserCodeChange}
      />

      {/* Barra de acciones */}
      <div className={styles.actionsBar}>
        <div className={styles.actionsLeft}>
          {/* Solo mostrar botón de actualizar en tiempo real para vista general */}
          {selectedUserCode === 'all' && (
            <button
              onClick={handleRefreshRealtime}
              disabled={isLoading}
              className={styles.realtimeButton}
              title="Actualizar con datos en tiempo real (puede tardar hasta 2 minutos)"
            >
              <RefreshCw size={18} className={isLoading ? styles.spinning : ''} />
              {isLoading ? 'Actualizando... (puede tardar hasta 2 min)' : 'Actualizar en tiempo real'}
            </button>
          )}
          <span className={styles.cacheBadge}>
            <Database size={14} />
            {isLoading ? 'Cargando...' : selectedUserCode !== 'all' ? 'Datos individuales (tiempo real)' : 'Datos desde caché'}
          </span>
        </div>
        {isAdmin && (
          <div className={styles.actionsRight}>
            <AnalyticsCacheConfig />
          </div>
        )}
      </div>

      {/* Mensaje de error si existe */}
      {error && data && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {!hasData && !isLoading && (
        <div className={styles.noDataContainer}>
          <div className={styles.noDataCard}>
            <span className={styles.noDataIcon}>📊</span>
            <h3 className={styles.noDataTitle}>No hay datos disponibles</h3>
            <p className={styles.noDataMessage}>
              {selectedUserCode !== 'all' 
                ? `No se encontraron conversaciones para el usuario "${selectedUserCode}". Verifica el código e intenta de nuevo.`
                : 'No hay conversaciones analizadas todavía. Las estadísticas aparecerán cuando haya datos disponibles.'}
            </p>
            {selectedUserCode !== 'all' && (
              <button 
                onClick={() => setSelectedUserCode('all')} 
                className={styles.viewAllButton}
              >
                Ver todas las conversaciones
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {hasData && (
        <>
          <StatsCards
            stats={data.stats}
            topicsData={data.topicsData}
            painScaleData={data.painScaleData}
            symptomsData={data.symptomsData}
          />

          {/* Gráfica de Temas Más Comunes */}
          <div className={styles.chartItem}>
            <TopicsChart data={data.topicsData} />
          </div>

          {/* Palabras Más Frecuentes - Comentado temporalmente
          <div className={styles.chartItem}>
            <WordCloudChart data={data.wordsData} />
          </div>
          */}

          {/* Resumen General de Interacciones */}
          {data.summaries && data.summaries.length > 0 && (
            <SummarySection summaries={data.summaries} totalConversations={data.stats.totalConversations} />
          )}
        </>
      )}
    </div>
  );
};