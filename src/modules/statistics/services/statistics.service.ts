import { apiService } from '@/shared/services/api.service';
import type {
  StatisticsData,
  TopicData,
  WordFrequency,
  PainScaleData,
  SymptomData,
  AnalyticsApiResponse,
} from '../types/statistics.types';

interface CacheInfo {
  lastUpdated: string;
  updateIntervalMinutes: number;
}

interface UpdateCacheResponse {
  message: string;
  lastUpdated: string;
  updateIntervalMinutes: number;
  totalChats: number;
}

interface UpdateIntervalResponse {
  message: string;
  updateIntervalMinutes: number;
}

// Constantes configurables
const ANALYTICS_CONFIG = {
  TOP_TOPICS_LIMIT: 20,
  TOP_WORDS_LIMIT: 30,
  MIN_WORD_LENGTH: 3,
};

class StatisticsService {
    /**
     * Obtener datos de estadísticas desde el backend (con caché por defecto)
     * @param mode - 'cache' (default) o 'realtime'
     * @param userCode - Opcional: código de usuario para filtrar
     */
    async getStatistics(mode: 'cache' | 'realtime' = 'cache', userCode?: string): Promise<StatisticsData> {
        try {
            const params = new URLSearchParams();
            params.append('mode', mode);
            if (userCode && userCode !== 'all') {
                params.append('userCode', userCode);
            }

            // Usar timeout extendido para analytics (especialmente en modo realtime)
            const timeout = mode === 'realtime' ? 180000 : 30000; // 3 min para realtime, 30 seg para cache
            const analyticsData = await apiService.get<AnalyticsApiResponse>(
                `/analytics?${params.toString()}`,
                { timeout }
            );

            // Log para debugging
            console.log('📊 Analytics data received:', {
                mode,
                userCode,
                chatCount: Object.keys(analyticsData || {}).length,
                sampleChatIds: Object.keys(analyticsData || {}).slice(0, 3),
                rawData: analyticsData
            });

            // Transformar los datos del API al formato esperado
            const transformedData = this.transformAnalyticsData(analyticsData);
            
            console.log('✅ Analytics data transformed:', {
                totalConversations: transformedData.stats.totalConversations,
                topicsCount: transformedData.topicsData.length,
                wordsCount: transformedData.wordsData.length,
                summariesCount: transformedData.summaries.length
            });
            
            return transformedData;
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            
            // Extraer información del error
            const statusCode = error?.statusCode || error?.status || 0;
            const message = error?.message || 'Error desconocido';
            const backendError = error?.error;
            
            // Log detallado para debugging
            console.error('Analytics error details:', {
                statusCode,
                message,
                backendError,
                fullError: error
            });
            
            // Manejar errores específicos
            if (statusCode === 401 || statusCode === 403) {
                throw new Error('No tienes permisos para acceder a las estadísticas');
            }
            
            if (statusCode === 404) {
                throw new Error('El endpoint de analytics no fue encontrado. Verifica la configuración del backend.');
            }
            
            if (message.includes('timeout') || message.includes('ECONNABORTED') || error?.code === 'ECONNABORTED') {
                throw new Error('La consulta de analítica está tardando más de lo esperado. El servidor puede estar procesando muchos datos.');
            }
            
            if (statusCode === 500) {
                throw new Error(`Error interno del servidor: ${backendError || message}. Verifica que el backend esté funcionando correctamente.`);
            }
            
            if (message.includes('Network Error') || message.includes('ERR_NETWORK')) {
                throw new Error('Error de red. Verifica tu conexión o que el backend esté disponible.');
            }
            
            throw new Error(message || 'Error al cargar las estadísticas');
        }
    }

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
     * Obtener analítica individual de un usuario específico
     * Este endpoint siempre consulta en tiempo real desde la API externa
     * @param userCode - Código del usuario
     */
    async getUserAnalytics(userCode: string): Promise<StatisticsData> {
        try {
            console.log(`📊 Fetching individual analytics for user: ${userCode}`);
            
            // Timeout extendido para consulta individual (siempre es realtime)
            const analyticsData = await apiService.get<AnalyticsApiResponse>(
                `/analytics/user/${userCode}`,
                { timeout: 180000 } // 3 minutos
            );

            // Log para debugging
            console.log('📊 Individual analytics data received:', {
                userCode,
                chatCount: Object.keys(analyticsData || {}).length,
                sampleChatIds: Object.keys(analyticsData || {}).slice(0, 3),
                rawData: analyticsData
            });

            // Transformar los datos del API al formato esperado
            const transformedData = this.transformAnalyticsData(analyticsData);
            
            console.log('✅ Individual analytics data transformed:', {
                userCode,
                totalConversations: transformedData.stats.totalConversations,
                topicsCount: transformedData.topicsData.length,
                wordsCount: transformedData.wordsData.length,
                summariesCount: transformedData.summaries.length
            });
            
            return transformedData;
        } catch (error: any) {
            console.error('Error fetching individual analytics:', error);
            
            // Extraer información del error
            const statusCode = error?.statusCode || error?.status || 0;
            const message = error?.message || 'Error desconocido';
            const backendError = error?.error;
            
            // Log detallado para debugging
            console.error('Individual analytics error details:', {
                userCode,
                statusCode,
                message,
                backendError,
                fullError: error
            });
            
            // Manejar errores específicos
            if (statusCode === 404) {
                throw new Error(`No se encontró el usuario con código: ${userCode}`);
            }
            
            if (statusCode === 502) {
                throw new Error(`El usuario "${userCode}" no tiene datos en el sistema de analytics.`);
            }
            
            if (statusCode === 503 || message.includes('timeout') || message.includes('ECONNABORTED')) {
                throw new Error('La consulta de analítica está tardando más de lo esperado. Intenta de nuevo en unos momentos.');
            }
            
            if (statusCode === 500) {
                throw new Error(`Error interno del servidor al consultar analítica de "${userCode}": ${backendError || message}`);
            }
            
            throw new Error(message || `Error al cargar la analítica del usuario ${userCode}`);
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

    /**
     * Transformar datos del API al formato esperado por los componentes
     */
    private transformAnalyticsData(analyticsData: AnalyticsApiResponse): StatisticsData {
        // Validar que existan datos
        if (!analyticsData || typeof analyticsData !== 'object') {
            console.warn('⚠️ Analytics data is empty or invalid:', analyticsData);
            return this.getEmptyStatistics();
        }

        const chatIds = Object.keys(analyticsData);
        const totalConversations = chatIds.length;

        if (totalConversations === 0) {
            console.warn('⚠️ No conversations found in analytics data');
            return this.getEmptyStatistics();
        }

        // Extraer todos los temas y contar frecuencias
        const topicsCount: Map<string, number> = new Map();
        const allSummaries: Array<{ chatId: string; summary: string; topics: string[] }> = [];

        chatIds.forEach((chatId) => {
            const chatData = analyticsData[chatId];
            
            // Validar que el chat tenga los campos necesarios
            if (!chatData || !chatData.summary || !Array.isArray(chatData.topics)) {
                console.warn(`⚠️ Invalid chat data for chatId ${chatId}:`, chatData);
                return;
            }

            allSummaries.push({
                chatId,
                summary: chatData.summary,
                topics: chatData.topics,
            });

            // Contar frecuencia de cada tema
            chatData.topics.forEach((topic) => {
                if (typeof topic === 'string' && topic.trim()) {
                    const normalizedTopic = topic.toLowerCase().trim();
                    topicsCount.set(normalizedTopic, (topicsCount.get(normalizedTopic) || 0) + 1);
                }
            });
        });

        // Convertir temas a TopicData ordenados por frecuencia
        const topicsData: TopicData[] = Array.from(topicsCount.entries())
            .map(([name, count]) => ({
                name: this.formatTopicName(name),
                value: totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0,
                percentage: totalConversations > 0 ? `${Math.round((count / totalConversations) * 100)}%` : '0%',
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, ANALYTICS_CONFIG.TOP_TOPICS_LIMIT);

        // Extraer palabras más frecuentes de los temas (simplificado)
        const wordsCount: Map<string, number> = new Map();
        chatIds.forEach((chatId) => {
            const chatData = analyticsData[chatId];
            chatData.topics.forEach((topic) => {
                const words = topic.toLowerCase().split(/\s+/);
                words.forEach((word) => {
                    const cleanWord = word.replace(/[^a-záéíóúñü]/g, '');
                    if (cleanWord.length > ANALYTICS_CONFIG.MIN_WORD_LENGTH) {
                        wordsCount.set(cleanWord, (wordsCount.get(cleanWord) || 0) + 1);
                    }
                });
            });
        });

        const wordsData: WordFrequency[] = Array.from(wordsCount.entries())
            .map(([text, count]) => ({
                text,
                value: count,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, ANALYTICS_CONFIG.TOP_WORDS_LIMIT);

        // Datos mock para escala de dolor (no disponibles en el API actual)
        const painScaleData: PainScaleData[] = [];
        const symptomsData: SymptomData[] = [];

        // Stats
        const stats = {
            totalConversations,
            averagePain: 0, // No disponible en el API actual
            topicsCount: topicsCount.size,
            lastInteraction: new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
            }),
        };

        return {
            topicsData,
            wordsData,
            painScaleData,
            symptomsData,
            stats,
            summaries: allSummaries,
        };
    }

    /**
     * Formatear nombre del tema para mejor visualización
     */
    private formatTopicName(name: string): string {
        return name
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Retornar estadísticas vacías cuando no hay datos
     */
    private getEmptyStatistics(): StatisticsData {
        return {
            topicsData: [],
            wordsData: [],
            painScaleData: [],
            symptomsData: [],
            stats: {
                totalConversations: 0,
                averagePain: 0,
                topicsCount: 0,
                lastInteraction: 'N/A',
            },
            summaries: [],
        };
    }
}

export const statisticsService = new StatisticsService();