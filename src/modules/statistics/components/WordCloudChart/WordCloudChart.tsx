import React, { useMemo } from 'react';
import type { WordFrequency } from '../../types/statistics.types';
import styles from './WordCloudChart.module.css';

interface WordCloudChartProps {
  data: WordFrequency[];
}

const COLORS = ['#42A2CA', '#0E3192', '#062045', '#091621', '#0B255B', '#7FBED8'];

export const WordCloudChart: React.FC<WordCloudChartProps> = ({ data }) => {
  // Calcular tamaño de fuente basado en el valor
  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  const getFontSize = (value: number) => {
    // Escala de 14px a 48px
    const minSize = 14;
    const maxSize = 48;
    return minSize + ((value / maxValue) * (maxSize - minSize));
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles.cloudContainer}>
        <h3 className={styles.cloudTitle}>Palabras Más Frecuentes</h3>
        <div className={styles.emptyState}>
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cloudContainer}>
      <h3 className={styles.cloudTitle}>Palabras Más Frecuentes</h3>
      <div className={styles.cloudWrapper}>
        <div className={styles.wordCloud}>
          {sortedData.map((word, index) => (
            <span
              key={word.text}
              className={styles.word}
              style={{
                fontSize: `${getFontSize(word.value)}px`,
                color: COLORS[index % COLORS.length],
                fontWeight: word.value > maxValue * 0.6 ? 'bold' : 'normal',
              }}
              title={`${word.text}: ${word.value}%`}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};