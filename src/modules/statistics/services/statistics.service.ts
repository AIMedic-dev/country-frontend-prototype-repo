import axios from 'axios';
import { ENV } from '@/shared/config/env';
import type {
  StatisticsData,
  TopicData,
  WordFrequency,
  PainScaleData,
  SymptomData,
  AnalyticsApiResponse,
} from '../types/statistics.types';

// Constantes configurables
const ANALYTICS_CONFIG = {
  TOP_TOPICS_LIMIT: 20,
  TOP_WORDS_LIMIT: 30,
  MIN_WORD_LENGTH: 3,
};

class StatisticsService {
    /**
     * Obtener datos de estadísticas desde el API real
     */
    async getStatistics(): Promise<StatisticsData> {
        if (!ENV.ANALYTICS_API_URL) {
            throw new Error('La URL del API de analytics no está configurada. Configura VITE_ANALYTICS_API_URL en las variables de entorno.');
        }

        try {
            // Llamada al API de analytics
            const response = await axios.get<AnalyticsApiResponse>(ENV.ANALYTICS_API_URL, {
                timeout: ENV.ANALYTICS_API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const analyticsData = response.data;

            // Transformar los datos del API al formato esperado
            return this.transformAnalyticsData(analyticsData);
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            
            // Manejar diferentes tipos de errores
            if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                throw new Error('Error de red: No se pudo conectar con el servidor de analytics. Verifica tu conexión a internet.');
            }
            
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                throw new Error('El servidor está tardando demasiado en responder. Por favor, intenta de nuevo.');
            }
            
            if (error.response) {
                // El servidor respondió con un código de error
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error || 'Error desconocido del servidor';
                
                if (status === 404) {
                    throw new Error('El endpoint de analytics no fue encontrado (404)');
                }
                
                if (status === 403 || status === 401) {
                    throw new Error('No tienes permisos para acceder a las estadísticas');
                }
                
                if (status >= 500) {
                    throw new Error(`Error del servidor (${status}): ${message}`);
                }
                
                throw new Error(`Error ${status}: ${message}`);
            }
            
            if (error.request) {
                // La petición se hizo pero no hubo respuesta
                throw new Error('No se recibió respuesta del servidor. El servidor puede estar caído o hay un problema de red.');
            }
            
            // Error desconocido
            throw new Error(error.message || 'Error al cargar las estadísticas');
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