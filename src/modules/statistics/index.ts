// Views
export { StatisticsView } from './views/StatisticsView';

// Components
export { TopicsChart } from './components/TopicsChart/TopicsChart';
export { WordCloudChart } from './components/WordCloudChart/WordCloudChart';
export { PainScaleChart } from './components/PainScaleChart/PainScaleChart';
export { SymptomsChart } from './components/SymptomsChart/SymptomsChart';
export { StatsCards } from './components/StatsCards/StatsCards';
export { SummarySection } from './components/SummarySection/SummarySection';
export { AnalyticsHeader } from './components/AnalyticsHeader/AnalyticsHeader';

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