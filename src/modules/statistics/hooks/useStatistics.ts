import { useState, useEffect, useRef } from 'react';
import { statisticsService } from '../services/statistics.service';
import type { StatisticsData } from '../types/statistics.types';

interface UseStatisticsReturn {
  data: StatisticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshRealtime: () => Promise<void>;
}

interface UseStatisticsOptions {
  userCode?: string;
  mode?: 'cache' | 'realtime';
  useIndividualEndpoint?: boolean; // Nuevo: para forzar uso del endpoint individual
}

export const useStatistics = (options?: UseStatisticsOptions): UseStatisticsReturn => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userCode, mode = 'cache', useIndividualEndpoint = true } = options || {};
  
  // Ref para rastrear el userCode actual
  const currentUserCodeRef = useRef(userCode);
  const currentModeRef = useRef(mode);
  const useIndividualEndpointRef = useRef(useIndividualEndpoint);

  // Actualizar los refs cuando cambian
  useEffect(() => {
    currentUserCodeRef.current = userCode;
    currentModeRef.current = mode;
    useIndividualEndpointRef.current = useIndividualEndpoint;
  }, [userCode, mode, useIndividualEndpoint]);

  // Cargar datos (función memoizada en useRef para evitar dependencias circulares)
  const fetchStatistics = useRef(async (customUserCode?: string, customMode?: 'cache' | 'realtime') => {
    const codeToUse = customUserCode !== undefined ? customUserCode : currentUserCodeRef.current;
    const modeToUse = customMode || currentModeRef.current;
    const useIndividual = useIndividualEndpointRef.current;
    
    try {
      setIsLoading(true);
      setError(null);
      
      let statistics: StatisticsData;
      
      // Si hay un código de usuario Y useIndividualEndpoint es true, usar endpoint individual
      if (codeToUse && useIndividual) {
        statistics = await statisticsService.getUserAnalytics(codeToUse);
      } else {
        // De lo contrario, usar endpoint general con filtro opcional
        statistics = await statisticsService.getStatistics(modeToUse, codeToUse);
      }
      
      setData(statistics);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  });

  // Actualizar en tiempo real con el userCode actual
  const refreshRealtime = async () => {
    await fetchStatistics.current(currentUserCodeRef.current, 'realtime');
  };

  // Wrapper para refetch que usa la ref
  const refetch = async () => {
    await fetchStatistics.current(currentUserCodeRef.current, currentModeRef.current);
  };

  // Cargar datos cuando cambian las opciones
  useEffect(() => {
    fetchStatistics.current(userCode, mode);
  }, [userCode, mode, useIndividualEndpoint]);

  return {
    data,
    isLoading,
    error,
    refetch,
    refreshRealtime,
  };
};