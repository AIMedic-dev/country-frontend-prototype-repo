import { useState, useEffect } from 'react';
import { statisticsService } from '../services/statistics.service';
import type { StatisticsData } from '../types/statistics.types';

interface UseStatisticsReturn {
  data: StatisticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: (mode?: 'cache' | 'realtime') => Promise<void>;
  refreshRealtime: () => Promise<void>;
}

interface UseStatisticsOptions {
  userCode?: string;
  mode?: 'cache' | 'realtime';
}

export const useStatistics = (options?: UseStatisticsOptions): UseStatisticsReturn => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCode, mode = 'cache' } = options || {};

  // Cargar datos
  const fetchStatistics = async (fetchMode: 'cache' | 'realtime' = mode) => {
    try {
      setIsLoading(true);
      setError(null);
      const statistics = await statisticsService.getStatistics(fetchMode, userCode);
      setData(statistics);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar en tiempo real
  const refreshRealtime = async () => {
    await fetchStatistics('realtime');
  };

  // Cargar datos cuando cambian las opciones
  useEffect(() => {
    fetchStatistics(mode);
  }, [userCode, mode]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatistics,
    refreshRealtime,
  };
};