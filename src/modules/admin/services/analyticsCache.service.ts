import { apiService } from '@/shared/services/api.service';

export interface CacheInfo {
  lastUpdated: string;
  updateIntervalMinutes: number;
}

export interface UpdateCacheResponse {
  message: string;
  lastUpdated: string;
  updateIntervalMinutes: number;
  totalChats: number;
}

export interface UpdateIntervalResponse {
  message: string;
  updateIntervalMinutes: number;
}

class AnalyticsCacheService {
  /**
   * Obtener información de la caché
   */
  async getCacheInfo(): Promise<CacheInfo> {
    try {
      return await apiService.get<CacheInfo>('/analytics/cache/info');
    } catch (error: any) {
      console.error('Error fetching cache info:', error);
      throw new Error(error?.message || 'Error al obtener información de la caché');
    }
  }

  /**
   * Actualizar caché manualmente (solo admin)
   */
  async updateCache(updateIntervalMinutes?: number): Promise<UpdateCacheResponse> {
    try {
      const body = updateIntervalMinutes ? { updateIntervalMinutes } : {};
      return await apiService.post<UpdateCacheResponse>('/analytics/cache/update', body);
    } catch (error: any) {
      console.error('Error updating cache:', error);
      throw new Error(error?.message || 'Error al actualizar la caché');
    }
  }

  /**
   * Configurar intervalo de actualización de caché (solo admin)
   */
  async setCacheInterval(minutes: number): Promise<UpdateIntervalResponse> {
    if (minutes < 1) {
      throw new Error('El intervalo mínimo es de 1 minuto');
    }
    
    try {
      return await apiService.patch<UpdateIntervalResponse>('/analytics/cache/interval', { minutes });
    } catch (error: any) {
      console.error('Error setting cache interval:', error);
      throw new Error(error?.message || 'Error al configurar el intervalo de actualización');
    }
  }
}

export const analyticsCacheService = new AnalyticsCacheService();
