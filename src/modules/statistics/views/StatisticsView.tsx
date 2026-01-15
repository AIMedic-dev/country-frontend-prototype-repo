import React, { useState } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TopicsChart } from '../components/TopicsChart/TopicsChart';
import { WordCloudChart } from '../components/WordCloudChart/WordCloudChart';
import { StatsCards } from '../components/StatsCards/StatsCards';
import { SummarySection } from '../components/SummarySection/SummarySection';
import { AnalyticsHeader } from '../components/AnalyticsHeader/AnalyticsHeader';
import { AnalyticsLoading } from '../components/AnalyticsLoading/AnalyticsLoading';
import styles from './StatisticsView.module.css';

export const StatisticsView: React.FC = () => {
  const [selectedUserCode, setSelectedUserCode] = useState<string>('all');
  const { data, isLoading, error, refetch } = useStatistics({ 
    userCode: selectedUserCode === 'all' ? undefined : selectedUserCode 
  });

  if (isLoading) {
    return <AnalyticsLoading />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Error al cargar estadísticas</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={refetch} className={styles.retryButton}>
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