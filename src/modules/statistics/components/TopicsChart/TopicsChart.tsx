import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TopicData } from '../../types/statistics.types';
import styles from './TopicsChart.module.css';

interface TopicsChartProps {
  data: TopicData[];
}

const COLORS = [
  '#091621',
  '#062045',
  '#0B255B',
  '#0E3192',
  '#42A2CA',
  '#4facfe',
  '#fee140',
  '#30cfd0',
  '#a8edea',
  '#ff6b6b',
  '#feca57',
  '#48dbfb',
];

export const TopicsChart: React.FC<TopicsChartProps> = ({ data }) => {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Temas Principales</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            label={{
              value: 'Porcentaje (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 14, fill: '#475569' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value: number) => [`${value}%`, 'Frecuencia']}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};