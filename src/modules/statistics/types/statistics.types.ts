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
}