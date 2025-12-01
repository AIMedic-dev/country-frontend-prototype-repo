import React from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TopicsChart } from '../components/TopicsChart/TopicsChart';
import { WordCloudChart } from '../components/WordCloudChart/WordCloudChart';
import { PainScaleChart } from '../components/PainScaleChart/PainScaleChart';
import { SymptomsChart } from '../components/SymptomsChart/SymptomsChart';
import { StatsCards } from '../components/StatsCards/StatsCards';
import { SummarySection } from '../components/SummarySection/SummarySection';
import { AnalyticsHeader } from '../components/AnalyticsHeader/AnalyticsHeader';
import { Spinner } from '@/shared/components';
import styles from './StatisticsView.module.css';

export const StatisticsView: React.FC = () => {
  const { data, isLoading, error, refetch } = useStatistics();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" color="primary" />
        <p className={styles.loadingText}>Cargando estadísticas...</p>
      </div>
    );
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

  return (
    <div className={styles.container}>
      {/* Header con selector de pacientes */}
      <AnalyticsHeader />

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

      {/* Grid de dos columnas: Escala de Dolor y Síntomas */}
      <div className={styles.twoColumnGrid}>
        <div className={styles.chartItem}>
          <PainScaleChart data={data.painScaleData} />
        </div>
        <div className={styles.chartItem}>
          <SymptomsChart data={data.symptomsData} />
        </div>
      </div>

      {/* Palabras Más Frecuentes (se mantiene como está) */}
      <div className={styles.chartItem}>
        <WordCloudChart data={data.wordsData} />
      </div>

      {/* Resumen General de Interacciones */}
      <SummarySection />
    </div>
  );
};