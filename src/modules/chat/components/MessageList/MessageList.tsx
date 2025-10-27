import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat.types';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { Spinner } from '../../../../shared';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingResponse?: string;
  isStreaming?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  streamingResponse = '',
  isStreaming = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" color="primary" />
        <p className={styles.loadingText}>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className={styles.messageList}>
      <div className={styles.messagesContainer}>
        {/* Mensajes guardados */}
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.timestamp}-${index}`}
            content={message.content}
            answer={message.answer}
            timestamp={message.timestamp}
          />
        ))}

        {/* Mensaje en streaming (tiempo real) */}
        {isStreaming && (
          <div className={styles.streamingContainer}>
            {/* Avatar de la IA */}
            <div className={styles.aiAvatar}>
              <img
                src="/images/logos/country-icono.png"
                alt="Country"
                width="24"
                height="24"
              />
            </div>

            {/* Contenido del streaming con Markdown */}
            <div className={styles.streamingContent}>
              {streamingResponse ? (
                <div className={styles.markdown}>
                  <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                  <span className={styles.cursor}>▊</span>
                </div>
              ) : (
                <div className={styles.thinkingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};