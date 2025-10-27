import { useState, useEffect } from 'react';
import { statisticsService } from '../services/statistics.service';
import type { StatisticsData } from '../types/statistics.types';

interface UseStatisticsReturn {
  data: StatisticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStatistics = (): UseStatisticsReturn => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statistics = await statisticsService.getStatistics();
      setData(statistics);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};