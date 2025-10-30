import React, { useEffect, useRef } from 'react';
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
  const messageListRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const prevStreamingRef = useRef(isStreaming);

  // SCROLL cuando cambia el número de mensajes
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;

      const scrollTimer = setTimeout(() => {
        if (messageListRef.current) {
          const container = messageListRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });

          setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth',
            });
          }, 100);
        }
      }, 300);

      return () => clearTimeout(scrollTimer);
    }
  }, [messages.length]);

  // SCROLL cuando INICIA el streaming (para ver el logo y animación)
  useEffect(() => {
    // Detectar cuando isStreaming cambia de false a true
    if (isStreaming && !prevStreamingRef.current) {
      prevStreamingRef.current = true;

      const scrollTimer = setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTo({
            top: messageListRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);

      return () => clearTimeout(scrollTimer);
    }

    if (!isStreaming) {
      prevStreamingRef.current = false;
    }
  }, [isStreaming]);

  // SCROLL durante el streaming (mientras escribe)
  useEffect(() => {
    if (isStreaming && streamingResponse && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [streamingResponse, isStreaming]);

  if (isLoading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" color="primary" />
        <p className={styles.loadingText}>Cargando mensajes...</p>
      </div>
    );
  }

  // Estado del último mensaje para controlar el indicador de escritura
  const lastMessage = messages[messages.length - 1];
  const lastHasAnswer = Boolean(lastMessage && lastMessage.answer);
  const hasPendingWithoutAnswer = Boolean(
    lastMessage && lastMessage.answer === ''
  );

  return (
    <div ref={messageListRef} className={styles.messageList}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.timestamp}-${index}`}
            content={message.content}
            answer={message.answer}
            timestamp={message.timestamp}
          />
        ))}

        {/* Mostrar indicador de escritura BAJO el último mensaje pendiente (solo dots) */}
        {isStreaming && hasPendingWithoutAnswer && (
          <div className={styles.streamingContainer}>
            <div className={styles.aiAvatar}>
              <img
                src="/images/logos/country-icono.png"
                alt="Country"
                width="24"
                height="24"
              />
            </div>

            <div className={styles.streamingContent}>
              <div className={styles.thinkingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Fallback: si hay streaming pero NO hay mensaje pendiente ni respuesta inline, usar contenedor global */}
        {isStreaming && !lastHasAnswer && !hasPendingWithoutAnswer && (
          <div className={styles.streamingContainer}>
            <div className={styles.aiAvatar}>
              <img
                src="/images/logos/country-icono.png"
                alt="Country"
                width="24"
                height="24"
              />
            </div>

            <div className={styles.streamingContent}>
              {streamingResponse ? (
                <div className={styles.markdownPlain}>
                  {streamingResponse}
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
      </div>
    </div>
  );
};
