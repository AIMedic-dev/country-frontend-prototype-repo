import React from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import styles from './AnalyticsLoading.module.css';

export const AnalyticsLoading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.iconWrapper}>
          <Activity className={styles.icon} size={48} />
          <div className={styles.pulseRing}></div>
          <div className={styles.pulseRing}></div>
        </div>
        
        <h2 className={styles.title}>Analizando conversaciones</h2>
        <p className={styles.subtitle}>
          Estamos procesando los datos en tiempo real...
        </p>
        
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <BarChart3 size={20} />
            <span>Extrayendo temas</span>
          </div>
          <div className={styles.statItem}>
            <BarChart3 size={20} />
            <span>Analizando patrones</span>
          </div>
          <div className={styles.statItem}>
            <BarChart3 size={20} />
            <span>Generando estadísticas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
