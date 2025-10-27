import React from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { TopicsChart } from '../components/TopicsChart/TopicsChart';
import { WordCloudChart } from '../components/WordCloudChart/WordCloudChart';
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
      <div className={styles.header}>
        <h1 className={styles.title}>Estadísticas de Conversaciones</h1>
        <p className={styles.subtitle}>
          Análisis de los temas y palabras más frecuentes en las consultas
        </p>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartItem}>
          <TopicsChart data={data.topicsData} />
        </div>

        <div className={styles.chartItem}>
          <WordCloudChart data={data.wordsData} />
        </div>
      </div>
    </div>
  );
};