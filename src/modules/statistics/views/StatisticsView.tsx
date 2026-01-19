import React, { useState } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TopicsChart } from '../components/TopicsChart/TopicsChart';
import { WordCloudChart } from '../components/WordCloudChart/WordCloudChart';
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
  const [isRefreshingRealtime, setIsRefreshingRealtime] = useState(false);
  const { user } = useAuthContext();
  const isAdmin = user?.rol === 'admin';
  
  const { data, isLoading, error, refetch, refreshRealtime } = useStatistics({ 
    userCode: selectedUserCode === 'all' ? undefined : selectedUserCode,
    mode: 'cache' // Por defecto usa caché
  });

  const handleRefreshRealtime = async () => {
    try {
      setIsRefreshingRealtime(true);
      await refreshRealtime();
    } catch (err) {
      console.error('Error refreshing realtime:', err);
    } finally {
      setIsRefreshingRealtime(false);
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
          <button onClick={() => refetch('cache')} className={styles.retryButton}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

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
          <button
            onClick={handleRefreshRealtime}
            disabled={isRefreshingRealtime}
            className={styles.realtimeButton}
            title="Actualizar con datos en tiempo real"
          >
            <RefreshCw size={18} className={isRefreshingRealtime ? styles.spinning : ''} />
            {isRefreshingRealtime ? 'Actualizando...' : 'Actualizar en tiempo real'}
          </button>
          <span className={styles.cacheBadge}>
            <Database size={14} />
            Datos desde caché
          </span>
        </div>
        {isAdmin && (
          <div className={styles.actionsRight}>
            <AnalyticsCacheConfig />
          </div>
        )}
      </div>

      {/* Stats Cards */}
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

      {/* Palabras Más Frecuentes */}
      <div className={styles.chartItem}>
        <WordCloudChart data={data.wordsData} />
      </div>

      {/* Resumen General de Interacciones */}
      {data.summaries && data.summaries.length > 0 && (
        <SummarySection summaries={data.summaries} totalConversations={data.stats.totalConversations} />
      )}
    </div>
  );
};