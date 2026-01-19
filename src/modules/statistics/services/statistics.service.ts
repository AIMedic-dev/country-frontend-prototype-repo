import { apiService } from '@/shared/services/api.service';
import type {
  StatisticsData,
  TopicData,
  WordFrequency,
  PainScaleData,
  SymptomData,
  AnalyticsApiResponse,
} from '../types/statistics.types';

interface Chat {
  id: string;
  userId: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

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
     * Obtener chats de un usuario por su código
     */
    async getChatsByUserCode(userCode: string): Promise<Chat[]> {
        try {
            const chats = await apiService.get<Chat[]>(`/chats/user/codigo/${userCode}`);
            return chats;
        } catch (error: any) {
            console.error('Error fetching chats by user code:', error);
            if (error.statusCode === 404) {
                throw new Error(`No se encontraron chats para el código: ${userCode}`);
            }
            throw new Error(`Error al obtener los chats del usuario: ${error.message || 'Error desconocido'}`);
        }
    }

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

            const analyticsData = await apiService.get<AnalyticsApiResponse>(`/analytics?${params.toString()}`);

            // Transformar los datos del API al formato esperado
            return this.transformAnalyticsData(analyticsData);
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            
            const message = error?.message || 'Error desconocido';
            
            if (message.includes('401') || message.includes('403')) {
                throw new Error('No tienes permisos para acceder a las estadísticas');
            }
            
            if (message.includes('404')) {
                throw new Error('El endpoint de analytics no fue encontrado');
            }
            
            if (message.includes('timeout') || message.includes('ECONNABORTED')) {
                throw new Error('El servidor está tardando demasiado en responder. Por favor, intenta de nuevo.');
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
        const chatIds = Object.keys(analyticsData);
        const totalConversations = chatIds.length;

        // Extraer todos los temas y contar frecuencias
        const topicsCount: Map<string, number> = new Map();
        const allSummaries: Array<{ chatId: string; summary: string; topics: string[] }> = [];

        chatIds.forEach((chatId) => {
            const chatData = analyticsData[chatId];
            allSummaries.push({
                chatId,
                summary: chatData.summary,
                topics: chatData.topics,
            });

            // Contar frecuencia de cada tema
            chatData.topics.forEach((topic) => {
                const normalizedTopic = topic.toLowerCase().trim();
                topicsCount.set(normalizedTopic, (topicsCount.get(normalizedTopic) || 0) + 1);
            });
        });

        // Convertir temas a TopicData ordenados por frecuencia
        const topicsData: TopicData[] = Array.from(topicsCount.entries())
            .map(([name, count]) => ({
                name: this.formatTopicName(name),
                value: Math.round((count / totalConversations) * 100),
                percentage: `${Math.round((count / totalConversations) * 100)}%`,
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
     * Filtrar datos de estadísticas por código de usuario
     * @param data - Datos de estadísticas completos
     * @param userCode - Código del usuario para filtrar
     */
    async filterStatisticsByUserCode(data: StatisticsData, userCode: string): Promise<StatisticsData> {
        try {
            // Obtener los chats del usuario por código
            const userChats = await this.getChatsByUserCode(userCode);
            const userChatIds = new Set(userChats.map(chat => chat.id));

            // Filtrar los resúmenes para incluir solo los chats del usuario
            const filteredSummaries = data.summaries.filter(summary => 
                userChatIds.has(summary.chatId)
            );

            // Recalcular estadísticas basadas en los datos filtrados
            const totalConversations = filteredSummaries.length;

            // Recalcular temas basados en los resúmenes filtrados
            const topicsCount: Map<string, number> = new Map();
            filteredSummaries.forEach((summary) => {
                summary.topics.forEach((topic) => {
                    const normalizedTopic = topic.toLowerCase().trim();
                    topicsCount.set(normalizedTopic, (topicsCount.get(normalizedTopic) || 0) + 1);
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

            // Recalcular palabras más frecuentes
            const wordsCount: Map<string, number> = new Map();
            filteredSummaries.forEach((summary) => {
                summary.topics.forEach((topic) => {
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

            // Stats actualizadas
            const stats = {
                totalConversations,
                averagePain: data.stats.averagePain, // Mantener el mismo (no disponible en el API)
                topicsCount: topicsCount.size,
                lastInteraction: data.stats.lastInteraction, // Mantener el mismo
            };

            return {
                topicsData,
                wordsData,
                painScaleData: data.painScaleData, // Mantener el mismo (vacío)
                symptomsData: data.symptomsData, // Mantener el mismo (vacío)
                stats,
                summaries: filteredSummaries,
            };
        } catch (error: any) {
            console.error('Error filtering by user code:', error);
            throw new Error(`Error al filtrar por código de usuario: ${error.message}`);
        }
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
}

export const statisticsService = new StatisticsService();