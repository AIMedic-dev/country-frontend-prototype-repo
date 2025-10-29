import React from 'react';
import ReactMarkdown from 'react-markdown';
import { formatTime } from '../../../../shared';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  content: string;
  answer: string;
  timestamp: string;
}

// 👇 SOLO agregar React.memo
export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  content,
  answer,
  timestamp,
}) => {
  return (
    <div className={styles.messageGroup}>
      {/* Mensaje del usuario */}
      <div className={styles.userMessageContainer}>
        <div className={styles.userBubble}>
          <p className={styles.userText}>{content}</p>
        </div>
      </div>

      {/* Respuesta de la IA - SOLO si hay respuesta */}
      {answer && (
        <div className={styles.aiMessageContainer}>
          {/* Avatar con logo Country */}
          <div className={styles.aiAvatar}>
            <img
              src="/images/logos/country-icono.png"
              alt="Country"
              className={styles.avatarImage}
            />
          </div>

          {/* Contenido de la respuesta con Markdown */}
          <div className={styles.aiContent}>
            <div className={styles.aiBubble}>
              <div className={styles.markdown}>
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>

            {/* Timestamp discreto */}
            <time className={styles.aiTimestamp}>
              {formatTime(timestamp)}
            </time>
          </div>
        </div>
      )}
    </div>
  );
});

// 👇 Agregar displayName
MessageBubble.displayName = 'MessageBubble';