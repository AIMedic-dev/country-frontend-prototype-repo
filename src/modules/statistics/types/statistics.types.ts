export interface TopicData {
  name: string;
  value: number;
  percentage: string;
}

export interface WordFrequency {
  text: string;
  value: number;
}

export interface StatisticsData {
  topicsData: TopicData[];
  wordsData: WordFrequency[];
}