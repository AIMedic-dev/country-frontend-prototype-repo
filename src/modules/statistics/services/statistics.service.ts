import type { StatisticsData, TopicData, WordFrequency } from '../types/statistics.types';

// Datos mock (después puedes conectar con el backend)
const MOCK_TOPICS = {
    diagnóstico_temprano: 0.15,
    prevención: 0.10,
    tratamiento_hormonal: 0.12,
    quimioterapia: 0.10,
    radioterapia: 0.08,
    cirugía: 0.08,
    biopsia: 0.05,
    metástasis: 0.07,
    genética_y_mutaciones: 0.10,
    seguimiento_y_recurrencia: 0.05,
    apoyo_psicológico: 0.05,
    investigación_y_ensayos_clínicos: 0.05,
};

const MOCK_WORDS = {
    tumor: 0.07,
    mamografía: 0.06,
    células: 0.05,
    tratamiento: 0.08,
    hormonas: 0.04,
    riesgo: 0.05,
    detección: 0.04,
    paciente: 0.06,
    doctor: 0.03,
    metástasis: 0.05,
    cáncer: 0.10,
    gen: 0.03,
    mutación: 0.03,
    prevención: 0.05,
    recurrencia: 0.03,
    biopsia: 0.03,
    radiación: 0.02,
    quimioterapia: 0.04,
    supervivencia: 0.04,
    investigación: 0.04,
};

class StatisticsService {
    /**
     * Obtener datos de estadísticas
     */
    async getStatistics(): Promise<StatisticsData> {
        // Simular llamada a API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Transformar datos para los gráficos
        const topicsData: TopicData[] = Object.entries(MOCK_TOPICS)
            .map(([name, value]) => ({
                name: this.formatTopicName(name),
                value: Math.round(value * 100),
                percentage: `${Math.round(value * 100)}%`,
            }))
            .sort((a, b) => b.value - a.value);

        // ✨ VERIFICAR: Asegurar formato correcto para palabras
        const wordsData: WordFrequency[] = Object.entries(MOCK_WORDS)
            .map(([text, value]) => ({
                text: text,
                value: Math.round(value * 100),
            }))
            .filter(word => word.text && word.value > 0); // ✨ AGREGAR: Filtrar datos inválidos

        console.log('Words data:', wordsData); // ✨ DEBUG

        return { topicsData, wordsData };
    }

    /**
     * Formatear nombre del tema para mejor visualización
     */
    private formatTopicName(name: string): string {
        return name
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

export const statisticsService = new StatisticsService();