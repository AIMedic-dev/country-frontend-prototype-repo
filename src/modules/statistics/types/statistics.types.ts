export interface TopicData {
  name: string;
  value: number;
  percentage: string;
}

export interface WordFrequency {
  text: string;
  value: number;
}

export interface PainScaleData {
  fecha: string;
  nivel: number;
  medicamento: string;
}

export interface SymptomData {
  nombre: string;
  menciones: number;
}

// Respuesta del API de analytics
export interface AnalyticsChatData {
  summary: string;
  topics: string[];
}

export interface AnalyticsApiResponse {
  [chatId: string]: AnalyticsChatData;
}

export interface StatisticsData {
  topicsData: TopicData[];
  wordsData: WordFrequency[];
  painScaleData: PainScaleData[];
  symptomsData: SymptomData[];
  stats: {
    totalConversations: number;
    averagePain: number;
    topicsCount: number;
    lastInteraction: string;
  };
  summaries: Array<{
    chatId: string;
    summary: string;
    topics: string[];
  }>;
}