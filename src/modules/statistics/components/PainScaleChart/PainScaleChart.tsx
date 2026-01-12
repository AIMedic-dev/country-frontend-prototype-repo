import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PainScaleData } from '../../types/statistics.types';
import styles from './PainScaleChart.module.css';

interface PainScaleChartProps {
  data: PainScaleData[];
}

export const PainScaleChart: React.FC<PainScaleChartProps> = ({ data }) => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Evolución de Escala de Dolor (0-10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="fecha" stroke="#666" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis domain={[0, 10]} stroke="#666" tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: `2px solid var(--ds-blue-600)`,
              borderRadius: '8px',
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={styles.tooltip}>
                    <p className={styles.tooltipDate}>{payload[0].payload.fecha}</p>
                    <p className={styles.tooltipPain}>Dolor: {payload[0].value}/10</p>
                    <p className={styles.tooltipMedication}>
                      {payload[0].payload.medicamento}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="nivel"
            stroke="var(--ds-blue-600)"
            strokeWidth={3}
            dot={{ fill: 'var(--ds-blue-600)', r: 6 }}
            activeDot={{ r: 8, fill: 'var(--ds-blue-500)' }}
          />
        </LineChart>
      </ResponsiveContainer>
      {data.length > 0 && (
        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            <strong>Medicamento actual:</strong> {data[data.length - 1].medicamento}
          </p>
        </div>
      )}
    </div>
  );
};

