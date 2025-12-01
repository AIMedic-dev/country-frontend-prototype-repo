import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SymptomData } from '../../types/statistics.types';
import styles from './SymptomsChart.module.css';

interface SymptomsChartProps {
  data: SymptomData[];
}

const COLORS = [
  'var(--ds-blue-600)',
  'var(--ds-blue-500)',
  'var(--ds-blue-400)',
  'var(--ds-blue-700)',
  'var(--ds-blue-900)',
];

export const SymptomsChart: React.FC<SymptomsChartProps> = ({ data }) => {
  // Transformar datos para Recharts
  const chartData = data.map((item) => ({
    name: item.nombre,
    value: item.menciones,
  }));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Síntomas y Efectos Consultados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => {
              const name = entry.name || '';
              const percent = entry.percent || 0;
              return `${name} ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {data.map((symptom, idx) => (
          <div key={idx} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: COLORS[idx] }}></div>
            <span className={styles.legendName}>{symptom.nombre}</span>
            <span className={styles.legendValue}>{symptom.menciones} menciones</span>
          </div>
        ))}
      </div>
    </div>
  );
};

