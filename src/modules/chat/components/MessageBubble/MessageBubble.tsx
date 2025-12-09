import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { formatTime } from '../../../../shared';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  content: string;
  answer: string;
  timestamp: string;
  isStreaming?: boolean; 
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  content,
  answer,
  timestamp,
  isStreaming = false, 
}) => {
  const [userCopied, setUserCopied] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);

  const handleCopyUser = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setUserCopied(true);
      setTimeout(() => setUserCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleCopyAI = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setAiCopied(true);
      setTimeout(() => setAiCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className={styles.messageGroup}>
      {/* Mensaje del usuario */}
      <div 
        className={styles.userMessageContainer}
        onMouseEnter={(e) => e.currentTarget.classList.add(styles.hovered)}
        onMouseLeave={(e) => e.currentTarget.classList.remove(styles.hovered)}
      >
        <div className={styles.userBubble}>
          <p className={styles.userText}>{content}</p>
        </div>
        <div className={styles.userActions}>
          <time className={styles.userTimestamp}>
            {formatTime(timestamp)}
          </time>
          <button
            className={styles.copyButton}
            onClick={handleCopyUser}
            aria-label="Copiar mensaje"
            title="Copiar mensaje"
          >
            {userCopied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Respuesta de la IA - SOLO si hay respuesta */}
      {answer && (
        <div 
          className={styles.aiMessageContainer}
          onMouseEnter={(e) => e.currentTarget.classList.add(styles.hovered)}
          onMouseLeave={(e) => e.currentTarget.classList.remove(styles.hovered)}
        >
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
                {/* cursor cuando está en streaming */}
                {isStreaming && <span className={styles.cursor}>▊</span>}
              </div>
            </div>

            {/* Timestamp y botón de copiar - solo si NO está en streaming */}
            {!isStreaming && (
              <div className={styles.aiActions}>
                <time className={styles.aiTimestamp}>
                  {formatTime(timestamp)}
                </time>
                <button
                  className={styles.copyButton}
                  onClick={handleCopyAI}
                  aria-label="Copiar respuesta"
                  title="Copiar respuesta"
                >
                  {aiCopied ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';