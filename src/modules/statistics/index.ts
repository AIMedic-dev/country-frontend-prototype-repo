// Views
export { StatisticsView } from './views/StatisticsView';

// Components
export { TopicsChart } from './components/TopicsChart/TopicsChart';
export { WordCloudChart } from './components/WordCloudChart/WordCloudChart';

// Hooks
export { useStatistics } from './hooks/useStatistics';

// Services
export { statisticsService } from './services/statistics.service';

// Types
export type { 
  TopicData, 
  WordFrequency, 
  StatisticsData 
} from './types/statistics.types';