import { useState, useEffect } from 'react';
import { statisticsService } from '../services/statistics.service';
import type { StatisticsData } from '../types/statistics.types';

interface UseStatisticsReturn {
  data: StatisticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseStatisticsOptions {
  userCode?: string;
}

export const useStatistics = (options?: UseStatisticsOptions): UseStatisticsReturn => {
  const [allData, setAllData] = useState<StatisticsData | null>(null);
  const [filteredData, setFilteredData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userCode } = options || {};

  // Cargar datos completos solo una vez
  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statistics = await statisticsService.getStatistics();
      setAllData(statistics);
      setFilteredData(statistics);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar datos cuando cambia el código de usuario
  useEffect(() => {
    const filterData = async () => {
      if (!allData) return;

      if (!userCode || userCode === 'all') {
        // Mostrar todos los datos
        setFilteredData(allData);
        return;
      }

      try {
        setIsFiltering(true);
        setError(null);
        const filtered = await statisticsService.filterStatisticsByUserCode(allData, userCode);
        setFilteredData(filtered);
      } catch (err: any) {
        console.error('Error filtering statistics:', err);
        setError(err.message || 'Error al filtrar las estadísticas');
        // En caso de error, mostrar todos los datos
        setFilteredData(allData);
      } finally {
        setIsFiltering(false);
      }
    };

    filterData();
  }, [userCode, allData]);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    if (!allData) {
      fetchStatistics();
    }
  }, []);

  return {
    data: filteredData,
    isLoading: isLoading || isFiltering,
    error,
    refetch: fetchStatistics,
  };
};