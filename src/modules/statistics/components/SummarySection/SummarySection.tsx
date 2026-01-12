import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components';
import styles from './SummarySection.module.css';

interface SummarySectionProps {
  summaries: Array<{
    chatId: string;
    summary: string;
    topics: string[];
  }>;
  totalConversations: number;
}

const CONVERSATIONS_PER_PAGE = 5;
const TOPICS_PER_PAGE = 5;

export const SummarySection: React.FC<SummarySectionProps> = ({ summaries, totalConversations }) => {
  const [displayedCount, setDisplayedCount] = useState(CONVERSATIONS_PER_PAGE);
  const [displayedTopicsCount, setDisplayedTopicsCount] = useState(TOPICS_PER_PAGE);
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());

  // Obtener los resúmenes a mostrar según el contador
  const displayedSummaries = useMemo(() => {
    return summaries.slice(0, displayedCount);
  }, [summaries, displayedCount]);

  const hasMore = summaries.length > displayedCount;
  const remainingCount = summaries.length - displayedCount;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + CONVERSATIONS_PER_PAGE);
  };

  // Agrupar temas únicos
  const allTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    summaries.forEach((s) => {
      s.topics.forEach((topic) => topicsSet.add(topic));
    });
    return Array.from(topicsSet);
  }, [summaries]);

  // Obtener los temas a mostrar según el contador
  const displayedTopics = useMemo(() => {
    return allTopics.slice(0, displayedTopicsCount);
  }, [allTopics, displayedTopicsCount]);

  const hasMoreTopics = allTopics.length > displayedTopicsCount;
  const remainingTopicsCount = allTopics.length - displayedTopicsCount;

  const handleLoadMoreTopics = () => {
    setDisplayedTopicsCount((prev) => prev + TOPICS_PER_PAGE);
  };

  const toggleConversationTopics = (chatId: string) => {
    setExpandedConversations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) {
        newSet.delete(chatId);
      } else {
        newSet.add(chatId);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.summaryContainer}>
      <h2 className={styles.summaryTitle}>Resumen General de Interacciones</h2>
      <div className={styles.summaryContent}>
        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>PERIODO DE ANÁLISIS</p>
          <p className={styles.sectionText}>
            {totalConversations} {totalConversations === 1 ? 'conversación total' : 'conversaciones totales'}
          </p>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>TEMAS PRINCIPALES</p>
          <div className={styles.topicsGrid}>
            {displayedTopics.map((topic, index) => (
              <span key={index} className={styles.topicTag}>
                {topic}
              </span>
            ))}
          </div>
          {hasMoreTopics && (
            <div className={styles.loadMoreTopicsContainer}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMoreTopics}
                rightIcon={<ChevronDown size={16} />}
                className={styles.loadMoreTopicsButton}
              >
                Ver {remainingTopicsCount > TOPICS_PER_PAGE
                  ? `${TOPICS_PER_PAGE} más`
                  : remainingTopicsCount === 1
                  ? '1 tema más'
                  : `${remainingTopicsCount} temas más`}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>RESÚMENES DE CONVERSACIONES</p>
          {displayedSummaries.map((item, index) => (
            <div key={item.chatId} className={styles.conversationSummary}>
              <p className={styles.conversationNumber}>Conversación {index + 1}</p>
              <p className={styles.sectionText}>{item.summary}</p>
              {item.topics.length > 0 && (
                <div className={styles.conversationTopics}>
                  <div className={styles.topicsContent}>
                    <strong>Temas: </strong>
                    <span className={styles.topicsList}>
                      {expandedConversations.has(item.chatId)
                        ? item.topics.join(', ')
                        : item.topics.slice(0, 5).join(', ')}
                    </span>
                  </div>
                  {item.topics.length > 5 && (
                    <button
                      type="button"
                      onClick={() => toggleConversationTopics(item.chatId)}
                      className={styles.showAllTopicsButton}
                    >
                      {expandedConversations.has(item.chatId)
                        ? 'Ver menos'
                        : `Ver todos los temas (${item.topics.length - 5} más)`}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <Button
                variant="outline"
                size="md"
                onClick={handleLoadMore}
                rightIcon={<ChevronDown size={18} />}
                className={styles.loadMoreButton}
              >
                Ver {remainingCount > CONVERSATIONS_PER_PAGE
                  ? `${CONVERSATIONS_PER_PAGE} más`
                  : remainingCount === 1
                  ? '1 conversación más'
                  : `${remainingCount} conversaciones más`}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.noteBox}>
          <p className={styles.noteText}>
            💡 Nota: Este resumen consolida las {totalConversations} interacciones analizadas. 
            Se recomienda revisar conversaciones específicas para detalles adicionales.
          </p>
        </div>
      </div>
    </div>
  );
};






